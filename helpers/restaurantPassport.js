const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const localStrategy = require('passport-local').Strategy;

const { JWT_SECRET } = require('../config');
const Resturants = require('../models/resturants');



passport.use(new JwtStrategy({
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: JWT_SECRET
}, async(payload, done) => {
	try{
		const resturant = await Resturants.findById(payload.sub);
		if(!resturant){
			return done(null, false);
		}
		done(null, resturant);
	}catch(error){
		done(error,false);
	}
}));

// local strategy

passport.use(new localStrategy({
	usernameField: 'email'
}, async (email, password, role, done)=>{
	try{

	const resturant = await Resturants.findOne({ email, role });

	if(!resturant){
		return done(null, { message: 'Your login details could not be verified. Please try again.', status:false});
	}
	const isMatch = await resturant.isValidPassword(password);
	if(!isMatch){
		return done(null, { message: 'Your login details could not be verified. Please try again.', status:false});
	}
	
	done(null, resturant);
}catch(error){
	done(error, false);
}
}));