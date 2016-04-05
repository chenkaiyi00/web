  angular.module('myApp')
       .service('PopularFactory',['$http','baseURL','SharedDataFactory',
        function($http,baseURL,SharedDataFactory){
          
           self = this;
          // get propular product from server


          this.getPopulars = function (callback) {

           $http.get(baseURL+"product/").then(
            function(response){
            self.populars = response.data.products;

          //response.data.products is an array, whenever load successed
           callback(null);
          },
        function(response){
          errMessage= "Error: " + response.status + " " +response.statusText;
             callback(errMessage);
             }    
          );
          };

      }]);