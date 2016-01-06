/**
 * Security Controller
 */

(function() {
    angular.module('UST').controller('securityCtrl', ['$scope', '$http','$location','userService',
        function($scope, $http,$location, userService) {

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
                $location.url(elClass);
            }

            /****----------------------------------------------------
             GET PROVIDER SECURITY
             ----------------------------------------------------***/

            var providerURL = 'src/model/security-provider.json'; // will use node fake server with mocked data
            var providerResponse = $http.get(providerURL);
            providerResponse.success(function (data, status, headers, config) {
                var providerResult = data; //json of assessment
                console.log("PROVIDER RESULT: ",JSON.stringify(providerResult));
                var provider = providerResult.Response;
                console.log("provider",provider);

                //Category
                $scope.provider = provider;
            });
            providerResponse.error(function (data, status, headers, config) {
                $scope.errorMsg = "Oops! Sorry, please try again.";
            });


            /****----------------------------------------------------
             GET OPERATING SYSTEM SECURITY INSTANCES
             ----------------------------------------------------***/

            var operatingURL = 'src/model/security-compute-instances.json';
            var operatingResponse = $http.get(operatingURL);
            operatingResponse.success(function(data,status,headers,config){
                var operatingResult = data;
                var operatingInstances = operatingResult.Response;
                console.log("OPERATING INSTANCES",operatingInstances);
                $scope.operatingInstances = operatingInstances;
            });


            /****----------------------------------------------------
             GET OPERATING SYSTEM INSTANCE DETAILS ON TOGGLE (do once)
             -----------------------------------------------------***/

            $scope.toggleOperating =function(event){
                var el = event.currentTarget;
                if($(el).attr('data-clicked')=='false'){
                    $http.get('src/model/security-compute-instance-detail.json')
                        .success(function(data,status,headers,config){
                            var computeDetailsResult = data;
                            var operatingDetails = computeDetailsResult.Response;
                            console.log("OPERATING DETAIL INSTANCES",operatingDetails);
                            $scope.operatingDetails = operatingDetails;
                        });
                    $(el).attr('data-clicked','true')
                }
                $(el).parent().siblings('div.operatingDetails').slideToggle();
                $(el).toggleClass('up');
            }


            /****----------------------------------------------------
             GET SSL SECURITY INSTANCES
             ----------------------------------------------------***/
            var sslURL = 'src/model/security-ssl-webservers.json';
            var sslResponse = $http.get(sslURL);
            sslResponse.success(function(data,status,headers,config){
                var sslResult = data;
                var sslInstances = sslResult.Response;
                console.log("SSL SECURITY INSTANCES",sslInstances);
                $scope.sslInstances = sslInstances;
            });

            /****----------------------------------------------------
             GET SSL SECURITY INSTANCE DETAIL & MODAL
             ----------------------------------------------------***/

            $scope.toggleSSL = function(event){
                var el = event.currentTarget;
                var serverId =$(event.currentTarget).attr('data-serverId');
                var serverName =$(event.currentTarget).attr('data-serverName');
                $(el).parent().siblings('div.sslDetails').slideToggle();
                $(el).toggleClass('up');

                if($(el).attr('data-clicked')=='false') {
                    //Fetch the ssl detail and load - We will use the id as param to fetch as per API
                    //var sslDetailURL = 'src/model/security-ssl-webserver-detail.json';
                    var sslDetailURL = 'src/model/web-serverid-'+serverId+'.json';
                    var sslDetailResponse = $http.get(sslDetailURL);
                    sslDetailResponse.success(function (data, status, headers, config) {
                        var sslDetailResult = data;
                        var sslDetailInstances = sslDetailResult.Response;
                        //Collection
                        $scope.sslDetailInstances = sslDetailInstances;
                        //server name
                        $scope.serverName =serverName;
                        //Grade
                        $scope.grade = $scope.sslDetailInstances.grade;
                        //Banner
                        $scope.banners = sslDetailInstances.banner;
                        //Scale
                        $scope.scales = sslDetailInstances.scale;

                        //authentication
                        $scope.authentications = sslDetailInstances.authentication;
                        //label
                        $scope.authLabel = $scope.authentications.label;
                        //Keycert Name
                        $scope.keycertName = $scope.authentications.keycert.name;
                        //Array of Info
                        $scope.infos = $scope.authentications.keycert.info;

                        //additional
                        $scope.additional = $scope.authentications.additional;
                        //Name
                        $scope.addName = $scope.additional.name;
                        $scope.addInfos = $scope.additional.info;
                        $scope.addCerts = $scope.additional.certs;
                        $scope.addCertInfos = $scope.addCerts[0].info;

                        //Certpaths
                        $scope.certpaths =$scope.authentications.certpaths;
                        $scope.certpathName =$scope.certpaths.name;
                        $scope.certpathInfos =$scope.certpaths.paths;//[0];

                        $scope.certpathinfoName =$scope.certpathInfos.name;
                        console.log("CERTPATHINFO: ", $scope.certpathinfoName)

                        //configuration
                        $scope.configurations = sslDetailInstances.configuration;
                        //config label
                        $scope.configLabel = $scope.configurations.label;
                        //config protocol
                        $scope.configProtocol =$scope.configurations.protocols;
                        //config protocol label
                        $scope.configProtocolLabel = $scope.configProtocol.label;
                        //config protocol info collection
                        $scope.configProtocolInfo =$scope.configProtocol.info;
                        //config cyphers
                        $scope.configCiphers = $scope.configurations.ciphers;
                        //config cyphers label
                        $scope.configCiphersLabel = $scope.configCiphers.label;
                        //config ciphers info collection
                        $scope.configCiphersInfo = $scope.configCiphers.info;
                        //configuration details
                        $scope.configDetails = $scope.configurations.details;
                        //config details label
                        $scope.configDetailslabel = $scope.configDetails.label;
                        //config details info collection
                        $scope.configDetailsInfo = $scope.configDetails.info;
                        //config miscellaneous
                        $scope.configMisc =$scope.configurations.misc;
                        //config misc label
                        $scope.configMiscLabel =$scope.configMisc.label;
                        //config misc info collection
                        $scope.configMiscInfo = $scope.configMisc.info;

                        //server Name
                       // $scope.sslServerName = $scope.sslInstances[0].name;

                        //Modal for ssl instance detail
                        $scope.sslModal = function (event) {
                            //launch the modal
                            $('#myModal').modal();
                        }

                        $(el).attr('data-clicked','true')
                    });
                }

            };

            //utility Toggle
            $scope.toggle = function(event){
                var el = event.currentTarget;
                $(el).parent().siblings('div.description').slideToggle();
                $(el).toggleClass('up');
            }

            console.log("USERS SECURITY: ",userService.getUsers())

            //Get Users
            $scope.userFullName = userService.getUsers();
        }
    ]);//Ends module


})();


