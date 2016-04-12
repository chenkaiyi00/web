angular.module('myApp').
controller('PasswordController', ['$scope','baseURL','UserFactory','$window',
 function($scope,baseURL,UserFactory,$window){
            $scope.value={
              oldpwd:null
              pwd:null
            };
            $scope.validatePwd = function(oldpassword){
                   UserFactory.validatePwd(oldpassword)
                   .then(function(){
                              // set password visible  
                          $scope.setMode = true;
                         })
                   .catch(function(err){
                       
                      console.log(err);
                      //show err message
                       $scope.showErr();
                   })
            };
          $scope.changePwd = function(password){
                   UserFactory.changePwd(password)
                   .then(function(){
                              // go to changepwdsuc.html  
                        $window.location.href=baseURL+'changepwdsuc.html'; 
                         })
                   .catch(function(err){
                       
                      console.log(err);
                      //show err message
                   })
            };
            $scope.setMode = false;
            $scope.showErr = function(){
              $('#msgs').show();
            };
               $scope.noshowErr = function(){
              $('#msgs').hide();
            };
}]);