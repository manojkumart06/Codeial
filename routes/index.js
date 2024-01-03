const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home_controller');



//take controller using router 
router.get('/',homeController.home);
router.use('/users',require('./users'));
router.use('/posts',require('./posts'));
router.use('/comments',require('./comment'));
router.use('/api',require('./api'));

console.log('Routes configured!'); // Debugging

module.exports = router;
