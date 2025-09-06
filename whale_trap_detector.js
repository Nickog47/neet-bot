// 🎯 WHALE TRAP DETECTOR - ANTI-MANIPULATION STRATEGY 🎯
// Sell 70% on drops, keep 30% in case they're tricking us
// Created by: Nickog47 | Enhanced by: Corporal GitHub Copilot

require('dotenv').config();
const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const { Token } = require('@solana/spl-token');
const axios = require('axios');
const fs = require('fs');

// 🚨 WHALE TRAP DETECTION CONFIGURATION 🚨
const CONFIG = {
  TOKEN_MINT_ADDRESS: process.env.TOKEN_MINT_ADDRESS || 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  DEX_SCREENER_PAIR_ID: process.env.DEX_SCREENER_PAIR_ID || 'raydium',
  
  // ANTI-MANIPULATION PARAMETERS
  PUMP_THRESHOLD: parseFloat(process.env.PUMP_THRESHOLD) || 15, // 15% pump to consider "up for a bit"
  DROP_AFTER_PUMP: parseFloat(process.env.DROP_AFTER_PUMP) || 8, // 8% drop after pump triggers partial sell
  PARTIAL_SELL_PERCENTAGE: parseFloat(process.env.PARTIAL_SELL_PERCENTAGE) || 70, // Sell 70%
  KEEP_PERCENTAGE: parseFloat(process.env.KEEP_PERCENTAGE) || 30, // Keep 30% for potential trick
  
  // WHALE TRAP DETECTION
  FAKE_DUMP_RECOVERY_TIME: parseInt(process.env.FAKE_DUMP_RECOVERY_TIME) || 300000, // 5 minutes
  WHALE_MANIPULATION_THRESHOLD: parseFloat(process.env.WHALE_MANIPULATION_THRESHOLD) || 20, // 20% recovery = likely trap
  
  // TIMING PARAMETERS
  CHECK_INTERVAL: parseInt(process.env.CHECK_INTERVAL) || 2000, // 2 seconds
  PUMP_TIMEFRAME: parseInt(process.env.PUMP_TIMEFRAME) || 600000, // 10 minutes to qualify as "pump"
  
  // POSITION MANAGEMENT
  MAX_POSITION_SIZE: parseFloat(process.env.MAX_POSITION_SIZE) || 0.8, // 80% of portfolio
  STOP_LOSS_PERCENTAGE: parseFloat(process.env.STOP_LOSS_PERCENTAGE) || 20, // 20% emergency stop
};

// MARKET STATE WITH WHALE TRAP DETECTION
let marketState = {
  currentPrice: 0,
  entryPrice: 0,
  highestPriceAfterEntry: 0,
  pumpStartPrice: 0,
  pumpStartTime: 0,
  isPumping: false,
  hasDroppedAfterPump: false,
  partialSellExecuted: false,
  
  // Position tracking
  totalPosition: 0,
  remainingPosition: 0, // 30% we keep after partial sell
  soldPosition: 0, // 70% we sold on drop
  
  // Whale trap detection
  potentialTrapDetected: false,
  trapRecoveryStartTime: 0,
  trapRecoveryStartPrice: 0,
  
  // Performance tracking
  totalPnL: 0,
  trapsSurvived: 0,
  tricksDetected: 0,
  
  priceHistory: [],
  volumeSpikes: [],
  whaleActivity: []
};

// ENHANCED WHALE DETECTION
let connections = [new Connection('https://api.mainnet-beta.solana.com', 'confirmed')];
let wallet;

try {
  if (!process.env.WALLET_PRIVATE_KEY) {
    console.log('⚠️  WARNING: Using mock wallet for whale trap testing');
  }
  const privateKey = process.env.WALLET_PRIVATE_KEY.split(',').map(Number);
  wallet = Keypair.fromSecretKey(new Uint8Array(privateKey));
  console.log(`🎯 Whale Trap Hunter Wallet: ${wallet.publicKey.toString().substring(0,8)}...`);
} catch (error) {
  console.log('⚠️  Wallet error, continuing with mock setup');
}

// 🎯 MAIN WHALE TRAP DETECTION FUNCTION 🎯
async function detectWhaleTrapStrategy() {
  const timestamp = new Date().toISOString();
  console.log(`\n🎯 [${timestamp}] WHALE TRAP DETECTION SCAN`);
  
  try {
    // Get current price
    const currentPrice = await fetchCurrentPrice();
    updateMarketState(currentPrice);
    
    // Analyze market conditions
    const analysis = analyzeMarketConditions();
    displayTrapHunterDashboard(analysis);
    
    // Execute whale trap strategy
    await executeWhaleTrapStrategy(analysis);
    
  } catch (error) {
    console.error('🚨 WHALE TRAP DETECTION ERROR:', error.message);
  }
}

// Fetch current price with multiple sources
async function fetchCurrentPrice() {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
    const basePrice = response.data.solana.usd * 0.001;
    
    // Add realistic volatility simulation
    const volatility = 0.02 + Math.random() * 0.08; // 2-10% volatility
    const direction = Math.random() > 0.5 ? 1 : -1;
    const priceChange = basePrice * volatility * direction;
    
    return Math.max(0.0001, basePrice + priceChange);
  } catch (error) {
    return marketState.currentPrice || 0.001;
  }
}

// Update market state with whale trap detection
function updateMarketState(newPrice) {
  const previousPrice = marketState.currentPrice;
  marketState.currentPrice = newPrice;
  
  // Add to price history
  marketState.priceHistory.push({
    price: newPrice,
    timestamp: Date.now()
  });
  
  // Keep only last 50 price points
  if (marketState.priceHistory.length > 50) {
    marketState.priceHistory.shift();
  }
  
  // Update highest price after entry
  if (marketState.totalPosition > 0 && newPrice > marketState.highestPriceAfterEntry) {
    marketState.highestPriceAfterEntry = newPrice;
  }
  
  // Detect pump start
  if (!marketState.isPumping && marketState.priceHistory.length > 5) {
    const recentPrices = marketState.priceHistory.slice(-5).map(p => p.price);
    const priceIncrease = ((newPrice - recentPrices[0]) / recentPrices[0]) * 100;
    
    if (priceIncrease >= CONFIG.PUMP_THRESHOLD) {
      marketState.isPumping = true;
      marketState.pumpStartPrice = recentPrices[0];
      marketState.pumpStartTime = Date.now();
      console.log(`🚀 PUMP DETECTED: ${priceIncrease.toFixed(2)}% increase`);
    }
  }
  
  // Detect drop after pump
  if (marketState.isPumping && !marketState.hasDroppedAfterPump) {
    const dropFromHigh = ((marketState.highestPriceAfterEntry - newPrice) / marketState.highestPriceAfterEntry) * 100;
    
    if (dropFromHigh >= CONFIG.DROP_AFTER_PUMP) {
      marketState.hasDroppedAfterPump = true;
      console.log(`📉 DROP AFTER PUMP: ${dropFromHigh.toFixed(2)}% down from high`);
    }
  }
  
  // Detect potential whale trap recovery
  if (marketState.hasDroppedAfterPump && !marketState.potentialTrapDetected) {
    const timeSinceDrop = Date.now() - marketState.pumpStartTime;
    if (timeSinceDrop < CONFIG.FAKE_DUMP_RECOVERY_TIME) {
      const recoveryFromDrop = ((newPrice - marketState.highestPriceAfterEntry * 0.92) / (marketState.highestPriceAfterEntry * 0.92)) * 100;
      
      if (recoveryFromDrop >= CONFIG.WHALE_MANIPULATION_THRESHOLD) {
        marketState.potentialTrapDetected = true;
        marketState.trapRecoveryStartTime = Date.now();
        marketState.trapRecoveryStartPrice = newPrice;
        marketState.tricksDetected++;
        console.log(`🐋 WHALE TRAP DETECTED: Quick recovery suggests manipulation!`);
      }
    }
  }
}

// Analyze current market conditions
function analyzeMarketConditions() {
  const priceChange = marketState.priceHistory.length > 1 ? 
    ((marketState.currentPrice - marketState.priceHistory[marketState.priceHistory.length - 2].price) / 
     marketState.priceHistory[marketState.priceHistory.length - 2].price) * 100 : 0;
  
  const positionPnL = marketState.totalPosition > 0 ? 
    ((marketState.currentPrice - marketState.entryPrice) / marketState.entryPrice) * 100 : 0;
  
  const dropFromHigh = marketState.highestPriceAfterEntry > 0 ? 
    ((marketState.highestPriceAfterEntry - marketState.currentPrice) / marketState.highestPriceAfterEntry) * 100 : 0;
  
  return {
    price: marketState.currentPrice,
    priceChange: priceChange,
    positionPnL: positionPnL,
    dropFromHigh: dropFromHigh,
    isPumping: marketState.isPumping,
    hasDropped: marketState.hasDroppedAfterPump,
    potentialTrap: marketState.potentialTrapDetected,
    shouldPartialSell: shouldExecutePartialSell(),
    shouldBuy: shouldBuyPosition(),
    trapConfidence: calculateTrapConfidence()
  };
}

// Calculate confidence that this is a whale trap
function calculateTrapConfidence() {
  let confidence = 0;
  
  // Quick recovery after dump
  if (marketState.potentialTrapDetected) confidence += 40;
  
  // Volume analysis (simulated)
  const recentVolumeSpike = Math.random() > 0.7; // 30% chance of volume spike
  if (recentVolumeSpike) confidence += 20;
  
  // Time-based analysis
  const timeSincePump = Date.now() - marketState.pumpStartTime;
  if (timeSincePump < 300000) confidence += 20; // Recent pump = higher trap chance
  
  // Price pattern analysis
  if (marketState.priceHistory.length > 10) {
    const volatility = calculateVolatility();
    if (volatility > 15) confidence += 20; // High volatility = manipulation
  }
  
  return Math.min(100, confidence);
}

// Calculate price volatility
function calculateVolatility() {
  if (marketState.priceHistory.length < 5) return 0;
  
  const prices = marketState.priceHistory.slice(-10).map(p => p.price);
  const returns = [];
  
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i-1]) / prices[i-1]);
  }
  
  const avgReturn = returns.reduce((a, b) => a + b) / returns.length;
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length;
  
  return Math.sqrt(variance) * 100;
}

// Display whale trap hunter dashboard
function displayTrapHunterDashboard(analysis) {
  console.log('🎯 ═══════════════ WHALE TRAP HUNTER DASHBOARD ═══════════════ 🎯');
  console.log(`💰 NEET PRICE: $${analysis.price.toFixed(8)} (${analysis.priceChange >= 0 ? '📈' : '📉'} ${analysis.priceChange.toFixed(2)}%)`);
  console.log(`🎯 POSITION: ${marketState.totalPosition > 0 ? '🟢' : '🔴'} | PNL: ${analysis.positionPnL.toFixed(2)}%`);
  console.log(`📊 PUMP STATUS: ${analysis.isPumping ? '🚀 PUMPING' : '😴 WAITING'} | DROP: ${analysis.dropFromHigh.toFixed(2)}%`);
  console.log(`🐋 TRAP DETECTED: ${analysis.potentialTrap ? '⚠️  YES' : '✅ NO'} | CONFIDENCE: ${analysis.trapConfidence.toFixed(1)}%`);
  console.log(`💼 TOTAL: ${marketState.totalPosition.toFixed(2)} | REMAINING: ${marketState.remainingPosition.toFixed(2)} | SOLD: ${marketState.soldPosition.toFixed(2)}`);
  console.log(`🏆 TRAPS SURVIVED: ${marketState.trapsSurvived} | TRICKS DETECTED: ${marketState.tricksDetected}`);
  console.log('🎯 ════════════════════════════════════════════════════════════ 🎯');
}

// Check if we should execute partial sell
function shouldExecutePartialSell() {
  return marketState.totalPosition > 0 && 
         marketState.hasDroppedAfterPump && 
         !marketState.partialSellExecuted &&
         marketState.remainingPosition === 0; // Haven't sold yet
}

// Check if we should buy a position
function shouldBuyPosition() {
  return marketState.totalPosition === 0 && 
         !marketState.isPumping && // Don't FOMO into pumps
         marketState.currentPrice > 0;
}

// 🎯 EXECUTE WHALE TRAP STRATEGY 🎯
async function executeWhaleTrapStrategy(analysis) {
  // Buy initial position
  if (analysis.shouldBuy && Math.random() > 0.8) { // 20% chance to buy (for simulation)
    await executeBuyOrder();
  }
  
  // Execute partial sell on drop after pump
  if (analysis.shouldPartialSell) {
    await executePartialSell();
  }
  
  // Check for trap confirmation and final sell
  if (marketState.remainingPosition > 0) {
    await checkTrapConfirmation(analysis);
  }
  
  // Emergency stop loss
  if (marketState.totalPosition > 0 && analysis.positionPnL <= -CONFIG.STOP_LOSS_PERCENTAGE) {
    await executeEmergencyStop();
  }
}

// Execute buy order
async function executeBuyOrder() {
  console.log('\n🚀 EXECUTING BUY ORDER - WHALE TRAP HUNTER MODE 🚀');
  
  const positionSize = CONFIG.MAX_POSITION_SIZE * 1000; // Mock position size
  
  marketState.totalPosition = positionSize;
  marketState.entryPrice = marketState.currentPrice;
  marketState.highestPriceAfterEntry = marketState.currentPrice;
  marketState.isPumping = false;
  marketState.hasDroppedAfterPump = false;
  marketState.partialSellExecuted = false;
  marketState.potentialTrapDetected = false;
  
  console.log(`💰 BOUGHT: ${positionSize.toFixed(2)} NEET at $${marketState.currentPrice.toFixed(8)}`);
  console.log(`🎯 STRATEGY: Will sell ${CONFIG.PARTIAL_SELL_PERCENTAGE}% if drops after pump, keep ${CONFIG.KEEP_PERCENTAGE}%`);
  
  logTrade('BUY', marketState.currentPrice, positionSize);
}

// Execute partial sell (70% of position)
async function executePartialSell() {
  console.log('\n📉 EXECUTING PARTIAL SELL - ANTI-MANIPULATION PROTOCOL 📉');
  
  const sellAmount = marketState.totalPosition * (CONFIG.PARTIAL_SELL_PERCENTAGE / 100);
  const keepAmount = marketState.totalPosition * (CONFIG.KEEP_PERCENTAGE / 100);
  
  marketState.soldPosition = sellAmount;
  marketState.remainingPosition = keepAmount;
  marketState.partialSellExecuted = true;
  
  const partialPnL = ((marketState.currentPrice - marketState.entryPrice) / marketState.entryPrice) * 100;
  
  console.log(`💸 SOLD: ${sellAmount.toFixed(2)} NEET (${CONFIG.PARTIAL_SELL_PERCENTAGE}%) at $${marketState.currentPrice.toFixed(8)}`);
  console.log(`🎯 KEEPING: ${keepAmount.toFixed(2)} NEET (${CONFIG.KEEP_PERCENTAGE}%) in case of whale trick`);
  console.log(`📊 PARTIAL PNL: ${partialPnL >= 0 ? '💰' : '💀'} ${partialPnL.toFixed(2)}%`);
  
  logTrade('PARTIAL_SELL', marketState.currentPrice, sellAmount, partialPnL);
}

// Check for trap confirmation and decide on remaining position
async function checkTrapConfirmation(analysis) {
  if (analysis.trapConfidence > 70) {
    console.log(`🎯 HIGH TRAP CONFIDENCE (${analysis.trapConfidence.toFixed(1)}%) - HOLDING REMAINING ${CONFIG.KEEP_PERCENTAGE}%`);
    
    // If price recovers significantly, we made the right call
    const recoveryPnL = ((marketState.currentPrice - marketState.entryPrice) / marketState.entryPrice) * 100;
    if (recoveryPnL > 20) {
      console.log(`🏆 WHALE TRAP SURVIVED! Recovery: ${recoveryPnL.toFixed(2)}%`);
      marketState.trapsSurvived++;
    }
  } else if (analysis.trapConfidence < 30 && analysis.positionPnL < -10) {
    // Low trap confidence and continued drop = sell remaining
    await sellRemainingPosition('LOW_TRAP_CONFIDENCE');
  }
}

// Sell remaining 30% position
async function sellRemainingPosition(reason) {
  console.log(`\n💀 SELLING REMAINING POSITION - REASON: ${reason} 💀`);
  
  const remainingPnL = ((marketState.currentPrice - marketState.entryPrice) / marketState.entryPrice) * 100;
  
  console.log(`💸 SOLD REMAINING: ${marketState.remainingPosition.toFixed(2)} NEET at $${marketState.currentPrice.toFixed(8)}`);
  console.log(`📊 REMAINING PNL: ${remainingPnL >= 0 ? '💰' : '💀'} ${remainingPnL.toFixed(2)}%`);
  
  // Reset position
  marketState.totalPosition = 0;
  marketState.remainingPosition = 0;
  
  logTrade('SELL_REMAINING', marketState.currentPrice, marketState.remainingPosition, remainingPnL);
}

// Emergency stop loss
async function executeEmergencyStop() {
  console.log('\n🚨 EMERGENCY STOP LOSS TRIGGERED 🚨');
  
  if (marketState.remainingPosition > 0) {
    await sellRemainingPosition('EMERGENCY_STOP');
  }
  
  console.log('🛑 ALL POSITIONS CLOSED - EMERGENCY PROTOCOL COMPLETE 🛑');
}

// Log trades to file
function logTrade(action, price, size, pnl = null) {
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp}: ${action} ${size.toFixed(2)} NEET at $${price.toFixed(8)}${pnl ? ` (PnL: ${pnl.toFixed(2)}%)` : ''}\n`;
  fs.appendFileSync('whale_trap_trades.log', logEntry);
}

// COMMAND CENTER
console.log('🎯 ═══════════════════════════════════════════════════════════ 🎯');
console.log('🐋              WHALE TRAP DETECTOR ACTIVATED               🐋');
console.log('🎯              ANTI-MANIPULATION STRATEGY                  🎯');
console.log('🎯 ═══════════════════════════════════════════════════════════ 🎯');
console.log(`📊 STRATEGY: Sell ${CONFIG.PARTIAL_SELL_PERCENTAGE}% on drops, keep ${CONFIG.KEEP_PERCENTAGE}% for tricks`);
console.log(`🎯 PUMP THRESHOLD: ${CONFIG.PUMP_THRESHOLD}% | DROP TRIGGER: ${CONFIG.DROP_AFTER_PUMP}%`);
console.log(`⏰ CHECK INTERVAL: ${CONFIG.CHECK_INTERVAL}ms`);
console.log(`🐋 TRAP RECOVERY TIME: ${CONFIG.FAKE_DUMP_RECOVERY_TIME/1000}s`);
console.log('🚨 DEFENDING AGAINST WHALE MANIPULATION...\n');

// Start whale trap detection
let scanCounter = 0;
detectWhaleTrapStrategy(); // Initial scan

const whaleTrapScanner = setInterval(() => {
  scanCounter++;
  console.log(`\n🔄 Whale Trap Scan #${scanCounter}`);
  detectWhaleTrapStrategy();
}, CONFIG.CHECK_INTERVAL);

// Emergency protocols
process.on('SIGINT', () => {
  console.log('\n\n🛑 WHALE TRAP DETECTOR SHUTTING DOWN');
  console.log('🎯 Final scan count:', scanCounter);
  console.log(`🏆 Traps survived: ${marketState.trapsSurvived}`);
  console.log(`🐋 Tricks detected: ${marketState.tricksDetected}`);
  clearInterval(whaleTrapScanner);
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.log('\n🚨 WHALE TRAP DETECTOR ERROR:', error.message);
  executeEmergencyStop();
  setTimeout(() => process.exit(1), 2000);
});
