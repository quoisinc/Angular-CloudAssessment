(function() {
    angular.module('UST').controller('operationsCtrl', ['$scope', '$http','$location','$sce','userService',

        function($scope, $http, $location,$sce, userService) {
            /*Tab menu init*/
            $('#tabs').tab();
            $("#tabs li a").click(function(e) {
                e.preventDefault();
            });

            /*Tab menu init*/
            $(window).on("load", function(){
                $('.selectpicker').selectpicker();
            });

            $scope.navigate =function(event){
                var elClass = $(event.currentTarget).attr('class');
                $location.url(elClass);//Redirect to assessment
            }

            $scope.toggleAccordion = function(event){
                var el = event.currentTarget;
                $(el).toggleClass('up');
                $(el).parent().parent().parent().find('div.content').slideToggle();
            }

            $scope.escapeChar =function(jsonString){
                return jsonString.replace(/\n/g, "\\n")
                    .replace(/\r/g, "\\r")
                    .replace(/\t/g, "\\t")
                    .replace(/\f/g, "\\f");
            }

            //Load anomaly modal
            $scope.opsModal = function(event){
                var elClass =$(event.currentTarget).attr('data-status');
                //Launch modal and call service only if anomaly
                if(elClass === 'Anomaly'){
                   // alert('load Anomaly Modal');
                    $http.get('src/model/operations-anomalies.json')
                        .success(function (data, status, headers, config) {
                            var anomalyResult = data;
                            var anomalies = anomalyResult.anomalies;
                            $scope.anomalies = anomalies;
                            console.log("ANOMALIES",data.anomalies)
                        });



                    //launch the modal
                    $('#myModal').modal();

                }else{
                    event.preventDefault();
                }

            }

            $scope.toggleLog= function(event){
                $http.get('src/model/operations-log.json')
                    .success(function (data, status, headers, config) {
                        var logsResult = data;
                        var logs = logsResult.Response;
                        $scope.logs = logs.logs.replace(/\n/g,"<br/><br/>");
                        console.log("LOGS",$scope.logs);
                    });

            }

            var opsURL = 'src/model/operations-instances.json'; // will use node fake server with mocked data
            var opsResponse = $http.get(opsURL);
            opsResponse.success(function (data, status, headers, config) {
                var opsResult = data; //json of assessment
                console.log("OPS RESULT: ",JSON.stringify(opsResult));
                var ops = opsResult.Response;
                //ops instance collection
                $scope.ops = ops;
                var opsCompute = ops.compute;
                //ops compute
                $scope.opsCompute =opsCompute;
                console.log("opsCompute",opsCompute);


            });
            opsResponse.error(function (data, status, headers, config) {
                $scope.errorMsg = "Oops! Sorry, please try again.";
            });

            console.log("USERS OPERATION: ",userService.getUsers())

            //Get Users
            $scope.userFullName = userService.getUsers();

        }

    ]).filter('to_trusted', ['$sce', function($sce){
            return function(text) {
                return $sce.trustAsHtml(text);
            };
        }]

    );

    //Ends module
})();//Ends anonymous
