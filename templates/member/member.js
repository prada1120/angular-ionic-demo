angular.module('Letu.memberControllers', [])

.controller('memberInfoCtrl',
    ['$rootScope','$scope','$ionicHistory','$state','postService','weiXinService',
        function($rootScope,$scope,$ionicHistory,$state,postService,weiXinService){

            $scope.goBack = function() {

                if($ionicHistory.backView()){
                    $ionicHistory.goBack();
                }else {
                    $state.go('tab.user');
                }
            }

            /**
             * 操作关注
             */
            $scope.optAttention = function(member,type){

                var _params = {
                    'uid':member.uid
                }

                if(member.is_attention){

                    postService.confirm('确认要取消对'+member.real_name+'的关注吗？',function(){

                        layer.closeAll();
                        member.is_attention = false;

                        member.fans_num--;

                        var _url_attention = '/user/attention';

                        postService.doPost(_params,_url_attention);



                    })

                }else{

                    var _url_attention = '/user/attention';

                    postService.doPost(_params,_url_attention);

                    member.is_attention = true;

                    member.fans_num++;
                }
            }

            $scope.show = function(_img,_imgs){

                var imgArray = [];

                angular.forEach(_imgs,function(_val){
                    angular.forEach(_val,function(val){
                        var itemSrc = _staticUrl+val;
                        imgArray.push(itemSrc);
                    })
                })

                wx.previewImage({
                    current: _staticUrl+_img,
                    urls: imgArray
                });
            }

            $scope.hitDynamic = function(_dynamic){

                var _url_delDynamic = '/index/hitDynamic'

                var _params = {

                    id:_dynamic.log_id

                };

                _dynamic.is_hit = !_dynamic.is_hit;

                if(_dynamic.is_hit){
                    _dynamic.hits++;
                }else{
                    _dynamic.hits--;
                }

                postService.doPost(_params,_url_delDynamic,function(data) {

                    //postService.showMsg(data.msg);

                })
            }

            var _delDynamic = function(_dynamic,callback){

                layer.open({
                    content: '您确定要删除该动态？',
                    btn: ['确定', '取消'],
                    style:'text-align: center;',
                    yes: function(){

                        var _url_delDynamic = '/index/delDynamic'

                        var _params = {

                            id:_dynamic.log_id

                        };

                        postService.doPost(_params,_url_delDynamic,function(data) {

                            postService.showMsg(data.msg);

                            callback()

                        })

                    }, no: function(){

                    }
                });

            }

            $scope.$on('$ionicView.enter',function(){
                weiXinService.onMenuShareAppMessage($rootScope.member.real_name+'的个人名片-乐土体育','每个人都是运动员');
            })

        }
    ]
)
.controller('memberAttentionCtrl',
    ['$rootScope','$stateParams','$scope','$state','postService','weiXinService',

        function($rootScope,$stateParams,$scope,$state,postService,weiXinService){

            /**
             * 关注的人
             * @type {{page: number}}
             * @private
             */

            $scope.member_id = $stateParams.member_id;
            var _userPath = {
                member_id:$stateParams.member_id,
                page:0
            };
            $scope.userAttentions = [];
            $scope.userHasNextPage = false;

            $scope.loadUserAttentions = function(){

                _userPath.page ++;

                var _url_userAttentions = '/member/userAttentions';

                postService.doPost(_userPath,_url_userAttentions,function(data){

                    if(data.data.cur_page>=data.data.total_page){
                        $scope.userHasNextPage = false;
                    }else{
                        $scope.userHasNextPage = true;
                    }

                    var items = data.data.attentions;

                    for (var i = 0; i < items.length; i++) {

                        $scope.userAttentions.push(items[i]);

                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');

                });

            }

            $scope.doUserAttentionsRefresh = function(){

                $scope.userAttentions = [];

                _userPath.page = 0;

                $scope.loadUserAttentions();

                $scope.$broadcast('scroll.refreshComplete');

            }

            $scope.loadUserAttentions();


            /**
             * 关注的球队
             * @type {{page: number}}
             * @private
             */

            var _teamPath = {
                member_id:$stateParams.member_id,
                page:0
            };
            $scope.teamAttentions = [];
            $scope.teamHasNextPage = false;

            $scope.loadTeamAttentions = function(){

                _teamPath.page ++;

                var _url_teamAttentions = '/member/teamAttentions';

                postService.doPost(_teamPath,_url_teamAttentions,function(data){

                    if(data.data.cur_page>=data.data.total_page){
                        $scope.teamHasNextPage = false;
                    }else{
                        $scope.teamHasNextPage = true;
                    }

                    var items = data.data.attentions;

                    for (var i = 0; i < items.length; i++) {

                        $scope.teamAttentions.push(items[i]);

                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');

                });

            }

            $scope.doTeamAttentionsRefresh = function(){

                $scope.teamAttentions = [];

                _teamPath.page = 0;

                $scope.loadTeamAttentions();

                $scope.$broadcast('scroll.refreshComplete');

            }

            $scope.loadTeamAttentions();

            $scope.$on('$ionicView.enter',function(){
                weiXinService.onMenuShareAppMessage($rootScope.member.real_name+'的关注-乐土体育','每个人都是运动员');
            })

        }
    ]
)
.controller('memberFansCtrl',
    ['$rootScope','$stateParams','$scope','$state','postService','weiXinService',

        function($rootScope,$stateParams,$scope,$state,postService,weiXinService){

            $scope.member_id = $stateParams.member_id;
            var _path = {
                member_id:$stateParams.member_id,
                page:0
            };
            $scope.users = [];
            $scope.userHasNextPage = false;

            $scope.loadMoreUsreFans = function(){

                _path.page ++;

                var _url_userFans = '/member/userFans';

                postService.doPost(_path,_url_userFans,function(data){

                    if(data.data.cur_page>=data.data.total_page){
                        $scope.userHasNextPage = false;
                    }else{
                        $scope.userHasNextPage = true;
                    }

                    var items = data.data.attentions;

                    for (var i = 0; i < items.length; i++) {

                        $scope.users.push(items[i]);

                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');

                });

            }

            $scope.doUserFansRefresh = function(){

                $scope.users = [];

                _path.page = 0;

                $scope.loadUserAttentions();

                $scope.$broadcast('scroll.refreshComplete');

            }

            $scope.loadMoreUsreFans();

            $scope.$on('$ionicView.enter',function(){
                weiXinService.onMenuShareAppMessage($rootScope.member.real_name+'的粉丝-乐土体育','每个人都是运动员');
            })

        }
    ]
)
.controller('memberInviteCtrl',
    ['$rootScope','$scope','$stateParams','$state','postService','weiXinService',

        function($rootScope,$scope,$stateParams,$state,postService,weiXinService){

            $scope.member_id = $stateParams.member_id;
            /**
             * 加入的约战
             * @type {{page: number}}
             * @private
             */
            var _params_join={
                member_id:$scope.member_id,
                page:0
            }
            var _url_myJoinInvites = '/member/myJoinInvites';

            $scope.join_invites= [];

            $scope.hasNextPage_join = false;

            $scope.loadMoreJoinInvites = function() {

                _params_join.page++;

                postService.doPost(_params_join,_url_myJoinInvites,function(data){

                    if(data.data.cur_page>=data.data.total_page){

                        $scope.hasNextPage_join = false;

                    }else{
                        $scope.hasNextPage_join = true;
                    }

                    var items = data.data.invites;

                    for (var i = 0; i < items.length; i++) {

                        $scope.join_invites.push(items[i]);

                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');

                });

            }

            $scope.doJoinInviteRefresh = function(){

                $scope.join_invites = [];

                _params_join.page = 0;

                $scope.loadMoreJoinInvites();

                $scope.$broadcast('scroll.refreshComplete');

            }

            $scope.doJoinInviteRefresh();


            var _params_create={
                member_id:$scope.member_id,
                page:0
            }
            var _url_myInvites = '/member/myInvites';

            $scope.create_invites= [];

            $scope.hasNextPage_create = false;

            $scope.loadMoreCreateInvites = function() {

                _params_create.page++;

                postService.doPost(_params_create,_url_myInvites,function(data){

                    if(data.data.cur_page>=data.data.total_page){

                        $scope.hasNextPage_create = false;

                    }else{
                        $scope.hasNextPage_create = true;
                    }

                    var items = data.data.invites;

                    for (var i = 0; i < items.length; i++) {

                        $scope.create_invites.push(items[i]);

                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');

                });

            }

            $scope.doCreateInviteRefresh = function(){

                $scope.create_invites = [];

                _params_create.page = 0;

                $scope.loadMoreCreateInvites();

                $scope.$broadcast('scroll.refreshComplete');

            }

            $scope.doCreateInviteRefresh();

            $scope.$on('$ionicView.enter',function(){
                weiXinService.onMenuShareAppMessage($rootScope.member.real_name+'的约战-乐土体育','每个人都是运动员');
            })

        }
    ]
)
.controller('memberTeamCtrl',
    ['$rootScope','$scope','$stateParams','$state','postService','weiXinService',

        function($rootScope,$scope,$stateParams,$state,postService,weiXinService){

            $scope.member_id = $stateParams.member_id;

            var _path = {
                member_id:$scope.member_id
            }

            var _url_myTeams = '/member/myTeams';

            postService.doPost(_path,_url_myTeams,function(data){

                $scope.myTeams = data.data;

            });

            var _url_myJoinTeams = '/member/myJoinTeams';

            postService.doPost(_path,_url_myJoinTeams,function(data){

                $scope.myJoinTeams = data.data;


            });

            $scope.$on('$ionicView.enter',function(){
                weiXinService.onMenuShareAppMessage($rootScope.member.real_name+'的球队-乐土体育','每个人都是运动员');
            })

        }
    ]
)
.controller('memberDynamicCtrl',
    ['$rootScope','$scope','$state','$stateParams','postService','Tools','$ionicModal','Upload','$ionicLoading','Storage','weiXinService',

        function($rootScope,$scope,$state,$stateParams,postService,Tools,$ionicModal,Upload,$ionicLoading,Storage,weiXinService){

            $scope.member_id = $stateParams.member_id;
            var _userPath = {
                member_id:$scope.member_id,
                page:0
            };
            $scope.dynamics = [];
            $scope.hasNextPage = false;

            $scope.loadMoreDynamics = function(){

                var _url_myDynamics = '/member/myDynamics';

                postService.doPost(_userPath,_url_myDynamics,function(data){

                    _userPath.page++;

                    if(data.data.cur_page>=data.data.total_page){
                        $scope.hasNextPage = false;
                    }else{
                        $scope.hasNextPage = true;
                    }

                    var items = data.data.dynamics;

                    for (var i = 0; i < items.length; i++) {

                        Tools.parse(items[i],1);

                        $scope.dynamics.push(items[i]);

                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');

                });

            }

            $scope.doDynamicRefresh = function(){

                $scope.dynamics = [];

                _userPath.page = 0;

                $scope.loadMoreDynamics();

                $scope.$broadcast('scroll.refreshComplete');

            }

            $scope.loadMoreDynamics();

            $scope.hitDynamic = function(_dynamic){

                var _url_delDynamic = '/index/hitDynamic';

                $rootScope.isSHowLoading = false;

                var _params = {

                    id:_dynamic.log_id

                };

                _dynamic.is_hit = !_dynamic.is_hit;

                if(_dynamic.is_hit){
                    _dynamic.hits++;
                }else{
                    _dynamic.hits--;
                }

                postService.doPost(_params,_url_delDynamic,function(data) {

                })
            }

            $scope.$on('$ionicView.enter',function(){
                weiXinService.onMenuShareAppMessage($rootScope.member.real_name+'的动态-乐土体育','每个人都是运动员');
            })
        }
    ]
)
.controller('memberLevelCtrl',
    ['$rootScope','$scope','$stateParams','$state','postService','weiXinService',

        function($rootScope,$scope,$stateParams,$state,postService,weiXinService){


        }
    ]
)




