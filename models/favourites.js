const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  
const Schema = mongoose.Schema;

const Restaurant = require('../models/restaurants');
const User = require('../models/user');

//Create a schema 
const favouriteSchema = new Schema({ 
	user_id	: {type: Schema.Types.ObjectId, ref: User, default: null},
	restaurant_id :{type: Schema.Types.ObjectId, ref: Restaurant, default: null},
},
  {
    timestamps: true 
  }); 
    
//Create a model
const favourites =  mongoose.model('favourites', favouriteSchema);

//Export the model
module.exports = favourites; 