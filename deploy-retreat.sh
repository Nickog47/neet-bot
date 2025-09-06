#!/bin/bash

# 🎖️ DEPLOY 2.0 & RETREAT LAUNCHER 🎖️
# SGT-LEVEL COMMAND INTERFACE

echo "🎖️🎖️🎖️ MARINE CORPS DEPLOYMENT SYSTEM 🎖️🎖️🎖️"
echo "🚀 LAUNCHING COMMAND CENTER..."
echo ""

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

# Make sure dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Launch the Marine Corps Command Center
echo "🎖️ LAUNCHING SGT COMMAND CENTER..."
node command-center.js
