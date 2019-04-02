const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 
const Schema = mongoose.Schema;
const Meal = require('../models/meals');
const Order = require('../models/orders');
const Restaurant = require('../models/restaurants');
const User = require('../models/user');

//Create a schema 
const orderMessageSchema = new Schema({
	user_id	: {type: Schema.Types.ObjectId, ref: User, default: null},
	customer_id : {type: Schema.Types.ObjectId, ref: Restaurant, default: null},
	oder_id: {type: Schema.Types.ObjectId, ref: Order, default: null},
	message: {type: String, default:''}
},
  {
    timestamps: true 
  }); 
    
//Create a model
const orderMessages =  mongoose.model('orderMessage', orderMessageSchema);

//Export the model
module.exports = orderMessages; 