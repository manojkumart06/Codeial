const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

//tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID : "358921193071-p0jt5e5btdfc0pgonfgucm8v2udc52qt.apps.googleusercontent.com",
    clientSecret : "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",
    callbackURL : "http://localhost:8000/users/auth/google/callback"
 }, 

 function(accessToken, refreshToken, profile, done){
    //find a user
    User.findOne({email: profile.emails[0].value})
    .then(user => {
        console.log(accessToken,refreshToken);
        
        console.log(profile);
        if (user) {
            // If found, set this user as req.user
            return done(null, user);
        } else {
            // If not found, create the user and set it as req.user
            return User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            });
        }
    })
    .then(user => {
        return done(null, user);
    })
    .catch(err => {
        console.log("error in google strategy-passport", err);
        return done(err);
    });

}));




module.exports = passport;