  angular.module('myApp')
  .service('OrderDetailFactory',['$http','baseURL',
        function($http,baseURL){
              var errMessage;
              this.getbyid = function (id,callback) {
                
                $http.get(baseURL+"order/id/"+id).then(
                         function(response){
                           //get the product 
                           callback(null,response.data.order);
                         },
                         function(response){
                   errMessage= "Error: " + response.status + " " +response.statusText;
                             callback(errMessage,null);
                         }
                );
      
          };
      }]);
