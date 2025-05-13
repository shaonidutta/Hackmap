# HackMap - Hackathon Management Platform

![HackMap Banner](https://via.placeholder.com/1200x300/4F46E5/FFFFFF?text=HackMap+Platform)

HackMap is a comprehensive platform designed to streamline the organization, participation, and collaboration in hackathons. It provides powerful tools for hackathon organizers to create and manage events, while offering participants an intuitive interface to discover hackathons, form teams, share project ideas, and collaborate effectively.

Built with modern web technologies, HackMap aims to solve common challenges in hackathon management:
- **For organizers**: Simplifying event creation, team formation, and idea evaluation
- **For participants**: Providing a seamless experience for discovering events, joining teams, and showcasing projects
- **For everyone**: Creating a collaborative environment that fosters innovation and learning

> "HackMap transforms the hackathon experience by connecting organizers and participants through an intuitive, feature-rich platform."

## Project Overview

HackMap follows a modern client-server architecture, designed for scalability, maintainability, and performance:

1. **Client**: A React-based frontend application built with TypeScript, Vite, and Tailwind CSS that provides a responsive and interactive user interface
2. **Server**: A Node.js backend API server built with Express and MySQL/PostgreSQL that handles data persistence, authentication, and business logic

The application uses a RESTful API architecture for communication between the client and server, with JWT (JSON Web Tokens) for secure authentication. The modular design allows for easy extension and maintenance of features.

### Key Architectural Decisions

- **Separation of Concerns**: Clear separation between frontend and backend
- **Stateless Authentication**: JWT-based authentication for scalability
- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **Type Safety**: TypeScript throughout the application
- **Component-Based UI**: Reusable React components
- **Relational Database**: Structured data model with proper relationships

## Features

HackMap offers a comprehensive set of features designed to enhance the hackathon experience for all stakeholders.

### For Organizers

- **Hackathon Creation and Management**
  - Create hackathons with customizable details (title, theme, description)
  - Set important dates (start date, end date, registration deadline)
  - Define prizes and team size limits
  - Add tags to categorize hackathons (e.g., AI, Web Development, Mobile)
  - Edit hackathon details after creation

- **Team and Participant Management**
  - View all registered participants
  - Monitor team formation progress
  - Access team details and project ideas
  - Send announcements to all participants

- **Idea Evaluation**
  - View all submitted project ideas
  - See endorsement counts and comments
  - Track project development progress
  - Provide feedback directly to teams

### For Participants

- **Hackathon Discovery**
  - Browse all available hackathons with filtering options
  - View hackathon details, rules, and prizes
  - See registration deadlines and event dates
  - Register for interesting hackathons

- **Team Formation and Collaboration**
  - Create new teams with name and description
  - Generate and share team invitation codes
  - Join existing teams using invitation codes
  - View team member profiles and skills
  - Communicate with team members

- **Project Ideation and Development**
  - Submit project ideas with detailed descriptions
  - List technologies to be used in the project
  - Receive feedback through comments
  - Track endorsements from other participants
  - Update project progress during the hackathon

- **Community Interaction**
  - Endorse interesting project ideas
  - Comment on other teams' projects
  - Receive notifications for team activities
  - Build a network of hackathon participants

### General Features

- **User Management**
  - Secure signup and login process
  - JWT-based authentication
  - Password hashing for security
  - User profile management
  - Skill listing and management

- **Notification System**
  - Team invitation notifications
  - Comment and endorsement alerts
  - Hackathon deadline reminders
  - System announcements
  - Email notifications for team invitations

- **User Experience**
  - Responsive design for all devices
  - Intuitive navigation and user flows
  - Modern UI with animations and transitions
  - Consistent design language throughout
  - Accessibility considerations

- **Security**
  - Protected routes for authenticated users
  - Role-based access control
  - Secure API endpoints
  - Data validation and sanitization

## Tech Stack

HackMap leverages modern technologies to deliver a robust, scalable, and maintainable application.

### Frontend

- **Core Technologies**
  - [React](https://reactjs.org/) - A JavaScript library for building user interfaces
  - [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript
  - [Vite](https://vitejs.dev/) - Next-generation frontend tooling

- **Styling and UI**
  - [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
  - [Framer Motion](https://www.framer.com/motion/) - Animation library for React

- **State Management and Routing**
  - [React Context API](https://reactjs.org/docs/context.html) - For global state management
  - [React Router](https://reactrouter.com/) - For navigation and routing

- **API Communication**
  - [Axios](https://axios-http.com/) - Promise-based HTTP client
  - [JWT](https://jwt.io/) - For secure authentication

- **Development Tools**
  - [ESLint](https://eslint.org/) - For code linting
  - [Prettier](https://prettier.io/) - For code formatting

### Backend

- **Core Technologies**
  - [Node.js](https://nodejs.org/) - JavaScript runtime
  - [Express](https://expressjs.com/) - Web framework for Node.js

- **Database**
  - [MySQL](https://www.mysql.com/) / [PostgreSQL](https://www.postgresql.org/) - Relational database
  - [SQL](https://www.w3schools.com/sql/) - For database queries

- **Authentication and Security**
  - [bcrypt](https://www.npmjs.com/package/bcrypt) - For password hashing
  - [JSON Web Tokens](https://jwt.io/) - For stateless authentication
  - [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) - For cross-origin resource sharing

- **Communication**
  - [Nodemailer](https://nodemailer.com/) - For sending email notifications

- **Development Tools**
  - [Nodemon](https://nodemon.io/) - For automatic server restarts during development
  - [dotenv](https://www.npmjs.com/package/dotenv) - For environment variable management

### DevOps and Deployment

- **Version Control**
  - [Git](https://git-scm.com/) - For version control
  - [GitHub](https://github.com/) - For repository hosting

- **Potential Deployment Platforms**
  - [Vercel](https://vercel.com/) - For frontend deployment
  - [Heroku](https://www.heroku.com/) - For backend deployment
  - [AWS](https://aws.amazon.com/) - For scalable cloud hosting

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14.0.0 or later)
- [npm](https://www.npmjs.com/) (v6.0.0 or later) or [yarn](https://yarnpkg.com/) (v1.22.0 or later)
- [MySQL](https://www.mysql.com/) or [PostgreSQL](https://www.postgresql.org/) database

### Detailed Setup Instructions

To run this project locally, you'll need to set up both the client and server components. Detailed setup instructions are available in their respective README files:

- [Client Setup](./client/README.md) - Frontend application setup
- [Server Setup](./server/README.md) - Backend API server setup

### Environment Configuration

Both the client and server require environment variables to be set up. Example files are provided:

- `client/.env.example` - Template for client environment variables
- `server/.env.example` - Template for server environment variables

Copy these files to create your own `.env` files and update the values according to your local setup.

## Project Structure

The HackMap project follows a clear and organized structure to maintain separation of concerns and facilitate development.

```
hackmap/
├── client/                     # Frontend React application
│   ├── public/                 # Static assets
│   ├── src/                    # Source code
│   │   ├── api/                # API configuration
│   │   │   ├── axios.ts        # Axios instance setup
│   │   │   ├── interceptors.ts # Request/response interceptors
│   │   │   └── urls.ts         # API endpoint URLs
│   │   │
│   │   ├── components/         # Reusable UI components
│   │   │   ├── common/         # Common components (Button, Input, etc.)
│   │   │   ├── layout/         # Layout components (Header, Footer, etc.)
│   │   │   └── ...             # Feature-specific components
│   │   │
│   │   ├── context/            # React context providers
│   │   │   ├── AuthContext.tsx # Authentication context
│   │   │   └── ...             # Other contexts
│   │   │
│   │   ├── hooks/              # Custom React hooks
│   │   ├── interfaces/         # TypeScript interfaces
│   │   ├── pages/              # Page components
│   │   ├── routes/             # Routing configuration
│   │   ├── services/           # Service modules for API calls
│   │   ├── styles/             # Global styles
│   │   └── utils/              # Utility functions
│   │
│   ├── .env.example            # Example environment variables
│   ├── package.json            # Dependencies and scripts
│   └── ...                     # Configuration files
│
├── server/                     # Backend Node.js API
│   ├── config/                 # Configuration files
│   │   └── db.config.js        # Database configuration
│   │
│   ├── controllers/            # Request handlers
│   │   ├── auth.controller.js  # Authentication controller
│   │   ├── hackathon.controller.js
│   │   ├── idea.controller.js
│   │   ├── notification.controller.js
│   │   ├── team.controller.js
│   │   └── user.controller.js
│   │
│   ├── middleware/             # Middleware functions
│   │   └── auth.middleware.js  # Authentication middleware
│   │
│   ├── routes/                 # API routes
│   │   ├── auth.routes.js
│   │   ├── hackathon.routes.js
│   │   ├── idea.routes.js
│   │   ├── notification.routes.js
│   │   ├── team.routes.js
│   │   └── user.routes.js
│   │
│   ├── utils/                  # Utility functions
│   │   ├── auth.utils.js
│   │   ├── common.utils.js
│   │   └── email.utils.js        # Email sending utilities
│   │
│   ├── .env.example            # Example environment variables
│   ├── index.js                # Entry point
│   └── package.json            # Dependencies and scripts
│
├── .gitignore                  # Git ignore file
├── api-flow.md                 # API documentation
├── db-schema.md                # Database schema documentation
└── README.md                   # Project documentation
```

### Key Directories and Files

- **Client**
  - `src/api`: Configuration for API communication
  - `src/components`: Reusable UI components
  - `src/context`: React context providers for state management
  - `src/pages`: Page components for different routes
  - `src/services`: Service modules for API calls

- **Server**
  - `controllers`: Handle request processing and response generation
  - `middleware`: Functions that process requests before they reach controllers
  - `routes`: Define API endpoints and connect them to controllers
  - `config`: Configuration files for database and other services
  - `utils`: Utility functions used across the application

## Quick Start

Follow these steps to get the application running on your local machine:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/shaonidutta/Hackmap.git
   cd hackmap
   ```

2. **Set up the server**:
   ```bash
   cd server
   npm install

   # Create .env file
   cp .env.example .env

   # Edit .env file with your database credentials and other settings
   # Then start the server
   npm run dev
   ```

3. **Set up the client**:
   ```bash
   cd ../client
   npm install

   # Create .env file
   cp .env.example .env

   # Start the development server
   npm run dev
   ```

4. **Access the application**:
   - Open your browser and navigate to `http://localhost:5173`
   - The API server will be running at `http://localhost:5000`

### Troubleshooting

If you encounter any issues during setup:

- **Database Connection Issues**: Ensure your database credentials in `.env` are correct and the database server is running
- **Port Conflicts**: If ports 5173 or 5000 are already in use, you can change them in the respective `.env` files
- **Node Version**: Ensure you're using Node.js v14 or later
- **Missing Dependencies**: If you encounter errors about missing dependencies, try running `npm install` again

### Development Workflow

1. Start both the client and server in development mode
2. Make changes to the code
3. The servers will automatically reload when changes are detected
4. Test your changes in the browser

## API Documentation

The HackMap API follows RESTful principles and is organized by resource type. All endpoints require authentication except for the login and signup endpoints.

### API Endpoints Overview

- **Authentication**
  - `POST /api/auth/signup` - Register a new user
  - `POST /api/auth/login` - Login a user
  - `POST /api/auth/logout` - Logout a user

- **Users**
  - `GET /api/users/me` - Get current user profile
  - `GET /api/users/me/teams` - Get current user's teams
  - `GET /api/users/me/ideas` - Get current user's ideas

- **Hackathons**
  - `GET /api/hackathons` - Get all hackathons
  - `POST /api/hackathons` - Create a new hackathon
  - `GET /api/hackathons/:id` - Get a specific hackathon
  - `POST /api/hackathons/:id/register` - Register for a hackathon
  - `POST /api/hackathons/:id/teams` - Create a team for a hackathon
  - `PUT /api/hackathons/:id` - Update a hackathon

- **Teams**
  - `GET /api/teams/:id` - Get team details
  - `POST /api/teams/:id/invite` - Invite a user to a team
  - `POST /api/teams/join` - Join a team using a join code
  - `POST /api/teams/:id/ideas` - Create a new idea for a team

- **Ideas**
  - `GET /api/ideas` - Get all ideas
  - `GET /api/ideas/:id` - Get idea details
  - `POST /api/ideas/:id/comments` - Add a comment to an idea
  - `POST /api/ideas/:id/endorse` - Endorse an idea

- **Notifications**
  - `GET /api/notifications` - Get all notifications for the current user
  - `POST /api/notifications/:id/respond` - Respond to a notification

### API Response Format

All API responses follow a consistent format:

```json
{
  "data": { ... },  // The response data (may be an object or array)
  "message": "...", // Optional message (usually for success/error information)
  "error": "..."    // Optional error message (only present if there's an error)
}
```

### Authentication

The API uses JWT (JSON Web Tokens) for authentication. After logging in, you'll receive a token that should be included in the `Authorization` header of subsequent requests:

```
Authorization: Bearer <your-token>
```

For detailed API documentation including request/response examples, see the [API Flow](./api-flow.md) document.

## Database Schema

The application uses a relational database with the following main tables:

### Core Tables

- **Users**: Stores user information and authentication details
  - `id`: Primary key
  - `email`: User's email address (unique)
  - `password_hash`: Hashed password
  - `username`: User's display name
  - `created_at`, `updated_at`: Timestamps

- **Hackathons**: Stores hackathon event information
  - `id`: Primary key
  - `organizer_id`: Foreign key to users table
  - `title`, `theme`: Event details
  - `start_date`, `end_date`, `registration_deadline`: Event dates
  - `prizes`, `team_size_limit`: Event rules
  - `created_at`, `updated_at`: Timestamps

- **Teams**: Stores team information
  - `id`: Primary key
  - `hackathon_id`: Foreign key to hackathons table
  - `name`, `description`: Team details
  - `join_code`: Code for joining the team
  - `created_at`, `updated_at`: Timestamps

- **Ideas**: Stores project ideas
  - `id`: Primary key
  - `team_id`: Foreign key to teams table
  - `summary`: Project description
  - `tech`: Technologies used (JSON array)
  - `created_at`, `updated_at`: Timestamps

### Relationship Tables

- **Team Members**: Links users to teams
- **Registrations**: Links users to hackathons
- **Comments**: Stores comments on ideas
- **Endorsements**: Tracks idea endorsements
- **Notifications**: Stores user notifications

### Database Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    Users    │       │  Hackathons │       │    Teams    │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id          │       │ id          │       │ id          │
│ email       │       │ organizer_id│◄──────┤ hackathon_id│
│ password    │       │ title       │       │ name        │
│ username    │       │ theme       │       │ description │
└─────────────┘       │ start_date  │       │ join_code   │
       ▲              │ end_date    │       └─────────────┘
       │              └─────────────┘              ▲
       │                     ▲                     │
       │                     │                     │
┌──────┴────────┐    ┌──────┴────────┐    ┌───────┴───────┐
│ Team Members  │    │ Registrations │    │     Ideas     │
├───────────────┤    ├───────────────┤    ├───────────────┤
│ team_id       │    │ user_id       │    │ id            │
│ user_id       │    │ hackathon_id  │    │ team_id       │
└───────────────┘    └───────────────┘    │ summary       │
                                          │ tech          │
                                          └───────────────┘
                                                  ▲
                                                  │
                                 ┌────────────────┴───────────────┐
                                 │                                │
                          ┌──────┴───────┐                ┌───────┴───────┐
                          │   Comments   │                │  Endorsements │
                          ├──────────────┤                ├───────────────┤
                          │ id           │                │ user_id       │
                          │ idea_id      │                │ idea_id       │
                          │ user_id      │                └───────────────┘
                          │ content      │
                          └──────────────┘
```

For detailed database schema information including all fields and relationships, see the [Database Schema](./db-schema.md) document.

## Testing

The HackMap application includes testing capabilities for both the frontend and backend components.

### Frontend Testing

To run frontend tests:

```bash
cd client
npm test
```

### Backend Testing

To run backend tests:

```bash
cd server
npm test
```

## Deployment

HackMap can be deployed to various hosting platforms:

### Frontend Deployment

The React frontend can be deployed to:
- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [GitHub Pages](https://pages.github.com/)

Build the frontend for production:

```bash
cd client
npm run build
```

### Backend Deployment

The Node.js backend can be deployed to:
- [Heroku](https://www.heroku.com/)
- [DigitalOcean](https://www.digitalocean.com/)
- [AWS Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/)

Prepare the backend for production:

```bash
cd server
npm start
```

## Contributing

Contributions to HackMap are welcome! Here's how you can contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style and conventions
- Write clean, maintainable, and testable code
- Add appropriate comments and documentation
- Update the README.md with details of changes if applicable
- The PR should work in all environments (Windows, macOS, Linux)

## Project Assumptions

The HackMap project is built on several key assumptions that guide its design and implementation:

1. **Authentication**: Users must be authenticated to access most API endpoints
2. **Organizer Separation**: A user cannot be both an organizer and a participant in the same hackathon
3. **Team Membership**: Users can be members of multiple teams, but only one team per hackathon
4. **Email Delivery**: Email delivery is not guaranteed and the system will continue to function even if emails fail to send
5. **Database Integrity**: The database maintains referential integrity through foreign key constraints
6. **Client-Side Validation**: While the server performs validation, client-side validation is also expected
7. **Stateless API**: The API is designed to be stateless, with all necessary information included in each request
8. **Notification System**: Notifications are stored in the database and can be retrieved by users
9. **Email Configuration**: Email configuration is optional and the system will work without it

## Email Notification System

The application includes an email notification system for team invitations:

1. **Implementation**: Uses nodemailer with Gmail SMTP for sending emails
2. **Fallback Mechanism**: If email credentials are not provided, falls back to logging emails to console
3. **Email Templates**: HTML templates for professional-looking emails
4. **Triggered Events**: Emails are sent when:
   - A user is invited to join a team

To configure email notifications:
- For Gmail: Set `EMAIL_USERNAME`, `EMAIL_PASSWORD`, and `EMAIL_FROM_NAME` in .env
- For other SMTP servers: Set `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, and `EMAIL_FROM`

## Frequently Asked Questions

### General

**Q: What is HackMap?**
A: HackMap is a comprehensive platform for organizing and participating in hackathons, facilitating team formation, idea sharing, and collaboration.

**Q: Is HackMap free to use?**
A: Yes, HackMap is an open-source project available for free use and modification.

### Technical

**Q: Can I use HackMap with a different database?**
A: Yes, with some modifications. The application is designed to work with MySQL/PostgreSQL, but can be adapted for other databases.

**Q: How do I reset my password?**
A: Currently, password reset functionality is planned for future releases.

**Q: Do I need to configure email settings?**
A: No, email configuration is optional. If not configured, the system will log email content to the console instead of sending actual emails.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/) - Frontend library
- [Node.js](https://nodejs.org/) - Backend runtime
- [Express](https://expressjs.com/) - Web framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [MySQL](https://www.mysql.com/) / [PostgreSQL](https://www.postgresql.org/) - Database
- [JWT](https://jwt.io/) - Authentication
