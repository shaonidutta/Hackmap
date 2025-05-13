const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { testConnection } = require('./config/db.config');

// Load environment variables
dotenv.config();

// Import routes (to be created)
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const hackathonRoutes = require('./routes/hackathon.routes');
const createHackathonRoutes = require('./routes/create-hackathon.routes');
const teamRoutes = require('./routes/team.routes');
const ideaRoutes = require('./routes/idea.routes');
const notificationRoutes = require('./routes/notification.routes');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  if (req.method === 'POST') {
    console.log('Body:', req.body);
  }
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/create-hackathon', createHackathonRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/notifications', notificationRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to HackMap API' });
});

// Test route for hackathons
app.post('/api/test-hackathons', (req, res) => {
  console.log('Test hackathon route hit');
  console.log('Request body:', req.body);
  res.status(201).json({ message: 'Test hackathon created successfully', data: req.body });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  // Test database connection
  try {
    const connected = await testConnection();
    if (connected) {
      console.log('Database connection successful');
    } else {
      console.error('Database connection failed');
    }
  } catch (error) {
    console.error('Error testing database connection:', error);
  }
});

module.exports = app;
