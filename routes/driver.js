const express = require('express');
const promise = require('express-promise-router')();

const router = express.Router();
const passport = require('passport'); 
const passportConf = require('../helpers/passport');
const multer = require('multer');

// Validations   
const { validateBody, schemas } = require('../helpers/routeHelpers');

// Controllers
const DriverController = require('../controllers/driver');

const passportSignIn = passport.authenticate('local', {session: false});
const passportJWT = passport.authenticate('jwt', {session: false});


// Update Location
	router.route('/updateLocation')
		.post(passportJWT, DriverController.updateLocation);

// Change Status
	router.route('/changeStatus')
		.post(passportJWT, DriverController.changeStatus);


module.exports = router;