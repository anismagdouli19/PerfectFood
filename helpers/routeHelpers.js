const joi = require('joi');

module.exports={

	validateBody: (schema) => {
		return(req, res, next) => {
			const result = joi.validate(req.body, schema,(err, value) => {
				if(err){
					return res.status(422).json({
			                success: false,
			                message: err.details[0].message.replace(/[^a-zA-Z ]/g, ""),
          			});
				}else{
					req.data = value;
					next();
				}
			 });			
		}
	},

	schemas: {

		signUpSchema: joi.object().keys({
			email : joi.string().email().required(),
			password : joi.string(),
			phoneNumber : joi.string().allow(''),
			role: joi.number().valid(1,2,3,4).required(),
			firstname : joi.when('role',{is: '1', then: joi.string().required(), otherwise: joi.string() }),
			lastname : joi.when('role',{is: '1', then: joi.string().required(), otherwise: joi.string() }),
			promoCode: joi.string().allow('').min(6).max(6),
			
			companyName: joi.when('role',{is: '2', then: joi.string().required(), otherwise: joi.string().allow('') }),
			director: joi.when('role',{is: '2', then: joi.string().required(), otherwise: joi.string().allow('') }),
			companyAddress: joi.string().allow(''),

			name: joi.when('role',{is: '3', then: joi.string().required(), otherwise: joi.string().allow('') }),
			description: joi.string().allow(''),
			address: joi.when('role',{is: '3', then: joi.string().required(), otherwise: joi.string().allow('') }),
			zipcode : joi.string().allow(''),
			city : joi.string().allow(''),
			state: joi.string().allow(''),
			latitude : joi.string().allow(''),
			longitude : joi.string().allow(''),
			jobDay: joi.string().allow(''),
			openingTime: joi.string().allow(''),
			closingTime: joi.string().allow(''),
			bannerImage:joi.string().allow(''),
			website:joi.string().allow(''),
			director_name: joi.string().allow(''),
			company_number: joi.string().allow(''),
			language: joi.string().allow(''),
			transportType: joi.string().allow(''),
			reasonForApplying: joi.string().allow(''),
			geo_address:joi.object().allow(''),
		}),
  
		authSchema: joi.object().keys({
			email: joi.string().email().required(),
			password: joi.string().required(),
			role:joi.number().required()
		}), 

		category :joi.object().keys({
			name: joi.string().required(),
			restaurant_id: joi.string(),
			id: joi.string()
		}),

		subCategory :joi.object().keys({
			id: joi.string(),
			name: joi.string().required(),
			category_id: joi.string().required(),
			restaurant_id: joi.string(),
		}),
		
		// meal :joi.object().keys({
		// 	id: joi.string(),
		// 	name: joi.string().required(),
		// 	description: joi.string().allow(''),
		// 	category_id: joi.string().required(),
		// 	subCategory_id: joi.string(),
		// 	restaurant_id: joi.string().required(),
		// 	price: joi.string().allow(''),
		// 	type: joi.string().required(),
		// 	size_info: joi.string().allow(''),
		// 	addOn_info: joi.string().allow(''),
		// }),
		
		addOn : joi.object().keys({
			id: joi.string(),
			name: joi.string().required(),
			price: joi.string().required(),
			meal_id: joi.string(),
		}),

		mealSize : joi.object().keys({
			id: joi.string(),
			name: joi.string().required(),
			price: joi.string().required(),
			meal_id: joi.string(),
		}),
		
		cuisine: joi.object().keys({
			id: joi.string(),
			name: joi.string().required(),
		}),
		changeStatus:joi.object().keys({
			order_id: joi.string(),
		
		}),

	}
}
 