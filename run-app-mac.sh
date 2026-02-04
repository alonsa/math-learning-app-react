#!/bin/bash

# Disney/Astro Bot Math Learning App - macOS Launcher
# This script starts the React development server and opens the app

echo "🌟 Starting Disney/Astro Bot Math Learning App..."
echo "================================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the math-learning-app-react directory"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the development server
echo "🚀 Starting development server..."
npm run dev &

# Wait for server to be ready
echo "⏳ Waiting for server to start..."
sleep 3

# Open the app in default browser
echo "🎮 Opening Math Learning App in browser..."
open http://localhost:5173/

echo "✨ Disney/Astro Bot Math Learning App is now running!"
echo "📱 The app should open automatically in your browser"
echo "🔊 Make sure your speakers are on to hear the custom sounds!"
echo ""
echo "To stop the app, press Ctrl+C in this terminal window"
echo "================================================"

# Keep the script running so the server stays alive
wait