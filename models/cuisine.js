const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

//Create a schema 
const cuisineSchema = new Schema({
	name  : { type: String, default:''},
	image : { type: String, default:''}
},
  {
    timestamps: true 
  }); 
    
//Create a model
const cuisine =  mongoose.model('cuisine', cuisineSchema);

//Export the model
module.exports = cuisine; 