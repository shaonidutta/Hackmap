const { query } = require('../config/db.config');

/**
 * Get team details
 * @route GET /api/teams/:id
 */
const getTeamById = async (req, res) => {
  try {
    const teamId = req.params.id;

    // Get team details
    const teams = await query('SELECT * FROM team WHERE id = ?', [teamId]);

    if (teams.length === 0) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const team = teams[0];

    // Get team members
    const members = await query(`
      SELECT u.id as user_id, u.username
      FROM user u
      JOIN team_member tm ON u.id = tm.user_id
      WHERE tm.team_id = ?
    `, [teamId]);

    team.members = members;

    res.status(200).json(team);
  } catch (error) {
    console.error('Error in getTeamById:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Invite a user to a team
 * @route POST /api/teams/:id/invite
 */
const inviteUserToTeam = async (req, res) => {
  try {
    const userId = req.userId;
    const teamId = req.params.id;
    const { username } = req.body;

    // Validate request
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    // Check if team exists
    const teams = await query('SELECT * FROM team WHERE id = ?', [teamId]);
    if (teams.length === 0) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Check if user is a member of the team
    const isMember = await query(
      'SELECT * FROM team_member WHERE team_id = ? AND user_id = ?',
      [teamId, userId]
    );

    if (isMember.length === 0) {
      return res.status(403).json({ message: 'You must be a team member to invite users' });
    }

    // Find the user to invite
    const users = await query('SELECT * FROM user WHERE username = ?', [username]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const inviteeId = users[0].id;

    // Check if user is already a member
    const isAlreadyMember = await query(
      'SELECT * FROM team_member WHERE team_id = ? AND user_id = ?',
      [teamId, inviteeId]
    );

    if (isAlreadyMember.length > 0) {
      return res.status(409).json({ message: 'User is already a team member' });
    }

    // Check if invitation already exists
    const existingInvitation = await query(`
      SELECT * FROM notification
      WHERE user_id = ? AND team_id = ? AND type = 'TEAM_INVITE' AND status = 'PENDING'
    `, [inviteeId, teamId]);

    if (existingInvitation.length > 0) {
      return res.status(409).json({ message: 'Invitation already sent' });
    }

    // Create notification
    const result = await query(`
      INSERT INTO notification (user_id, type, team_id, sender_id, status)
      VALUES (?, 'TEAM_INVITE', ?, ?, 'PENDING')
    `, [inviteeId, teamId, userId]);

    res.status(201).json({
      notification_id: result.insertId,
      type: 'TEAM_INVITE',
      status: 'PENDING'
    });
  } catch (error) {
    console.error('Error in inviteUserToTeam:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Join a team using a join code
 * @route POST /api/teams/join
 */
const joinTeamWithCode = async (req, res) => {
  try {
    const userId = req.userId;
    const { join_code } = req.body;

    // Validate request
    if (!join_code) {
      return res.status(400).json({ message: 'Join code is required' });
    }

    // Find team by join code
    const teams = await query('SELECT * FROM team WHERE join_code = ?', [join_code]);
    if (teams.length === 0) {
      return res.status(400).json({ message: 'Invalid join code' });
    }

    const team = teams[0];

    // Check if user is already a member
    const isAlreadyMember = await query(
      'SELECT * FROM team_member WHERE team_id = ? AND user_id = ?',
      [team.id, userId]
    );

    if (isAlreadyMember.length > 0) {
      return res.status(409).json({ message: 'You are already a team member' });
    }

    // Check if team is full
    const hackathons = await query('SELECT team_size_limit FROM hackathon WHERE id = ?', [team.hackathon_id]);
    const teamSizeLimit = hackathons[0].team_size_limit;

    const memberCount = await query(
      'SELECT COUNT(*) as count FROM team_member WHERE team_id = ?',
      [team.id]
    );

    if (memberCount[0].count >= teamSizeLimit) {
      return res.status(403).json({ message: 'Team is full' });
    }

    // Add user to team
    await query(
      'INSERT INTO team_member (team_id, user_id) VALUES (?, ?)',
      [team.id, userId]
    );

    res.status(200).json({
      team_id: team.id,
      user_id: userId
    });
  } catch (error) {
    console.error('Error in joinTeamWithCode:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Create a new idea for a team
 * @route POST /api/teams/:id/ideas
 */
const createIdea = async (req, res) => {
  try {
    const userId = req.userId;
    const teamId = req.params.id;
    const { summary, tech } = req.body;

    // Validate request
    if (!summary) {
      return res.status(400).json({ message: 'Summary is required' });
    }

    if (!tech || !Array.isArray(tech) || tech.length === 0) {
      return res.status(400).json({ message: 'Technologies are required' });
    }

    // Check if team exists
    const teams = await query('SELECT * FROM team WHERE id = ?', [teamId]);
    if (teams.length === 0) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Check if user is a member of the team
    const isMember = await query(
      'SELECT * FROM team_member WHERE team_id = ? AND user_id = ?',
      [teamId, userId]
    );

    if (isMember.length === 0) {
      return res.status(403).json({ message: 'You must be a team member to create an idea' });
    }

    // Create idea
    const result = await query(
      'INSERT INTO project_idea (team_id, summary) VALUES (?, ?)',
      [teamId, summary]
    );

    const ideaId = result.insertId;

    // Add technologies
    for (const t of tech) {
      await query(
        'INSERT INTO project_tech (project_idea_id, tech) VALUES (?, ?)',
        [ideaId, t]
      );
    }

    // Return the created idea
    res.status(201).json({
      id: ideaId,
      team_id: parseInt(teamId),
      summary,
      tech
    });
  } catch (error) {
    console.error('Error in createIdea:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getTeamById,
  inviteUserToTeam,
  joinTeamWithCode,
  createIdea
};
