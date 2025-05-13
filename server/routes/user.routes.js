const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// GET /api/users/me - Get current user profile
router.get('/me', verifyToken, userController.getProfile);

// GET /api/users/me/teams - Get current user's teams
router.get('/me/teams', verifyToken, userController.getUserTeams);

// GET /api/users/me/ideas - Get current user's ideas
router.get('/me/ideas', verifyToken, userController.getUserIdeas);

module.exports = router;
