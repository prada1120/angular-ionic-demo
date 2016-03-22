var baseUrl='http://www.letusport.com/mobile';
var _staticUrl = 'http://www.letusport.com/';
angular.module('starter', ['ionic','angularMoment','Letu.controllers',
  'Letu.homeControllers','Letu.teamControllers','Letu.findControllers', 'Letu.buyControllers','Letu.inviteControllers','Letu.voteControllers','Letu.liveControllers','Letu.articleControllers','Letu.activityControllers', 'Letu.userControllers', 'Letu.memberControllers',
  'Letu.services','ngFileUpload','tabSlideBox','ngIOS9UIWebViewPatch'])
    .constant("ENV", {
      // "name": "production",
      "accessToken": '',
      "debug": false,
      "api": "http://ionichina.com/api/v1",
      "staticUrl":"http://www.letusport.com/",
      "appleId": 'id981408438',
      'version':'1.0.1'
    })
    .run(function(amMoment,Auth,Tabs,Storage,$rootScope,weiXinService){
      // set moment locale
      amMoment.changeLocale('zh-cn');

      Storage.set('tabs',Tabs);

      Auth.wechatLogin();

      $rootScope.$on('WeiXinLoad',function(event,data){

        if(angular.isUndefined(data)){
          $rootScope.$broadcast('WeiXinRoot');
        }else{
          $rootScope.$broadcast('WeiXinLoadCtrl',data);
        }

      })

      wx.hideAllNonBaseMenuItem();
      $rootScope.$on('$ionicView.beforeLeave', function() {

        wx.hideAllNonBaseMenuItem();

      });
    })
.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

      //设置默认返回按钮的文字
      $ionicConfigProvider.backButton.previousTitleText(false).text('返回');

      //$httpProvider.interceptors.push('imeoutHttpIntercept');
      $ionicConfigProvider.views.maxCache(5);
      //配置选项卡，让tab在iOS和Android都显示在底部
      $ionicConfigProvider.tabs.position('bottom');
      $ionicConfigProvider.tabs.style('standard');
      //让nav标题在iOS和Android上都居中显示
      $ionicConfigProvider.navBar.alignTitle('center');

  $stateProvider

      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
        controller: 'tabCtrl'
      })
      .state('tab.find',{
        url: '/find',
        views: {
          'tab-search': {
            templateUrl: 'templates/find/index.html',
            controller: 'findCtrl'
          }
        }
      })
      .state('teamList',{
        cache:false,
        url: '/teamList',
        templateUrl: 'templates/team/team.list.html',
        controller: 'TeamListCtrl'
      })
      .state('team', {
        url: '/team/:team_id',
        templateUrl: 'templates/team.html',
        cache:false,
        abstract: true,
        resolve:{
          TeamInfo:['$stateParams','$rootScope','postService',function($stateParams,$rootScope,postService){

            var _team_id = $stateParams.team_id;

            var _getTeamInfo_url = "/team/getTeamInfo";

            var _params = {
              'team_id':_team_id
            };

            return postService.doPostPromise(_params,_getTeamInfo_url);

          }]
        },
        controller: 'TeamCtrl'
      })
      .state('team.detail',{
        url: '',
        views:{
          'teamView':{
            templateUrl: 'templates/team/team.detail.html',
            resolve:{
              TeamInfo:['$stateParams','$rootScope','postService',function($stateParams,$rootScope,postService){

                var _team_id = $stateParams.team_id;

                var _getTeamInfo_url = "/team/getTeamInfo";

                var _params = {
                  'team_id':_team_id
                };

                return postService.doPostPromise(_params,_getTeamInfo_url);

              }]
            },
            controller: 'TeamDetailCtrl'
          }
        }
      })
      .state('team.edit',{
        url: '/edit',
        views: {
          'teamView': {
            templateUrl: 'templates/team/team.edit.html',
            controller: 'TeamEditCtrl'
          }
        }
      })
      .state('team.news',{
        url: '/news',
        views: {
          'teamView': {
            templateUrl: 'templates/team/team.news.html',
            controller: 'TeamNewsCtrl'
          }
        }
      })
      .state('team.dynamicDetail',{
        url: '/dynamic/:id',
        views: {
          'teamView': {
            templateUrl: 'templates/team/team.news.dynamic.html',
            controller: 'TeamDynamicDetailCtrl',
            resolve: {
              dynamic: ['$stateParams','postService',function($stateParams,postService){

                var _getDynamicDeatail="/index/dynamicDetail";

                var _path = $stateParams;

                return postService.matchs(_path,_getDynamicDeatail);

              }]
            }
          }
        }
      })
      .state('team.newsDetail',{
        url: '/news/:id',
        views: {
          'teamView': {
            templateUrl: 'templates/team/team.news.detail.html',
            controller: 'TeamNewsDetailCtrl',
            resolve: {
              news: ['$stateParams','postService',function($stateParams,postService){

                var _getNewsDetail_url="/team/newsDetail";

                var _path = $stateParams;

                _path.type = 2;

                return postService.matchs(_path,_getNewsDetail_url);

              }]
            }
          }
        }
      })
      .state('team.ranks',{
        url: '/ranks',
        cache:false,
        views: {
          'teamView': {
            templateUrl: 'templates/team/team.ranks.html',
            controller: 'TeamRanksCtrl'
          }
        }
      })
      .state('team.rankAdd',{
        url: '/ranks/add',
        views: {
          'teamView': {
            templateUrl: 'templates/team/team.rank.add.html',
            controller: 'TeamRankAddCtrl'
          }
        }
      })
      .state('team.rankEdit',{
        url: '/ranks/edit/:rank_id',
        cache:false,
        views: {
          'teamView': {
            templateUrl: 'templates/team/team.rank.add.html',
            controller: 'TeamRankEditCtrl',
            resolve: {
              rank: ['$stateParams','postService',function($stateParams,postService){

                var _getOriginalRank_url="/team/getOriginalRank";

                var _path = $stateParams;

                return postService.matchs(_path,_getOriginalRank_url);

              }]
            }
          }
        }
      })
      .state('team.rankDetail',{
        url: '/ranks/:rank_id',
        views: {
          'teamView': {
            templateUrl: 'templates/team/team.rank.html',
            controller: 'TeamRankCtrl'
          }
        }
      })
      .state('team.albums',{
        url: '/albums',
        views: {
          'teamView': {
            templateUrl: 'templates/team/team.albums.html',
            controller: 'TeamAlbumsCtrl'
          }
        }
      })
      .state('team.album',{
        url: '/album/:album_id/:album_name',
        views: {
          'teamView': {
            templateUrl: 'templates/team/team.album.html',
            controller: 'TeamAlbumCtrl'
          }
        }
      })
      .state('team.members',{
        url:'/members',
        views:{
          'teamView': {
            templateUrl: 'templates/team/team.members.html',
            controller: 'TeamMembersCtrl'
          }
        }
      })
      .state('team.waitMembers',{
        url:'/wait-members',
        views:{
          'teamView': {
            templateUrl: 'templates/team/team.members.wait.html',
            controller: 'TeamWaitMembersCtrl'
          }
        }
      })
      .state('team.glories',{
        url:'/glories',
        views:{
          'teamView': {
            templateUrl: 'templates/team/team.glories.html',
            controller: 'TeamGloriesCtrl'
          }
        }
      })
      .state('team.activities',{
        url:'/activities',
        views:{
          'teamView': {
            templateUrl: 'templates/team/team.activities.html',
            controller: 'TeamActivitiesCtrl'
          }
        }
      })
      .state('inviteList',{
        cache:false,
        url: '/invites',
        templateUrl: 'templates/invite/list.html',
        controller: 'InviteListCtrl'
      })
      .state('invite', {
        url: '/invite/:invite_id',
        templateUrl: 'templates/team.html',
        abstract: true,
        resolve: {
          'info':['$stateParams','$rootScope','postService',function($stateParams,$rootScope,postService){

            var _params = {
              invite_id:$stateParams.invite_id
            };

            var _url = '/invite/detail';

            postService.doPost(_params,_url,function(data){

              $rootScope.invite = data.data;

              $rootScope.invite.is_end = moment().format('X')>$rootScope.invite.open_time;

              var _open_time = moment.unix(data.data.open_time);

              $rootScope.invite.open_date = _open_time.format('YYYY-MM-DD');

              $rootScope.invite.open_hours = _open_time.format('HH:mm');

            })
          }]
        },
        controller: 'InviteCtrl'
      })
      .state('invite.detail',{
        url: '',
        views:{
          'teamView':{
            templateUrl: 'templates/invite/detail.html',
            controller: 'InviteDetailCtrl'
          }
        }
      })
      .state('invite.waitMembers',{
        url:'/wait-members',
        views:{
          'teamView': {
            templateUrl: 'templates/invite/members.wait.html',
            controller: 'InviteWaitMembersCtrl'
          }
        }
      })
      .state('invite.edit',{
        url: '/edit',
        views: {
          'teamView': {
            templateUrl: 'templates/invite/edit.html',
            controller: 'InviteEditCtrl'
          }
        }
      })
      .state('activityList',{
        cache:false,
        url: '/activities',
        templateUrl: 'templates/activity/list.html',
        controller: 'ActivityListCtrl'
      })
      .state('activity', {
        url: '/activity/:activity_id',
        templateUrl: 'templates/team.html',
        abstract: true,
        resolve: {
          'activity':['$stateParams','$rootScope','postService',function($stateParams,$rootScope,postService){

            var _params = {
              activity_id:$stateParams.activity_id
            };

            var _url = '/activity/detail';

            postService.doPost(_params,_url,function(data){

              $rootScope.activity = data.data;

              $rootScope.activity.openDay = moment.unix(data.data.open_time).format('YYYY-MM-DD');
              $rootScope.activity.openHours = moment.unix(data.data.open_time).format('HH:mm');

              $rootScope.activity.deadlineDay = moment.unix(data.data.deadline).format('YYYY-MM-DD');
              $rootScope.activity.deadlineHours = moment.unix(data.data.deadline).format('HH:mm');

            })
          }]
        }
      })
      .state('activity.detail',{
        url: '',
        views:{
          'teamView':{
            templateUrl: 'templates/activity/detail.html',
            controller: 'ActivityDetailCtrl'
          }
        }
      })
      .state('activity.waitMembers',{
        url:'/wait-members',
        views:{
          'teamView': {
            templateUrl: 'templates/activity/members.wait.html',
            controller: 'ActivityWaitMembersCtrl'
          }
        }
      })
      .state('activity.edit',{
        url: '/edit',
        views: {
          'teamView': {
            templateUrl: 'templates/activity/edit.html',
            controller: 'ActivityEditCtrl'

          }
        }
      })
      .state('articleList',{
        cache:false,
        url: '/articleList',
        templateUrl: 'templates/article/list.html',
        controller: 'ArticleListCtrl'
      })
      .state('articleDetail',{
        url: '/article/:id',
        templateUrl: 'templates/article/detail.html',
        controller: 'ArticleDetailCtrl',
        resolve: {
          article: ['$stateParams', '$rootScope', 'postService', function ($stateParams, $rootScope, postService) {

            var _params = {
              id:$stateParams.id
            };

            var _url_articleDetail = '/index/articleDetail';

            return postService.doPostPromise(_params,_url_articleDetail);

          }]
        }
      })
      .state('voteList',{
        url: '/voteList',
        templateUrl: 'templates/vote/list.html',
        controller: 'VoteListCtrl'
      })
      .state('vote', {
        url: '/vote/:vote_id',
        templateUrl: 'templates/team.html',
        abstract: true,
        resolve:{
          info:['$stateParams','$rootScope','postService',function($stateParams,$rootScope,postService){

            var _params = {
              vote_id:$stateParams.vote_id
            };

            var _url = '/vote/detail';

            postService.doPost(_params,_url,function(data){

              $rootScope.vote = data.data;

            })
          }]
        },
        controller: 'VoteCtrl'
      })
      .state('vote.detail',{
        url: '',
        views:{
          'teamView':{
            templateUrl: 'templates/vote/detail.html',
            controller: 'VoteDetailCtrl'
          }
        }
      })
      .state('vote.voted',{
        url: '/voted/:option_id',
        views:{
          'teamView':{
            templateUrl: 'templates/vote/voted.html',
            controller: 'VoteVotedCtrl',
            resolve: {
              option: ['$stateParams', '$rootScope', 'postService', function ($stateParams, $rootScope, postService) {

                var _params = {
                  option_id: $stateParams.option_id
                };

                var _url = '/vote/option';

                return postService.doPostPromise(_params, _url);
              }]
            }
          }
        }
      })
      .state('vote.award',{
        url: '/award/:prize_id',
        views:{
          'teamView':{
            templateUrl: 'templates/vote/award.html',
            controller: 'VoteAwardCtrl'
          }
        }
      })
      .state('vote.log',{
        url: '/log/:prize_id',
        views:{
          'teamView':{
            templateUrl: 'templates/vote/log.html',
            controller: 'VoteLogCtrl'
          }
        }
      })
      .state('liveList',{
        url: '/liveList',
        templateUrl: 'templates/live/list.html',
        controller: 'LiveListCtrl'
      })
      .state('live', {
        url: '/live/:tourney_id',
        templateUrl: 'templates/team.html',
        abstract: true,
        controller: 'LiveCtrl'
      })
      .state('live.detail',{
        cache:false,
        url: '',
        views:{
          'teamView':{
            templateUrl: 'templates/live/detail.html',
            controller: 'LiveDetailCtrl'
          }
        }
      })
      .state('tab.index', {
        url: '/index',
        views: {
          'tab-index': {
            templateUrl : 'templates/home/index.html',
            controller: 'homeCtrl'
          }
        }
      })
      .state('home', {
        url: '/home',
        templateUrl: 'templates/team.html',
        abstract: true
      })
      .state('home.dynamic', {
        url: '/dynamic/:id',
        views: {
          'teamView': {
            templateUrl: 'templates/home/dynamic.html',
            controller: 'HomeDynamicCtrl',
            resolve: {
              dynamic: ['$stateParams', 'postService', function ($stateParams, postService) {

                var _getDynamicDeatail = "/index/dynamicDetail";

                var _path = $stateParams;

                return postService.matchs(_path, _getDynamicDeatail);

              }]
            }
          }
        }
      })
      .state('tab.buy', {
        url: '/buy',
        views: {
          'tab-buy': {
            templateUrl : 'templates/buy/index.html',
            controller: 'buyCtrl'
          }
        }
      })
      .state('tab.user', {
        url: '/user',
        cache:false,
        views: {
          'tab-user': {
            templateUrl : 'templates/user/index.html',
            controller: 'userCtrl'
          }
        }
      })
      .state('user',{
        url: '/user/outer',
        abstract: true,
        templateUrl : 'templates/team.html',
        resolve:{
          auth:['Storage','$state','$timeout', function (Storage,$state,$timeout) {

            if(Storage.get('authToken')==null||Storage.get('user')==null){
              layer.open({
                content: '还未登录...',
                style:'text-align: center;',
                time: 1,
                end:function(){
                  $state.go("tab.user");
                }
              });
            }

          }]
        }
      })
      .state('user.edit',{
        url:'/edit',
        cache:false,
        views: {
          'teamView':{
            templateUrl: 'templates/user/edit.html',
            controller: 'userEditCtrl'
          }
        }
      })
      .state('user.setting',{
        url:'/setting',
        views: {
          'teamView':{
            templateUrl: 'templates/user/setting.html',
            controller: 'userSettingCtrl'
          }
        }
      })
      .state('user.modifyPassword',{
        url:'/modifyPassword',
        views: {
          'teamView':{
            templateUrl: 'templates/user/modifyPassword.html',
            controller: 'userModifyPasswordCtrl'
          }
        }
      })

      .state('user.team',{
        url:'/team',
        views: {
          'teamView':{
            templateUrl: 'templates/user/team.html',
            controller: 'userTeamCtrl'
          }
        }
      })
      .state('user.attention',{
        url:'/attention',
        views: {
          'teamView':{
            templateUrl: 'templates/user/attention.html',
            controller: 'userAttentionCtrl'
          }
        }
      })
      .state('user.fans',{
        url:'/fans',
        views: {
          'teamView':{
            templateUrl: 'templates/user/fans.html',
            controller: 'userFansCtrl'
          }
        }
      })
      .state('user.invite',{
        url:'/invite',
        views: {
          'teamView':{
            templateUrl: 'templates/user/invite.html',
            controller: 'userInviteCtrl'
          }
        }
      })
      .state('user.dynamic',{
        url:'/dynamic',
        views: {
          'teamView':{
            templateUrl: 'templates/user/dynamic.html',
            controller: 'userDynamicCtrl'
          }
        }
      })
      .state('user.activity',{
        url:'/activity',
        views: {
          'teamView':{
            templateUrl: 'templates/user/activity.html',
            controller: 'userActivityCtrl'
          }
        }
      })
      .state('user.match',{
        url:'/match',
        views: {
          'teamView':{
            templateUrl: 'templates/user/match.html',
            controller: 'userMatchCtrl'
          }
        }
      })
      .state('member',{
        url: '/member/:member_id',
        templateUrl: 'templates/team.html',
        abstract: true,
        resolve:{
          member:['$stateParams','$rootScope','postService','Storage',function($stateParams,$rootScope,postService,Storage){

            var _params = {
              member_id:$stateParams.member_id
            };

            var _url = '/member/info';

            postService.doPost(_params,_url,function(data){

              $rootScope.member = data.data;

              var _tabs = Storage.get('tabs');

              _tabs.shift();

              var _selected_tabs= [];

              var _user_levels = $rootScope.member.level;//获取用户水平信息

              var _user_traits = $rootScope.member.trait;//获取用户特点信息

              if(_user_levels!=''&&_user_levels!=null&&angular.isDefined(_user_levels)){
                _user_levels = JSON.parse(_user_levels);//解析成数组
              }else{
                _user_levels = [];
              }

              if(_user_traits!=''&&_user_levels!=null&&angular.isDefined(_user_traits)){
                _user_traits = JSON.parse(_user_traits);
              }else{
                _user_traits = [];
              }

              /**
               * 组拼选中数据
               */
              angular.forEach(_tabs,function(_val,_index) {

                var _data = [];

                var _levels = [];

                angular.forEach(_val.level, function (_level, _index) {

                  if (angular.isDefined(_user_levels[_val.value])) {//验证用户水平中是否存在该项目

                    if (_user_levels[_val.value].indexOf(_level) != -1) {//判断用户水平中是否有该水平

                      _data.push({'project':_val.lab,'name':_level});

                    }
                  }

                })

                /**
                 * 处理特点与水平一致
                 * @type {Array}
                 * @private
                 */
                var _traits = [];

                angular.forEach(_val.trait,function(_trait,_index){


                  if(angular.isDefined(_user_traits[_val.value])){
                    if(_user_traits[_val.value].indexOf(_trait)!=-1){

                      _data.push({'project':_val.lab,'name':_trait});

                    }
                  }

                })

                if(_data.length>0){
                  _selected_tabs.push(_data);
                }

              })

              $rootScope.member.levels = _selected_tabs;

            })
          }]
        }
      })
      .state('member.info',{
        url:'',
        views: {
          'teamView':{
            templateUrl: 'templates/member/index.html',
            controller: 'memberInfoCtrl'
          }
        }
      })
      .state('member.attention',{
        url:'/attention',
        views: {
          'teamView':{
            templateUrl: 'templates/member/attention.html',
            controller: 'memberAttentionCtrl'
          }
        }
      })
      .state('member.fans',{
        url:'/fans',
        views: {
          'teamView':{
            templateUrl: 'templates/member/fans.html',
            controller: 'memberFansCtrl'
          }
        }
      })
      .state('member.invite',{
        url:'/invite',
        views: {
          'teamView':{
            templateUrl: 'templates/member/invite.html',
            controller: 'memberInviteCtrl'
          }
        }
      })
      .state('member.team',{
        url:'/team',
        views: {
          'teamView':{
            templateUrl: 'templates/member/team.html',
            controller: 'memberTeamCtrl'
          }
        }
      })
      .state('member.dynamic',{
        url:'/dynamic',
        views: {
          'teamView':{
            templateUrl: 'templates/member/dynamic.html',
            controller: 'memberDynamicCtrl'
          }
        }
      })
      .state('member.level',{
        url:'/level',
        views: {
          'teamView':{
            templateUrl: 'templates/member/level.html',
            controller: 'memberLevelCtrl'
          }
        }
      })
      .state('letu',{
        url:'/letu',
        templateUrl: 'templates/user/letu.html',
        controller: 'letuCtrl'
      })

  $urlRouterProvider.otherwise('/tab/index');

})

.filter('trustHtml', function ($sce) {

  return function (input) {

    return $sce.trustAsHtml(input);

  }

})

.config(function($httpProvider) {

  $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    /**
     * The workhorse; converts an object to x-www-form-urlencoded serialization.
     * @param {Object} obj
     * @return {String}
     */
    var param = function(obj) {
      var query = '';
      var name, value, fullSubName, subName, subValue, innerObj, i;

      for (name in obj) {
        value = obj[name];

        if (value instanceof Array) {
          for (i = 0; i < value.length; ++i) {
            subValue = value[i];
            fullSubName = name + '[' + i + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        } else if (value instanceof Object) {
          for (subName in value) {
            subValue = value[subName];
            fullSubName = name + '[' + subName + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        } else if (value !== undefined && value !== null) {
          query += encodeURIComponent(name) + '='
          + encodeURIComponent(value) + '&';
        }
      }

      return query.length ? query.substr(0, query.length - 1) : query;
    };

    return angular.isObject(data) && String(data) !== '[object File]'
        ? param(data)
        : data;
  }];
})

.constant("$ionicLoadingConfig",{

  template : "加载中...",

  duration:10000

})
;
