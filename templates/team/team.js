angular.module('Letu.teamControllers', [])

.controller('TeamListCtrl',
  ['$rootScope','$scope', '$timeout','$stateParams','postService','$ionicActionSheet',
    '$ionicPopover','$ionicModal','Upload','$ionicLoading','$ionicPopup','Auth','weiXinService','Storage','Tools',
    function($rootScope,$scope,$timeout,$stateParams,postService,$ionicActionSheet,
             $ionicPopover,$ionicModal,Upload,$ionicLoading,$ionicPopup,Auth,weiXinService,Storage,Tools
    ){

      $scope.tabs = Storage.get('tabs');

      $scope.path={
        type:0,
        province:'',
        keyword:'',
        page:0
      }

      $scope.teams = [];
      $scope.hasNextPage = false;

      /**
       * 创建球队
       */
      $ionicModal.fromTemplateUrl('templates/team/createTeamModal.html', {
        scope: $scope
      }).then(function(modal){

        $scope.createTeamModal = modal;

      });

      $scope.createTeamInfo = {};

      $scope.upload = function (file) {

        Upload.upload({
          url: baseUrl+'/team/uploadImg',
          data: {file: file}
        }).then(function (resp) {

          var _opt = {
            template:'上传完成',
            duration:200
          }
          $ionicLoading.show(_opt);

          if(angular.isDefined(resp.data.data)){
            $scope.createTeamInfo.uploadAvatarImg = _staticUrl+resp.data.data;
            $scope.createTeamInfo.uploadAvatarImg_no_pre = resp.data.data;
          }

        }, function (resp) {

          var _opt = {
            template:'上传失败',
            duration:200
          }

          $ionicLoading.show(_opt);

        }, function (evt) {

          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);

          var _opt = {
            template:'上传'+ evt.config.data.file.name+' 中...'+progressPercentage+ '% ',
            duration:30000
          }
          $ionicLoading.show(_opt);
        });
      };

      $scope.createTeamInfo.uploadAvatarImg_no_pre ='uploads/team/no_photo.jpg';
      $scope.createTeamInfo.uploadAvatarImg = _staticUrl+'uploads/team/no_photo.jpg';

      $scope.createTeamInfo.teamTypeName = '足球';

      $scope.createTeamInfo.teamType = 1;

      $scope.$on('selected',function(event,cityData,cityDataforids){
        $scope.cityData = cityData;

        $scope.cityDataforids = cityDataforids;

      })

      $scope.createTeamInfo.province = angular.isUndefined($scope.createTeamInfo.province)?'3':$scope.createTeamInfo.province;

      $scope.createTeamInfo.city = angular.isUndefined($scope.createTeamInfo.city)?'38':$scope.createTeamInfo.city;

      $scope.createTeamInfo.district = angular.isUndefined($scope.createTeamInfo.district)?'451':$scope.createTeamInfo.district;

      var getCityList = function(){

        $scope.provinceData = Tools.getCityList();

        angular.forEach($scope.provinceData,function(_province,_index){

          if($scope.createTeamInfo.province == _province.id){

            $scope.createTeamInfo.province = _province;

            $scope.cityData = _province.sub;

            angular.forEach($scope.cityData,function(_city,_index){

              if($scope.createTeamInfo.city == _city.id){

                $scope.createTeamInfo.city = _city;

                $scope.districtData = _city.sub;

                angular.forEach($scope.districtData,function(_district,_index){

                  if($scope.createTeamInfo.district == _district.id) {

                    $scope.createTeamInfo.district = _district;

                  }
                })
              }
            })
          }
        });
      }

      $scope.$watch('createTeamInfo.province',function(newValue,oldValue){

        if(newValue!=oldValue){

          $scope.cityData = newValue.sub;

          $scope.createTeamInfo.city = $scope.cityData[0];

          $scope.districtData = $scope.cityData[0].sub;

          $scope.createTeamInfo.district = $scope.districtData[0];

        }

      })
      $scope.$watch('createTeamInfo.city',function(newValue,oldValue){

        if(newValue!=oldValue){
          $scope.districtData = newValue.sub;

          $scope.createTeamInfo.district = $scope.districtData[0];
        }
      })
      $scope.$watch('createTeamInfo.district',function(newValue,oldValue){

      })
      getCityList();


      $scope.showTypePopup = function(){

        var _template = '<div class="row">'

        angular.forEach($scope.tabs,function(tab,index){

          if(tab.value!=0){

            if(index%2==0){
              _template+='<div class="col col-offset-10 popup-select-item" on-touch="selectTeamType('+tab.value+',\''+tab.lab+'\')"><label>'+tab.lab+'</label></div></div><div class="row">';
            }else{
              _template+='<div class="col popup-select-item" on-touch="selectTeamType('+tab.value+',\''+tab.lab+'\')"><label>'+tab.lab+'</label></div>';
            }
          }
        })

        _template+='</div>';

        $scope.typPopup = $ionicPopup.show({
          title: '请选择球队类型',
          template: _template,
          scope: $scope
        });
      }

      $scope.selectTeamType = function(typeId,typeName){

        $scope.createTeamInfo.teamTypeName = typeName;

        $scope.createTeamInfo.teamType = typeId;

        $scope.typPopup.close();

      }

      $scope.sumbitCreateTeam = function(){

        var _citystr = $scope.createTeamInfo.province.name+'-'+$scope.createTeamInfo.city.name+'-'+$scope.createTeamInfo.district.name;
        var _cityids = $scope.createTeamInfo.province.id+'-'+$scope.createTeamInfo.city.id+'-'+$scope.createTeamInfo.district.id;


        if(angular.isUndefined($scope.createTeamInfo.teamName)){

          layer.open({
            content: '球队名称不能为空',
            style:'text-align: center;',
            time: 1
          });
          return false;
        }

        var _createTeamUrl="/team/createTeam";

        var _params = {
          teamName:$scope.createTeamInfo.teamName,
          citydataforids:_cityids,
          citydata:_citystr,
          uploadAvatarImg_no_pre:$scope.createTeamInfo.uploadAvatarImg_no_pre,
          teamType:$scope.createTeamInfo.teamType,
          content:$scope.createTeamInfo.content
        };

        _params.cityDataforids = _cityids;

        _params.cityData = _citystr;

        console.log(_params);

        //return false;

        postService.doPost(_params,_createTeamUrl,function(data){
          var _id = data.data;
          var _team = {
            'id':_id,
            'name':$scope.createTeamInfo.teamName,
            'avatar':$scope.createTeamInfo.uploadAvatarImg_no_pre,
            'num':0,
            'is_dynamic':false,
            is_member:false,
            type:$scope.createTeamInfo.teamTypeName
          };

          $scope.teams.unshift(_team);

          $scope.createTeamModal.hide();
          postService.showMsg(data.msg);
        })
      }

      $scope.createTeam = function(){

        if(Auth.validateLogin()){
          $scope.createTeamModal.show();
        }else{
          postService.showLogin();
        }
      };
      $scope.showOpt = function(team){

        $ionicActionSheet.show({
          //titleText: 'ActionSheet Example',
          buttons: [
            {
              text: team.is_dynamic?'取消关注':'关注'
            },
            {
              text: team.priv>-1?'已加入':'申请加入'
            },
          ],
          //destructiveText: 'Delete',
          cancelText: '取消',
          buttonClicked: function (index) {
            switch (index){
              case 0:
                    $scope.addAttention(team);
                  break
              case 1:
                    $scope.joinTeam(team);
                  break;
            }
            return true;
          }
        });

      }

      $scope.loadMore = function(){

        $rootScope.isSHowLoading = false;

        var url="/team/search";

        $scope.path.page++;

        postService.doPost($scope.path,url,function(data){

          if(data.data.cur_page>=data.data.total_page){
            $scope.hasNextPage = false;
          }else{
            $scope.hasNextPage = true;
          }

          var items = data.data.teams;

          for (var i = 0; i < items.length; i++) {

            $scope.teams.push(items[i]);

          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        })
      }

      /**
       * 关注
       * @param team
       */
      $scope.addAttention = function(team){

        var _addAttentionUrl="/team/attention";

        var _params = {
          'team_id':team.id
        }

        postService.doPost(_params,_addAttentionUrl,function(data){

          team.is_dynamic = !team.is_dynamic;
          postService.showMsg(data.msg);

        })
      }

      $scope.joinTeam = function(team){

        if(team.is_member){
          layer.open({
            content: '已加入',
            style:'text-align: center;',
            time: 1
          });
          return;
        }

        layer.open({
          content: '您将申请加入'+team.name+'</br>请输入您的请求信息:</br><textarea id="joinTeamContent" style="width: 214px; height: 70px;border: 1px solid rgb(204, 204, 204);resize: none;"></textarea>',
          btn: ['发送', '取消'],
          style:'text-align: center;',
          yes: function(){

            var _content = angular.element(document.getElementById("joinTeamContent")).val();

            var _params = {
              'team_id':team.id,
              'content':_content
            }

            var _joinTeamUrl="/team/joinTeam";

            postService.doPost(_params,_joinTeamUrl,function(data){

              team.priv = 0;

              postService.showMsg(data.msg);

            })
          }, no: function(){

          }
        });
      }

      var timeout;

      $scope.inputChange=function(){

        if (timeout) {

          $timeout.cancel(timeout);

        }
        timeout = $timeout(function() {

          $scope.teams = [];

          $scope.path.page =  0 ;

          $scope.loadMore();

        }, 550);
      }

      $scope.clearSearch = function(){

        $scope.serchMacth = '';

        $scope.inputChange();

      }

      /**
       * 选择项目
       * @param tab
       */
      $scope.selectTab = function(tab){
        $scope.path.type = tab.value;
      }

      /**
       * 搜索
       */
      $scope.search = function(){

        $scope.teams = [];

        $scope.hasNextPage = false;

        $scope.path.page = 0;

        $scope.loadMore();

      }

      $scope.doRefresh = function(){

        $scope.teams = [];
        $scope.path.page = 0;

        $scope.loadMore();

        $scope.$broadcast('scroll.refreshComplete');

      }

      $scope.loadMore();

      $scope.$on('$ionicView.enter', function () {

        weiXinService.onMenuShareAppMessage('球队列表-乐土体育','每个人都是运动员');

      });

    }
  ]
)
.controller('TeamCtrl',
  ['$rootScope','$scope','$stateParams','TeamInfo','weiXinService',

    function($rootScope,$scope,$stateParams,TeamInfo,weiXinService) {

      $rootScope.teamInfo = TeamInfo.data.data;

      //$scope.$on('$ionicView.loaded',function(){
      //
      //  weiXinService.onMenuShareAppMessage( $rootScope.teamInfo.name, $rootScope.teamInfo.description_strip,_staticUrl+ $rootScope.teamInfo.avatar);
      //
      //});

      $scope.$on('WeiXinRoot',function(event){
        $scope.$emit('WeiXinLoad',$rootScope.teamInfo);
      })
    }
  ]
)
.controller('TeamDetailCtrl',
  ['$rootScope','Storage','$timeout','$scope','$stateParams','postService','Team','$ionicNavBarDelegate','$ionicPopover','weiXinService','Auth','Tools',

    function($rootScope,Storage,$timeout,$scope,$stateParams,postService,Team,$ionicNavBarDelegate,$ionicPopover,weiXinService,Auth,Tools){

      $scope.$on('WeiXinLoadCtrl',function(event,data){

        weiXinService.onMenuShareAppMessage(data.name,data.description_strip,_staticUrl+data.avatar);

      })

      $scope.$on('$ionicView.enter',function(){
      $scope.$emit('WeiXinLoad');
      })



      /**
       * 球队新闻
       */
      $scope.getTeamNews = function(){

        var _getTeamDynamicsUrl = '/team/dynamics'

        postService.doPost($stateParams,_getTeamDynamicsUrl,function(data){

          $scope.dynamics = [];
          var _dynamics = data.data;
          angular.forEach(_dynamics,function(_dynamic,_index){
            $scope.dynamics.push(Tools.parse(_dynamic));

          })

        })

      }

      $scope.getTeamNews();

      $scope.show = function(img){

        if(img==''||img==undefined){
          layer.open({
            content: '暂无球衣',
            style:'text-align: center;',
            time: 1
          });
          return;
        }
        var _img = _staticUrl+img
        wx.previewImage({
          current: _img,
          urls: [
            _img
          ]
        });
      }
      $ionicPopover.fromTemplateUrl('templates/team/detailOptPopover.html', {
        scope: $scope
      }).then(function(popover) {
        $scope.teamDetailOptPopover = popover;
      });

      $scope.showTeamDetailOptPopover = function($event) {

          $scope.teamDetailOptPopover.show($event);
      };

      $scope.addAttention = function(team){

        $scope.teamDetailOptPopover.hide();

        var _addAttentionUrl="/team/attention";

        var _params = {
          'team_id':team.id
        }

        postService.doPost(_params,_addAttentionUrl,function(data){

          team.is_attention = !team.is_attention;
          postService.showMsg(data.msg);

        })


      }

      $scope.joinTeam = function(team){

        if(!Auth.validateLogin()){
          postService.showLogin();
          return false;
        }

        if(team.is_member){
          layer.open({
            content: '已加入',
            style:'text-align: center;',
            time: 1
          });
          return;
        }

        layer.open({
          content: '您将申请加入'+team.name+'</br>请输入您的请求信息:</br><textarea id="joinTeamContent" style="width: 214px; height: 70px;border: 1px solid rgb(204, 204, 204);resize: none;"></textarea>',
          btn: ['发送', '取消'],
          style:'text-align: center;',
          yes: function(index){


            var _content = angular.element(document.getElementById("joinTeamContent")).val();

            var _params = {
              'team_id':team.id,
              'content':_content
            }

            var _joinTeamUrl="/team/joinTeam";

            postService.doPost(_params,_joinTeamUrl,function(data){

              team.priv = 0;

              postService.showMsg(data.msg);

            })

            $scope.teamDetailOptPopover.hide();

          }, no: function(){

            $scope.teamDetailOptPopover.hide();
          }
        });
      }

      $scope.exitTeam = function(team){

        layer.open({
          content: '您确定要退出:</br>'+team.name,
          btn: ['确定', '取消'],
          style:'text-align: center;',
          yes: function(){

            var _exitTeamUrl="/team/exitTeam";

            var _params = {
              'team_id':team.id
            }

            postService.doPost(_params,_exitTeamUrl,function(data){

              team.is_member = false;

              postService.showMsg(data.msg);

            })

            $scope.teamDetailOptPopover.hide();

          }, no: function(){
            $scope.teamDetailOptPopover.hide();
          }
        });
      }

      $scope.isShowOne = true;



    }
  ]
)
.controller('TeamEditCtrl',
  ['$rootScope','$scope','$stateParams','postService','Upload','$ionicLoading','$ionicModal','Team','weiXinService',
      'TeamInfo','Tools','Storage',
    function($rootScope,$scope,$stateParams,postService,Upload,$ionicLoading,$ionicModal,Team,weiXinService,TeamInfo,Tools,Storage){

      $rootScope.teamInfo = TeamInfo.data.data;

      $scope.upload = function (file,type) {

        var _uploadUrl = '';

        switch (type){
          case 1:
            _uploadUrl = '/team/updateAvatar';
            break;
          case 2:
            _uploadUrl = '/team/updateQiuYi';
            break;
          case 3:
            _uploadUrl = '/team/updateBanner';
            break;
        }

        if(_uploadUrl==''){
          postService.showMsg('系统错误');
        }

        Upload.upload({
          url: baseUrl+_uploadUrl,
          data: {
              file: file,
              'team_id':$stateParams.team_id,
              'authToken':Storage.get('authToken')
          }
        }).then(function (resp) {

          var _opt = {
            template:'上传完成',
            duration:200
          }
          $ionicLoading.show(_opt);

          var _img = resp.data.data;

          switch (type){
            case 1:
              $rootScope.teamInfo.avatar = _img;
              break;
            case 2:
              $rootScope.teamInfo.qiuyi = _img;
              break;
            case 3:
              $rootScope.teamInfo.banner = _img;
              break;
          }

        }, function (resp) {

          var _opt = {
            template:'上传失败',
            duration:200
          }

          $ionicLoading.show(_opt);
          console.log('Error status: ' + resp.status);
        }, function (evt) {

          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);

          var _opt = {
            template:'上传'+ evt.config.data.file.name+' 中...'+progressPercentage+ '% ',
            duration:30000
          }
          $ionicLoading.show(_opt);
        });
      };

      $rootScope.teamInfo.province = angular.isUndefined($rootScope.teamInfo.province)?'3':$rootScope.teamInfo.province;

      $rootScope.teamInfo.city = angular.isUndefined($rootScope.teamInfo.city)?'38':$rootScope.teamInfo.city;

      $rootScope.teamInfo.district = angular.isUndefined($rootScope.teamInfo.district)?'451':$rootScope.teamInfo.district;

      var getCityList = function(){

        $scope.provinceData = Tools.getCityList();

        angular.forEach($scope.provinceData,function(_province,_index){

          if($rootScope.teamInfo.province == _province.id){

            $rootScope.teamInfo.province = _province;

            $scope.cityData = _province.sub;

            angular.forEach($scope.cityData,function(_city,_index){

              if($rootScope.teamInfo.city == _city.id){

                $rootScope.teamInfo.city = _city;

                $scope.districtData = _city.sub;

                angular.forEach($scope.districtData,function(_district,_index){

                  if($rootScope.teamInfo.district == _district.id) {

                    $rootScope.teamInfo.district = _district;

                  }
                })
              }
            })
          }
        });
      }

      $scope.$watch('teamInfo.province',function(newValue,oldValue){

        if(newValue!=oldValue){

          $scope.cityData = newValue.sub;

          $rootScope.teamInfo.city = $scope.cityData[0];

          $scope.districtData = $scope.cityData[0].sub;

          $rootScope.teamInfo.district = $scope.districtData[0];

        }

      })
      $scope.$watch('teamInfo.city',function(newValue,oldValue){

        if(newValue!=oldValue){
          $scope.districtData = newValue.sub;

          $rootScope.teamInfo.district = $scope.districtData[0];
        }
      })
      $scope.$watch('teamInfo.district',function(newValue,oldValue){

      })
      getCityList();

      /**
       * 修改地点
       */
      $scope.submitEdit = function(){

        var _url_updateCity = "/team/updateCity";//得到新闻评论

        var _citystr = $scope.teamInfo.province.name+'-'+$scope.teamInfo.city.name+'-'+$scope.teamInfo.district.name;
        var _cityids = $scope.teamInfo.province.id+'-'+$scope.teamInfo.city.id+'-'+$scope.teamInfo.district.id;


        var _params = {
          'team_id':$stateParams.team_id,
          'cityids':_cityids,
          'citystr':_citystr
        };
        postService.doPost(_params,_url_updateCity,function(data){

          $rootScope.teamInfo.city_str = _citystr;

          postService.showMsg('修改成功');

        })

      }


      $ionicModal.fromTemplateUrl('templates/team/editNameModal.html', {
        scope: $scope
      }).then(function(modal){
        $scope.editNameModal = modal;
      });

      $scope.showNameEdit = function(type) {

        $scope.editNameModalParams = {
          title:'修改',
          content: ''
        };

        switch (type){
          case 1:
            $scope.editNameModalParams.title = '球队名';
            $scope.editNameModalParams.name = $rootScope.teamInfo.name;
            $scope.editNameModalParams.ischange = false;
            $scope.edit = function(){
              var _url_updateName = "/team/updateName";//得到新闻评论

              var _params = {
                'team_id':$stateParams.team_id,
                'name':$scope.editNameModalParams.name
              };
              postService.doPost(_params,_url_updateName,function(data){

                $rootScope.teamInfo.name = $scope.editNameModalParams.name;

                $scope.editNameModal.hide();
              })
            }
            break;
        }
        $scope.editNameModal.show();
      }

      /**
       * 修改内容
       */
      $ionicModal.fromTemplateUrl('templates/team/editModal.html', {
        scope: $scope
      }).then(function(modal){
        $scope.editModal = modal;
      });

      $scope.showEdit = function(type){

        $scope.editModalParams = {
          title:'修改内容',
          content: ''
        };

        switch (type){
          case 1://修改球队介绍
            $scope.editModalParams.title = '球队介绍';
            $scope.editModalParams.content = $rootScope.teamInfo.description_nl;
            $scope.edit = function(){
              var _url_updateDescription = "/team/updateDescription";//得到新闻评论

              var _params = {
                'team_id':$stateParams.team_id,
                'description':$scope.editModalParams.content
              };
              postService.doPost(_params,_url_updateDescription,function(data){

                $rootScope.teamInfo.description = $scope.editModalParams.content;

                $rootScope.teamInfo.description_nl = $scope.editModalParams.content;

                $rootScope.teamInfo.description_strip = $scope.editModalParams.content;

                $scope.editModal.hide();
              })
            }
            break;
          case 2://修改章程
            $scope.editModalParams.title = '球队章程';
            $scope.editModalParams.content = $rootScope.teamInfo.zhangcheng;
            $scope.edit = function(){
              var _url_updateZhangcheng = "/team/updateZhangcheng";//得到新闻评论

              var _params = {
                'team_id':$stateParams.team_id,
                'zhangcheng':$scope.editModalParams.content
              };
              postService.doPost(_params,_url_updateZhangcheng,function(data){

                $rootScope.teamInfo.zhangcheng = $scope.editModalParams.content;

                $scope.editModal.hide();
              })
            }
            break;
        }
        $scope.editModal.show();

      };

      $scope.$on('WeiXinLoadCtrl',function(event,data){

        weiXinService.onMenuShareAppMessage(data.name,data.description_strip,_staticUrl+data.avatar);

      })

     $scope.$on('$ionicView.enter',function(){         $scope.$emit('WeiXinLoad');       })


    }
  ]
)
.controller('TeamNewsDetailCtrl',
  ['$rootScope','$scope','$sce','$stateParams','Team','news','postService','$ionicModal','weiXinService',
    function($rootScope,$scope,$sce,$stateParams,Team,news,postService,$ionicModal,weiXinService){

      $scope.showReply = false;

      Team.getTeamInfo($stateParams.team_id,function(data){
        $scope.teamInfo = data.data;
      })


      $scope.news = news.data.data;

      $scope.getNewsComment = function(){

        var _getNewsComment = "/forum/lists";//得到新闻评论

        $stateParams.plate = 6;

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


      $scope.$on('$ionicView.afterEnter', function() {

        $('.news_dtl').delegate('img','click',function(){


          var _img = $(this).attr('src');

          console.log(_img);

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

      $scope.$on('WeiXinLoadCtrl',function(event,data){

        weiXinService.onMenuShareAppMessage('球队新闻-'+data.name,data.description_strip,_staticUrl+data.avatar);

      })

     $scope.$on('$ionicView.enter',function(){         $scope.$emit('WeiXinLoad');       })

      //$scope.$on('$ionicView.enter', function () {
      //
      //  weiXinService.onMenuShareAppMessage($scope.news.title,$scope.news.description);
      //
      //})
    }]
)
.controller('TeamDynamicDetailCtrl',
  ['$rootScope','$scope','$sce','$stateParams','Team','dynamic','postService','$ionicModal','weiXinService','Tools',
    function($rootScope,$scope,$sce,$stateParams,Team,dynamic,postService,$ionicModal,weiXinService,Tools){

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

      $scope.$on('WeiXinLoadCtrl',function(event,data){

        weiXinService.onMenuShareAppMessage('球队动态-'+data.name,data.description_strip,_staticUrl+data.avatar);

      })

     $scope.$on('$ionicView.enter',function(){         $scope.$emit('WeiXinLoad');       })

      //$scope.$on('$ionicView.enter', function () {
      //
      //  weiXinService.onMenuShareAppMessage($scope.dynamic.title,$scope.dynamic.title);
      //
      //})
    }]
)
.controller('TeamNewsCtrl',
['$rootScope','$scope','$stateParams','Team','postService','$ionicActionSheet','$ionicModal','$ionicLoading','Upload','$ionicListDelegate','weiXinService',
    'Tools',
  function($rootScope,$scope,$stateParams,Team,postService,$ionicActionSheet,$ionicModal,$ionicLoading,Upload,$ionicListDelegate,weiXinService,Tools){

    /**
     * 得到新闻列表
     */
    var getNewsList = function(){

      var path={
        team_id:$stateParams.team_id,
        page:0
      }

      $scope.news = [];
      $scope.hasNextPage = false;

      $scope.loadMore = function(){

        path.page++;

        Team.getNews(path.team_id,path.page,function(data){

          if(data.data.cur_page<data.data.total_page){

            $scope.hasNextPage = true;

          }else{
            $scope.hasNextPage = false;
          }

          var items = data.data.news;

          for (var i = 0; i < items.length; i++) {

            $scope.news.push(items[i]);

          }

          $scope.$broadcast('scroll.infiniteScrollComplete');

        });
      }

      /**
       * 下拉刷新
       */
      $scope.doRefresh = function(){
        path={
          team_id:$stateParams.team_id,
          page:0
        }
        $scope.news = [];
        $scope.hasNextPage = false;
        $scope.loadMore();
        $scope.$broadcast('scroll.refreshComplete');
      }

      $scope.loadMore();

      $scope.removeNews = function(_news,_index){

        layer.open({
          content: '您确定要删除该新闻？',
          btn: ['确定', '取消'],
          style:'text-align: center;',
          yes: function(){

            var _url_delNews = "/team/delNews";//删除新闻

            $scope.news.splice(_index,1);

            var _params = {
              'team_id':$stateParams.team_id,
              'id':_news.id
            };
            postService.doPost(_params,_url_delNews,function(data){

              postService.showMsg('删除成功');

            })

            //postService.showMsg('删除成功');


          }, no: function(){

          }
        });
        $ionicListDelegate.closeOptionButtons();

      }

    }

    getNewsList();

    var getDynamicList = function(){
      var _params_dynamic={
        team_id:$stateParams.team_id,
        page:0
      }

      $scope.dynamics = [];

      $scope.hasNextPage_dynamic = false;

      $scope.loadMoreDynamic = function(){

        _params_dynamic.page++;

        var _url_dynamicList = '/team/dynamicList'

        postService.doPost(_params_dynamic,_url_dynamicList,function(data){

          if(data.data.cur_page>=data.data.total_page){

            $scope.hasNextPage_dynamic = false;

          }else{
            $scope.hasNextPage_dynamic = true;
          }

          var items = data.data.dynamics;

          for (var i = 0; i < items.length; i++) {


            Tools.parse(items[i]);

            $scope.dynamics.push(items[i]);

          }

        })
      }

      $scope.doDynamicRefresh = function(){

        $scope.dynamics = [];

        _params_dynamic.page = 0;

        $scope.loadMoreDynamic();

        $scope.$broadcast('scroll.refreshComplete');

      }
      //删除动态
      $scope.delDynamic = function(_dynamic,_index){

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

              $scope.dynamics.splice(_index,1);

            })

          }, no: function(){

          }
        })
      }

      //点赞动态
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

      $scope.loadMoreDynamic();
    }
    getDynamicList();



    $scope.publishNewsModalParams = {
      'upload_imgs':[],
      'content':'',
      'ischange':false
    };
    $ionicModal.fromTemplateUrl('templates/team/publishNewsModal.html', {
      scope: $scope
    }).then(function(modal){
      $scope.publishNewsModal = modal;
      /**
       * 移除上传图片
       * @param img
       * @param index
       */
      $scope.removeImg = function(img,index){

        $scope.publishNewsModalParams.upload_imgs.splice(index,1);

      }
    });

    $scope.showPublishNewsModal = function(){
      $scope.publishNewsModal.show();
    };

    /**
     * 上传图片
     * @param files
     */
    $scope.uploadFiles = function (files) {

      var _hasUpload = $scope.publishNewsModalParams.upload_imgs.length;
      if((files.length+_hasUpload)>8){
        alert('最多只能上传9张图片');
        return false;
      }

      if (files && files.length) {

        for (var i = 0; i < files.length; i++) {
          Upload.upload({
            url: baseUrl+'/team/uploadImg',
            data: {file: files[i]}
          }).then(function (resp) {

            if(resp.data.status==0){
              var _opt = {
                template:resp.data.msg,
                duration:200
              }
              $ionicLoading.show(_opt);
            }else{
              var _opt = {
                template:'上传完成',
                duration:200
              }
              $ionicLoading.show(_opt);

              $scope.publishNewsModalParams.upload_imgs.push(resp.data.data);
            }

          }, function (resp) {

            var _opt = {
              template:'上传失败',
              duration:200
            }
            $ionicLoading.show(_opt);

          }, function (evt) {

            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);

            var _opt = {
              template:'上传'+ evt.config.data.file.name+' 中...'+progressPercentage+ '% ',
              duration:30000
            }
            $ionicLoading.show(_opt);

          });
        }
      }
    };


    //修改
    $scope.edit = function(){

      var url="/team/publishNews";

      var path = {
        'team_id':$stateParams.team_id,
        'description':$scope.publishNewsModalParams.content,
        'imgs':''
      }

      if(angular.isArray($scope.publishNewsModalParams.upload_imgs)){


        angular.forEach($scope.publishNewsModalParams.upload_imgs,function(_val,_index){

          path.imgs+=_val+'#';

        })

      }

      postService.doPost(path,url,function(data) {

        getDynamicList();

        postService.showMsg(data.msg);

        $scope.publishNewsModal.hide();

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

    $scope.$on('WeiXinLoadCtrl',function(event,data){

      weiXinService.onMenuShareAppMessage('球队新闻-'+data.name,data.description_strip,_staticUrl+data.avatar);

    })

   $scope.$on('$ionicView.enter',function(){         $scope.$emit('WeiXinLoad');       })

    //$scope.$on('$ionicView.enter', function () {
    //
    //  weiXinService.onMenuShareAppMessage('球队新闻-'+$rootScope.teamInfo.title,$rootScope.teamInfo.description_strip,_staticUrl+$rootScope.teamInfo.avatar);
    //
    //})

  }
])
.controller('TeamRanksCtrl',
  ['$rootScope','$scope', '$timeout','$stateParams','postService','$ionicActionSheet','Team','$ionicListDelegate','weiXinService',

    function($rootScope,$scope,$timeout,$stateParams,postService,$ionicActionSheet,Team,$ionicListDelegate,weiXinService){

      var path={
        team_id:$stateParams.team_id,
        page:0
      }

      $scope.ranks = [];
      $scope.hasNextPage = false;

      $scope.loadMore = function(){

        var url="/team/ranks";

        path.page++;

        postService.doPost(path,url,function(data){
          if(data.data.cur_page>=data.data.total_page){
            $scope.hasNextPage = false;
          }else{
            $scope.hasNextPage = true;
          }

          var items = data.data.ranks;

          for (var i = 0; i < items.length; i++) {

            $scope.ranks.push(items[i]);

          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        })
      }

      $scope.removeRank = function(rank,index){

        $ionicListDelegate.closeOptionButtons();

        layer.open({
          content: '您确定要删除榜单？',
          btn: ['确定', '取消'],
          style:'text-align: center;',
          yes: function(){

            var path = {
              id:rank.id
            };

            var url="/rank/delRank";

            postService.doPost(path,url,function(data){

              postService.showMsg(data.msg);

              $scope.ranks.splice(index,1);

            })

          }, no: function(){

          }
        });

      }
      $scope.loadMore();


      $scope.$on('WeiXinLoadCtrl',function(event,data){

        weiXinService.onMenuShareAppMessage('球队榜单-'+data.name,data.description_strip,_staticUrl+data.avatar);

      })

     $scope.$on('$ionicView.enter',function(){         $scope.$emit('WeiXinLoad');      })
      //$scope.$on('onCanLoadWeiXin', function (title,description,img) {
      //
      //  console.log(title);
      //  //weiXinService.onMenuShareAppMessage('球队榜单-'+$rootScope.teamInfo.title,$rootScope.teamInfo.description_strip,_staticUrl+$rootScope.teamInfo.avatar);
      //
      //})
    }
  ]
)
.controller('TeamRankAddCtrl',
['$rootScope','$scope','$state','$stateParams','postService','$ionicModal','Team','weiXinService',

  function($rootScope,$scope,$state,$stateParams,postService,$ionicModal,Team,weiXinService){

    var _rank_id = 0;

    $scope.rank = {
      name:'',
      value_title:'积分',
      sort:"2"

    }

    $scope.items = [];

    $scope.submit = function(){

      var _data = [
        {
          'sort':'排序',
          'user':'成员',
          'score':$scope.rank.value_title
        }
      ]
      angular.forEach($scope.items,function(_val,_index){

        var _item = {
          'sort':(_index+1),
          'user':_val.uname+'#'+_val.uid,
          'score':_val.score
        };

        _data.push(_item);

      })
      var _rank = {
        'id':_rank_id,
        'title':$scope.rank.name,
        'plate':2,
        'pid':$stateParams.team_id,
        'value_title':$scope.rank.value_title,
        'data':_data
      }

      var _getRankUrl = '/rank/addRank'

      postService.doPost(_rank,_getRankUrl,function(data){
        $scope.rank = data.data;

        $state.go('team.ranks', {
          team_id: $stateParams.team_id
        },{
          reload:true
        });
      })

    }

    $ionicModal.fromTemplateUrl('templates/team/showMembersModal.html', {
      scope: $scope
    }).then(function(modal){
      $scope.showMembersModal = modal;
    });

    Team.getTeamMember($stateParams.team_id,function(data){

      $scope.team = data.data.team;

      $scope.members = data.data.members;

    })

    $scope.addItem = function(){

      $scope.selectMembers = [];

      angular.forEach($scope.members,function(member,index){

        member.is_selected = false;

        member.is_checked = false;

        angular.forEach($scope.items,function(item,item_index){

          if(member.uid==item.uid){

            member.is_selected = true;

            member.is_checked = true;

          }
        })

        $scope.selectMembers.push(member);

      })

      $scope.showMembersModal.show();

      $scope.onSelected = function(){

        angular.forEach($scope.selectMembers,function(member,index){

          if(!member.is_checked&&member.is_selected){
            $scope.items.splice(index,1);
          }

          if(member.is_checked&&!member.is_selected){
            var _item = {
              uid:member.uid,
              avatar:member.uavatar,
              uname:member.uname,
              'score':0
            };
            $scope.items.push(_item);
          }

        })
        $scope.showMembersModal.hide();
      }
    }

    $scope.sortChange  = function(sort){

      switch (sort){
        case "0":
          $scope.sort = 'sort';
          $scope.order = false;
          break;
        case "1":
          $scope.sort = 'sort';
          $scope.order = true;
          break;
        case "2":
          $scope.sort = '';
          $scope.order = false;
          break;
      }

    }

    $scope.removeItem = function(_index){
      $scope.items.splice(_index,1);
    }

    $scope.$on('WeiXinLoadCtrl',function(event,data){

      weiXinService.onMenuShareAppMessage('球队榜单-'+data.name,data.description_strip,_staticUrl+data.avatar);

    })

   $scope.$on('$ionicView.enter',function(){
     $scope.$emit('WeiXinLoad');
   })

    //$scope.$on('$ionicView.enter', function () {
    //
    //  console.log($rootScope.teamInfo.title);
    //
    //  weiXinService.onMenuShareAppMessage('球队榜单-'+$rootScope.teamInfo.title,$rootScope.teamInfo.description_strip,_staticUrl+$rootScope.teamInfo.avatar);
    //
    //})
  }
]
)
.controller('TeamRankEditCtrl',
['$rootScope','$scope','$state','$stateParams','postService','$ionicModal','Team','rank','weiXinService',

  function($rootScope,$scope,$state,$stateParams,postService,$ionicModal,Team,rank,weiXinService){


    var _rank_id = $stateParams.rank_id;

    $scope.rank = {
      name:rank.data.data.title,
      value_title:rank.data.data.value_title,
      sort:"2"
    }

    console.log($scope.rank);
    $scope.items = rank.data.data.data.splice(1);

    console.log($scope.items);


    var path = {
      'rank_id':_rank_id
    };



    $scope.submit = function(){

      var _data = [
        {
          'sort':'排序',
          'user':'成员',
          'score':$scope.rank.value_title
        }
      ]
      angular.forEach($scope.items,function(_val,_index){

        var _item = {
          'sort':(_index+1),
          'user':_val.uname+'#'+_val.uid,
          'score':_val.score
        };

        _data.push(_item);

      })
      var _rank = {
        sort:$scope.rank.sort,
        id:_rank_id,
        title:$scope.rank.name,
        plate:2,
        pid:$stateParams.team_id,
        value_title:$scope.rank.value_title,
        data:_data
      }

      var _addRankUrl = '/rank/addRank'

      postService.doPost(_rank,_addRankUrl,function(data){
        $scope.rank = data.data;

        $state.go('team.ranks', {
          team_id: $stateParams.team_id
        },{
          reload:true
        });
      })

    }

    $ionicModal.fromTemplateUrl('templates/team/showMembersModal.html', {
      scope: $scope
    }).then(function(modal){
      $scope.showMembersModal = modal;
    });

    Team.getTeamMember($stateParams.team_id,function(data){

      $scope.team = data.data.team;

      $scope.members = data.data.members;

    })

    $scope.addItem = function(){

      $scope.selectMembers = [];

      angular.forEach($scope.members,function(member,index){

        member.is_selected = false;

        member.is_checked = false;

        angular.forEach($scope.items,function(item,item_index){

          if(member.uid==item.uid){

            member.is_selected = true;

            member.is_checked = true;

          }
        })

        $scope.selectMembers.push(member);

      })

      $scope.showMembersModal.show();

      $scope.onSelected = function(){

        angular.forEach($scope.selectMembers,function(member,index){

          if(!member.is_checked&&member.is_selected){
            $scope.items.splice(index,1);
          }

          if(member.is_checked&&!member.is_selected){
            var _item = {
              uid:member.uid,
              avatar:member.uavatar,
              uname:member.uname,
              'score':0
            };
            $scope.items.push(_item);
          }

        })
        $scope.showMembersModal.hide();
      }
    }

    $scope.sortChange  = function(sort){

      switch (sort){
        case "0":
              $scope.sort = 'score';
              $scope.order = false;
              break;
        case "1":
              $scope.sort = 'score';
              $scope.order = true;
              break;
        case "2":
              $scope.sort = '';
              $scope.order = false;
              break;
      }

    }

    $scope.removeItem = function(_index){
      $scope.items.splice(_index,1);
    }

    $scope.$on('WeiXinLoadCtrl',function(event,data){

      weiXinService.onMenuShareAppMessage('球队榜单-'+data.name,data.description_strip,_staticUrl+data.avatar);

    })

   $scope.$on('$ionicView.enter',function(){         $scope.$emit('WeiXinLoad');       })

    //$scope.$on('$ionicView.enter', function () {
    //
    //  weiXinService.onMenuShareAppMessage('球队榜单-'+$rootScope.teamInfo.title,$rootScope.teamInfo.description_strip,_staticUrl+$rootScope.teamInfo.avatar);
    //
    //})
  }
]
)
.controller('TeamRankCtrl',
  ['$rootScope','$scope','$stateParams','postService','weiXinService',

    function($rootScope,$scope,$stateParams,postService,weiXinService){

      $scope.getRank = function(){

        var _getRankUrl = '/team/rank'

        postService.doPost($stateParams,_getRankUrl,function(data){
          $scope.rank = data.data;
          console.log($scope.rank)
        })
      }

      $scope.getRank();

      //$scope.$on('$ionicView.enter', function () {
      //
      //  weiXinService.onMenuShareAppMessage($scope.rank.title,$scope.rank.title);
      //
      //});

      $scope.$on('WeiXinLoadCtrl',function(event,data){

        weiXinService.onMenuShareAppMessage('球队榜单-'+data.name,data.description_strip,_staticUrl+data.avatar);

      })

     $scope.$on('$ionicView.enter',function(){         $scope.$emit('WeiXinLoad');       })

    }
  ]
)
.controller('TeamAlbumsCtrl',
  ['$rootScope','$scope', '$timeout','$stateParams','postService','$ionicActionSheet','$ionicPopup','$ionicModal','$ionicListDelegate','weiXinService',

    function($rootScope,$scope,$timeout,$stateParams,postService,$ionicActionSheet,$ionicPopup,$ionicModal,$ionicListDelegate,weiXinService){

      var path={
        team_id:$stateParams.team_id,
        page:0
      }

      $scope.albums = [];
      $scope.hasNextPage = false;

      $scope.optName = '编辑';

      $scope.shouldShowDelete = false;

      $scope.showOpt = function(team){

        if($scope.shouldShowDelete){

          $scope.shouldShowDelete=false;

          $scope.optName = '编辑';

          return;
        }

        $ionicActionSheet.show({
          buttons: [
            {
              text: '添加相册'
            }
          ],
          destructiveText: '删除相册',
          cancelText: '取消',
          buttonClicked: function (index) {

            $ionicPopup.prompt({
              title: '创建相册',
              subTitle: '请输入相册名称',
              cancelText:'取消',
              okText:'确定'
            }).then(function(res) {

              if(angular.isUndefined(res)){
                return true
              }

              if(angular.equals('',res)){
                layer.open({
                  content: '请输入相册名称',
                  style:'text-align: center;',
                  time: 1
                });
                return;
              }

              var _addAlbumUrl = '/team/addAlbum'

              var _params = path;

              _params.album_name = res;

              postService.doPost(_params,_addAlbumUrl,function(data){
                $scope.doRefresh();
                postService.showMsg(data.msg);
              })

            });

            return true;
          },
          destructiveButtonClicked: function () {

            $scope.shouldShowDelete = true;

            $scope.optName = '完成'

            return true;
          }
        });
      }

      $scope.removeAlbum = function(album,index){

        $ionicListDelegate.closeOptionButtons();

        postService.confirm('确定要删除相册？',function(){

          var url="/team/delAlbum";

          var _params = path;

          _params.album_id = album.id;

          postService.doPost(_params,url,function(data){

            $scope.albums.splice(index,1);

            postService.showMsg(data.msg);

          })

        })

      }

      /**
       * 修改
       */
      $ionicModal.fromTemplateUrl('templates/team/editNameModal.html', {
        scope: $scope
      }).then(function(modal){
        $scope.editNameModal = modal;
      });

      $scope.showNameEdit = function(album) {

        $scope.editNameModalParams = {
          title:'修改相册',
          content: ''
        };

        $scope.editNameModalParams.title = '修改相册';
        $scope.editNameModalParams.name = album.title;
        $scope.editNameModalParams.ischange = false;

        $scope.edit = function(){

          album.title = $scope.editNameModalParams.name;

          $scope.editNameModal.hide();

          var _url_updateAlbum = "/team/updateAlbum";//修改相册名

          var _params = {
            'album_id':album.id,
            'team_id':$stateParams.team_id,
            'album_name':album.title
          };
          postService.doPost(_params,_url_updateAlbum,function(data){

            $scope.editNameModal.hide();

          })
        }
        $ionicListDelegate.closeOptionButtons();
        $scope.editNameModal.show();
      }

      $scope.loadMore = function(){

        var url="/team/albums";

        path.page++;

        postService.doPost(path,url,function(data){
          if(data.data.cur_page>=data.data.total_page){
            $scope.hasNextPage = false;
          }else{
            $scope.hasNextPage = true;
          }

          var items = data.data.albums;

          for (var i = 0; i < items.length; i++) {

            $scope.albums.push(items[i]);

          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        })
      }

      $scope.doRefresh = function(){

        $scope.albums = [];
        path={
          team_id:$stateParams.team_id,
          page:0
        }
        $scope.loadMore();
        $scope.$broadcast('scroll.refreshComplete');
      }

      $scope.loadMore();

      $scope.$on('WeiXinLoadCtrl',function(event,data){

        weiXinService.onMenuShareAppMessage('球队相册-'+data.name,data.description_strip,_staticUrl+data.avatar);

      })

     $scope.$on('$ionicView.enter',function(){         $scope.$emit('WeiXinLoad');       })

      //$scope.$on('$ionicView.enter', function () {
      //
      //  weiXinService.onMenuShareAppMessage('球队相册-'+$rootScope.teamInfo.title,$rootScope.teamInfo.description_strip,_staticUrl+$rootScope.teamInfo.avatar);
      //
      //});

    }

  ]
)
.controller('TeamAlbumCtrl',
  ['$rootScope','$scope','$stateParams','postService','$ionicActionSheet','$ionicModal','Upload','$ionicLoading','weiXinService',

    function($rootScope,$scope,$stateParams,postService,$ionicActionSheet,$ionicModal,Upload,$ionicLoading,weiXinService){

      var path={
        team_id:$stateParams.team_id,
        album_id:$stateParams.album_id,
        album_name:$stateParams.album_name,
        page:0
      }

      $scope.album = path;

      $scope.imgs = [];
      $scope.hasNextPage = false;

      $scope.optName = '编辑';

      $scope.shouldShowDelete = false;

      $scope.upload_imgs = [];

      $scope.uploadFiles = function (files) {

        if (files && files.length) {

          for (var i = 0; i < files.length; i++) {

            Upload.upload({
              url: baseUrl+'/team/uploadImg',
              data: {file: files[i]}
            }).then(function (resp) {

              if(resp.data.status==0){
                var _opt = {
                  template:resp.data.msg,
                  duration:200
                }
                $ionicLoading.show(_opt);
              }else{
                var _opt = {
                  template:'上传完成',
                  duration:200
                }
                $ionicLoading.show(_opt);

                $scope.upload_imgs.push(resp.data.data);
              }

            }, function (resp) {

              var _opt = {
                template:'上传失败',
                duration:200
              }
              $ionicLoading.show(_opt);

            }, function (evt) {

              var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);

              var _opt = {
                template:'上传'+ evt.config.data.file.name+' 中...'+progressPercentage+ '% ',
                duration:30000
              }
              $ionicLoading.show(_opt);

            });
          }

        }

      };

      /**
       * 移除相册图片
       * @param img
       * @param index
       */
      $scope.removeAlbumImg = function(img,index){


        if(angular.isUndefined(img)){
          layer.open({
            content: '请选择需要删除的图片',
            style:'text-align: center;',
            time: 1
          });
        }

        var url="/team/delAlbumImg";

        var _params = path;

        _params.img_id = img.id;

        postService.doPost(_params,url,function(data){
          $scope.imgs.splice(index,1);
        })
      }

      /**
       * 移除上传图片
       * @param img
       * @param index
       */
      $scope.removeImg = function(img,index){

        $scope.upload_imgs.splice(index,1);

      }

      $scope.showOpt = function(team){

        if($scope.shouldShowDelete){

          $scope.shouldShowDelete=false;

          $scope.optName = '编辑';

          return;
        }

        $ionicActionSheet.show({

          buttons: [
            {
              text: '添加图片'
            }
          ],
          destructiveText: '删除图片',
          cancelText: '取消',
          buttonClicked: function (index) {

            $scope.uploadAlbumImg();

            return true;

          },
          destructiveButtonClicked: function () {

            $scope.shouldShowDelete = true;

            $scope.optName = '完成'

            return true;
          }
        });
      }

      /**
       * 上传照片
       * @type {Array}
       * @private
       */

      $ionicModal.fromTemplateUrl('templates/team/uploadAlbumImgs.html', {
        scope: $scope
      }).then(function(modal){
        $scope.uploadImgModal = modal;
      });

      $scope.uploadAlbumImg = function(){
        $scope.uploadImgModal.show();
      };

      $scope.sumbitUpload =function(){

        if(angular.isUndefined($scope.upload_imgs)){
          layer.open({
            content: '没有上传图片',
            style:'text-align: center;',
            time: 1
          });
          return;
        }

        var _imgs = '';
        angular.forEach($scope.upload_imgs,function(val,key){
          _imgArray.unshift(_staticUrl+val);
          _imgs+=val+'#';
        })

        var url="/team/uploadAlbumImg";

        var _params = path;

        _params.imgs = _imgs;

        postService.doPost(_params,url,function(data){
          $scope.doRefresh();

          $scope.upload_imgs = [];

          $scope.uploadImgModal.hide();

          postService.showMsg(data.msg);
        })
      }

      var _imgArray = [];

      $scope.loadAll = function(){

        _imgArray = [];

        var url="/team/allImgs";

        postService.doPost(path,url,function(data){
          var _imgs = data.data;

          angular.forEach(_imgs,function(_val,key){

            _imgArray.push(_staticUrl+_val['img']);

          })
        })
      }

      $scope.loadAll();

      $scope.loadMore = function(){

        var url="/team/albumImgs";

        path.page++;

        postService.doPost(path,url,function(data){
          if(data.data.cur_page>=data.data.total_page){
            $scope.hasNextPage = false;
          }else{
            $scope.hasNextPage = true;
          }

          var items = data.data.imgs;

          for (var i = 0; i < items.length; i++) {

            $scope.imgs.push(items[i]);

          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        })
      }

      $scope.doRefresh = function(){

        $scope.imgs = [];
        path={
          team_id:$stateParams.team_id,
          album_id:$stateParams.album_id,
          page:0
        }
        $scope.loadMore();

        $scope.$broadcast('scroll.refreshComplete');

      }

      $scope.show = function(img){

        wx.previewImage({
          current: _staticUrl+img,
          urls: _imgArray
        });

      }

      $scope.loadMore();

      $scope.$on('WeiXinLoadCtrl',function(event,data){

        weiXinService.onMenuShareAppMessage('球队相册-'+data.name,data.description_strip,_staticUrl+data.avatar);

      })

     $scope.$on('$ionicView.enter',function(){         $scope.$emit('WeiXinLoad');       })

      //$scope.$on('$ionicView.enter', function () {
      //
      //  weiXinService.onMenuShareAppMessage('球队相册-'+$rootScope.teamInfo.title,$rootScope.teamInfo.description_strip,_staticUrl+$rootScope.teamInfo.avatar);
      //
      //});

    }

  ]
)
.controller('TeamMembersCtrl',
  ['$rootScope','ENV','$scope', '$timeout','$stateParams','postService','Team','$ionicActionSheet','$ionicLoading','weiXinService',

    function($rootScope,ENV,$scope,$timeout,$stateParams,postService,Team,$ionicActionSheet,$ionicLoading,weiXinService){

      Team.getTeamMember($stateParams.team_id,function(data){

        $scope.team = data.data.team;

        $scope.members = data.data.members;

      })

      $scope.showOpt = function(member,member_index){

        $ionicActionSheet.show({

          buttons: [
            {
              text: '设为队长'
            },
            {
              text: '设为队委'
            },
            {
              text: '贬为队员'
            },
          ],
          destructiveText: '删除成员',
          cancelText: '取消',
          buttonClicked: function (index) {

            var _job = 1;
            var _jobname = '队员';
            switch (index){
              case 0:
                _job=3;
                _jobname='队长';
                //$rootScope.teamInfo.priv = 3;
                  break;
              case 1:
                _job=4;
                _jobname='队委';
                //$rootScope.teamInfo.priv = 4;
                  break;
              case 2:
                _job = 1;
                _jobname = '队员'
                //$rootScope.teamInfo.priv = 1;
                  break;
            }

            Team.updateJob($stateParams.team_id,member.id,_job,function(data){

              member.job_name = _jobname;

              postService.showMsg(data.msg);

            });
            return true;
          },
          destructiveButtonClicked: function () {

            Team.delMember($stateParams.team_id,member.id,function(data){

              $scope.members.splice(member_index,1);
              //$rootScope.teamInfo.priv = 0;
              postService.showMsg(data.msg);

            })
            return true;
          }

        });

      }

      $scope.$on('WeiXinLoadCtrl',function(event,data){

        console.log(data);
        weiXinService.onMenuShareAppMessage('球队成员-'+data.name,data.description_strip,_staticUrl+data.avatar);

      })

     $scope.$on('$ionicView.enter',function(){         $scope.$emit('WeiXinLoad');       })

      //$scope.$on('$ionicView.enter', function () {
      //
      //  weiXinService.onMenuShareAppMessage('球队成员-'+$rootScope.teamInfo.title,$rootScope.teamInfo.description_strip,_staticUrl+$rootScope.teamInfo.avatar);
      //
      //});

    }

  ]
)
.controller('TeamWaitMembersCtrl',
  ['$rootScope','ENV','$scope', '$timeout','$stateParams','postService','Team','$ionicActionSheet','$ionicLoading','weiXinService',

    function($rootScope,ENV,$scope,$timeout,$stateParams,postService,Team,$ionicActionSheet,$ionicLoading,weiXinService){

      Team.getTeamWaitMember($stateParams.team_id,function(data){
        $scope.members = data.data;
      });

      $scope.showOpt = function(member,member_index){

        $ionicActionSheet.show({

          buttons: [
            {
              text: '审核通过'
            }
          ],
          destructiveText: '拒绝',
          cancelText: '取消',
          buttonClicked: function (index) {

            Team.acceptJoin($stateParams.team_id,member.id,1,function(data){

              member.state = 1;

              postService.showMsg(data.msg);

            });
            return true;
          },
          destructiveButtonClicked: function () {

            Team.acceptJoin($stateParams.team_id,member.id,2,function(data){

              member.state = 2;

              postService.showMsg(data.msg);

            });

            return true;
          }

        });

      }

      $scope.$on('WeiXinLoadCtrl',function(event,data){

        weiXinService.onMenuShareAppMessage('球队成员-'+data.name,data.description_strip,_staticUrl+data.avatar);

      })

     $scope.$on('$ionicView.enter',function(){         $scope.$emit('WeiXinLoad');       })

      //$scope.$on('$ionicView.enter', function () {
      //
      //  weiXinService.onMenuShareAppMessage('球队成员-'+$rootScope.teamInfo.title,$rootScope.teamInfo.description_strip,_staticUrl+$rootScope.teamInfo.avatar);
      //
      //});


    }

  ]
)
.controller('TeamGloriesCtrl',
  ['$rootScope','ENV','$scope', '$timeout','$stateParams','postService','$ionicModal','$ionicLoading','$ionicListDelegate','weiXinService',

    function($rootScope,ENV,$scope,$timeout,$stateParams,postService,$ionicModal,$ionicLoading,$ionicListDelegate,weiXinService){

      var url="/team/glories";

      var _params = $stateParams;


      postService.doPost(_params,url,function(data){

        $scope.glories = data.data;

      })

      /**
       * 修改
       */
      $ionicModal.fromTemplateUrl('templates/team/editNameModal.html', {
        scope: $scope
      }).then(function(modal){
        $scope.editNameModal = modal;
      });

      $scope.showNameEdit = function(glory,type,index) {

        $scope.editNameModalParams = {
          title:'球队荣誉',
          content: ''
        };

        $scope.editNameModalParams.title = '球队荣誉';
        $scope.editNameModalParams.name = glory;
        $scope.editNameModalParams.ischange = false;

        $scope.edit = function(){

          var _url_updateGlories = "/team/updateGlories";//得到新闻评论

          var _glory = $scope.editNameModalParams.name ;

          switch (type) {
            case 1://添加荣誉
                  $scope.glories.unshift(_glory);
                  break;
            case 2:
                  $scope.glories.splice(index,1);
                  $scope.glories.unshift(_glory);
                  break;
          }

          var _params = {
            'team_id':$stateParams.team_id,
            'glories':window.JSON.stringify($scope.glories)
          };
          postService.doPost(_params,_url_updateGlories,function(data){

            $scope.editNameModal.hide();

          })

        }
        $ionicListDelegate.closeOptionButtons();
        $scope.editNameModal.show();
      }

      /**
       * 删除荣誉
       * @param index
       */
      $scope.removeGlory = function(glory,index){

        layer.open({
          content: '您确定要删除荣誉:</br>'+glory,
          btn: ['确定', '取消'],
          style:'text-align: center;',
          yes: function(){

            var _url_updateGlories = "/team/updateGlories";//得到新闻评论

            $scope.glories.splice(index,1);

            var _params = {
              'team_id':$stateParams.team_id,
              'glories':window.JSON.stringify($scope.glories)
            };
            postService.doPost(_params,_url_updateGlories,function(data){

              postService.showMsg('删除成功');

            })


          }, no: function(){

          }
        });
        $ionicListDelegate.closeOptionButtons();
      }

      $scope.$on('WeiXinLoadCtrl',function(event,data){

        weiXinService.onMenuShareAppMessage('球队荣誉-'+data.name,data.description_strip,_staticUrl+data.avatar);

      })

     $scope.$on('$ionicView.enter',function(){         $scope.$emit('WeiXinLoad');       })

      //$scope.$on('$ionicView.enter', function () {
      //
      //  weiXinService.onMenuShareAppMessage('球队荣誉-'+$rootScope.teamInfo.title,$rootScope.teamInfo.description_strip,_staticUrl+$rootScope.teamInfo.avatar);
      //
      //});

    }
  ]
)
.controller('TeamActivitiesCtrl',
  ['$rootScope','$scope','$state','$stateParams','postService','Storage','$ionicModal','Auth','$ionicPopup','moment','Tools','weiXinService',

    function($rootScope,$scope,$state,$stateParams,postService,Storage,$ionicModal,Auth,$ionicPopup,moment,Tools,weiXinService) {

      $scope.tabs = Storage.get('tabs');
      $scope.path={
        type:2,
        team_id:$stateParams.team_id,
        page:0
      }

      $scope.activities = [];


      $scope.hasNextPage = false;

      $scope.loadMore = function(){

        var url="/activity/search";

        $scope.path.page++;

        postService.doPost($scope.path,url,function(data){

          if(data.data.cur_page>=data.data.total_page){
            $scope.hasNextPage = false;
          }else{
            $scope.hasNextPage = true;
          }

          var items = data.data.activities;

          for (var i = 0; i < items.length; i++) {

            $scope.activities.push(items[i]);

          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        })
      }

      $scope.loadMore();

      $scope.doRefresh = function(){

        $scope.activities = [];

        $scope.hasNextPage = false;

        $scope.path.page = 0;

        $scope.loadMore();
        $scope.$broadcast('scroll.refreshComplete');

      }

      /**
       * 创建球队活动
       */
      $ionicModal.fromTemplateUrl('templates/activity/createModal.html', {
        scope: $scope
      }).then(function(modal){
        $scope.createModal = modal;

        $scope.createInfo = {
          'is_team':true,
          project:$scope.tabs[1]['value'],
          typeName:$scope.tabs[1]['lab']
        };

        $scope.openMinDate =  moment().add(30, 'm').format('YYYY-MM-DD HH:mm');

        $scope.openStartDate = moment().add(30, 'm').format('YYYY-MM-DD HH:mm');

        $scope.deadlineMinDate =  moment().format('YYYY-MM-DD HH:mm');

        $scope.deadlineStartDate = moment().format('YYYY-MM-DD HH:mm');

        $scope.$on('openTimeSelected',function(event,date){

          $scope.openStartDate = date;

          $scope.deadlineMinDate = moment().format('YYYY-MM-DD HH:mm');

          $scope.deadlineStartDate = moment().subtract(30,'m').format('YYYY-MM-DD HH:mm');

        });

        $scope.$on('deadlineSelected',function(event,date){

          $scope.deadlineStartDate = date;

        });

        $scope.submitCreate = function(){

          var _params = {
            team_id:$stateParams.team_id
          };
          _params.title = $scope.createInfo.title;
          if(Tools.validateNull(_params.title)){
            postService.showMsg('标题不能为空');
            return false;
          }
          _params.address = $scope.createInfo.address;
          if(Tools.validateNull(_params.address)){
            postService.showMsg('地点 不能为空');
            return false;
          }

          _params.num = $scope.createInfo.num;
          if(Tools.validateNull(_params.num)){
            postService.showMsg('人数不能为空');
            return false;
          }

          _params.fee = $scope.createInfo.fee;
          if(Tools.validateNull(_params.fee)){
            postService.showMsg('费用不能为空');
            return false;
          }

          _params.description = $scope.createInfo.description;

          _params.open_time = $scope.openStartDate;

          _params.deadline = $scope.deadlineStartDate;

          var _url_ = '/team/publishActivity';

          postService.doPost(_params,_url_,function(data) {

            postService.showMsg(data.msg);
            $scope.createModal.hide();

            $scope.doRefresh();
          })
        }
      });

      $scope.createActivity = function(){

        if(Auth.validateLogin()){

          $scope.createModal.show();

        }else{
          postService.showLogin();
        }
      }

      $scope.$on('WeiXinLoadCtrl',function(event,data){

        weiXinService.onMenuShareAppMessage('球队活动--'+data.name,data.description_strip,_staticUrl+data.avatar);

      })

     $scope.$on('$ionicView.enter',function(){         $scope.$emit('WeiXinLoad');       })

      //$scope.$on('$ionicView.enter', function () {
      //
      //  weiXinService.onMenuShareAppMessage('球队活动-'+$rootScope.teamInfo.title,$rootScope.teamInfo.description_strip,_staticUrl+$rootScope.teamInfo.avatar);
      //
      //});

    }
  ]
)



