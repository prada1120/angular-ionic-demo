"use strict";
var app = angular.module('ionic-citypicker',[]);
app.directive('ionicCityPicker', ['$ionicPopup', '$timeout','CityPickerService','$ionicScrollDelegate','$ionicModal','Storage', function ($ionicPopup, $timeout,CityPickerService, $ionicScrollDelegate,$ionicModal,Storage) {
  return {
    restrict: 'AE',
    //scope: true,
    template:  '<input type="text" style="background-color: #fff" placeholder={{vm.placeholder}} ng-model="citydata"  class={{vm.cssClass}} readonly>',
    scope: {
      citydata: '=',
        citydataforids:'=',
      backdrop:'@',
      backdropClickToClose:'@',
        callback:'@',
      buttonClicked: '&'
    },
    link: function (scope, element, attrs) {
        var vm=scope.vm={},citypickerModel=null;
        //根据城市数据来 设置Handle。
        vm.provinceHandle="provinceHandle"+attrs.citydata;
        vm.cityHandle="cityHandle"+attrs.citydata;
        vm.countryHandle="countryHandle"+attrs.citydata;
        vm.placeholder=attrs.placeholder || "请选择城市";
        vm.okText=attrs.okText || "确定";
        vm.cssClass=attrs.cssClass;
        vm.barCssClass=attrs.barCssClass || "bar-blue";
        vm.backdrop=scope.$eval(scope.backdrop) || false;
        vm.backdropClickToClose=scope.$eval(scope.backdropClickToClose) || false;

        //window.localStorage.removeItem('cityList');
        //vm.cityData = window.localStorage['cityList'];

        vm.cityData = Storage.get('cityList');

        //console.log(vm.cityData);

        if(!angular.isArray(vm.cityData)){
            CityPickerService.cityList().success(function(data){

                Storage.set('cityList',data);
                //console.log(data);
                //alert(data);
                //vm.cityData = data;
                //window.localStorage['cityList'] = data;

                vm.cityData = Storage.get('cityList');
            })
        }

        vm.tag=attrs.tag || "-";
        vm.returnOk=function(){
            scope.$emit(scope.callback,scope.citydata,scope.citydataforids);
          citypickerModel && citypickerModel.hide();
          scope.buttonClicked && scope.buttonClicked();
        }
        vm.clickToClose=function(){
          vm.backdropClickToClose && citypickerModel && citypickerModel.hide();
        }
        vm.getData=function(name){
          $timeout.cancel(vm.scrolling);//取消之前的scrollTo.让位置一次性过渡到最新
          $timeout.cancel(vm.dataing);//取消之前的数据绑定.让数据一次性过渡到最新
          switch(name)
          {
            case 'province':
              var province=true,length=vm.cityData.length,Handle=vm.provinceHandle,HandleChild=vm.cityHandle;
                //if (!attrs.checked) {
                //    $ionicScrollDelegate.$getByHandle(Handle).scrollTo(0,vm._province_index*36);
                //}
            break;
            case 'city':
              if (!vm.province.sub) return false;
              var city=true,length=vm.province.sub.length,Handle=vm.cityHandle,HandleChild=vm.countryHandle;
            break;
            case 'country':
              if (!vm.city.sub) return false;
              var country=true,Handle=vm.countryHandle,length=vm.city.sub.length;
            break;
          }

          var top= $ionicScrollDelegate.$getByHandle(Handle).getScrollPosition().top;//当前滚动位置
          var index = Math.round(top / 36);
          if (index < 0 ) index =0;//iOS bouncing超出头
          if (index >length-1 ) index =length-1;//iOS bouncing超出尾
          if (top===index*36 ) {
            vm.dataing=$timeout(function () {
                province && (vm.province=vm.cityData[index],vm.city=vm.province.sub[0],vm.country={},(vm.city && vm.city.sub && (vm.country=vm.city.sub[0])));//处理省市乡联动数据
                city &&  (vm.city=vm.province.sub[index],vm.country={},(vm.city && vm.city.sub && (vm.country=vm.city.sub[0])));//处理市乡联动数据
                country &&  (vm.country=vm.city.sub[index]);//处理乡数据

                if(vm._city_index!=-1){
                    $ionicScrollDelegate.$getByHandle(HandleChild).scrollTo(0,vm._city_index*36);
                    vm._city_index = -1;
                }else if(vm._country_index!=-1){
                    $ionicScrollDelegate.$getByHandle(HandleChild).scrollTo(0,vm._country_index*36);
                    vm._country_index = -1;
                }else{
                    HandleChild && $ionicScrollDelegate.$getByHandle(HandleChild).scrollTop();
                }
                //Str数据同步
                ////Ids数据同步
               if(vm.city.sub && vm.city.sub.length>0){
                   scope.citydata=vm.province.name +vm.tag+  vm.city.name+vm.tag+vm.country.name
                   scope.citydataforids=vm.province.id +vm.tag+  vm.city.id+vm.tag+vm.country.id

               }else{
                   scope.citydata=vm.province.name +vm.tag+  vm.city.name
                   scope.citydataforids=vm.province.id +vm.tag+  vm.city.id
               }
            },150)
          }else{
            vm.scrolling=$timeout(function () {
             $ionicScrollDelegate.$getByHandle(Handle).scrollTo(0,index*36,true);
            },150)
          }

        }

        element.on("click", function () {
            //零时处理 点击过之后直接显示不再创建
            if (!attrs.checked) {
              citypickerModel && citypickerModel.remove();
            }else{
              citypickerModel && citypickerModel.show();  
              return
            }

            $ionicModal.fromTemplateUrl('lib/ionic-picker-city/city-picker-modal.html', {
              scope: scope,
              animation: 'slide-in-up',
              backdropClickToClose:vm.backdropClickToClose
            }).then(function(modal) {
              citypickerModel = modal;
              //初始化 先获取数据后展示
              $timeout(function () {

                  var _citydataforids = scope.citydataforids.split(vm.tag);

                  vm._city_index = 0;
                  vm._province_index = 0;
                  vm._country_index = 0;
                  angular.forEach(vm.cityData,function(province,key){

                      if(_citydataforids[0]==province.id){

                          vm._province_index = key;

                          angular.forEach(province.sub,function(city,city_key){

                                if(_citydataforids[1] == city.id){

                                    vm. _city_index = city_key;

                                    angular.forEach(city.sub,function(country,country_key){

                                        if(_citydataforids[2] == country.id){
                                            vm._country_index = country_key;
                                        }

                                    })
                                }
                          })
                      }
                  })
                  $timeout(function () {
                      $ionicScrollDelegate.$getByHandle(vm.provinceHandle).scrollTo(0, vm._province_index * 36);
                  },150)
                //vm.getData('province');


                attrs.checked=true;

              citypickerModel.show();

              },100)
            })
        })
        //销毁模型
        scope.$on('$destroy', function() {
          citypickerModel && citypickerModel.remove();
        });
    }
  }
}]);