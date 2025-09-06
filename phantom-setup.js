#!/usr/bin/env node

/**
 * 🎖️ PHANTOM WALLET INTEGRATION SETUP 🎖️
 * SECURE PRIVATE KEY CONFIGURATION
 */

const fs = require('fs');

console.log('🎖️🎖️🎖️ PHANTOM WALLET INTEGRATION SETUP 🎖️🎖️🎖️');
console.log('🔐 SECURE PRIVATE KEY CONFIGURATION');
console.log('');

console.log('📋 INSTRUCTIONS TO GET YOUR PHANTOM PRIVATE KEY:');
console.log('');
console.log('1. 🦊 Open Phantom Wallet Extension');
console.log('2. ⚙️  Click Settings (gear icon)');
console.log('3. 🔐 Click "Export Private Key"');
console.log('4. 🔑 Enter your wallet password');
console.log('5. 📄 Copy the private key array (looks like [1,2,3,4...])');
console.log('');

console.log('⚠️ SECURITY WARNING:');
console.log('   🚨 NEVER share your private key with anyone');
console.log('   🔒 This key gives FULL access to your wallet');
console.log('   💰 Only use with funds you can afford to lose');
console.log('   🎯 Consider using a separate trading wallet');
console.log('');

console.log('🔧 SETUP STEPS:');
console.log('');
console.log('1. Copy your Phantom private key array');
console.log('2. Open the .env file in this directory');
console.log('3. Find the line: # PHANTOM_PRIVATE_KEY=[...]');
console.log('4. Remove the # and replace [...] with your actual key');
console.log('5. Save the file');
console.log('');

console.log('📝 EXAMPLE .env ENTRY:');
console.log('PHANTOM_PRIVATE_KEY=[123,45,67,89,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56]');
console.log('');

console.log('🚀 AFTER SETUP, RUN:');
console.log('   ./launch-advanced-trader.sh');
console.log('   OR');
console.log('   node advanced-neet-trader.js');
console.log('');

console.log('🎖️ CURRENT .env STATUS:');
try {
  const envContent = fs.readFileSync('.env', 'utf8');
  
  if (envContent.includes('PHANTOM_PRIVATE_KEY=[') && !envContent.includes('# PHANTOM_PRIVATE_KEY=')) {
    console.log('✅ PHANTOM_PRIVATE_KEY appears to be configured');
  } else {
    console.log('❌ PHANTOM_PRIVATE_KEY not yet configured');
    console.log('🔧 Please follow the setup steps above');
  }
} catch (error) {
  console.log('❌ Error reading .env file');
}

console.log('');
console.log('🎯 TRADING STRATEGY REMINDER:');
console.log(`   💚 Buy below $0.0165 (${50}-${100} USD)`);
console.log(`   🟡 Small sell above $0.0219 (${20}-${40} USD)`);
console.log(`   🔴 Big sell above $0.0350 (${50}-${100} USD)`);
console.log(`   🎖️ At $100M market cap: Sell 70%, Keep 30%`);
console.log('');
console.log('🎖️ MARINE CORPS TRADING PROTOCOL READY!');
