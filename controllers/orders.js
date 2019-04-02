const JWT = require('jsonwebtoken');
const crypto = require('crypto');
const { JWT_SECRET } = require('../config/index');
const bcrypt = require('bcryptjs');
//Models
const User = require('../models/user');
const Restaurant = require('../models/restaurants');
const Meal =  require('../models/meals');
const Order = require('../models/orders');
const RatingAndReview = require('../models/ratingAndReview');
const Cart = require('../models/cart');
const Driver = require('../models/drivers');
const Company = require('../models/companies');
const OrderMessages = require('../models/orderMessages');
const Customer = require('../models/customers');

var mongoose = require('mongoose');
const commonFunction = require('../helpers/function');


module.exports = { 

// Add And Update Cart
	addAndUpdateCart: async (req, res, next)=>{
		try{
			var lang = req.user.language;
			const user_id = req.user.id;
			const {restaurant_id, meal_info, meal_note, total} = req.body;
			Cart.findOne({user_id, status:'Pending'}, function (err, cart) {
				if(err){
					res.json({ 
						success:false,
						message: language(lang, "commonForAll", "error")
					});
				}else if(cart == '' || cart == null){ // new cart
		      		const newCart = new Cart({user_id, restaurant_id, meal_info, meal_note, total});
					newCart.save(function (err, cartAdd) { 
						if(err){
							res.json({
								success: false,
								message: language(lang, "commonForAll", "error")
							}); 
							return next(err);
						}else{
							res.json({ 
								success: true,
								message: language(lang, "addAndUpdateCart", "add")
							});
						}
					});	
				}else{
					var cart_id = cart._id
					Cart.updateOne({_id : cart_id}, {$set: {restaurant_id, meal_info, meal_note, total}}, function (err, cart) {
						if(err){
							res.json({ 
								success:false,
								message: language(lang, "commonForAll", "error")
							});
						}else{
							res.json({
								success: true,
								message: language(lang, "commonForAll", "update")
							});
						}
					});
				}
			});
		}catch(error){
			return next(error);
		}
	},

// Get Cart
	getCart: async (req, res, next)=>{
		try{
			var lang = req.user.language;
			const user_id = req.user.id;
			Cart.aggregate([{$match:{user_id:mongoose.Types.ObjectId(user_id), status:'Pending'}},
					{
						$lookup:{
							from:'restaurants',
							localField:'restaurant_id',
							foreignField:'_id',
							as:'restaurant_info',
						}
					}
			], function (err, cart) {
				if(err){
					res.json({ 
						success:false,
						message: language(lang, "commonForAll", "error") 
					});
				}else if(cart == '' || cart == null){
					res.json({ 
						success: false,
						message: language(lang, "commonForAll", "empty")
					});
				}else{
					res.json({
						success: true,
						cartInfo: cart
					});
				}
			});
		}catch(error){
			return next(error);
		}
	}, 
 
// Delete Cart 
	deteleCart:async (req, res, next)=>{
		try{
			var lang = req.user.language;
			const user_id = req.user.id;
			Cart.remove({user_id, status:'Pending'}, function (err, cart) {
				if(err){
					res.json({ 
						success:false,
						message: language(lang, "commonForAll", "error")
					});
				}else{
					res.json({
						success:false,
						message: language(lang, "commonForAll", "delete")
					});
				}
			});
		}catch(error){
			return next(error);
		}
	},

// Place Order
	placeOrder:async (req, res, next)=>{
		try{  
			var lang = req.user.language;  
			const user_id = req.user.id;
			const {restaurant_id, meal_info, total, delivery_apartment, delivery_address, delivery_geo_address,  delivery_note, order_note, delivery_fee} = req.body;
			Restaurant.findOne({_id: restaurant_id}, function (err, restaurant){
				if(err){
					res.json({   
						success: false,
						message: language(lang,"commonForAll","error")
					});
				}else if(restaurant == '' || restaurant == null){
					res.json({
						success:false,
						message: language(lang,"commonForAll","error")  
					});
				}else{
					Order.count({restaurant_id, status: { "$in":['Waiting', 'Accepted', 'Cooking', 'Packing', 'Ready', 'Waiting For Driver']}}, function (err, order){
						if(err){
							res.json({   
								success: false,
								message: language(lang,"commonForAll","error")
							});
						}else{
							if(restaurant.orderQuantity > order){	// Check one time order limit
								order = new Order({user_id, restaurant_id, meal_info, total, delivery_apartment, delivery_address, delivery_geo_address, delivery_note, order_note, delivery_fee}); 
								order.save((err, order) => {
									if(err){
										res.json({   
											success: false,
											message: language(lang, "commonForAll", "error")
										});
									}else{
										var user_id = restaurant.user_id
										var data ={};
										data['title'] = 'New order receive';
										data['order_id'] = order._id;
										// Notification 
										commonFunction.notification(data, user_id);
										res.json({
											success: true,
											message: language(lang, "placeOrder", "success"),
											order_id: order._id
										});
									}
								});
							}else{
								res.json({
									success:false,
									message: "Restaurant One Time Order Limit is Completed"
								});
							}
						}
					});
				}
			});
		}catch(error){
			return next(error);
		}
	},

	

// Get Order Acourding to Customer / Restaurant
	getOrder: async (req, res, next)=>{
		try{
			var lang = req.user.language; 
			const user_id = req.user.id;
			var keyword =  req.query.keyword;

			if(req.user.role == 1){
				var data2  = {
					"history": {status: {"$in":['Deliverd', 'Rejected']}},
					"upcoming": {status: { "$in":['Waiting', 'Accepted', 'Cooking', 'Packing', 'Ready', 'Waiting For Driver', 'On The Way']}}
				}
			await Order.aggregate([{ 
					$match: { 
						$and: [
							{ user_id:mongoose.Types.ObjectId(user_id) },
							data2[keyword]	// Oder Filter 
						]
					}
				},{
					$lookup:{  
						from:'restaurants',
						localField:'restaurant_id',
						foreignField:'_id',
						as:'restaurant'
					}
				},{
					$unwind: {
						path: "$restaurant",
						preserveNullAndEmptyArrays: true
					}
				},{
					$lookup:{  
						from:'drivers',
						localField:'driver_id',
						foreignField:'_id',
						as:'driver_info'
					}
				},{
					$unwind: {
						path: "$driver_info",
						preserveNullAndEmptyArrays: true
					}
				},{
					$sort: { 
						"createdAt": -1
					}
				}
				],function (err, order) {
				if(err){
					res.json({
						success:false,
						message: language(lang, "commonForAll", "error")
					});  
				}else if(order == '' || order == null){
					res.json({ 
						success: false,
						message: language(lang, "commonForAll", "empty")
					});
				}else{
					res.json({
						success: true,
						orderInfo: order
					});
				}
			});
			}else if(req.user.role == 3){
				var data  = {
					"allOrder": {status: { "$in":['Waiting', 'Accepted', 'Cooking', 'Packing', 'Ready', 'Waiting For Driver', 'On The Way', 'Deliverd','Rejected']}},
					"newOrder": {status: 'Waiting'},
					"history": {status: {"$in":['Deliverd', 'Rejected']}},
					"upcoming": {status: { "$in":['Waiting', 'Accepted', 'Cooking', 'Packing', 'Ready', 'Waiting For Driver', 'On The Way']}}
				};

				Restaurant.find({user_id:user_id}, function (err, restaurant) {
					if(err){
						res.json({ 
							success:false,
							message: language(lang, "commonForAll", "error")
						});
					}else{
						var arrayLength = restaurant.length;
				 		for(var i = 0; i < arrayLength; i++){
				 			restaurant_id = restaurant[i]._id;
				 			 console.log(restaurant_id);
				 			 Order.aggregate([{
									$match: { 
										$and: [
											{restaurant_id:mongoose.Types.ObjectId(restaurant_id)},
											data[keyword]	// Oder Filter 
										]
									}
								}
								,{
									$lookup:{  
										from:'drivers',
										localField:'driver_id',
										foreignField:'_id',
										as:'driver_info'
									}
								},{
									$unwind: {
										path: "$driver_info",
										preserveNullAndEmptyArrays: true
									}
								},{
									$sort: { 
										"createdAt": -1
									}
								}
								],function (err, order) {
									if(err){
										res.json({
											success:false,
											message: language(lang, "commonForAll", "error")
										});  
									}else if(order == '' || order == null){
										res.json({ 
											success: false,
											message: language(lang, "commonForAll", "empty")
										});
									}else{
										res.json({
											success: true,
											orderInfo: order
										});
									}
							});
						}
					}
				});
			}
		}catch(error){
			return next(error);
		}
	}, 

// Get Single Order
	getSingleOrder:async (req, res, next)=>{
		try{
			var lang = req.user.language;
			//const user_id = req.user.id;
			const order_id = req.query.order_id;

			await Order.aggregate([{
					$match: {
						$and:[
							{_id:mongoose.Types.ObjectId(order_id)}
						]}
				},{
					$lookup:{  
						from:'customers',
						localField:'user_id', 
						foreignField:'user_id',
						as:'customer_info'
					}
				},{
					$unwind: {
						path: "$customer_info",
						preserveNullAndEmptyArrays: true
					}
				},{
					$lookup:{  
						from:'restaurants',
						localField:'restaurant_id',
						foreignField:'_id',
						as:'restaurant_info'
					}
				},{
					$unwind: {
						path: "$restaurant",
						preserveNullAndEmptyArrays: true
					}
				},{
					$lookup:{  
						from:'drivers',
						localField:'driver_id',
						foreignField:'_id',
						as:'driver_info'
					}
				},{
					$unwind: {
						path: "$driver_info",
						preserveNullAndEmptyArrays: true
					}
				}
				],function (err, order) {
				if(err){
					res.json({
						success:false,
						message: language(lang, "commonForAll", "error")
					});  
				}else if(order == '' || order == null){
					res.json({ 
						success: false,
						message: language(lang, "commonForAll", "empty")
					});
				}else{
					res.json({
						success: true,
						orderInfo: order
					});
				}
			});
		}catch(error){
			return next(error);
		}
	},

// Order Cart
	cancelOrder:async (req, res, next)=>{
		try{
			var lang = req.user.language;
			const user_id = req.user.id;
			Order.remove({user_id, status:'waiting'}, function (err, cart) {
				if(err){
					res.json({ 
						success:false,
						message: language(lang, "commonForAll", "error")
					});
				}else{
					res.json({
						success: true,
						message: language(lang, "commonForAll", "delete")
					});
				}
			});
		}catch(error){
			return next(error);
		}
	},

//Change Status
	changeStatus:async (req, res, next)=>{
		try{
			var lang = req.user.language;
			var order_id = req.body.order_id;
			var status = req.body.status;

			Order.findOne({_id : order_id},function (err, orderDetail) {
				if(err){
					res.json({ 
						success:false,
						message: language(lang, "commonForAll", "error")
					});
				}else if(orderDetail == '' || orderDetail == null){
					res.json({
						success: false,
						message: language(lang, "commonForAll", "error")
					});
				}else{
					Order.updateOne({_id : order_id}, {$set: {status: status}}, function (err, order) {
						if(err){
							res.json({ 
								success:false,
								message: language(lang, "commonForAll", "error")
							});
						}else{
							console.log(orderDetail);
							var user_id	= orderDetail.user_id;
							console.log(user_id);
							var data ={};
							data['title'] = 'Change Order Status';
							data['order_id'] = orderDetail._id;
							data['status'] = status;
							// Notification 
							commonFunction.notification(data, user_id);
							res.json({
								success: true,
								order_id: orderDetail._id, 
								message: language(lang, "commonForAll", "successfully")
							});
						}
					});
				}
			});
		}catch(error){
			return next(error);
		}
	},

//Assign Driver
	assignDrive:async (req, res, next)=>{
		try{
			await Order.aggregate([{		// Get all order restaurants
					$match: { 
						$and: [
							{driver_id: null},
							{status: {$ne: 'waiting'}},
						]
					}
				},
				{
					$lookup:{  
						from:'restaurants',
						localField:'restaurant_id',
						foreignField:'_id',
						as:'restaurant'
					}
				}],function (err, order) {
				if(err){
					res.json({ 
						success:false,
					});  
				}else if(order == '' || order == null){
					res.json({ 
						success: false,
						message: 'No Order Available'
					});
				}else{
					var arrayLength = order.length;
					restaurant_lng = parseFloat(order[0].restaurant[0].geo_address.coordinates[0]);   
					restaurant_lat = parseFloat(order[0].restaurant[0].geo_address.coordinates[1]); 
	  
					if(restaurant_lng != 0){
						Driver.aggregate([{
							$geoNear: {
									near: {type: "Point", coordinates: [restaurant_lng, restaurant_lat]},
									distanceField: "distance",
							        maxDistance: 500000,  //Metres
							        spherical: true,
							        key: "geo_location",
							        distanceMultiplier : 0.001, //Km  
							    }
						},{
							$match:{status:'active'}
						}   
						],function (err, driver) {
							if(err){  
								console.log(err);
								res.json({    
									success:false, 
								});   
							}else if(driver == '' || driver == null){
								res.json({ 
									success:true,
									message:"Currently no driver is available"
								});
							}else{
								var orderLength = order.length;
								var driverLength = driver.length;
								for(var i = 0; i < orderLength; i++){
									order_id = order[i]._id;
									if(i < driverLength){	
										const driver_id = driver[i]._id;
										Order.updateOne({_id:order_id},{$set: {driver_id:driver_id}},
											function (err, restaurant) {
												if(err){
													console.log("Something is wrong");
													console.log(err);
												}else if(restaurant == ''  || restaurant == null){
													console.log("Something is wrong");
												}else{
													// Driver Status Update 
													Driver.updateOne({_id: driver_id}, { $set: {status: 'busy'}},function (err, update) {
														if(err){
															console.log("Something is wrong");
															console.log(err);
														}else{
															var data ={};
															data['title'] = 'Change Order Status';
															data['order_id'] = order_id;
															data['status'] = status;
															// Notification 
															commonFunction.notification(data, driver_id);
															console.log("Driver status successfully update");
														}
													});
													console.log("Driver successfully assigned");
												}
										}); 
									}
								}
								res.json({
									success:true,
									message:"Driver successfully assigned"
								});
							}
						});
					}else{
					 	res.json({ 
							success:false,
							message:"Restaurant lat lng is not available"
						});
					}
				}
			});
		}catch(error){
			return next(error);
		}
	},

	orderMessages:async (req, res, next)=>{
		try{
			var lang = req.user.language;
			//var user_id = req.user.id;
			const {order_id, restaurent_id, customer_id, message} = req.body;

			Customer.findOne({_id : customer_id},function (err, customerDetail) {
				if(err){
					res.json({ 
						success:false,
						message: language(lang, "commonForAll", "error")
					});
				}else if(customerDetail == '' || customerDetail == null){
					res.json({
						success: false,
						message: language(lang, "commonForAll", "error")
					});
				}else{
					user_id = customerDetail.user_id;
					OrderMessages = new orderMessages({order_id, restaurent_id, customer_id, message});
					OrderMessages.save(function (err, data) { 
						if(err){
							res.json({ 
								success: false,
								message: language(lang,"commonForAll","error")
							});
						}else{
							var data ={};
							data['title'] = 'Order Deny';
							data['order_id'] = order_id;
							data['message'] = message;
							// Notification 
							commonFunction.notification(data, user_id);

							res.json({ 
								success: true,
								message: language(lang,"commonForAll","add")
							});
						}						
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
				"exist": "Already exist",
				"successfully": "successfully",
			},
			"placeOrder":{
				"success": "Order placed successfully"
			},
			"addAndUpdateCart":{
				"add": "Meal added in cart successfully",
				"update": "Meal updated in cart successfully",
			}
		},
		"fr":{ // French
			"commonForAll":{
				"add": "Ajouter avec succès",
				"update":"Mis à jour avec succés",
				"error": "Quelque chose ne va pas",
				"empty":"Pas de données disponibles",
				"delete": "Supprimé avec succès",
				"exist": "Existe déjà",
				"successfully": "avec succès",
			},
			"placeOrder":{
				"success": "Commande passée avec succès"
			},
			"addAndUpdateCart":{
				"add": "Repas ajouté au panier avec succès",
				"update": "Repas mis à jour dans le panier avec succès",
			}
		},
		"es":{ // Spanish
			"commonForAll":{
				"add": "Añadir con éxito",
				"update": "Actualizado exitosamente",
				"error": "Algo está mal",
				"empty": "Datos no disponibles",
				"delete": "Borrado exitosamente",
				"exist": "Ya existe",
				"successfully": "exitosamente",
			},
			"placeOrder":{
				"success": "Pedido realizado con éxito"
			},
			"addAndUpdateCart":{
				"add": "Comida agregada en el carrito con éxito",
				"update": "Comida actualizada en carrito exitosamente",
			}
		},
		"pt":{ // Portuguese
			"commonForAll":{
				"add": "Adicione com sucesso",
				"update":"Atualizado com sucesso",
				"error": "Algo está errado",
				"empty":"Nenhum dado disponível",
				"delete": "Apagado com sucesso",
				"exist": "Já existe",
				"successfully": "com sucesso",
			},
			"placeOrder":{
				"success": "Encomenda colocada com sucesso"
			},
			"addAndUpdateCart":{
				"add": "Refeição adicionada no carrinho com sucesso",
				"update": "Refeição atualizada no carrinho com sucesso",
			}
		},
		"nl":{ // Dutch
			"commonForAll":{
				"add": "Voeg succesvol toe",
				"update":"Succesvol geupdatet",
				"error": "Er is iets fout",
				"empty":"Geen gegevens beschikbaar",
				"delete": "Met succes verwijderd",
				"exist": "Bestaat al",
				"successfully": "met succes",
			},
			"placeOrder":{
				"success": "Bestelling succesvol geplaatst"
			},
			"addAndUpdateCart":{
				"add": "Maaltijd toegevoegd aan winkelwagen",
				"update": "Maaltijd geüpdatet in winkelwagen",
			}
		}
	}
	return obj[lang][apiName][message]; 
}