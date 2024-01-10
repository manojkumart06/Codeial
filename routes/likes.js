const express = require('express');
const router = express.Router();
const likesController = require('../controllers/Likes_controller');

router.post('/toggle',likesController.toggleLike);

module.exports = router;