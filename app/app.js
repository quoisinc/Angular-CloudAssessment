/***-----------------------------
* Main App JS for application
------------------------------***/

(function() {
	var UST = angular.module('UST', [
		'ngRoute',
		'ngCookies'

	]);

	UST.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.
				when('/', {
					templateUrl: 'src/partials/userLogin.html',
					controller: 'userLoginCtrl'
				})
				.when('/assessment', {
					templateUrl: 'src/partials/assessment.html',
					controller:'assessmentCtrl'
				})
				.when('/assessmentdash', {
					templateUrl: 'src/partials/assessmentdash.html',
					controller:'assessmentCtrl'
				})
				.when('/assessmentstart', {
					templateUrl: 'src/partials/assessmentstart.html',
					controller:'assessmentCtrl'
				})
				.when('/assessmentlist', {
					templateUrl: 'src/partials/assessmentlist.html',
					controller:'assessmentCtrl'
				})
				.when('/turbo',{
					templateUrl:'src/partials/turbo.html',
					controller:'turboCtrl'
				})
				.when('/security',{
					templateUrl:'src/partials/security.html',
					controller:'securityCtrl'
				})
				.when('/operations',{
					templateUrl:'src/partials/operations.html',
					controller:'operationsCtrl'
				})
				.when('/reporting',{
					templateUrl:'src/partials/reporting.html',
					controller:'reportingCtrl'
				})
				.when('/404', {
					templateUrl: 'src/partials/notFound.html',
					controller:'notfoundCtrl'
				})
				.when('/500', {
					templateUrl: 'src/partials/error.html',
					controller:'errCtrl'
				})
				.when('/error', {
					templateUrl: 'src/partials/error.html',
					controller:'errCtrl'
				})
				.otherwise({
					redirectTo: '/'
				});
		}
	]);

	UST.factory('httpErrorResponseInterceptor', ['$q', '$location',
		function($q, $location) {
			return {
				response: function(responseData) {
					return responseData;
				},
				responseError: function error(response) {
					switch (response.status) {
						case 401:
						$location.path('/');
							break;
						case 404:
							$location.path('/404');
							break;
						case 500:
							$location.path('/500');
							break;
						default:
							$location.path('/error');
					}

					return $q.reject(response);
				}
			};
		}
	]);

	//Http Interceptor to check auth failures for xhr requests
	UST.config(['$httpProvider',
		function($httpProvider) {
			$httpProvider.interceptors.push('httpErrorResponseInterceptor');
		}

	]);

	UST.run(['$rootScope', '$location', '$cookieStore', '$http',
		function ($rootScope, $location, $cookieStore, $http) {
			// keep user logged in after page refresh
			$rootScope.globals = $cookieStore.get('globals') || {};
			if ($rootScope.globals.currentUser) {
				$http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
			}

			$rootScope.$on('$locationChangeStart', function (event, next, current) {
				// redirect to login page if not logged in
				if ($location.path() !== '/' && !$rootScope.globals.currentUser) {
					$location.path('/');
				}
			});
		}]);

})();
