angular.module('Letu.voteControllers', [])

.controller('VoteListCtrl',
    ['$rootScope','$scope','$state','postService','Storage','weiXinService','$ionicModal','Auth','$ionicPopup','moment','User','Tools',

        function($rootScope,$scope,$state,postService,Storage,weiXinService,$ionicModal,Auth,$ionicPopup,moment,User,Tools){

            $scope.tabs = Storage.get('tabs');

            $scope.path={
                page:0
            }

            $scope.votes = [];

            $scope.hasNextPage = false;

            $scope.loadMore = function(){

                var url="/vote/search";

                $scope.path.page++;

                postService.doPost($scope.path,url,function(data){

                    if(data.data.cur_page>=data.data.total_page){
                        $scope.hasNextPage = false;
                    }else{
                        $scope.hasNextPage = true;
                    }

                    var items = data.data.votes;

                    for (var i = 0; i < items.length; i++) {

                        $scope.votes.push(items[i]);

                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                })
            }

            /**
             * 搜索
             */
            $scope.search = function(){

                $scope.votes = [];

                $scope.hasNextPage = false;

                $scope.path.page = 0;

                $scope.loadMore();

            }

            /**
             * 下拉刷新
             */
            $scope.doRefresh = function(){

                $scope.votes = [];

                $scope.hasNextPage = false;

                $scope.path.page = 0;

                $scope.loadMore();
                $scope.$broadcast('scroll.refreshComplete');
            }

            $scope.loadMore();

            $scope.$on('$ionicView.enter', function () {

                weiXinService.onMenuShareAppMessage('有奖互动-乐土体育','乐土体育专心做赛事');

            });
        }
    ]
)
.controller('VoteCtrl',
    ['$rootScope','$scope','info',
        function($rootScope,$scope,info) {

        }
    ]
)
.controller('VoteDetailCtrl',
    ['$rootScope','$stateParams','$scope','postService','Storage','weiXinService','Tools','Auth','Login',

        function($rootScope,$stateParams,$scope,postService,Storage,weiXinService,Tools,Auth,Login) {

            $scope.onTapSelect = function(option,question){

                if(question.is_checkbox==0){
                    if(angular.isDefined(question.is_check_option)){
                        question.is_check_option.is_check = false;
                    }
                    option.is_check = true;
                    question.is_check_option = option;

                }else{
                    option.is_check = !option.is_check;
                }

            }

            $scope.addVote = function(){
                var _options = '';
                angular.forEach($rootScope.vote.questions,function(question,index){
                    angular.forEach(question.options,function(option,index){
                        if(option.is_check){
                            option.total++;
                            question.total++;
                            _options+=option.option_id+',';
                        }
                    })
                })

                _options =  _options.substring(0,_options.length-1);

                if(Tools.validateNull(_options)){
                    postService.showMsg('请选择');
                    return false;
                }
                var _params = {
                    'vote_id':$stateParams.vote_id,
                    'options':_options
                };

                var _url = '/vote/addVote';

                postService.doPost(_params,_url,function(data){

                    postService.showMsg(data.msg);

                    $rootScope.vote.is_voted = true;

                    $rootScope.vote.lottery_num = $rootScope.vote.ratio;

                })
            }

            $scope.$on('$ionicView.enter', function () {

                weiXinService.onMenuShareAppMessage($rootScope.vote.title,$rootScope.vote.content_strip);

            });
        }
    ]
)
.controller('VoteVotedCtrl',
    ['$rootScope','$scope','$stateParams','postService','option','$ionicLoading',
        function($rootScope,$scope,$stateParams,postService,option,$ionicLoading) {

            var _url = '/vote/votedLog';

            $scope.option = option.data.data;

            var _params = {
                'vote_id':$stateParams.vote_id,
                'option_id':$stateParams.option_id
            };

            postService.doPost(_params,_url,function(data){

                $scope.logs = data.data;

            })

        }
    ]
)
.controller('VoteAwardCtrl',
    ['$rootScope','$stateParams','$scope','Storage','postService','weiXinService',
        function($rootScope,$stateParams,$scope,Storage,postService,weiXinService) {

            $scope.vote_id = $stateParams.vote_id;

            $scope.prize_id = $stateParams.prize_id;
            /**
             * 得到抽奖记录
             */
            var getAwardLog = function () {

                var _url = '/vote/awardLog';

                var _params = {
                    'prize_id':$stateParams.prize_id
                };

                postService.doPost(_params,_url,function(data){

                    $scope.award = data.data;

                    console.log($scope.award);

                })
            }


            $scope.$on('$ionicView.enter', function () {

                $('.list_lh li:even').addClass('lieven');

                $(".list_lh").myScroll({
                    speed:40, //数值越大，速度越慢
                    rowHeight:44 //li的高度
                });

                weiXinService.onMenuShareAppMessage($rootScope.vote.title,$rootScope.vote.content_strip);

            });

            /**
             * 调取得到抽奖记录
             */
            getAwardLog();

            //抽奖
            var turnplate = {
                turnplateBox: $('#turnplate'),
                turnplateBtn: $('#platebtn'),
                lightDom: $('#turnplatewrapper'),
                freshLotteryUrl: '#',//刷新转盘的地址
                msgBox: $('#msg'),
                lotteryUrl: '#',//奖品地址
                height: '320', //帧高度
                lightSwitch: 0, //闪灯切换开关. 0 和 1间切换
                minResistance: 5, //基本阻力
                Cx: 0.01, //阻力系数 阻力公式：  totalResistance = minResistance + curSpeed * Cx;
                accSpeed: 15, //加速度
                accFrameLen: 40, //加速度持续帧数
                maxSpeed: 250, //最大速度
                minSpeed: 20, //最小速度
                frameLen: 8, //帧总数
                totalFrame: 0, //累计帧数,每切换一帧次数加1
                curFrame: 0, //当前帧
                curSpeed: 20, //上帧的速度
                lotteryTime: 2, //抽奖次数
                lotteryIndex: 6, //奖品index
                errorIndex: 2, //异常时的奖品指针
                initBoxEle: $('#turnplate #init'),
                progressEle: $('#turnplate #init span'),
                initProgressContent: '~~~^_^~~~', //初始化进度条的内容
                initFreshInterval: 500, //进度条刷新间隔
                virtualDistance: 10000, //虚拟路程,固定值，速度越快，切换到下帧的时间越快: 切换到下帧的时间 = virtualDistance/curSpeed
                isStop: true, //抽奖锁,为true时，才允许下一轮抽奖
                timer2: 10,//计时器
                initTime: 5,
                showMsgTime: 2000, //消息显示时间
                lotteryChannel: '',
                lotteryMsg: '',

                channelList: {
                    'login': '每日登录',
                    'consume': '购买空间'
                },

                lotteryType: {
                    '5M': 0,
                    '80M': 1,
                    '1G': 2,
                    '200M': 3,
                    '100M': 4,
                    '20M': 5,
                    'empty': 6,
                    '10G': 7,
                    '50M': 8,
                    '1T': 9
                }
            }

            //初始化
            var init = function() {
                initAnimate()
                freshLottery();
                turnplate.turnplateBtn.click($.proxy(function(){
                    click();
                },this));
            };
            //初始化动画
            var initAnimate = function() {
                turnplate.initBoxEle.show();
                clearTimeout(turnplate.initTimer);
                var curLength = turnplate.progressEle.text().length,
                    totalLength = turnplate.initProgressContent.length;
                if (curLength < totalLength) {
                    turnplate.progressEle.text(turnplate.initProgressContent.slice(0, curLength + 1));
                }else{
                    turnplate.progressEle.text('');
                }
                turnplate.initTimer = setTimeout($.proxy(initAnimate, this), turnplate.initFreshInterval);
            };
            //停止初始化动画
            var stopInitAnimate = function() {
                clearTimeout(turnplate.initTimer);
                    turnplate.initBoxEle.hide();
            };
            var freshLotteryTime= function() {
                $('#top-menu').find('.lottery-times').html(turnplate.lotteryTime);
            };
            //更新抽奖次数
            var freshLottery= function() {
                stopInitAnimate();
                setBtnHover();
                turnplate.isStop = true;
                turnplate.lotteryTime = 1;
                freshLotteryTime();
            };
            //设置按钮三态
            var setBtnHover= function() {
                //按钮三态
                $('#platebtn').hover(function(){
                    $(this).addClass('hover');
                },function() {
                    $(this).removeClass('hover click');
                }).mousedown(function(){
                    $(this).addClass('click');
                }).mouseup(function(){
                    $(this).removeClass('click');
                });
            };
            //获取奖品
            var lottery= function() {
                turnplate.lotteryTime--;
                freshLotteryTime();
                turnplate.totalFrame = 0;
                turnplate.curSpeed = turnplate.minSpeed;
                turnAround();
            };
            //点击抽奖
            var click= function() {

                //加锁时
                if(turnplate.isStop == false) {
                    showMsg('现在还不能抽奖哦');
                    return;
                }

                var _validate = false;

                var _validat_msg = '';

                var _validat_index = '';

                var _path = {
                    authToken:Storage.get('authToken'),
                    vote_id:$stateParams.vote_id
                };

                $.ajax({
                    type: 'POST',
                    url: baseUrl+'/vote/doAward',
                    data: _path,
                    success: function(data){
                        if(data.status==1){
                            _validate = true;
                            _validat_index= data.data;
                            _validat_msg = data.msg;
                        }else{
                            _validat_msg = data.msg;
                        }
                    },
                    dataType: "json",
                    async:false
                });

                if(!_validate){
                    showMsg(_validat_msg);
                    return;
                }else{
                    turnplate.lotteryMsg = _validat_msg;
                    turnplate.lotteryIndex = _validat_index;
                }

                lottery();

            };

            //更新当前速度
            var freshSpeed= function() {
                var totalResistance = turnplate.minResistance + turnplate.curSpeed * turnplate.Cx;
                var accSpeed = turnplate.accSpeed;
                var curSpeed = turnplate.curSpeed;
                if(turnplate.totalFrame >= turnplate.accFrameLen) {
                    accSpeed = 0;
                }
                curSpeed = curSpeed - totalResistance + accSpeed;
                if(curSpeed < turnplate.minSpeed){
                    curSpeed = turnplate.minSpeed;
                }else if(curSpeed > turnplate.maxSpeed){
                    curSpeed = turnplate.maxSpeed;
                }
                turnplate.curSpeed  = curSpeed;
            };

            //闪灯,切换到下一张时调用
            var switchLight= function() {
                turnplate.lightSwitch = turnplate.lightSwitch === 0 ? 1 : 0;
                var lightHeight = -turnplate.lightSwitch * turnplate.height;
                turnplate.lightDom.css('backgroundPosition','0 ' + lightHeight.toString() + 'px');
            };

            //旋转,trunAround,changeNext循环调用
            var turnAround= function() {
                //加锁
                turnplate.isStop = false;
                var intervalTime = parseInt(turnplate.virtualDistance/turnplate.curSpeed);

                turnplate.timer = window.setTimeout(function() {
                    //判断是否应该停止
                    if(turnplate.lotteryIndex !== undefined && turnplate.curFrame == turnplate.lotteryIndex && turnplate.curSpeed <= turnplate.minSpeed+10 && turnplate.totalFrame > turnplate.accFrameLen) {
                        turnplate.isStop = true;
                        showAwards();
                        return;
                    }

                    var nextFrame =  turnplate.curFrame+1 < turnplate.frameLen ? turnplate.curFrame+1 : 0;
                    var bgTop = - nextFrame * turnplate.height;
                    turnplate.turnplateBox.css('backgroundPosition','0 ' + bgTop.toString() + 'px');
                    switchLight();
                    turnplate.curFrame = nextFrame;
                    turnplate.totalFrame ++;
                    freshSpeed();
                    turnAround();
                }, intervalTime);
            };

            //弹出奖品
            var showAwards= function(){
                /*弹出获奖提示的地方*/
                showMsg(turnplate.lotteryMsg);
            };

            //显示提示信息
            var showMsg= function(msg, isFresh) {
                isFresh = typeof isFresh == 'undefined' ? false : true;
                if(typeof msg != 'string'){
                    msg = '今天已经抽过奖了，明天再来吧';
                }
                var msgBox = turnplate.msgBox;
                var display = msgBox.css('display');

                msgBox.html(msg);

                window.clearTimeout(turnplate.timer2);
                msgBox.show();
                var fadeOut = $.proxy(function() {
                    msgBox.fadeOut('slow');
                }, this);
                turnplate.timer2 = window.setTimeout(fadeOut, turnplate.showMsgTime);
            };

            init();

        }
    ]
)
.controller('VoteLogCtrl',
    ['$rootScope','$scope','$stateParams','postService','Tools','Storage',
        function($rootScope,$scope,$stateParams,postService,Tools,Storage) {

            var _url = '/vote/userAwardLog';

            $scope.prize_id = $stateParams.prize_id;

            var _params = {
                'prize_id':$stateParams.prize_id
            };

            postService.doPost(_params,_url,function(data){

                $scope.logs = data.data;

            })

            $scope.showLog = function(log){

                var _log_data = log.log_data;


                if(Tools.validateNull(_log_data)){
                    _log_data = Storage.get('vote_address');

                    if(Tools.validateNull(_log_data)){
                        _log_data = {
                            'name': '',
                            'phone': '',
                            'address': ''
                        };
                    }
                }

                var _content = '请填写您的收货信息</br>' +
                    '<input type="text" id="name" value="'+_log_data.name+'" placeholder="请输入收货姓名" class="layer-input">' +
                    '<input type="tel" id="phone" value="'+_log_data.phone+'" placeholder="请输入手机号码" class="layer-input">' +
                    '<input type="text" id="address" value="'+_log_data.address+'" placeholder="请输入收货地址" class="layer-input">';

                layer.open({
                        content: _content,
                        btn: ['发送', '取消'],
                        style: 'text-align: center;',
                        yes: function (index) {
                            var _name = angular.element(document.getElementById("name")).val();

                            if (Tools.validateNull(_name)) {
                                alert('请输入收货姓名');
                                return false;
                            }

                            var _phone = angular.element(document.getElementById("phone")).val();

                            if (!Tools.validatePhone(_phone)) {
                                alert('手机号码格式错误');
                                return false;
                            }

                            var _address = angular.element(document.getElementById("address")).val();
                            if (Tools.validatePhone(_address)) {
                                alert('请输入收货地址');
                                return false;
                            }

                            var _params = {
                                'pl_id': log.pl_id,
                                'name': _name,
                                'phone': _phone,
                                'address': _address
                            }

                            Storage.set('vote_address',_params);

                            var _joinTeamUrl = "/vote/addAddress";

                            postService.doPost(_params, _joinTeamUrl, function (data) {

                                postService.showMsg(data.msg);

                            })
                        },
                        no: function () {

                        }
                    })

            }
        }
    ]
)





