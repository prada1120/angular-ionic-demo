angular.module('Letu.userControllers', [])

.controller('userCtrl',
    ['$rootScope','ENV','$scope', '$timeout','$stateParams','postService','$ionicModal','weiXinService','Auth','Storage','Login','$ionicLoading','User',

        function($rootScope,ENV,$scope,$timeout,$stateParams,postService,$ionicModal,weiXinService,Auth,Storage,Login,$ionicLoading,User){

            $rootScope.user = Storage.get('user');

            if($rootScope.user){

                User.getUser($rootScope.user.uid,function(data){

                    $rootScope.user.attention_num = data.data.attention_num;
                    $rootScope.user.invite_num = data.data.invite_num;
                    $rootScope.user.bbs_num = data.data.bbs_num;
                    $rootScope.user.team_num = data.data.team_num;
                    $rootScope.user.fans_num = data.data.fans_num;

                })

                $rootScope.isLogin = true;
            }else{
                $rootScope.isLogin = false;
            }

            $scope.showLogin = function(){

                Login.showLogin(function(phone,password) {

                    Auth.login(phone,password,function(data){

                      Storage.set('authToken',data.authToken);

                      Storage.set('user',data.data);

                      $rootScope.user = Storage.get('user');

                      User.getUser($rootScope.user.uid,function(data){
                        $rootScope.user.attention_num = data.data.attention_num;
                          $rootScope.user.invite_num = data.data.invite_num;
                        $rootScope.user.bbs_num = data.data.bbs_num;
                        $rootScope.user.team_num = data.data.team_num;
                      })

                      $rootScope.isLogin = true;

                      $rootScope.loginModal.hide();

                    });
                },function(openid){

                    Auth.loginByOpenId(openid, function (data) {

                        Storage.set('authToken',data.authToken);

                        Storage.set('user',data.data);

                        $rootScope.user = Storage.get('user');

                        User.getUser($rootScope.user.uid,function(data){
                            $rootScope.user.attention_num = data.data.attention_num;
                            $rootScope.user.invite_num = data.data.invite_num;
                            $rootScope.user.bbs_num = data.data.bbs_num;
                            $rootScope.user.team_num = data.data.team_num;
                        })

                        $rootScope.isLogin = true;

                        $rootScope.loginModal.hide();

                    },function(data){
                        var _href = window.location.href;
                        window.location.href = "http://www.letusport.com/index.php/mobile/auth/directWeixinLogin?backUrl/"+encodeURIComponent(_href);
                    })

                },function(phone,password,code){

                    var _register_url = "/auth/register";

                    var _params = {
                        phone: phone,
                        password:password,
                        code:code
                    };

                    postService.doPost(_params,_register_url,function(data){



                    })

                },function(phone){

                    var _sms_url = "/auth/sms";

                    var _params = {
                        phone: phone,
                        type:1
                    };

                    postService.doPost(_params,_sms_url,function(data){

                        postService.showMsg('发送成功');

                    })


                });
            }
        }
    ]
)
.controller('userSettingCtrl',
    ['$rootScope','ENV','$scope','$state','postService','Auth','Storage',

        function($rootScope,ENV,$scope,$state,postService,Auth,Storage){

            $scope.logout = function(){

                Auth.logout(function(data){
                    postService.showMsg(data.msg);
                    Storage.remove('user');
                    Storage.remove('authToken');
                    //Storage.remove('openId');
                    $state.go("tab.user",{},{reload: true});
                })
            }
        }
    ]
)
.controller('userModifyPasswordCtrl',
    ['$rootScope','$scope','$state','postService','Tools','Storage','$ionicHistory',

        function($rootScope,$scope,$state,postService,Tools,Storage,$ionicHistory){

            $scope.goBack = function(){

                if($ionicHistory.backView()){
                    $ionicHistory.goBack();
                }else {
                    $state.go('tab.index');
                }

            }

            $scope.edit = {
                password:'',
                newPassword:'',
                reNewPassword:''
            };

            $scope.submit = function(){

                if(Tools.validateNull($scope.edit.password)){

                    postService.showMsg('请输入原密码');

                    return false;

                }
                if(Tools.validateNull($scope.edit.newPassword)){

                    postService.showMsg('请输入新密码');

                    return false;

                }
                if(Tools.validateNull($scope.edit.reNewPassword)){

                    postService.showMsg('请再次输入新密码');

                    return false;

                }

                var _url_modifyPassword = "/user/modifyPassword";//得到新闻评论


                postService.doPost($scope.edit,_url_modifyPassword,function(data) {

                    postService.showMsg(data.msg);

                    Storage.remove('user');
                    Storage.remove('authToken');
                    $state.go("tab.user",{},{reload: true});

                })

            }

        }
    ]
)
.controller('userEditCtrl',

    ['$rootScope','ENV','$scope','$state','postService','Auth','Storage','$ionicModal','Upload','$ionicLoading','Tabs','Tools',

        function($rootScope,ENV,$scope,$state,postService,Auth,Storage,$ionicModal,Upload,$ionicLoading,Tabs,Tools){

            $scope.user = Storage.get('user');

            $scope.user.user_info.age = angular.isUndefined($scope.user.user_info.age)?'25':$scope.user.user_info.age;

            $scope.user.user_info.job = angular.isUndefined($scope.user.user_info.job)?'0':$scope.user.user_info.job;

            $scope.user.user_info.city_str = angular.isUndefined($scope.user.user_info.city_str)?'上海-上海-黄埔':$scope.user.user_info.city_str;


            /**
             * 上传图片
             * @param file
             * @param type
             */
            $scope.upload = function (file,type) {

                var _authToken = Storage.get('authToken');

                var _uploadUrl = '';

                switch (type){
                    case 1:
                        _uploadUrl = '/user/uploadAvatar';
                        break;
                }

                if(_uploadUrl==''){
                    postService.showMsg('系统错误');
                }

                Upload.upload({
                    url: baseUrl+_uploadUrl,
                    data: {avatar: file,'authToken':_authToken}
                }).then(function (resp) {

                    var _opt = {
                        template:'上传完成',
                        duration:200
                    }
                    $ionicLoading.show(_opt);

                    var _img = resp.data.data;

                    switch (type){
                        case 1:
                            $scope.user.avatar = _img;
                            Storage.set('user',$scope.user);
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

                }, function (evt) {

                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);

                    var _opt = {
                        template:'上传'+ evt.config.data.file.name+' 中...'+progressPercentage+ '% ',
                        duration:30000
                    }
                    $ionicLoading.show(_opt);
                });
            };

            /**
             * 修改
             */
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
                        $scope.editNameModalParams.title = '昵称';

                        $scope.editNameModalParams.name = $scope.user.real_name;

                        $scope.editNameModalParams.ischange = false;

                        $scope.edit = function(){

                            var _url_editRealName = "/user/editRealName";//得到新闻评论

                            var _params = {

                                real_name:$scope.editNameModalParams.name

                            };
                            postService.doPost(_params,_url_editRealName,function(data){

                                $scope.user.real_name = $scope.editNameModalParams.name;

                                Storage.set('user',$scope.user);

                                $scope.editNameModal.hide();

                            })
                        }
                        break;
                }
                $scope.editNameModal.show();
            }

            $scope.user.user_info.province = angular.isUndefined($scope.user.user_info.province)?'3':$scope.user.user_info.province;

            $scope.user.user_info.city = angular.isUndefined($scope.user.user_info.city)?'38':$scope.user.user_info.city;

            $scope.user.user_info.district = angular.isUndefined($scope.user.user_info.district)?'451':$scope.user.user_info.district;

            var getCityList = function(){



                $scope.provinceData = Tools.getCityList();

                angular.forEach($scope.provinceData,function(_province,_index){

                    if($scope.user.user_info.province == _province.id){

                       $scope.user.user_info.province = _province;

                        $scope.citydata = _province.sub;

                        angular.forEach($scope.citydata,function(_city,_index){

                            if($scope.user.user_info.city == _city.id){

                                $scope.user.user_info.city = _city;

                                $scope.districtdata = _city.sub;

                                angular.forEach($scope.districtdata,function(_district,_index){

                                    if($scope.user.user_info.district == _district.id) {

                                        $scope.user.user_info.district = _district;

                                    }
                                })
                            }
                        })
                    }
                });
            }

            $scope.$watch('user.user_info.province',function(newValue,oldValue){

                if(newValue!=oldValue){

                    $scope.citydata = newValue.sub;

                    $scope.user.user_info.city = $scope.citydata[0];

                    $scope.districtdata = $scope.citydata[0].sub;

                    $scope.user.user_info.district = $scope.districtdata[0];

                }

            })
            $scope.$watch('user.user_info.city',function(newValue,oldValue){

                if(newValue!=oldValue){
                    $scope.districtdata = newValue.sub;

                    $scope.user.user_info.district = $scope.districtdata[0];
                }
            })
            $scope.$watch('user.user_info.district',function(newValue,oldValue){

            })
            getCityList();

            /**
             * 修改其他信息
             */
            $scope.submitEdit = function(){

                var _user = $scope.user;

                var _citystr = _user.user_info.province.name+'-'+_user.user_info.city.name+'-'+_user.user_info.district.name;
                var _cityids = _user.user_info.province.id+'-'+_user.user_info.city.id+'-'+_user.user_info.district.id;

                var _url_editInfo = "/user/editInfoForWap";//得到新闻评论

                var _params = {
                    'citystr':_citystr,
                    'cityids':_cityids,
                    'sex':_user.sex,
                    'age':_user.user_info.age,
                    'job':_user.user_info.job
                };
                postService.doPost(_params,_url_editInfo,function(data){

                    postService.showMsg(data.msg);

                    _user.user_info = data.data;

                    Storage.set('user',_user);

                    $state.reload();


                })
            }
            /**
             * 修改
             */
            $ionicModal.fromTemplateUrl('templates/user/editLevelModal.html', {
                Tabs:Tabs,
                scope: $scope
            }).then(function(modal){

                $scope.editLevelModal = modal;

                var _tabs = Storage.get('tabs');

                _tabs.shift();

                $scope.tabs = [];

                var _user_levels = $scope.user.user_info.level;//获取用户水平信息

                var _user_traits = $scope.user.user_info.trait;//获取用户特点信息

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
                angular.forEach(_tabs,function(_val,_index){

                    var _levels = [];

                    _val['level_num'] = 0;//记录水平选中个数

                    angular.forEach(_val.level,function(_level,_index){

                        var _item = {
                            'title':_level,//水平名称
                            'is_selected':false//是否选中
                        };

                        if(angular.isDefined(_user_levels[_val.value])){//验证用户水平中是否存在该项目

                            if(_user_levels[_val.value].indexOf(_level)!=-1){//判断用户水平中是否有该水平

                                _item.is_selected = true;//设置当前水平选中

                                _val['level_num']++;//增加选中个数

                            }
                        }
                        _levels.push(_item);
                    })
                    _val['level'] = _levels;

                    /**
                     * 处理特点与水平一致
                     * @type {Array}
                     * @private
                     */
                    var _traits = [];

                    _val['trait_num'] = 0;

                    angular.forEach(_val.trait,function(_trait,_index){

                        var _item = {
                            'title':_trait,
                            'is_selected':false
                        };
                        if(angular.isDefined(_user_traits[_val.value])){
                            if(_user_traits[_val.value].indexOf(_trait)!=-1){

                                _item.is_selected = true;

                                _val['trait_num']++;

                            }
                        }
                        _traits.push(_item);
                    })

                    _val['trait'] = _traits;

                    //判断项目是否需要选中(水平或特点有一个选中)
                    _val['is_selected'] = (_val['level_num']+_val['trait_num'])>0?true:false;

                    $scope.tabs.push(_val);

                })

                $scope.selectTypeIndex = 0;//记录当前项目选中index

                $scope.levels = $scope.tabs[0].level;//默认显示第一个项目水平数据

                $scope.traits = $scope.tabs[0].trait;//默认显示第一个项目特点数据

                /**
                 * 选中项目
                 * @param tab
                 * @param index
                 */
                $scope.selectType = function(tab,index){

                    $scope.levels = tab.level;

                    $scope.traits = tab.trait;

                    $scope.selectTypeIndex = index
                }

                $scope.selectLevel = function(level,index){


                    var _tab = $scope.tabs[$scope.selectTypeIndex];//得到当前特点所属项目

                    _tab.is_selected = true;//设置项目选中

                    level.is_selected = !level.is_selected;//切换水平选中

                    if(!level.is_selected){//判断如果已经是选中

                        _tab.level_num--;//水平个数减1

                        if(_tab.trait_num+_tab.level_num<1){//如果当前项目下水平或特点数量没有，则取消选中项目
                            _tab.is_selected = false;
                        }
                    }else{
                        _tab.level_num++;//表示选中 水平个数+1
                    }

                }
                /**
                 * 选中特点   和选中水平一致
                 * @param trait
                 * @param index
                 */
                $scope.selectTrait = function(trait,index){

                    var _tab = $scope.tabs[$scope.selectTypeIndex];

                    _tab.is_selected = true;

                    trait.is_selected = !trait.is_selected;

                    if(!trait.is_selected){

                        _tab.trait_num--;

                        if(_tab.trait_num+_tab.level_num<1){

                            _tab.is_selected = false;
                        }
                    }else{
                        _tab.trait_num++;
                    }
                }

                /**
                 * 修改
                 */
                $scope.edit = function(){

                    var _levels = [];
                    var _traits = [];

                    angular.forEach($scope.tabs,function(_tab,_index){

                        var _selected_levels = [];

                        angular.forEach(_tab['level'],function(_level,_key){

                            if(_level.is_selected){

                                _selected_levels.push(_level.title);//提取已选中水平

                            }

                        })
                        //组拼数组
                        if(_selected_levels.length>0){
                            _levels[_tab.value] = _selected_levels;
                        }

                        /**
                         * 处理特点数据，和水平一致
                         * @type {Array}
                         * @private
                         */
                        var _selected_traits = [];

                        angular.forEach(_tab['trait'],function(_trait,_key){

                            if(_trait.is_selected){

                                _selected_traits.push(_trait.title);

                            }

                        })
                        if(_selected_traits.length>0){
                            _traits[_tab.value] = _selected_traits;
                        }

                    })

                    var _url_editLevels = "/user/editLevels";//修改水平特点

                    var _params = {
                        'levels':_levels,
                        'traits':_traits
                    };
                    postService.doPost(_params,_url_editLevels,function(data){

                        postService.showMsg(data.msg);

                        $scope.user.user_info = data.data;

                        console.log($scope.user);

                        Storage.set('user',$scope.user);

                        $scope.editLevelModal.hide();
                    })

                }
            });

            $scope.editLevel = function(){
                $scope.editLevelModal.show();

            }

        }
    ]
)
.controller('userTeamCtrl',
    ['$rootScope','ENV','$scope','$state','postService',

        function($rootScope,ENV,$scope,$state,postService){


            var _url_myTeams = '/user/myTeams';

            postService.doPost({},_url_myTeams,function(data){

                $scope.myTeams = data.data;

            });

            var _url_myJoinTeams = '/user/myJoinTeams';

            postService.doPost({},_url_myJoinTeams,function(data){

                $scope.myJoinTeams = data.data;

                console.log(data);

            });

        }
    ]
)
.controller('userFansCtrl',
    ['$rootScope','$stateParams','$scope','$state','postService',

        function($rootScope,$stateParams,$scope,$state,postService){

            var _path = {
                page:0
            };
            $scope.users = [];
            $scope.userHasNextPage = false;

            $scope.loadMoreUsreFans = function(){

                _path.page ++;

                var _url_userFans = '/user/userFans';

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

        }
    ]
)
.controller('userInviteCtrl',
    ['$rootScope','ENV','$scope','$state','postService',

        function($rootScope,ENV,$scope,$state,postService){

            /**
             * 我加入的约战
             * @type {{page: number}}
             * @private
             */
            var _params_join={
                page:0
            }
            var _url_myJoinInvites = '/user/myJoinInvites';

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
                page:0
            }
            var _url_myInvites = '/user/myInvites';

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

        }
    ]
)
.controller('userActivityCtrl',
    ['$rootScope','$scope','$state','postService',

        function($rootScope,$scope,$state,postService){

            /**
             * 我加入的活动
             * @type {{page: number}}
             * @private
             */
            var _params_join={
                page:0
            }
            var _url_myJoinActivity = '/user/myJoinActivity';

            $scope.join_activitys= [];

            $scope.hasNextPage_join = false;

            $scope.loadMoreJoinActivity = function() {

                _params_join.page++;

                postService.doPost(_params_join,_url_myJoinActivity,function(data){

                    if(data.data.cur_page>=data.data.total_page){

                        $scope.hasNextPage_join = false;

                    }else{
                        $scope.hasNextPage_join = true;
                    }

                    var items = data.data.activities;

                    for (var i = 0; i < items.length; i++) {

                        $scope.join_activitys.push(items[i]);

                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');

                });

            }

            $scope.doJoinActivityRefresh = function(){

                $scope.join_activitys = [];

                _params_join.page = 0;

                $scope.loadMoreJoinActivity();

                $scope.$broadcast('scroll.refreshComplete');

            }

            $scope.doJoinActivityRefresh();


            var _params_create={
                page:0
            }
            var _url_myActivity = '/user/myActivity';

            $scope.create_activitys= [];

            $scope.hasNextPage_create = false;

            $scope.loadMoreCreateActivity = function() {

                _params_create.page++;

                postService.doPost(_params_create,_url_myActivity,function(data){

                    if(data.data.cur_page>=data.data.total_page){

                        $scope.hasNextPage_create = false;

                    }else{
                        $scope.hasNextPage_create = true;
                    }

                    var items = data.data.activities;

                    for (var i = 0; i < items.length; i++) {

                        $scope.create_activitys.push(items[i]);

                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');

                });

                console.log($scope.create_activitys);
            }

            $scope.doCreateActivityRefresh = function(){

                $scope.create_activitys = [];

                _params_create.page = 0;

                $scope.loadMoreCreateActivity();

                $scope.$broadcast('scroll.refreshComplete');

            }

            $scope.doCreateActivityRefresh();

        }
    ]
)
.controller('userAttentionCtrl',
    ['$rootScope','ENV','$scope','$state','postService',

        function($rootScope,ENV,$scope,$state,postService){

            /**
             * 关注的人
             * @type {{page: number}}
             * @private
             */

            var _userPath = {
                page:0
            };
            $scope.userAttentions = [];
            $scope.userHasNextPage = false;

            $scope.loadUserAttentions = function(){

                _userPath.page++;

                var _url_userAttentions = '/user/userAttentions';

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
             * 操作关注
             */
            $scope.optAttention = function(attention,type){


                if(type==1){

                    var _params = {
                        'uid':attention.baid
                    }

                    if(!attention.guanzhu){

                        var _title = attention.user.real_name;
                        postService.confirm('确认要取消对'+_title+'的关注吗？',function(){

                            layer.closeAll();
                            attention.guanzhu = true;

                            var _url_attention = '/user/attention';

                            postService.doPost(_params,_url_attention);

                        })

                    }else{

                        var _url_attention = '/user/attention';

                        postService.doPost(_params,_url_attention);


                        attention.guanzhu = false;
                    }


                }else{
                    var _params = {
                        'team_id':attention.baid
                    }

                    if(!attention.guanzhu){

                        var _title = attention.team.name;
                        postService.confirm('确认要取消对'+_title+'的关注吗？',function(){

                            layer.closeAll();
                            attention.guanzhu = true;

                            var _url_attention = '/team/attention';

                            postService.doPost(_params,_url_attention);

                        })

                    }else{

                        var _url_attention = '/team/attention';

                        postService.doPost(_params,_url_attention);


                        attention.guanzhu = false;
                    }


                }

            }

            /**
             * 关注的球队
             * @type {{page: number}}
             * @private
             */

            var _teamPath = {
                page:0
            };
            $scope.teamAttentions = [];
            $scope.teamHasNextPage = false;

            $scope.loadTeamAttentions = function(){

                _teamPath.page++;

                var _url_teamAttentions = '/user/teamAttentions';

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


        }
    ]
)
.controller('userDynamicCtrl',
    ['$rootScope','$scope','$state','postService','Tools','$ionicModal','Upload','$ionicLoading','Storage',

        function($rootScope,$scope,$state,postService,Tools,$ionicModal,Upload,$ionicLoading,Storage){

            var _userPath = {
                page:0
            };
            $scope.dynamics = [];
            $scope.hasNextPage = false;

            $scope.loadMoreDynamics = function(){

                var _url_myDynamics = '/user/myDynamics';

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

            $scope.publishDynamicModalParams = {
                'upload_imgs':[],
                'content':'',
                'ischange':false
            };
            $ionicModal.fromTemplateUrl('templates/publishDynamicModal.html', {
                scope: $scope
            }).then(function(modal){
                $scope.publishDynamicModal = modal;
                /**
                 * 移除上传图片
                 * @param img
                 * @param index
                 */
                $scope.removeImg = function(img,index){

                    $scope.publishDynamicModal.upload_imgs.splice(index,1);

                }
            });

            $scope.showPublishDynamicModal = function(){
                $scope.publishDynamicModal.show();
            };

            /**
             * 上传图片
             * @param files
             */
            $scope.uploadFiles = function (files) {

                var _hasUpload = $scope.publishDynamicModalParams.upload_imgs.length;
                if((files.length+_hasUpload)>8){
                    alert('最多只能上传9张图片');
                    return false;
                }

                if (files && files.length) {

                    for (var i = 0; i < files.length; i++) {
                        Upload.upload({
                            url: baseUrl+'/user/uploadImg',
                            data: {file: files[i],authToken:Storage.get('authToken')}
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

                                $scope.publishDynamicModalParams.upload_imgs.push(resp.data.data);
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

                var url="/user/publishDynamic";

                var path = {
                    'title':$scope.publishDynamicModalParams.content,
                    'imgs':''
                }

                if(angular.isArray($scope.publishDynamicModalParams.upload_imgs)){


                    angular.forEach($scope.publishDynamicModalParams.upload_imgs,function(_val,_index){

                        path.imgs+=_val+'#';

                    })

                }

                postService.doPost(path,url,function(data) {

                    $scope.doDynamicRefresh();
                    postService.showMsg(data.msg);

                    $scope.publishDynamicModal.hide();

                })

            }

            $scope.delAttentionDynamic = function(_dynamic,_index){

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
        }
    ]
)
.controller('userMatchCtrl',
    ['$rootScope','$scope','$state','postService',

        function($rootScope,$scope,$state,postService){

            var _path_join = {
                page:0
            };
            $scope.matchs_join = [];

            $scope.hasNextPage_join = false;

            $scope.loadMoreJoinMatches = function(){

                var _url_myJoinMatch = '/user/myJoinMatch';

                _path_join.page++;

                postService.doPost(_path_join,_url_myJoinMatch,function(data){

                    if(data.data.cur_page>=data.data.total_page){
                        $scope.hasNextPage_join = false;
                    }else{
                        $scope.hasNextPage_join = true;
                    }

                    var items = data.data.matchs;

                    for (var i = 0; i < items.length; i++) {

                        $scope.matchs_join.push(items[i]);

                    }

                    console.log($scope.matchs_join);
                    $scope.$broadcast('scroll.infiniteScrollComplete');

                });

            }

            $scope.doJoinMatchRefresh = function(){

                $scope.matchs_join = [];

                _path_join.page = 0;

                $scope.loadMoreJoinMatches();

                $scope.$broadcast('scroll.refreshComplete');

            }

            $scope.loadMoreJoinMatches();

            var _path_attention = {
                page:0
            };
            $scope.matchs_attention = [];

            $scope.hasNextPage_attention = false;

            $scope.loadMoreAttentionMatches = function(){

                var _url_myAttentionMatch = '/user/myAttentionMatch';

                _path_attention.page++;

                postService.doPost(_path_attention,_url_myAttentionMatch,function(data){


                    if(data.data.cur_page>=data.data.total_page){
                        $scope.hasNextPage_attention = false;
                    }else{
                        $scope.hasNextPage_attention = true;
                    }

                    var items = data.data.matchs;

                    for (var i = 0; i < items.length; i++) {

                        $scope.matchs_attention.push(items[i]);

                    }

                    $scope.$broadcast('scroll.infiniteScrollComplete');

                });

            }

            $scope.doAttentionMatchRefresh = function(){

                $scope.matchs_attention = [];

                _path_attention.page = 0;

                $scope.loadMoreAttentionMatches();

                $scope.$broadcast('scroll.refreshComplete');

            }

            $scope.loadMoreAttentionMatches();

        }
    ]
)
.controller('letuCtrl',
['$rootScope','$scope','$state','weiXinService','$ionicHistory',
    function($rootScope,$scope,$state,weiXinService,$ionicHistory){

        $scope.goBack = function(){

            if($ionicHistory.backView()){
                $ionicHistory.goBack();
            }else {
                $state.go('tab.index');
            }

        }

        $scope.$on('$ionicView.enter',function(){
            weiXinService.onMenuShareAppMessage('乐土体育','每个人都是运动员');
        })


    }

])





