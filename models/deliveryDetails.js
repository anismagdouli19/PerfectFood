const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const User = require('../models/user');

//Create a schema 
const DeliveryDetailsSchema = new Schema({
	user_id: {type: Schema.Types.ObjectId, ref: User, default: null},
	apartment_no: {type: String, default:''},
	business_name: {type: String, default:''},
	address : { type: String, default:''},
	short_address: { type: String, default:''},
	zipcode : {type: String, default:''},
	city : {type: String, default:''},
	state: {type: String, default:''},
	delivery_geo_address : {
		type: {type: String, default:'Point'},
		coordinates: {type: [Number], default: [0,0], index: '2dsphere'}
		}, 
	delivery_note: {type: String, default:''},
	type: {type: String, default:''},
	status:{type: Boolean, default:false},
},
  {
    timestamps: true 
  }); 
    
//Create a model
const deliveryDetails =  mongoose.model('deliveryDetails', DeliveryDetailsSchema);

//Export the model
module.exports = deliveryDetails;  