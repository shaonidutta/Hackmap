const { query } = require('../config/db.config');
const { generateRandomCode } = require('../utils/common.utils');

/**
 * Get all hackathons
 * @route GET /api/hackathons
 */
const getAllHackathons = async (req, res) => {
  try {
    const userId = req.userId;

    let sql = `
      SELECT h.id, h.title, h.theme, h.start_date, h.end_date,
             h.registration_deadline, h.prizes, h.team_size_limit,
             h.organizer_id,
             CASE WHEN h.organizer_id = ? THEN TRUE ELSE FALSE END AS is_organizer,
             CASE WHEN r.id IS NOT NULL THEN TRUE ELSE FALSE END AS registered
      FROM hackathon h
      LEFT JOIN registration r ON h.id = r.hackathon_id AND r.user_id = ?
    `;

    const params = [userId, userId];

    // No filtering at the database level - we'll handle all filtering on the client side
    // This ensures we get all hackathons with their proper flags (is_organizer, registered)
    // and can filter them appropriately in the frontend

    const hackathons = await query(sql, params);

    // Get tags for each hackathon
    for (const hackathon of hackathons) {
      const tags = await query(`
        SELECT t.name
        FROM tag t
        JOIN hackathon_tag ht ON t.id = ht.tag_id
        WHERE ht.hackathon_id = ?
      `, [hackathon.id]);

      hackathon.tags = tags.map(tag => tag.name);

      // Ensure organizer_id is included in the response
      // Rename to organiser_id to match API documentation if needed
      hackathon.organiser_id = hackathon.organizer_id;
    }

    // Log the first hackathon to debug
    if (hackathons.length > 0) {
      console.log('Sample hackathon data being sent to client:', hackathons[0]);
    }

    res.status(200).json(hackathons);
  } catch (error) {
    console.error('Error in getAllHackathons:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get a specific hackathon
 * @route GET /api/hackathons/:id
 */
const getHackathonById = async (req, res) => {
  try {
    const userId = req.userId;
    const hackathonId = req.params.id;

    // Get hackathon details with organizer info
    const hackathons = await query(`
      SELECT h.id, h.title, h.theme, h.start_date, h.end_date,
             h.registration_deadline, h.prizes, h.team_size_limit,
             h.organizer_id,
             CASE WHEN h.organizer_id = ? THEN TRUE ELSE FALSE END AS is_organizer,
             CASE WHEN r.id IS NOT NULL THEN TRUE ELSE FALSE END AS registered
      FROM hackathon h
      LEFT JOIN registration r ON h.id = r.hackathon_id AND r.user_id = ?
      WHERE h.id = ?
    `, [userId, userId, hackathonId]);

    if (hackathons.length === 0) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    const hackathon = hackathons[0];

    // Get tags for the hackathon
    const tags = await query(`
      SELECT t.name
      FROM tag t
      JOIN hackathon_tag ht ON t.id = ht.tag_id
      WHERE ht.hackathon_id = ?
    `, [hackathonId]);

    hackathon.tags = tags.map(tag => tag.name);

    // Ensure organizer_id is included in the response
    // Rename to organiser_id to match API documentation if needed
    hackathon.organiser_id = hackathon.organizer_id;

    // Log the hackathon data to debug
    console.log('Hackathon data being sent to client:', hackathon);

    res.status(200).json(hackathon);
  } catch (error) {
    console.error('Error in getHackathonById:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Register for a hackathon
 * @route POST /api/hackathons/:id/register
 */
const registerForHackathon = async (req, res) => {
  try {
    const userId = req.userId;
    const hackathonId = req.params.id;
    const { skills } = req.body;

    // Validate request
    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({ message: 'Skills are required' });
    }

    // Check if hackathon exists
    const hackathons = await query('SELECT * FROM hackathon WHERE id = ?', [hackathonId]);
    if (hackathons.length === 0) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    // Check if user is the organizer
    if (hackathons[0].organizer_id === userId) {
      return res.status(400).json({
        message: 'You cannot register for a hackathon you are organizing'
      });
    }

    // Check if already registered
    const registrations = await query(
      'SELECT * FROM registration WHERE user_id = ? AND hackathon_id = ?',
      [userId, hackathonId]
    );

    if (registrations.length > 0) {
      return res.status(409).json({ message: 'Already registered for this hackathon' });
    }

    // Create registration
    const result = await query(
      'INSERT INTO registration (user_id, hackathon_id) VALUES (?, ?)',
      [userId, hackathonId]
    );

    const registrationId = result.insertId;

    // Add skills
    for (const skill of skills) {
      await query(
        'INSERT INTO registration_skill (registration_id, skill) VALUES (?, ?)',
        [registrationId, skill]
      );
    }

    // Get the created registration
    const registration = {
      registration_id: registrationId,
      user_id: userId,
      hackathon_id: parseInt(hackathonId),
      skills,
      created_at: new Date().toISOString()
    };

    res.status(201).json(registration);
  } catch (error) {
    console.error('Error in registerForHackathon:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Create a team for a hackathon
 * @route POST /api/hackathons/:id/teams
 */
const createTeam = async (req, res) => {
  try {
    const userId = req.userId;
    const hackathonId = req.params.id;
    const { name, description } = req.body;

    // Validate request
    if (!name) {
      return res.status(400).json({ message: 'Team name is required' });
    }

    // Check if hackathon exists
    const hackathons = await query('SELECT * FROM hackathon WHERE id = ?', [hackathonId]);
    if (hackathons.length === 0) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    const isOrganizer = hackathons[0].organizer_id === userId;

    // If not organizer, check if user is registered for the hackathon
    if (!isOrganizer) {
      const registrations = await query(
        'SELECT * FROM registration WHERE user_id = ? AND hackathon_id = ?',
        [userId, hackathonId]
      );

      if (registrations.length === 0) {
        return res.status(403).json({ message: 'You must be registered for this hackathon to create a team' });
      }
    }

    // Generate a unique join code
    const joinCode = generateRandomCode(6);

    // Create team
    const result = await query(
      'INSERT INTO team (hackathon_id, name, description, join_code) VALUES (?, ?, ?, ?)',
      [hackathonId, name, description || '', joinCode]
    );

    const teamId = result.insertId;

    // Add creator as a team member
    await query(
      'INSERT INTO team_member (team_id, user_id) VALUES (?, ?)',
      [teamId, userId]
    );

    // Get the created team
    const team = {
      id: teamId,
      hackathon_id: parseInt(hackathonId),
      name,
      description: description || '',
      join_code: joinCode,
      created_at: new Date().toISOString()
    };

    res.status(201).json(team);
  } catch (error) {
    console.error('Error in createTeam:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Create a new hackathon
 * @route POST /api/hackathons
 */
const createHackathon = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, theme, start_date, end_date, registration_deadline, prizes, team_size_limit, tags } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    if (!start_date || !end_date || !registration_deadline) {
      return res.status(400).json({ message: 'All dates are required' });
    }
    if (!team_size_limit || team_size_limit < 1) {
      return res.status(400).json({ message: 'Team size limit must be at least 1' });
    }

    // Validate dates
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const regDeadline = new Date(registration_deadline);
    const now = new Date();

    if (regDeadline < now) {
      return res.status(400).json({ message: 'Registration deadline must be in the future' });
    }
    if (startDate < regDeadline) {
      return res.status(400).json({ message: 'Start date must be after registration deadline' });
    }
    if (endDate < startDate) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    // Create hackathon
    const result = await query(
      'INSERT INTO hackathon (organizer_id, title, theme, start_date, end_date, registration_deadline, prizes, team_size_limit) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, title, theme || '', start_date, end_date, registration_deadline, prizes || '', team_size_limit]
    );

    const hackathonId = result.insertId;

    // Add tags if provided
    if (tags && Array.isArray(tags) && tags.length > 0) {
      for (const tagName of tags) {
        // Check if tag exists
        let tagId;
        const existingTags = await query('SELECT id FROM tag WHERE name = ?', [tagName]);

        if (existingTags.length > 0) {
          tagId = existingTags[0].id;
        } else {
          // Create new tag
          const tagResult = await query('INSERT INTO tag (name) VALUES (?)', [tagName]);
          tagId = tagResult.insertId;
        }

        // Link tag to hackathon
        await query(
          'INSERT INTO hackathon_tag (hackathon_id, tag_id) VALUES (?, ?)',
          [hackathonId, tagId]
        );
      }
    }

    // Get the created hackathon
    const hackathons = await query(`
      SELECT h.id, h.title, h.theme, h.start_date, h.end_date,
             h.registration_deadline, h.prizes, h.team_size_limit,
             h.organizer_id,
             CASE WHEN h.organizer_id = ? THEN TRUE ELSE FALSE END AS is_organizer,
             CASE WHEN r.id IS NOT NULL THEN TRUE ELSE FALSE END AS registered
      FROM hackathon h
      LEFT JOIN registration r ON h.id = r.hackathon_id AND r.user_id = ?
      WHERE h.id = ?
    `, [userId, userId, hackathonId]);

    if (hackathons.length === 0) {
      return res.status(500).json({ message: 'Failed to retrieve created hackathon' });
    }

    const hackathon = hackathons[0];

    // Add tags to response
    hackathon.tags = tags || [];

    // Add organiser_id for consistency with API
    hackathon.organiser_id = hackathon.organizer_id;

    res.status(201).json(hackathon);
  } catch (error) {
    console.error('Error in createHackathon:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update a hackathon
 * @route PUT /api/hackathons/:id
 */
const updateHackathon = async (req, res) => {
  try {
    const userId = req.userId;
    const hackathonId = req.params.id;
    const { title, theme, start_date, end_date, registration_deadline, prizes, team_size_limit, tags } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    if (!start_date || !end_date || !registration_deadline) {
      return res.status(400).json({ message: 'All dates are required' });
    }
    if (!team_size_limit || team_size_limit < 1) {
      return res.status(400).json({ message: 'Team size limit must be at least 1' });
    }

    // Check if hackathon exists and user is the organizer
    const hackathons = await query('SELECT * FROM hackathon WHERE id = ?', [hackathonId]);

    if (hackathons.length === 0) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    const hackathon = hackathons[0];

    if (hackathon.organizer_id !== userId) {
      return res.status(403).json({ message: 'You are not authorized to update this hackathon' });
    }

    // Update hackathon
    await query(
      'UPDATE hackathon SET title = ?, theme = ?, start_date = ?, end_date = ?, registration_deadline = ?, prizes = ?, team_size_limit = ? WHERE id = ?',
      [title, theme || '', start_date, end_date, registration_deadline, prizes || '', team_size_limit, hackathonId]
    );

    // Update tags
    if (tags && Array.isArray(tags)) {
      // First, remove all existing tags
      await query('DELETE FROM hackathon_tag WHERE hackathon_id = ?', [hackathonId]);

      // Then add the new tags
      for (const tagName of tags) {
        // Check if tag exists
        let tagId;
        const existingTags = await query('SELECT id FROM tag WHERE name = ?', [tagName]);

        if (existingTags.length > 0) {
          tagId = existingTags[0].id;
        } else {
          // Create new tag
          const tagResult = await query('INSERT INTO tag (name) VALUES (?)', [tagName]);
          tagId = tagResult.insertId;
        }

        // Link tag to hackathon
        await query(
          'INSERT INTO hackathon_tag (hackathon_id, tag_id) VALUES (?, ?)',
          [hackathonId, tagId]
        );
      }
    }

    // Get the updated hackathon
    const updatedHackathons = await query(`
      SELECT h.id, h.title, h.theme, h.start_date, h.end_date,
             h.registration_deadline, h.prizes, h.team_size_limit,
             h.organizer_id,
             CASE WHEN h.organizer_id = ? THEN TRUE ELSE FALSE END AS is_organizer,
             CASE WHEN r.id IS NOT NULL THEN TRUE ELSE FALSE END AS registered
      FROM hackathon h
      LEFT JOIN registration r ON h.id = r.hackathon_id AND r.user_id = ?
      WHERE h.id = ?
    `, [userId, userId, hackathonId]);

    if (updatedHackathons.length === 0) {
      return res.status(500).json({ message: 'Failed to retrieve updated hackathon' });
    }

    const updatedHackathon = updatedHackathons[0];

    // Get tags for the hackathon
    const updatedTags = await query(`
      SELECT t.name
      FROM tag t
      JOIN hackathon_tag ht ON t.id = ht.tag_id
      WHERE ht.hackathon_id = ?
    `, [hackathonId]);

    updatedHackathon.tags = updatedTags.map(tag => tag.name);

    // Add organiser_id for consistency with API
    updatedHackathon.organiser_id = updatedHackathon.organizer_id;

    res.status(200).json(updatedHackathon);
  } catch (error) {
    console.error('Error in updateHackathon:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllHackathons,
  getHackathonById,
  registerForHackathon,
  createTeam,
  createHackathon,
  updateHackathon
};
