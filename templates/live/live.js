angular.module('Letu.liveControllers', [])

.controller('LiveListCtrl',
    ['$rootScope','$scope','$state','postService','Storage','weiXinService','$ionicModal','Auth','$ionicPopup','moment','User','Tools',

        function($rootScope,$scope,$state,postService,Storage,weiXinService,$ionicModal,Auth,$ionicPopup,moment,User,Tools){

            var _url_scoreList = '/match/scoreList'
            postService.doPost({},_url_scoreList,function(data){

                $scope.scores = data.data;

            })

        }
    ]
)
.controller('LiveCtrl',
    ['$rootScope','$scope',
        function($rootScope,$scope) {

        }
    ]
)
.controller('LiveDetailCtrl',
    ['$rootScope','$scope','$stateParams','postService','weiXinService','$ionicLoading',
        function($rootScope,$scope,$stateParams,postService,weiXinService,$ionicLoading) {

            //$ionicLoading.show();

            var _params = {

                tourney_id:$stateParams.tourney_id
            };

            var _url = '/match/scoreDetail';

            postService.doPost(_params,_url,function(data){

                $rootScope.score = data.data;

                weiXinService.onMenuShareAppMessage($rootScope.score.name,'每个人都是运动员');

            })

            var _url_scoreData = '/match/scoreData';

            var _params = {
                tourney_id:$stateParams.tourney_id
            };
            postService.doPost(_params,_url_scoreData,function(data){

                $scope.score_data = data.data;

            })
        }
    ]
)







