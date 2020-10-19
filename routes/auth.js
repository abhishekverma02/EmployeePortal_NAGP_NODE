const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.login_get);

router.post('/login', authController.login_post);

// get request for register page
router.get('/register', authController.register_get);

router.post('/register', authController.register_post);

module.exports = router;