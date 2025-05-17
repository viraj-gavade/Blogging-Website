# Blogify - Full Stack Blogging Platform

## 🌐 Live Demo

**[View Live Application](https://blogging-website-exjz.onrender.com/)**

## Overview

A modern full-stack blogging platform built with React and Node.js, featuring Google OAuth authentication and a clean, responsive UI. This application allows users to create, read, and comment on blog posts with a seamless user experience across devices.

## 🌟 Features

### User Experience
- Modern, responsive design built with Tailwind CSS
- Real-time feedback with toast notifications
- Smooth animations and transitions
- Dark mode support

### User Management
- Google OAuth2 authentication
- Traditional email/password authentication
- Secure user sessions with JWT

### Blog Functionality
- Create rich blog posts with image uploads
- Comment system with real-time updates
- Image preview before publishing
- Markdown support for blog content
- Show/hide password toggles for better security

## 🛠 Technologies Used

### Frontend
- React 19
- React Router v6
- Tailwind CSS
- React Toastify
- Animate.css

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Passport.js for authentication
- Multer for file uploads
- Cloudinary for image hosting

### DevOps & Deployment
- Vite for frontend development
- Render for cloud hosting
- MongoDB Atlas for database

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Google OAuth credentials (for OAuth login)
- Cloudinary account (for image uploads)

### Installation

1. Clone the repository
```bash
git clone https://github.com/viraj-gavade/Blogging-Website.git
cd Blogging-Website
```

2. Install dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../Frontend
npm install
```

3. Configure environment variables
Create a `.env` file in the Backend directory:
```
MONGODB_URI=your_mongodb_connection_string
GOOGLE_OAUTH_CLIENT_ID=your_google_oauth_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_google_oauth_client_secret
CLOUDINARY_URL=your_cloudinary_url
SESSION_SECRET=your_session_secret
```

4. Start the development server
```bash
# Start backend server
cd Backend
npm start

# In a new terminal, start frontend server
cd Frontend
npm start
```

Access the application at `http://localhost:3000`

## 📂 Folder Structure

```
Blogging-Website/
│
├── Backend/           # Server-side code
│   ├── config/        # Configuration files
│   ├── controllers/   # Request handlers
│   ├── middleware/    # Custom middleware
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   └── utils/         # Utility functions
│
└── Frontend/          # Client-side code
    ├── public/        # Static files
    ├── src/           # Source files
    │   ├── components/ # React components
    │   ├── context/    # Context API for state management
    │   ├── hooks/      # Custom React hooks
    │   ├── pages/      # Page components
    │   └── styles/     # CSS styles
```

### Key Directories
- **Backend**: Contains all server-side code, including API routes, controllers, and database models.
- **Frontend**: Contains all client-side code, including React components, pages, and styles.

## 🌐 API Endpoints

### Authentication
- `GET /auth/google`: Initiate Google OAuth login
- `GET /auth/google/callback`: Google OAuth callback URL
- `POST /auth/login`: Traditional email/password login
- `POST /auth/logout`: End user session

### Blog Posts
- `GET /api/posts`: Retrieve all blog posts
- `GET /api/posts/:id`: Retrieve specific post
- `POST /api/posts`: Create new blog post
- `PUT /api/posts/:id`: Update existing post
- `DELETE /api/posts/:id`: Delete a post

### Comments
- `GET /api/posts/:id/comments`: Retrieve comments for a post
- `POST /api/posts/:id/comments`: Add a comment to a post
- `DELETE /api/comments/:id`: Delete a comment

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes
   ```bash
   git commit -m 'Add some feature'
   ```
4. Push to your fork
   ```bash
   git push origin feature/your-feature-name
   ```
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📧 Contact

Viraj Gavade
- Email: vrajgavade17@gmail.com
- GitHub: [@viraj-gavade](https://github.com/viraj-gavade)
