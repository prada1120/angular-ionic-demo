"use strict";
var app = angular.module('Letu.timepicker', []);
app.directive('letuTimePicker', ['$ionicPopup', '$timeout','TimePickerService','$ionicScrollDelegate','$ionicModal','moment', function ($ionicPopup, $timeout,TimePickerService, $ionicScrollDelegate,$ionicModal,moment) {
    return {
        restrict: 'AE',
        template:  '<input type="text" style="background-color: #fff" placeholder={{vm.placeholder}} ng-model="startDate"  class={{vm.cssClass}} readonly>',
        scope: {
            startDate: '=',
            minDate:'=',
            backdrop:'@',
            backdropClickToClose:'@',
            callback:'@',
            buttonClicked: '&'
        },
        link: function (scope, element, attrs) {
            var vm=scope.vm={},timepickerModel=null;
            //根据城市数据来 设置Handle。
            vm.dayHandle="dayHandle"+attrs.startDate;
            vm.hourHandle="hourHandle"+attrs.startDate;
            vm.minuteHandle="minuteHandle"+attrs.startDate;
            vm.placeholder=attrs.placeholder || "请选择城市";
            vm.okText=attrs.okText || "确定";
            vm.pickerTitle=attrs.pickerTitle || "选择时间";
            vm.cssClass=attrs.cssClass;
            vm.barCssClass=attrs.barCssClass || "bar-blue";
            vm.backdrop=scope.$eval(scope.backdrop) || false;
            vm.backdropClickToClose=scope.$eval(scope.backdropClickToClose) || false;

            vm.returnOk=function(){
                scope.$emit(scope.callback,scope.startDate);
                timepickerModel && timepickerModel.hide();
                scope.buttonClicked && scope.buttonClicked();
            }
            vm.clickToClose=function(){
                vm.backdropClickToClose && timepickerModel && timepickerModel.hide();
            }
            vm.getData=function(name){
                $timeout.cancel(vm.scrolling);//取消之前的scrollTo.让位置一次性过渡到最新
                $timeout.cancel(vm.dataing);//取消之前的数据绑定.让数据一次性过渡到最新
                switch(name)
                {
                    case 'day':
                        var day=true,length=vm.days.length,Handle=vm.dayHandle;
                        break;
                    case 'hour':
                        var hour=true,length=vm.hours.length,Handle=vm.hourHandle;
                        break;
                    case 'minute':
                        var minute=true,Handle=vm.minuteHandle,length=vm.minutes.length;
                        break;
                }
                var top= $ionicScrollDelegate.$getByHandle(Handle).getScrollPosition().top;//当前滚动位置

                var index = Math.round(top / 36);

                if (index < 0 ) index =0;//iOS bouncing超出头

                if (index >length-1 ) index =length-1;//iOS bouncing超出尾


                if (top===index*36 ) {
                    vm.dataing=$timeout(function () {
                        day && (vm.day=vm.days[index]);//处理省市乡联动数据
                        hour &&  (vm.hour=vm.hours[index]);//处理市乡联动数据
                        minute &&  (vm.minute=vm.minutes[index]);

                        scope.startDate = vm.day.value+' '+vm.hour+':'+vm.minute;

                        var a = moment(scope.minDate);
                        var b = moment(scope.startDate);

                        if(a.isAfter(b)){
                            vm.scrollTime(scope.minDate);
                        }

                    },150)
                }else{
                    vm.scrolling=$timeout(function () {
                        $ionicScrollDelegate.$getByHandle(Handle).scrollTo(0,index*36);
                    },150)
                }

            }

            vm.scrollTime = function(time){

                var a = moment(scope.minDate);
                var b = moment(time);

                var aTemp = moment(scope.minDate).hours(0).minutes(0);
                var bTemp = moment(time).hours(0).minutes(0);

                var dis = bTemp.diff(aTemp, 'days');


                $ionicScrollDelegate.$getByHandle(vm.dayHandle).scrollTo(0, dis * 36);
                vm.day=vm.days[dis];

                var index = b.hours();
                $ionicScrollDelegate.$getByHandle(vm.hourHandle).scrollTo(0, index * 36);
                vm.hour=vm.hours[index];


                var index =  b.minutes();
                $ionicScrollDelegate.$getByHandle(vm.minuteHandle).scrollTo(0, index* 36);
            }

            element.on("click", function () {
                //零时处理 点击过之后直接显示不再创建
                if (!attrs.checked) {
                    timepickerModel && timepickerModel.remove();
                }else{
                    timepickerModel && timepickerModel.show();
                    return
                }

                $ionicModal.fromTemplateUrl('lib/ionic-picker-time/time-picker-modal.html', {
                    scope: scope,
                    animation: 'slide-in-up',
                    backdropClickToClose:vm.backdropClickToClose
                }).then(function(modal) {
                    timepickerModel = modal;
                    //初始化 先获取数据后展示

                        var startDateStr = scope.startDate.replace(/-/g,'/');
                        var minDateStr = scope.minDate.replace(/-/g,'/');

                        vm.startDate = new Date(startDateStr);

                        vm.minDate = new Date(minDateStr);

                        vm.days = TimePickerService.getFullYear(vm.minDate);

                        vm.hours = TimePickerService.getHours();

                        vm.minutes = TimePickerService.getMinutes();

                        vm.scrollTime(vm.startDate)

                    attrs.checked=true;

                    timepickerModel.show();
                })
            })
            //销毁模型
            scope.$on('$destroy', function() {
                timepickerModel && timepickerModel.remove();
            });
        }
    }
}]);
app.service('TimePickerService', function () {

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
        var hours = [];
        for(var i=0;i<24;i++){
            i=i<10?'0'+i:i;
            hours.push(i);
        }
        return hours;
    }

    this.getMinutes = function(){
        var minutes = [];
        for(var i=0;i<60;i++){
            i=i<10?'0'+i:i;
            minutes.push(i);
        }
        return minutes;
    }
})