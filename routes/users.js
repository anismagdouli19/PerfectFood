const express = require('express');
const promise = require('express-promise-router')();
const router = express.Router();
const passport = require('passport');
const passportConf = require('../helpers/passport');
const multer = require('multer');
// Storage profile pic
const storage = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, 'public/uploads/profilePic/');
	},
	filename: function(req, file, cb){
		cb(null, new Date().toISOString() + file.originalname);
	}
})

// Storage id verification
const storageIdVerification = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, 'public/uploads/idProof/');
	},
	filename: function(req, file, cb){
		cb(null, new Date().toISOString() + file.originalname);
	}
})
// Filter Image 
const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}; 

const uploadProfileImage = multer({storage: storage,fileFilter: fileFilter});
const uploadIdVerification = multer({storage: storageIdVerification,fileFilter: fileFilter});

const { validateBody, schemas } = require('../helpers/routeHelpers');

//Controllers
const UsersController = require('../controllers/users');

const passportSignIn = passport.authenticate('local', {session: false});
const passportJWT = passport.authenticate('jwt', {session: false});


// SignUp  
	router.route('/signUp')
		.post(uploadIdVerification.single('idVerification'), validateBody(schemas.signUpSchema), UsersController.signUp);

// LogIn
	router.route('/signin')
		.post(validateBody(schemas.authSchema),passportSignIn, UsersController.signIn);
		
// LogOut
	router.route('/logout')
		.get(passportJWT, UsersController.logout);

// Forget Password
	router.route('/forgetPassword')
		.post(UsersController.forgetPassword);

// Reset Password
	router.route('/resetPassword')
		.post(UsersController.resetPassword);
 
// logout 
	router.route('/logout')
		.get(passportJWT, UsersController.logout);

// View User Profile
	router.route('/viewProfile')
		.get(passportJWT, UsersController.viewProfile);

// Update User Profile
	router.route('/updateProfile')
		.post(passportJWT, uploadProfileImage.single('profileImage'), UsersController.updateProfile);

// Update User Image
	router.route('/updateProfileImage')
		.post(passportJWT, uploadProfileImage.single('profileImage'), UsersController.updateProfileImage);	

// Change Password
	router.route('/changePassword')
		.post(passportJWT, UsersController.changePassword);

// Get All Customers List
	router.route('/getCustomer')
		.get( UsersController.getCustomer);

// Get All Company List
	router.route('/getCompany')
		.get( UsersController.getCompany);		

// Get All Drivers List
	router.route('/getDrivers')
		.get( UsersController.getDrivers);

// Add & Update Delivery Details
	router.route('/addAndUpdateDeliveryDetails')
		.post( passportJWT, UsersController.addAndUpdateDeliveryDetails);

// Get Delivery Details
	router.route('/getDeliveryDetails')
		.get(passportJWT, UsersController.getDeliveryDetails);

// Update Current Address
	router.route('/updateCurrentAddress')
			.post(passportJWT, UsersController.updateCurrentAddress);

// Add And Update Language
	router.route('/addAndUpdateLanguage')
			.post(passportJWT, UsersController.addAndUpdateLanguage);
		
// Update Device Token
	router.route('/updateDeviceToken')
			.post(passportJWT, UsersController.updateDeviceToken);


module.exports = router; 