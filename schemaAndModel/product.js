var mongoose = require('mongoose');
var Category = require('./category');
var Schema = mongoose.Schema;
var productSchema = {
  _id: { type:Number},
  name: { type: String, required: true },
  // Pictures must start with "http://"
  smallpic:{type: String, match: /^http:\/\//i },
  pictures: [{ type: String, match: /^http:\/\//i }],
  price: {
   type: Number, 
   required: true 
  },
  category: Category.categorySchema,
  comments: [{ 
            type:Schema.Types.ObejectID ,
            ref:'Comment'
                    }]
};
module.exports = new mongoose.Schema(productSchema);
module.exports.productSchema = productSchema;
