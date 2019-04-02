const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const User = require('../models/user');

//Create a schema 
const CustomerSchema = new Schema({
  user_id: {type: Schema.Types.ObjectId, ref: User, default: null},
  profileImage	: { type: String, default:''},
  email	: { type: String, lowercase: true, unique: true, required: true,default:'' },
  firstname : { type: String, default:''},
  lastname : { type: String, default:''},
  phoneNumber : {type: String, default:''},
  companyName : {type: String, default:''},
  address : {type: String, default:''},
  geo_address : {
    type: {type: String, default:'Point'},
    coordinates: {type: [Number], default: [0,0]}
    }, 
  director : {type: String, default:''},
  bio: {type: String, default:''},
  website: {type: String, default:''},
  idVerification: {type: String, default:''}, 
  language: { type: String, default:'en', enum: ['en','fr','pt','es','nl']}
},
  {
    timestamps: true
  });
   
CustomerSchema.index({geo_address: '2dsphere'});

//Create a model
const customers =  mongoose.model('customers', CustomerSchema);

//Export the model
module.exports = customers;