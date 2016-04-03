  angular.module('myApp')
       .service('PopularFactory',['$http','baseURL','SharedDataFactory',
        function($http,baseURL,SharedDataFactory){
        
          // get propular product from server
          var populars;
          var errMessage;
          var success;

          this.getPopulars = function (callback) {

           $http.get(baseURL+"product/").then(
            function(response){
            populars = response.data.products;
            success = true;

          //response.data.products is an array, whenever load successed, store in 
          // local service
           SharedDataFactory.setProducts(response.data.products);
           callback(null);
          },
        function(response){
          errMessage= "Error: " + response.status + " " +response.statusText;
          success= false;
             callback(errMessage);
             }    
          );
          };

            this.ifSuccess = function () {
                        return success;
       };
               this.getErrMessage = function(){
                return errMessage;
               }

      }]);