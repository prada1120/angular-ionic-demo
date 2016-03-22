var baseUrl='http://www.letusport.com/index.php/mobile';
var _staticUrl = 'http://match.app.letusport.com/storage/web/source/'
angular.module('letu', [
  'letu.match',
  'ui.router',
  'ngAnimate',
  'ng-iscroll'
])
    .run(
    [          '$rootScope', '$state', '$stateParams',
      function ($rootScope,   $state,   $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$loading = false;
        $rootScope.staticUrl = _staticUrl;
      }
    ]
    )
    .directive('onFinishRender', ['$timeout', function ($timeout) {
      return {
        restrict: 'A',
        link: function (scope, element, attr) {
            $timeout(function () {
              scope.$emit('onFinishRender');
            });
          }
      }
    }])
    .directive("swiperDirective", ['$timeout',function($timeout) {
      return {
        restrict: "A",
        link: function(scope, element, attrs) {
          var _id = attrs.id;
          var _slidesPerView = parseInt(attrs.slidesperview);
          var _slidesPerGroup = parseInt(attrs.slidesperview);

          $timeout(function () {
            var mySwiper = element.swiper({
              pagination: "#"+_id+" .swiper-pagination",
              slidesPerView: _slidesPerView,
              slidesPerGroup:_slidesPerGroup,
              slidesPerColumn: 1,
              paginationClickable: true,
              spaceBetween: 0
            });
          });
        }
      }
    }])
    .directive("loadWeixin", ['$rootScope','postService',function($rootScope,postService) {
      return {
        restrict: "A",
        link: function(scope, element, attrs) {

          if(angular.isUndefined($rootScope.sign)){
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
                  'onMenuShareAppMessage'
                ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
              });

            });
          }
        }
      }
    }])

    //.directive('ocLazyLoad', ['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    //  return {
    //    restrict: 'A',
    //    link: function (scope, element, attr) {
    //      $timeout(function () {
    //        scope.$emit('ngRepeatFinished');
    //      });
    //    }
    //  }
    //}])
    //.directive("bnDocumentClick", function( $document, $parse ){
    //
    //  //将Angular的上下文链接到DOM事件
    //  var linkFunction = function( $scope, $element, $attributes ){
    //
    //
    //    //获得表达式
    //    var scopeExpression = $attributes.bnDocumentClick;
    //
    //    //使用$parse来编译表达式
    //    var invoker = $parse( scopeExpression );
    //
    //
    //    //绑定click事件
    //    $document.on(
    //        "click",
    //        function(event){
    //
    //          //当点击事件被触发时，我们需要再次调用AngularJS的上下文。再次，我们使用$apply()来确保$digest()方法在幕后被调用
    //  $scope.$apply(
    //    function(){
    //
    //
    //      //在scope中调用处理函数，将jQuery事件映射到$event对象上
    //      invoker(
    //          $scope,
    //          {
    //            $event: event
    //          }
    //      );
    //
    //    }
    //);
    //
    //        }
    //    );
    //
    //
    //    //当父控制器被从渲染文档中移除时监听"$destory"事件
    //
    //  };
    //
    //  //返回linking函数
    //  return( linkFunction );
    //
    //}
//)
    .config(function($httpProvider) {
      //iScrollServiceProvider.configureDefaults(
      //    {
      ///* Supply your default configuration object here. */
      //      iScroll: {
      //    /**
      //     * The different options for iScroll are explained in
      //     * detail at http://iscrolljs.com/#configuring
      //     **/
      //      snap: true,
      //      hScrollbar: false,
      //      click: true,
      //      tap: true,
      //      momentum: true,
      //      mouseWheel: true
      //    },
      //    directive: {
      //      /**
      //       * Delay, in ms, before we asynchronously perform an
      //       * iScroll.refresh().  If false, then no async refresh is
      //       * performed.
      //       **/
      //      asyncRefreshDelay: 0,
      //      /**
      //       * Delay, in ms, between each iScroll.refresh().  If false,
      //       * then no periodic refresh is performed.
      //       **/
      //          refreshInterval: false
      //      /**
      //       * Event handler options are added below.
      //       **/
      //    }
      //  }
      //);
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
    .filter('trustHtml', function ($sce) {

      return function (input) {

        return $sce.trustAsHtml(input);

      }

    })
    .factory('postService', ['$http','$rootScope','Storage',
      function($http,$rootScope,Storage) {

        var doRequest = function(path,url) {
          path.authToken = Storage.get('authToken');
          return $http({
            method: 'POST',
            url: baseUrl+url,
            data:path
          });
        }
        return {
          matchs: function(path,url) {
            $rootScope.$loading = true;
            return doRequest(path,url);
          }
        };
      }
    ])
    .factory('weiXinService',function(){
      return{
        onMenuShareAppMessage:function(title,desc,imgUrl,link,type,dataUrl){

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
            title: title, // 分享标题
            link: link, // 分享链接
            imgUrl: imgUrl, // 分享图标
            success: function () {
              // 用户确认分享后执行的回调函数
            },
            cancel: function () {
              // 用户取消分享后执行的回调函数
            }
          });

        }
      }
    })
.service('Tools',['Storage', function(Storage) {

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
      this.validateLogin = function () {

        return (Storage.get('authToken')==null||Storage.get('user')==null)?false:true;

      }

    }
  ]
)
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


