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

        var categories = [
      { _id: '肉类' },
      { _id: '牛肉', parent: '肉类' }
    ];

var products = [{
    _id:1,
   name: '向向家牛肉酱乌冬面',
   price: 9.5,
   oldprice:12.8,
   sales:10,
   flavoroptions:['微辣','中辣','超辣'],
   selectedflavor:'微辣',
   sizeoptions:['100g'],
   selectedsize:'100g',
    smallpic130:'http://xx-jia.com/images/productimage/1/130.jpg',
    smallpic210:'http://xx-jia.com/images/productimage/1/210.jpg',
    detailpictures:[
    'http://xx-jia.com/images/productimage/1/750/1.jpg',
    'http://xx-jia.com/images/productimage/1/750/2.jpg',
    'http://xx-jia.com/images/productimage/1/750/3.jpg',
    'http://xx-jia.com/images/productimage/1/750/4.jpg',
    'http://xx-jia.com/images/productimage/1/750/5.jpg',
    'http://xx-jia.com/images/productimage/1/750/6.jpg'
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
shortDes:'精选食材 工艺讲究  纯手工熬制 无添加剂',
detailDes:['食品是在拍下24小时内新鲜制作好发货（除了乌冬面，哈哈）',
'收到货后如果发现【错发，与食品不符】请拍照24小时内联系向向，我们会妥善处理；',
'食品是预定下单新鲜制作均无现货，保质期较短所以不接受7天无理由退换货',
'所有的食材都是精挑细选当季最新鲜的，品质最高的，牛肉酱是我和家人用心纯手工熬制。我们用诚心良心竭力做精品美食，按订单需求小批量精制，保证每一包牛肉酱新鲜，纯正，天然，美味'],
flavor:'微辣  中辣 超辣',
expirationDate:'阴凉干燥处：5天 冷藏：7天',
eatmethod:'开袋即食',
savemethod:'冷藏！！！',
weight:'100g+',
mifang:'选自多种天然香辛料按精确比例配制而成，无防腐剂，无添加剂，全靠天然香料提味',
requirement:'譬如不喜欢吃蒜吃花椒请下单前与客服沟通好，我们会耐心按照亲们的要求精心制作'
 },{
    _id:2,
   name: '向向家牛肉酱',
   price: 9.5,
    oldprice:12.8,
   sales:10,
   flavoroptions:['微辣','中辣','超辣'],
   selectedflavor:'微辣',
   sizeoptions:['100g'],
   selectedsize:'100g',
    smallpic130:'http://xx-jia.com/images/productimage/2/130.jpg',
    smallpic210:'http://xx-jia.com/images/productimage/2/210.jpg',
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
shortDes:'精选食材 小批量精制  纯手工熬制 无添加剂',
detailDes:['牛肉酱在拍下24小时内新鲜制作好发货',
'收到货后如果发现【错发，与食品不符】请拍照24小时内联系向向，我们会妥善处理',
'牛肉酱是预定下单新鲜制作均无现货，保质期较短所以不接受7天无理由退换货',
'所有的食材都是精挑细选当季最新鲜的，品质最高的，每一款肉干儿都是我和家人用心纯手工熬制。我们用诚心良心竭力做精品美食，按订单需求小批量精制，保证每一瓶肉干儿新鲜，纯正，天然，美味'],
flavor:'微辣  中辣 超辣',
expirationDate:'7天',
eatmethod:'开瓶即食（可用来拌饭拌粉喔，很多菜也可以加它一起炒喔）',
savemethod:'冷藏！！！',
weight:'100g+',
mifang:'选自多种天然香辛料按精确比例配制而成，无防腐剂，无添加剂，全靠天然香料提味',
requirement:'譬如不喜欢吃蒜吃花椒请下单前与客服沟通好，我们会耐心按照亲们的要求精心制作'

 },
{
    _id:3,
   name: '向向家麻辣鱿鱼干儿',
   price: 12.5,
    oldprice:14.8,
   sales:10,
   flavoroptions:['微辣','中辣','超辣'],
   selectedflavor:'微辣',
   sizeoptions:['10g/袋 10袋 ','50g/袋 2袋','100g/袋 1袋'],
   selectedsize:'10g/袋 10袋',
    smallpic130:'http://xx-jia.com/images/productimage/3/130.jpg',
    smallpic210:'http://xx-jia.com/images/productimage/3/210.jpg',
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
shortDes:'精选食材  休闲零食 香辣口味 纯手工熬制  无添加剂',
detailDes:['鱿鱼干二在拍下24小时内新鲜制作好发货',
'收到货后如果发现【错发，与食品不符】请拍照24小时内联系向向，我们会妥善处理',
'鱿鱼干儿是预定下单新鲜制作均无现货，保质期较短所以不接受7天无理由退换货',
'所有的食材都是精挑细选当季最新鲜的，品质最高的，每一款肉干儿都是我和家人用心纯手工熬制。我们用诚心良心竭力做精品美食，按订单需求小批量精制，保证每一瓶肉干儿新鲜，纯正，天然，美味'],
flavor:'微辣  中辣 超辣',
expirationDate:'7天',
eatmethod:'开袋即食（可作为馋嘴小零食，可用来拌饭拌粉，可作为招待客人的一道佳品，加热后口味更佳喔）',
savemethod:'阴凉干燥处：10天 冷藏：15天',
weight:'100g+',
mifang:'选自多种天然香辛料按精确比例配制而成，无防腐剂，无添加剂，全靠天然香料提味',
requirement:'譬如不喜欢吃蒜吃花椒请下单前与客服沟通好，我们会耐心按照亲们的要求精心制作'
 },
 {
    _id:4,
   name: '向向家麻麻辣辣牛肉干儿 100g',
   price: 21.8,
    oldprice:25.8,
   sales:10,
   flavoroptions:['微辣','中辣','超辣'],
   selectedflavor:'微辣',
   sizeoptions:['10g/袋 10袋 ','50g/袋 2袋','100g/袋 1袋'],
   selectedsize:'10g/袋 10袋',
    smallpic130:'http://xx-jia.com/images/productimage/4/130.jpg',
    smallpic210:'http://xx-jia.com/images/productimage/4/210.jpg',
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
shortDes:'精选食材  休闲零食 香辣口味 纯手工熬制  无添加剂',
detailDes:['牛肉干儿在拍下24小时内新鲜制作好发货',
'收到货后如果发现【错发，与食品不符】请拍照24小时内联系客服，我们会妥善处理',
'私房菜是预定下单新鲜制作均无现货，保质期较短所以不接受7天无理由退换货',
'所有的食材都是精挑细选当季最新鲜的，品质最高的，每一款肉干儿都是我和家人用心纯手工熬制。我们用诚心良心竭力做精品美食，按订单需求小批量精制，保证每一瓶肉干儿新鲜，纯正，天然，美味',
'尽管选用新鲜成年黄牛肉，去腥还是不可忽视的，洗净修剪焯水后，经人工均匀切条切丁，这一过程是非常费时费工'],
flavor:'微辣  中辣 超辣',
expirationDate:'7天',
eatmethod:'开袋即食（可作为馋嘴小零食，可用来拌饭拌粉，可作为招待客人的一道佳品，加热后口味更佳喔）',
savemethod:'阴凉干燥处：10天 冷藏：15天',
weight:'100g+',
mifang:'选自多种天然香辛料按精确比例配制而成，无防腐剂，无添加剂，全靠天然香料提味',
requirement:'譬如不喜欢吃蒜吃花椒请下单前与客服沟通好，我们会耐心按照亲们的要求精心制作'
 },
  {
    _id:5,
   name: '向向家麻麻辣辣腊肉干儿',
   price: 21.8,
    oldprice:24.8,
   sales:10,
   flavoroptions:['微辣','中辣','超辣'],
   selectedflavor:'微辣',
   sizeoptions:['10g/袋 10袋 ','50g/袋 2袋','100g/袋 1袋'],
   selectedsize:'10g/袋 10袋',
    smallpic130:'http://xx-jia.com/images/productimage/5/130.jpg',
    smallpic210:'http://xx-jia.com/images/productimage/5/210.jpg',
    detailpictures:[
    'http://xx-jia.com/images/productimage/5/750/1.jpg',
    'http://xx-jia.com/images/productimage/5/750/2.jpg',
    'http://xx-jia.com/images/productimage/5/750/3.jpg',
    'http://xx-jia.com/images/productimage/5/750/4.jpg',
    'http://xx-jia.com/images/productimage/5/750/5.jpg',
    'http://xx-jia.com/images/productimage/5/750/6.jpg',
    'http://xx-jia.com/images/productimage/5/750/7.jpg',
    'http://xx-jia.com/images/productimage/5/750/8.jpg',
    'http://xx-jia.com/images/productimage/5/750/9.jpg'
    ],
     sliderpictures: [
       'http://xx-jia.com/images/productimage/5/640/1.jpg',
       'http://xx-jia.com/images/productimage/5/640/2.jpg',
       'http://xx-jia.com/images/productimage/5/640/3.jpg',
       'http://xx-jia.com/images/productimage/5/640/4.jpg'
     ],

    category: { _id: '牛肉', ancestors: ['牛肉', '肉类']  
},
shortDes:'精选食材  休闲零食 香辣口味 纯手工熬制  无添加剂',
detailDes:['腊肉干儿在拍下24小时内制作好发货',
'收到货后如果发现【错发，与食品不符】请拍照24小时内联系客服，我们会妥善处理',
'食品是预定下单新鲜制作均无现货，保质期较短所以不接受7天无理由退换货',
'所有的食材都是精挑细选当季最新鲜的，品质最高的，每一款肉干儿都是我和家人用心纯手工熬制。我们用诚心良心竭力做精品美食，按订单需求小批量精制，保证每一瓶肉干儿新鲜，纯正，天然，美味',
'湘西人家及湘西周边人家里每年都会做超多好吃的腊肉和腊肠，那是那一块地方的习俗，湘西腊肉的特点就是用橘树叶和橘皮当然还有干柴的烟熏制20天左右而成的，不是晒干的也不是乱七八糟的烟熏的，所以它有它独有的香味然后口感真的是极佳的'],
flavor:'微辣  中辣 超辣',
expirationDate:'阴凉干燥处：10天 冷藏：15天',
eatmethod:'开袋即食（可作为馋嘴小零食，可用来拌饭拌粉，可作为招待客人的一道佳品，加热后口味更佳喔）',
savemethod:'冷藏',
weight:'100g+',
mifang:'选自多种天然香辛料按精确比例配制而成，无防腐剂，无添加剂，全靠天然香料提味',
requirement:'譬如不喜欢吃蒜吃花椒请下单前与客服沟通好，我们会耐心按照亲们的要求精心制作'
 },
  {
    _id:6,
   name: '向向家牛轧糖',
   price: 17.8,
   oldprice:18.8,
   sales:10,
   priceoptions: [22.8,32.8,17.8,38.8],
   flavoroptions:['抹茶花生','抹茶核桃/杏仁','原味纯花生','核桃杏仁/花生'],
   selectedflavor:'抹茶花生',
   sizeoptions:['250g'],
   selectedsize:'250g',
    smallpic130:'http://xx-jia.com/images/productimage/6/130.jpg',
    smallpic210:'http://xx-jia.com/images/productimage/6/210.jpg',
    detailpictures:[
    'http://xx-jia.com/images/productimage/6/750/1.jpg',
    'http://xx-jia.com/images/productimage/6/750/2.jpg',
    'http://xx-jia.com/images/productimage/6/750/3.jpg',
    'http://xx-jia.com/images/productimage/6/750/4.jpg',
    'http://xx-jia.com/images/productimage/6/750/5.jpg',
    'http://xx-jia.com/images/productimage/6/750/6.jpg'
    ],
     sliderpictures: [
       'http://xx-jia.com/images/productimage/6/640/1.jpg',
       'http://xx-jia.com/images/productimage/6/640/2.jpg',
       'http://xx-jia.com/images/productimage/6/640/3.jpg',
       'http://xx-jia.com/images/productimage/6/640/4.jpg'
     ],

    category: { _id: '牛肉', ancestors: ['牛肉', '肉类']  
},
shortDes:'  休闲零食  纯手工熬制 ',
detailDes:['牛轧糖在拍下24小时内制作好发货',
'收到货后如果发现【错发，与食品不符】请拍照24小时内联系客服，我们会妥善处理',
'食品是预定下单新鲜制作均无现货，保质期较短所以不接受7天无理由退换货',
'所有的食材都是精挑细选最放心的，品质最高的，每一款牛轧糖都是我和家人用心纯手工熬制。我们用诚心良心竭力做精品美食，按订单需求小批量精制，保证每一块牛轧糖新鲜，纯正，天然，美味'],
flavor:'抹茶花生,抹茶核桃/杏仁,原味纯花生,核桃杏仁/花生',
expirationDate:'阴凉干燥处：10天 冷藏：15天',
eatmethod:'开袋即食',
savemethod:'冷藏',
weight:'100g+',
mifang:'就是用心',
requirement:'譬如对什么坚果过敏的一定要提前说哦'
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
