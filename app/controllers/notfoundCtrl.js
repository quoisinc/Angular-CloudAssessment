(function() {
	angular.module('UST').controller('notfoundCtrl', ['$scope', '$http','$location','userService',

		function($scope, $http, $location, userService) {
			//Remove body bg
			$('body').removeClass('body-init').addClass('body-404');
			
			$scope.callToAddToUserList = function(currObj) {
				userService.addUser(currObj)
			}

		}
	]);//Ends module
})();//Ends anonymous


