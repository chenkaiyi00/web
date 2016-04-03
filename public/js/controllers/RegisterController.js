angular.module('myApp').
controller('RegisterController', ['$scope','UserFactory',
'baseURL', '$window',
 function($scope,UserFactory,baseURL,$window){
 
                          $scope.value = {
                              phonenum:null,
                              password:null,
                              show_pwd:false
                          };
                          $scope.inputType = 'password'
                     // Hide & show password function
            $scope.hideShowPassword = function(){
              if ($scope.inputType == 'password')
                $scope.inputType = 'text';
            else
                $scope.inputType = 'password';
  };
                       $scope.errorMessage='';
                       $scope.showErr=false;

                       $scope.enable = function(){
                              if (!$scope.value.phonenum) {
                                         return false;
                                   }
                              if (!$scope.value.password) {
                                 return false;
                              }
                        return  $scope.value.phonenum.length==11&&
                              ($scope.value.password.length>=6&&$scope.value.password.length<=20)
                       };  
                    $scope.register = function (){
                      if (!$scope.value.password) {
                       $scope.errorMessage='密码应为6-20位字母，数字或符号组合';
                          $scope.showErr=true;
                           return;
                      }
                      if ( !$scope.value.phonenum) {
                            $scope.errorMessage='请输入正确的手机号码';
                            $scope.showErr=true;
                             return;
                       }
                         if ( $scope.value.phonenum.length!==11) {
                             $scope.errorMessage='请输入正确的手机号码';
                            $scope.showErr=true;
                             return;
                         }
                         if (   !($scope.value.password.length>=6&&
                          $scope.value.password.length<=20)) {
                           $scope.errorMessage='密码应为6-20位字母，数字或符号组合';
                          $scope.showErr=true;
                           return;
                         }

                        $scope.showErr=false;
                UserFactory.register($scope.value.phonenum,$scope.value.password)
                      
                     .then(function(user) {            
                         // set token in services 
                    $window.location.href=baseURL+'cart.html';
                  })   
                      .catch(function(err){
                           //console.log(err);
                           // if 电话已经被注册了
                           //if验证码不正确
                          });
                  };
               
                 
}]);