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
      { _id: '牛肉', parent: '肉类' },
      { _id: '鸡鸭类', parent: '肉类' },
      { _id: '鸡爪',parent: '鸡鸭类'  },
      { _id: '鱼肉',parent: '肉类'  }
    ];

var products = [{
    _id:1,
   name: '东鸠桃烤杏仁焦糖粟米条',
   price: 20,
    smallpic:'http://localhost:3000/img/东鸠桃烤杏仁焦糖粟米条.jpg',
   category: { _id: '牛肉', ancestors: ['牛肉', '肉类']  
}
 },{
    _id:2,
   name: '奶油夏威夷果零食进口坚果',
   price: 30,
   smallpic:'http://localhost:3000/img/奶油夏威夷果零食进口坚果.jpg',
   category: { _id: '牛肉', ancestors: ['牛肉', '肉类']  
}
 },
 {
    _id:3,
   name: '小饼松永黄油味小米脆饼干',
   price: 10,
   smallpic:'http://localhost:3000/img/小饼松永黄油味小米脆饼干.jpg',
   category: { _id: '鸡鸭类', ancestors: ['鸡鸭类', '肉类']  
}
 },
 {
    _id:4,
   name: '斯提拉米苏蛋糕',
   price: 15,
    smallpic:'http://localhost:3000/img/斯提拉米苏蛋糕.jpg',
   category: { _id: '鱼肉', ancestors: ['鱼肉', '肉类']  
}
 },{
    _id:5,
   name: '森永巧克力粒子曲奇饼干',
   price: 20,
    smallpic:'http://localhost:3000/img/森永巧克力粒子曲奇饼干.jpg',
   category: { _id: '牛肉', ancestors: ['牛肉', '肉类']  
}
 },{
    _id:6,
   name: '烘米苏奶酪咖啡巧克力',
   price: 20,
    smallpic:'http://localhost:3000/img/烘米苏奶酪咖啡巧克力.jpg',
   category: { _id: '牛肉', ancestors: ['牛肉', '肉类']  
}
 },{
    _id:7,
   name: '烤制浓厚巧克力',
   price: 20,
    smallpic:'http://localhost:3000/img/烤制浓厚巧克力.jpg',
   category: { _id: '牛肉', ancestors: ['牛肉', '肉类']  
}
 },
 {
    _id:8,
   name: '麦提莎脆心朱古力',
   price: 20,
    smallpic:'http://localhost:3000/img/麦提莎脆心朱古力.jpg',
   category: { _id: '牛肉', ancestors: ['牛肉', '肉类']  
}
 },
 {
    _id:9,
   name: 'COLLON迁利抹茶忌廉蛋卷',
   price: 20,
    smallpic:'http://localhost:3000/img/COLLON迁利抹茶忌廉蛋卷.jpg',
   category: { _id: '牛肉', ancestors: ['牛肉', '肉类']  
}
 },
 {
    _id:10,
   name: 'malteserl麦提莎脆心朱古力',
   price: 20,
    smallpic:'http://localhost:3000/img/malteserl麦提莎脆心朱古力.jpg',
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
