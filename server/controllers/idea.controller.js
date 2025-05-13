const { query } = require('../config/db.config');

// Debug log
console.log('Idea controller loaded');

/**
 * Get all ideas
 * @route GET /api/ideas
 */
const getAllIdeas = async (req, res) => {
  try {
    const userId = req.userId;

    // Get all ideas
    const ideas = await query(`
      SELECT pi.id, pi.team_id, pi.summary, pi.created_at, t.name as team_name
      FROM project_idea pi
      JOIN team t ON pi.team_id = t.id
      ORDER BY pi.created_at DESC
    `);

    // Get technologies for each idea
    for (const idea of ideas) {
      // Get technologies
      const techs = await query(
        'SELECT tech FROM project_tech WHERE project_idea_id = ?',
        [idea.id]
      );

      idea.tech = techs.map(t => t.tech);

      // Get endorsement count
      const endorsementCount = await query(
        'SELECT COUNT(*) as count FROM endorsement WHERE project_idea_id = ?',
        [idea.id]
      );

      idea.endorsement_count = endorsementCount[0].count;

      // Check if the current user has endorsed this idea
      const userEndorsement = await query(
        'SELECT * FROM endorsement WHERE project_idea_id = ? AND user_id = ?',
        [idea.id, userId]
      );

      idea.user_has_endorsed = userEndorsement.length > 0;
    }

    res.status(200).json(ideas);
  } catch (error) {
    console.error('Error in getAllIdeas:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get idea details
 * @route GET /api/ideas/:id
 */
const getIdeaById = async (req, res) => {
  try {
    const ideaId = req.params.id;

    // Get idea details
    const ideas = await query('SELECT * FROM project_idea WHERE id = ?', [ideaId]);

    if (ideas.length === 0) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    const idea = ideas[0];

    // Get technologies
    const techs = await query(
      'SELECT tech FROM project_tech WHERE project_idea_id = ?',
      [ideaId]
    );

    idea.tech = techs.map(t => t.tech);

    // Get comments
    const comments = await query(`
      SELECT c.id, c.user_id, u.username, c.content, c.created_at
      FROM comment c
      JOIN user u ON c.user_id = u.id
      WHERE c.project_idea_id = ?
      ORDER BY c.created_at DESC
    `, [ideaId]);

    idea.comments = comments;

    // Get endorsement count
    const endorsementCount = await query(
      'SELECT COUNT(*) as count FROM endorsement WHERE project_idea_id = ?',
      [ideaId]
    );

    idea.endorsement_count = endorsementCount[0].count;

    // Check if the current user has endorsed this idea
    const userId = req.userId;
    const userEndorsement = await query(
      'SELECT * FROM endorsement WHERE project_idea_id = ? AND user_id = ?',
      [ideaId, userId]
    );

    idea.user_has_endorsed = userEndorsement.length > 0;

    res.status(200).json(idea);
  } catch (error) {
    console.error('Error in getIdeaById:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Add a comment to an idea
 * @route POST /api/ideas/:id/comments
 */
const addComment = async (req, res) => {
  try {
    const userId = req.userId;
    const ideaId = req.params.id;
    const { content } = req.body;

    // Validate request
    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    // Check if idea exists
    const ideas = await query('SELECT * FROM project_idea WHERE id = ?', [ideaId]);
    if (ideas.length === 0) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    const idea = ideas[0];

    // Check if user is registered for the same hackathon
    const isRegistered = await query(`
      SELECT r.id
      FROM registration r
      JOIN team t ON r.hackathon_id = t.hackathon_id
      WHERE r.user_id = ? AND t.id = ?
    `, [userId, idea.team_id]);

    if (isRegistered.length === 0) {
      return res.status(403).json({ message: 'You must be registered for the same hackathon to comment' });
    }

    // Add comment
    const result = await query(
      'INSERT INTO comment (project_idea_id, user_id, content) VALUES (?, ?, ?)',
      [ideaId, userId, content]
    );

    res.status(201).json({
      id: result.insertId,
      project_idea_id: parseInt(ideaId),
      user_id: userId,
      content
    });
  } catch (error) {
    console.error('Error in addComment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Endorse an idea
 * @route POST /api/ideas/:id/endorse
 */
const endorseIdea = async (req, res) => {
  try {
    const userId = req.userId;
    const ideaId = req.params.id;

    // Check if idea exists
    const ideas = await query('SELECT * FROM project_idea WHERE id = ?', [ideaId]);
    if (ideas.length === 0) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    const idea = ideas[0];

    // Check if user is registered for the same hackathon
    const isRegistered = await query(`
      SELECT r.id
      FROM registration r
      JOIN team t ON r.hackathon_id = t.hackathon_id
      WHERE r.user_id = ? AND t.id = ?
    `, [userId, idea.team_id]);

    if (isRegistered.length === 0) {
      return res.status(403).json({ message: 'You must be registered for the same hackathon to endorse' });
    }

    // Check if already endorsed
    const alreadyEndorsed = await query(
      'SELECT * FROM endorsement WHERE project_idea_id = ? AND user_id = ?',
      [ideaId, userId]
    );

    if (alreadyEndorsed.length > 0) {
      return res.status(400).json({ message: 'You have already endorsed this idea' });
    }

    // Add endorsement
    await query(
      'INSERT INTO endorsement (project_idea_id, user_id) VALUES (?, ?)',
      [ideaId, userId]
    );

    // Get updated endorsement count
    const endorsementCount = await query(
      'SELECT COUNT(*) as count FROM endorsement WHERE project_idea_id = ?',
      [ideaId]
    );

    res.status(200).json({
      endorsement_count: endorsementCount[0].count
    });
  } catch (error) {
    console.error('Error in endorseIdea:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllIdeas,
  getIdeaById,
  addComment,
  endorseIdea
};
