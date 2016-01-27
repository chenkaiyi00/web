angular.module('myApp')
  		.service('CarouselFactory',function(){
var carousels = [
		{ 
			image:'images/4.jpg',
            alt:"carousel1",
            active:true
				},
		{
			image:'images/3.jpg',
			alt:"carousel2",
			active:false
				},
		{
			image:'images/2.jpg',
			alt:"carousel3",
			active:false
				},
		{
			image:'images/1.jpg',
			alt:"carousel4",
			active:false
		      }];

		      this.getCarousels = function() {
		      	return carousels;
		      };
		      
  		})
  		.service('PopularFactory',function(){
      var popularProducts = [
		{ 
			image:'images/s1.jpg',
			name:'BOLE ZHUANGYUAN 南红心火龙果',
			price:125,
			price_sale:66,
			onsale:false
				},
		{
			image:'images/s2.jpg',
			name:'霸王蟹 皇帝蟹大螃蟹',
			price:221,
			price_sale:30.5,
			onsale:false
				},
		{
			image:'images/s3.jpg',
			name:'President无盐黄油',
			price:110,
			price_sale:45.0,
			onsale:false
				},
		{
			image:'images/s4.jpg',
			name:'鲜之优果 墨西哥牛油果',
			price:110,
			price_sale:45,
			onsale:false
		      }];
		      this.getPopulars = function () {
		      	return popularProducts;
		      }
  		});