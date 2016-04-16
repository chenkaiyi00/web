// =======================
// get the packages we need ============
// =======================
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var wagner = require('wagner-core');
var routes = require('./routes/index');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var morgan = require('morgan');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var cors = require('cors');
// =======================
// configuration =========
// =======================
var app = express();
var models = require('./schemaAndModel/models')(wagner);
require('./config/passport')(models.User);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// use morgan to log requests to the console
app.use(morgan('dev'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// use body parser so we can get info from POST and/or URL parameters
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Initialise Passport before using the route middleware
app.use(passport.initialize());
// *************************************************************************
// routes                                                                  *
//                                                                         * 
// *************************************************************************

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/category',require('./routes/category')(wagner));
app.use('/product',require('./routes/product')(wagner));
app.use('/order',require('./routes/order')(wagner));
app.use('/user',require('./routes/users')(wagner));
app.use('/admin',require('./routes/users')(wagner));
///////////////////////////////////////////////////////
app.get('/setup',wagner.invoke(function(Product,Category,User,Order){
return  function(req, res) {

Category.remove({}, function(error){
  if (error) {
    console.log(error);
  }
Product.remove({},function(error){
  if (error) {
     console.log(error);
  }
User.remove({},function(error){
  if (error) {
      console.log(error);
  }
Order.remove({},function(error){
  if (error) {
      console.log(error);
  }
        var categories = [
      { _id: '肉类' },
      { _id: '牛肉', parent: '肉类' }
    ];

var products = [{
    _id:1,
   name: '乌冬面',
   price: 20,
    smallpic:'http://localhost:3000/img/东鸠桃烤杏仁焦糖粟米条.jpg',
    detailpictures:[
    'http://xx-jia.com/images/productimage/1/750/1.jpg',
    'http://xx-jia.com/images/productimage/1/750/2.jpg',
    'http://xx-jia.com/images/productimage/1/750/3.jpg',
    'http://xx-jia.com/images/productimage/1/750/4.jpg',
    'http://xx-jia.com/images/productimage/1/750/5.jpg',
    'http://xx-jia.com/images/productimage/1/750/6.jpg',
     'http://xx-jia.com/images/productimage/1/750/7.jpg'
    ],
     sliderpictures: [
       'http://xx-jia.com/images/productimage/1/640/1.jpg',
       'http://xx-jia.com/images/productimage/1/640/2.jpg',
       'http://xx-jia.com/images/productimage/1/640/3.jpg',
       'http://xx-jia.com/images/productimage/1/640/4.jpg'
     ],

    category: { _id: '牛肉', ancestors: ['牛肉', '肉类']  
}
 },{
    _id:2,
   name: '牛肉酱',
   price: 20,
    smallpic:'http://localhost:3000/img/东鸠桃烤杏仁焦糖粟米条.jpg',
    detailpictures:[
    'http://xx-jia.com/images/productimage/2/750/1.jpg',
    'http://xx-jia.com/images/productimage/2/750/2.jpg',
    'http://xx-jia.com/images/productimage/2/750/3.jpg',
    'http://xx-jia.com/images/productimage/2/750/4.jpg',
    'http://xx-jia.com/images/productimage/2/750/5.jpg',
    'http://xx-jia.com/images/productimage/2/750/6.jpg',
    'http://xx-jia.com/images/productimage/2/750/7.jpg'
    ],
     sliderpictures: [
       'http://xx-jia.com/images/productimage/2/640/1.jpg',
       'http://xx-jia.com/images/productimage/2/640/2.jpg',
       'http://xx-jia.com/images/productimage/2/640/3.jpg'
     ],

    category: { _id: '牛肉', ancestors: ['牛肉', '肉类']  
}
 },
{
    _id:3,
   name: '鱿鱼',
   price: 20,
    smallpic:'http://localhost:3000/img/东鸠桃烤杏仁焦糖粟米条.jpg',
    detailpictures:[
    'http://xx-jia.com/images/productimage/3/750/1.jpg',
    'http://xx-jia.com/images/productimage/3/750/2.jpg',
    'http://xx-jia.com/images/productimage/3/750/3.jpg',
    'http://xx-jia.com/images/productimage/3/750/4.jpg',
    'http://xx-jia.com/images/productimage/3/750/5.jpg',
    'http://xx-jia.com/images/productimage/3/750/6.jpg',
    'http://xx-jia.com/images/productimage/3/750/7.jpg'
    ],
     sliderpictures: [
       'http://xx-jia.com/images/productimage/1/640/1.jpg',
       'http://xx-jia.com/images/productimage/1/640/2.jpg',
       'http://xx-jia.com/images/productimage/1/640/3.jpg',
       'http://xx-jia.com/images/productimage/1/640/4.jpg'
     ],

    category: { _id: '牛肉', ancestors: ['牛肉', '肉类']  
}
 },
 {
    _id:4,
   name: '牛肉干',
   price: 20,
    smallpic:'http://localhost:3000/img/东鸠桃烤杏仁焦糖粟米条.jpg',
    detailpictures:[
    'http://xx-jia.com/images/productimage/3/750/1.jpg',
    'http://xx-jia.com/images/productimage/3/750/2.jpg',
    'http://xx-jia.com/images/productimage/3/750/3.jpg',
    'http://xx-jia.com/images/productimage/3/750/4.jpg',
    'http://xx-jia.com/images/productimage/3/750/5.jpg',
    'http://xx-jia.com/images/productimage/3/750/6.jpg',
    'http://xx-jia.com/images/productimage/3/750/7.jpg'
    ],
     sliderpictures: [
       'http://xx-jia.com/images/productimage/1/640/1.jpg',
       'http://xx-jia.com/images/productimage/1/640/2.jpg',
       'http://xx-jia.com/images/productimage/1/640/3.jpg',
       'http://xx-jia.com/images/productimage/1/640/4.jpg'
     ],

    category: { _id: '牛肉', ancestors: ['牛肉', '肉类']  
}
 }

 ];
Category.create(categories,function(err){
    if (err) {console.log(err);}
      Product.create(products,function(err){
  if (err) {console.log(err);}

    Product.find({},function(err,products){
       if (err) {console.log(err);}
      res.json({products:products,
                categories:categories}    
             );
console.log('end here');
       });
      });
});
});


      });
    });  
});

};
}));
 
//////////////////////////////////////////



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
