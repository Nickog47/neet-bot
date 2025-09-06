#!/bin/bash
# 💀 OPERATION SILICON VALLEY BANK - MAXIMUM RISK LAUNCHER 💀
# POVERTY OR RICHES - NO MIDDLE GROUND

echo "💀 ═══════════════════════════════════════════════════════════ 💀"
echo "🔥        OPERATION SILICON VALLEY BANK INITIATED            🔥"
echo "💀              MAXIMUM RISK MODE ACTIVATED                  💀"
echo "💀 ═══════════════════════════════════════════════════════════ 💀"
echo ""
echo "🚨 WARNING: THIS BOT USES MAXIMUM RISK PARAMETERS 🚨"
echo "💀 YOU CAN LOSE EVERYTHING - POVERTY OR RICHES 💀"
echo ""
echo "📊 MAXIMUM RISK FEATURES:"
echo "   🎯 25% Stop Loss / 100% Take Profit"
echo "   📦 98% Position Size with 10x Leverage"
echo "   ⚡ 0.5 Second Check Interval"
echo "   🐋 Whale Following & FOMO Mode"
echo "   🚀 1000 Trades Per Day Limit"
echo ""
echo "💀 Are you ready to risk it all? (y/N)"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo ""
    echo "💀 MAXIMUM RISK MODE CONFIRMED 💀"
    echo "🚨 NO MERCY - POVERTY OR RICHES 🚨"
    echo ""
    
    # Setup environment
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    
    # Navigate to bot directory
    cd "$(dirname "$0")"
    
    # Copy maximum risk config
    cp .env_max_risk .env
    
    # Auto-install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing dependencies for maximum risk mode..."
        npm install
    fi
    
    # Launch maximum risk bot
    echo "💀 LAUNCHING MAXIMUM RISK ALGORITHM..."
    echo "🔥 POVERTY OR RICHES - LET'S FIND OUT 🔥"
    echo ""
    echo "Press Ctrl+C to abort mission"
    echo "💀 ═══════════════════════════════════════════════════════════ 💀"
    
    while true; do
        node index_max_risk.js
        echo "💀 Bot crashed! Restarting in 3 seconds (maximum risk mode)..."
        sleep 3
    done
else
    echo ""
    echo "🛑 MISSION ABORTED - WISE CHOICE 🛑"
    echo "💡 Use ./launch-bot.sh for normal risk mode"
    echo ""
fi
