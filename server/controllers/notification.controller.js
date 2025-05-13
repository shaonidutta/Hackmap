const { query } = require('../config/db.config');

/**
 * Get all notifications for the current user
 * @route GET /api/notifications
 */
const getUserNotifications = async (req, res) => {
  try {
    const userId = req.userId;

    // Get user's notifications
    const notifications = await query(`
      SELECT n.id, n.type, n.team_id, n.sender_id, n.status, n.created_at,
             u.username as sender_username, t.name as team_name
      FROM notification n
      JOIN user u ON n.sender_id = u.id
      JOIN team t ON n.team_id = t.id
      WHERE n.user_id = ?
      ORDER BY n.created_at DESC
    `, [userId]);

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error in getUserNotifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Respond to a notification
 * @route POST /api/notifications/:id/respond
 */
const respondToNotification = async (req, res) => {
  try {
    const userId = req.userId;
    const notificationId = req.params.id;
    const { action } = req.body;

    // Validate request
    if (!action || !['ACCEPT', 'DECLINE'].includes(action)) {
      return res.status(400).json({ message: 'Valid action (ACCEPT or DECLINE) is required' });
    }

    // Get notification
    const notifications = await query(
      'SELECT * FROM notification WHERE id = ?',
      [notificationId]
    );

    if (notifications.length === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    const notification = notifications[0];

    // Check if notification belongs to the user
    if (notification.user_id !== userId) {
      return res.status(403).json({ message: 'You can only respond to your own notifications' });
    }

    // Check if notification is still pending
    if (notification.status !== 'PENDING') {
      return res.status(400).json({ message: 'This notification has already been responded to' });
    }

    // Update notification status
    const status = action === 'ACCEPT' ? 'ACCEPTED' : 'DECLINED';
    await query(
      'UPDATE notification SET status = ? WHERE id = ?',
      [status, notificationId]
    );

    // If accepted and it's a team invite, add user to team
    if (action === 'ACCEPT' && notification.type === 'TEAM_INVITE') {
      // Check if team is full
      const team = await query('SELECT * FROM team WHERE id = ?', [notification.team_id]);
      const hackathonId = team[0].hackathon_id;
      const hackathon = await query('SELECT team_size_limit FROM hackathon WHERE id = ?', [hackathonId]);
      const teamSizeLimit = hackathon[0].team_size_limit;

      const memberCount = await query(
        'SELECT COUNT(*) as count FROM team_member WHERE team_id = ?',
        [notification.team_id]
      );

      if (memberCount[0].count >= teamSizeLimit) {
        await query(
          'UPDATE notification SET status = ? WHERE id = ?',
          ['DECLINED', notificationId]
        );
        return res.status(403).json({ message: 'Team is full' });
      }

      // Check if user is already registered for the hackathon
      const registrations = await query(
        'SELECT * FROM registration WHERE user_id = ? AND hackathon_id = ?',
        [userId, hackathonId]
      );

      // If not registered, register the user for the hackathon
      if (registrations.length === 0) {
        // Register user for the hackathon
        const result = await query(
          'INSERT INTO registration (user_id, hackathon_id) VALUES (?, ?)',
          [userId, hackathonId]
        );

        const registrationId = result.insertId;

        // Add default skills (can be updated later by the user)
        await query(
          'INSERT INTO registration_skill (registration_id, skill) VALUES (?, ?)',
          [registrationId, 'Team Member']
        );

        console.log(`User ${userId} automatically registered for hackathon ${hackathonId}`);
      }

      // Add user to team
      await query(
        'INSERT INTO team_member (team_id, user_id) VALUES (?, ?)',
        [notification.team_id, userId]
      );
    }

    res.status(200).json({
      id: parseInt(notificationId),
      status
    });
  } catch (error) {
    console.error('Error in respondToNotification:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserNotifications,
  respondToNotification
};
