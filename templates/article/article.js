angular.module('Letu.articleControllers', [])

.controller('ArticleListCtrl',
    ['$rootScope','$scope','$state','postService','Storage','weiXinService',

        function($rootScope,$scope,$state,postService,Storage,weiXinService){

            $scope.tabs = Storage.get('tabs');

            $scope.path={
                page:0,
                project:0
            }

            $scope.articles = [];

            $scope.hasNextPage = false;

            $scope.loadMore = function(){

                var url="/index/articleList";

                $scope.path.page++;

                postService.doPost($scope.path,url,function(data){

                    if(data.data.cur_page>=data.data.total_page){
                        $scope.hasNextPage = false;
                    }else{
                        $scope.hasNextPage = true;
                    }

                    var items = data.data.articles;

                    for (var i = 0; i < items.length; i++) {

                        $scope.articles.push(items[i]);

                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                })
            }

            /**
             * 下拉刷新
             */
            $scope.doRefresh = function(){

                $scope.articles = [];

                $scope.hasNextPage = false;

                $scope.path.page = 0;

                $scope.loadMore();
                $scope.$broadcast('scroll.refreshComplete');
            }

            $scope.selectTab = function(tab){

                $scope.articles = [];

                $scope.hasNextPage = false;

                $scope.path.page = 0;

                $scope.path.project = tab.value;

                $scope.loadMore();

            }

            $scope.loadMore();

            $scope.$on('$ionicView.enter', function () {

                weiXinService.onMenuShareAppMessage('乐土体育','每个人都是运动员');

            });
        }
    ]
)
.controller('ArticleDetailCtrl',
    ['$rootScope','$scope','$stateParams','postService','$ionicModal','weiXinService','article',
        function($rootScope,$scope,$stateParams,postService,$ionicModal,weiXinService,article) {

            $scope.article = article.data.data;

            $scope.showReply = false;

            $scope.hitArticle = function(){

                var _url_hitArticle = "/index/hitArticle";//点赞资讯

                var _params = {
                    id:$scope.article.id
                }

                $scope.article.is_hit = !$scope.article.is_hit;

                if($scope.article.is_hit){
                    $scope.article.hits++;
                }else{
                    $scope.article.hits--;
                }

                postService.doPost(_params,_url_hitArticle,function(data){
                    postService.showMsg(data.msg);
                })

            }


            $scope.getNewsComment = function(){

                var _getNewsComment = "/forum/lists";//得到新闻评论

                $stateParams.plate = 8;

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

                weiXinService.onMenuShareAppMessage($scope.article.title,$scope.article.description);

            })


        }
    ]
)




