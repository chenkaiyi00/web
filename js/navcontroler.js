app.controller('navCtrl', function($scope) {
    
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
});