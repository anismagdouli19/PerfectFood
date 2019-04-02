const express = require('express');
const promise = require('express-promise-router')();

const router = express.Router();
const passport = require('passport'); 
const passportConf = require('../helpers/passport');
const multer = require('multer');

// Validations   
const { validateBody, schemas } = require('../helpers/routeHelpers');

// Controllers
const UsersController = require('../controllers/users');
const RestaurantsController = require('../controllers/restaurants');
const OrdersController = require('../controllers/orders');

const passportSignIn = passport.authenticate('local', {session: false});
const passportJWT = passport.authenticate('jwt', {session: false});

// Add And UpdateCart
	router.route('/addAndUpdateCart')
		.post(passportJWT, OrdersController.addAndUpdateCart);

// Get Cart
	router.route('/getCart')
		.get(passportJWT, OrdersController.getCart);

// Detele Cart
	router.route('/deteleCart')
		.get(passportJWT, OrdersController.deteleCart);

// Get Order 
	router.route('/getOrder')
		.get(passportJWT, OrdersController.getOrder);

// Get Single Order
	router.route('/getSingleOrder')
		.get(passportJWT, OrdersController.getSingleOrder);

// Cancel Order
	router.route('/cancelOrder')
		.get(passportJWT, OrdersController.cancelOrder);

// Place Order
	router.route('/placeOrder')
		.post(passportJWT, OrdersController.placeOrder);

// Change status
	router.route('/changeStatus')
		.post(passportJWT, OrdersController.changeStatus);

// Assign Drive 		CRON JOB
	router.route('/assignDrive')
		.get( OrdersController.assignDrive);

// Order Messages
	router.route('/orderMessages')
		.post(passportJWT, OrdersController.orderMessages);
		


 
module.exports = router;