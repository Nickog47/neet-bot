#!/bin/bash

# 🐋 WHALE TRAP DETECTOR LAUNCHER 🐋
# Anti-manipulation trading strategy

echo "🎯 ═══════════════════════════════════════════════════════════ 🎯"
echo "🐋              WHALE TRAP DETECTOR LAUNCHER                🐋"
echo "🎯 ═══════════════════════════════════════════════════════════ 🎯"
echo ""

# Safety warning
echo "⚠️  WHALE TRAP STRATEGY ACTIVE:"
echo "   • Will sell 70% on drops after pumps"
echo "   • Will keep 30% in case whales are tricking us"
echo "   • Designed to detect penny stock manipulation tactics"
echo ""

# Check if user wants to continue
read -p "🎯 Ready to hunt whale traps? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "🛑 Whale trap hunt cancelled"
    exit 1
fi

echo ""
echo "🚀 Loading whale trap environment..."

# Load whale trap environment
if [ -f ".env_whale_trap" ]; then
    export $(cat .env_whale_trap | grep -v '^#' | xargs)
    echo "✅ Whale trap environment loaded"
else
    echo "❌ .env_whale_trap file not found!"
    exit 1
fi

echo ""
echo "🎯 STRATEGY PARAMETERS:"
echo "   📊 Pump threshold: ${PUMP_THRESHOLD}%"
echo "   📉 Drop trigger: ${DROP_AFTER_PUMP}%"
echo "   💸 Partial sell: ${PARTIAL_SELL_PERCENTAGE}%"
echo "   🎯 Keep position: ${KEEP_PERCENTAGE}%"
echo "   ⏰ Check interval: ${CHECK_INTERVAL}ms"
echo ""

echo "🐋 Starting whale trap detector..."
echo "🎯 Press Ctrl+C to stop hunting"
echo ""

# Start the whale trap detector
node whale_trap_detector.js
