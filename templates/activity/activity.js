angular.module('Letu.activityControllers', [])

.controller('ActivityListCtrl',
    ['$rootScope','$scope','$state','postService','Storage','$ionicModal','Auth','$ionicPopup','moment','Tools','weiXinService','$timeout','TimePickerService',

        function($rootScope,$scope,$state,postService,Storage,$ionicModal,Auth,$ionicPopup,moment,Tools,weiXinService,$timeout,TimePickerService) {

            $scope.tabs = Storage.get('tabs');
            $scope.path={
                project:0,
                keyword:'',
                state:0,
                time:0,
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

            /**
             * 选择状态
             * @param state
             */
            $scope.selectState = function(state){
                $scope.path.state = state;
                $scope.path.time = 0;
            }

            /**
             * 选择时间
             * @param time
             */
            $scope.selectTime = function(time){
                $scope.path.time = time;
            }

            /**
             * 选择项目
             * @param tab
             */
            $scope.selectTab = function(tab){
                $scope.path.project = tab.value;
            }

            var timeout;

            $scope.inputChange=function(){

                if (timeout) {

                    $timeout.cancel(timeout);

                }
                timeout = $timeout(function() {

                    $scope.activities = [];

                    $scope.path.page =  0 ;

                    $scope.loadMore();

                }, 550);
            }

            /**
             * 搜索
             */
            $scope.search = function(){

                $scope.activities = [];

                $scope.hasNextPage = false;

                $scope.path.page = 0;

                $scope.loadMore();

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
             * 创建球队
             */
            $ionicModal.fromTemplateUrl('templates/activity/createModal.html', {
                scope: $scope
            }).then(function(modal){
                $scope.createModal = modal;

                $scope.createInfo = {
                    project:$scope.tabs[1]['value'],
                    typeName:$scope.tabs[1]['lab']
                };

                $scope.time = {
                    'deadlineDay':moment().format('YYYY-MM-DD'),
                    'deadlineHours':moment().add(30, 'm').format('HH')+":00",
                    'openDay':moment().format('YYYY-MM-DD'),
                    'openHours':moment().add(60, 'm').format('HH')+":00"
                }

                $scope.days = TimePickerService.getFullYear( new Date());

                $scope.hours = TimePickerService.getHours();

                $scope.submitCreate = function(){

                    var _params = {};

                    _params.title = $scope.createInfo.title;
                    if(Tools.validateNull(_params.title)){
                        postService.showMsg('活动不能为空');
                        return false;
                    }
                    _params.project = $scope.createInfo.project;

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

                    _params.deadline = $scope.time.deadlineDay+" "+$scope.time.deadlineHours;

                    _params.open_time = $scope.time.openDay+" "+$scope.time.openHours;

                    var _url_ = '/activity/publish';

                    postService.doPost(_params,_url_,function(data) {
                        $scope.doRefresh();
                        postService.showMsg(data.msg);
                        $scope.createModal.hide();
                    })
                }

                /**
                 * 弹出活动分类选择框
                 */
                $scope.showTypePopup = function(){

                    var _template = '<div class="row">'

                    angular.forEach($scope.tabs,function(tab,index){

                        if(tab.value!=0){

                            if(index%2==0){
                                _template+='<div class="col col-offset-10 popup-select-item" on-touch="selectType('+tab.value+',\''+tab.lab+'\')"><label>'+tab.lab+'</label></div></div><div class="row">';
                            }else{
                                _template+='<div class="col popup-select-item" on-touch="selectType('+tab.value+',\''+tab.lab+'\')"><label>'+tab.lab+'</label></div>';
                            }
                        }
                    })

                    _template+='</div>';

                    $scope.typPopup = $ionicPopup.show({
                        title: '请选择活动分类',
                        template: _template,
                        scope: $scope
                    });
                }

                /**
                 * 选择活动分类
                 * @param typeId
                 * @param typeName
                 */
                $scope.selectType = function(typeId,typeName){

                    $scope.createInfo.typeName = typeName;

                    $scope.createInfo.project = typeId;

                    $scope.typPopup.close();

                }

            });

            $scope.createActivity = function(){

                if(Auth.validateLogin()){

                    $scope.createModal.show();

                }else{
                    postService.showLogin();
                }
            }

            $scope.$on('onFinishRender', function () {

                weiXinService.onMenuShareAppMessage('活动列表-乐土体育','乐土体育专心做赛事');

            });

        }
    ]
)
.controller('ActivityDetailCtrl',
    ['$rootScope','$stateParams','$scope','$state','postService','Storage','User','Tools','$ionicPopover','Auth','Login','weiXinService',

        function($rootScope,$stateParams,$scope,$state,postService,Storage,User,Tools,$ionicPopover,Auth,Login,weiXinService) {

            $scope.sign = function(){

                if(Auth.validateLogin()){
                    var _content = '您将报名“'+$rootScope.activity.title+'”</br>请输入一下信息:</br>' +
                        '<input type="text" id="name" placeholder="请输入姓名" class="layer-input">' +
                        '<input type="tel" id="phone" placeholder="请输入联系方式" class="layer-input">';
                    layer.open({
                        content:_content,
                        btn: ['发送', '取消'],
                        style:'text-align: center;',
                        yes: function(index){
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
                                'activity_id':$stateParams.activity_id,
                                'name':_name,
                                'phone':_phone
                            }

                            var _url_sign="/activity/sign";

                            postService.doPost(_params,_url_sign,function(data){

                                $rootScope.activity.is_sign = true;

                                var _member = {
                                    'uavatar':data.data.uavatar,
                                    'uid':data.data.uid
                                }
                                $scope.wait.push(_member);
                                $scope.wait_count++;

                                postService.showMsg(data.msg);

                            })


                        }, no: function(){

                        }
                    });
                }else{

                    postService.showLogin();
                }


            }

            var getSigns= function(){

                var _url_getSigns = '/activity/activityMember';

                var _params = {
                    activity_id:$stateParams.activity_id
                };

                postService.doPost(_params,_url_getSigns,function(data){

                    $scope.passed = data.data.passed;

                    $scope.passed_count = $scope.passed.length;

                    $scope.no_passed = data.data.no_passed;

                    $scope.no_passed_count = $scope.no_passed.length;

                    $scope.wait = data.data.wait;

                    $scope.wait_count = $scope.wait.length;

                })

            }

            getSigns();

            $ionicPopover.fromTemplateUrl('templates/activity/detailOptPopover.html', {
                scope: $scope
            }).then(function(popover) {
                $scope.detailOptPopover = popover;
            });

            $scope.showDetailOpt = function($event) {

                $scope.detailOptPopover.show($event);
            };

            $scope.$on('$ionicView.enter', function () {

                weiXinService.onMenuShareAppMessage('活动-'+$rootScope.activity.title+'-乐土体育','乐土体育专心做赛事');

            });

        }
    ]
)
.controller('ActivityWaitMembersCtrl',
    ['$rootScope','$scope','$stateParams','postService','$ionicActionSheet','weiXinService',

        function($rootScope,$scope,$stateParams,postService,$ionicActionSheet,weiXinService){

            var _url_getWaitMember = '/activity/waits';

            postService.doPost($stateParams,_url_getWaitMember,function(data){
                $scope.members = data.data;
            })

            $scope.showOpt = function(member,member_index){

                $ionicActionSheet.show({

                    buttons: [
                        {
                            text: '接受'
                        }
                    ],
                    destructiveText: '拒绝',
                    cancelText: '取消',
                    buttonClicked: function (index) {

                        var _url_acceptJoin = '/activity/acceptJoin';

                        var _params = {
                            activity_id:$stateParams.activity_id,
                            sign_id:member.id,
                            state:1
                        };

                        postService.doPost(_params,_url_acceptJoin,function(data){

                            member.state = 1;

                            postService.showMsg(data.msg);
                        })

                        return true;
                    },
                    destructiveButtonClicked: function () {

                        var _url_acceptJoin = '/activity/acceptJoin';

                        var _params = {
                            activity_id:$stateParams.activity_id,
                            sign_id:member.id,
                            state:2
                        };

                        postService.doPost(_params,_url_acceptJoin,function(data){

                            member.state = 2;

                            postService.showMsg(data.msg);
                        })

                        return true;
                    }

                });

            }
        }

    ]
)
.controller('ActivityEditCtrl',
    ['$rootScope','$scope','postService','$stateParams','$timeout','Storage','User','$ionicPopup','Tools','weiXinService','TimePickerService',
        function($rootScope,$scope,postService,$stateParams,$timeout,Storage,User,$ionicPopup,Tools,weiXinService,TimePickerService) {

            $scope.tabs = Storage.get('tabs');

            //$scope.openMinDate =  moment().add(30, 'm').format('YYYY-MM-DD HH:mm');
            //
            //$scope.deadlineMinDate =  moment().format('YYYY-MM-DD HH:mm');
            //
            //$scope.$on('openTimeSelected',function(event,date){
            //
            //    $rootScope.activity.openStartDate = date;
            //
            //    $scope.deadlineMinDate = moment().subtract(30,'m').format('YYYY-MM-DD HH:mm');
            //
            //    $rootScope.activity.deadlineStartDate = moment(date).subtract(30,'m').format('YYYY-MM-DD HH:mm');
            //
            //});

            //$scope.time = {
            //    'deadlineDay':moment().format('YYYY-MM-DD'),
            //    'deadlineHours':moment().add(30, 'm').format('HH')+":00",
            //    'openDay':moment().format('YYYY-MM-DD'),
            //    'openHours':moment().add(60, 'm').format('HH')+":00"
            //}

            $scope.days = TimePickerService.getFullYear( new Date());

            $scope.hours = TimePickerService.getHours();

            //$scope.$on('deadlineSelected',function(event,date){
            //
            //    $scope.deadlineStartDate = date;
            //
            //});

            $scope.submitEdit = function(){

                var _params = {
                    'activity_id':$rootScope.activity.activity_id
                };

                _params.title = $scope.activity.title;
                if(Tools.validateNull(_params.title)){
                    postService.showMsg('活动不能为空');
                    return false;
                }
                _params.project = $scope.activity.project;

                _params.address = $scope.activity.address;
                if(Tools.validateNull(_params.address)){
                    postService.showMsg('地点 不能为空');
                    return false;
                }

                _params.num = $scope.activity.num;
                if(Tools.validateNull(_params.num)){
                    postService.showMsg('人数不能为空');
                    return false;
                }

                _params.fee = $scope.activity.fee;
                if(Tools.validateNull(_params.fee)){
                    postService.showMsg('费用不能为空');
                    return false;
                }
                _params.description = $scope.activity.description;

                _params.deadline = $scope.activity.deadlineDay+" "+$scope.activity.deadlineHours;

                _params.open_time = $scope.activity.openDay+" "+$scope.activity.openHours;

                var _url_ = '/activity/edit';

                postService.doPost(_params,_url_,function(data) {
                    postService.showMsg(data.msg);
                })
            }

            /**
             * 弹出活动分类选择框
             */
            $scope.showTypePopup = function(){

                var _template = '<div class="row">'

                angular.forEach($scope.tabs,function(tab,index){

                    if(tab.value!=0){

                        if(index%2==0){
                            _template+='<div class="col col-offset-10 popup-select-item" on-touch="selectType('+tab.value+',\''+tab.lab+'\')"><label>'+tab.lab+'</label></div></div><div class="row">';
                        }else{
                            _template+='<div class="col popup-select-item" on-touch="selectType('+tab.value+',\''+tab.lab+'\')"><label>'+tab.lab+'</label></div>';
                        }
                    }
                })

                _template+='</div>';

                $scope.typPopup = $ionicPopup.show({
                    title: '请选择活动分类',
                    template: _template,
                    scope: $scope
                });
            }

            /**
             * 选择活动分类
             * @param typeId
             * @param typeName
             */
            $scope.selectType = function(typeId,typeName){

                $scope.activity.project_name = typeName;

                $scope.activity.project = typeId;

                $scope.typPopup.close();

            }

        }
    ]
)





