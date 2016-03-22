var app = angular.module('ionic-citydata', ['ionic']);
app.service('CityPickerService', function ($http,ENV,$q) {

    this.cityList = function(){
        return $http.get('js/cityList.json');
    };
});
