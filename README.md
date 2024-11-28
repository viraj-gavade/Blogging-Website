# Blogging Website

## 🌐 Live Demo

**[View Live Application](https://blogify-gr5rm1tg.b4a.run/api/v1/user/signup)**

## Overview

A full-stack blogging platform featuring OAuth2 authentication for secure user management. This web application provides a scalable and user-friendly environment for creating, editing, and managing blog posts.

## 🌟 Features

### User Management
- Secure OAuth2 authentication
- User registration and login
- Profile management

### Blog Functionality
- Create new blog posts
- Edit existing posts
- Delete posts
- View individual and list of blog posts
- Responsive and intuitive user interface

## 🛠 Technologies Used

### Backend
- Node.js
- Express.js

### Frontend
- EJS (Embedded JavaScript Templates)

### Database
- MongoDB

### DevOps & Deployment
- Docker
- Cloud Hosting

## 🚀 Getting Started

### Prerequisites
- Node.js
- MongoDB
- Docker (optional)

### Installation

1. Clone the repository
```bash
git clone https://github.com/viraj-gavade/Blogging-Website.git
cd Blogging-Website
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
Create a `.env` file with necessary configuration:
```
MONGODB_URI=your_mongodb_connection_string
OAUTH_CLIENT_ID=your_oauth_client_id
OAUTH_CLIENT_SECRET=your_oauth_client_secret
SESSION_SECRET=your_session_secret
```

4. Start the development server
```bash
npm start
```

Access the application at `http://localhost:PORT`

## 📂 Folder Structure

```
Blogging-Website/
│
├── controllers/       # Application logic
├── models/            # Database schemas
├── routes/            # API endpoints
└── views/             # EJS templates
```

### Key Directories
- **Controllers**: Handle application logic and request processing
- **Models**: Define MongoDB schemas for data modeling
- **Routes**: Define API endpoints and route handlers
- **Views**: Contains EJS templates for rendering frontend

## 🌐 API Endpoints

### Authentication
- `GET /login`: Initiate OAuth2 login
- `GET /logout`: End user session

### Blog Posts
- `GET /posts`: Retrieve all blog posts
- `GET /posts/:id`: Retrieve specific post
- `POST /posts`: Create new blog post
- `PUT /posts/:id`: Update existing post
- `DELETE /posts/:id`: Delete a post

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
