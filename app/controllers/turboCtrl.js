/**
 * Turbo Controller
 */
(function() {
    angular.module('UST').controller('turboCtrl', ['$scope', '$rootScope', '$http','$location','userService',
        function($scope, $rootScope, $http,$location, userService) {
            var baseUrl = $rootScope.globals.baseUrl;

            /*Tab menu init*/
            $(window).on("load", function(){
               // $('#tabs0,#tabs1,#tabs2,#apptabs0,#apptabs1,#apptabs2').tab();
                $("[id$='tabs'],[id$='apptabs']").tab();
                $('.selectpicker').selectpicker();
            });
            //Note for event bubbling and delegation as tab is loaded dynamically
            $('body').on('click',".provisions-tab,.appprovisions-tab,.viewdetails,.app-viewdetails",function(e){
                e.preventDefault();

            })

            //Navigation
            $scope.navigate =function(event){
                var elClass = $(event.currentTarget).attr('class');
                $location.url(elClass);//Redirect to assessment
            }


            $scope.toggleAccordion = function(event){
                //  $scope.visible = false;
                //  $scope.visible = !$scope.visible;
                var el = event.currentTarget;
                $(el).toggleClass('up');
                $(el).parent().parent().parent().find('div.content-accordion').slideToggle();
            }

            $scope.toggleInstances = function(event){
                var el = event.currentTarget;
                $(el).toggleClass('up');
                var wrapper =  $(el).parent().parent().find('div.tab-wrap');
                $(wrapper).slideToggle();
            }

            $scope.showDescription = function(event){
                var elIndex = $(event.currentTarget).attr('data-index');
                var dataName = $(event.currentTarget).attr('data-name');
                var el = event.currentTarget;
                $('.'+dataName+elIndex).css('display','block').siblings('div').css('display','none');
                //$('#appdescription'+elIndex).css('display','block').siblings('div').css('display','none');
            }

           /*----------------- "RUN", "STOP", "DEPROVISION" CONTROLS FOR APPLICATION INSTANCES----------------*/

            $scope.runTurboOps = function(event){
                var el = event.currentTarget;
                var elStatus = $(event.currentTarget).attr('data-status');
                var appId = $(event.currentTarget).attr('data-id');
                var appName = $(event.currentTarget).attr('data-name');
                switch (elStatus) {
                    case "start":
                        var elRequest ={"status":elStatus};
                        $(el).html('Starting...');
                        $http.put(baseUrl+'/asi/devops/apps/'+appId+'/start',elRequest)
                            .success(function(data, status, headers, config){

                                //Remove any glow effect on stop action
                                $('.stop.btn').removeClass('glow-red');

                                //In running state and add glow effect
                                $(el).html('Running').addClass('glow-green');
                            })
                            .error(function(data, status, headers, config){

                               //Error and failed so no need for glow effect
                                $(el).html('Start').removeAttr('glow-green');
                            });
                        break;
                    case "stop":
                        var elRequest = {"status":elStatus};
                        $http.put(baseUrl+'/asi/devops/apps/'+appId+'/stop',elRequest)
                            .success(function(data, status, headers, config){

                               //Reset 'Start' button if running
                                $('.btn.green').html('Start').removeClass('glow-green');
                                $(el).addClass('glow-red');
                            })
                            .error(function(data, status, headers, config){
                              console.log("STOPPED");
                            });
                        break;
                    case "deprovision":
                        var elRequest = {"status":elStatus};
                        var appName = appName;

                        bootbox.confirm({
                            message: 'Do you want to proceed with de-provisioning '+appName+ '?',
                            callback: function(result) {
                                if(result){
                                    $http.put(baseUrl+'/asi/devops/apps/'+appId+'/deprovision',elRequest)
                                        .success(function(data, status, headers, config){
                                            var msg = appName+' has been de-provisioned';
                                            bootbox.dialog({
                                                title: "Success!",
                                                message: '<br/>' +
                                                '<span style="color:green;font-weight:bold">'+msg+'</span>'
                                            })
                                        })
                                        .error(function(data, status, headers, config){
                                            var msg = appName+' stop failed – User does not have authorization to de-provision applications in Production';
                                            bootbox.dialog({
                                                title: "Sorry!",
                                                message: '<br/> ' +
                                                '<span style="color:#cc0000;font-weight:bold"><img src="../../assets/images/error.png" />'+ msg +'</span>'
                                            });
                                        });
                                    }
                                }

                        });


                        break;
                }
            }


            /*----------CREATE BLUEPRINT INSTANCE--------------*/

            $scope.createBlueprintInstance = function(event){
                var originalAppName = $(event.currentTarget).attr('data-originalAppName');
                var selName = $(event.currentTarget).parent().parent().find('.form-inline input.txt');
                var blueprintId = $(event.currentTarget).attr('data-id');
                var appName =$(selName).val();
                var appDescription = $(event.currentTarget).attr('data-description');
                var selDeployment = $(event.currentTarget).parent().parent().find('.form-inline select.txt option:selected');
                var appDeployment= $(selDeployment).val();
                var turboInstanceReq = {
                       "name": appName,
                    "appDeployment":appDeployment,
                    "description":appDescription,
                    "createdBy":$rootScope.globals.currentUser.username
                   }

                console.log("REQUEST: ",turboInstanceReq);
                // http://prodcs.cloudapp.net:9000/jdsurvey-rest/asi/devops/apps/

                //Provision & Create the Blueprint Instance
                $http.post(baseUrl+'/jdsurvey-rest/asi/devops/apps/'+originalAppName,turboInstanceReq)
                    .success(function (data, status, headers, config) {

                        var msg = appName+' has been provisioned';
                        bootbox.dialog({
                            title: "Success!",
                            message: '<br/>' +
                            '<span style="color:green;font-weight:bold">'+msg+'</span>'
                        })

                    })
                    .error(function (data, status, headers, config) {
                        var msg = 'Application provisioning failed - User is not authorized to provision in '+appDeployment;
                        bootbox.dialog({
                            title: "Warning!",
                            message: '<br/>' +
                            '<span style="color:red;font-weight:bold">'+msg+'</span>'
                        })
                    });

            }


           /*---------LIST ALL BLUEPRINT INSTANCES----------*/

            $http.get(baseUrl+'/asi/devops/appblueprints')
                .success(function (data, status, headers, config) {
                    var turboResult = data;
                    var turboInstances = turboResult;
                    $scope.turboInstances = turboInstances;
                    $scope.connections = $scope.turboInstances.connections;
                    $scope.tiers = $scope.turboInstances.tiers;
                    console.log("BLUEPRINT INSTANCES",$scope.turboInstances);
                })
                .error(function (data, status, headers, config) {
                    $scope.errorMsg = "Oops! Sorry, please try again.";
                });

            /*-------LIST ALL APPLICATION INSTANCES----------*/

            var myconfig = {
                headers:  {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    "Access-Control-Allow-Headers": "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With",
                    'Access-Control-Allow-Methods': 'GET, PUT, POST'
                }
            };

            $http.get(baseUrl+'/asi/devops/apps/subscr/b06511c2-239e-4300-8c74-569442fd489e',myconfig)
                .success(function (data, status, headers, config) {
                    var allturboResult = data;
                    var allturboInstances = allturboResult;
                    $scope.allturboInstances = allturboInstances;
                    $scope.allconnections = $scope.allturboInstances.connections;
                    $scope.alltiers = $scope.allturboInstances.tiers;
                    console.log("ALLTURBO INSTANCES",$scope.allturboInstances);

                })
                .error(function (data, status, headers, config) {
                    $scope.errorMsg = "Oops! Sorry, please try again.";
                });


            console.log("USERS TURBO: ",userService.getUsers())
            console.log("ROOT SCOPE USERNAME: "+$rootScope.globals.currentUser.username)
            //Get Users
            $scope.userFullName = userService.getUsers();
        }
    ]);//Ends module
})();//Ends anonymous



