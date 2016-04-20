  angular.module('myApp')
     .controller('ProductDetailController', ['$scope','ProductDetailFactory'
      ,'UserFactory','$location','$window',
         function($scope,ProductDetailFactory,UserFactory,
          $location,$window){
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
		                         $scope.sliderimgs = [];
                             product.sliderpictures.forEach(function(src){
                              $scope.sliderimgs.push({src:src,alt:product.name});
                             });                             
                             $scope.comments = $scope.product.comments;
                             $scope.isCollected =false;
                             $scope.tabAt = 1;
                             $scope.flavorAt=0;
                             $scope.sizeAt=0;
                             $scope.chosen=false;
                     });
                    $scope.value = {
                             quantity:1
                     };
                     $scope.chinese =['壹','贰','叁','肆','伍'];

                      $scope.setPromoteView = function(){
                        if ($scope.showpromote) {
                            $scope.showpromote=false
                        }else{
                          $scope.showpromote = true;
                        }
                      };

                      $scope.setSelectorMode = function(){
                          $scope.selectorMode = true;
                      };
                      $scope.inSelector = function(){
                         return $scope.selectorMode;
                      };
                      $scope.closeSelector = function(){
                         $scope.selectorMode = false;
                      };

                      $scope.setflavor = function(index){
                       $scope.product.selectedflavor=$scope.product.flavoroptions[index];
                        
                        $scope.flavorAt=index;
                        $scope.chosen=true;

                        if ($scope.product.priceoptions.length==0) {

                            $scope.product.price =$scope.product.priceoptions[index];

                        }
                     };
                      $scope.setsize = function(index){
                       $scope.product.selectedsize=$scope.product.sizeoptions[index];
                       $scope.sizeAt =index;
                       $scope.chosen=true;
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
                     $scope.gotoCart = function(){
                        if (!($scope.chosen)) {
                          $scope.setSelectorMode();
                        }else{
                            $window.location.href='http://xx-jia.com/cart.html'
                        }
                     };
                     $scope.addToCart = function(quantity){
                      if (!($scope.chosen)) {
                          $scope.setSelectorMode();
                        }else{
                        UserFactory.addItem($scope.product,quantity);
                        $scope.inCart = true;
                      
                        $('#added').fadeIn(400).delay(1000).fadeOut(400); 
                      }
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

