angular.module('Letu.findControllers', [])

.controller('findCtrl',
  ['$rootScope','ENV','$scope', '$timeout','$stateParams','postService','$ionicModal','$ionicLoading','$ionicListDelegate','weiXinService',

    function($rootScope,ENV,$scope,$timeout,$stateParams,postService,$ionicModal,$ionicLoading,$ionicListDelegate,weiXinService){

      $scope.stateParams = $stateParams;

      $scope.$on('$ionicView.enter', function () {

        weiXinService.onMenuShareAppMessage('乐土体育','每个人都是运动员');

      });

      $ionicModal.fromTemplateUrl('templates/tabAddModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal){
        $scope.editNameModal = modal;

        $scope.addF = function(){
          $scope.editNameModal.show();
        }
      });

    }
  ]
)



