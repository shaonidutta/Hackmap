const express = require('express');
const router = express.Router();
const hackathonController = require('../controllers/hackathon.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// GET /api/hackathons - Get all hackathons
router.get('/', verifyToken, hackathonController.getAllHackathons);

// POST /api/hackathons - Create a new hackathon
router.post('/', verifyToken, hackathonController.createHackathon);

// GET /api/hackathons/:id - Get a specific hackathon
router.get('/:id', verifyToken, hackathonController.getHackathonById);

// POST /api/hackathons/:id/register - Register for a hackathon
router.post('/:id/register', verifyToken, hackathonController.registerForHackathon);

// POST /api/hackathons/:id/teams - Create a team for a hackathon
router.post('/:id/teams', verifyToken, hackathonController.createTeam);

// PUT /api/hackathons/:id - Update a hackathon
router.put('/:id', verifyToken, hackathonController.updateHackathon);

module.exports = router;
