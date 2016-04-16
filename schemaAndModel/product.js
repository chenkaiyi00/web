var mongoose = require('mongoose');
var Category = require('./category');
var Schema = mongoose.Schema;
var productSchema = {
  _id: { type:Number},
  name: { type: String, required: true },
  // Pictures must start with "http://"
  smallpic:{type: String, match: /^http:\/\//i },
  detailpictures: [{ type: String, match: /^http:\/\//i }],
  sliderpictures: [{ type: String, match: /^http:\/\//i }],
  shortDes:{ type: String},
  price: {
   type: Number, 
   required: true 
  },
  category: Category.categorySchema,
  comments: [{ 
            type:Schema.ObjectId ,
            ref:'Comment'
                    }]
};
module.exports = new mongoose.Schema(productSchema);
module.exports.productSchema = productSchema;
