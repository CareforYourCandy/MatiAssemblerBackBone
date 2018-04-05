const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config/database');

module.exports = function(passport){
	let opts = {};	
	//ESTE COMENTADO ES EL DEL TUTORIAL
	//opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
	opts.secretOrKey = config.secret;

	passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
		User.getUserByID(jwt_payload._id, (err, user) => {
			if(err){
				return done(err, false);
			} 
			if (user){
				return done(null, user);
			}else {
				return done(null, false);
			}
		});
	}));

}