const { query } = require('../config/db.config');

/**
 * Get current user profile
 * @route GET /api/users/me
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.userId;

    // Get user profile
    const users = await query(
      'SELECT id, email, username FROM user WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user skills from most recent registration
    const skills = await query(`
      SELECT rs.skill
      FROM registration_skill rs
      JOIN registration r ON rs.registration_id = r.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
      LIMIT 10
    `, [userId]);

    const user = users[0];
    user.skills = skills.map(s => s.skill);

    res.status(200).json(user);
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get current user's teams
 * @route GET /api/users/me/teams
 */
const getUserTeams = async (req, res) => {
  try {
    const userId = req.userId;

    // Get user's teams
    const teams = await query(`
      SELECT t.id as team_id, t.hackathon_id, t.name, t.description, t.join_code
      FROM team t
      JOIN team_member tm ON t.id = tm.team_id
      WHERE tm.user_id = ?
    `, [userId]);

    res.status(200).json(teams);
  } catch (error) {
    console.error('Error in getUserTeams:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get current user's ideas
 * @route GET /api/users/me/ideas
 */
const getUserIdeas = async (req, res) => {
  try {
    const userId = req.userId;

    // Get user's ideas (ideas from teams the user is a member of)
    const ideas = await query(`
      SELECT pi.id, pi.team_id, pi.summary
      FROM project_idea pi
      JOIN team t ON pi.team_id = t.id
      JOIN team_member tm ON t.id = tm.team_id
      WHERE tm.user_id = ?
    `, [userId]);

    // Get technologies for each idea
    for (const idea of ideas) {
      const techs = await query(`
        SELECT tech
        FROM project_tech
        WHERE project_idea_id = ?
      `, [idea.id]);
      
      idea.tech = techs.map(t => t.tech);
    }

    res.status(200).json(ideas);
  } catch (error) {
    console.error('Error in getUserIdeas:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProfile,
  getUserTeams,
  getUserIdeas
};
