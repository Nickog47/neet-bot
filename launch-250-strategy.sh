#!/bin/bash

# 🎖️ MARINE'S DYNAMIC $150-250 NEET STRATEGY LAUNCHER 🎖️
# TACTICAL DYNAMIC BUY SYSTEM WITH SMART DECISION LOGIC

echo "🎖️🎖️🎖️ MARINE'S DYNAMIC NEET STRATEGY DEPLOYMENT 🎖️🎖️🎖️"
echo "💰 TACTICAL $150-250 DYNAMIC BUY SYSTEM"
echo ""
echo "📊 UPDATED TRADING STRATEGY:"
echo "   💚 PRIMARY: $150-250 buy at $0.0190 (DYNAMIC)"
echo "   🤖 BOT DECIDES: Optimal amount based on conditions"
echo "   💚 SECONDARY: $50-100 buy at $0.0165 (backup)"
echo "   🟡 SMALL SELL: $20-40 at $0.0219+"
echo "   🔴 BIG SELL: $50-100 at $0.0350+"
echo "   🎯 MARKET CAP: $100M → Sell 70%, Keep 30%"
echo ""
echo "🎖️ SMART DECISION FACTORS:"
echo "   📊 Market conditions and liquidity"
echo "   💰 Discount depth from current price"
echo "   🎯 Market cap positioning"
echo "   ⚡ Tactical variance for unpredictability"
echo ""
echo "⚡ POTENTIAL OUTCOMES:"
echo "   📈 $150 at $0.0190 = +84% potential to $0.0350"
echo "   📈 $250 at $0.0190 = +84% potential to $0.0350"
echo "   💰 Could turn $150-250 into $276-460+ on target"
echo ""
echo "⚠️ HIGH RISK STRATEGY - MARINE'S CHOICE"
echo "⚠️ NOT FINANCIAL ADVICE - PERSONAL STRATEGY"
echo "💰 Required: ~0.75-1.25 SOL for buy range"
echo "🔐 Phantom wallet must be configured in .env"
echo ""

# Check if phantom key is configured
if grep -q "^PHANTOM_PRIVATE_KEY=\[" .env 2>/dev/null; then
    echo "✅ Phantom wallet appears to be configured"
else
    echo "❌ Phantom wallet not configured"
    echo "🔧 Run: node phantom-setup.js first"
    echo ""
    read -p "Continue anyway with test mode? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "🎖️ Setup Phantom wallet first, then redeploy"
        exit 1
    fi
fi

echo ""
read -p "🎖️ Deploy Dynamic $150-250 NEET Strategy? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 LAUNCHING MARINE'S DYNAMIC NEET STRATEGY..."
    echo "💰 Monitoring for $0.0190 buy trigger..."
    echo "🤖 Bot will decide optimal amount ($150-250)"
    echo "📡 Press Ctrl+C to stop trading"
    echo ""
    echo "🎯 READY FOR INTELLIGENT BUY EXECUTION!"
    echo "⚠️ HIGH RISK - YOUR STRATEGY - NOT FINANCIAL ADVICE"
    echo ""
    node advanced-neet-trader.js
else
    echo "🎖️ Mission aborted by Marine"
fi
