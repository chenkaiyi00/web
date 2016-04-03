angular.module('myApp')

.controller('CarouselController', ['$scope','CarouselFactory','$state',
             function($scope,CarouselFactory,$state){

}])
.controller('PopularController', ['$scope','PopularFactory','SharedDataFactory','UserFactory',
                                function($scope,PopularFactory,SharedDataFactory,UserFactory){
     $scope.message = 'Loading ...';
     $scope.show =false;
     $scope.addItem = function(product){
            UserFactory.addItem(product,1);
            $('.toastSuc').text('成功保存到购物车').fadeIn(400).delay(2000).fadeOut(400); 
     };
    PopularFactory.getPopulars( function(err){
        if (err) {  // fail load data
       $scope.message = err;
        }
     $scope.populars = SharedDataFactory.getProducts();
      });

  
}])

.controller('ProductDetailController', ['$scope','ProductDetailFactory','$stateParams',
  'UserFactory',
   function($scope,ProductDetailFactory,$stateParams,UserFactory){
                   
                                      // init the product
                   ProductDetailFactory.getbyid(parseInt($stateParams.id,10),
                         function(err,product){
                               if (err) { 
                               //err is a error String, do something with it 

                             }  
                             //get product, set to scope,
                             $scope.inCart = false;
                             $scope.product = product;
                     });
                     $scope.quantity=1;
                     $scope.imgsrc="img/detailbig1.jpg";
                     $scope.changepic = function(src){
                        $scope.imgsrc=src;
                        };
                     $scope.addToCart = function(product,quantity){
                        UserFactory.addItem(product,quantity);
                        $scope.inCart = true;
                         $('.toastSuc').text('成功保存到购物车').fadeIn(400).delay(2000).fadeOut(400); 
            }; 

}])
.controller('UserController', ['$scope','SharedDataFactory','UserFactory','localStorageService',
  '$state',  function($scope,SharedDataFactory,UserFactory,localStorageService,$state){
                    $scope.user = UserFactory.user;
                    $scope.errorMessage = "Email 或者密码错误";
                    $scope.showErrMessage = false;
                    $scope.cart = UserFactory.getCart();
                      $scope.isEmptyCart = function () {
                     return UserFactory.isEmptyCart();
                      };
                      $scope.isloggedin = function(){
                           return UserFactory.loggedIn();
                      };
                  $scope.gotoRegister = function(){
                          $('#login-modal').modal('hide');
                          $('body').removeClass('modal-open');
                          $('.modal-backdrop').remove();
                          $state.go('app.register');
                  };
                    $scope.register = function (username,password){
                        UserFactory.register(username,password)
                        .catch(function(err){
                           console.log(err);
                          })
                       .then(function(user) {
                          $state.go('app.myorders');
                          // go to userprofile page.       
                      });
                  };
                  $scope.login = function (username,password){
                      UserFactory.login(username,password)
                        .catch(function(err){
                    // do something      
                         if (err.status==401) {
                           $state.go('app.login');
                             console.log(err);
                               if (err.data.err=="User Not found."
                                ||err.data.err=="Invalid Password") {
                                  $scope.showErrMessage=true;
                              }
                          }
                      })
                    .then(function(user) {
                       if(user){ 
                          $('#login-modal').modal('hide');
                          $('body').removeClass('modal-open');
                          $('.modal-backdrop').remove();
                           $state.go('app.myorders');
                           //console.log(user.data.cart);
                        }
                    });
                 };

                 $scope.logout = function(){
                     UserFactory.logout();
                       $state.go('app');
                 };

}])
.controller('CartController', ['$scope','UserFactory','localStorageService',
             function($scope,UserFactory,localStorageService){
           $scope.cart = UserFactory.getCart();
           $scope.getQuantity = function(index){
                      return cart[index].quantity;
           };
            $scope.setQuantity = function(quantity, relative,index){
                     UserFactory.setQuantity(quantity, relative,index);
           };
             $scope.getTotal = function(){
                     return UserFactory.getSubTotal();
           };
            $scope.removeItemById = function(id){
                    UserFactory.removeItemById(id);
           };
             $scope.saveCart = function(){
                    UserFactory.$save();
                    $('.toastSuc').text('成功保存到购物车').fadeIn(400).delay(2000).fadeOut(400); 
           };
              $scope.isEmpty = function(){
                    return UserFactory.isEmptyCart();
           };

}])
.controller('OrderController', ['$scope','UserFactory','SharedDataFactory',
            function($scope,UserFactory,SharedDataFactory){
           $scope.cart = UserFactory.getCart();
           $scope.loggedin = UserFactory.loggedIn();
           $scope.provincelist = SharedDataFactory.getProvinceList();
           $scope.selectedProvice;
           $scope.selectedCity;
           $scope.selectedArea;
           $scope.recipient;
           $scope.address;
           $scope.phone;
           $scope.radioValue;
           $scope.editMode = function(){
                     return $scope.radioValue==="newAdd";
           };
           $scope.saveAddress = UserFactory.saveAddress({province:$scope.selectedProvice,
            city:$scope.selectedCity,area:$scope.selectedArea,
            recipient:$scope.recipient,street: $scope.address,
            phone: $scope.phone});
}])
.controller('CommentController', ['$scope','UserFactory','CommentFactory',
            function($scope,UserFactory,CommentFactory){
               $scope.commentcontent;
               $scope.create = function(){
                      CommentFactory.create(productId,comment)
                      .catch(function(err){
                           // err do something   
                      })
                      .then(function(data){

                      });
               };
}])

;