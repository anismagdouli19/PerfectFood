const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const Category = require('../models/categories');
const User = require('../models/user');
const Restaurants = require('../models/restaurants');

//Create a schema 
const subCategorySchema = new Schema({
	restaurant_id: {type: Schema.Types.ObjectId, ref: Restaurants},
	category_id  : {type: Schema.Types.ObjectId, ref: Category},
	name : { type: String, default:''},
},
  {
    timestamps: true 
  }); 
    
//Create a model
const subCategories =  mongoose.model('subCategories', subCategorySchema);

//Export the model
module.exports = subCategories; 