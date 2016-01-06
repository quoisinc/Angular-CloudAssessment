/**
 * Assessment Controller
 */

(function() {
    angular.module('UST').controller('assessmentCtrl', ['$rootScope','$scope', '$http','$location','$sce','$filter','userService',
        function($rootScope, $scope, $http, $location, $sce, $filter, userService) {
            var baseUrl = $rootScope.globals.baseUrl;

            //Angular filter OrderBy
            $rootScope.orderBy = $filter('orderBy');

            /*Tab menu init*/
            $scope.navigate =function(event){
                var elClass = $(event.currentTarget).attr('class');
                $location.url(elClass);//Redirect to page
            }

            $('body').on('click',".assessment-options",function(e){
                var el = e.currentTarget;
                var parent, parentId;
                var responses = [];
                parent = $(el).parent();
                parentId = $(parent).attr('data-id');
                $(el).addClass('blue-bg').siblings('div').removeClass('blue-bg');

            })

            /*----------------------------------------------------------------*/
            /*      ASSESSMENT DASHBOARD & ASSESSMENT START SECTION          */
            /*--------------------------------------------------------------*/

            $http.get(baseUrl+'/asi/cmm/assessment/')
                .success(function(data,status,headers,config){
                    var assesssmentResult = data;
                    console.log("ASSESSMENT RESULT",assesssmentResult);

                    //Result
                    $scope.assesssmentMigrationResult = assesssmentResult[0];
                    $scope.assesssmentCloudResult = assesssmentResult[1];

                    //Name
                    $scope.assessmentMigrationName = assesssmentResult[0].name;
                    $scope.assessmentCloudName = assesssmentResult[1].name;

                    //Desc
                    $scope.assessmentMigrationDesc = assesssmentResult[0].desc;
                    $scope.assessmentCloudDesc = assesssmentResult[1].desc;

                    //Id
                    $scope.assessmentMigrationId = assesssmentResult[0].id;
                    $scope.assessmentCloudId = assesssmentResult[1].id;

                    //Global scope
                    $rootScope.assMigrationId = assesssmentResult[0].id;
                    $rootScope.assCloudId = assesssmentResult[1].id;
                });

            $scope.navigateAssessment=function(event){
                var el = event.currentTarget;
                var elInfo = $(event.currentTarget).attr('data-info');

                switch (elInfo) {
                    case "start":
                        //Start Assessment
                        $location.url('/assessmentstart');
                        break;
                    case "review":
                        //list of complete assessment
                        $scope.showCompletedAssessment(event);
                        break;
                    case "consolidate":
                        //consolidated report
                        $location.url('/reporting');
                        break;
                }
            }

            $scope.showCompletedAssessment = function(event){
                var assessmentType = $(event.currentTarget).attr('data-id');
                var assessmentCompletedRequest = {
                    "createdBy": $rootScope.globals.currentUser.username
                }

                if (assessmentType === 'application') {
                    if ($rootScope.assMigrationId !== null && $rootScope.assMigrationId !== undefined) {

                        // GET url
                        $scope.loading = true;
                        var assessmentCompletedGetUrl = baseUrl + '/asi/cmm/assessment/' + $rootScope.assMigrationId + '/instance/';
                        var assessmentCompletedResponse = $http.get(assessmentCompletedGetUrl, assessmentCompletedRequest);

                        //On Successful GET
                        assessmentCompletedResponse.success(function (data, status, headers, config) {
                            $scope.loading = false;
                            $rootScope.assessmentCompletedResult = data; //could be json of assessment
                            $rootScope.assessmentCompletedDate = moment(data.createdOn).format('MM/DD/YYYY');
                            $rootScope.assessmentType = "Application Migration";
                            $location.url('/assessmentlist');

                        });
                    } else {
                        alert("You need to create an assessment first! Please try again!")
                    }

                }else if(assessmentType === 'cloud'){
                      if ($rootScope.assCloudId !== null && $rootScope.assCloudId !== undefined){
                         // GET url
                          $scope.loading = true;
                         var assessmentCompletedGetUrl = baseUrl + '/asi/cmm/assessment/' + $rootScope.assCloudId + '/instance/';
                         var assessmentCompletedResponse = $http.get(assessmentCompletedGetUrl, assessmentCompletedRequest);

                         //On Successful GET
                          assessmentCompletedResponse.success(function(data,status,headers,config){
                              $scope.loading = true;
                              $rootScope.assessmentCompletedResult = data;
                              $rootScope.assessmentCompletedDate = moment(data.createdOn).format('MM/DD/YYYY');
                              $rootScope.assessmentType = "Cloud Maturity";
                              $location.url('/assessmentlist');
                          });

                      }else alert("You need to create an assessment first! Please  try again!")

                }

            }

            //Sorting OrderBy Angular function
            $rootScope.order = function(predicate, reverse){
                $rootScope.assessmentCompletedResult = $rootScope.orderBy($rootScope.assessmentCompletedResult,predicate, reverse);
            }

           // $rootScope.order($rootScope.assessmentCompletedDate,true);

            $scope.showMigration = function(event){
                  $(event.currentTarget).css({  'background-color': '#4797C8', 'color': '#fff','font-weight':'bold'});
                $('#assessmentCloud').css({  'background-color': '#fff', 'color': '#4797C8'});
                $('#assessmentDetails .migration').show();
                $('#assessmentDetails .cloud').hide();
                $('#startAssessment').attr('data-id', $scope.assessmentMigrationId);
            }

            $scope.showCloud = function(event){
                $(event.currentTarget).css({  'background-color': '#4797C8', 'color': '#fff','padding':'11px','font-weight':'bold'});
                $('#assessmentMigration').css({  'background-color': '#fff', 'color': '#4797C8','border':'1px solid #4797c8','padding':'11px 0'});
                $('#assessmentDetails .migration').hide();
                $('#assessmentDetails .cloud').show();
                $('#startAssessment').attr('data-id', $scope.assessmentCloudId)
            }

            $scope.startAssessment=function(event){
                if($('#assessmentName').val() !== "" && $('#assessmentName').val() !== undefined){
                    var assId = $(event.currentTarget).attr('data-id');
                    var assName = $('#assessmentName').val();
                    var assessmentPostBody =
                    {
                        "id": assId,
                        "name": assName,
                        "createdBy": $rootScope.globals.currentUser.username
                    }

                    var assessmentPostUrl = baseUrl+'/asi/cmm/assessment';
                    var assessmentPostResponse = $http.post(assessmentPostUrl, assessmentPostBody);

                    assessmentPostResponse.success(function (data, status, headers, config) {
                        var assessmentPostResult = data;

                        //Assessment result
                        $rootScope.assessmentPostresult = assessmentPostResult;

                        //Assessment topics
                        $rootScope.assessmentTopics = assessmentPostResult.topics;
                        //console.log(JSON.stringify(assessmentPostResult));

                        //Assessment ID
                        $rootScope.assessmentId = assessmentPostResult.assessmentID;

                        //Assessment Instance Id
                        $rootScope.assessmentInstanceId = assessmentPostResult.id;

                        //Assessment state
                        $rootScope.assessmentState = assessmentPostResult.state;


                        if(assessmentPostResult && assessmentPostResult != null){
                            $location.url('/assessment');//go to assessment page

                            // console.log("ROOT ASSESSMENT TOPICS ",$rootScope.assessmentTopics);
                            console.log("LENGTH ROOT ASSESSMENT TOPICS ",$rootScope.assessmentTopics.length);

                        }
                        else {
                            $scope.errorMsgPost = "Oops! Server Not Ready! Please try again.";
                        }

                    });

                }else{
                    var msg = 'Please enter an assessment name!';
                    bootbox.dialog({
                        title: "Warning!",
                        message: '<br/>' +
                        '<span style="color:red;font-weight:bold">'+msg+'</span>'
                    })
                }
            }



            /*----------------------------------------------------------------*/
            /*     ASSESSMENT TOPIC QUESTIONS & ANSWERS SECTION               */
            /*--------------------------------------------------------------- */
            //$rootScope.assessmentCounter, $rootScope.assessmentItems, $rootScope.assessmentCurrent, $rootScope.assessmentAmount = null;

            $rootScope.assessmentCounter = 0;

            $scope.navigateTopics = function(num){

                var topicslength = $rootScope.assessmentTopics.length;

                //All of the current list of questions/answers
                var assessmentAnswers = $('div.show .assessmentUl li');

                //length of li's
                var answersLength = $(assessmentAnswers).length;

                //Check to see if every answer is selected else don't page to next
                var selectedAnswersLength = $('.show .answers div.blue-bg').length;


                 if(selectedAnswersLength < answersLength){

                     alert("PLEASE ANSWER EVERY QUESTION IN ASSESSMENT");

                 }else{

                     //Selected answers
                     var divAssessmentOptions = $('.answers div.blue-bg');
                     var assessmentQandA = [];

                     $.each(divAssessmentOptions , function(i, value){
                         //Topic
                         var StrAnswerValueOption = $(this).attr('data-option');
                         $rootScope.assessmentTitle = $(this).parent().attr('data-topictitle');
                         $rootScope.assessmentVersion = $(this).parent().attr('data-topicversion');
                         $rootScope.assessmentOrder = $(this).parent().attr('data-topicorder');
                         $rootScope.assessmentTopicId = $(this).parent().attr('data-topicid');

                         //Question And Answer
                         var qaid = $(this).parent().attr('data-qaid');
                         var questionid = $(this).parent().attr('data-questionid');
                         var qaversion = $(this).parent().attr('data-qaversion');
                         var qaorder = $(this).parent().attr('data-qaorder');

                         var qaquestion = {"id":questionid}

                         //Build Q & A array object
                         assessmentQandA.push(
                             {
                             "id": qaid,
                             "version": qaversion,
                             "order": qaorder,
                             "question": qaquestion,
                             "strAnswerValue": StrAnswerValueOption
                             }
                         );//Ends push

                     });//Ends .each

                     //PUT body
                     $rootScope.topicPutBody = {
                     "id": $rootScope.assessmentTopicId,
                     "version": $rootScope.assessmentVersion,
                     "order": $rootScope.assessmentOrder,
                     "title": $rootScope.assessmentTitle,
                     "questionAndAnswers": assessmentQandA
                     }


                    //Now GET all the assessment topics
                     var assessmentItems = $('div.topic-wrap');
                     var assessmentCurrent = $('.topic-wrap.show')
                     var assessmentAmount =  assessmentItems.length;

                     //Get all of the controls
                     var controlItems = $('div.indicator div');
                     var controlCurrent = $('div.indicator .on');

                     //Traverse through list and show next topics
                     $(assessmentCurrent).removeClass('show').addClass('hide');

                     //controls traverse
                     $(controlCurrent).removeClass('on').addClass('off');

                     //Calculate new counter position
                     $rootScope.assessmentCounter = $rootScope.assessmentCounter + num;

                     //handle Previous - if the previous one was chosen and the counter is less than 0
                     // make the counter the last element,thus looping the carousel
                     if(num === -1 ){
                         console.log("COUNTER: "+$rootScope.assessmentCounter)
                         if($rootScope.assessmentCounter === 0){

                             $('.nav-left').removeClass('hide');
                             $('.nav-left-control').addClass('hide');

                             //Set the new current
                             assessmentCurrent = assessmentItems[0];
                             $(assessmentCurrent).addClass('show').removeClass('hide');

                             //Set the controls current
                             controlCurrent = controlItems[0];
                             $(controlCurrent).addClass('on').removeClass('off');


                             return false;
                         }

                     }

                     //Handle Next - if the next button was clicked and there
                     if(num === 1 ){
                         console.log("COUNTER: "+$rootScope.assessmentCounter)

                         //Show opacity of prev button
                         $('.nav-left').addClass('hide');
                         $('.nav-left-control').removeClass('hide');

                         //SCENARIO I - DO a PUT for every assessment if not at end

                         //PUT url
                         //var topicPutUrl = baseUrl+'/asi/cmm/assessment/'+$rootScope.assessmentId+'/instance/'+$rootScope.assessmentInstanceId+'/topic/'+ $rootScope.assessmentTopicId;
                         var topicPutUrl = baseUrl+'/asi/cmm/assessment/'+$rootScope.assessmentId+'/instance/'+$rootScope.assessmentInstanceId+'/topic/'+ $rootScope.assessmentOrder;


                         console.log("PUT BODY:",$rootScope.topicPutBody)

                         var topicPutResponse = $http.put(topicPutUrl,$rootScope.topicPutBody);


                         //On Successful POST
                         topicPutResponse.success(function (data, status, headers, config) {
                             var topicPutResult = data; //could be json of assessment
                             //console.log(JSON.stringify(topicPostResult));
                         });

                         //SCENARIO II - If there is no items/elements and looped at end of topics, set the counter to 0 if want circular carousel
                         if(!assessmentItems[$rootScope.assessmentCounter]){
                             //$rootScope.assessmentCounter = 0;

                             // POST url
                             var topicPostUrl = baseUrl+'/asi/cmm/assessment/'+$rootScope.assessmentId+'/instance/'+$rootScope.assessmentInstanceId;

                             //do a post at the end of topics
                             var topicPostResponse = $http.post(topicPostUrl);

                             //On Successful POST
                             topicPostResponse.success(function (data, status, headers, config) {
                                var topicPostResult = data; //could be json of assessment
                                //console.log(JSON.stringify(topicPostResult));

                                 //If successful & result
                                // if(topicPostResult && topicPostResult != null){
                                     $location.url('/reporting');
                                // }
                                // else{
                                   //  $rootScope.errorMsgPost = "Oops! Server Not Ready! Please try again.";
                                    // alert($rootScope.errorMsgPost);
                                 //}
                             });

                            // alert('Horray! at end of topics');
                             return false;
                         }

                     }

                     //Set the new current
                     assessmentCurrent = assessmentItems[$rootScope.assessmentCounter];
                     $(assessmentCurrent).addClass('show').removeClass('hide');

                     //Set the new control current
                     controlCurrent = controlItems[$rootScope.assessmentCounter];
                     $(controlCurrent).addClass('on').removeClass('off');

                 }

            }

            //Load report modal
            $scope.assessmentreportModal = function(event){
                var elClass =event.currentTarget;
                //Launch modal and
                $('#myModal').modal();
            }


            console.log("USERS: ",userService.getUsers())

            //Get Users
            $scope.userFullName = userService.getUsers();

        }

    ]).filter('to_trusted', ['$sce', function($sce){
              return function(text) {
                  return $sce.trustAsHtml(text);
              };
          }]

    ).filter('moment', function() {
            return function(dateString, format) {
                return moment(dateString).format(format);
            };
        }); //ends module

})();




