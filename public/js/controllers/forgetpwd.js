angular.module('myApp').
controller('ForgetpwdController', ['$scope','baseURL','UserFactory','$window',
 function($scope,baseURL,UserFactory,$window){
            $scope.value={
              account:null,
              pwd:null
            };
            $scope.step=1;
          $scope.changePwd = function(password){
                   UserFactory.changePwd(password)
                   .then(function(){
                              // go to changepwdsuc.html  
                        $window.location.href=baseURL+'userpublic/password/changepwdsuc.html'; 
                         })
                   .catch(function(err){
                       
                      console.log(err);
                      //show err message
                   })
            };
            $scope.enable = function(){
                if ( $scope.step==1) {
                    if($scope.value.account){
                       return true;
                      }else{
                        return false;
                      }
                }else if(){

                }else if(){

                }else{

                }
            };
            $scope.gotonext = function(){
                if( $scope.step==1) {

                }else if(){

                }else if(){

                }else{

                }
                  $scope.step++;

            };
            $scope.showErr = function(){
              $('#msgs').show();
            };
               $scope.noshowErr = function(){
              $('#msgs').hide();
            };
}]);
