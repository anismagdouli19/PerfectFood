const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const localStrategy = require('passport-local').Strategy;

const { JWT_SECRET } = require('../config');
const User = require('../models/user');

// Passport check token
passport.use(new JwtStrategy({
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: JWT_SECRET
}, async(payload, done) => {
	try{
		const user = await User.findById(payload.sub);
		if(!user){
			return done(null, false);
		}
		done(null, user);
	}catch(error){
		done(error,false);
	}
}));

// local strategy
	passport.use(new localStrategy({
		usernameField: 'email'
	}, async (email, password, done)=>{
		try{
			// Match email
			const user = await User.findOne({ email });
			if(!user){
				return done(null, { message: 'Your login details could not be verified. Please try again.', status:false});
			}
			// Match password
			const isMatch = await user.isValidPassword(password);
			if(!isMatch){
				return done(null, { message: 'Your login details could not be verified. Please try again.', status:false});
			}
			done(null, user);
		}catch(error){
			done(error, false);
		}
	}));