/**
 * Turbo Controller
 */
(function() {
    angular.module('UST').controller('reportingCtrl', ['$scope','$rootScope', '$http','$location','userService',
        function($scope, $rootScope, $http,$location,userService){
            var assessmentUrl ='src/model/report-app-assessment.json';
            var maturityUrl ='src/model/report-cloud-maturity.json';

            /*Tab menu init*/
            $(window).on("load", function(){
                $('.selectpicker').selectpicker();
            });

            //Navigation
            $scope.navigate =function(event){
                var elClass = $(event.currentTarget).attr('class');
                $location.url(elClass);//Redirect to assessment
            }

            //$http.get(assessmentUrl)
            $http.get(maturityUrl)
                .success(function (data, status, headers, config) {
                    var reportResult = data;
                    var reportType = reportResult.type;

                    switch (reportType) {
                        case "cloud maturity":
                            console.log('maturity data',data);
                            $('#report-quadrant').hide();
                            $scope.bi = data.bi;
                            $scope.biDetails = data.biDetails;
                            $scope.biScore =data.biScore;
                            //Radar collection
                            $scope.radar = reportResult.radar;
                            $scope.className = $scope.radar[0].className;
                            console.log("ClassName:",$scope.className);
                            //collection of axes
                            $scope.axes = $scope.radar.axes;

                            //Draw Radar Graph here
                            RadarChart.defaultConfig.levelTick = true;
                            RadarChart.draw(".chart-container", $scope.radar);
                            break;
                        case "app assessment":
                            console.log('assessment');
                            $('#report-graph').hide();
                            $scope.readiness = reportResult.readiness;
                            $scope.readinessScore = reportResult.readinessScore;
                            $scope.readinessDetails = reportResult.readinessDetails;
                            break;
                    }

                })
                .error(function (data, status, headers, config) {
                    $scope.errorMsg = "Oops! Sorry, please try again.";
                });

            //Load anomaly modal
            $scope.allAppModal = function(event){
                var elClass =event.currentTarget;
                //Launch modal and
                    $('#myModal').modal();
            }

            console.log("ROOT SCOPE USERNAME: "+$rootScope.globals.currentUser.username)
            //Get Users
            $scope.userFullName = userService.getUsers();
        }

    ]);//Ends module
})();//Ends anonymous
