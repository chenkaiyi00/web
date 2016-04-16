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
       'http://xx-jia.com/images/productimage/1/640/4.jpg',
        'http://xx-jia.com/images/productimage/1/640/5.jpg',
       'http://xx-jia.com/images/productimage/1/640/6.jpg'
     ],

    category: { _id: '牛肉', ancestors: ['牛肉', '肉类']  
},
shortDes:'精选食材 工艺讲究  纯手工熬制 无防腐剂 无添加剂',
detailDes:['食品是在拍下24小时内新鲜制作好发货（除了乌冬面，哈哈）',
'收到货后如果发现【错发，与食品不符】请拍照24小时内联系向向，我们会妥善处理；',
'食品是预定下单新鲜制作均无现货，保质期较短所以不接受7天无理由退换货',
'所有的食材都是精挑细选当季最新鲜的，品质最高的，牛肉酱是我和家人用心纯手工熬制。我们用诚心良心竭力做精品美食，按订单需求小批量精制，保证每一包牛肉酱新鲜，纯正，天然，美味'],
flavor:'微辣  中辣 超辣',
expirationDate:'阴凉干燥处：5天 冷藏：7天',
eatmethod:'开袋即食',
savemethod:'冷藏！！！',
weight:'100g+'
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
},
shortDes:'精选食材 小批量精制  纯手工熬制 无防腐剂 无添加剂',
detailDes:['牛肉酱在拍下24小时内新鲜制作好发货',
'收到货后如果发现【错发，与食品不符】请拍照24小时内联系向向，我们会妥善处理',
'牛肉酱是预定下单新鲜制作均无现货，保质期较短所以不接受7天无理由退换货',
'所有的食材都是精挑细选当季最新鲜的，品质最高的，每一款肉干儿都是我和家人用心纯手工熬制。我们用诚心良心竭力做精品美食，按订单需求小批量精制，保证每一瓶肉干儿新鲜，纯正，天然，美味'],
flavor:'微辣  中辣 超辣',
expirationDate:'7天',
eatmethod:'开瓶即食（可用来拌饭拌粉喔，很多菜也可以加它一起炒喔）',
savemethod:'冷藏！！！',
weight:'100g+'

 },
{
    _id:3,
   name: '向向家麻辣鱿鱼干儿',
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
       'http://xx-jia.com/images/productimage/3/640/1.jpg',
       'http://xx-jia.com/images/productimage/3/640/2.jpg',
       'http://xx-jia.com/images/productimage/3/640/3.jpg',
       'http://xx-jia.com/images/productimage/3/640/4.jpg'
     ],

    category: { _id: '牛肉', ancestors: ['牛肉', '肉类']  
},
shortDes:'精选食材  休闲零食 香辣口味 纯手工熬制 无防腐剂 无添加剂',
detailDes:['鱿鱼干二在拍下24小时内新鲜制作好发货',
'收到货后如果发现【错发，与食品不符】请拍照24小时内联系向向，我们会妥善处理',
'鱿鱼干儿是预定下单新鲜制作均无现货，保质期较短所以不接受7天无理由退换货',
'所有的食材都是精挑细选当季最新鲜的，品质最高的，每一款肉干儿都是我和家人用心纯手工熬制。我们用诚心良心竭力做精品美食，按订单需求小批量精制，保证每一瓶肉干儿新鲜，纯正，天然，美味'],
flavor:'微辣  中辣 超辣',
expirationDate:'7天',
eatmethod:'开袋即食（可作为馋嘴小零食，可用来拌饭拌粉，可作为招待客人的一道佳品，加热后口味更佳喔）',
savemethod:'阴凉干燥处：10天 冷藏：15天',
weight:'100g+'
 },
 {
    _id:4,
   name: '向向家麻麻辣辣牛肉干儿',
   price: 20,
    smallpic:'http://localhost:3000/img/东鸠桃烤杏仁焦糖粟米条.jpg',
    detailpictures:[
    'http://xx-jia.com/images/productimage/4/750/1.jpg',
    'http://xx-jia.com/images/productimage/4/750/2.jpg',
    'http://xx-jia.com/images/productimage/4/750/3.jpg',
    'http://xx-jia.com/images/productimage/4/750/4.jpg',
    'http://xx-jia.com/images/productimage/4/750/5.jpg',
    'http://xx-jia.com/images/productimage/4/750/6.jpg',
    'http://xx-jia.com/images/productimage/4/750/7.jpg'
    ],
     sliderpictures: [
       'http://xx-jia.com/images/productimage/4/640/1.jpg',
       'http://xx-jia.com/images/productimage/4/640/2.jpg',
       'http://xx-jia.com/images/productimage/4/640/3.jpg',
       'http://xx-jia.com/images/productimage/4/640/4.jpg'
     ],

    category: { _id: '牛肉', ancestors: ['牛肉', '肉类']  
},
shortDes:'精选食材  休闲零食 香辣口味 纯手工熬制 无防腐剂 无添加剂',
detailDes:['牛肉干儿在拍下24小时内新鲜制作好发货',
'收到货后如果发现【错发，与食品不符】请拍照24小时内联系客服，我们会妥善处理',
'私房菜是预定下单新鲜制作均无现货，保质期较短所以不接受7天无理由退换货',
'所有的食材都是精挑细选当季最新鲜的，品质最高的，每一款肉干儿都是我和家人用心纯手工熬制。我们用诚心良心竭力做精品美食，按订单需求小批量精制，保证每一瓶肉干儿新鲜，纯正，天然，美味',
'尽管选用新鲜成年黄牛肉，去腥还是不可忽视的，洗净修剪焯水后，经人工均匀切条切丁，这一过程是非常费时费工'],
flavor:'微辣  中辣 超辣',
expirationDate:'7天',
eatmethod:'开袋即食（可作为馋嘴小零食，可用来拌饭拌粉，可作为招待客人的一道佳品，加热后口味更佳喔）',
savemethod:'阴凉干燥处：10天 冷藏：15天',
weight:'100g+'
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
