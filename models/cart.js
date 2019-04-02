const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 
const Schema = mongoose.Schema;
const Meal = require('../models/meals');
const Order = require('../models/orders');
const Restaurant = require('../models/restaurants');
const User = require('../models/user');

//Create a schema 
const cartSchema = new Schema({
	user_id	: {type: Schema.Types.ObjectId, ref: User, default: null},
	restaurant_id : {type: Schema.Types.ObjectId, ref: Restaurant, default: null},
	meal_info: [{
			meal_id	: { type: Schema.Types.ObjectId, ref: Meal, default: null },
			name: { type: String, default:'' },
			quantity: { type: Number, default:0},
			price: { type: Number, default:0 },
			addOns:[{
				name: { type: String, default:'' },
				price: { type: Number, default:0 },
				addOn_id:{ type: String, default:'' }
	    	}],
	    	size: {
	    		name:  { type: String, default:'' },
	    		price: { type: Number, default:0 },
	    		size_id: { type: String, default:'' }
	    	}
	}],
	total: { type: Number, default:0},
	status: { type: String, default:'Pending', enum: ['Pending', 'Ordered']},
	order_note: {type: String, default:''}
},
  {
    timestamps: true 
  }); 
    
//Create a model
const cart =  mongoose.model('cart', cartSchema);

//Export the model
module.exports = cart; 