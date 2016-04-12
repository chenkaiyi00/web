    angular.module('myApp')
      .service('UserFactory',['$http','baseURL','localStorageService','$window',
        function($http,baseURL,localStorageService,$window){
                var self = this;
                this.user = {};
                /*variables for user not log in*/
                this.cart=[];
                this.address=[];
                this.upateCartAfterCheckoutLocal = 
                                function(){
                                     console.log(self.cart);
                          
                         for (var i = 0; i < self.cart.length; i++) {
                          if(self.cart[i].check){
                                 self.cart.splice(i--,1);
                          }
                         }
                          localStorageService.set('cart',self.cart);
                        };
                this.loggedIn = function(){
                        return !self.isEmpty(self.user);
                };
                this.isEmpty = function (obj) {
                  for (var i in obj) if (obj.hasOwnProperty(i)) return false;
                            return true;
                    };

                this.saveToken = function (token){
                 localStorageService.set("token",token);
                };
                this.clearToken = function (){
                 localStorageService.remove("token");
                };
  
                // init cart when first load page
                this.initCart = function(){
                        var c = localStorageService.get("cart");
                       if (c===null) {
                         //not data in browser,init as an empty array
                           self.cart=[];
                      }else{
                        angular.copy(c,self.cart);
                     //console.log(self.cart);
                   }
                };
              this.init = function(){
                console.log('sssssssssss');
               var token = localStorageService.get('token');
                return  $http.post(baseURL+'user/validate/token',
                      {token:token}).then(
                      function(response){

                     angular.copy(response.data.user, self.user);
                     angular.copy(response.data.user.data.cart, self.cart);

                     return self.user;
                     });
                 };

                this.register = function(phonenum,password){
                  console.log(phonenum);
                   console.log(password);
                   return $http.post(baseURL+'user/register',
                      {phone:phonenum,password:password}).then(
                      function(response){
                     //store token locally
                    self.saveToken(response.data.token);
                    angular.copy(response.data.user, self.user);
                    return self.user;
                     });
                };  
                this.login = function(phonenum,password){
                   return $http.post(baseURL+'user/login',
                      {phone:phonenum,password:password}).then(
                      function(response){
                    //set user
                    angular.copy(response.data.user, self.user);
                    self.saveToken(response.data.token);
                    return self.user;
                     });
                };   
                this.changePwd = function(oldpassword,password){
                    return $http.post(baseURL+'user/changepwd',
                      {password:password,token:localStorageService.get("token")}).then(
                      function(response){
                    return response;
                     });
                };
                this.validatePwd = function(oldpassword){
                    return $http.post(baseURL+'user/validatepwd',
                      {oldpassword:oldpassword,token:localStorageService.get("token")}).then(
                      function(response){
                    return response;
                     });
                };
                this.logout = function(){
                   angular.copy({}, self.user);
                   self.clearToken();
                   self.initCart();
                };

                this.getUser = function(){
                     return      self.user;
                };
                this.setUser = function(user){
                          angular.copy(user, self.user);
                };
                this.getCart = function(){
                     return      self.cart;
                };
                this.setCart = function(cart){
                         angular.copy(cart, self.cart);
                };

               //this function get called when a product added to cart
               // in product detail page and listpage,
               this.addItem = function (product,quantity) {
               
                   var inCart = self.getItemById(product._id);
                    if (typeof inCart === 'object'){
                //Update quantity of an item if it's already in the cart
                          inCart.quantity += quantity;
                       } else {

                          self.cart.push({product:product,quantity:quantity,
                            check:true});
                      }
                  self.$save();
              };
                //save user's cart
              this.$save = function () {

                  if (self.isEmpty(self.user)) { // save locally
                    localStorageService.set("cart", self.cart);
                    
                  }else{ //save to database
                    var url = baseURL+'user/cart/update';
                    var token = localStorageService.get("token");
                    return $http.post(url,{token:token,cart:self.cart}).then(
                      function(response){
                    // console.log(response.data);
                    //update user 
                     console.log('save cart to Db successfully');
                     console.log(response.data.user);
                     },function(response){
                              // faile to save ,error, dosomething
                     });
                }          
              };
             this.getItemById = function (itemId) {
                var items = self.getCart();
                var build = false;

                angular.forEach(items, function (item) {
                if  (parseInt(item.product._id) === itemId) {
                    build = item;
                }
             });
               return build;
              };


          

            this.removeItem = function (index) {
            var item = self.getCart().splice(index, 1);
           };

          this.removeItemById = function (id) {
            var item;
            var cart = self.getCart();
            angular.forEach(cart, function (item, index) {
                if(item.product._id === id) {
                   cart.splice(index, 1);
                }
            });                             
           };

          this.emptyCart = function () {
            self.cart = [];
        };

          this.isEmptyCart = function () {
            
            return (self.cart.length > 0 ? false : true);
            
        };
        // this funtion get call after user login
        this.combineCart = function(onlinecart){

         //console.log( localStorageService.get("cart"));

           if (  !localStorageService.get("cart")) { 
            // no local cart
             self.setCart(onlinecart);
              return;
           }
           else if (localStorageService.get("cart").length===0) {
              // if local cart is empty
               self.setCart(onlinecart);
             }else{
             self.setCart(localStorageService.get("cart").concat(onlinecart));
            for(var i=0; i<self.cart.length; ++i) {
                   for(var j=i+1; j<self.cart.length; ++j) {
                      if(self.cart[i].product._id === 
                        self.cart[j].product._id ){
                        self.cart[i].quantity+=self.cart[j].quantity;
                        self.cart.splice(j--, 1);
                      }      
                   }
                }
                self.$save();
           }

        };
        //this function get called when quantity change in cart page
        this.setQuantity = function(quantity, relative,index){ 
            var quantityInt = parseInt(quantity);

            if (quantityInt % 1 === 0){
                if (relative === true){
                    self.cart[index].quantity  += quantityInt;
                } else {
                    self.cart[index].quantity = quantityInt;
                }
                if (self.cart[index].quantity < 1) self.cart[index].quantity = 1;

            } else {
                self.cart[index].quantity;
              
            }
         };

         // get called when adding a new address to server( loggedin)
         this.saveAddressDb = function(address){
                          self.address.push(address);
         };

      }]);