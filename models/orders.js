const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  
const Schema = mongoose.Schema;

const Restaurant = require('../models/restaurants');
const User = require('../models/user');
const CartData = require('../models/cart'); 
const Meal = require('../models/meals'); 
const Drivers = require('../models/drivers');
 
//Create a schema 
const orderSchema = new Schema({ 
	user_id	: {type: Schema.Types.ObjectId, ref: User, default: null},
	restaurant_id :{type: Schema.Types.ObjectId, ref: Restaurant, default: null },
	driver_id :{type: Schema.Types.ObjectId, ref: Drivers, default: null},
	meal_info: [{
			meal_id	: { type: Schema.Types.ObjectId, ref: Meal, default: null },
			name: { type: String, default:'' },
			quantity: { type: Number, default:0},
			price: { type: Number, default:0 },
			meal_note: { type: String, default:'' },
			addOns:[{
				name: { type: String, default:'' },
				price: { type: Number, default:0 },
				addOn_id: { type: String, default:'' }
	    	}],
	    	size: {
	    		name:  { type: String, default:'' },
	    		price: { type: Number, default:0 },
	    		size_id: { type: String, default:'' }
	    	}
	}],
	total: { type: Number, default:0},
	status: { type: String, default:'Waiting', enum: ['Waiting', 'Accepted', 'Cooking', 'Packing', 'Ready', 'Waiting For Driver', 'On The Way', 'Delivered', 'Rejected']},
	delivery_apartment: { type: String, default:'' },
	delivery_address: { type: String, default:'' },
	delivery_geo_address : {
		type: {type: String, default:'Point'},
		coordinates: {type: [Number], default: [0,0], index: '2dsphere'}
		}, 
	delivery_note: {type: String, default:''},
	order_note: {type: String, default:''},
	delivery_fee: { type: Number, default:0},

},
  {
    timestamps: true 
  }); 
    
//Create a model
const orders =  mongoose.model('orders', orderSchema);

//Export the model
module.exports = orders; 