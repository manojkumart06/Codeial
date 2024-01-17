//https://www.passportjs.org/packages/passport-jwt/

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const env = require('./environment');

const User = require('../models/user');

let opts = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : env.jwt_secret
}

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {

    User.findById(jwt_payload._id, function (err, user){
        if(err){console.log("Error in finding user from JWT"); return;}

        if(user){
            return done(null, user);
        } else {
            return done(null, false);
        }
        
    })

}));

module.exports = passport;