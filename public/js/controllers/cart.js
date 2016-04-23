angular.module('myApp')
 .controller('CartController', ['$scope','UserFactory','OrderFactory',
 '$window','baseURL','$http',function($scope,UserFactory,OrderFactory,
  $window,baseURL,$http){
            


                   //get watch on user and cart 
        $scope.$on('UserController:getUserConfigSuccess', function() {
        // calculation based on service value
           $scope.cart = UserFactory.getCart();
           $scope.user = UserFactory.getUser();
           console.log('success load cart');
          for (var i = 0; i <  $scope.cart.length; i++) {
                     $scope.cart[i].check=true;
                }
                 
        
           $scope.$watch(function(){return UserFactory.getCart();},
                      function(newValue,oldValue){
                               if (newValue!==oldValue) {
                               // console.log(newValue);
                              $scope.cart = newValue;
                               }

                      });
          });
        $scope.$on('UserController:getUserConfigFail', function(){
        // calculation based on service value
           $scope.cart = UserFactory.getCart();
                    for (var i = 0; i <  $scope.cart.length; i++) {
                     $scope.cart[i].check=true;
                }
                   console.log('not login, load cart successfully.');
             
           $scope.$watch(function(){return UserFactory.getCart();},
                      function(newValue,oldValue){
                               if (newValue!==oldValue) {
                               // console.log(newValue);
                              $scope.cart = newValue;
                               }

                      });
          });
       /*************************************************
                      end init part
       ************************************************/
            $scope.options = {
              values:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
            };
            $scope.showMenu = false;
            $scope.choosePro=false;
            $scope.shippingrate;
       
           $scope.setPromote = function(){
                         //add promoted product in a place and 
                          // if needed add to total amount
                          $scope.choosePro = true;
                      };
           $scope.cancelPro = function() {
                $scope.choosePro = false;
           };           
          $scope.numOfcheck  = function(){ 

              var count= 0;
               for (var i = 0; i <  $scope.cart.length; i++) {
                     if ($scope.cart[i].check) {
                       count++;
                     }
                }
                return count;
             };
            $scope.showMenuFunc = function(){
                      if (  $scope.showMenu) {
                         $scope.showMenu = false;
                       }else{
                         $scope.showMenu = true;
                       }
                };
           $scope.getQuantity = function(index){
                      return cart[index].quantity;
           };
            $scope.setQuantity = function(quantity, relative,index){
                     UserFactory.setQuantity(quantity, relative,index);
           };


          $scope.getShipping = function(){
              if ($scope.getTotal()>88||$scope.getTotal()==88) {

                 return 0;
              }else{
                return 15;
              }
          };
          $scope.getTotal = function(){

              var temp=0;
                for (var i = 0; i <  $scope.cart.length; i++) {
                      if ( $scope.cart[i].check) {
                                temp+=$scope.cart[i].product.price*
                                   $scope.cart[i].quantity;
                      }
                }
                if ( $scope.choosePro) {
                    temp+=8;
                }
                 temp=parseFloat(Math.round(temp * 10) / 10).toFixed(2)
                  return temp;
               };

            $scope.deleteId;
            $scope.removeItemById = function(id){
                   $('#yhd_alert_tip').show();
                    $scope.deleteId=id;
                  
           };
           $scope.close_alert_tip = function(){
                 $('#yhd_alert_tip').hide();
           };
           $scope.close_alert_tip_nopro = function(){
                $('#yhd_alert_tip_nopro').hide();
           };
           $scope.confirm_alert_tip = function(){
                  
                  UserFactory.removeItemById($scope.deleteId);
                    $('#yhd_alert_tip').hide();
                      // for test only
                      UserFactory.$save();
           };
             $scope.saveCart = function(){
                    UserFactory.$save();
           };
              $scope.isEmpty = function(){
                    return UserFactory.isEmptyCart();
           };

           $scope.gotoCheck1 = function(){
            // check if any product is choosen
               if ($scope.getTotal()===0) {
                   $('#yhd_alert_tip_nopro').show();
                   return;
               }
                  //add sales for each product in cart
                for (var i = 0; i < $scope.cart.length; i++){
                  $http.post(baseURL+'product/addsaleamount/'+$scope.cart[i].product._id,
                    {quantity:$scope.cart[i].quantity});
                  }
                 if (!UserFactory.loggedIn()){
               
                  OrderFactory.startOrder($scope.getShipping(),$scope.choosePro,
                    $scope.getTotal())
                    .catch(function(err){

                    }).then(function(data){
                        
                         $scope.saveCart();
                         
                  $window.location.href=baseURL+
                       'ordernotlogin.html?id='+data.unsuborderId;
                    });

                 }else{
                 OrderFactory.startOrder($scope.getShipping(),$scope.choosePro,
                  $scope.getTotal())
                   .then(function(data){
                    
                      $scope.saveCart();
                  $window.location.href=baseURL+
                          'confirmorder.html?id='+data.unsuborderId;
                    }).catch(function(err){
                       // if is validate err go to login page

                    });
                 }
           };

               $scope.gotoAccount = function(){
                   if (UserFactory.loggedIn()) {
                 
                 $window.location.href=baseURL+
                          'user.html';
                   }else{
                  $window.location.href=baseURL+
                                'login.html';
                   }

           };

}]);
