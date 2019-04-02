const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/user');
const Restaurant = require('../models/restaurants');

//Create a schema 
const ratingAndReviewSchema = new Schema({
		ratingBy: {type: Schema.Types.ObjectId, ref: User, default: null},
		restaurant_id: {type: Schema.Types.ObjectId, ref: Restaurant, default: null},
		rating: {type:Number, default:0},
		review: {type:String, default:""}
},
  {
    timestamps: true 
  }); 
    
//Create a model
const ratingAndReview =  mongoose.model('ratingAndReview', ratingAndReviewSchema);

//Export the model
module.exports = ratingAndReview;      