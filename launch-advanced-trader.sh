#!/bin/bash

# 🎖️ MARINE CORPS ADVANCED NEET TRADER LAUNCHER 🎖️
# MULTI-TIER TRADING STRATEGY DEPLOYMENT

echo "🎖️🎖️🎖️ MARINE CORPS ADVANCED TRADING PROTOCOL 🎖️🎖️🎖️"
echo "🎯 DEPLOYING MULTI-TIER NEET TRADING STRATEGY"
echo ""
echo "📊 TRADING STRATEGY OVERVIEW:"
echo "   💚 BUY TRIGGER: Below $0.0165 → Buy $50-100"
echo "   🟡 SMALL SELL: Above $0.0219 → Sell $20-40"
echo "   🔴 BIG SELL: Above $0.0350 → Sell $50-100"
echo "   🎯 MARKET CAP: $100M → Sell 70%, Keep 30%"
echo ""
echo "⚠️ WARNING: THIS BOT WILL TRADE WITH REAL SOL/NEET"
echo "🔐 ENSURE PHANTOM_PRIVATE_KEY IS SET IN .env FILE"
echo ""

read -p "🎖️ Deploy Advanced Trader? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 LAUNCHING ADVANCED NEET TRADER..."
    echo "📡 Press Ctrl+C to stop trading"
    echo ""
    node advanced-neet-trader.js
else
    echo "🎖️ Mission aborted by operator"
fi
