# Reddit Clone

A full-stack web application that replicates the core functionality of Reddit, built with React, Node.js, Express, and MongoDB.

---

## Features

- ✅ User authentication (Register/Login)
- ✅ User profiles with karma system
- ✅ Community creation and management
- ✅ Post creation with images
- ✅ Comment system with nested replies
- ✅ Voting system (upvote/downvote)
- ✅ Search functionality
- ✅ Responsive design

---

## Technology Stack

### Frontend
- React 19.2.0
- React Router DOM 7.10.1
- Bootstrap 5.3.8
- React Bootstrap 2.10.10

### Backend
- Node.js
- Express 5.2.1
- MongoDB
- Mongoose 8.20.2
- JWT Authentication
- bcrypt for password hashing

---

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5005
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

---

## Project Structure

```
reddit-clone/
├── backend/          # Express.js backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   └── package.json
├── frontend/         # React.js frontend
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── App.js
│   └── package.json
└── README.md
```

---

## API Endpoints

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/:id` - Get user profile
- `PATCH /api/users/:id` - Update profile

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create post
- `GET /api/posts/:id` - Get post details
- `PATCH /api/posts/:id/vote` - Vote on post
- `DELETE /api/posts/:id` - Delete post

### Comments
- `GET /api/comments/:postId` - Get post comments
- `POST /api/comments` - Create comment
- `PATCH /api/comments/:id/vote` - Vote on comment
- `DELETE /api/comments/:id` - Delete comment

### Communities
- `GET /api/communities` - Get all communities
- `POST /api/communities` - Create community
- `GET /api/communities/:id` - Get community details
- `POST /api/communities/:id/join` - Join community
- `POST /api/communities/:id/leave` - Leave community

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## Key Components

### Frontend Components
- **Navbar** - Navigation with search and user menu
- **Sidebar** - Community list and quick links
- **HomePage** - Main feed with all posts
- **PostPage** - Individual post view with comments
- **ProfilePage** - User profile with tabs
- **CommunityPage** - Community detail page
- **CreatePost** - Post creation modal
- **Comment** - Comment component with nested replies

### Backend Structure
- **Models** - MongoDB schemas (User, Post, Comment, Community)
- **Controllers** - Business logic and request handling
- **Routes** - API endpoint definitions
- **Middleware** - Authentication and validation

---

## Database Schema

The application uses MongoDB with the following main collections:

- **Users** - User accounts with karma, posts, comments, and communities
- **Posts** - User posts with voting arrays and community association
- **Comments** - Nested comments with parent-child relationships
- **Communities** - Community/subreddit information with members and posts

---

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Input validation and sanitization
- Authorization checks for content modification
- CORS configuration

---

## Development Notes

- The project uses ES6 modules
- Frontend proxy is configured to `http://localhost:5005`
- Environment variables are required for backend configuration
- MongoDB connection string must be provided in `.env` file

---

## Documentation

- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference
- [Project Report](./PROJECT_REPORT.md) - Project report
