  angular.module('myApp')
     .controller('ProductDetailController', ['$scope','ProductDetailFactory'
      ,'UserFactory','$location',
         function($scope,ProductDetailFactory,UserFactory,
          $location){
                  $scope.user = UserFactory.getUser();
                                      // init the product
                  $scope.cart = UserFactory.getCart();  
                   ProductDetailFactory.getbyid(parseInt($location.search().p,10),
                         function(err,product){
                               if (err) { 
                               //err is a error String, do something with it 

                             }  
                             //get product, set to scope,
                             $scope.inCart = false;
                             $scope.product = product;
		             $scope.sliderimgs = $scope.product.sliderpictures;                             $scope.comments = $scope.product.comments;
                             $scope.isCollected =false;
                             $scope.tabAt = 1;
                     });
                    $scope.value = {
                             quantity:1
                     };
                     $scope.addQ = function(){
                       $scope.value.quantity++;
                     };
                     $scope.minusQ = function(){
                       if ( $scope.value.quantity===1) {
                        return;
                       }
                       $scope.value.quantity--;
                     };
                     $scope.isAt = function(index){
                          return $scope.tabAt===index;
                     };
                     $scope.chooseTab = function(index){
                            $scope.tabAt = index;
                     };

                     $scope.showMenu = false;
                     $scope.showMenuFunc = function(){
                      if (  $scope.showMenu) {
                         $scope.showMenu = false;
                       }else{
                         $scope.showMenu = true;
                       }
                     };
                     $scope.addToCart = function(quantity){
                        UserFactory.addItem($scope.product,quantity);
                        $scope.inCart = true;
                      
                        $('#added').fadeIn(400).delay(1000).fadeOut(400); 
                     }; 

                     $scope.collect = function(){
                      if (!$scope.isCollected) {
                      $scope.isCollected = true;
                      $('#collect').text('收藏成功').fadeIn(400).delay(1000).fadeOut(400); 
                      // call user service func to save in db 
                      }else{
                      $scope.isCollected = false;
                      $('#collect').text('取消收藏成功').fadeIn(400).delay(1000).fadeOut(400); 
                      // call user service func to save in db 
                      }                 
                     };     
              

}]);

