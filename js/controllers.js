angular.module('Letu.controllers', [])

.controller('tabCtrl',
    ['$rootScope','ENV','$scope','$state','postService','Auth','Storage','$ionicModal',

      function($rootScope,ENV,$scope,$state,postService,Auth,Storage,$ionicModal){

        $ionicModal.fromTemplateUrl('templates/tabAddModal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal){
          $scope.editNameModal = modal;
        });

        $scope.addF = function(){

          $scope.editNameModal.show();
        }
      }
    ]
)



