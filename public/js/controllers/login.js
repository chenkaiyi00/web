angular.module('myApp').
controller('LoginController', ['$scope','UserFactory',
'baseURL', '$window',
 function($scope,UserFactory,baseURL,$window){
 
                          $scope.value = {
                              phonenum:null,
                              password:null,
                              remember:false
                          };
                        $scope.logNotif="登录";



                    $scope.login = function (){
                      if (!$scope.value.password) {
                      
                      $('#errorMessage').addClass('show');
                      $('#errorMessage').text('请输入密码').fadeIn(400).delay(1000).fadeOut(400); 
                           return;
                      }
                      if ( !$scope.value.phonenum) {
                        $('#errorMessage').addClass('show');
                         $('#errorMessage').text('请输入邮箱/手机/用户名').fadeIn(400).delay(1000).fadeOut(400); 
                             return;
                       }

                         if (   !($scope.value.password.length>=6&&
                          $scope.value.password.length<=20)) {
                            $('#errorMessage').addClass('show');
                             $('#errorMessage').text('密码不正确').fadeIn(400).delay(1000).fadeOut(400); 

                           return;
                         }
                  
                    $scope.logNotif="登录中...";
                  UserFactory.login($scope.value.phonenum,$scope.value.password)
                    .then(function(user) {
                        $scope.logNotif="登录";
                        if(user){ 

                              //console.log(user.data.cart);
                          //combine local cart and user's cart
                        UserFactory.combineCart(user.data.cart);
                          //go back to main page after login
                      // $http.get(baseURL);
                           //console.log(user.data.cart);
                      $window.location.href=baseURL+'cart.html'; 
                        }
                    })
                        .catch(function(err){
                            $scope.logNotif="登录";
                    // do something      
                         if (err.status==401) {
                   
                           //  console.log(err);
                               if (err.data.err=="User Not found."
                                ||err.data.err=="Invalid Password") {
                          $('#errorMessage').addClass('show');
                         $('#errorMessage').text('密码或账号不正确').fadeIn(400).delay(1000).fadeOut(400); 
                              }
                          }
                      });
                 }; 
                 
}]);