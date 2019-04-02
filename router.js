const SettingsController = require('./controllers/adminsettings');
const AdminuserController = require('./controllers/users');
const RestaurantsController = require('./controllers/restaurants');

var bcrypt      = require('bcryptjs')
var saltRounds = 10;
var salt  = bcrypt.genSaltSync(saltRounds);
var Settings = require('./models/adminsettings.js');
var express = require('express');
var passport = require('passport');
var multer = require('multer');
var path = require("path");
module.exports = function (app) {
   var apiRoutes = express.Router();
    /*console.log(apiRoutes);*/

  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.get('/getSociallinks', SettingsController.FetchSettings);
  apiRoutes.post('/addSociallinks', SettingsController.SaveSettings);
  apiRoutes.post('/addLogo', SettingsController.SaveLogo);
  apiRoutes.post('/addBanner', SettingsController.SaveBanner);
  apiRoutes.get('/getPersonalUser',AdminuserController.getCustomer);
  apiRoutes.get('/getCompanyUser',AdminuserController.getCompany);
  apiRoutes.get('/getDriver',AdminuserController.getDrivers);
 // apiRoutes.get('/getResturants',AdminuserController.getResturants);
  apiRoutes.post('/addPage', SettingsController.savePage);
  apiRoutes.post('/homepagesettings', SettingsController.saveHomesettings);
  apiRoutes.get('/gethomepagesettings', SettingsController.gethomepagesettings);
  apiRoutes.get('/getPages', SettingsController.getPages);
  app.use('/adminapi', apiRoutes);
  //apiRoutes.get('/getRestaurant',RestaurantsController.getRestaurants);




 };
