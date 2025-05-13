const express = require('express');
const router = express.Router();
const ideaController = require('../controllers/idea.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Debug log
console.log('Idea routes loaded');

// GET /api/ideas - Get all ideas
router.get('/', verifyToken, ideaController.getAllIdeas);

// GET /api/ideas/:id - Get idea details
router.get('/:id', verifyToken, ideaController.getIdeaById);

// POST /api/ideas/:id/comments - Add a comment to an idea
router.post('/:id/comments', verifyToken, ideaController.addComment);

// POST /api/ideas/:id/endorse - Endorse an idea
router.post('/:id/endorse', verifyToken, ideaController.endorseIdea);

module.exports = router;
