const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// POST /api/auth/signup - Register a new user
router.post('/signup', authController.signup);

// POST /api/auth/login - Login a user
router.post('/login', authController.login);

// POST /api/auth/logout - Logout a user
router.post('/logout', authController.logout);

module.exports = router;
