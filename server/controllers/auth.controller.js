const { query } = require('../config/db.config');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth.utils');

/**
 * Register a new user
 * @route POST /api/auth/signup
 */
const signup = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Validate request
    if (!email || !password || !username) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if email already exists
    const emailExists = await query('SELECT * FROM user WHERE email = ?', [email]);
    if (emailExists.length > 0) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Check if username already exists
    const usernameExists = await query('SELECT * FROM user WHERE username = ?', [username]);
    if (usernameExists.length > 0) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const result = await query(
      'INSERT INTO user (email, password_hash, username) VALUES (?, ?, ?)',
      [email, hashedPassword, username]
    );

    // Get the created user
    const user = await query('SELECT id, email, username, created_at FROM user WHERE id = ?', [result.insertId]);

    // Generate token for the user
    const token = generateToken(user[0]);

    // Return user data and token
    res.status(201).json({
      token,
      user: {
        id: user[0].id,
        email: user[0].email,
        username: user[0].username
      }
    });
  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Login a user
 * @route POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const users = await query('SELECT * FROM user WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Check password
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user);

    // Return user data and token
    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Logout a user
 * @route POST /api/auth/logout
 */
const logout = (req, res) => {
  // In a stateless JWT implementation, the client is responsible for removing the token
  // The server doesn't need to do anything except acknowledge the logout
  res.status(204).send();
};

module.exports = {
  signup,
  login,
  logout
};
