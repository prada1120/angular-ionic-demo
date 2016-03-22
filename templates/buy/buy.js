angular.module('Letu.buyControllers', [])

    .controller('buyCtrl',
    ['$rootScope','ENV','$scope', '$timeout','$stateParams','postService','$ionicModal','$ionicLoading','$ionicListDelegate','weiXinService',

      function($rootScope,ENV,$scope,$timeout,$stateParams,postService,$ionicModal,$ionicLoading,$ionicListDelegate,weiXinService){

        $scope.stateParams = $stateParams;

      }
    ]
)



