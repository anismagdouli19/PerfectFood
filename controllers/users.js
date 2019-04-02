const JWT = require('jsonwebtoken');
const User = require('../models/user');
const DeliveryDetails = require('../models/deliveryDetails');
const Restaurant = require('../models/restaurants');
const Driver = require('../models/drivers');
const Customer = require('../models/customers');
const Companies = require('../models/companies');
const crypto = require('crypto');
const { JWT_SECRET } = require('../config/index');
const bcrypt = require('bcryptjs');

const commonFunction = require('../helpers/function');

signtoken = user => {
	return JWT.sign({
		sub: user.id,
	}, JWT_SECRET );
}

module.exports = {

//SignUp
	signUp:async (req, res, next)=>{
		try{
			if(req.body.role == 1){
				// Personal/Company SignUp
				const {phoneNumber, email, firstname, lastname, address, password, role} = req.body;
				if(typeof req.file !== 'undefined'){
					 var idVerification = req.file.filename;
				}else{
					 var idVerification = '';
				}  
				founduser = await User.findOne({email});
				if(founduser){
					return res.json({
						success: false,
						message:'User allready exist'
					});
				}
				const newUser = new User({email, password, role});
				newUser.save(function(err, user){
					if(err){
						res.json({
							success:false,
							message: 'Something is wrong'
						});
						//return next(err);
					}else if(user == ''|| user == null){
						res.json({
							success:false,
							message: 'Something is wrong'
						});
					}else{
						var user_id = user._id;
						const newCustomer = new Customer({user_id, phoneNumber, email, firstname, lastname, address, idVerification});
						newCustomer.save();	
						const token = signtoken(newUser);					
						res.json({
							success: true,
							message:'User register successfully',
							token: token,
							userInfo: newCustomer
						});						
					}
				});
			}else if (req.data.role == 2){
				// Company SignUp
				const {phoneNumber, email, password, role, companyName, director_name, address, geo_address} = req.body;
				if(typeof req.file !== 'undefined'){
					 var idVerification = req.file.filename;
				}else{
					 var idVerification = '';
				}
				
				founduser = await User.findOne({email});
				if(founduser){
					return res.json({
						success: false,
						message:'Company allready exist'
					});
				}

				const newUser = new User({email, password, role});
				await newUser.save(function(err, user){
					if(err){
						res.json({
							success:false,
							message: 'Something is wrong'
						});
					}else if(user == ''|| user == null){
						res.json({ 
							success:false,
							message: 'Something is wrong'
						});
					}else{
					var user_id = user._id;
					const newCompanies = new Companies({user_id, phoneNumber, email, password, role, companyName, director_name, address, idVerification, geo_address});
					newCompanies.save(function(err, companies){
						if(err){
							res.json({
								success:false,
								message: 'Something is wrong'
							});
						}else if(user == ''|| user == null){
							res.json({
								success:false,
								message: 'Something is wrong'
							});
						}else{
							const token = signtoken(newUser);
							res.json({
								success:true,
								message:'Company register successfully',
								token: token,
								userInfo: companies
							});
						}
					});
				}
			});
			
			}else if (req.body.role == 3){
				console.log(req.body);
				// Restaurant SignUp
				const {name, phoneNumber, email, role, address, director_name, company_number, geo_address} = req.body;
				founduser = await User.findOne({email}); 
				if(founduser){
					return res.json({
						success: false,
						message:'Restaurants allready exist'
					}); 
				}
				const newUser = new User({phoneNumber, email, role, enableAccount: false});
				await newUser.save(function(err, user){
					if(err){
						res.json({
							success:false,
							message: 'Something is wrong'
						});
						return next(err);
					}else if(user == ''|| user == null){
						res.json({
							success:false,
							message: 'Something is wrong'
						});
					}else{
					user_id = user._id;
					const newRestaurant = new Restaurant({user_id, name, phoneNumber, email, address, director_name, company_number, geo_address});
					newRestaurant.save();

					// Send email to new restaurant
					var mailOptions = {
						    to: email,
						    subject: 'Food Ride Register Successfully',
						   }

					commonFunction.send_email('../public/view/restaurantSignUp.jade', mailOptions);

					const token = signtoken(newUser);
					res.json({
						success: true,
						message:'Apply successfully, please check your email'
					});
					}
				});
			}else if (req.body.role == 4){	// Driver SignUp
				const {phoneNumber, email, role, name, address, transportType, reasonForApplying} = req.body;
				const enableAccount = true;
				founduser = await User.findOne({email}); 
				if(founduser){
					return res.json({
						success: false,
						message:'Driver allready exist'
					}); 
				}
				const newpassword =  crypto.randomBytes(5).toString('hex');
				
				const newUser = new User({ email, password: newpassword, role});
				await newUser.save(function(err, user){
					if(err){
						res.json({
							success:false,
							message: 'No Driver available!'
						});
						return next(err);
					}
					user_id = user._id;
					const newDriver= new Driver({user_id, phoneNumber, email, name, address, transportType, reasonForApplying});
					newDriver.save();
					const token = signtoken(newUser);
					res.json({
						success: true,
						message:'Driver register successfully',
						token: token,
						newPassword: newpassword,
						driverInfo: newDriver
					});
				});   
			}else{
				return res.json({
					success: false,
					message:'Something is wrong!'
				});
			}
		}catch(error){
			return next(error);
		}
	}, 
  
// SignIn    
	signIn: async (req, res, next)=>{
		try{
			if (req.user.enableAccount === false){
				res.json({
					success:false, 
					message:"Sorry You've Been Banned"
				});
			}else if(req.user.status === false){ 
				res.json({
					success: false,
					message: 'Your login details could not be verified. Please try again.'
				});
			}else if(req.user.role != req.body.role) {
				res.json({
					success: false,
					message: 'Your login details could not be verified. Please try again.'
				});
			}else{ 
				var lang = req.user.language;
				const token = signtoken(req.user);
				if(req.user.role == 1){
					Customer.findOne({user_id: req.user.id}, function (err, user) {
						if(err){
							res.json({
								success: false,
								message: language(lang, "commonForAll", "error")
							});
						}else if(user == ''){
							res.json({
								success: false,
								message: language(lang, "commonForAll", "empty")
							});
						}else{
							res.json({
								success: true,
								message:'login successfully',
								token: token,
								role:1,
								userInfo: user
							});
						}
					}); 
				}else if(req.user.role == 2){
					Companies.findOne({user_id: req.user.id}, function (err, user) {
						if(err){
							res.json({
								success: false,
								message: language(lang, "commonForAll", "error")
							});
						}else if(user == ''){
							res.json({
								success: false,
								message: language(lang, "commonForAll", "empty")
							});
						}else{
							res.json({
								success: true,
								message:'login successfully',
								token: token,
								role:2,
								userInfo: user
							});
						}
					}); 
				}else if(req.user.role == 3){
					Restaurant.findOne({user_id: req.user.id}, function (err, restaurant) {
						if(err){
							res.json({
								success: false,
								message: language(lang, "commonForAll", "error")
							});
						}else if(restaurant == ''){
							res.json({
								success: false,
								message: language(lang, "commonForAll", "empty")
							});
						}else{
							res.json({
								success: true,
								message:'Restaurant login successfully',
								token: token,
								role:3,
								restaurant_Info: restaurant
							});
						}
					}); 
				}else if(req.user.role == 4){
					Driver.findOne({user_id: req.user.id}, function (err, driver) {
						if(err){
							res.json({
								success: false,
								message: language(lang, "commonForAll", "error")
							});
						}else if(driver == ''){
							res.json({
								success: false,
								message: language(lang, "commonForAll", "empty")
							});
						}else{
							res.json({
								success: true,
								message:'Driver login successfully',
								token: token,
								role:3,
								driver_Info: driver
							});
						}
					});
				}else if(req.user.role == 5){
					res.json({
						success: true,
						message:'Admin login successfully',
						token: token,
						role:5,
						admin_Info: req.user
					});
				}else{
					res.json({
						success: false,
						message: language(lang, "commonForAll", "error")
					});
				}		
			}
		}catch(error){
			return next(error);
		}
	},

// Logout
	logout: async (req, res, next)=>{
		try{
			await req.logout();
			res.json({
				success: true,
				message:'logout successfully'
			});
		}catch(error){
			return next(error);
		}
	},

// View Profile
	viewProfile: async (req, res, next)=>{
		try{
			var lang = req.user.language;
			var role = req.user.role;
			Customer.findOne({user_id:req.user.id}, function (err, user) {
				if(err){
					res.json({
						success: false,
						message: language(lang, "commonForAll", "error")
					});
				}else if(user == ''){
					res.json({
						success: false,
						message: language(lang, "commonForAll", "empty")
					});
				}else{
					res.json({
						success: true,
						role:role,
						userInfo: user
					}); 
				}
			});
		}catch(error){
			return next(error);
		} 
	},

// View all Profile
	viewAllProfile: async (req, res, next)=>{
		try{
			
				var user_id = req.query.id;
				var lang = 'en';
				var role = req.query.role;
		
			if(role == 1){
				Customer.findOne({user_id}, function (err, user) {
					if(err){
						res.json({
							success: false,
							message: language(lang, "commonForAll", "error")
						});
					}else if(user == '' || user == null){
						res.json({
							success: false,
							message: language(lang, "commonForAll", "empty")
						});
					}else{
						res.json({
							success: true,
							role:role,
							userInfo: user
						}); 
					}
				});
			}else if(role == 2){
				Companies.findOne({user_id}, function (err, company) {
					if(err){
						res.json({
							success: false,
							message: language(lang, "commonForAll", "error")
						});
					}else if(company == '' || company == null){
						res.json({
							success: false,
							message: language(lang, "commonForAll", "empty")
						});
					}else{
						res.json({
							success: true,
							role:role,
							companyInfo: company
						});  
					}
				});

			}else if(role == 3){ 
				Restaurant.findOne({user_id}, function (err, restaurant) {
					if(err){
						res.json({
							success: false,
							message: language(lang, "commonForAll", "error")
						});
					}else if(restaurant == '' || restaurant == null){
						res.json({
							success: false,
							message: language(lang, "commonForAll", "empty")
						});
					}else{
						res.json({
							success: true,
							role:role,
							restaurantInfo: restaurant
						}); 
					}
				});
			}else if(role == 4){
				Driver.findOne({user_id}, function (err, driver) {
					if(err){
						res.json({
							success: false,
							message: language(lang, "commonForAll", "error")
						});
					}else if(driver == '' || driver == null){
						res.json({
							success: false,
							message: language(lang, "commonForAll", "empty")
						});
					}else{
						res.json({
							success: true,
							role:role,
							driverInfo: driver
						}); 
					}
				});
			}else{
				res.json({
					success: false,
					message: language(lang, "commonForAll", "error")
				});
			}
		}catch(error){
			return next(error);
		} 
	},


// Update Profile
	updateProfile: async (req, res, next) =>{
		try{
			var lang = req.user.language;
			var userToUpdate = req.user.id;
			const updateOps = {};
			if(req.body.phoneNumber){
				updateOps['phoneNumber'] = req.body.phoneNumber;
			}
			if(req.body.firstname){
				updateOps['firstname'] = req.body.firstname;
			}
			if(req.body.lastname){
				updateOps['lastname'] = req.body.lastname;
			}
			if(req.body.companyName){
				updateOps['companyName'] = req.body.companyName;
			}
			if(req.body.directo){
				updateOps['director'] = req.body.director;
			}
			if(req.body.website){
				updateOps['website'] = req.body.website;
			}
			if(req.body.bio){
				updateOps['bio'] = req.body.bio;
			}
			if(typeof req.file !== 'undefined'){
				updateOps['profileImage'] = req.file.filename;
			}

			Customer.updateOne({user_id: userToUpdate}, { $set: updateOps },
				function (err, user) {
					if(err){
						res.json({
							success: false,
							message: language(lang, "commonForAll", "error")
						});
						return next(err);
					}else{
						res.json({
							success: true,
							message: language(lang, "commonForAll", "update")
						});
					}
				});
		}catch(error){
			return next(error);
		}
	},

// Update Profile Image
	updateProfileImage:  async (req, res, next)=>{
		try{
			var userToUpdate = req.user.id;
			var lang = req.user.language;
			if(typeof req.file !== 'undefined'){ 
				Customer.update({user_id: userToUpdate}, {  $set : {profileImage : req.file.filename}} ,
					function (err, user){
						if(err){
							res.json({ 
								success: false,
								message: language(lang,"commonForAll","error")
							});
							return next(err);
						}else{
							res.json({ 
								success: true,
								message: language(lang,"commonForAll","update")
							});
						}
					});	
			}else{
				res.json({
					success: false,
					message: language(lang,"updateProfileImage","required")
				});
			} 
		}catch(error){
			return next(error);
		}
	},

// Change password
	changePassword:  async (req, res, next)=>{
		try{
			var lang = req.user.language;
			var userToUpdate = req.user.id;
			if (req.body.password){
				const salt = await bcrypt.genSalt(10);
				const passwordHash = await bcrypt.hash(req.body.password, salt);
				password = passwordHash;

				updateOps = {};
				updateOps['password'] = password;
				User.update({_id: userToUpdate}, { $set: updateOps },
					function (err, user) {
						if(err){
							res.json({
								success: false,
								message: language(lang,"commonForAll","error")
							});
							return next(err);
						}else{
							res.json({
								success: true,
								message: language(lang,"commonForAll","update")
							});
						}
					});
			}else{
				res.json({
					success: false,
					message: language(lang,"changePassword","required")
				});
			}
		}catch(error){
			return next(error);
		}
	},

// Forget Password
	forgetPassword: async (req, res, next)=>{
		try{
			const email = req.body.email;

			User.findOne({ email }, (err, existingUser) => {
				if (err || existingUser == null) {
					res.json({
						success:false,
						message: 'Your request could not be processed as entered. Please try again.'
					});
					return next(err);
				}
			      // Generate a token with Crypto
			      crypto.randomBytes(48, (err, buffer) => {
			      	const resetToken = buffer.toString('hex');
			      	if (err) { return next(err); }
			      		existingUser.resetPasswordToken = resetToken;
			      		existingUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour
			      		existingUser.save((err) => {
			          // If error in saving token, return it
			          if (err) { return next(err); }
					          // Send email to new restaurant
							var mailOptions = {
							    to: email,
							    subject: 'Food Ride Reset Password',
							    resetToken: resetToken,
							};

							commonFunction.send_email('../public/view/forgot_password.jade', mailOptions);
					        return res.json({
					        	success:true,
					        	message: 'Please check your email for the link to reset your password.'
					        });
					    });
			      	});
			});
		}catch(error){
			return next(error);
		}
	},

// Reset Password
	resetPassword: async (req, res, next)=>{
		try{
			//Generate a salt
				const salt = await bcrypt.genSalt(10);
				const passwordHash = await bcrypt.hash(req.body.password, salt);
				password = passwordHash;
			 User.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } }, (err, resetUser) => {
				if (!resetUser) {
					res.json({
						success: false,
						message: 'Your token has expired. Please attempt to reset your password again.'
					});
					return next(err);
				}
				var userToUpdate = resetUser.id;
				console.log(req.body.password);
				// Otherwise, save new password and clear resetToken from database
			    User.updateOne({_id: userToUpdate}, { $set: {'password':password, 'resetPasswordToken':'','resetPasswordExpires':''} }, function (err, user) {
					if(err){
						res.json({
							success: false,
							message: 'Something is wrong!'
						});
						return next(err);
					}
				});

			    // If password change saved successfully, alert user via email
			    const message = {
			     	subject: 'Password Changed',
			     	text: 'You are receiving this email because you changed your password. \n\n' +
			     	'If you did not request this change, please contact us immediately.'
			     };
			         // Otherwise, send user email confirmation of password change via Mailgun
			    		//   mailgun.sendEmail(resetUser.email, message);

	    		res.json({
	    			success: true,
	    			message: 'Password changed successfully. Please login with your new password.'
	    		});
	    	});
		}catch(error){
			return next(error);
		}

	},

// Get All Customers list
	getCustomer: async (req, res, next)=>{
		try{
			Customer.find(function (err, users) {
				if(err){
					res.json({
						success: false,
						message: 'Something is wrong!'
					});
					return next(err);
				}else if(users == ''){
					res.json({
						success: false,
						message: 'No Customer available!'
					});
				}else{
					res.json({
						success: true,
						userInfo:users
					});   
				}
			});
		}catch(error){
			return next(error);
		}
	},

// Get All Company list
	getCompany: async (req, res, next)=>{
		try{
			Companies.find( function (err, users) {
				if(err){
					res.json({
						success:false,
						message: 'Something is wrong!'
					});
					return next(err);
				}else if(users == ''){
					res.json({
						success:false,
						message: 'No Company available!'
					});
				}else{
					res.json({
						success: true,
						userInfo:users
					});
				}
			});
		}catch(error){
			return next(error);
		}
	},

// Get All Drivers list
	getDrivers: async (req, res, next)=>{
		try{
			Driver.find(function (err, users) {
				if(err){
					res.json({
						success:false,
						message: 'Something is wrong!'
					});
					return next(err);
				}else if(users == ''){
					res.json({
						success:false,
						message: 'No driver available!'
					});
				}else{
					res.json({
						success: true,
						driverInfo:users
					});
				}
			});
		}catch(error){
			return next(error);
		}
	},

// Add And Update Delivery Details
	addAndUpdateDeliveryDetails: async (req, res, next)=>{
		try{
			var lang = req.user.language;
			const user_id = req.user.id; 
			
			const {apartment_no, business_name, address, short_address, zipcode, city, state, delivery_geo_address, delivery_note, type} = req.body;

			var reqData = {};
			if(req.body.user_id !== ''){
				reqData['user_id'] = user_id;
			}
			if(req.body.apartment_no !== ''){
				reqData['apartment_no'] = req.body.apartment_no; 
			}
			if(req.body.business_name !== ''){
				reqData['business_name'] = req.body.business_name;
			}
			if(req.body.address !== ''){
				reqData['address'] = req.body.address;
			}
			if(req.body.short_address !== ''){
				reqData['short_address'] = req.body.short_address;	
			}
			if(req.body.zipcode !== ''){
				reqData['zipcode'] = req.body.zipcode;
			}
			if(req.body.city !== ''){
				reqData['city'] = req.body.city;
			}
			if(req.body.state !== ''){
				reqData['state'] = req.body.state;
			}
			if(req.body.delivery_geo_address !== ''){
				reqData['delivery_geo_address'] = req.body.delivery_geo_address;
			}
			if(req.body.delivery_note !== ''){
				reqData['delivery_note'] = req.body.delivery_note;
			}
			if(req.body.type !== ''){
				reqData['type'] = req.body.type;	
			}

			DeliveryDetails.find({'user_id': user_id},
				function (err, deliveryDetails) {
					if(err){
						res.json({ 
							success:false,
							message: 'Something is wrong!'
						});
					}else if(deliveryDetails == '' || deliveryDetails == null){
					//If User donot have any delivery details 
						const details = new DeliveryDetails({user_id, apartment_no, business_name, address, short_address, zipcode, city, state, delivery_geo_address, delivery_note, type});
							 details.save(function (err, addDeliveryDetails){
							if(err){
								res.json({ 
									success: false,
									message: language(lang, "commonForAll", "error")
								});
								return next(err);
							}else{
								res.json({ 
									success: true,
									message: language(lang, "commonForAll", "add")
								});
							}
						});
					}else{
						DeliveryDetails.findOne({user_id: user_id, type: type},function (err, details) {
							if(err){
								res.json({
									success: false,
									message: language(lang, "commonForAll", "error")
								});
								return next(err);
							}else if(details == '' || details == null){
								const details = new DeliveryDetails({user_id, apartment_no, business_name, address, short_address, zipcode, city, state, delivery_geo_address, delivery_note, type});
								details.save(function (err, addDeliveryDetails){
									if(err){
										res.json({ 
											success: false,
											message: language(lang, "commonForAll", "error")
										});
										return next(err);
									}else{
										res.json({ 
											success: true,
											message: language(lang, "commonForAll", "add")
										});
									}
								});
							}else{
								// User delivery details update according to user_id and type  
								DeliveryDetails.update({user_id: user_id, type: type},{$set: reqData}, function (err, updateDeliveryDetails){
									if(err){
										res.json({ 
											success: false,
											message: language(lang, "commonForAll", "error")
										});
										return next(err);
									}else{
										res.json({ 
											success: true,
											message: language(lang, "commonForAll", "update")
										});
									}
								});
							}
						});
					}  
				});
		}catch(error){
			return next(error);
		}
	},

// Get Delivery Details
	getDeliveryDetails: async (req, res, next)=>{
		try{
			var lang = req.user.language;
			const user_id = req.user.id; 
			 DeliveryDetails.find({'user_id': user_id},
			 	function (err, deliveryDetails) {
					if(err){
			 			res.json({ 
							success:false,
			 				message: language(lang, "commonForAll", "error")
						});
			 		}else{
			 			res.json({ 
			 				success: true,
			 				deliveryDetailsInfo: deliveryDetails
			 			});
					}
			 });
		}catch(error){
			return next(error);
		}
	},

//Update Current Delivery Address
	updateCurrentAddress: async (req, res, next)=>{
		try{
			var lang = req.user.language;
			const user_id = req.user.id; 
			type = req.body.type;
			DeliveryDetails.find({'user_id': user_id},
			 	function (err, deliveryDetails) {
					if(err){
			 			res.json({ 
							success:false,
			 				message: language(lang, "commonForAll", "error")
						});
			 		}else{
			 			var arrayLength = deliveryDetails.length;
			 			for(var i = 0; i < arrayLength; i++){
			 				address_id = deliveryDetails[i]._id;
			 				if(deliveryDetails[i].type == type){
			 				 	 DeliveryDetails.findOneAndUpdate({_id: address_id, type: type}, {status: true}, function(err, details){
									if(err){
										res.json({ 
											success: false,
											message: language(lang, "commonForAll", "error")
										});
									}else{
										res.json({ 
											success: true,
											message: language(lang, "commonForAll", "update")
										});
									}
								});
			 				}else{
		 						DeliveryDetails.update({_id: address_id}, {$set:{status: false}}, function(err, details){
									if(err){
										res.json({ 
											success: false,
											message: language(lang, "commonForAll", "error")
										});
									}
								});
			 				}
			 			}
					}
			});
		}catch(error){
			return next(error);
		}
	},

// Add And Update Language
	addAndUpdateLanguage: async (req, res, next)=>{
		try{
			if(req.user.language){
				var lang = req.user.language;
			}else{
				var lang = "en";
			}
			const user_id = req.user.id;
			var newLang = req.body.lang;
			User.find({'_id': user_id}, function(err, user){
				if(err){
					res.json({
						success: false,
						message: language(lang, "commonForAll", "error")
					});
				}else{
					User.updateOne({_id: user_id}, {$set:{language: newLang}}, function(err, langu){
						if(err){
					
							res.json({
								success: false,
								message: language(lang, "commonForAll", "error")
							});
						}else{
							res.json({ 
								success: true,
								message: language(lang,'commonForAll','update')
							});
						}
					});
				}
			});
		}catch(error){
			return next(error);
		}
	},

// Update Device Token
	updateDeviceToken: async (req, res, next)=>{
		try{
			if(req.query.lang){
				var lang = req.user.lang;
			}else{
				var lang = "en";
			}
			var user_id = req.user.id;
			var deviceToken = req.body.deviceToken;
			var deviceType = req.body.deviceType;

			User.updateOne({_id: user_id}, {$set:{deviceToken, deviceType}}, function(err, user){
				if(err){
					res.json({
						success: false,
						message: language(lang, "commonForAll", "error")
					});
				}else if(user == '' || user == null){
					res.json({ 
						success: true,
						message: language(lang, "commonForAll","error")
					});
				}else{
					res.json({ 
						success: true,
						message: language(lang, "commonForAll","update")
					});
				}
			});	
		}catch(error){
			return next(error);
		}	
	}
}

function language(lang, apiName, message){
	var obj = {
		"en":{ // English
			"commonForAll":{
				"add": "Added successfully",
				"update": "Updated successfully",
				"error": "Something is wrong",
				"empty": "No Data available",
				"delete": "Deleted successfully",
				"exist": "Already exist"
			},
			"updateProfileImage":{
				"required": "Profile image required!"
			},
			"changePassword":{
				"required": "Password required!"
			}
		},
		"fr":{ // French
			"commonForAll":{
				"add": "Ajouter avec succès",
				"update":"Mis à jour avec succés",
				"error": "Quelque chose ne va pas",
				"empty":"Pas de données disponibles",
				"delete": "Supprimé avec succès",
				"exist": "Existe déjà"
			},
			"updateProfileImage":{
				"required": "Image de profil requise!"
			},
			"changePassword":{
				"required": "Mot de passe requis!"
			}
		},
		"es":{ // Spanish
			"commonForAll":{
				"add": "Añadir con éxito",
				"update": "Actualizado exitosamente",
				"error": "Algo está mal",
				"empty": "Datos no disponibles",
				"delete": "Borrado exitosamente",
				"exist": "Ya existe"
			},
			"updateProfileImage":{
				"required": "Imagen de perfil requerida!"
			},
			"changePassword":{
				"required": "Se requiere contraseña!"
			}
			
		},
		"pt":{ // Portuguese
			"commonForAll":{
				"add": "Adicione com sucesso",
				"update":"Atualizado com sucesso",
				"error": "Algo está errado",
				"empty":"Nenhum dado disponível",
				"delete": "Apagado com sucesso",
				"exist": "Já existe"
			},
			"updateProfileImage":{
				"required": "Imagem de perfil necessária!"
			},
			"changePassword":{
				"required": "Senha requerida!"
			}
		},
		"nl":{ // Dutch
			"commonForAll":{
				"add": "Voeg succesvol toe",
				"update":"Succesvol geupdatet",
				"error": "Er is iets fout",
				"empty":"Geen gegevens beschikbaar",
				"delete": "Met succes verwijderd",
				"exist": "Bestaat al"
			},
			"updateProfileImage":{
				"required": "Profielafbeelding vereist!"
			},
			"changePassword":{
				"required": "wachtwoord benodigd!"
			}
		}
	}
	return obj[lang][apiName][message]; 
}


