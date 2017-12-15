var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var sequelize = require('sequelize');

var db = require("../models");

passport.use(new LocalStrategy({
	usernameField: "email",
	passReqToCallback: true,
}, (req, email, password, done) => {
	var promise = (user) => {
		if (!user) {
			return done(null, false, {
				message: "Incorrect email."
			});
		} else if (!user.validPassword(password)) {
			return done(null, false, {
				message: "Incorrect password."
			});
		}
		return done(null, user);
	};
	
	if (!req.body.userType) {
		return done(null, false, {
			message: "Type of user ('tenant' or 'landlord') must be specified."
		});
	} else if (req.body.userType === 'tenant') {
		return db.Tenant.findOne({where: {email: email}}).then(promise);
	} else if (req.body.userType === 'landlord') {
		return db.Landlord.findOne({where: {email: email}}).then(promise);
	} else {
		return done(null, false, {
			message: "Invalid user type (must be 'tenant' or 'landlord')."
		});
	}
}));

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((key, done) => {
	done(null, key);
});

module.exports = passport;
