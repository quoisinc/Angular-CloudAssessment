/* Grunt file prototype. Change to fit your app */
//Created by Sam Massaquoi, Jr for UST-Global Cloud Maturity Assessment
// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {
	
	//CDN url to prepend to whatever we need served that way
	var cdn = '//cdn.url.com/';
	
	// Load all grunt tasks
	require('load-grunt-tasks')(grunt);
	
	//Where all options and tasks are defined
	grunt.initConfig({
		//read the json file so we have access to that object
		pkg: grunt.file.readJSON('package.json'),
		
		//If your working files are somewhere other than the current directory
		base: { path: "./" },
		
		/*++++++++++++++++++++++++++++ Dealing with LESS/CSS +++++++++++++++++++++++++++++++++++++++++++++++++++*/
		//Takes all our .less files and compiles them into one CSS file
		less: {
			options: {
				paths: ['<%= base.path %>/assets/styles/']
			},
			src: {
				expand: true,     // Enable dynamic expansion.
				cwd: '<%= base.path %>/assets/styles/',      // Src matches are relative to this path.
				src: ["style.less"], // Files to match. If other less files are imported in style.less, you don't need to list those here. i.e. sprites.less
				dest: '<%= base.path %>/assets/styles/',   // Destination path prefix.
				ext: '.css',   // Dest filepaths will have this extension.
			}
		},
		//Add the necessary prefixes for things like moz- or webkit- 
		autoprefixer: {
			no_dest: {
				src: '<%= less.src.dest %>/*.css' // globbing is also possible here
			}
		},
		/*+++++++++++++++++++++++++++++++ End LESS/CSS Section +++++++++++++++++++++++++++++++++++++++++++++++*/
		
		/*++++++++++++++++++++++++++++++ Dealing with JavaScript +++++++++++++++++++++++++++++++++++++++++++++*/
		
		/*  Get dependencies and put them in the 'targetDir' folder.
			What to get is defined in the bower.json file
		*/		
		// bower: {
		// 	install: {
		// 		options: {
		// 			targetDir : 'components'
		// 			, cleanBowerDir : true
		// 			//,	verbose: true
		// 		}			
		// 	}
		// },
		
		uglify: {
		  options: {
			banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
			//,mangle: false
			compress: {
				drop_console: true
			},
			sourceMap: true
		  },
		  //Compress and mangle all components into one js file
		 //  components: {
			// files: {
			// 	'<%= base.path %>/public/app/components.min.js': 
			// 	[
			// 		'<%= bower.install.options.targetDir %>/{,*/}*.*'
			// 	]
			// }
		 //  },
		  //Compress and mangle all your custom JS files into one
		  dist: {
			files: {
				'public/src/app.min.js': 
				[
					'public/src/main.*',
					//'public/src/model/{,*/}*',
					'public/src/controllers/{,*/}*',
					'public/src/config/services.js'

				]
			}
		  }
		},
		/*+++++++++++++++++++++++++++++++ End JavaScript Section +++++++++++++++++++++++++++++++++++++++++++*/
		
		/*+++++++++++ Dealing with Revisions (file renaming and replacing sources) +++++++++++++++++++++++++*/
		
		filerev: {
			options: {
			  encoding: 'utf8',
			  algorithm: 'md5',
			  length: 8
			},
			sourcemaps: {        // Rename sourcemaps.
			  src: ['public/src/*.map']
			},
			assets: {            // Rename minified js/css.
				src: [
					'public/src/*.min.js',
					'public/assets/styles/*.css',
					'public/assets/img/{,*/}*.{png,jpg,jpeg,gif,webp}'
				]
			}
		},

		//Reference revisions in .map files
		userev: {
			options: {
			  hash: /(\.[a-f0-9]{8})\.[a-z]+$/,
			},
			// Link to sourcemaps in minified js/css.
			sourcemaps: {            
			  src: ['public/assets/styles/*.css', 'public/app/*.js', 'public/app/*.map'],
			  options: {
				patterns: {
				  'Linking versioned source maps': /sourceMappingURL=([a-z0-9.]*\.map)/
				}
			  }
			}
		},		
		// Replace all the file blocks in with one file, and use the revved version
		usemin: {
		  html: ['public/index.html'],
		  css: ['public/assets/styles/{,*/}*.css'],
		  options: {
			dirs: ['public', 'public/src']
		  }
		},
		/*+++++++++++++++++++++++++++++++ End Revision Section +++++++++++++++++++++++++++++++++++++++++++*/
		
		
		
		/*+++++++++++++++++++++++++++++++++++++++ Extra tasks ++++++++++++++++++++++++++++++++++++++++++++*/
		
		//Delete all the files in the public folder, before every new public
		clean: ["public/"],
		
		//Copy to public destination folder. Whatever is there will be all we need to run the app
		copy: { 			
			main: {
				files : [ {
					expand: true,
					cwd: './',
					src: ['assets/images/**', 'assets/styles/*.css','index.html', 'vendor/**'],
					dest: 'public/',
					filter: 'isFile'
					},
					{
						expand: true,
						cwd: './',
						src: 'app/**', 
						dest: 'public/src/',
						rename:function(dest, src){
							return dest + src.substring(src.indexOf('/'),src.length);
						},
						filter: 'isFile'
					}
				]
				
			}
		},
		//Replace certain URLs with CDN
		'string-replace': {
		  inline: {
			files: {
				'public/': ['public/*.html', 'public/**/*.js', 'public/**/*.css'] // include JS files in two diff dirs
			},
			options: {
			  replacements: [{
				pattern: 'app/config/',
				replacement: cdn+'/configs/'
			  }]
			}
		  }
		},
		
		connect: {

			options: {
		        port: 9000,
		        // change this to '0.0.0.0' to access the server from outside
		        hostname: 'localhost',
		        livereload: 35729
		    },
		    livereload: {
		        options: {
		          open: true,
		          base: 'public'
		        }
		    }
		},


		// Which directory/files to watch for changes, and then republic
		watch: {
			all: {
				
				files: [
					'<%= base.path %>/assets/**/*.*', 
					'<%= base.path %>/app/**/*.*', 
					'<%= base.path %>/*.html'
				],
				tasks: ['default'],
				options: {
					nospawn: true
				}
			}
		}		
	});
	
	
	//Tasks.
	
	//Stylesheet tasks
	grunt.registerTask('stylesheetTasks', [
		'less',
		'autoprefixer'
	]);
	
	//JavaScript concatenation & minification
	grunt.registerTask('javascriptTasks', [
		'uglify'
	]);
	
	grunt.registerTask( 'rev', [
	  'filerev:sourcemaps',  // Rename sourcemaps.
	  'userev:sourcemaps',   // Link to sourcemaps in minified js/css.
	 // 'filerev:assets',      // Rename minified js/css.
	  'usemin'				 // Replace all the file blocks in with one file, and use the revved version
	  
	  //'userev:index'        // Link to minified js/css in index html.	  
	  
	]);
	
	grunt.registerTask('serve', [
		'clean',			// Clean public folder before creating a new public
		'stylesheetTasks',	// Run tasks like compiling .less into .css and autoprefix
		'copy',				// Copy the whole dev folder into public folder
		'rev',				// Rename files with revision number to avoid caching
		//'string-replace',	// Replace certain assets with CDN sources
		'connect:livereload',// launches app on browser
		'watch:all'		// Watch files for changes and automatically rerun the build proces		
	]);
	//Run 'em all
	grunt.registerTask('default', [
		'clean',			// Clean public folder before creating a new public
		// 'bower',			// Get js dependencies 
		'stylesheetTasks',	// Run tasks like compiling .less into .css and autoprefix
		'copy',				// Copy the whole dev folder into public folder
		// 'javascriptTasks',	// Run javascript related tasks such as uglification
		'rev',				// Rename files with revision number to avoid caching
		'string-replace',	// Replace certain assets with CDN sources
		'watch:all'			// Watch files for changes and automatically rerun the build process
	]);
};
