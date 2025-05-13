const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// GET /api/teams/:id - Get team details
router.get('/:id', verifyToken, teamController.getTeamById);

// POST /api/teams/:id/invite - Invite a user to a team
router.post('/:id/invite', verifyToken, teamController.inviteUserToTeam);

// POST /api/teams/join - Join a team using a join code
router.post('/join', verifyToken, teamController.joinTeamWithCode);

// POST /api/teams/:id/ideas - Create a new idea for a team
router.post('/:id/ideas', verifyToken, teamController.createIdea);

module.exports = router;
