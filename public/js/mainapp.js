"use strict";
angular.module('myApp', [ require('angular-touch'),'ngAnimate',
  require('angular-local-storage')])
.config(function ($locationProvider) { //config your locationProvider
       $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
     });
  })
.config(['$httpProvider', function($httpProvider) {
    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};    
    }    



    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
}])
 .constant("baseURL","http://xx-jia.com/")
 .filter('comment', function() {
  return function(input, rate) {
    var out = [];

     if (rate=='low'){ //low
        for (var i = 0; i < input.length; i++) {
          if (input[i].rate==1) {
                out.push(input[i]);
          }        
       }
     }else if(rate=='medium'){//medium
        for (var i = 0; i < input.length; i++) {
          if (input[i].rate==2||input[i].rate==3) {
                out.push(input[i]);
          }        
       }
     }else if(rate=='high'){
        for (var i = 0; i < input.length; i++) {
          if (input[i].rate==4||input[i].rate==5) {
                out.push(input[i]);
          }        
       }
     }else{
      return input;
     }
    return out;
  };
})
.directive('detailslider', function ($timeout) {
  return {
    restrict: 'AE',
  replace: true,
  scope:{
    images: '='
  },
    link: function (scope, elem, attrs) {
  
    scope.currentIndex=0;

    scope.next=function(){
      scope.currentIndex<scope.images.length-1?scope.currentIndex++:scope.currentIndex=0;
    };
    
    scope.prev=function(){
      scope.currentIndex>0?scope.currentIndex--:scope.currentIndex=scope.images.length-1;
    };
    
    scope.$watch('currentIndex',function(){
      scope.images.forEach(function(image){
        image.visible=false;
      });
      scope.images[scope.currentIndex].visible=true;
    });
    
    /* Start: For Automatic slideshow*/
    
    var timer;
    
    var sliderFunc=function(){
      timer=$timeout(function(){
        scope.next();
        timer=$timeout(sliderFunc,5000);
      },5000);
    };
    
    sliderFunc();
    
    scope.$on('$destroy',function(){
      $timeout.cancel(timer);
    });
    
    /* End : For Automatic slideshow*/
    
    },
  templateUrl:'directives/detail/detailslider.html'
  }
})
.directive('youlike',[ function() {
  return {
    restrict: 'E',
    templateUrl:'directives/index/youlike.html'
  };
}])
.directive('productinfo',[ function() {
  return {
    restrict: 'E',
    templateUrl:'/directives/detail/productinfo.html'
  };
}])
.directive('comment',[ function() {
  return {
    restrict: 'E',
    templateUrl:'directives/detail/comment.html'
  };
}])
.directive('cartyou',[ function() {
  return {
    restrict: 'E',
    templateUrl:'directives/cart/cartyou.html'
  };
}])
.directive('cartno',[ function() {
  return {
    restrict: 'E',
    templateUrl:'directives/cart/cartno.html'
  };
}])
.directive('confirmorder',[ function() {
  return {
    restrict: 'E',
    templateUrl:'directives/order/confirmorder.html'
  };
}])
.directive('orderfinish',[ function() {
  return {
    restrict: 'E',
    templateUrl:'directives/order/orderfinish.html'
  };
}])
.directive('orderprolist',[ function() {
  return {
    restrict: 'E',
    templateUrl:'directives/order/orderprolist.html'
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
}])
.directive('usermenulist',[ function() {
  return {
    restrict: 'E',
    templateUrl:'directives/user/menulist.html'
  };
}]);
