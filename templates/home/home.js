angular.module('Letu.homeControllers', [])

    .controller('homeCtrl',
    ['$rootScope','$scope','$stateParams','$state','postService','Tools','weiXinService',

      function($rootScope,$scope,$stateParams,$state,postService,Tools,weiXinService){

          $scope.$on('$ionicView.enter',function(){
              weiXinService.onMenuShareAppMessage('乐土体育','每个人都是运动员');
          })

          var _hasSlideIndex = [];

          var _is_one = true;

          $scope.jumpUrl = function(attention){

              switch (attention.type){
                  case '1':
                      $state.go('member.info',{member_id:attention.blid});
                      break;
                  case '2':
                      $state.go('team.detail',{team_id:attention.blid});
                      break;
                  case '3':
                      window.location.href = 'http://m.letusport.com/match/#/'+attention.blid+'/'+attention.log_data.me_id;
                      break;
                  default :
                      window.location.href = attention;
              }
          }

          //var _params_attention={
          //    page:0
          //}
          //
          //$scope.attentions = [];
          //
          //$scope.hasNextPage_attention = false;
          //
          //$scope.loadMoreDynamicAttention = function(){
          //
          //    if(!_is_one) {
          //        $rootScope.isSHowLoading = false;
          //    }else{
          //        $rootScope.isSHowLoading = true;
          //        _is_one = false;
          //    }
          //
          //
          //    _params_attention.page++;
          //
          //    var _url_getDynamicAttention = '/index/dynamicAttention'
          //
          //    postService.doPost(_params_attention,_url_getDynamicAttention,function(data){
          //
          //        if(data.data.cur_page>=data.data.total_page){
          //
          //            $scope.hasNextPage_attention = false;
          //
          //        }else{
          //            $scope.hasNextPage_attention = true;
          //        }
          //
          //        var items = data.data.dynamics;
          //
          //        for (var i = 0; i < items.length; i++) {
          //
          //            Tools.parse(items[i],1);
          //
          //            $scope.attentions.push(items[i]);
          //
          //        }
          //        $scope.$broadcast('scroll.infiniteScrollComplete');
          //    })
          //}
          //
          //
          //$scope.doDynamicAttentionRefresh = function(){
          //
          //    $scope.attentions = [];
          //    _params_attention.page = 0;
          //
          //    $scope.loadMoreDynamicAttention();
          //
          //    $scope.$broadcast('scroll.refreshComplete');
          //
          //}
          //
          //$scope.delAttentionDynamic = function(_dynamic,_index){
          //
          //    _delDynamic(_dynamic,function(){
          //            $scope.attentions.splice(_index,1);
          //        }
          //    );
          //}
          //
          //$scope.doDynamicAttentionRefresh();
          //
          //
          //var _params_match={
          //    page:0
          //}
          //
          //$scope.matchs = [];
          //
          //$scope.hasNextPage_match = false;
          //
          //$scope.loadMoreDynamicMatch = function(){
          //
          //    if(!_is_one) {
          //        $rootScope.isSHowLoading = false;
          //    }else{
          //        $rootScope.isSHowLoading = true;
          //        _is_one = false;
          //    }
          //
          //    _params_match.page++;
          //
          //    var _url_getDynamicMatch = '/index/dynamicMatch'
          //
          //    postService.doPost(_params_match,_url_getDynamicMatch,function(data){
          //
          //        if(data.data.cur_page>=data.data.total_page){
          //
          //            $scope.hasNextPage_match = false;
          //
          //        }else{
          //            $scope.hasNextPage_match = true;
          //        }
          //
          //        var items = data.data.dynamics;
          //
          //        for (var i = 0; i < items.length; i++) {
          //
          //            $scope.matchs.push(items[i]);
          //
          //        }
          //
          //        $scope.$broadcast('scroll.infiniteScrollComplete');
          //
          //    })
          //}
          //
          //$scope.doDynamicMatchRefresh = function(){
          //
          //    $scope.matchs = [];
          //    _params_match.page = 0;
          //
          //    $scope.loadMoreDynamicMatch();
          //
          //    $scope.$broadcast('scroll.refreshComplete');
          //
          //}
          //
          //$scope.doDynamicMatchRefresh();
          //
          //
          //var _params_team={
          //    page:0
          //}
          //
          //$scope.teams = [];
          //
          //$scope.hasNextPage_team = false;
          //
          //$scope.loadMoreDynamicTeam = function(){
          //
          //    if(!_is_one) {
          //        $rootScope.isSHowLoading = false;
          //    }else{
          //        $rootScope.isSHowLoading = true;
          //        _is_one = false;
          //    }
          //
          //
          //    _params_team.page++;
          //
          //    var _url_getDynamicTeam = '/index/dynamicTeam'
          //
          //    postService.doPost(_params_team,_url_getDynamicTeam,function(data){
          //
          //        if(data.data.cur_page>=data.data.total_page){
          //
          //            $scope.hasNextPage_team = false;
          //
          //        }else{
          //            $scope.hasNextPage_team = true;
          //        }
          //
          //        var items = data.data.dynamics;
          //
          //        for (var i = 0; i < items.length; i++) {
          //
          //            Tools.parse(items[i],1);
          //
          //            $scope.teams.push(items[i]);
          //
          //        }
          //        $scope.$broadcast('scroll.infiniteScrollComplete');
          //
          //    })
          //}
          //
          //$scope.doDynamicTeamRefresh = function(){
          //
          //    $scope.teams = [];
          //    _params_team.page = 0;
          //
          //    $scope.loadMoreDynamicTeam();
          //
          //    $scope.$broadcast('scroll.refreshComplete');
          //
          //}
          //
          //$scope.loadMoreDynamicTeam();
          //
          //
          //var _params_user={
          //    page:0
          //}
          //
          //$scope.users = [];
          //
          //$scope.hasNextPage_user = false;
          //
          //$scope.loadMoreDynamicUser = function(){
          //
          //    if(!_is_one) {
          //        $rootScope.isSHowLoading = false;
          //    }else{
          //        $rootScope.isSHowLoading = true;
          //        _is_one = false;
          //    }
          //
          //    _params_user.page++;
          //
          //    var _url_getDynamicUser = '/index/dynamicUser'
          //
          //    postService.doPost(_params_user,_url_getDynamicUser,function(data){
          //
          //        if(data.data.cur_page>=data.data.total_page){
          //
          //            $scope.hasNextPage_user = false;
          //
          //        }else{
          //            $scope.hasNextPage_user = true;
          //        }
          //
          //        var items = data.data.dynamics;
          //
          //        for (var i = 0; i < items.length; i++) {
          //
          //            Tools.parse(items[i],1);
          //
          //            $scope.users.push(items[i]);
          //
          //        }
          //
          //        $scope.$broadcast('scroll.infiniteScrollComplete');
          //
          //    })
          //}
          //
          //$scope.doDynamicUserRefresh = function(){
          //
          //    $scope.users = [];
          //    _params_user.page = 0;
          //
          //    $scope.loadMoreDynamicUser();
          //
          //    $scope.$broadcast('scroll.refreshComplete');
          //
          //}
          //
          //$scope.doDynamicUserRefresh();


          $scope.onSlideMove = function(data){

              switch (data.index){
                  case 1:
                      if(_hasSlideIndex.indexOf(0)==-1){

                          _is_one = true;

                          _hasSlideIndex.push(0);

                          var _params_attention={
                              page:0
                          }

                          $scope.attentions = [];

                          $scope.hasNextPage_attention = false;

                          $scope.loadMoreDynamicAttention = function(){

                              if(!_is_one) {
                                  $rootScope.isSHowLoading = false;
                              }else{
                                  $rootScope.isSHowLoading = true;
                                  _is_one = false;
                              }


                              _params_attention.page++;

                              var _url_getDynamicAttention = '/index/dynamicAttention'

                              postService.doPost(_params_attention,_url_getDynamicAttention,function(data){

                                  if(data.data.cur_page>=data.data.total_page){

                                      $scope.hasNextPage_attention = false;

                                  }else{
                                      $scope.hasNextPage_attention = true;
                                  }

                                  var items = data.data.dynamics;

                                  for (var i = 0; i < items.length; i++) {

                                      Tools.parse(items[i],1);

                                      $scope.attentions.push(items[i]);

                                  }
                                  $scope.$broadcast('scroll.infiniteScrollComplete');
                              })
                          }


                          $scope.doDynamicAttentionRefresh = function(){

                              $scope.attentions = [];
                              _params_attention.page = 0;

                              $scope.loadMoreDynamicAttention();

                              $scope.$broadcast('scroll.refreshComplete');

                          }

                          $scope.delAttentionDynamic = function(_dynamic,_index){

                              _delDynamic(_dynamic,function(){
                                      $scope.attentions.splice(_index,1);
                                  }
                              );
                          }

                          $scope.doDynamicAttentionRefresh();
                      }
                      break;
                  case 0:
                      if(_hasSlideIndex.indexOf(1)==-1){

                          _is_one = true;

                          _hasSlideIndex.push(1);
                          var _params_match={
                              page:0
                          }

                          $scope.matchs = [];

                          $scope.hasNextPage_match = false;

                          $scope.loadMoreDynamicMatch = function(){

                              if(!_is_one) {
                                  $rootScope.isSHowLoading = false;
                              }else{
                                  $rootScope.isSHowLoading = true;
                                  _is_one = false;
                              }

                              _params_match.page++;

                              var _url_getDynamicMatch = '/index/dynamicMatch'

                              postService.doPost(_params_match,_url_getDynamicMatch,function(data){

                                  if(data.data.cur_page>=data.data.total_page){

                                      $scope.hasNextPage_match = false;

                                  }else{
                                      $scope.hasNextPage_match = true;
                                  }

                                  var items = data.data.dynamics;

                                  for (var i = 0; i < items.length; i++) {

                                      $scope.matchs.push(items[i]);

                                  }

                                  $scope.$broadcast('scroll.infiniteScrollComplete');

                              })
                          }

                          $scope.doDynamicMatchRefresh = function(){

                              $scope.matchs = [];
                              _params_match.page = 0;

                              $scope.loadMoreDynamicMatch();

                              $scope.$broadcast('scroll.refreshComplete');

                          }

                          $scope.doDynamicMatchRefresh();

                      }
                      break;
                  case 2:
                      if(_hasSlideIndex.indexOf(2)==-1){

                          _is_one = true;

                          _hasSlideIndex.push(2);

                          var _params_team={
                              page:0
                          }

                          $scope.teams = [];

                          $scope.hasNextPage_team = false;

                          $scope.loadMoreDynamicTeam = function(){

                              if(!_is_one) {
                                  $rootScope.isSHowLoading = false;
                              }else{
                                  $rootScope.isSHowLoading = true;
                                  _is_one = false;
                              }


                              _params_team.page++;

                              var _url_getDynamicTeam = '/index/dynamicTeam'

                              postService.doPost(_params_team,_url_getDynamicTeam,function(data){

                                  if(data.data.cur_page>=data.data.total_page){

                                      $scope.hasNextPage_team = false;

                                  }else{
                                      $scope.hasNextPage_team = true;
                                  }

                                  var items = data.data.dynamics;

                                  for (var i = 0; i < items.length; i++) {

                                      Tools.parse(items[i],1);

                                      $scope.teams.push(items[i]);

                                  }
                                  $scope.$broadcast('scroll.infiniteScrollComplete');

                              })
                          }

                          $scope.doDynamicTeamRefresh = function(){

                              $scope.teams = [];
                              _params_team.page = 0;

                              $scope.loadMoreDynamicTeam();

                              $scope.$broadcast('scroll.refreshComplete');

                          }

                          $scope.loadMoreDynamicTeam();
                      }
                      break;
                  case 3:
                      if(_hasSlideIndex.indexOf(3)==-1){

                          _is_one = true;

                          _hasSlideIndex.push(3);

                          var _params_user={
                              page:0
                          }

                          $scope.users = [];

                          $scope.hasNextPage_user = false;

                          $scope.loadMoreDynamicUser = function(){

                              if(!_is_one) {
                                  $rootScope.isSHowLoading = false;
                              }else{
                                  $rootScope.isSHowLoading = true;
                                  _is_one = false;
                              }

                              _params_user.page++;

                              var _url_getDynamicUser = '/index/dynamicUser'

                              postService.doPost(_params_user,_url_getDynamicUser,function(data){

                                  if(data.data.cur_page>=data.data.total_page){

                                      $scope.hasNextPage_user = false;

                                  }else{
                                      $scope.hasNextPage_user = true;
                                  }

                                  var items = data.data.dynamics;

                                  for (var i = 0; i < items.length; i++) {

                                      Tools.parse(items[i],1);

                                      $scope.users.push(items[i]);

                                  }

                                  $scope.$broadcast('scroll.infiniteScrollComplete');

                              })
                          }

                          $scope.doDynamicUserRefresh = function(){

                              $scope.users = [];
                              _params_user.page = 0;

                              $scope.loadMoreDynamicUser();

                              $scope.$broadcast('scroll.refreshComplete');

                          }

                          $scope.doDynamicUserRefresh();
                      }
                      break;
              }
          };

          $scope.onSlideMove({index:0});

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

      }
    ]
)
.controller('HomeDynamicCtrl',
    ['$rootScope','$scope','$state','$sce','$stateParams','dynamic','postService','$ionicModal','weiXinService','Tools','$ionicHistory',
        function($rootScope,$scope,$state,$sce,$stateParams,dynamic,postService,$ionicModal,weiXinService,Tools,$ionicHistory){

            $scope.goBack = function() {

                if($ionicHistory.backView()){
                    $ionicHistory.goBack();
                }else {
                    $state.go('tab.index');
                }
            }

            $scope.showReply = false;

            $scope.dynamic = Tools.parse(dynamic.data.data);

            $scope.getNewsComment = function(){

                var _getNewsComment = "/forum/lists";//得到新闻评论

                $stateParams.plate = 7;

                postService.doPost($stateParams,_getNewsComment,function(data){
                    $scope.comments = data.data.forums;
                })
            }

            $scope.getNewsComment();

            /**
             * 评论
             */
            $ionicModal.fromTemplateUrl('templates/team/new_replie.html', {
                scope: $scope
            }).then(function(modal){
                $scope.newReplieModal = modal;
            });

            $scope.at = '';

            $scope.preReplie = function(id, name){

                $scope.at = (id == ''||id==undefined) ?'':'@'+name+': ';

                $scope.replieParams = {
                    commentId: id || '',
                    content: $scope.at
                };

                $scope.newReplieModal.show();

            };


            //评论
            $scope.addComment = function(){

                $scope.isShowRepet = false;

                if($scope.replieParams.commentId==''){  //评论新闻

                    var _addComment = "/forum/add";//添加回复

                    $stateParams.reply_content = $scope.replieParams.content;

                    postService.doPost($stateParams,_addComment,function(){

                        $scope.getNewsComment();

                    })

                }else{  //评论回复
                    var _addReply = "/forum/reply";//添加回复

                    $stateParams.reply_content = $scope.replieParams.content;

                    $stateParams.forum_id = $scope.replieParams.commentId;

                    postService.doPost($stateParams,_addReply,function(data){

                        $scope.getNewsComment();

                    })

                }
                $scope.newReplieModal.hide();
            }

            //点赞评论
            $scope.addCommentHit = function(comment){

                var _forumHit = "/forum/forumHit"

                $stateParams.commentId = comment.id;

                postService.doPost($stateParams,_forumHit,function(data){

                    if(data.data==100){
                        comment.is_hit = 1;
                        comment.hits++;

                    }else{
                        comment.is_hit = 0;
                        comment.hits--;
                    }
                })
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

            $scope.$on('$ionicView.enter', function () {

                weiXinService.onMenuShareAppMessage($scope.dynamic.title,$scope.dynamic.title);

            })
        }]
)



