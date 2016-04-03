var mongoose = require('mongoose');

module.exports = function(wagner) {
  mongoose.connect('mongodb://localhost/test');

  var Category =
    mongoose.model('Category', require('./category'), 'categories');
 var Product =
    mongoose.model('Product', require('./product'), 'products');
  var Order =
    mongoose.model('Order', require('./order'), 'orders');

  var Unsubmittedorder =
    mongoose.model('Unsubmittedorder', require('./unsubmittedorder'), 'unsubmittedorders');
      
  var User =
    mongoose.model('User', require('./user'), 'users');
    
  wagner.factory('Category', function() {
    return Category;
  });
    wagner.factory('Product', function() {
    return Product;
  });
    wagner.factory('User', function() {
    return User;
  });
    wagner.factory('Order', function() {
    return Order;
  });
    wagner.factory('Unsubmittedorder', function() {
    return Unsubmittedorder;
  });
  var models = {
    Category: Category,
    Product: Product,
    User: User,
    Order:Order,
    Unsubmittedorder:Unsubmittedorder
  };
  return models;
};
