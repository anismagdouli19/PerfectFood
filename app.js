const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var config = require('./config/main');
var router = require('./router');
mongoose.connect(config.database,{useNewUrlParser:true},function(err, db) {
  if (err) throw err;
  console.log("Connection created!");
});

const app = express();


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));  

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', "*");
	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
	res.header('Access-Control-Allow-Credentials', 'true');
	next();
});

														/* Start Routes */
// User Routes
	app.use('/api', require('./routes/users'));

//	Restaurants Routes
	app.use('/api/restaurant', require('./routes/restaurants'));

//	Order Routes
	app.use('/api/order', require('./routes/orders'));

//	Driver Routes
	app.use('/api/driver', require('./routes/driver'));

router(app); 

app.set('view engine', 'jade');														/* End Routes */


app.listen(8000,()=> {
	console.log('Server listening at 8000');

});
