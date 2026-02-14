#!/bin/bash

# Inventory Management System Deployment Script
# This script helps prepare the frontend for Netlify deployment

echo "🚀 Preparing Inventory Management System for deployment..."

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the frontend directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the frontend
echo "🔨 Building frontend for production..."
npm run build

# Check if build was successful
if [ -d "dist" ]; then
    echo "✅ Build successful! The 'dist' folder is ready for Netlify deployment."
    echo ""
    echo "📋 Next steps:"
    echo "1. Go to netlify.com"
    echo "2. Drag and drop the 'dist' folder to deploy"
    echo "3. Or connect your GitHub repository for automatic deployments"
    echo ""
    echo "🔗 Don't forget to update your backend URL in .env.production!"
else
    echo "❌ Build failed. Please check the error messages above."
    exit 1
fi
