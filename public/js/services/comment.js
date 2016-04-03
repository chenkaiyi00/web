  angular.module('myApp').
      service('CommentFactory',['$http','baseURL','localStorageService',
        function($http,baseURL,localStorageService){
            this.create = function(productId,comment){
              var token = localStorageService.get("token");
              return $http.post(baseURL+'product/comment/'+productId,
                      {token:token,comment:comment}).then(
                      function(response){

                    return response.data;
                     });
            };
            this.modify = function(){
              
            };
      }]);