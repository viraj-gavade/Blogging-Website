#!/bin/bash

echo "===== Starting Deployment Process ====="

# Install dependencies in root directory
echo "Installing root dependencies..."
npm install

# Install Frontend dependencies and build
echo "Building Frontend..."
cd Frontend
npm ci
npx vite build
cd ..

# Install Backend dependencies
echo "Installing Backend dependencies..."
cd Backend
npm install
cd ..

# Start the application
echo "Starting application in production mode..."
NODE_ENV=production node Backend/app.js
