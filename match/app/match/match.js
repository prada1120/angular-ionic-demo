angular.module('letu.match', [
    'ui.router'
])

    .config(
    [          '$stateProvider', '$urlRouterProvider',
        function ($stateProvider,   $urlRouterProvider) {
            $urlRouterProvider
                .otherwise('/list');
            $stateProvider

                //赛事列表
                .state('list', {

                    url: '/list',

                    templateUrl: 'app/match/match.list.html',

                    resolve: {
                        matchs: ['postService',function(postService){

                            var path={
                                project:'',
                                province:'',
                                keyword:''
                            }

                            var url="/match/search";

                            var matchs = postService.matchs(path,url);

                            return matchs;
                        }]
                    },
                    controller:['$rootScope','$scope', '$timeout','$stateParams','matchs','postService','weiXinService',
                        function($rootScope,$scope,$timeout,$stateParams,matchs,postService,weiXinService){


                            $rootScope.$loading = false;
                            var path={
                                project:'',
                                province:'',
                                keyword:''
                            }

                            $scope.matchs = matchs.data.data.matchs;

                            $scope.projectName = '项目';
                            var url="/match/search";
                            var timeout;

                            $scope.getMatchs = function(){

                                postService.matchs(path,url).success(function(data, status) {

                                    $scope.matchs = data.data.matchs;

                                    $rootScope.$loading = false;

                                });
                            }

                            $scope.inputChange=function(){
                                path.keyword=$scope.serchMacth;
                                if (timeout) {
                                    $timeout.cancel(timeout);
                                }
                                timeout = $timeout(function() {
                                    $scope.getMatchs();
                                }, 350);
                            }
                            $scope.projectChange=function(projectId,projectName){

                                $scope.projectName = projectName;
                                path.project=projectId;

                                $scope.getMatchs();

                            }

                            $scope.$on('onFinishRender', function () {
                                weiXinService.onMenuShareAppMessage('赛事列表-乐土体育','乐土体育专心做赛事');
                            });
                        }]
                })

                //赛事头部
                .state('match',{
                    abstract: true,
                    url:'/:match_id/:me_id',
                    templateUrl: 'app/match/match.index.html',
                    resolve: {
                        //赛事简介
                        introduce: ['$stateParams', 'postService', function ($stateParams, postService) {

                            var _getIntroduce_url = "/match/getIntroduce";

                            return postService.matchs($stateParams, _getIntroduce_url);

                        }]
                    },
                    controller:['$scope','$sce','introduce',
                        function($scope,$sce,introduce){

                            var introduce = introduce.data.data;

                            $scope.description_nl = introduce.description_nl;

                            introduce.rules = $sce.trustAsHtml(introduce.rules);
                            introduce.description = $sce.trustAsHtml(introduce.description);
                            $scope.match = introduce;
                    }]
                })

                //赛事首页详情
                .state('match.detail', {

                    url: '',

                    templateUrl: 'app/match/match.detail.html',

                    resolve: {
                        //赛事成员
                        matchMember:['$stateParams','postService',function($stateParams,postService){

                            var _matchMember_url="/match/matchMember";

                            return postService.matchs($stateParams,_matchMember_url);

                        }]

                    },

                    controller:['$rootScope','$scope','$sce','$state','$stateParams','matchMember','postService','weiXinService','Tools',
                        function($rootScope,$scope,$sce,$state,$stateParams,matchMember,postService,weiXinService,Tools){


                            $scope.isShowOne = true;

                            $scope.members = matchMember.data.data;

                            $rootScope.$loading = false;

                            $scope.getSponsor = function(){

                                var _getSponsor_url="/match/getSponsor";

                                postService.matchs($stateParams,_getSponsor_url).success(function(data, status) {

                                    $scope.sponsors = data.data;

                                    $rootScope.$loading=false;

                                });
                            }

                            $scope.getSponsor();

                            $scope.attention = function(match){

                                if(!Tools.validateLogin()){
                                    layer.open({
                                        content: '还未登陆，跳转中...',
                                        style: 'text-align: center;',
                                        time: 1,
                                        end: function () {
                                            window.location.href = "/wap/#/tab/user";
                                        }
                                    });
                                    return false;
                                }

                                var _url_attention = "/match/attention";

                                var _params = {
                                    'match_id': $stateParams.match_id,
                                    'me_id': $stateParams.me_id
                                }

                                postService.matchs(_params, _url_attention).success(function (data, status) {
                                    $rootScope.$loading = false;

                                    if (data.status == 1) {

                                        layer.open({
                                            content: data.msg,
                                            style: 'text-align: center;',
                                            time: 1
                                        });

                                        match.is_attention = !match.is_attention;

                                    } else {
                                        if (data.data == 100) {
                                            layer.open({
                                                content: '登陆跳转...',
                                                style: 'text-align: center;',
                                                time: 1,
                                                end: function () {
                                                    window.location.href = "/wap/#/tab/user";
                                                }
                                            });

                                        } else {
                                            layer.open({
                                                content: data.msg,
                                                style: 'text-align: center;',
                                                time: 1
                                            });
                                        }
                                    }
                                })
                            }

                            $scope.sign = function(){

                                if(!Tools.validateLogin()){
                                    layer.open({
                                        content: '还未登陆，跳转中...',
                                        style: 'text-align: center;',
                                        time: 1,
                                        end: function () {
                                            window.location.href = "http://m.letusport.com/#/tab/user";
                                        }
                                    });
                                    return false;
                                }

                                var _content = '您将报名“'+$scope.match.name+'”</br>请输入一下信息:</br>' +
                                    '<input type="text" id="name" placeholder="请输入姓名" class="layer-input">' +
                                    '<input type="tel" id="phone" placeholder="请输入联系方式" class="layer-input">';
                                if($scope.match.matchtype==1) {

                                    var _url_myTeams = '/user/myTeams';

                                    postService.matchs({}, _url_myTeams).success(function (data, status) {
                                        $rootScope.$loading = false;

                                        $scope.myTeams = data.data;

                                        _content += '<label class="item item-input item-select layer-input">' +
                                        '<select id="team" class="layer-select">';
                                        angular.forEach($scope.myTeams, function (team, inde) {
                                            _content += '<option value="' + team.id + '">' + team.name + '</option>';
                                        })
                                        _content += '</select></label>';

                                        layer.open({
                                            content: _content,
                                            btn: ['发送', '取消'],
                                            style: 'text-align: center;',
                                            yes: function () {
                                                var _name = angular.element(document.getElementById("name")).val();

                                                if (Tools.validateNull(_name)) {
                                                    alert('姓名不能为空');
                                                    return false;
                                                }

                                                var _phone = angular.element(document.getElementById("phone")).val();

                                                if (!Tools.validatePhone(_phone)) {
                                                    alert('联系方式格式错误');
                                                    return false;
                                                }

                                                var _team = angular.element(document.getElementById("team")).val();

                                                var _params = {
                                                    'match_id': $stateParams.match_id,
                                                    'me_id': $stateParams.me_id,
                                                    'name': _name,
                                                    'phone': _phone,
                                                    'team_id':_team
                                                }

                                                var _sign_url = "/match/sign";

                                                postService.matchs(_params, _sign_url).success(function (data, status) {

                                                    $rootScope.$loading = false;
                                                    if (data.status == 1) {

                                                        layer.open({
                                                            content: data.msg,
                                                            style: 'text-align: center;',
                                                            time: 1
                                                        });

                                                    } else {
                                                        if (data.data == 100) {
                                                            layer.open({
                                                                content: '登陆跳转...',
                                                                style: 'text-align: center;',
                                                                time: 1,
                                                                end: function () {
                                                                    window.location.href = "/wap/#/tab/user";
                                                                }
                                                            });

                                                        } else {
                                                            layer.open({
                                                                content: data.msg,
                                                                style: 'text-align: center;',
                                                                time: 1
                                                            });
                                                        }
                                                    }

                                                    $state.reload();

                                                });
                                            }, no: function () {

                                            }
                                        })
                                    })

                                }else{
                                    layer.open({
                                        content: _content,
                                        btn: ['发送', '取消'],
                                        style: 'text-align: center;',
                                        yes: function () {
                                            var _name = angular.element(document.getElementById("name")).val();

                                            if(Tools.validateNull(_name)){
                                                alert('姓名不能为空');
                                                return false;
                                            }

                                            var _phone = angular.element(document.getElementById("phone")).val();

                                            if(!Tools.validatePhone(_phone)){
                                                alert('联系方式格式错误');
                                                return false;
                                            }

                                            var _params = {
                                                'match_id':$stateParams.match_id,
                                                'me_id':$stateParams.me_id,
                                                'name':_name,
                                                'phone':_phone
                                            }

                                            var _sign_url="/match/sign";

                                            postService.matchs(_params,_sign_url).success(function(data, status) {

                                                $rootScope.$loading=false;
                                                if(data.status==1){
                                                    layer.open({
                                                        content: data.msg,
                                                        style:'text-align: center;',
                                                        time: 1
                                                    });

                                                }else{
                                                    if(data.data==100){
                                                        var _href = window.window.location.href;
                                                        layer.open({
                                                            content: '登陆跳转...',
                                                            style:'text-align: center;',
                                                            time: 1,
                                                            end:function(){
                                                                window.location.href = "/wap/#/tab/user";
                                                            }
                                                        });

                                                    }else{
                                                        layer.open({
                                                            content: data.msg,
                                                            style:'text-align: center;',
                                                            time: 1
                                                        });
                                                    }
                                                }

                                            });
                                        }, no: function () {

                                        }
                                    })
                                }

                            }

                            $scope.$on('onFinishRender', function () {
                                weiXinService.onMenuShareAppMessage($scope.match.name,$scope.description_nl,_staticUrl+$scope.match.img);
                            });
                        }]

                })

                //赛事赛程
                .state('match.result', {

                    url: '/result',

                    templateUrl: 'app/match/match.result.html',

                    resolve: {
                        //获得赛事赛程
                        events: ['$stateParams','postService',function($stateParams,postService){

                            $stateParams.is_promotion = 0;

                            var _getMatchEvents_url="/match/getMatchEvents";

                            return postService.matchs($stateParams,_getMatchEvents_url);

                        }],
                        //获得赛程赛果
                        results:['$stateParams','postService',function($stateParams,postService){


                            $stateParams.is_promotion = 0;

                            var _getMatchResults_url="/match/getMatchResults";

                            return postService.matchs($stateParams,_getMatchResults_url);

                        }],
                        promotionEventsNum:['$stateParams','postService',function($stateParams,postService){

                            var _getPromotionEventsNum_url="/match/getPromotionEventsNum";

                            return postService.matchs($stateParams,_getPromotionEventsNum_url);

                        }]
                    },

                    controller:['$rootScope','$scope','$sce','$stateParams','events','results','promotionEventsNum','postService','weiXinService',

                        function($rootScope,$scope,$sce,$stateParams,events,results,promotionEventsNum,postService,weiXinService){

                            $scope.promotionEventsNum = promotionEventsNum.data.data;

                            $rootScope.$loading = false;

                            var _getMatchEvents="/match/getMatchEvents";//得到赛程
                            var _getMatchResults_url="/match/getMatchResults";//得到赛程赛果
                            var _concernedMember_url="/match/concernedMember";//点赞参赛球队

                            //点赞
                            $scope.addHits=function(member,result_id){

                                $stateParams.member_id = member.id;
                                $stateParams.result_id =result_id;

                                postService.matchs($stateParams,_concernedMember_url).success(function(data, status) {

                                    $rootScope.$loading=false;

                                    if(data.status==1){
                                        member.is_hit = 1;
                                        member.result_hits++;

                                    }else{
                                        if(data.data==100){
                                            var _href = window.window.location.href;
                                            layer.open({
                                                content: '登陆跳转...',
                                                style:'text-align: center;',
                                                time: 1,
                                                end:function(){
                                                    window.location.href = "/wap/#/tab/user";
                                                }
                                            });

                                        }else{
                                            layer.open({
                                                content: data.msg,
                                                style:'text-align: center;',
                                                time: 1
                                            });
                                        }
                                    }
                                });
                            }

                            //切换轮次
                            $scope.changeEvent=function(event,index){

                                $stateParams.event_id = event.id;

                                $scope.currentEvent = event;

                                $scope.index = index;

                                postService.matchs($stateParams,_getMatchResults_url).success(function(data, status) {

                                    $scope.members = data.data;

                                    $rootScope.$loading=false;

                                });
                            }

                            //上一站
                            $scope.toPreEvent = function(){

                                if($scope.index-1<0){
                                    layer.open({
                                        content: '第一个',
                                        style:'text-align: center;',
                                        time: 1
                                    });
                                }else{
                                    $scope.changeEvent($scope.events[$scope.index-1],$scope.index-1);
                                }
                            }

                            //下一站
                            $scope.toNexEvent = function(){

                                if($scope.index+1>=$scope.events.length){
                                    layer.open({
                                        content: '没有了',
                                        style:'text-align: center;',
                                        time: 1
                                    });
                                }else{
                                    $scope.changeEvent($scope.events[$scope.index+1],$scope.index+1);
                                }
                            }

                            //晋级切换
                            $scope.changePromotion=function(){

                                $stateParams.is_promotion = 1;

                                $stateParams.event_id = 0;

                                postService.matchs($stateParams,_getMatchEvents).success(function(data, status) {

                                    $scope.is_promotion = 1;

                                    $scope.events = data.data;

                                    $scope.nums = data.data.length;

                                    $scope.index = 0;

                                    $scope.currentEvent = data.data[0];

                                });

                                postService.matchs($stateParams,_getMatchResults_url).success(function(data, status) {

                                    $scope.members = data.data;

                                    $rootScope.$loading = false;

                                });

                            }

                            //赛程重置
                            $scope.reset = function(){

                                $stateParams.is_promotion = 0;

                                $scope.is_promotion = 0;

                                $scope.events = events.data.data;

                                $scope.nums = events.data.data.length;

                                $scope.index = 0;

                                $scope.currentEvent = events.data.data[0];

                                $scope.members = results.data.data;

                            }

                            //显示相册

                            $scope.showAlbum = function(_img,_imgArray){


                                console.log(_imgArray);
                                if(!angular.isArray(_imgArray)){
                                    layer.open({
                                        content: '暂无相册',
                                        style:'text-align: center;',
                                        time: 1
                                    });
                                    return false;
                                }

                                wx.previewImage({
                                    current: _img,
                                    urls: _imgArray
                                });

                            }

                            $scope.reset();

                            $scope.$on('onFinishRender', function () {
                                weiXinService.onMenuShareAppMessage('赛程-'+$scope.match.name,$scope.description_nl,_staticUrl+$scope.match.img);
                            });
                        }]
                })

                //赛果详细
                .state('match.result.detail',{

                    url:'/:result_id',
                    views: {
                        '@match': {
                            templateUrl: 'app/match/match.result.detail.html',
                            resolve: {
                                //获得赛事赛程
                                result: ['$stateParams','postService',function($stateParams,postService){

                                    $stateParams.is_promotion = 0;

                                    var _getMatchResultDetail_url="/match/getMatchResultDetail";//得到赛程赛事详细

                                    return postService.matchs($stateParams,_getMatchResultDetail_url);

                                }]
                            },
                            controller: ['$rootScope','$scope','$stateParams','result','postService','weiXinService',
                                function($rootScope,$scope,$stateParams,result,postService,weiXinService){

                                    $scope.$on('onFinishRender', function () {
                                        weiXinService.onMenuShareAppMessage($scope.match.name,$scope.description_nl,_staticUrl+$scope.match.img);


                                    });

                                    $rootScope.$loading = false;

                                    $scope.result = result.data.data;

                                    $scope.isShowRepet = false;

                                    var _getMatchExtMomments_url="/match/getMatchExtMomments";//赛程评价列表
                                    var _commentMatch_url="/match/commentMatch";//评价赛果
                                    var _concernedComment_url="/match/concernedComment";//点赞评价
                                    var _concernedMember_url="/match/concernedMember";//点赞参赛球队

                                    //得到赛程评价
                                    $scope.getMatchExtMomments =function(){

                                        postService.matchs($stateParams,_getMatchExtMomments_url).success(function(data, status) {
                                            $scope.comments = data.data;

                                            $rootScope.$loading = false;

                                        });
                                    }

                                    $scope.getMatchExtMomments();

                                    //点赞
                                    $scope.addHits=function(member){

                                        $stateParams.member_id = member.id;
                                        postService.matchs($stateParams,_concernedMember_url).success(function(data, status) {

                                            $rootScope.$loading = false;

                                            if(data.status==1){
                                                member.is_hit = 1;
                                                member.result_hits++;

                                            }else{
                                                if(data.data==100){
                                                    var _href = window.window.location.href;
                                                    layer.open({
                                                        content: '登陆跳转...',
                                                        style:'text-align: center;',
                                                        time: 1,
                                                        end:function(){
                                                            window.location.href = "/wap/#/tab/user";
                                                        }
                                                    });

                                                }else{
                                                    layer.open({
                                                        content: data.msg,
                                                        style:'text-align: center;',
                                                        time: 1
                                                    });
                                                }
                                            }

                                        });


                                    }

                                    //评论
                                    $scope.addComment = function(){

                                        $stateParams.content = $scope.comment_content;

                                        $stateParams.commentId = $scope.commentId;

                                        postService.matchs($stateParams,_commentMatch_url).success(function(data, status) {

                                            $rootScope.$loading = false;

                                            $scope.isShowRepet = false;

                                            if(data.status){

                                                postService.matchs($stateParams,_getMatchExtMomments_url).success(function(data, status) {

                                                    $rootScope.$loading = false;
                                                    $scope.comments = data.data;

                                                });

                                            }else{
                                                if(data.data==100){
                                                    var _href = window.window.location.href;
                                                    layer.open({
                                                        content: '登陆跳转...',
                                                        style:'text-align: center;',
                                                        time: 1,
                                                        end:function(){
                                                            window.location.href = "/wap/#/tab/user";
                                                        }
                                                    });

                                                }else{
                                                    layer.open({
                                                        content: data.msg,
                                                        style:'text-align: center;',
                                                        time: 1
                                                    });
                                                }
                                            }

                                        });

                                    }

                                    //回复
                                    $scope.addReply = function(commentId){

                                        $scope.comment_content = '';

                                        $scope.commentId = commentId;
                                        $scope.isShowRepet = true;
                                        $(".tiaodan").eq(0).fadeIn();

                                    }

                                    //点赞评论
                                    $scope.addCommentHit = function(comment){

                                        $stateParams.commentId = comment.id;

                                        postService.matchs($stateParams,_concernedComment_url).success(function(data, status) {

                                            $rootScope.$loading = false;

                                            if(data.status==1&&data.data==100){
                                                layer.open({
                                                    content: data.msg,
                                                    style:'text-align: center;',
                                                    time: 1
                                                });
                                                comment.is_hit = 1;
                                                comment.hits++;

                                            }else if(data.status==1&&data.data==200){
                                                layer.open({
                                                    content: data.msg,
                                                    style:'text-align: center;',
                                                    time: 1
                                                });
                                                comment.is_hit = 0;
                                                comment.hits--;
                                            }else{
                                                if(data.data==100){
                                                    var _href = window.window.location.href;
                                                    layer.open({
                                                        content: '登陆跳转...',
                                                        style:'text-align: center;',
                                                        time: 1,
                                                        end:function(){
                                                            window.location.href = "/wap/#/tab/user";
                                                        }
                                                    });

                                                }else{
                                                    layer.open({
                                                        content: data.msg,
                                                        style:'text-align: center;',
                                                        time: 1
                                                    });
                                                }
                                            }

                                        });

                                    }

                                    //显示相册

                                    $scope.showAlbum = function(_img){

                                        _imgArray = $scope.result.imgs;

                                        if(!angular.isArray(_imgArray)){
                                            layer.open({
                                                content: '暂无相册',
                                                style:'text-align: center;',
                                                time: 1
                                            });
                                            return false;
                                        }

                                        wx.previewImage({
                                            current: _img,
                                            urls: _imgArray
                                        });

                                    }




                                }]
                        }
                    }
                })

            /**
             * 赛事动态
             */
                .state('match.news', {

                    url: '/news',

                    templateUrl: 'app/match/match.news.html',

                    resolve: {
                        //赛事赞助商
                        newsList: ['$stateParams','postService',function($stateParams,postService){

                            var _getMatchExtNewsList_url="/match/getMatchExtNewsList";

                            return postService.matchs($stateParams,_getMatchExtNewsList_url);

                        }]
                    },

                    controller:['$rootScope','$scope','newsList','weiXinService',
                        function($rootScope,$scope,newsList,weiXinService){

                            $scope.$on('onFinishRender', function () {
                                weiXinService.onMenuShareAppMessage('动态-'+$scope.match.name,$scope.description_nl,_staticUrl+$scope.match.img);
                            });

                            $scope.news = newsList.data.data;

                            $rootScope.$loading = false;
                        }]
                })

            /**
             * 动态详情
             */
                .state('match.news.detail',{

                    url: '/:id',
                    views: {
                        '@match': {
                            templateUrl: 'app/match/match.news.detail.html',

                            resolve: {
                                //赛事赞助商
                                news: ['$stateParams','postService',function($stateParams,postService){

                                    var _getMatchExtNews_url="/match/getMatchExtNews";

                                    return postService.matchs($stateParams,_getMatchExtNews_url);

                                }]
                            },

                            controller:['$rootScope','$scope','$sce','$stateParams','news','postService','weiXinService',
                                function($rootScope,$scope,$sce,$stateParams,news,postService,weiXinService){

                                    $scope.$on('onFinishRender', function () {
                                        weiXinService.onMenuShareAppMessage($scope.news.title,$scope.news.description,$scope.news.thumb);
                                    });

                                    $scope.$on('$viewContentLoaded', function() {
                                        $('.news_dtl').delegate('img','click',function(){

                                            var _img = $(this).attr('src');
                                            var _imgs = '';

                                            var imgArray = [];
                                            $('.news_dtl img').each(function(){
                                                var itemSrc = $(this).attr('src');
                                                imgArray.push(itemSrc);
                                            })

                                            wx.previewImage({
                                                current: _img,
                                                urls: imgArray
                                            });
                                        })
                                    });

                                    news.data.data.content = $sce.trustAsHtml(news.data.data.content);

                                    $scope.news = news.data.data;

                                    var _getSponsor_url="/match/getSponsor";//得到赞助商

                                    postService.matchs($stateParams,_getSponsor_url).success(function(data, status) {

                                        $scope.sponsors = data.data;

                                        $rootScope.$loading = false;

                                    });

                                    $scope.getNewsComment = function(){
                                        var _getNewsComment = "/forum/lists";//得到新闻评论

                                        $stateParams.plate = 5;

                                        postService.matchs($stateParams,_getNewsComment).success(function(data, status) {

                                            $scope.comments = data.data.forums;

                                            $rootScope.$loading = false;

                                        });
                                    }

                                    $scope.getNewsComment();

                                    //评论
                                    $scope.addComment = function(){

                                        if($scope.commentId==undefined){  //评论新闻

                                            var _addComment = "/forum/add";//添加回复

                                            $stateParams.reply_content = $scope.comment_content;

                                            postService.matchs($stateParams,_addComment).success(function(data, status) {

                                                $rootScope.$loading = false;

                                                $scope.isShowRepet = false;

                                                if(data.status){

                                                    $scope.getNewsComment();

                                                }else{
                                                    if(data.data==100){

                                                        var _href = window.window.location.href;
                                                        layer.open({
                                                            content: '登陆跳转...',
                                                            style:'text-align: center;',
                                                            time: 1,
                                                            end:function(){
                                                                window.location.href = "/wap/#/tab/user";
                                                            }
                                                        });

                                                    }else{
                                                        layer.open({
                                                            content: data.msg,
                                                            style:'text-align: center;',
                                                            time: 1
                                                        });
                                                    }
                                                }

                                            });

                                        }else{  //评论回复
                                            var _addReply = "/forum/reply";//添加回复

                                            $stateParams.reply_content = $scope.comment_content;

                                            $stateParams.forum_id = $scope.commentId;

                                            postService.matchs($stateParams,_addReply).success(function(data, status) {

                                                $rootScope.$loading = false;

                                                $scope.isShowRepet = false;

                                                if(data.status){

                                                    $scope.getNewsComment();

                                                }else{
                                                    if(data.data==100){

                                                        var _href = window.window.location.href;
                                                        layer.open({
                                                            content: '登陆跳转...',
                                                            style:'text-align: center;',
                                                            time: 1,
                                                            end:function(){
                                                                window.location.href = "/wap/#/tab/user";
                                                            }
                                                        });

                                                    }else{
                                                        layer.open({
                                                            content: data.msg,
                                                            style:'text-align: center;',
                                                            time: 1
                                                        });
                                                    }
                                                }

                                            });
                                        }
                                    }

                                    //点赞评论
                                    $scope.addCommentHit = function(comment){


                                        var _forumHit = "/forum/forumHit"

                                        $stateParams.commentId = comment.id;

                                        postService.matchs($stateParams,_forumHit).success(function(data, status) {

                                            $rootScope.$loading = false;

                                            if(data.status==1&&data.data==100){
                                                layer.open({
                                                    content: data.msg,
                                                    style:'text-align: center;',
                                                    time: 1
                                                }) ;
                                                comment.is_hit = 1;
                                                comment.hits++;

                                            }else if(data.status==1&&data.data==200){
                                                layer.open({
                                                    content: data.msg,
                                                    style:'text-align: center;',
                                                    time: 1
                                                });
                                                comment.is_hit = 0;
                                                comment.hits--;
                                            }else{
                                                if(data.data==100){
                                                    var _href = window.window.location.href;
                                                    layer.open({
                                                        content: '登陆跳转...',
                                                        style:'text-align: center;',
                                                        time: 1,
                                                        end:function(){
                                                            window.location.href = "/wap/#/tab/user";
                                                        }
                                                    });

                                                }else{
                                                    layer.open({
                                                        content: data.msg,
                                                        style:'text-align: center;',
                                                        time: 1
                                                    });
                                                }
                                            }

                                        });

                                    }

                                    //回复
                                    $scope.addReply = function(commentId){

                                        $scope.commentId = commentId;
                                        $scope.isShowRepet = true;
                                        $(".tiaodan").eq(0).fadeIn();

                                    }


                                    $rootScope.$loading = false;

                                }]
                        }
                    }
                })

            /**
             * 赛事榜单
             */
                .state('match.rank', {

                    url: '/rank',

                    templateUrl: 'app/match/match.rank.html',

                    resolve: {
                        //赛事赞助商
                        ranks: ['$stateParams','postService',function($stateParams,postService){

                            var _getrankList_url="/match/rankList";

                            return postService.matchs($stateParams,_getrankList_url);

                        }]
                    },

                    controller:['$rootScope','$scope','$stateParams','ranks','weiXinService',
                        function($rootScope,$scope,$stateParams,ranks,weiXinService){

                            $scope.$on('onFinishRender', function () {
                                weiXinService.onMenuShareAppMessage('榜单-'+$scope.match.name,$scope.description_nl,_staticUrl+$scope.match.img);
                            });

                            $scope.$parent.myScrollOptions = {
                                'ranksWrap': {
                                    snap: true,
                                    mouseWheel:true,
                                    click:true,
                                    tap:true,
                                    bounce:false,
                                    onScrollEnd: function ()
                                    {
                                        alert('finshed scrolling wrapper2');
                                    }
                                }
                            };

                            $scope.index = 0;

                            $scope.ranks = ranks.data.data;

                            var _rank = ranks.data.data[0];

                            $scope.rank = _rank;

                            $rootScope.$loading = 0;

                            $scope.changeRank = function(rank,index){

                                $scope.rank = rank;
                                $scope.index = index;

                            }

                            $scope.clickRank= function(rank,index){
                                $scope.rank = rank;
                                $scope.index = index;
                                $scope.isClick = true;
                                $scope.showUpBtn = false;
                                $scope.showRankList = false;
                            }


                            $scope.showRankList = false;

                            $scope.showUpBtn = false;

                        }]
                })
        }
    ]
);
