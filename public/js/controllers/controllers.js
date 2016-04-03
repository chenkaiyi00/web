angular.module('myApp')

.controller('CarouselController', ['$scope','CarouselFactory','$state',
             function($scope,CarouselFactory,$state){

}])
.controller('ProfileController', ['$scope','UserFactory','SharedDataFactory',
            function($scope,UserFactory,SharedDataFactory){
                    $scope.user = UserFactory.user;
                    $scope.errorMessageChangepwd;
                    $scope.showErrMsgChangepwd = false;
                    $scope.passwordold;
                    $scope.passwordnew1;
                    $scope.passwordnew2;
                    $scope.pswsaved;
                    $scope.changePwd = function(passwordold,passwordnew1,passwordnew2){
                         
                           if (passwordnew1!==passwordnew2){
                              $scope.showErrMsgChangepwd= true;
                              $scope.errorMessageChangepwd = '新密码不一致，请再次输入新密码';
                               
                            }else{
                              UserFactory.changePwd(passwordold,passwordnew1)
                              .catch(function(err){
                                     console.log(err.data);
                                       if (err.data.errorType==='oldpwd') {
                                        $scope.showErrMsgChangepwd= true;
                                        $scope.errorMessageChangepwd='原密码不正确，请重新输入';
                                     }else if (err.data.errorType==='server'){
                                     $scope.showErrMsgChangepwd= true;
                                     $scope.errorMessageChangepwd='服务器出现错误，请稍后再试';
                                     }
                              }).then(function(response){
                                 $scope.showErrMsgChangepwd= false;
                                 $scope.pswsaved=true;
                                $scope.passwordold='';
                               $scope.passwordnew1='';
                               $scope.passwordnew2='';
                              });
                            }
                    };
}])
;