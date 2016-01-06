'use strict';

angular.module('UST')

    .controller('userLoginCtrl',
    ['$scope', '$rootScope', '$location', 'AuthenticationService','userService',
        function ($scope, $rootScope, $location, AuthenticationService, userService) {
            // reset login status
            AuthenticationService.ClearCredentials();

            $scope.login = function () {
                //Default show error message when login fails with 401 or error
                $scope.dataLoading = false;
               // $scope.error = "Oops! Your login credentials are wrong.";

                AuthenticationService.Login($scope.username, $scope.password, function(response) {
                    var loginResult = response;
                    console.log("LOGIN RESULT; ",JSON.stringify(loginResult));

                    if(loginResult && loginResult != null){
                        //Give login
                        $scope.fullName = loginResult.fullName;

                       //Set global auth credential
                        AuthenticationService.SetCredentials($scope.username, $scope.password);

                        //Add to User service to persist throughout app
                        userService.addUser($scope.fullName);

                        //Redirect to assessment
                        $location.url('/assessmentdash');
                    }
                    else{
                        $scope.error = "Oops! Sorry, please try again.";
                        $scope.dataLoading = false;
                    }


                });
            };
        }]);
