const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const User = require('../models/user');
//Create a schema 
const RestaurantSchema = new Schema({
	user_id: {type: Schema.Types.ObjectId, ref: User, default: null},
	name: { type: String, default:''},
	address: { type: String, default:''},
	email: {type: String, default:''},
	phoneNumber: {type: String, default:''},
	description: {type: String, default:''},
	website: {type: String, default:''},
	//zipcode : {type: String, default:''}, 
	//city : {type: String, default:''},
	//state: {type: String, default:''},
	geo_address: {
		type: {type: String, default:'Point'},
		coordinates: {type: [Number], default: [0,0], index: '2dsphere'}
		}, 
	distance:  {type: Number, default:0},
	jobDay: {type: String, default:''},
	openingTime: {type: String, default:''},
	closingTime: {type: String, default:''},
	bannerImage: {type: String, default:''},
	acceptCash: {type: Boolean, default:true},
	onlinePayment: {type: Boolean, default:true},
	discount: {type: String, default:''},
	director_name: {type: String, default:''},
  	company_number: {type: String, default:''},
  	cuisins:{type: String, default:''},
  	meal_preparing_time: {type: String, default:'00:00'},
  	orderQuantity:  {type: Number, default:0},
  	slug: {type: String, default:''}
},
  {
    timestamps: true 
  }); 

//Create a model
const restaurants =  mongoose.model('restaurants', RestaurantSchema);


//Export the model
module.exports = restaurants; 