angular.module('myApp').
controller('PayController', ['$scope','$location',
 function($scope,$location){
   
          $scope.total=$location.search().t;
                       
}]);