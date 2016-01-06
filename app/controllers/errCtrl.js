(function() {
	angular.module('UST').controller('errCtrl', ['$scope', '$http','$location','userService',

		function($scope, $http, $location, userService) {
			//Remove body bg
			$('body').removeClass('body-init').addClass('body-error');

			$scope.callToAddToUserList = function(currObj) {
				userService.addUser(currObj)
			}

		}
	]);//Ends module
})();//Ends anonymous


