const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');

router.get('/profile/:id',passport.checkAuthentication, usersController.profile);
router.post('/update/:id',passport.checkAuthentication, usersController.update);   //here post, since data is updated into DB
router.get('/sign_up',usersController.signUP);
router.get('/sign_in',usersController.signIN);
router.get('/sign_out', usersController.signOut);

router.get('/auth/google',passport.authenticate('google',{scope: ['profile', 'email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect : '/users/sign-in'}),usersController.createSession); //receive the data



router.post('/create',usersController.create);
//using Manual Autentication
//router.post('/create-session',usersController.createSession)

//using passport as a middleware to Autenticate
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect: '/users/sign_in'}
    ),usersController.createSession);


module.exports = router;