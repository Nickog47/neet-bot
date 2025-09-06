#!/bin/bash
# NEET BOT AUTO-LAUNCHER - ONE CLICK DEPLOYMENT
# NO MANUAL SETUP REQUIRED

echo "🚀 NEET BOT AUTO-LAUNCHER INITIATED 🚀"
echo "========================================"

# Setup environment
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Navigate to bot directory
cd "$(dirname "$0")"

# Auto-install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Launch bot with auto-restart on crash
echo "🎯 LAUNCHING NEET STOP LOSS BOT..."
echo "💰 Monitoring for price drops..."
echo "🛑 Stop loss set at $0.10"
echo "⚡ Checking every 10 seconds"
echo ""
echo "Press Ctrl+C to stop the bot"
echo "========================================"

while true; do
    npm start
    echo "🔄 Bot crashed! Auto-restarting in 5 seconds..."
    sleep 5
done
