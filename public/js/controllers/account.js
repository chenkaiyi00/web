angular.module('myApp').
controller('AccountController', ['$scope','UserFactory',
'baseURL', '$window','$location',
 function($scope,UserFactory,baseURL,$window,$location){
        $scope.showMenu=false;
        $scope.curOrderlist=1;
         $scope.showMenuFunc = function(){
                      if (  $scope.showMenu) {
                         $scope.showMenu = false;
                       }else{
                         $scope.showMenu = true;
                       }
                };

          $scope.showOrderList =function(index){
            return    $scope.curOrderlist==index;
          } 
           $scope.setShowOrderList =function(index){
                $scope.curOrderlist=index;
          }      
                       //get watch on user  
        $scope.$on('UserController:getUserConfigSuccess', function() { 
        // calculation based on service value
  
           $scope.user = UserFactory.getUser();
           $scope.$watch(function(){return UserFactory.getUser();},
                      function(newValue,oldValue){
                               if (newValue!==oldValue) {
                               // console.log(newValue);
                               $scope.user = newValue;
                               }
                      });

     
          });
      $scope.$on('UserController:getUserConfigFail', function() {
        // calculation based on service value

                $window.location.href=baseURL+'login.html';
                                 
          });         

}]);