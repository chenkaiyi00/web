angular.module('myApp').
controller('UserController', ['$scope','UserFactory','localStorageService',
'baseURL', '$window','$rootScope',
 function($scope,UserFactory,localStorageService,baseURL,$window,$rootScope){
                    $scope.logNotif="登录";      
                    $scope.errorMessage = "账号或者密码错误";
                    $scope.showErrMessage = false;

                     $scope.gotoRegister = function(){
              
                 
                  };

                 $scope.isloggedin = function(){
                  return  UserFactory.loggedIn();
                 };
                 $scope.logout = function(){
                       UserFactory.logout();
                     $window.location.href=baseURL;
                     };

                  UserFactory.init()
                   .then(function(user){   
                                  
                      $scope.user = UserFactory.getUser();
                     $rootScope.$broadcast('UserController:getUserConfigSuccess');
                     $scope.$watch(function(){
                       return UserFactory.getUser();
                     },
                      function(newValue,oldValue){
                               if (newValue!==oldValue) {
                               $scope.user = newValue;
                               }
                    });                      
                  })
                    .catch(function(err){
                      //no valid token or other reason

                    UserFactory.initCart();
                   $rootScope.$broadcast('UserController:getUserConfigFail');   
                    });
                    
                 
}]);
