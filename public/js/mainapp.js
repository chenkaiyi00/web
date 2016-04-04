"use strict";
angular.module('myApp', [require('angular-messages'),
  require('angular-local-storage')])
.config(function ($locationProvider) { //config your locationProvider
       $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
     });
  })
 .constant("baseURL","http://112.124.122.209:3000/")
.directive('slider',[ function() {
  return {
    restrict: 'E',
    templateUrl:'directives/slider.html'
  };
}])
.directive('sidemenu',[ function() {
  return {
    restrict: 'E',
    templateUrl:'directives/sidemenu.html'
  };
}])
.directive('footer',[ function() {
  return {
    restrict: 'E',
    templateUrl:'directives/footer.html'
  };
}])
.directive('navbarend',[ function() {
  return {
    restrict: 'E',
    templateUrl:'directives/navbarend.html'
  };
}])
.directive('productinfo',[ function() {
  return {
    restrict: 'E',
    templateUrl:'/directives/detail/productinfo.html'
  };
}])
.directive('copyright',[ function() {
  return {
    restrict: 'E',
    templateUrl:'directives/copyright.html'
  };
}])
.directive('cartyou',[ function() {
  return {
    restrict: 'E',
    templateUrl:'directives/cart/cartYou.html'
  };
}])
.directive('cartno',[ function() {
  return {
    restrict: 'E',
    templateUrl:'directives/cart/cartNo.html'
  };
}])
.directive('comment',[ function() {
  return {
    restrict: 'E',
    templateUrl:'directives/detail/comment.html'
  };
}])
.directive('confirmorder',[ function() {
  return {
    restrict: 'E',
    templateUrl:'directives/order/confirmorder.html'
  };
}])
.directive('orderlist',[ function() {
  return {
    restrict: 'E',
    templateUrl:'directives/order/orderlist.html'
  };
}])
.directive('orderdetail',[ function() {
  return {
    restrict: 'E',
    templateUrl:'directives/order/orderdetail.html'
  };
}])
.directive('ordernotlog',[ function() {
  return {
    restrict: 'E',
    templateUrl:'directives/order/ordernotlog.html'
  };
}])
.directive('chooseaddr',[ function() {
  return {
    restrict: 'E',
    templateUrl:'directives/addr/chooseaddr.html'
  };
}]);
