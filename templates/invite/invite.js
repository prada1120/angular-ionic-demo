angular.module('Letu.inviteControllers', [])

.controller('InviteListCtrl',
    ['$rootScope','$scope','$state','postService','Storage','$ionicModal','Auth','$ionicPopup','moment','User','Tools','weiXinService','TimePickerService',

        function($rootScope,$scope,$state,postService,Storage,$ionicModal,Auth,$ionicPopup,moment,User,Tools,weiXinService,TimePickerService){

            $scope.tabs = Storage.get('tabs');

            $scope.path={
                project:0,
                keyword:'',
                state:0,
                time:0,
                page:0
            }

            $scope.invites = [];

            $scope.hasNextPage = false;

            $scope.loadMore = function(){

                var url="/invite/search";

                $scope.path.page++;

                postService.doPost($scope.path,url,function(data){

                    if(data.data.cur_page>=data.data.total_page){
                        $scope.hasNextPage = false;
                    }else{
                        $scope.hasNextPage = true;
                    }

                    var items = data.data.invites;

                    for (var i = 0; i < items.length; i++) {

                        $scope.invites.push(items[i]);

                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                })
            }

            /**
             * 选择项目
             * @param tab
             */
            $scope.selectTab = function(tab){
                $scope.path.project = tab.value;
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

            /**
             * 搜索
             */
            $scope.search = function(){

                $scope.invites = [];

                $scope.hasNextPage = false;

                $scope.path.page = 0;

                $scope.loadMore();

            }

            /**
             * 下拉刷新
             */
            $scope.doRefresh = function(){

                $scope.invites = [];

                $scope.hasNextPage = false;

                $scope.path.page = 0;

                $scope.loadMore();
                $scope.$broadcast('scroll.refreshComplete');
            }

            $scope.loadMore();

            $scope.time = {
                startDay:moment().format('YYYY-MM-DD'),
                startHours:moment().add(30, 'm').format('HH')+":00"
            }

            $scope.minDate =  new Date();

            $scope.days = TimePickerService.getFullYear($scope.minDate);

            $scope.hours = TimePickerService.getHours();

            /**
             * 创建约战
             */
            $ionicModal.fromTemplateUrl('templates/invite/createInviteModal.html', {
                scope: $scope
            }).then(function(modal){

                $scope.createInviteModal = modal;

                $scope.inviteTypes = $scope.tabs[1]['invite'];

                $scope.createInviteInfo = {
                    project:$scope.tabs[1]['value'],
                    typeName:$scope.tabs[1]['lab'],
                    type:$scope.inviteTypes[0],
                    invite_type:1,
                    signs:[]
                };

                $scope.selected = [];

                $scope.invite = function(){
                    User.selectUser(function(selects,selected){
                        $scope.createInviteInfo.signs = selects;

                        $scope.selected = selected;

                    },'我关注的人',$scope.selected)
                }

                $scope.$on('timeSelected',function(event,date){
                    $scope.startDate = date;
                });

                $scope.sumbitCreateInvite = function(){

                    var _params = {};
                    _params.title = $scope.createInviteInfo.title;
                    if(Tools.validateNull(_params.title)){
                        postService.showMsg('标题不能为空');
                        return false;
                    }
                    _params.project = $scope.createInviteInfo.project;
                    _params.team_id = $scope.createInviteInfo.team.id;
                    _params.team_avatar = $scope.createInviteInfo.team.avatar;
                    _params.team_name = $scope.createInviteInfo.team.name;
                    _params.type = $scope.createInviteInfo.type;
                    _params.open_time = $scope.time.startDay+" "+$scope.time.startHours;
                    _params.address = $scope.createInviteInfo.address;
                    if(Tools.validateNull(_params.address)){
                        postService.showMsg('场地不能为空');
                        return false;
                    }
                    _params.fee = $scope.createInviteInfo.fee;
                    if(Tools.validateNull(_params.fee)){
                        postService.showMsg('费用不能为空');
                        return false;
                    }
                    _params.comment = $scope.createInviteInfo.comment;
                    _params.invite_type = $scope.createInviteInfo.invite_type;
                    _params.name = $scope.createInviteInfo.name;
                    if(Tools.validateNull(_params.name)){
                        postService.showMsg('联系人不能为空');
                        return false;
                    }
                    _params.contact = $scope.createInviteInfo.contact;

                    if(angular.isUndefined(_params.contact)){
                        postService.showMsg('联系电话不能为空');
                        return false;
                    }

                    if(!Tools.validatePhone(_params.contact)){
                        postService.showMsg("联系电话格式错误");
                        return false;
                    }

                    var _url_ = '/invite/publish';

                    postService.doPost(_params,_url_,function(data) {

                        $scope.doRefresh();
                        postService.showMsg(data.msg);
                        $scope.createInviteModal.hide();
                    })
                }

            });


            $scope.createInvite = function(){

                if(Auth.validateLogin()){

                    User.getMyTeams(function(data){
                        $scope.myTeams =  data.data;
                        $scope.createInviteInfo.team = data.data[0];
                    })

                    $scope.createInviteModal.show();


                }else{
                    postService.showLogin();
                }
            }

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
                    title: '请选择球队类型',
                    template: _template,
                    scope: $scope
                });
            }

            $scope.selectType = function(typeId,typeName){

                $scope.createInviteInfo.typeName = typeName;

                $scope.createInviteInfo.project = typeId;

                $scope.inviteTypes = $scope.tabs[typeId]['invite'];

                $scope.createInviteInfo.type = $scope.inviteTypes[0];

                $scope.typPopup.close();

            }

            $scope.$on('$ionicView.enter', function () {

                weiXinService.onMenuShareAppMessage('约球列表-乐土体育','乐土体育专心做赛事');

            });
        }
    ]
)
.controller('InviteCtrl',
    ['$rootScope','$scope','info',
        function($rootScope,$scope,info) {

        }
    ]
)
.controller('InviteDetailCtrl',
    ['$rootScope','$stateParams','$scope','$state','postService','Storage','User','Tools','$ionicPopover','Auth','Login','weiXinService',

        function($rootScope,$stateParams,$scope,$state,postService,Storage,User,Tools,$ionicPopover,Auth,Login,weiXinService) {

            $scope.sign = function(){

                if(moment().format('X')>$rootScope.invite.open_time){
                    postService.showMsg('已超过打球时间');
                    return false;
                }

                if(Auth.validateLogin()){
                    if($rootScope.invite.invite_type==1){
                        User.getMyTeams(function(data){
                            $scope.myTeams = data.data;

                            var _content = '您将报名“'+$rootScope.invite.title+'”</br>请输入一下信息:</br>' +
                                '<input type="text" id="name" placeholder="请输入姓名" class="layer-input">' +
                                '<input type="tel" id="phone" placeholder="请输入联系方式" class="layer-input">' +
                                '<label class="item item-input item-select layer-input">' +
                                '<select id="team" class="layer-select">';

                            angular.forEach($scope.myTeams,function(team,inde){
                                _content+='<option value="'+team.id+'">'+team.name+'</option>' ;
                            })
                            _content+='</select></label>';

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
                                    var _team = angular.element(document.getElementById("team")).val();

                                    var _params = {
                                        'invite_id':$stateParams.invite_id,
                                        'name':_name,
                                        'phone':_phone,
                                        'team_id':_team
                                    }

                                    var _url_sign="/invite/sign";

                                    postService.doPost(_params,_url_sign,function(data){

                                        $rootScope.invite.is_sign = true;

                                        if($rootScope.invite.invite_type==1){
                                            var _member = {
                                                'avatar':data.data.avatar,
                                                'team_id':data.data.uid
                                            }
                                        }else{
                                            var _member = {
                                                'avatar':data.data.avatar,
                                                'uid':data.data.uid
                                            }
                                        }
                                        $scope.wait.push(_member);
                                        $scope.wait_count++;

                                        postService.showMsg(data.msg);

                                    })


                                }, no: function(){

                                }
                            });

                        })
                    }else{
                        var _content = '您将报名“'+$rootScope.invite.title+'”</br>请输入一下信息:</br>' +
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
                                var _team = angular.element(document.getElementById("team")).val();

                                var _params = {
                                    'invite_id':$stateParams.invite_id,
                                    'name':_name,
                                    'phone':_phone,
                                    'team_id':_team
                                }

                                var _url_sign="/invite/sign";

                                postService.doPost(_params,_url_sign,function(data){

                                    $rootScope.invite.is_sign = true;

                                    if($rootScope.invite.invite_type==1){
                                        var _member = {
                                            'avatar':data.data.avatar,
                                            'team_id':data.data.uid
                                        }
                                    }else{
                                        var _member = {
                                            'avatar':data.data.avatar,
                                            'uid':data.data.uid
                                        }
                                    }
                                    $scope.wait.push(_member);
                                    $scope.wait_count++;

                                    postService.showMsg(data.msg);

                                })


                            }, no: function(){

                            }
                        });
                    }
                }else{

                    postService.showLogin();
                }

            }

            var getSigns= function(){

                var _url_getSigns = '/invite/getSigns';

                var _params = {
                    invite_id:$stateParams.invite_id
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

            $ionicPopover.fromTemplateUrl('templates/invite/detailOptPopover.html', {
                scope: $scope
            }).then(function(popover) {
                $scope.detailOptPopover = popover;
            });

            $scope.showDetailOpt = function($event) {

                $scope.detailOptPopover.show($event);
            };

            $scope.$on('$ionicView.enter',function () {

                weiXinService.onMenuShareAppMessage('约球-'+$rootScope.invite.title+'-乐土体育','乐土体育专心做赛事');

            });
        }
    ]
)
.controller('InviteWaitMembersCtrl',
    ['$rootScope','$scope','$stateParams','postService','$ionicActionSheet','weiXinService',

        function($rootScope,$scope,$stateParams,postService,$ionicActionSheet,weiXinService){

            var _url_getWaitMember = '/invite/waits';

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

                        var _url_acceptJoin = '/invite/acceptJoin';

                        var _params = {
                            invite_id:$stateParams.invite_id,
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

                        var _url_acceptJoin = '/invite/acceptJoin';

                        var _params = {
                            invite_id:$stateParams.invite_id,
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
.controller('InviteEditCtrl',
    ['$rootScope','$scope','postService','$stateParams','$timeout','Storage','User','$ionicPopup','Tools','TimePickerService',
        function($rootScope,$scope,postService,$stateParams,$timeout,Storage,User,$ionicPopup,Tools,TimePickerService) {

            $scope.tabs = Storage.get('tabs');

            User.getMyTeams(function(data){
                $scope.myTeams =  data.data;
            })

            $scope.inviteTypes = $scope.tabs[1]['invite'];

            $scope.minDate =  new Date();

            $scope.days = TimePickerService.getFullYear($scope.minDate);

            $scope.hours = TimePickerService.getHours();

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
                    title: '请选择球队类型',
                    template: _template,
                    scope: $scope
                });
            }

            $scope.selectType = function(typeId,typeName){

                $rootScope.invite.project_name = typeName;

                $rootScope.invite.project = typeId;

                $scope.inviteTypes = $scope.tabs[typeId]['invite'];

                $rootScope.invite.type = $scope.inviteTypes[0];

                $scope.typPopup.close();

            }

            $scope.submitEditInvite = function(){

                var _params = {
                    'invite_id':$rootScope.invite.invite_id
                };
                _params.title = $rootScope.invite.title;
                if(Tools.validateNull(_params.title)){
                    postService.showMsg('标题不能为空');
                    return false;
                }
                _params.project = $rootScope.invite.project;
                _params.team_id = $rootScope.invite.uid;
                _params.type = $rootScope.invite.type;
                _params.open_time = $rootScope.invite.open_date+" "+$rootScope.invite.open_hours;
                _params.address = $rootScope.invite.address;
                if(Tools.validateNull(_params.address)){
                    postService.showMsg('场地不能为空');
                    return false;
                }
                _params.fee = $rootScope.invite.fee;
                if(Tools.validateNull(_params.fee)){
                    postService.showMsg('费用不能为空');
                    return false;
                }
                _params.comment = $rootScope.invite.comment;
                _params.invite_type = $rootScope.invite.invite_type;
                _params.name = $rootScope.invite.name;
                if(Tools.validateNull(_params.name)){
                    postService.showMsg('联系人不能为空');
                    return false;
                }
                _params.contact = $rootScope.invite.contact;

                if(angular.isUndefined(_params.contact)){
                    postService.showMsg('联系电话不能为空');
                    return false;
                }

                if(!Tools.validatePhone(_params.contact)){
                    postService.showMsg("联系电话格式错误");
                    return false;
                }


                var _url_ = '/invite/edit';

                postService.doPost(_params,_url_,function(data) {

                    postService.showMsg(data.msg);
                })

            }

        }

    ]
)





