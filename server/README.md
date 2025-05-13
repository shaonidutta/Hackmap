# HackMap API Server

This is the backend server for the HackMap application, providing RESTful API endpoints for the frontend client.

## Features

- **User Authentication**: Secure signup, login, and logout functionality with JWT
- **Hackathon Management**: Create, list, view, and register for hackathons
- **Team Collaboration**: Create teams, invite members, and join existing teams
- **Idea Sharing**: Submit project ideas, add comments, and track endorsements
- **Notifications System**: Real-time notifications for team invitations and updates

## Tech Stack

- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **MySQL/PostgreSQL**: Database
- **JWT**: Authentication
- **bcrypt**: Password hashing
- **dotenv**: Environment variable management
- **cors**: Cross-origin resource sharing

## API Documentation

See [api-flow.md](../api-flow.md) for detailed API documentation.

## Database Schema

See [db-schema.md](../db-schema.md) for the database schema.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MySQL or PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd hackmap/server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database Configuration
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=hackmap
   DB_PORT=3306

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=24h

   # Email Configuration (optional)
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   EMAIL_FROM=noreply@example.com
   ```

4. Set up the database:
   - Create a new database in MySQL/PostgreSQL
   - Run the database schema script (see [Database Schema](../db-schema.md))

5. Start the server:
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## Available Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with nodemon for auto-reloading

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/logout` - Logout a user

### Users

- `GET /api/users/me` - Get current user profile
- `GET /api/users/me/teams` - Get current user's teams
- `GET /api/users/me/ideas` - Get current user's ideas

### Hackathons

- `GET /api/hackathons` - Get all hackathons
- `POST /api/hackathons` - Create a new hackathon
- `GET /api/hackathons/:id` - Get a specific hackathon
- `POST /api/hackathons/:id/register` - Register for a hackathon
- `POST /api/hackathons/:id/teams` - Create a team for a hackathon
- `PUT /api/hackathons/:id` - Update a hackathon

### Teams

- `GET /api/teams/:id` - Get team details
- `POST /api/teams/:id/invite` - Invite a user to a team
- `POST /api/teams/join` - Join a team using a join code
- `POST /api/teams/:id/ideas` - Create a new idea for a team

### Ideas

- `GET /api/ideas` - Get all ideas
- `GET /api/ideas/:id` - Get idea details
- `POST /api/ideas/:id/comments` - Add a comment to an idea
- `POST /api/ideas/:id/endorse` - Endorse an idea

### Notifications

- `GET /api/notifications` - Get all notifications for the current user
- `POST /api/notifications/:id/respond` - Respond to a notification

## Project Structure

```
server/
├── config/             # Configuration files
│   └── db.config.js    # Database configuration
├── controllers/        # Request handlers
│   ├── auth.controller.js
│   ├── hackathon.controller.js
│   ├── idea.controller.js
│   ├── notification.controller.js
│   ├── team.controller.js
│   └── user.controller.js
├── middleware/         # Middleware functions
│   └── auth.middleware.js
├── routes/             # API routes
│   ├── auth.routes.js
│   ├── hackathon.routes.js
│   ├── idea.routes.js
│   ├── notification.routes.js
│   ├── team.routes.js
│   └── user.routes.js
├── utils/              # Utility functions
│   ├── auth.utils.js
│   └── common.utils.js
├── .env                # Environment variables
├── index.js            # Entry point
└── package.json        # Dependencies and scripts
```

## Authentication

The application uses JWT (JSON Web Tokens) for authentication. When a user logs in, a JWT is generated and returned to the client. This token must be included in the `Authorization` header of subsequent requests.

## Error Handling

The API uses standard HTTP status codes for error responses:

- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Authentication required or invalid credentials
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `500 Internal Server Error` - Server error

Error responses include a message field with details about the error.

## Deployment

The server can be deployed to any Node.js hosting platform such as:

- Heroku
- AWS Elastic Beanstalk
- DigitalOcean
- Vercel
- Netlify

Make sure to set the appropriate environment variables in your hosting platform.