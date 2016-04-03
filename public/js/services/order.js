  
    var moment = require('moment');

    angular.module('myApp')

    .service('OrderFactory',['UserFactory','$http','baseURL',
      'localStorageService','$location',
        function(UserFactory,$http,baseURL,localStorageService,$location){
                 var self=this;
          
                  self.total=UserFactory.getSubTotal();
                  //make an unsubmitted order
                  this.startOrder = function(){
                    var date = moment().toObject();
                    var id = date.years+''+(parseInt(date.months)+1)+
                              date.date+date.hours+
                                date.minutes+ date.seconds
                                +UserFactory.user.profile.phone;
               
                    var  unSubmittedOrder ={date:date,id:id,
                                           list:self.products};

                    return $http.post(baseURL+'user/makeunsuborder',
                      {unSubmittedOrder:unSubmittedOrder,
                        token:localStorageService.get("token")})
                    .then(
                      function(response){
                    //返回id
                    return response.data;
                     });                        
                 };
                  this.setTotoal = function (num){
                              self.total=num;
                              console.log(self.total);
                  };
                this.saveAddress = function(address,newadd){

                        id=$location.search().id;
                      if (newadd) {
                        //save new add to cloud in Userfac.addAdd(),
                        //and save add to this unsuborder.add
                    return $http.post(baseURL+'user/upaddordernuser',
                      {address:address,id:id,token:localStorageService.get("token")})
                       .then(
                      function(response){
                          return response.data;
                     });
                       }else{
                        //save add to this unsuborder.add
                  return $http.post(baseURL+'user/upaddorder',
                      {address:address,id:id,token:localStorageService.get("token")})
                       .then(
                      function(response){
                          return response.data;
                     });
                       }
                     
                  };
                  this.saveProducts = function(){
                      self.products=UserFactory.getCart();
                  }
                  this.getOrder = function(){
                            return self;
                  };

                  this.getTotal = function(){
                     return self.total;
                  };
                  this.makeOrder = function(unsuborder){
                        console.log(unsuborder);
                   
                    return $http.post(baseURL+'user/makeorder',
                      {unsuborder:unsuborder,token:localStorageService.get("token")})
                    .then(
                      function(response){
                    // go to order page
                    UserFactory.setUser(response.data.user);
                    return response.data.user;
                     });
                  };

      }]);