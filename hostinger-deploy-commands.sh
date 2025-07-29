#!/bin/bash
# Script deployment untuk Hostinger
echo "🚀 Starting Goldium deployment..."

# Masuk ke direktori public_html
cd public_html

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build aplikasi
echo "🔨 Building application..."
npm run build

# Set environment variables
echo "⚙️ Setting up environment..."
cp .env.example .env.local

# Start aplikasi (opsional)
echo "🌟 Starting application..."
# npm start

echo "✅ Deployment completed!"
echo "🌐 Your Goldium app should be live now!"