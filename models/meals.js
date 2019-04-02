const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const Category = require('../models/categories');
const Restaurant = require('../models/restaurants');

//Create a schema 
const MealSchema = new Schema({
	restaurant_id  : {type: Schema.Types.ObjectId, ref: Restaurant, default: null},
	category_id  : {type: Schema.Types.ObjectId, ref: Category, default: null},
	name  : { type: String, default:''},
	description	: { type: String, default:''},
	price : {type: Number, default:0},
	meal_image : { type: String, default:''},
	type : { type: String, default:'Vegetarian', enum: ['Vegetarian', 'Non Vegetarian']},
	size_info:[{
		name: {type: String, default:'', enum: ['Full', 'Half','Quarter', 'Large', 'Medium', 'Small']},
		price: {type: Number, default:0}
	}],
	addOn_info:[{
		name: {type: String, default:''},
		price: {type: Number, default:0}
	}]
},
{
    timestamps: true 
}); 
    
//Create a model
const meals =  mongoose.model('meals', MealSchema);

//Export the model
module.exports = meals; 