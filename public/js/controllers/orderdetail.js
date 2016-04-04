  angular.module('myApp')
     .controller('OrderDetailController', ['$scope','OrderDetailFactory'
      ,'$location','$window','baseURL',
         function($scope,OrderDetailFactory,
          $location,$window,baseURL){

                   OrderDetailFactory.getbyid(parseInt($location.search().id),
                         function(err,order){
                               if (err) { 
                               //err is a error String, do something with it 

                             }  
                             //get order, set to scope,
                           $scope.order=order;
                           console.log('get Order Detail successfully');
                           console.log($scope.order);
                     });
                    
                   $scope.gotoDetail = function(){
                     $window.location.href=baseURL+
                          'orderdetail.html?id='+$scope.order._id;
                   } 
                  $scope.gotoOrderproList = function(){
                     $window.location.href=baseURL+
                          'orderproductlist.html?id='+$scope.order._id;
                   } 

                  $scope.showMenuFunc = function(){
                      if (  $scope.showMenu) {
                         $scope.showMenu = false;
                       }else{
                         $scope.showMenu = true;
                       }
                };

   
              

}]);

