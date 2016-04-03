angular.module('myApp')
.directive('slider',[ function() {
  return {
  	restrict: 'E',
    templateUrl:'slider.html'
  };
}]);