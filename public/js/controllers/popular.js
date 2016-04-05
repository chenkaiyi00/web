angular.module('myApp').
controller('PopularController', ['$scope','PopularFactory','SharedDataFactory','UserFactory',
                                function($scope,PopularFactory,SharedDataFactory,UserFactory){
     $scope.message = 'Loading ...';
     $scope.show =false;
     $scope.populars=[];
     $scope.$watch(function(){
      return PopularFactory.populars;
             },
             function(newValue,oldValue){
                if (newValue!==oldValue) {
                 $scope.populars = newValue;
                        }
        });
    $scope.shutPop  = function(){
        $scope.show =false;
    };
     $scope.addItem = function(product){
         UserFactory.addItem(product,1);
          $scope.show=true; 
     };

    PopularFactory.getPopulars( function(err){
        if (err) {  // fail load data
       $scope.message = err;
        }
     $scope.populars = PopularFactory.populars;
      });

}]);