 
  angular.module('myApp')
      .service('SharedDataFactory',function(){
        var provinceList = require('../provinceList.js');
         var loadedProducts = null;
         this.getProducts = function () {
            return loadedProducts;
          };
          this.getProvinceList = function () {
            return provinceList;
          };
          this.setProducts = function ( products) {

            if (loadedProducts===null) {
       
              loadedProducts = products;
            }
          };
      });