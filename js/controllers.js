angular.module('myApp')
.controller('NavController', ['$scope',function($scope) {
    
    $scope.tap=0;
    $scope.select=function (setTab) {
      $scope.tap=setTab;
      $scope.showoverlay(setTab);
      $scope.visibility(setTab);
    };
         $scope.deselect=function (num) {
        $scope.tap=0;
       $scope.unvisibility(num);
    };
      $scope.isSelected=function (num) { 
      
      return ($scope.tap===num);
    }; 

      $scope.showoverlay=function(index){
      if(index<=3&&index>=1){
            $("#overlay"+index).css("display", "block");     
          }
      };
        $scope.unshowoverlay=function(index){
      if(index<=3&&index>=1){
            $("#overlay"+index).css("display", "none");     
          }
      };
          $scope.unvisibility=function(index){
      if(index<=3&&index>=1){
            $("#overlay"+index).css("visibility", "hidden");     
          }
      };
           $scope.visibility=function(index){
      if(index<=3&&index>=1){
            $("#overlay"+index).css("visibility", "visible");     
          }
      };
}])
.controller('CarouselController', ['$scope','CarouselFactory',
                                function($scope,CarouselFactory){
  $scope.carousels=CarouselFactory.getCarousels();
     
}])
.controller('PopularController', ['$scope','PopularFactory',
                                function($scope,PopularFactory){
  $scope.populars = PopularFactory.getPopulars();
  $scope.number=[1,2,3];
}])
.controller('RecController', ['$scope','RecommendFactory',
                                function($scope,RecommendFactory){
  $scope.recProducts = RecommendFactory.getRecs();
  $scope.number=[1,2,3];
}]);