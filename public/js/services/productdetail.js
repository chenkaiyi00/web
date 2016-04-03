  angular.module('myApp')
  .service('ProductDetailFactory',['$http','baseURL',
        function($http,baseURL){
              var errMessage;
              this.getbyid = function (id,callback) {
                
                $http.get(baseURL+"product/id/"+id).then(
                         function(response){
                           //get the product 
                           callback(null,response.data.product);
                         },
                         function(response){
                   errMessage= "Error: " + response.status + " " +response.statusText;
                             callback(errMessage,null);
                         }
                );
      
          };
      }]);
