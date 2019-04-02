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

var mongoose = require('mongoose');

module.exports = { 

// Update Location
	updateLocation: async (req, res, next)=>{
		try{
			const user_id = req.user.id;
			const geo_location = req.body.geo_location;
			if(req.query.lang){
				var lang = req.user.lang;
			}else{
				var lang = "en";
			}
			Driver.updateOne({user_id}, {$set: {geo_location: geo_location}},
				function (err, driver) {
					if(err){
						res.json({
							success: false,
							message: language(lang, "commonForAll", "error")
						});
					}else if(driver == '' || driver == null){
						res.json({ 
							success: false, 
							message: language(lang, "commonForAll", "error")
						});
					}else{
						res.json({
							success: true,
							message: language(lang, "commonForAll", "update"),
						});
					}
				}); 
		}catch(error){
			return next(error);
		}	
	},

// Change Status 
	changeStatus: async (req, res, next)=>{
		try{
			const user_id = req.user.id;
			const status = req.body.status
			if(req.query.lang){
				var lang = req.user.lang;
			}else{
				var lang = "en";
			}

			Driver.findOne({user_id}, function (err, driver) {
				if(err){
					res.json({ 
						success:false,
						message: language(lang, "commonForAll", "error")
					});
				}else if(driver == '' || driver == null){ 
					res.json({ 
						success: false,
						message: language(lang, "commonForAll", "empty")
					});
				}else{
					Driver.updateOne({user_id}, {$set: {status:status}},
						function (err, driver) {
							if(err){
								res.json({
									success: false,
									message: language(lang, "commonForAll", "error")
								});
							}else if(driver == '' || driver == null){
								res.json({ 
									success: false, 
									message: language(lang, "commonForAll", "error")
								});
							}else{
								res.json({
									success: true,
									message: language(lang, "commonForAll", "update"),
									
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