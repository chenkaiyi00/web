angular.module('myApp')
.controller('OrderController', ['$scope','UserFactory','SharedDataFactory',
  'OrderFactory','baseURL','$window','$location',
      function($scope,UserFactory,SharedDataFactory,OrderFactory,baseURL,
        $window,$location){
        
         
             $scope.unsuborder;
            function getTotal(){
               var list = $scope.unsuborder.list;
               var temp = 0;
               for (var i = 0; i < list.length; i++) {
                 temp+=list[i].product.price*list[i].quantity;
               };
               return temp;
        };
                /*************************************************
                       init part
                 ************************************************/
 
 
        //get watch on user and cart 
        $scope.$on('UserController:getUserConfigSuccess', function() {
        // calculation based on service value
           $scope.cart = UserFactory.getCart();
           $scope.user = UserFactory.getUser();
           console.log( $scope.cart);
           $scope.$watch(function(){return UserFactory.getUser();},
                      function(newValue,oldValue){
                               if (newValue!==oldValue) {
                               // console.log(newValue);
                               $scope.user = newValue;
                               }
                      });
           $scope.noAdd=false;
           $scope.userAddresses =  $scope.user.profile.addresses;
             if (   $scope.userAddresses.length==0) {
                       $scope.noAdd=true;                 
             }
           
                       //get Unsuborder via ID after user loaded
          OrderFactory.getUnsuborder($location.search().id)
                           .then(function(data){
            
              $scope.unsuborder = data.unsuborder;
             console.log(  'get unsuborder succussfully ' +$scope.unsuborder);
              console.log( $scope.unsuborder);
              $scope.total =  getTotal();
              if (  !$scope.noAdd) {
                  if (!$scope.unsuborder.address) {
                     $scope.unsuborder.address=  $scope.userAddresses[0];
                   }
              }
           })
            .catch(function(err){
               console.log(err);
           });
     
          });
               //when not loggin 
        $scope.$on('UserController:getUserConfigFail', function() {
        // calculation based on service value
           $scope.cart = UserFactory.getCart();
           $scope.user = UserFactory.getUser();
          console.log($scope.cart)  ;
         console.log('fkhgkjdfhgdfkj');
            //get UnsuborderNotlogin via ID after user loaded
        OrderFactory.getUnsuborderNotlogin($location.search().id)
           .catch(function(err){
                $window.location.href=baseURL;      

          })
           .then(function(data){
             $scope.noAdd=false;
              $scope.unsuborder = data.unsuborder;
              console.log( $scope.unsuborder);
              $scope.total =  getTotal();
           });

          });
       /*************************************************
                      end init part
       ************************************************/


           $scope.provincelist = SharedDataFactory.getProvinceList();
           $scope.address={
            selectedProvice:null,
            selectedCity:null,
            selectedArea:null,
            recipient:null,
            address:null,
            phone:null
           };
       



                /*************************************************
                        unlog part
                 ************************************************/
         // used when no login order is made and save address
         $scope.saveOrderInfo  = function(){
               //validate all info first
               if (!$scope.address.recipient) {
                  // recipient is empty 
                  $('#yhd_alert_contenttext').text('请填写收货人姓名');
                  $('#yhd_alert_tip').show();
                  return;
               }
               if (!$scope.address.address) {
                      // if address i empty
                  $('#yhd_alert_contenttext').text('请填写详细收货地址');
                  $('#yhd_alert_tip').show();
                     return;
               }
                if (!$scope.address.phone) {
                      // if address i empty
                  $('#yhd_alert_contenttext').text('请输入手机号');
                  $('#yhd_alert_tip').show();
                     return;
               }
               if (!$scope.address.selectedProvice) {
                  $('#yhd_alert_contenttext').text('请选择省份');
                  $('#yhd_alert_tip').show();
                     return;
               }
               if (!$scope.address.selectedCity) {
                  $('#yhd_alert_contenttext').text('请选择城市');
                  $('#yhd_alert_tip').show();
                     return;
               }
                if (!$scope.address.selectedArea) {
                  $('#yhd_alert_contenttext').text('请选择区/县');
                  $('#yhd_alert_tip').show();
                     return;
               }
                 $scope.address.selectedProvice
                   =$scope.address.selectedProvice.name;
                  $scope.address.selectedCity
                   =$scope.address.selectedCity.name;
             
             OrderFactory.updateUnsubAddNolog($scope.address)
                   .catch(function(err){
                    // do something      
                        console.log(err);
                      })
                  .then(function(data) {
               
                  
                   $scope.unsuborder=data.unsuborder;
              
                        UserFactory.$save();
                // go to confirmOrder.html with unsuborder Id
               $window.location.href=baseURL+'confirmOrder.html?id='
                                  +    $scope.unsuborder._id;                         
                    });

         };
            

 
         // submit unsuborder final step
          $scope.makeOrderUnlogin = function(){
           
                OrderFactory.makeOrderUnlogin($scope.unsuborder)
                 .catch(function(err){
            
                 }).then(function(data){
                    // go to order finish.html
                  // update cart locally
                  //1. deleted checked items
                  //2. save cart locally
        
                  
                  UserFactory.upateCartAfterCheckoutLocal();
                    $window.location.href=baseURL+'orderFinish.html?id='
                               +    data.order._id;  
                 });
              
       };

                /*************************************************
                       end unlog part
                 ************************************************/

                  $scope.closeTip = function(){
                     $('#yhd_alert_tip').hide();
                 };
              
              /*************************************************
                       log part
                ************************************************/

              $scope.editAdd = function(){
                        if (!UserFactory.loggedIn()) {
                          return;
                        }else{
                  $window.location.href=baseURL+'chooseaddress.html?id='
                                            +    $scope.unsuborder._id;       
                        }
              };

                  $scope.makeOrderlogin = function(){
                 
                    OrderFactory.makeOrder($scope.unsuborder) 
                    .catch(function(err){
            
                 }).then(function(order){
                    // go to order finish.html
                  // update cart in DB
                  //1. deleted checked items
                  //2. save cart in DB 
                  // all finished in server


                  $window.location.href=baseURL+'orderFinish.html?id='
                               +    order._id;  
                 });
};

             $scope.makeOrder = function(){
                    if (!UserFactory.loggedIn()) {
                          $scope.makeOrderUnlogin();
                        }else{
                       
                        $scope.makeOrderlogin();
                        }

         };
   


        $scope.getTotal = function(){
                     return OrderFactory.getTotal();
           };
 
       
}]);