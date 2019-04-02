const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const User = require('../models/user');
const Restaurants = require('../models/restaurants');

//Create a schema 
const categorySchema = new Schema({
	restaurant_id: {type: Schema.Types.ObjectId, ref: Restaurants, default: null},
	name  : { type: String, default:''},
	image : { type: String, default:''}
},
  {
    timestamps: true 
  }); 
    
//Create a model
const categories =  mongoose.model('categories', categorySchema);

//Export the model
module.exports = categories; 