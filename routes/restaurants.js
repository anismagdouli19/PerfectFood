const express = require('express');
const promise = require('express-promise-router')();

const router = express.Router();
const passport = require('passport');
const passportConf = require('../helpers/passport');
const multer = require('multer');
// Restaurant Image store
const restaurantStore = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, 'public/uploads/restaurant/');
	},
	filename: function(req, file, cb){
		cb(null, new Date().toISOString() + file.originalname);
	}
});
// Cuisine Image store
const cuisineStore = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, 'public/uploads/cuisine/');
	},
	filename: function(req, file, cb){
		cb(null, new Date().toISOString() + file.originalname);
	}
});
// Category Image store
const categoryStore = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, 'public/uploads/category/');
	},
	filename: function(req, file, cb){
		cb(null, new Date().toISOString() + file.originalname);
	}
});
// Meal Image store 
const mealStore = multer.diskStorage({
	destination: function(req, file, cb){ 
		cb(null, 'public/uploads/meal/');
	},
	filename: function(req, file, cb){
		cb(null, new Date().toISOString() + file.originalname);
	}
});
// Image file filter
const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  } 
};

const uploadRestaurant= multer({storage: restaurantStore, fileFilter: fileFilter});
const uploadCuisine = multer({storage: cuisineStore, fileFilter: fileFilter});
const uploadCategory = multer({storage: categoryStore, fileFilter: fileFilter});
const uploadmeal = multer({storage: mealStore, fileFilter: fileFilter});

// Validations
const { validateBody, schemas } = require('../helpers/routeHelpers');

// Controllers
const UsersController = require('../controllers/users');
const RestaurantsController = require('../controllers/restaurants');

const passportSignIn = passport.authenticate('local', {session: false});
const passportJWT = passport.authenticate('jwt', {session: false});

// Accept Restaurent 
	router.route('/acceptRestaurant')
		.post(passportJWT, RestaurantsController.acceptRestaurant);

// Update Restaurant
	router.route('/updateRestaurant')
		.post(passportJWT, uploadRestaurant.single('bannerImage'), RestaurantsController.updateRestaurantt);

// Get All Resturants List
	router.route('/getRestaurants')
		.get(RestaurantsController.getRestaurants);

// Restaurants Details
	router.route('/restaurantDetail')
		.get(RestaurantsController.restaurantDetail);

//Get All Near By Restaurant
	router.route('/allNearByRestaurant')
		.get(RestaurantsController.allNearByRestaurant);

//Unapprove Restaurants
	router.route('/unapproveRestaurants')
		.get(RestaurantsController.unapproveRestaurants);

//Remove Restaurants
	router.route('/removeRestaurants')
		.get(passportJWT, RestaurantsController.removeRestaurants);






																/* Restaurant Cuisine */

// Add Cuisine
	router.route('/addCuisine')
		.post(passportJWT, uploadCuisine.single('cuisine_image'), validateBody(schemas.cuisine), RestaurantsController.addCuisine);

// Get Cuisine
	router.route('/getCuisine')
		.get( RestaurantsController.getCuisine);

// Update Cuisine
	router.route('/updateCuisine')
		.post( passportJWT, uploadCuisine.single('cosiness_image'), validateBody(schemas.cuisine), RestaurantsController.updateCuisine);  

// Delete Cuisine
	router.route('/deleteCuisine')
		.get( passportJWT, RestaurantsController.deleteCuisine);  


/* CATEGORY */

// Add Category
	router.route('/addCategory')
		.post(passportJWT, uploadCategory.single('category_image'), validateBody(schemas.category), RestaurantsController.addCategory);

// Get Category list
	router.route('/getCategories')
		.get(passportJWT, RestaurantsController.getCategories);

// Update Category
	router.route('/updateCategory')
		.post( passportJWT, uploadCategory.single('category_image'), validateBody(schemas.category), RestaurantsController.updateCategory);  

// Delete Category
	router.route('/deleteCategory')
		.get(passportJWT, RestaurantsController.deleteCategory);  



																	/* Meal */

// Add Meal
	router.route('/addMeal')
		.post(passportJWT, uploadmeal.single('meal_image'), RestaurantsController.addMeal);

// Get Meals list
	router.route('/getMeals')
		.get(RestaurantsController.getMeals);

// Get Meal Details
	router.route('/getMealDetail')
		.get( RestaurantsController.getMealDetail);

// Update Meal
	router.route('/updateMeal')
		.post(passportJWT, uploadmeal.single('meal_image'), RestaurantsController.updateMeal);

// Delete Meal		
	router.route('/deleteMeal')
		.get(passportJWT, RestaurantsController.deleteMeal);


 
																	/* Rating And Review */

// Add Rating And Review		
	router.route('/addRating')
		.post(passportJWT, RestaurantsController.addRating); 

// Get Rating And Reviews
	router.route('/getRatingAndReviews')
		.get(RestaurantsController.getRatingAndReviews); 




 																	/* Restaurant Filter */

// Get Filtered Restaurant
	router.route('/restaurant_filter')
		.get( RestaurantsController.restaurant_filter); 

// Restaurant search
	router.route('/searching')
		.get( RestaurantsController.searching); 




																	/* Favourites Restaurant */

// Add Favourites Restaurant
	router.route('/favourite')
		.post( passportJWT, RestaurantsController.favourite); 

// Get Favourites Restaurant
	router.route('/getFavourite')
		.get( passportJWT, RestaurantsController.getFavourite); 





// test
router.route('/getNearestRestaurants')
		.get(RestaurantsController.getNearestRestaurants); 
 
module.exports = router;   
