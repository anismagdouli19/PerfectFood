const JWT = require('jsonwebtoken');
const crypto = require('crypto');
const { JWT_SECRET } = require('../config/index');
const bcrypt = require('bcryptjs');

//Models
const User = require('../models/user');
const Restaurant = require('../models/restaurants');
const Category = require('../models/categories');
const SubCategory = require('../models/subCategories');
const Meal =  require('../models/meals');
const RatingAndReview = require('../models/ratingAndReview');
const Cuisine = require('../models/cuisine');
const Favourite = require('../models/favourites');

var mongoose = require('mongoose');

module.exports = { 

// Update Restaurant
	updateRestaurantt: async (req, res, next)=>{
		try{
			var lang = req.user.language;
			console.log(req.body);
			if(req.body.id){
				const restaurantId = req.body.id;
				updateData = {};
				if(req.body.geo_address){ updateData['geo_address'] = req.body.geo_address;}
				if(req.body.phoneNumber){ updateData['phoneNumber'] = req.body.phoneNumber; }
				if(req.body.address){ updateData['address'] = req.body.address; }
				if(req.body.name){ updateData['name'] = req.body.name; }
				if(req.body.description){ updateData['description'] = req.body.description; }
				if(req.body.website){ updateData['website'] = req.body.website; }
				if(req.body.city){ updateData['city'] = req.body.city; }
				if(req.body.state){ updateData['state'] = req.body.state; }		
				if(req.body.zipcode){ updateData['zipcode'] = req.body.zipcode; }
				if(typeof req.file !== 'undefined'){ updateData['bannerImage'] = req.file.filename; }
				if(req.body.openingTime){ updateData['openingTime'] = req.body.openingTime; }
				if(req.body.closingTime){ updateData['closingTime'] = req.body.closingTime;	}
				if(req.body.cuisins){ updateData['cuisins'] = req.body.cuisins;}
				if(req.body.meal_preparing_time){ updateData['meal_preparing_time'] = req.body.meal_preparing_time;}
				if(req.body.orderQuantity){ updateData['orderQuantity'] = req.body.orderQuantity;}
				if(req.body.slug){ updateData['slug'] = req.body.slug;}    

				Restaurant.updateOne({_id: restaurantId}, { $set: updateData },
				function (err, restaurant) {
					if(err){
						res.json({ 
							success: false, 
							message: language(lang, "commonForAll", "error")
						});
						return next(err);
					}else if(restaurant == '' || restaurant == null){
						res.json({ 
							success: false, 
							message: language(lang, "commonForAll", "error")
						});
					}
					else{
						res.json({ 
							success: true,
							message: language(lang,"commonForAll","update")
						});
					} 
				});
			}else{
				res.json({ 
					success:false,
					message: language(lang, "updateRestaurant", "required")
				});
			}
		}catch(error){
			return next(error);
		}
	},
	
// Accept Restaurant
	acceptRestaurant:  async (req, res, next)=>{
		try{
			console.log(req.body);
			if(req.query.lang){
				var lang = req.user.lang;
			}else{
				var lang = "en";
			}
			var restaurant_email = req.body.email;
			
			const password =  crypto.randomBytes(5).toString('hex');
			const salt = await bcrypt.genSalt(10);
			const passwordHash =  await bcrypt.hash(password, salt);

	  			User.findOneAndUpdate({email:restaurant_email, role:3}, {$set: {password:passwordHash, enableAccount:true}},
				function (err, restaurant) {
					if(err){
						res.json({
							success: false,
							message: language(lang, "commonForAll", "error")
						});
					}else if(restaurant == '' || restaurant == null){
						res.json({ 
							success: false, 
							message: language(lang, "commonForAll", "error")
						});
					}else{
						
						res.json({
							success: true,
							message: language(lang, "commonForAll", "update"),
							password: password

						});
					}
				}); 
		}catch(error){
			return next(error);
		}
	},



// Get All Restaurants list
	getRestaurants: async (req, res, next)=>{
		try{
			if(req.query.lang){
				var lang = req.query.lang;
			}else{
				var lang = "en";
			}

			if(req.query.lng == undefined){
				var lng = -78.8365276;
				var lat = 42.9090868;
			}else{
				var lng = parseFloat(req.query.lng);
				var lat = parseFloat(req.query.lat);
			} 
			
			var pagesize = 10;
			if(req.query.page && req.query.user_id){	// with is favourite
				var page = req.query.page;
				var coustomer_id = req.query.user_id;
				Restaurant.aggregate([{
				    	  	$geoNear: {
						        near: {type: "Point", coordinates: [lng, lat]},
						        distanceField: "distance",
						        maxDistance: 500000,  //Metres
						        spherical: true,
						        key: "geo_address",
						        distanceMultiplier : 0.001, //Km
						    }
						},					
						{
							$lookup:{
								from:'categories',
								localField:'_id',
								foreignField:'restaurant_id',
								as:'category'
							}
						},
						{
	                        $unwind: {
	                            path: "$category",
	                            preserveNullAndEmptyArrays: true
	                        }
	                    },
						{
							$lookup:{
								from:'meals',
								localField:'category._id',
								foreignField:'category_id',
								as:'category.meals'
							}
						},
						{
	                        $lookup: {
	                            from: "ratingandreviews",
	                            localField: "_id",
	                            foreignField: "restaurant_id",
	                            as: "ratingInfo",
	                        }
	                    }, 
	                    {
	                        $unwind: {
	                            path: "$ratingInfo",
	                            preserveNullAndEmptyArrays: true
	                        }
	                    },{	
							$lookup:{
				                from:"favourites",
				                let: {
				                	id: "$_id",
									user_id:mongoose.Types.ObjectId(coustomer_id),
								},
								pipeline: [
									{ 	$match: {
											$expr: 
											{ 
												$and: [
													{ 
														$eq: [ "$user_id", "$$user_id" ] 
													},
													{ 
														$eq: [ "$restaurant_id", "$$id" ] 
													}
												]	 
											}
										} 
									}
								],
								as:"isFavourite"
				            }
						},
	                    {
	                        $unwind: {
	                            path: "$isFavourite",
	                            preserveNullAndEmptyArrays: true
	                        }
	                    },

	                   {
							$group: {
								_id : "$_id",
								name: { $first: "$name" },
								address: { $first: "$address" },
							    email: { $first: "$email" },
							    phoneNumber: { $first: "$phoneNumber" },
							    description: { $first: "$description" },
							    website: { $first: "$website" },
							    zipcode: { $first: "$zipcode" },
							    city: { $first: "$city" }, 
							    state: { $first: "$state" },
							    geo_address:{$first: "$geo_address"},
							    distance:{$first: "$distance"}, 
							    jobDay: { $first: "$jobDay" },
							    openingTime: { $first: "$openingTime" },
							    closingTime: { $first: "$closingTime" },
							    bannerImage: { $first: "$bannerImage" },
							    user_id: { $first: "$user_id" },
							    acceptCash: { $first: "$acceptCash" },
							    onlinePayment:{ $first: "$onlinePayment" },
							    discount: { $first: "$discount" },
							    isFavourite: { $first: "$isFavourite" }, 
							    slug:{ $first: "$slug" }, 
							    meal_preparing_time:{ $first: "$meal_preparing_time" },
							    cuisins:{ $first: "$cuisins" },
							    average_rating: { $avg: "$ratingInfo.rating" },
							    total_reviews   : {
	                                $sum: { 
	                                    $cond: ['$ratingInfo._id', 1, 0]
	                                }
	                            },
	                            mealInfo: { $push: {category: "$category"}},
							}
						},
						{
							$project:{
								_id : 1,
								name: 1,
								address: 1,
							    email: 1,
							    phoneNumber: 1 ,
							    description: 1,
							    website: 1,
							    zipcode: 1,
							    city: 1,
							    state: 1,
							    geo_address: 1,
							    distance: 1,
							    jobDay: 1,
							    openingTime: 1,
							    closingTime: 1,
							    bannerImage: 1,
							    user_id: 1,
							    acceptCash: 1,
							    onlinePayment: 1,
							    discount: 1,
							    isFavourite:{$not: [ { $lt: [ "$isFavourite", 0 ] }]},
							    meal_preparing_time: 1,
							    cuisins: 1,
							    slug:1,
							    average_rating: 1,
							    total_reviews : 1,
	                            mealInfo: 1,
							}
						}
				]).skip(pagesize*(page-1)).limit(pagesize).exec(function (err, restaurants) {
					if(err){
						res.json({ 
							success:false,
							message: language(lang,"commonForAll","error")
						});
						return next(err);
					}else if(restaurants == '' || restaurants == null){
						res.json({ 
							success:false,
							message: language(lang,"commonForAll","empty")
						});
					}else{
						res.json({
							success: true,
							restaurantsInfo:restaurants
						});
					};
			});
			}else if(req.query.page){ 	
				Restaurant.aggregate([{
				    	  	$geoNear: {
						        near: {type: "Point", coordinates: [lng, lat]},
						        distanceField: "distance",
						        maxDistance: 500000,  //Metres
						        spherical: true,
						        key: "geo_address",
						        distanceMultiplier : 0.001, //Km
						    }
						},
						{
							$lookup:{
								from:'categories',
								localField:'_id',
								foreignField:'restaurant_id',
								as:'category'
							}
						},
						{
	                        $unwind: {
	                            path: "$category",
	                            preserveNullAndEmptyArrays: true
	                        }
	                    },
						{
							$lookup:{
								from:'meals',
								localField:'category._id',
								foreignField:'category_id',
								as:'category.meals'
							}
						},
						{
	                        $lookup: {
	                            from: "ratingandreviews",
	                            localField: "_id",
	                            foreignField: "restaurant_id",
	                            as: "ratingInfo",
	                        }
	                    }, 
	                    {
	                        $unwind: {
	                            path: "$ratingInfo",
	                            preserveNullAndEmptyArrays: true
	                        }
	                    },
	                   {
							$group: {
								_id : "$_id",
								name: { $first: "$name" },
								address: { $first: "$address" },
							    email: { $first: "$email" },
							    phoneNumber: { $first: "$phoneNumber" },
							    description: { $first: "$description" },
							    website: { $first: "$website" },
							    zipcode: { $first: "$zipcode" },
							    city: { $first: "$city" }, 
							    state: { $first: "$state" },
							    geo_address:{$first: "$geo_address"}, 
							    distance:{$first: "$distance"}, 
							    jobDay: { $first: "$jobDay" },
							    openingTime: { $first: "$openingTime" },
							    closingTime: { $first: "$closingTime" },
							    bannerImage: { $first: "$bannerImage" },
							    user_id: { $first: "$user_id" },
							    acceptCash: { $first: "$acceptCash" },
							    onlinePayment:{ $first: "$onlinePayment" },
							    discount: { $first: "$discount" },
							    slug:{ $first: "$slug" }, 
							    meal_preparing_time:{ $first: "$meal_preparing_time" },
							    cuisins:{ $first: "$cuisins" },
							    average_rating: { $avg: "$ratingInfo.rating" },
							    total_reviews   : {
	                                $sum: { 
	                                    $cond: ['$ratingInfo._id', 1, 0]
	                                }
	                            },
	                             mealInfo: { $push: {category: "$category"}},	
							}
						}
				]).skip(pagesize*(page-1)).limit(pagesize).exec( function (err, restaurants) {
					if(err){
						res.json({ 
							success:false,
							message: language(lang,"commonForAll","error")
						});
						return next(err);
					}else if(restaurants == '' || restaurants == null){
						res.json({ 
							success:false,
							message: language(lang,"commonForAll","empty")
						});
					}else{

						res.json({
							success: true,
							restaurantsInfo:restaurants
						});
					};
			});
			}else{			// For Admin
				Restaurant.aggregate([
						{
							$lookup:{
								from:'categories',
								localField:'_id',
								foreignField:'restaurant_id',
								as:'category'
							}
						},
						{
	                        $unwind: {
	                            path: "$category",
	                            preserveNullAndEmptyArrays: true
	                        }
	                    },
						{
							$lookup:{
								from:'meals',
								localField:'category._id',
								foreignField:'category_id',
								as:'category.meals'
							}
						},
						{
	                        $lookup: {
	                            from: "ratingandreviews",
	                            localField: "_id",
	                            foreignField: "restaurant_id",
	                            as: "ratingInfo",
	                        }
	                    }, 
	                    {
	                        $unwind: {
	                            path: "$ratingInfo",
	                            preserveNullAndEmptyArrays: true
	                        }
	                    },
	                   {
							$group: {
								_id : "$_id",
								name: { $first: "$name" },
								address: { $first: "$address" },
							    email: { $first: "$email" },
							    phoneNumber: { $first: "$phoneNumber" },
							    description: { $first: "$description" },
							    website: { $first: "$website" },
							    zipcode: { $first: "$zipcode" },
							    city: { $first: "$city" }, 
							    state: { $first: "$state" },
							    geo_address:{$first: "$geo_address"}, 
							    distance:{$first: "$distance"}, 
							    jobDay: { $first: "$jobDay" },
							    openingTime: { $first: "$openingTime" },
							    closingTime: { $first: "$closingTime" },
							    bannerImage: { $first: "$bannerImage" },
							    user_id: { $first: "$user_id" },
							    acceptCash: { $first: "$acceptCash" },
							    onlinePayment:{ $first: "$onlinePayment" },
							    discount: { $first: "$discount" },
							    slug:{ $first: "$slug" }, 
							    meal_preparing_time:{ $first: "$meal_preparing_time" },
							    cuisins:{ $first: "$cuisins" },
							    average_rating: { $avg: "$ratingInfo.rating" },
							    total_reviews   : {
	                                $sum: { 
	                                    $cond: ['$ratingInfo._id', 1, 0]
	                                }
	                            },
	                             mealInfo: { $push: {category: "$category"}},	
							}
						},
						{
							$sort:{
								createdAt:1
							},
						}
				], function (err, restaurants) {
					if(err){
						res.json({ 
							success:false,
							message: language(lang,"commonForAll","error")
						});
						return next(err);
					}else if(restaurants == '' || restaurants == null){
						res.json({ 
							success:false,
							message: language(lang,"commonForAll","empty")
						});
					}else{

						res.json({
							success: true,
							restaurantsInfo:restaurants
						});
					};
			});
			}
		}catch(error){
			return next(error);
		}
	}, 


//Get All Near By Restaurant
	allNearByRestaurant: async (req, res, next)=>{
		try{
			if(req.query.lang){
				var lang = req.query.lang;
			}else{
				var lang = "en";
			}

			if(req.query.lng == undefined){
				var lng = -78.8365276;
				var lat = 42.9090868;
			}else{
				var lng = parseFloat(req.query.lng);
				var lat = parseFloat(req.query.lat);
			} 
			var coustomer_id = req.query.user_id;
			Restaurant.aggregate([{
			    	  	$geoNear: {
					        near: {type: "Point", coordinates: [lng, lat]},
					        distanceField: "distance",
					        maxDistance: 500000,  //Metres
					        spherical: true,
					        key: "geo_address",
					        distanceMultiplier : 0.001, //Km
					    }
					},
					{
						$lookup:{
							from:'categories',
							localField:'_id',
							foreignField:'restaurant_id',
							as:'category'
						}
					},
					{
		                $unwind: {
		                    path: "$category",
		                    preserveNullAndEmptyArrays: true
		                }
		            },
					{
						$lookup:{
							from:'meals',
							localField:'category._id',
							foreignField:'category_id',
							as:'category.meals'
						}
					},
					{
		                $lookup: {
		                    from: "ratingandreviews",
		                    localField: "_id",
		                    foreignField: "restaurant_id",
		                    as: "ratingInfo",
		                }
		            }, 
		            {
		                $unwind: {
		                    path: "$ratingInfo",
		                    preserveNullAndEmptyArrays: true
		                }
		            },{	
						$lookup:{
			                from:"favourites",
			                let: {
			                	id: "$_id",
								user_id:mongoose.Types.ObjectId(coustomer_id),
							},
							pipeline: [
								{ 	$match: {
										$expr: 
										{ 
											$and: [
												{ 
													$eq: [ "$user_id", "$$user_id" ] 
												},
												{ 
													$eq: [ "$restaurant_id", "$$id" ] 
												}
											]	 
										}
									} 
								}
							],
							as:"isFavourite"
			            }
					},
	                {
	                    $unwind: {
	                        path: "$isFavourite",
	                        preserveNullAndEmptyArrays: true
	                    }
	                },
		           {
						$group: {
							_id : "$_id",
							name: { $first: "$name" },
							address: { $first: "$address" },
						    email: { $first: "$email" },
						    phoneNumber: { $first: "$phoneNumber" },
						    description: { $first: "$description" },
						    website: { $first: "$website" },
						    zipcode: { $first: "$zipcode" },
						    city: { $first: "$city" }, 
						    state: { $first: "$state" },
						    geo_address:{$first: "$geo_address"}, 
						    distance:{$first: "$distance"}, 
						    jobDay: { $first: "$jobDay" },
						    openingTime: { $first: "$openingTime" },
						    closingTime: { $first: "$closingTime" },
						    bannerImage: { $first: "$bannerImage" },
						    user_id: { $first: "$user_id" },
						    acceptCash: { $first: "$acceptCash" },
						    onlinePayment:{ $first: "$onlinePayment" },
						    discount: { $first: "$discount" },
						    isFavourite:{$first:"$isFavourite"},
						    slug:{ $first: "$slug" }, 
						    meal_preparing_time:{ $first: "$meal_preparing_time" },
						    cuisins:{ $first: "$cuisins" },
						    average_rating: { $avg: "$ratingInfo.rating" },
						    total_reviews   : {
		                        $sum: { 
		                            $cond: ['$ratingInfo._id', 1, 0]
		                        }
		                    },
		                     mealInfo: { $push: {category: "$category"}},	
						}
					},{
							$project:{
								_id : 1,
								name: 1,
								address: 1,
							    email: 1,
							    phoneNumber: 1 ,
							    description: 1,
							    website: 1,
							    zipcode: 1,
							    city: 1,
							    state: 1,
							    geo_address: 1,
							    distance: 1,
							    jobDay: 1,
							    openingTime: 1,
							    closingTime: 1,
							    bannerImage: 1,
							    user_id: 1,
							    acceptCash: 1,
							    onlinePayment: 1,
							    discount: 1,
							    isFavourite:{$not: [ { $lt: [ "$isFavourite", 0 ] }]},
							    meal_preparing_time: 1,
							    cuisins: 1,
							    slug:1,
							    average_rating: 1,
							    total_reviews : 1,
	                            mealInfo: 1,
							}
						},{
							$sort:{distance:1}
						}
				], function (err, restaurants) {
					if(err){
						res.json({ 
							success:false,
							message: language(lang,"commonForAll","error")
						});
						return next(err);
					}else if(restaurants == '' || restaurants == null){
						res.json({ 
							success:false,
							message: language(lang,"commonForAll","empty")
						});
					}else{
						res.json({
							success: true,
							restaurantsInfo: restaurants
						});
					};
			});
		}catch(error){
			return next(error);
		}
	},


// Get A Restaurant Detail
	restaurantDetail: async (req, res, next)=>{
		try{
			if(req.query.lang){
				var lang = req.query.lang;
			}else{
				var lang = "en";
			}
			var coustomer_id = req.query.user_id;
			if(req.query.id){
				Restaurant.aggregate([{$match:{_id:mongoose.Types.ObjectId(req.query.id)}}, 
						{
							$lookup:{
								from:'categories',
								localField:'_id',
								foreignField:'restaurant_id',
								as:'category'
							}
						},{
	                        $unwind: {
	                            path: "$category",
	                            preserveNullAndEmptyArrays: true
	                        }
	                    },{
							$lookup:{
								from:'meals',
								localField:'category._id',
								foreignField:'category_id',
								as:'category.meals'
							}
						},{
	                        $lookup: {
	                            from: "ratingandreviews",
	                            localField: "_id",
	                            foreignField: "restaurant_id",
	                            as: "ratingInfo",
	                        }
	                    },{
	                        $unwind: {
	                            path: "$ratingInfo",
	                            preserveNullAndEmptyArrays: true
	                        }
	                    }, 
	                    {	
							$lookup:{
				                from:"favourites",
				                let: {
				                	id: "$_id",
									user_id:mongoose.Types.ObjectId(coustomer_id),
								},
								pipeline: [
									{ 	$match: {
											$expr: 
											{ 
												$and: [
													{ 
														$eq: [ "$user_id", "$$user_id" ] 
													},
													{ 
														$eq: [ "$restaurant_id", "$$id" ] 
													}
												]	 
											}
										} 
									}
								],
								as:"isFavourite"
				            }
						},
	                    {
	                        $unwind: {
	                            path: "$isFavourite",
	                            preserveNullAndEmptyArrays: true
	                        }
	                    },{
							$group: {
								_id : "$_id",
								name: { $first: "$name" },
								address: { $first: "$address" },
							    email: { $first: "$email" },
							    phoneNumber: { $first: "$phoneNumber" },
							    description: { $first: "$description" },
							    website: { $first: "$website" },
							    zipcode: { $first: "$zipcode" },
							    city: { $first: "$city" },
							    state: { $first: "$state" },
							    geo_address :{ $first: "$geo_address" }, 
							    jobDay: { $first: "$jobDay" },
							    openingTime: { $first: "$openingTime" },
							    closingTime: { $first: "$closingTime" },
							    bannerImage: { $first: "$bannerImage" },
							    user_id: { $first: "$user_id" },
							    acceptCash: { $first: "$acceptCash" },
							    onlinePayment:{ $first: "$onlinePayment" },
							    discount: { $first: "$discount" },
							    isFavourite: { $first: "$isFavourite" }, 
							    average_rating: { $avg: "$ratingInfo.rating" },
							    slug:{ $first: "$slug" }, 
							    meal_preparing_time:{ $first: "$meal_preparing_time" },
							    cuisins:{ $first: "$cuisins" },
							    total_reviews   : {
	                                $sum: {
	                                    $cond: ['$ratingInfo._id', 1, 0]
	                                }
	                            },	
	                           	mealInfo: { $push: {category: "$category"}},
							}
						},
						{
							$project:{
								_id : 1,
								name: 1,
								address: 1,
							    email: 1,
							    phoneNumber: 1 ,
							    description: 1,
							    website: 1,
							    zipcode: 1,
							    city: 1,
							    state: 1,
							    geo_address: 1,
							    distance: 1,
							    jobDay: 1,
							    openingTime: 1,
							    closingTime: 1,
							    bannerImage: 1,
							    user_id: 1,
							    acceptCash: 1,
							    onlinePayment: 1,
							    discount: 1,
							    isFavourite: {$not: [ { $lt: [ "$isFavourite", 0 ] }]},
							    meal_preparing_time: 1,
							    cuisins: 1,
							    slug:1,
							    average_rating: 1,
							    total_reviews : 1,
	                            mealInfo: 1,
							}
						}			
				],function (err, restaurant) {
					if(err){
						res.json({ 
							success:false,
							message: language(lang,"commonForAll","error") 
						});
						return next(err);
					}else if(restaurant == '' || restaurant == null){
						res.json({
							success:false,
							message: language(lang,"commonForAll","empty")  
						});
					}else{
						res.json({
							success: true,
							restaurantInfo:restaurant
						});
					};
				});
			}else{
				res.json({ 
					success:false,
					message: language(lang,"restaurantDetail","required")
				});
			}
		}catch(error){
			return next(error);
		}	
	}, 

// Add Cuisine
	addCuisine: async (req, res, next)=>{
		try{
			var lang = req.user.language;
			const name = req.data.name;
		
			if(typeof req.file !== 'undefined'){
					 var image = req.file.filename;
			}else{
				 var image = '';
			} 
			found = await Cuisine.findOne({name});
			if(found){
				return res.json({
					success: false,
					message: language(lang,"commonForAll","exist")
				});
			}
			const newCuisine = new Cuisine({name, image});
			newCuisine.save(function (err, cuisine) { 
				if(err){
					res.json({  
						success: false,
						message: language(lang,"commonForAll","error")
					}); 
					return next(err);
				}else if(cuisine == '' || cuisine == null){
					res.json({
						success:false,
						message: language(lang,"commonForAll","empty")  
					});
				}else{
					res.json({ 
						success: true,
						message: language(lang,"commonForAll","add")
					});
				}
			});	
		}catch(error){
			return next(error);
		}		
	},

//Update Cuisine
	updateCuisine: async (req, res, next)=>{
		try{
			var lang = req.user.language;
			const {id, name} = req.data; 
			if(typeof req.file !== 'undefined'){
				var image = req.file.filename;
			}else{
				 var image = '';
			} 
			Cuisine.findOneAndUpdate({_id: id},{name, image},function (err, cuisine){
				if(err){
					res.json({   
						success: false,
						message: language(lang,"commonForAll","error")
					});
				}else if(cuisine == '' || cuisine == null){
						res.json({
							success:false,
							message: language(lang,"commonForAll","empty")  
						});
				}else{
					res.json({ 
						success: true,
						message: language(lang,"commonForAll","update")
					});
				}
			});
		}catch(error){
			return next(error);
		}	
	},

// Get All Cuisine list
	getCuisine: async (req, res, next)=>{
		try{
			if(req.query.lang){
				var lang = req.query.lang;
			}else{
				var lang = "en";
			}
			Cuisine.find(function (err, cuisine) {
				if(err){
					res.json({ 
						success:false,
						message:language(lang,"commonForAll","error")
					});
					return next(err);
				}else if(cuisine == '' || cuisine == null){
					res.json({ 
						success:false,
						message: language(lang,"commonForAll","empty")
					});
				}else{
					res.json({
						success: true,
						cuisineInfo:cuisine
					});
				};
			});
		}catch(error){
			return next(error);
		}		
	},

// Delete Cuisine
	deleteCuisine: async (req, res, next)=>{
		try{
			var lang = req.user.language;
			if(req.query.cuisine_id){
				Cuisine.remove({_id: mongoose.Types.ObjectId(req.query.cuisine_id)}, function(err, cuisine){
					if(err){
						res.json({
							success:false,
							message: language(lang,"commonForAll","error")
						});
					}else{
						res.json({
							success:true,
							message: language(lang,"commonForAll","delete")
						});
					}
				});
			}else{
				res.json({
					success:false,
					message: language(lang,"deleteCuisine","required")
				});
			}
		}catch(error){
			return next(error);
		}	
	},


//Add Category 
	addCategory: async (req, res, next)=>{
		try{
			var lang = req.user.language;
			const user_id = req.user.id;
			const name = req.data.name;
			const restaurant_id = 	req.data.restaurant_id;

			if(typeof req.file !== 'undefined'){
					 var image = req.file.filename;
				}else{
					 var image = '';
				} 
			foundCategory = await Category.findOne({name, restaurant_id});
			if(foundCategory){
				return res.json({
					success: false,
					message: language(lang,"commonForAll","exist")
				});
			}
			const newCategory = new Category({name, image, restaurant_id});
			newCategory.save(function (err, category) { 
				if(err){
					res.json({  
						success: false,
						message: language(lang,"commonForAll","error")
					}); 
					//return next(err);
				}else if(category == '' || category == null){
						res.json({
							success:false,
							message: language(lang,"commonForAll","empty")  
						});
				}else{
					res.json({ 
						success: true,
						message: language(lang,"commonForAll","add")
					});
				}
			});	
		}catch(error){
			return next(error);
		}	
	},

//Update Category
	updateCategory: async (req, res, next)=>{
		try{
			var lang = req.user.language;
			const {id, name} = req.data; 
			if(typeof req.file !== 'undefined'){
				var image = req.file.filename;
			}else{
				 var image = '';
			} 
			Category.findOneAndUpdate({_id: id},{name, image},function (err, category){
				if(err){
					res.json({   
						success: false,
						message: language(lang,"commonForAll","error")
					});
				}else if(category == '' || category == null){
						res.json({
							success:false,
							message: language(lang,"commonForAll","empty")  
						});
				}else{
					res.json({ 
						success: true,
						message: language(lang,"commonForAll","update")
					});
				}
			});
		}catch(error){
			return next(error);
		}	
	},

// Get All Categories list
	getCategories: async (req, res, next)=>{
		try{
			if(req.query.lang){
				var lang = req.query.lang;
			}else{
				var lang = "en";
			}
			var restaurant_id  =  req.query.id;
			Category.find( {restaurant_id} ,function (err, categories) {
				if(err){
					res.json({ 
						success:false,
						message:language(lang,"commonForAll","error")
					});
					return next(err);
				}else if(categories == '' || categories == null){
					res.json({ 
						success:false,
						message: language(lang,"commonForAll","empty")
					});
				}else{
					res.json({
						success: true,
						categoryInfo:categories
					});
				};
			});
		}catch(error){
			return next(error);
		}	
	}, 

//	Delete Category
	deleteCategory: async (req, res, next)=>{
		try{
			var lang = req.user.language;
			if(req.query.category_id){
				Category.remove({_id: mongoose.Types.ObjectId(req.query.category_id)}, function(err, category){
				if(err){
					res.json({
						success:false,
						message: language(lang,"commonForAll","error")
					});
				}
				// Delete Meals
				Meal.remove({category_id: mongoose.Types.ObjectId(req.query.category_id)}, function(err, category){
					if(err){
						res.json({
							success:false,
							message: language(lang,"commonForAll","error")
						});
					}
				});
				res.json({
					success:true,
					message: language(lang,"commonForAll","delete")
				});
			});
			}else{
				res.json({
					success:false,
					message: language(lang,"deleteCategory","required")
				});
			}
		}catch(error){
			return next(error);
		}	
	},

//Add Meal
	addMeal: async (req, res, next)=>{
		try{
			console.log(req.body);
			var lang = req.user.language;
			const {name, category_id, restaurant_id, description, price, size_info, addOn_info, type} = req.body;

			if(typeof req.file !== 'undefined'){
				var meal_image = req.file.filename;
			}else{
				var meal_image = '';
			} 
			foundDish = await Meal.findOne({name, category_id, restaurant_id});
			if(foundDish){
				return res.json({  
					success: false,
					message: language(lang,"commonForAll","exist")
				});
			}
			meal = new Meal({name, category_id, restaurant_id, description, price, size_info, addOn_info, type, meal_image});
			
			meal.save((err, meal) => {
				if(err){
					console.log(err);
					res.json({   
						success: false,
						message: language(lang,"commonForAll","error")
					});
				}else if(meal == '' || meal == null){
					console.log(meal);
					res.json({
						success:false,
						message: language(lang,"commonForAll","error")  
					});
				}else{
					res.json({ 
						success: true,
						message: language(lang,"commonForAll","add")
					});
				}
			});
		}catch(error){
			return next(error);
		}	
	},
 
// Update Meal
	updateMeal: async (req, res, next)=>{
		try{
			var lang = req.user.language;
			const {id, name, category_id, restaurant_id, description, price, size_info, addOn_info, type} = req.body; 
			if(typeof req.file !== 'undefined'){
				var meal_image = req.file.filename;
			}else{
				var meal_image = '';
			}
			Meal.updateOne({_id: id}, {name, category_id, restaurant_id, description, price, size_info, addOn_info, type, meal_image}, function(err, meal){
				if(err){
					res.json({   
						success: false,
						message: language(lang,"commonForAll","error")
					});
				}else if(meal == '' || meal == null){
					res.json({
						success:false,
						message: language(lang,"commonForAll","error")  
					});
				}else{
					res.json({ 
						success: true,
						message:  language(lang,"commonForAll","update")
					});
				}
			});
		}catch(error){
			return next(error);
		}	
	},
 
// Get All Meals list
	getMeals: async (req, res, next)=>{
		try{
			if(req.query.lang){
				var lang = req.query.lang;
			}else{
				var lang = "en";
			}
			if(req.query.restaurant_id){
				Meal.aggregate([{$match:{restaurant_id:mongoose.Types.ObjectId(req.query.restaurant_id)}},{
						$lookup:{
							from:'categories',
							localField:'category_id',
							foreignField:'_id',
							as:'categoryInfo',
						}
					},
					{
						$unwind: "$categoryInfo"
					},
					{
						$group: {
							_id : "$_id",
							meal_name: { $first: "$name" },
							meal_description: { $first: "$description" },
							meal_price: { $first: "$price" },
							meal_image: { $first: "$meal_image" },
							type: { $first: "$type" },
							size_info: { $first: "$size_info" },
							addOn_info: { $first: "$addOn_info" },
							category_id: { $first: "$categoryInfo._id"},
							category_name: { $first: "$categoryInfo.name" },
							category_image: { $first: "$categoryInfo.image" },
						}
					}
				], function (err, meal){
					if(err){
						res.json({
							success:false,
							message: language(lang,"commonForAll","error")
						});
						return next(err);
					}else if(meal == '' || meal == null){
						res.json({
							success:false,
							message: language(lang,"commonForAll","empty")  
						});
					}else{
						res.json({
							success: true,
							mealInfo:meal
						});
					};
				});
			}else{
				res.json({
					success:false,
					message: language(lang,"getMeals","required")
				});
			}
		}catch(error){
			return next(error);
		}	
	}, 

// Get Meal Detail  
	getMealDetail: async (req, res, next)=>{
		try{
			if(req.query.lang){
				var lang = req.query.lang;
			}else{
				var lang = "en";
			}
			if(req.query.id){
				Meal.aggregate([{$match:{_id:mongoose.Types.ObjectId(req.query.id)}},{
						$lookup:{
							from:'categories',
							localField:'category_id',
							foreignField:'_id',
							as:'categoryInfo',
						}
					}
			 ],function (err, meal){
					if(err){
						res.json({
							success:false,
							message: language(lang,"commonForAll","error")
						});
					}else if(meal == '' || meal == null){
						res.json({
							success:false,
							message: language(lang,"commonForAll","error")  
						});
					}else{
						res.json({
							success: true,
							mealInfo:meal
						});
					}
				});
			}else{
				res.json({
					success:false,
					message: language(lang,"getMealDetail","required")
				});
			}
		}catch(error){
			return next(error);
		}	
	},

//	Delete Meal
	deleteMeal: async (req, res, next)=>{
		try{
			var lang = req.user.language;
			if(req.query.meal_id){
			Meal.remove({_id: mongoose.Types.ObjectId(req.query.meal_id)}, function(err, meal){
				if(err){
					res.json({
						success:false,
						message: language(lang,"commonForAll","error")
					});
				}else{
					res.json({
						success:true,
						message: language(lang,"commonForAll","delete")
					});
				} 
			});
			}else{
				res.json({
					success:false,
					message: language(lang,"deleteMeal","required")
				});
			}
		}catch(error){
			return next(error);
		}	
	},

//	Rating And Review
	addRating:async (req, res, next)=>{
		try{
			var lang = req.user.language;
			const ratingBy= req.user.id;
			const restaurant_id = req.body.restaurant_id;
			const rating = req.body.rating;
			const review = req.body.review;
			RatingAndReview.findOne({restaurant_id,ratingBy}, function(err, data){
				if(data){
					RatingAndReview.findOneAndUpdate({_id: data._id}, {rating, review}, function(err, data){
						if(err){
							res.json({ 
								success: false,
								message: language(lang,"commonForAll","error")
							});
						}
						res.json({ 
							success: true,
							message: language(lang,"commonForAll","update")
						});
					});
				}else{
					const ratingAndReview = new RatingAndReview({ratingBy, restaurant_id, rating, review});
					ratingAndReview.save(function (err, data) { 
						if(err){
							res.json({ 
								success: false,
								message: language(lang,"commonForAll","error")
							});
							return next(err);
						}
						res.json({ 
							success: true,
							message: language(lang,"commonForAll","add")
						});
					});	
				}
			});
		}catch(error){
			return next(error);
		}	
	},

// Get Rating And Review 
	getRatingAndReviews: async (req, res, next)=>{
		try{
			if(req.query.lang){
				var lang = req.query.lang;
			}else{
				var lang = "en";
			}
			if(req.query.restaurant_id){
				const restaurant_id = req.query.restaurant_id
				RatingAndReview.find({restaurant_id}, function (err, rating){
					if(err){
						res.json({
							success:false,
							message: language(lang,"commonForAll","error")
						});
						return next(err);
					}else{
						res.json({
							success: true,
							ratingAndReviewInfo:rating 
						});
					};
				});
			}else{
				res.json({
					success:false,
					message: language(lang,"getRatingAndReviews","required")
				});
			}
		}catch(error){
			return next(error);
		}	
	}, 

// Restaurant Filter
	restaurant_filter: async(req, res, next)=>{
		try{
			var keyword = req.query.keyword;
			var lng = parseFloat(req.query.lng);
			var lat = parseFloat(req.query.lat);
			var lang ="en";
			var data  = {
				"quickest":{meal_preparing_time:1},
				"nearest":{distance:1},
				"newInFoodride":{createdAt:1},
				"rating":{average_rating:0},
				"mostPopular":{average_rating:1},
			}
			const coustomer_id = req.query.user_id;	
			Restaurant.aggregate([{
				$geoNear: {
					near: {type: "Point", coordinates: [lng, lat]},
							distanceField: "distance",
					        maxDistance: 500000,  //Metres
					        spherical: true,
					        key: "geo_address",
					        distanceMultiplier : 0.001, //Km
					    }
					},
					{
						$lookup:{
							from:'categories',
							localField:'_id',
							foreignField:'restaurant_id',
							as:'category'
						}
					},
					{
						$unwind: {
							path: "$category",
							preserveNullAndEmptyArrays: true
						}
					},
					{
						$lookup:{
							from:'meals',
							localField:'category._id',
							foreignField:'category_id',
							as:'category.meals'
						}
					},
					{
						$lookup: {
							from: "ratingandreviews",
							localField: "_id",
							foreignField: "restaurant_id",
							as: "ratingInfo",
						}
					}, 
					{
						$unwind: {
							path: "$ratingInfo",
							preserveNullAndEmptyArrays: true
						}
					},
					{	
							$lookup:{
				                from:"favourites",
				                let: {
				                	id: "$_id",
									user_id:mongoose.Types.ObjectId(coustomer_id),
								},
								pipeline: [
									{ 	$match: {
											$expr: 
											{ 
												$and: [
													{ 
														$eq: [ "$user_id", "$$user_id" ] 
													},
													{ 
														$eq: [ "$restaurant_id", "$$id" ] 
													}
												]	 
											}
										} 
									}
								],
								as:"isFavourite"
				            }
						},
	                    {
	                        $unwind: {
	                            path: "$isFavourite",
	                            preserveNullAndEmptyArrays: true
	                        }
	                    },
	                   {
							$group: {
								_id : "$_id",
								name: { $first: "$name" },
								address: { $first: "$address" },
							    email: { $first: "$email" },
							    phoneNumber: { $first: "$phoneNumber" },
							    description: { $first: "$description" },
							    website: { $first: "$website" },
							    zipcode: { $first: "$zipcode" },
							    city: { $first: "$city" }, 
							    state: { $first: "$state" },
							    geo_address:{$first: "$geo_address"},
							    distance:{$first: "$distance"}, 
							    jobDay: { $first: "$jobDay" },
							    openingTime: { $first: "$openingTime" },
							    closingTime: { $first: "$closingTime" },
							    bannerImage: { $first: "$bannerImage" },
							    user_id: { $first: "$user_id" },
							    acceptCash: { $first: "$acceptCash" },
							    onlinePayment:{ $first: "$onlinePayment" },
							    discount: { $first: "$discount" },
							    isFavourite: { $first: "$isFavourite" }, 
							    slug:{ $first: "$slug" }, 
							    meal_preparing_time:{ $first: "$meal_preparing_time" },
							    cuisins:{ $first: "$cuisins" },
							    average_rating: { $avg: "$ratingInfo.rating" },
							    total_reviews   : {
	                                $sum: { 
	                                    $cond: ['$ratingInfo._id', 1, 0]
	                                }
	                            },
	                            mealInfo: { $push: {category: "$category"}},
							}
						},
						{
							$project:{
								_id : 1,
								name: 1,
								address: 1,
							    email: 1,
							    phoneNumber: 1 ,
							    description: 1,
							    website: 1,
							    zipcode: 1,
							    city: 1,
							    state: 1,
							    geo_address: 1,
							    distance: 1,
							    jobDay: 1,
							    openingTime: 1,
							    closingTime: 1,
							    bannerImage: 1,
							    user_id: 1,
							    acceptCash: 1,
							    onlinePayment: 1,
							    discount: 1,
							    isFavourite:{$not: [ { $lt: [ "$isFavourite", 0 ] }]},
							    meal_preparing_time: 1,
							    cuisins: 1,
							    slug:1,
							    average_rating: 1,
							    total_reviews : 1,
	                            mealInfo: 1,
							}
						},	
					{
						$sort:data[keyword]
					}
					], function (err, restaurants) {
						if(err){
							res.json({ 
								success:false,
								message: language(lang,"commonForAll","error")
							});
							return next(err);
						}else if(restaurants == '' || restaurants == null){
							res.json({ 
								success:false,
								message: language(lang,"commonForAll","empty")
							});
						}else{

							res.json({
								success: true,
								restaurantsInfo:restaurants
							});
						};
					});
		}catch(error){
			return next(error);
		}	
	}, 


// Search According To Restaurant Name, Cuisines and Meals Name
	searching: async(req, res, next)=>{
		try{
			var keyword = req.query.keyword;
			var lng = parseFloat(req.query.lng);
			var lat = parseFloat(req.query.lat);
			var lang ="en";
			Restaurant.aggregate([{
				$geoNear: {
						near: {type: "Point", coordinates: [lng, lat]},
						distanceField: "distance",
				        maxDistance: 500000,  //Metres
				        spherical: true,
				        key: "geo_address",
				        distanceMultiplier : 0.001, //KM
				    }
				},{
					$lookup:{
						from:'categories',
						localField:'_id',
						foreignField:'restaurant_id',
						as:'category'
					}
				},{
					$unwind: {
						path: "$category",
						preserveNullAndEmptyArrays: true
					}
				},{
					$lookup:{
						from:'meals',
						localField:'category._id',
						foreignField:'category_id',
						as:'category.meals'
					}
				},{
					$lookup: {
						from: "ratingandreviews",
						localField: "_id",
						foreignField: "restaurant_id",
						as: "ratingInfo",
					}
				},{
					$unwind: { 
						path: "$ratingInfo",
						preserveNullAndEmptyArrays: true
					}
				},
				{		// Search According To Restaurant Name, Cuisine and Meals Name
					$match: {
						$or:[
							{ 'name': { '$regex': keyword } },
							{ 'cuisins': { '$regex': keyword }},
							{ 'category.meals.name': { '$regex': keyword } }
						]
					}
				},{
					$group: {
						_id : "$_id",
						name: { $first: "$name" },
						address: { $first: "$address" },
						email: { $first: "$email" },
						phoneNumber: { $first: "$phoneNumber" },
						description: { $first: "$description" },
						website: { $first: "$website" },
						zipcode: { $first: "$zipcode" },
						city: { $first: "$city" }, 
						state: { $first: "$state" },
						geo_address:{$first: "$geo_address"},
						distance:{$first: "$distance"}, 
						jobDay: { $first: "$jobDay" },
						openingTime: { $first: "$openingTime" },
						closingTime: { $first: "$closingTime" },
						bannerImage: { $first: "$bannerImage" },
						user_id: { $first: "$user_id" },
						acceptCash: { $first: "$acceptCash" },
						onlinePayment:{ $first: "$onlinePayment" },
						discount: { $first: "$discount" },
						slug:{ $first: "$slug" }, 
						meal_preparing_time:{ $first: "$meal_preparing_time" },
						cuisins:{ $first: "$cuisins" },
						average_rating: { $avg: "$ratingInfo.rating" },
						total_reviews   : {
							$sum: { 
								$cond: ['$ratingInfo._id', 1, 0]
							}
						},
						mealInfo: { $push: {category: "$category"}},	
					}
				},{
					$sort:{
						distance:1
					},
				}
				], function (err, restaurants) {
					if(err){
						res.json({ 
							success:false,
							message: language(lang,"commonForAll","error")
						});
						return next(err);
					}else if(restaurants == '' || restaurants == null){
						res.json({ 
							success:false,
							message: language(lang,"commonForAll","empty")
						});
					}else{

						res.json({
							success: true,
							restaurantsInfo:restaurants
						});
					};
				});
		}catch(error){
			return next(error);
		}	
	},

// Add and Remove Favourite Restaurant
	favourite: async(req, res, next)=>{
		try{
			var lang = req.user.language;
			var user_id = req.user.id;
			var restaurant_id = req.body.restaurant_id;
			Favourite.findOne({user_id, restaurant_id}, function (err, favourite) {
				if(err){
					res.json({ 
						success:false,
						message:language(lang,"commonForAll","error")
					});
				}else if(favourite == '' || favourite == null){		// Add Favourite
					favourite = new Favourite({user_id, restaurant_id});
					favourite.save((err, favourite) => {
						if(err){
							res.json({   
								success: false,
								message: language(lang,"commonForAll","error")
							});
						}else if(favourite == '' || favourite == null){
							res.json({
								success:false,
								message: language(lang,"commonForAll","error")  
							});
						}else{
							res.json({
								success: true,
								isFavourite: true,
								message: language(lang,"commonForAll","add")
							});
						}
					});
				}else{		// UnFavourite
					Favourite.remove({user_id: mongoose.Types.ObjectId(user_id),restaurant_id: mongoose.Types.ObjectId(restaurant_id)}, function(err, cuisine){
						if(err){
							res.json({
								success:false,
								message: language(lang,"commonForAll","error")
							});
						}else{
							res.json({
								success:true,
								isFavourite: false,
								message: language(lang,"unfavourite","remove")
							});
						}
					});
				};
			});	
		}catch(error){
			return next(error);
		}		
	},

// Get Favourite Restaurant
	getFavourite: async(req, res, next)=>{
		try{
			var lang = req.user.language;
			var user_id = req.user.id;
			Favourite.aggregate([{
					$match:{
						'user_id': mongoose.Types.ObjectId(user_id)		
					}
				},
				{
					$lookup:{
						from:'restaurants',
						localField:'restaurant_id',
						foreignField:'_id',
						as:'restaurantInfo'
					}
				},
				{
					$unwind: {
						path: "$restaurantInfo",
						preserveNullAndEmptyArrays: true
					}
				},
				{
					$group: {
						_id : "$_id",
						restaurantInfo: { $first: "$restaurantInfo" },
						
					}
				},
				],function (err, favourite) {
				if(err){
					res.json({ 
						success:false,
						message:language(lang,"commonForAll","error")
					});
				}else if(favourite == '' || favourite == null){
					res.json({ 
						success:false,
						message: language(lang,"commonForAll","empty")
					});
				}else{
					res.json({
						success: true,
						favouriteInfo:favourite
					});
				};
			});
		}catch(error){
			return next(error);
		}	
	},

// Unapprove Restaurants
	unapproveRestaurants: async(req, res, next)=>{
		try{
		if(req.query.lang){
			var lang = req.query.lang;
		}else{
			var lang = "en";
		}

		Restaurant.aggregate([
				{
					$lookup:{
						from:'users',
						localField:'user_id',
						foreignField:'_id',
						as:'userInfo'
					}
				},
				{
					$match:{
						"userInfo.role":3,
						"userInfo.enableAccount": false		
					}
				},{
					$group:{
						_id : "$_id",
						name: { $first: "$name" },
						address: { $first: "$address" },
						email: { $first: "$email" },
						phoneNumber: { $first: "$phoneNumber" },
						description: { $first: "$description" },
						website: { $first: "$website" },
						zipcode: { $first: "$zipcode" },
						city: { $first: "$city" }, 
						state: { $first: "$state" },
						geo_address:{$first: "$geo_address"},
						distance:{$first: "$distance"}, 
						jobDay: { $first: "$jobDay" },
						openingTime: { $first: "$openingTime" },
						closingTime: { $first: "$closingTime" },
						bannerImage: { $first: "$bannerImage" },
						user_id: { $first: "$user_id" },
						acceptCash: { $first: "$acceptCash" },
						onlinePayment:{ $first: "$onlinePayment" },
						discount: { $first: "$discount" },
						slug:{ $first: "$slug" }, 
						meal_preparing_time:{ $first: "$meal_preparing_time" },
						cuisins:{ $first: "$cuisins" },
						average_rating: { $avg: "$ratingInfo.rating" },
					}
				}
				
				],function (err, restaurant) {
				if(err){
					console.log(err);
					res.json({ 
						success:false,
						message:language(lang,"commonForAll","error")
					});
				}else if(restaurant == '' || restaurant == null){
					res.json({ 
						success:false,
						message: language(lang,"commonForAll","empty")
					});
				}else{
					res.json({
						success: true,
						restaurant_info:restaurant
					});
				};
			});
		}catch(error){
			return next(error);
		}	
	},

// Remove Restaurants
	removeRestaurants: async(req, res, next)=>{
		try{
		const id = req.query.id;
		const lang = "en";

		Restaurant.findOne({_id: mongoose.Types.ObjectId(id)}, function(err, restaurant){
			if(err){
				res.json({
					success:false,
					message: language(lang,"commonForAll","error")
				});
			}else{
				var user_id = restaurant.user_id;
				User.findOneAndRemove({_id: mongoose.Types.ObjectId(user_id)}, function(err, user){
					if(err){
						res.json({
							success:false,
							message: language(lang,"commonForAll","error")
						});
					}else if(restaurant == '' || restaurant == null){
						res.json({ 
							success:false,
							message: language(lang,"commonForAll","error")
						});
					}else{ 
						Restaurant.findOneAndRemove({_id: mongoose.Types.ObjectId(id)}, function(err, restaurant){
							if(err){
								res.json({
									success:false,
									message: language(lang,"commonForAll","error")
								});
							}else{
								res.json({
									success:false,
									message: language(lang,"commonForAll","delete")
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


	getNearestRestaurants: async(req, res, next)=>{
		//console.log("hello");
		// var lat = 31.3442052;
		// var lng = 75.583004;
		var lat = req.query.lat;
		var lng = req.query.lng;

		//31.3442052,75.583004, Doaba chonk
		
  		var point = { type : "Point", coordinates : [lng, lat] };

  		Restaurant.aggregate([
	        {
        	  	$geoNear: {
			        near: {type: "Point", coordinates: [lng, lat]},
			        distanceField: "distance",
			        maxDistance: 50000,  //Metres
			        spherical: true,
			        key: "geo_address",
			        distanceMultiplier : 0.001, //Km
			    }
			}], function (err, restaurant) {
				if(err){
					console.log(err); 
					res.json({
						success:false,
						//message: language(lang,"commonForAll","error")
					});
					return next(err);
				}else{
					res.json({
						success: true,
						restaurant_info:restaurant
					});
				};
			});
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
			"updateRestaurant":{
				"required": "Restaurant Id required"
			},
			"restaurantDetail":{
				"required": "Restaurant Id required"
			},
			"deleteSubCategory":{
				"required": "SubCategory Id required"
			},
			"getMeals":{
				"required": "Restaurant Id required"
			},
			"getMealDetail":{
				"required": "Meal Id required"
			},
			"deleteMeal":{
				"required": "Meal Id required"
			},
			"deleteAddOn":{
				"required": "AddOn Id required"
			},
			"deleteCuisine":{
				"required": "Cuisine Id required"
			},
			"unfavourite":{
				"remove": "Unfavourite successfully",
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
			"updateRestaurant":{
				"required": "Identifiant du restaurant requis"
			},
			"restaurantDetail":{
				"required": "Identifiant du restaurant requis"
			},
			"deleteSubCategory":{
				"required": "Identifiant de sous-catégorie requis"
			},
			"getMeals":{
				"required": "Identifiant du restaurant requis"
			},
			"getMealDetail":{
				"required": "Identifiant de repas requis"
			},
			"deleteMeal":{
				"required": "Identifiant de repas requis"
			},
			"deleteAddOn":{
				"required": "Repas Add On Id requis"
			},
			"unfavourite":{
				"remove": "Désavantage avec succès",
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
			"updateRestaurant":{
				"required": "Identificación del restaurante requerida"
			},
			"restaurantDetail":{
				"required": "Identificación del restaurante requerida"
			},
			"deleteSubCategory":{
				"required": "Identificación de subcategoría requerida"
			},
			"getMeals":{
				"required": "Identificación del restaurante requerida"
			},
			"getMealDetail":{
				"required": "Identificación de comida requerida"
			},
			"deleteMeal":{
				"required": "Identificación de comida requerida"
			},
			"deleteAddOn":{
				"required": "AddOn Id requerido"
			},
			"unfavourite":{
				"remove": "Desaparecer con éxito",
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
			"updateRestaurant":{
				"required": "ID do restaurante obrigatório"
			},
			"restaurantDetail":{
				"required": "ID do restaurante obrigatório"
			},
			"deleteSubCategory":{
				"required": "ID da subcategoria obrigatório"
			},
			"getMeals":{
				"required": "ID do restaurante obrigatório"
			},
			"getMealDetail":{
				"required": "Id de refeição obrigatório"
			},
			"deleteMeal":{
				"required": "Id de refeição obrigatório"
			},
			"deleteAddOn":{
				"required": "AddOn Id obrigatório"
			},
			"unfavourite":{
				"remove": "Desfavorecer com sucesso",
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
			"updateRestaurant":{
				"required": "Restaurant-ID vereist"
			},
			"restaurantDetail":{
				"required": "Restaurant-ID vereist"
			},
			"deleteSubCategory":{
				"required": "SubCategory-ID vereist"
			},
			"getMeals":{
				"required": "Restaurant-ID vereist"
			},
			"getMealDetail":{
				"required": "Maaltijd-ID vereist"
			},
			"deleteMeal":{
				"required": "Maaltijd-ID vereist"
			},
			"deleteAddOn":{
				"required": "AddOn-ID vereist"
			},
			"unfavourite":{
				"remove": "Niet succesvol met succes",
			}
		}
	}
	return obj[lang][apiName][message]; 
}