# HackMap - Hackathon Management Platform

HackMap is a comprehensive platform designed to streamline the organization, participation, and collaboration in hackathons. It provides tools for hackathon organizers to create and manage events, and for participants to join teams, share project ideas, and collaborate effectively.

## Project Overview

HackMap consists of two main components:

1. **Client**: A React-based frontend application built with TypeScript, Vite, and Tailwind CSS
2. **Server**: A Node.js backend API server built with Express and MySQL/PostgreSQL

## Features

### For Organizers
- Create and manage hackathons with customizable details (title, theme, dates, prizes, etc.)
- Set team size limits and registration deadlines
- View all teams and project ideas submitted for their hackathons

### For Participants
- Browse available hackathons and register for events
- Create or join teams using invitation codes
- Submit and collaborate on project ideas
- Endorse and comment on other teams' ideas
- Receive notifications for team invitations

### General Features
- User authentication (signup, login, logout)
- Profile management
- Real-time notifications
- Responsive design for desktop and mobile devices

## Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- Axios for API requests
- Framer Motion for animations
- Context API for state management

### Backend
- Node.js with Express
- MySQL/PostgreSQL database
- JWT for authentication
- RESTful API architecture

## Getting Started

To run this project locally, you'll need to set up both the client and server components. Detailed setup instructions are available in their respective README files:

- [Client Setup](./client/README.md)
- [Server Setup](./server/README.md)

## Project Structure

```
hackmap/
├── client/             # Frontend React application
│   ├── public/         # Static assets
│   ├── src/            # Source code
│   └── ...             # Configuration files
│
├── server/             # Backend Node.js API
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Middleware functions
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   └── ...             # Other server files
│
├── .gitignore          # Git ignore file
└── README.md           # Project documentation
```

## Quick Start

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd hackmap
   ```

2. Set up the server:
   ```bash
   cd server
   npm install
   # Create .env file with required variables (see server/.env.example)
   npm run dev
   ```

3. Set up the client:
   ```bash
   cd client
   npm install
   # Create .env file with required variables (see client/.env.example)
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## API Documentation

The API follows RESTful principles and provides endpoints for:
- Authentication (login, signup, logout)
- Hackathons (create, list, view, register)
- Teams (create, join, invite)
- Ideas (submit, view, comment, endorse)
- Notifications (list, respond)

For detailed API documentation, see the [API Flow](./api-flow.md) document.

## Database Schema

The application uses a relational database with tables for:
- Users
- Hackathons
- Teams
- Ideas
- Comments
- Endorsements
- Notifications

For detailed database schema information, see the [Database Schema](./db-schema.md) document.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
