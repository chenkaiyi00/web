angular.module('myApp').
controller('CommentController', ['$scope','baseURL','commentFilter',
 function($scope,baseURL,commentFilter){
                    
                    $scope.comments=[];
                    $scope.atcomment=1;
                    $scope.chooseCom = function(index){
                        $scope.atcomment=index;
                        if (index==1) {
                           $scope.comments=commentFilter($scope.comments,'all');
                        }else if(index==2){
                           $scope.comments=commentFilter($scope.comments,'high');
                        }else if(index==3){
                           $scope.comments=commentFilter($scope.comments,'medium');
                        }else{
                           $scope.comments=commentFilter($scope.comments,'low');
                        }
                    };
                    $scope.isAtCom = function(index){
                        return $scope.atcomment==index;
                    };

                    //need to do angular filter

}]);