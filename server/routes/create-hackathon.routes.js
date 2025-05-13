const express = require('express');
const router = express.Router();
const { query } = require('../config/db.config');
const { verifyToken } = require('../middleware/auth.middleware');

/**
 * Create a new hackathon
 * @route POST /api/create-hackathon
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { title, theme, start_date, end_date, registration_deadline, prizes, team_size_limit, tags } = req.body;

    console.log('Create hackathon request received:', {
      userId,
      title,
      theme,
      start_date,
      end_date,
      registration_deadline,
      prizes,
      team_size_limit,
      tags
    });

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
});

module.exports = router;
