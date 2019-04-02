const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const User = require('../models/user');
//Create a schema 
const DriverSchema = new Schema({
	user_id: {type: Schema.Types.ObjectId, ref: User, default: null},
	name: { type: String, default:''},
	email: {type: String, default:''},
	phoneNumber: {type: String, default:''},
	address: { type: String, default:''},
	geo_location : {
		type: {type: String, default:'Point'},
		coordinates: {type: [Number], default: [0,0], index: '2dsphere'}
		},
	transportType: {type: String, default:'Motorbike', enum: ['Bicycle','Motorbike','Car']},
	reasonForApplying: {type: String, default:''},
	status: {type: String, default:'Inactive', enum: ['active', 'Inactive', 'busy' ]},
	todayJob: {type: Number, default:0},
	jobDone:{type: Number, default:0},
},
  {
    timestamps: true 
  }); 
  
   DriverSchema.index({geo_location: '2dsphere'});
//Create a model
const drivers =  mongoose.model('drivers', DriverSchema);


//Export the model
module.exports = drivers; 