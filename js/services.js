angular.module('Letu.services', [])

.factory('Team',['postService','$rootScope',
  function(postService,$rootScope) {
    return {
      getPriv:function(team_id,successCallback){

        $rootScope.isSHowLoading = false;

        var _getPriv_url = "/team/getPriv";

        var _params = {
          'team_id':team_id
        };

        if(angular.isUndefined(successCallback)){
          var success = function(data){

            if(data.status){
              $rootScope.priv = data.data;

            }else{
              $rootScope.priv = 0;

            }
          }
        }else{
          var success = function(data){
            successCallback(data);
          }
        }
        postService.doPost(_params,_getPriv_url,success);

      },
      getTeamInfo: function(team_id,successCallback,errorCallback) {

        var _getTeamInfo_url = "/team/getTeamInfo";

        var _params = {
          'team_id':team_id
        };

        if(angular.isDefined(successCallback)){
          var success = function(data){
            successCallback(data);
          }
        }

        if(angular.isDefined(errorCallback)){
          var error = function(data){
              errorCallback(data);
          }
        }
        postService.doPost(_params,_getTeamInfo_url,success,error);
      },
      getTeamMember:function(team_id,successCallback,errorCallback){

        var _getMemberList_url = "/team/getMemberList";

        var _params = {
          'team_id':team_id
        };

        if(angular.isDefined(successCallback)){
          var success = function(data){
            successCallback(data);
          }
        }

        if(angular.isDefined(errorCallback)){
          var error = function(data){
            errorCallback(data);
          }
        }

        postService.doPost(_params,_getMemberList_url,success,error)

      },
      getNews:function(team_id,page,successCallback,errorCallback){

        var _getNewsList_url = "/team/getNewsList";

        var _params = {
          'team_id':team_id,
          'page':page
        };

        if(angular.isDefined(successCallback)){
          var success = function(data){
            successCallback(data);
          }
        }

        if(angular.isDefined(errorCallback)){
          var error = function(data){
            errorCallback(data);
          }
        }

        postService.doPost(_params,_getNewsList_url,success,error)

      },
      getTeamWaitMember:function(team_id,successCallback,errorCallback){

        var _getWaitMemberList_url = "/team/waitMemberList";

        var _params = {
          'team_id':team_id
        };


        if(angular.isDefined(successCallback)){
          var success = function(data){
            successCallback(data);
          }
        }

        if(angular.isDefined(errorCallback)){
          var error = function(data){
            errorCallback(data);
          }
        }

        postService.doPost(_params, _getWaitMemberList_url,success,error);
      },
      updateJob:function(team_id,member_id,job,successCallback,errorCallback){

        var _updateJob_url = "/team/updateJob";

        var _params = {
          'team_id':team_id,
          'member_id':member_id,
          'job':job
        };

        if(angular.isDefined(successCallback)){
          var success = function(data){
            successCallback(data);
          }
        }

        if(angular.isDefined(errorCallback)){
          var error = function(data){
            errorCallback(data);
          }
        }

        postService.doPost(_params,_updateJob_url,success, error);

      },
      delMember:function(team_id,member_id,successCallback,errorCallback){

        var _delMember_url = "/team/delMember";

        var _params = {
          'team_id':team_id,
          'member_id':member_id
        };
        if(angular.isDefined(successCallback)){
          var success = function(data){
            successCallback(data);
          }
        }

        if(angular.isDefined(errorCallback)){
          var error = function(data){
            errorCallback(data);
          }
        }

        postService.doPost(_params, _delMember_url,success,error);
      },
      acceptJoin:function(team_id,member_id,state,successCallback,errorCallback){

        var _acceptJoin_url = "/team/acceptJoin";

        var _params = {
          'team_id':team_id,
          'member_id':member_id,
          'state':state
        };

        if(angular.isDefined(successCallback)){
          var success = function(data){
            successCallback(data);
          }
        }

        if(angular.isDefined(errorCallback)){
          var error = function(data){
            errorCallback(data);
          }
        }

        postService.doPost(_params, _acceptJoin_url,success,error);
      }

    };
  }
])
.factory('User',['postService','$rootScope','$ionicModal','Auth','Storage',
  function(postService,$rootScope,$ionicModal,Auth,Storage) {

    return {

      getUser:function(uid,successCallback,errorCallback){

        var _url_getUser = "/member/getUser"

        var _params = {
          'uid':uid
        };

        if(angular.isDefined(successCallback)){
          var success = function(data){
            successCallback(data);
          }
        }

        if(angular.isDefined(errorCallback)){
          var error = function(data){
            errorCallback(data);
          }
        }

        postService.doPost(_params,_url_getUser,success, error);

      },
      getMyTeams:function(successCallback,errorCallback){

        var _url_myTeams = '/user/myTeams';

        if(angular.isDefined(successCallback)){
          var success = function(data){
            successCallback(data);
          }
        }

        if(angular.isDefined(errorCallback)){
          var error = function(data){
            errorCallback(data);
          }
        }

        postService.doPost({},_url_myTeams,success, error);


      },
      selectUser:function(callback,title,selected){

        selected=angular.isArray(selected)?selected:[];
        var _userPath = {
          page:0
        };
        $rootScope.selects = [];

        $rootScope.userHasNextPage = false;

        var loadUserAttentions = function(){

          var _url_userAttentions = '/user/userAttentions';

          postService.doPost(_userPath,_url_userAttentions,function(data){

            if(data.data.cur_page>=data.data.total_page){
              $rootScope.userHasNextPage = false;
            }else{
              $rootScope.userHasNextPage = true;
            }

            var items = data.data.attentions;

            for (var i = 0; i < items.length; i++) {

              items[i]['is_selected'] = selected.indexOf(items[i]['baid'])==-1?false:true;

              $rootScope.selects.push(items[i]);

            }
            $rootScope.$broadcast('scroll.infiniteScrollComplete');
          });
        }
        loadUserAttentions();

        $ionicModal.fromTemplateUrl('templates/selectUserModal.html', {
          scope: $rootScope
        }).then(function(modal){
          $rootScope.selectUserModal = modal;
          $rootScope.selectUserModalTitle = title;
          $rootScope.selectUserModal.show();

          $rootScope.userModalSelected = function(){

            var _selected = [];
            angular.forEach($rootScope.selects,function(select,index){

              if(!select.is_selected){
                $rootScope.selects.splice(index,1);
              }else{
                _selected.push(select.baid);
              }
            })
            callback($rootScope.selects,_selected);
            $rootScope.selectUserModal.hide();
          }
        })

      }

    };
  }
])
.factory('Login',['$rootScope','$ionicModal','Storage',
  function($rootScope,$ionicModal,Storage) {

    $ionicModal.fromTemplateUrl('templates/loginModal.html', {
      scope: $rootScope
    }).then(function(modal){
      $rootScope.loginModal = modal;
    })

    return {

      showLogin:function(login,wechatLogin,register,sendsms){

        $rootScope.loginModal.show();

        $rootScope.isSMSLogin = false;
        $rootScope.isTime = false;

        $rootScope.login = {
          type:1,
          phone:'',
          code:'',
          password:'',
          isCanSms:false
        };

        $rootScope.sendSms  = function(){

          $rootScope.$apply(function(){
            $('#sms').focus();
          })

          $rootScope.login.isCanSms = false;

          $rootScope.countdown = 60;

          var myTime = setInterval(function() {
            $rootScope.isTime = true;
            $rootScope.countdown--;
            $rootScope.$digest(); // 通知视图模型的变化
          }, 1000);

          setTimeout(function() {
            clearInterval(myTime);
            $rootScope.isTime = false;
            $rootScope.login.isCanSms = true;
            $rootScope.$digest();
          }, 60000);

          sendsms($rootScope.login.phone);
        }

        $rootScope.validatePhone = function(phone){

          var reg = /(^13\d{9}$)|(^14)[5,7]\d{8}$|(^15[0,1,2,3,5,6,7,8,9]\d{8}$)|(^17)[6,7,8]\d{8}$|(^18\d{9}$)/g ;
          if(phone.length==11){
            if(reg.test(phone)){
              $rootScope.login.isCanSms = true;
            }else{
              $rootScope.login.isCanSms = false;
              alert('手机格式错误!');
            }

          }else{
            $rootScope.login.isCanSms = false;
          }
        }

        $rootScope.loginAction = function(){

          if($rootScope.login.phone.length<11){
            alert('手机号码少于11位');

            return false;
          }

          if($rootScope.login.password.length<1){
            alert('请输入密码');
            return false;
          }

          login($rootScope.login.phone,$rootScope.login.password);

        }

        $rootScope.registerAction = function(){

          if($rootScope.login.phone.length<11){

            alert('手机号码少于11位');
            return false;

          }

          if($rootScope.login.code.length<4){
            alert('验证码不少于4位');
            return false;
          }

          if($rootScope.login.password.length<1){
            alert('请输入密码');
            return false;
          }

          register($rootScope.login.phone,$rootScope.login.password,$rootScope.login.code);

        }

        //微信登陆
        $rootScope.wechatLogin = function(){

          //var openid = Storage.get('openId');

          var openid = null;

          if(openid!=null){

            wechatLogin(openid);

          }else{

            var _hash = window.location.hash;

            var _href = window.location.origin+window.location.pathname;

            _href+='?router='+_hash.substr(1);

            window.location.href = "http://www.letusport.com/index.php/mobile/auth/directWeixinLogin?backUrl/"+encodeURIComponent(_href);
          }
        }

        $rootScope.loginModal.show();

      }

    };
  }
])
.factory('Storage', function() {
  "use strict";
  return {
    set: function(key, data) {
      return window.localStorage.setItem(key, window.JSON.stringify(data));
    },
    get: function(key) {
      if(angular.isUndefined(window.localStorage.getItem(key))){
       return '';
      }
      return window.JSON.parse(window.localStorage.getItem(key));
    },
    remove: function(key) {
      return window.localStorage.removeItem(key);
    }
  };
})
.service('TimePickerService',['Storage',function (Storage) {

  this.getFullYear = function(date){

    var days = [];

    var year =date.getFullYear();

    var month = date.getMonth();

    var day = date.getDate();

    var cur = new Date();

    var cur_year =cur.getFullYear();

    var cur_month = cur.getMonth();

    var cur_day = cur.getDate();

    for(var j = month+1;j<13;j++){

      date.setMonth(j);

      date.setDate(0);

      var daysCount = date.getDate();

      for(var k = day;k<=daysCount;k++){

        date.setDate(k);

        if(j==cur_month+1&&k==cur_day) {

          var object = {
            'text': '今天',
            'value': moment(date).format('YYYY-MM-DD')
          };

        }else{
          var object = {
            'text':moment(date).format('MM月DD日 dddd'),
            'value':moment(date).format('YYYY-MM-DD')
          };
        }
        days.push(object);
      }
      day = 1;
    }

    year+=1;

    date.setYear(year);

    date.setMonth(1);

    date.setDate(0);

    for(var j= 1;j<13;j++){

      date.setMonth(j);

      date.setDate(0);

      var daysCount = date.getDate();

      for(var k = 1;k<=daysCount;k++){

        date.setDate(k);

        var object = {
          'text':moment(date).format('YY年MM月DD日 dddd'),
          'value':moment(date).format('YYYY-MM-DD')
        };

        days.push(object);
      }

    }
    return days;
  }

  this.getYears = function() {
    var years = [];
    for (var i = 1900; i < 2101; i++) years.push(i);
    return years;
  };
  this.getMonths = function(){
    var months = [];
    for(var i=1;i<13;i++) months.push(i);
    return months;
  }
  this.getHours = function(){

    var _hours = Storage.get('hours');

    if(!angular.isArray(_hours)){
      _hours = [];
      var _minutes = '';
      for(var i=0;i<24;i++){
        i=i<10?'0'+i:i;
        for(var j=0;j<4;j++){
          _minutes=j*15;
          _minutes=_minutes==0?'0'+_minutes:_minutes;

          _hours.push(i+':'+_minutes);
        }

      }
      Storage.set('hours',_hours);
    }
    return _hours;
  }

  this.getMinutes = function(){
    var minutes = [];
    for(var i=0;i<60;i++){
      i=i<10?'0'+i:i;
      minutes.push(i);
    }
    return minutes;
  }
}
])
.factory('Auth', ['postService','Storage','$ionicLoading',
  function(postService,Storage,$ionicLoading) {

    return {
      validateLogin: function () {

        return (Storage.get('authToken')==null||Storage.get('user')==null)?false:true;

      },
      login:function(phone,password,successCallback,errorCallback){

        var _login_url = "/auth/login";

        if(angular.isDefined(successCallback)){
          var success = function(data){
            successCallback(data);
          }
        }

        if(angular.isDefined(errorCallback)){
          var error = function(data){
            errorCallback(data);
          }
        }

        var _params = {
          username:phone,
          password:password
        };

        postService.doPost(_params, _login_url,success,error);

      },
      loginByOpenId:function(openid,successCallback,errorCallback){
        var _loginByOpenId_url = "/auth/loginByOpenId";

        if(angular.isDefined(successCallback)){
          var success = function(data){
            successCallback(data);
          }
        }

        if(angular.isDefined(errorCallback)){
          var error = function(data){
            errorCallback(data);
          }
        }

        var _params = {
          openid:openid
        };

        postService.doPost(_params, _loginByOpenId_url,success,error);
      },
      wechatLogin:function(){//微信登陆处理

        var getQueryString =  function(name) {

          var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
          var r = window.location.search.substr(1).match(reg);
          if (r != null) return unescape(r[2]); return null;

        }

        var code = getQueryString("code");

        //alert(code);

        if(code!=null){

          //var _opt = {
          //  template:'登陆中...',
          //  duration:10000
          //}
          //
          //$ionicLoading.show(_opt);

          //postService.showMsg('登录中...');

          var _getOpenId_url = "/auth/getOpenId";

          var _path = {
            code:code
          };

          postService.doPost(_path,_getOpenId_url,function(data){


            Storage.set('authToken',data.authToken);

            var openid = data.data.openid;

            if(openid==null){

              openid=0;

            }

            Storage.set('openId',openid);


            Storage.set('user',data.data);

            window.location.search = '';


          },function(data){
              window.location.search = '';
          })

        }
      },
      logout:function(successCallback){
        var _login_url = "/auth/logout";
        postService.doPost({}, _login_url,successCallback);
      }
    }
  }
])
.service('Tools',['Storage','$http',
      function(Storage,$http) {

        this.getCityList = function(){

          var _city = Storage.get('cityList');

          if(!angular.isArray(_city)) {

            $http.get('js/cityList.json').success(function(data){

              Storage.set('cityList',data);

              _city = data;

            })
          }

          return _city

        }

        this.validatePhone = function(phone){
          var reg = /(^13\d{9}$)|(^14)[5,7]\d{8}$|(^15[0,1,2,3,5,6,7,8,9]\d{8}$)|(^17)[6,7,8]\d{8}$|(^18\d{9}$)/g ;
          if(phone.length==11){
            if(reg.test(phone)){
              return true;
            }else{
              return false;
            }
          }
          return false;
        }

        this.validateNull = function(value){
          if(angular.isUndefined(value)||value==''||value==null){
            return true;
          }

          return false;

        }

        this.json_encode = function(array){
          return window.JSON.stringify(array)
        }

        this.json_decode = function(json){
          return window.JSON.parse(json);
        }

        this.parse = function(log,type){

          var _log_data = log.log_data;

          switch (log.data_type){
            case "101"://发起约战
                log.title = log.title.replace(/#(\S*)#/,'<a href="#/invite/'+log.data_id+'">#$1#</a>');
              break;
            case "102"://用户创建活动
                log.title = log.title.replace(/#(\S*)#/,'<a href="#/activity/'+log.data_id+'">#$1#</a>');
              break;
            case "103"://加入球队
                log.title = log.title.replace(/#(\S*)#/,'<a href="#/team/'+log.data_id+'">#$1#</a>');
              break;
            case "104"://创建球队
                log.title = log.title.replace(/#(\S*)#/,'<a href="#/team/'+log.data_id+'">#$1#</a>');
              break;
            case "105"://发布动态
              log.title = log.title.replace(/#(\S*)#/,'<a href="#/team/'+log.data_id+'">#$1#</a>');
              break;
            case "202"://球队球友分享照片
                log.title = log.title.replace(/#(\S*)#/,'<a href="#/team/'+log.blid+'/album/'+log.data_id+'/$1">#$1#</a>');
                //log.title = log.title.replace(/@(\S*)=(\S*)=/,'<a href="#/member/id/$2">@$1</a>');
              break;
            case "203"://球队创建活动
              log.title = log.title.replace(/#(\S*)#/,'<a href="#/activity/'+log.data_id+'">#$1#</a>');
              break;
          }
          log.title = log.title.replace(/@(\S*)=(\S*)=/,'<a href="#/member/$2">@$1</a>');

          if(log.title.length>150&&type==1){
            log.title = log.title.substr(0,150)+'...<a>查看全部</a>';
          }
          return log;
        }
      }
    ]
)
.factory('weiXinService',function(){
  return{
    onMenuShareAppMessage:function(title,desc,imgUrl,link,type,dataUrl){

      wx.showAllNonBaseMenuItem();

      imgUrl = imgUrl==undefined?_staticUrl+'mobile/images/letu.png':imgUrl;
      link = link==undefined?window.location.href:link;

      wx.onMenuShareAppMessage({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接
        imgUrl: imgUrl, // 分享图标
        type: type, // 分享类型,music、video或link，不填默认为link
        dataUrl: dataUrl, //如果type是music或video，则要提供数据链接，默认为空
        success: function () {
          // 用户确认分享后执行的回调函数
        },
        cancel: function () {
          // 用户取消分享后执行的回调函数
        }
      });

      wx.onMenuShareTimeline({
        title: title+'-'+desc, // 分享标题
        link: link, // 分享链接
        imgUrl: imgUrl, // 分享图标
        success: function () {
          // 用户确认分享后执行的回调函数
        },
        cancel: function () {
          // 用户取消分享后执行的回调函数
        }
      });

    },
    hideMenuItems:function(){
      wx.hideAllNonBaseMenuItem();
    }
  }
})
.factory('postService', ['$http','$rootScope','$ionicLoading','Storage','Login',
  function($http,$rootScope,$ionicLoading,Storage,Login) {

    var doRequest = function(path,url) {
      path.authToken = Storage.get('authToken');
      return $http({
        method: 'POST',
        url: baseUrl+url,
        data:path
      });
    }

    var show = function(msg){
      layer.open({
        content: msg,
        style:'text-align: center;',
        time: 1
      });

    }
    var confirm = function(content,yesCallBack,btn,noCallBack){
      if(angular.isUndefined(btn)){
        btn = ['确定', '取消'];
      }
      if(angular.isUndefined(noCallBack)){
        noCallBack = function(){

        }
      }
      layer.open({
        content: content,
        btn: btn,
        style:'text-align: center;',
        yes:yesCallBack , no:noCallBack
      });
    }
    var showLogin = function () {

      Login.showLogin(function (phone,password) {

        var _login_url = "/auth/login";

        var _params = {
          username:phone,
          password:password
        };
        doRequest(_params,_login_url).success(function(data){

          if(data.status) {

            Storage.set('authToken', data.authToken);

            Storage.set('user', data.data);

            $rootScope.user = Storage.get('user');

            var _url_getUser = "/member/getUser"

            var _params = {
              'uid':$rootScope.user.uid
            };
            doRequest(_params,_url_getUser).success(function (data) {
              $rootScope.user.attention_num = data.data.attention_num;
              $rootScope.user.invite_num = data.data.invite_num;
              $rootScope.user.bbs_num = data.data.bbs_num;
              $rootScope.user.team_num = data.data.team_num;

            });

            $rootScope.isLogin = true;

            $rootScope.loginModal.hide();

          }else{
            show(data.msg);
          }

        })
      },function(openid) {
        var _loginByOpenId_url = "/auth/loginByOpenId";

        var _params = {
          openid: openid
        };

        doRequest(_params, _loginByOpenId_url).success(function (data) {

          if (data.status) {

            Storage.set('authToken', data.authToken);

            Storage.set('user', data.data);

            $rootScope.user = Storage.get('user');

            var _url_getUser = "/index/getUser"

            var _params = {
              'uid': $rootScope.user.uid
            };
            doRequest(_params, _url_getUser).success(function (data) {
              $rootScope.user.attention_num = data.data.attention_num;
              $rootScope.user.invite_num = data.data.invite_num;
              $rootScope.user.bbs_num = data.data.bbs_num;
              $rootScope.user.team_num = data.data.team_num;
            });

            $rootScope.isLogin = true;

            $rootScope.loginModal.hide();

          }else {
              var _href = window.location.href;
              location.href = "http://www.letusport.com/index.php/mobile/auth/directWeixinLogin?backUrl/"+encodeURIComponent(_href);
          }
        });
      },function(phone,password,code){

        var _register_url = "/auth/register";

        var _params = {
          phone: phone,
          password:password,
          code:code
        };

        doRequest(_params,_register_url).success(function(data){

          show(data.msg);

        })

      },function(phone){

        var _sms_url = "/auth/sms";

        var _params = {
          phone: phone,
          type:1
        };

        doRequest(_params,_sms_url).success(function(data){

          show(data.msg);

        })


      })
    }
    return {
      matchs: function(path,url) {

        return doRequest(path,url);
      },
      doPostPromise: function(path,url) {
        return doRequest(path,url);
      },
      doPost:function(path,url,successCallback,errorCallback){

        if($rootScope.isSHowLoading!=false){
          $ionicLoading.show();
        }

        doRequest(path,url).success(function(data){

          $ionicLoading.hide();

          if(data.status){

            if(angular.isUndefined(successCallback)){
              show(data.msg);
            }else{
              successCallback(data);
            }

          }else{
            if(data.data==100){

                showLogin();

            }else{

              if(angular.isUndefined(errorCallback)){
                if(angular.isUndefined(data.msg)){
                  show('网络错误');
                }else{
                  show(data.msg);
                }

              }else{
                errorCallback(data);
              }

            }
          }
        }).error(function(){
          $ionicLoading.hide();
          show('网络错误');
        })
      },
      showMsg:function(msg){
        show(msg);
      },
      confirm:function(content,yesCallBack,btn,noCallBack){
        confirm(content,yesCallBack,btn,noCallBack);
      },showLogin:function(){
        showLogin();
      }
    };
  }
])
.filter('imgFilter', function(ENV) {
  return function(src,type,width,height,thumb_type) {

    console.log(src);
    console.log(type);
    // add https protocol
    if (src) {
      if(type==600){
        src = 'http://match.app.letusport.com/storage/web/source/'+src;
      }else{
        src = src.substr(0,4)=='http'?src:ENV.staticUrl+src;
      }


      if(angular.isDefined(width)&&angular.isDefined(height)){
        var pos = src.lastIndexOf(".");
        src = src.substring(0, pos) + '-'+width+'-'+height+'-'+thumb_type+'.' + src.substring(pos+1, src.length);
        //src1 = src.replace(/./i,'-'+width+'-'+height+'.');
      }


      //console.log(src1);

    }else{
      switch (type){
        case 100://默认球队头像
          src = 'http://www.letusport.com/uploads/team/no_photo.jpg';
          break;
        case 101://默认球队banner
          src = 'http://www.letusport.com/uploads/team/team_banner.png';
          break;
        case 200://默认用户头像
          src = 'http://www.letusport.com/uploads/team/no_photo.jpg';
          break;
        case 300://默认动态图片
          src = 'http://www.letusport.com/uploads/team/no_photo.jpg';
          break;
        case 400://默认约战图片
          src = 'http://www.letusport.com/uploads/team/no_photo.jpg';
          break;
        case 500://默认投票活动图片
          src = 'http://www.letusport.com/uploads/vote_default.jpg';
          break;

      }
    }
    return src;
  };
})
.filter('bindFilter', function() {
    return function(text,defaultText) {

      if(text==''){
        text = defaultText;
      }
      return text;
    };
  })
.directive(
  // Collection-repeat image recycling while loading
  // ttps://github.com/driftyco/ionic/issues/1742h
  'resetImg',
  function($document) {
    return {
      restrict: 'A',
      link: function($rootScope, $element, $attributes) {
        var applyNewSrc = function(src) {
          var newImg = $element.clone(true);

          newImg.attr('src', src);
          $element.replaceWith(newImg);
          $element = newImg;
        };

        $attributes.$observe('src', applyNewSrc);
        $attributes.$observe('ngSrc', applyNewSrc);
      }
    };
  }
)
.directive('focusMe', ['$timeout', function($timeout) {
  return {
    scope: { trigger: '@focusMe' },
    link: function(scope, element) {
      scope.$watch('trigger', function(value) {
        if(value) {
          $timeout(function() {
            console.log($(element[0]).val('11'));
            $(element[0]).focus();
            //element[0].focus();
            
          });
        }
      });
    }
  };
}])
.directive('onFinishRender', ['$timeout', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      $timeout(function() {
        scope.$emit('onFinishRender');
      });
    }
  }
}])
.factory('Tabs', function() {
  return [
    {
      'value':0,
      'lab':'全部'
    },
    {
      'value':1,
      'lab':'足球',
      'level':["专业","准专业","曾经校队队员","曾经系队队员","中等业余水平","随便踢踢","想踢但没踢过"],
      'trait':["守时","不守时","速度快","速度较慢","意识好","意识一般","动作大","动作很注意","体力好","体力差","喜欢指点队友","不喜欢指指点点的队友","喜欢团体氛围","喜欢独处","喜欢比赛氛围","不喜欢比赛"],
      'invite':["11VS11","8VS8","7VS7","5VS5","3VS3"]
    },
    {
      'value':2,
      'lab':'篮球',
      'level':["专业","准专业","曾经校队队员","曾经系队队员","企业队主力","中等业余水平","随便踢踢","爱打但不太会打"],
      'trait':["守时","不守时","身高占优势","身高不占优势","身体壮","身体不是很壮","技术好","技术不好","速度快","速度慢","体力好","体力差","拼抢凶狠","拼抢不凶","喜欢指点队友","不喜欢指指点点的队友","喜欢团体氛围","喜欢独处","喜欢比赛氛围","不喜欢比赛"],
      'invite':["5VS5","3VS3"]
    },
    {
      'value':3,
      'lab':'网球',
      'level':["专业","专业教练","非常好","很不错","初学","只是爱好","NTRP2.5","NTRP3.0","NTRP3.5","NTRP4.0","NTRP4.5","NTRP5.0","NTRP5.5","NTRP6.0","不知道级别"],
      'trait':["守时","不守时","喜欢双打","喜欢单打","左撇子","右手执拍","稳稳击球","发球上网","攻击型选手","削球手","底线球手","输球有风度的","输球没风度的","喜欢团体氛围","喜欢独处","喜欢比赛氛围","不喜欢比赛"],
      'invite':["单打","双打"]
    },
    {
      'value':4,
      'lab':'乒乓球',
      'level':["专业","准专业","业余高手","业余中高手","业余中等","随便打打","不太会打"],
      'trait':["守时","不守时","喜欢双打","喜欢单打","左撇子","右手执拍","相持型选手","发球攻击型","削球手","喜拉弧旋球","喜推挡","喜调动对手","输球有风度的","输球没风度的","喜欢团体氛围","喜欢独处","喜欢比赛氛围","不喜欢比赛"],
      'invite':["单打","双打"]
    },
    {
      'value':5,
      'lab':'羽毛球',
      'level':["专业","准专业","业余高手","业余中高手","业余中等","随便打打","不太会打"],
      'trait':["守时","不守时","喜欢双打","喜欢单打","左撇子","右手执拍","相持型选手","攻击型选手","力量型选手","灵巧型选手","输球有风度的","输球没风度的","喜欢团体氛围","喜欢独处","喜欢比赛氛围","不喜欢比赛"],
      'invite':["单打","双打"]
    },
    {
      'value':6,
      'lab':'高尔夫',
      "level":["专业","单差","差点10-19","差点20-29","差点30-36","差点36以上","不知道差点","初学"],
      "trait":["守时","不守时","长打型","木杆不远","木杆远但不稳定","切杆好","切杆不好","长铁好","长铁不好","中铁好","中铁不好","短铁好","短铁不好","推杆好","推杆不好","稳定性好","起伏大","动作标准","动作自成一体","输球有风度的","输球没风度的","喜欢团体氛围","喜欢独处","喜欢比赛氛围","不喜欢比赛"],
      'invite':["1约3","2约2","3约1"]
    },
    {
      'value':7,
      'lab':'斯诺克',
      'level':["专业","单杆记录100以上","单杆记录50以上","单杆记录30以上","单杆记录20以上","单杆记录16以上","随便打打","不太会打"],
      'trait':["守时","不守时","左手为主","右手为主","喜进攻","喜防守","喜作斯诺克","打球快","打球偏慢","输球有风度的","输球没风度的","喜欢团体氛围","喜欢独处","喜欢比赛氛围","不喜欢比赛"],
      'invite':["1约1"]
    },
    {
      'value':8,
      'lab':'美式台球',
      'level':["专业","准专业","业余高手","业余中高手","业余中等","随便打打","不太会打"],
      'trait':["守时","不守时","喜打8球落袋","喜打9球","懂礼仪","不太懂礼仪但想学习","不注重礼仪","输球有风度的","输球没风度的","喜欢团体氛围","喜欢独处","喜欢比赛氛围","不喜欢比赛"],
      'invite':["1约1"]
    },
    {
      'value':9,
      'lab':'其他',
      'level':["专业","准专业","业余高手","业余中高手","业余中等","随便打打","不太会打"],
      'trait':["守时","不守时","喜打8球落袋","喜打9球","懂礼仪","不太懂礼仪但想学习","不注重礼仪","输球有风度的","输球没风度的","喜欢团体氛围","喜欢独处","喜欢比赛氛围","不喜欢比赛"],
      'invite':["1约1"]
    }
  ]
})
//.directive('loadPublish', ['$timeout','$rootScope','$ionicModal', function ($timeout,$rootScope,$ionicModal) {
//  return {
//    restrict: 'A',
//    link: function (scope, element, attr) {
//
//      var _modal = null;
//
//      $ionicModal.fromTemplateUrl('templates/tabAddModal.html', {
//        scope: scope,
//        animation: 'slide-in-up'
//      }).then(function(modal){
//        _modal = modal;
//        scope.editNameModal = modal;
//      });
//
//      $timeout(function(){
//
//        $rootScope.addF = function(){
//
//          scope.editNameModal.show();
//        }
//
//        scope.$on('$destroy', function() {
//
//          $ionicModal.fromTemplateUrl('templates/tabAddModal.html', {
//            scope: scope,
//            animation: 'slide-in-up'
//          }).then(function(modal){
//            _modal = modal;
//            scope.editNameModal = modal;
//          });
//        });
//
//      })
//
//    }
//  }
//}])
.directive("loadWeixin", ['$rootScope','postService',function($rootScope,postService) {
  return {
    restrict: "A",
    link: function(scope, element, attrs) {

      var _getWeiXinSignPackage_url="/match/getWeiXinSignPackage";

      var _url = location.href.split('#')[0];
      var path = {
        'url':_url
      }
      postService.matchs(path,_getWeiXinSignPackage_url).success(function(data,status){

        var sign = data.data;

        $rootScope.sign = sign;

        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: sign.appId, // 必填，公众号的唯一标识
          timestamp: sign.timestamp, // 必填，生成签名的时间戳
          nonceStr: sign.nonceStr, // 必填，生成签名的随机串
          signature: sign.signature,// 必填，签名，见附录1
          jsApiList: [
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'hideMenuItems',
            'showMenuItems',
              'showAllNonBaseMenuItem',
              'hideAllNonBaseMenuItem'
          ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });

        wx.hideAllNonBaseMenuItem();
        //wx.hideMenuItems({
        //  menuList: ['menuItem:share:appMessage','menuItem:share:timeline'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        //});

      });
    }
  }
}])
.directive("jumpUrl", ['$state','Tools',function($state,Tools) {
  return {
    restrict: "A",
    link: function(scope, element, attrs) {

        element.on("click",function(){
          var _params = eval('('+attrs. jumpParams+')');
          $state.go(attrs.jumpUrl,_params);
        })

    }
  }
}])