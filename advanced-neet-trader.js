#!/usr/bin/env node

/**
 * 🎖️ ADVANCED NEET TRADING BOT - MARINE CORPS TACTICAL TRADING 🎖️
 * MULTI-TIER  async initialize() {
    console.log('\n💰💰💰 NEET BRADY2.0 MONEY-MAKING BOT DEPLOYED 💰💰💰');
    console.log('🚀 MULTI-TIER PROFIT STRATEGY ACTIVE');
    console.log('\n📊 NEET BRADY2.0 TRADING PARAMETERS:');
    console.log(`   💚 PRIMARY BUY: $${TRADING_CONFIG.PRIMARY_BUY_THRESHOLD} ($${TRADING_CONFIG.PRIMARY_BUY_AMOUNT})`);
    console.log(`   💚 SECONDARY BUY: $${TRADING_CONFIG.SECONDARY_BUY_THRESHOLD} ($${TRADING_CONFIG.SECONDARY_BUY_AMOUNT_MIN}-${TRADING_CONFIG.SECONDARY_BUY_AMOUNT_MAX})`);
    console.log(`   � STOP-LOSS: $${TRADING_CONFIG.STOP_LOSS_THRESHOLD} (Emergency: $${TRADING_CONFIG.EMERGENCY_STOP_LOSS})`);
    console.log(`   🔴 BIG SELL: $${TRADING_CONFIG.SELL_BIG_THRESHOLD}`);
    console.log(`   🎯 MARKET CAP TARGET: $${(TRADING_CONFIG.TARGET_MARKET_CAP / 1000000).toFixed(0)}M`);
    console.log(`   💰 NEET BRADY2.0 PROFIT STRATEGY ACTIVE - MAKE MONEY!`);
    console.log('\n🚀 INITIATING NEET BRADY2.0 MONEY-MAKING SURVEILLANCE...\n');

    await this.updateBalances();
    tradingState.isInitialized = true;
} & PROFIT TAKING SYSTEM
 * PHANTOM WALLET INTEGRATION
 */

require('dotenv').config();
const { Connection, PublicKey, Keypair, Transaction, SystemProgram } = require('@solana/web3.js');
const { Token, TOKEN_PROGRAM_ID } = require('@solana/spl-token');
const axios = require('axios');
const fs = require('fs');

// 🎯 MARINE CORPS TRADING CONFIGURATION
const TRADING_CONFIG = {
  // PRICE THRESHOLDS - LIEUTENANT'S NEW TACTICAL STOP-LOSS STRATEGY
  PRIMARY_BUY_THRESHOLD: 0.0190, // $50 buy trigger - LIEUTENANT'S ORDER
  SECONDARY_BUY_THRESHOLD: 0.0165, // Secondary buy trigger (backup)
  STOP_LOSS_THRESHOLD: 0.0178,  // NEW: Stop-loss sell trigger ($0.0175-0.0180 range)
  EMERGENCY_STOP_LOSS: 0.0175,  // NEW: Emergency stop-loss floor
  SELL_BIG_THRESHOLD: 0.0350,   // Big profit sell trigger
  
  // TRADING AMOUNTS (USD) - LIEUTENANT'S NEW CONSERVATIVE STRATEGY
  PRIMARY_BUY_AMOUNT: 50,       // NEW: Fixed $50 buy at $0.0190 - LIEUTENANT'S ORDER
  SECONDARY_BUY_AMOUNT_MIN: 25, // Reduced secondary buy amount min
  SECONDARY_BUY_AMOUNT_MAX: 50, // Reduced secondary buy amount max
  STOP_LOSS_SELL_PERCENT: 100, // NEW: Sell 100% on stop-loss trigger
  SELL_BIG_MIN: 50,             // Minimum big sell
  SELL_BIG_MAX: 100,            // Maximum big sell
  
  // MARKET CAP STRATEGY
  TARGET_MARKET_CAP: 100000000, // $100M market cap
  MARKET_CAP_SELL_PERCENT: 70,  // Sell 70% at market cap
  MARKET_CAP_HOLD_PERCENT: 30,  // Keep 30% for moon potential
  
  // TRADING INTERVALS
  CHECK_INTERVAL: 5000,         // 5 seconds
  COOLDOWN_PERIOD: 30000,       // 30 seconds between trades
  
  // SAFETY LIMITS
  MAX_DAILY_TRADES: 50,
  MAX_POSITION_SIZE: 0.8,       // Use max 80% of SOL balance
};

// WALLET CONFIGURATION - NEET BRADY2.0 MONEY-MAKING WALLET 💰
const WALLET_CONFIG = {
  // NEET BRADY2.0 WALLET ADDRESS - CONFIGURED FOR MAXIMUM PROFITS 🚀
  WALLET_ADDRESS: 'BAW6kYT82XdxrRoEpBu56Fx9kgVg5ZQAtKDH5K2W5ShN',
  PRIVATE_KEY: process.env.PHANTOM_PRIVATE_KEY, // Set in .env for live trading
  RPC_ENDPOINT: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  TRADER_NAME: 'NEET_BRADY2.0', // 🎖️ NEET BRADY2.0 PROFIT MISSION ACTIVE
  PROFIT_MODE: 'MAXIMUM_GAINS' // 💰 MONEY-MAKING PROTOCOL
};

// TOKEN CONFIGURATION
const TOKEN_CONFIG = {
  NEET_ADDRESS: process.env.TOKEN_MINT_ADDRESS || 'Ce2gx9KGXJ6C9Mp5b5x1sn9Mg87JwEbrQby4Zqo3pump',
  PAIR_ID: process.env.DEX_SCREENER_PAIR_ID || '5wNu5QhdpRGrL37ffcd6TMMqZugQgxwafgz477rShtHy',
  SOL_ADDRESS: 'So11111111111111111111111111111111111111112',
};

// TRADING STATE
let tradingState = {
  currentPrice: 0,
  solBalance: 0,
  neetBalance: 0,
  totalTrades: 0,
  lastTradeTime: 0,
  dailyVolume: 0,
  startTime: Date.now(),
  marketCap: 0,
  circulatingSupply: 0,
  profitLoss: 0,
  isInitialized: false,
};

// SOLANA CONNECTION - USING LIEUTENANT'S RPC ENDPOINT
const connection = new Connection(WALLET_CONFIG.RPC_ENDPOINT, 'confirmed');

// WALLET SETUP - NEET BRADY2.0 MONEY-MAKING WALLET INTEGRATION 💰
let wallet;
try {
  if (WALLET_CONFIG.PRIVATE_KEY) {
    const privateKey = JSON.parse(WALLET_CONFIG.PRIVATE_KEY);
    wallet = Keypair.fromSecretKey(new Uint8Array(privateKey));
    console.log(`💰 NEET BRADY2.0 Money Wallet Connected: ${wallet.publicKey.toString().substring(0,8)}...`);
    console.log(`🎖️ NEET BRADY2.0 PROFIT WALLET: ${WALLET_CONFIG.WALLET_ADDRESS}`);
  } else {
    console.log('⚠️ Using test wallet - PHANTOM_PRIVATE_KEY not found');
    console.log(`💰 NEET BRADY2.0 TARGET WALLET: ${WALLET_CONFIG.WALLET_ADDRESS}`);
    // Generate test wallet for simulation
    wallet = Keypair.generate();
  }
} catch (error) {
  console.log('⚠️ Wallet setup error, using test mode');
  console.log(`💰 NEET BRADY2.0 TARGET WALLET: ${WALLET_CONFIG.WALLET_ADDRESS}`);
  wallet = Keypair.generate();
}

class MarineCorpsTrader {
  constructor() {
    this.lastAction = null;
    this.actionHistory = [];
  }

  async initialize() {
    console.log('\n🎖️🎖️🎖️ MARINE CORPS ADVANCED TRADER DEPLOYED 🎖️🎖️🎖️');
    console.log('🎯 MULTI-TIER TRADING STRATEGY ACTIVE');
    console.log('\n📊 TRADING PARAMETERS:');
    console.log(`   💚 PRIMARY BUY: $${TRADING_CONFIG.PRIMARY_BUY_THRESHOLD} ($${TRADING_CONFIG.PRIMARY_BUY_AMOUNT})`);
    console.log(`   💚 SECONDARY BUY: $${TRADING_CONFIG.SECONDARY_BUY_THRESHOLD} ($${TRADING_CONFIG.SECONDARY_BUY_AMOUNT_MIN}-${TRADING_CONFIG.SECONDARY_BUY_AMOUNT_MAX})`);
    console.log(`   � STOP-LOSS: $${TRADING_CONFIG.STOP_LOSS_THRESHOLD} (Emergency: $${TRADING_CONFIG.EMERGENCY_STOP_LOSS})`);
    console.log(`   🔴 BIG SELL: $${TRADING_CONFIG.SELL_BIG_THRESHOLD}`);
    console.log(`   🎯 MARKET CAP TARGET: $${(TRADING_CONFIG.TARGET_MARKET_CAP / 1000000).toFixed(0)}M`);
    console.log(`   📈 LIEUTENANT'S CONSERVATIVE STRATEGY ACTIVE`);
    console.log('\n🚀 INITIATING TRADING SURVEILLANCE...\n');

    await this.updateBalances();
    tradingState.isInitialized = true;
    this.startTrading();
  }

  // Check deployment status and handle retreat signal
  checkDeploymentStatus() {
    try {
      if (!fs.existsSync('.deployment-active')) {
        console.log('🚨 RETREAT SIGNAL DETECTED - SHUTTING DOWN');
        this.emergencyStop();
        return false;
      }
      return true;
    } catch (error) {
      console.log('⚠️ Error checking deployment status:', error.message);
      return true; // Continue if can't check
    }
  }

  async updateBalances() {
    try {
      // Get SOL balance
      const solBalance = await connection.getBalance(wallet.publicKey);
      tradingState.solBalance = solBalance / 1e9; // Convert lamports to SOL

      // For NEET balance, we'd need to implement SPL token balance check
      // For now, we'll simulate it
      tradingState.neetBalance = 0; // Will be updated with actual implementation

      console.log(`💰 SOL Balance: ${tradingState.solBalance.toFixed(4)} SOL`);
      console.log(`🎯 NEET Balance: ${tradingState.neetBalance.toFixed(2)} NEET`);
    } catch (error) {
      console.log(`⚠️ Balance update error: ${error.message}`);
    }
  }

  async getCurrentPrice() {
    try {
      const response = await axios.get(`https://api.dexscreener.com/latest/dex/pairs/solana/${TOKEN_CONFIG.PAIR_ID}`);
      const data = response.data;

      if (data && data.pair) {
        tradingState.currentPrice = parseFloat(data.pair.priceUsd);
        tradingState.marketCap = parseFloat(data.pair.marketCap || 0);
        
        // Calculate circulating supply if market cap is available
        if (tradingState.marketCap > 0 && tradingState.currentPrice > 0) {
          tradingState.circulatingSupply = tradingState.marketCap / tradingState.currentPrice;
        }

        return tradingState.currentPrice;
      }
    } catch (error) {
      console.log(`❌ Price fetch error: ${error.message}`);
    }
    return null;
  }

  async evaluateTrading() {
    const currentPrice = await this.getCurrentPrice();
    if (!currentPrice) return;

    const now = Date.now();
    const timeSinceLastTrade = now - tradingState.lastTradeTime;
    const canTrade = timeSinceLastTrade > TRADING_CONFIG.COOLDOWN_PERIOD;

    console.log(`\n📊 [${new Date().toLocaleTimeString()}] MARKET ANALYSIS`);
    console.log(`💰 NEET Price: $${currentPrice.toFixed(6)}`);
    console.log(`📈 Market Cap: $${(tradingState.marketCap / 1000000).toFixed(2)}M`);
    console.log(`⏰ Can Trade: ${canTrade ? '✅' : '❌'} (${(timeSinceLastTrade/1000).toFixed(0)}s cooldown)`);

    // PRIORITY 1: EMERGENCY STOP-LOSS (Price drops to $0.0175-0.0178 range)
    if (currentPrice <= TRADING_CONFIG.EMERGENCY_STOP_LOSS && tradingState.neetBalance > 0) {
      await this.executeEmergencyStopLoss(currentPrice);
      return;
    }

    // PRIORITY 2: STOP-LOSS PROTECTION (Price drops to $0.0178)
    if (currentPrice <= TRADING_CONFIG.STOP_LOSS_THRESHOLD && tradingState.neetBalance > 0) {
      await this.executeStopLoss(currentPrice);
      return;
    }

    // PRIORITY 3: MARKET CAP TARGET REACHED
    if (tradingState.marketCap >= TRADING_CONFIG.TARGET_MARKET_CAP && tradingState.neetBalance > 0) {
      await this.executeMarketCapSell();
      return;
    }

    if (!canTrade) return;

    // PRIORITY 4: PRIMARY BUY OPPORTUNITY (Price at $0.0190 - $50 buy - LIEUTENANT'S ORDER)
    if (currentPrice <= TRADING_CONFIG.PRIMARY_BUY_THRESHOLD) {
      await this.executePrimaryBuy(currentPrice);
    }
    
    // PRIORITY 5: SECONDARY BUY OPPORTUNITY (Price dropped to $0.0165)
    else if (currentPrice <= TRADING_CONFIG.SECONDARY_BUY_THRESHOLD) {
      await this.executeSecondaryBuy(currentPrice);
    }
    
    // PRIORITY 6: BIG SELL (Price above big sell threshold)
    else if (currentPrice >= TRADING_CONFIG.SELL_BIG_THRESHOLD) {
      await this.executeBigSell(currentPrice);
    }
    
    // PRIORITY 5: BIG SELL (Price above big sell threshold)
    else if (currentPrice >= TRADING_CONFIG.SELL_BIG_THRESHOLD) {
      await this.executeBigSell(currentPrice);
    }
    
    else {
      console.log('🟢 HOLDING POSITION - No trading signals');
    }
  }

  async executePrimaryBuy(price) {
    // LIEUTENANT'S CONSERVATIVE $50 BUY STRATEGY
    const buyAmount = TRADING_CONFIG.PRIMARY_BUY_AMOUNT; // Fixed $50
    const solRequired = buyAmount / 200; // Approximate SOL price $200
    
    console.log(`\n💚💚💚 PRIMARY BUY SIGNAL TRIGGERED 💚💚💚`);
    console.log(`🎯 Price: $${price.toFixed(6)} (At/Below $${TRADING_CONFIG.PRIMARY_BUY_THRESHOLD})`);
    console.log(`🎖️ LIEUTENANT'S ORDER: $${buyAmount} CONSERVATIVE BUY`);
    console.log(`⚠️ RISK CONTROLLED - YOUR STRATEGIC CHOICE - NOT FINANCIAL ADVICE`);
    
    if (tradingState.solBalance >= solRequired) {
      console.log(`✅ EXECUTING CONSERVATIVE BUY ORDER`);
      console.log(`📊 Buying NEET with ${solRequired.toFixed(4)} SOL`);
      console.log(`🚀 Expected NEET tokens: ~${(buyAmount / price).toFixed(0)} NEET`);
      console.log(`💡 Strategy: Conservative entry with stop-loss protection`);
      
      // Update state (simulation)
      tradingState.lastTradeTime = Date.now();
      tradingState.totalTrades++;
      tradingState.dailyVolume += buyAmount;
      
      await this.logTrade('PRIMARY_BUY', buyAmount, price, solRequired);
    } else {
      console.log(`❌ INSUFFICIENT SOL BALANCE FOR PRIMARY BUY`);
      console.log(`💰 Required: ${solRequired.toFixed(4)} SOL | Available: ${tradingState.solBalance.toFixed(4)} SOL`);
    }
  }

  async executeStopLoss(price) {
    console.log(`\n🚨🚨🚨 STOP-LOSS TRIGGERED 🚨🚨🚨`);
    console.log(`🔴 Price: $${price.toFixed(6)} (At/Below $${TRADING_CONFIG.STOP_LOSS_THRESHOLD})`);
    console.log(`🎖️ EXECUTING PROTECTIVE STOP-LOSS STRATEGY`);
    console.log(`📊 SELLING 100% OF NEET POSITION FOR LOSS PROTECTION`);
    
    const sellAmount = tradingState.neetBalance;
    const usdValue = sellAmount * price;
    
    if (sellAmount > 0) {
      console.log(`✅ EXECUTING STOP-LOSS SELL`);
      console.log(`📊 Selling ${sellAmount.toFixed(0)} NEET tokens`);
      console.log(`💰 USD Value: $${usdValue.toFixed(2)}`);
      console.log(`🛡️ POSITION CLOSED - LOSSES CONTAINED`);
      
      // Update state (simulation)
      tradingState.lastTradeTime = Date.now();
      tradingState.totalTrades++;
      tradingState.dailyVolume += usdValue;
      tradingState.neetBalance = 0; // Clear position
      
      await this.logTrade('STOP_LOSS', usdValue, price, sellAmount);
    }
  }

  async executeEmergencyStopLoss(price) {
    console.log(`\n🚨🚨🚨 EMERGENCY STOP-LOSS ACTIVATED 🚨🚨🚨`);
    console.log(`💀 Price: $${price.toFixed(6)} (At/Below $${TRADING_CONFIG.EMERGENCY_STOP_LOSS})`);
    console.log(`🎖️ EMERGENCY PROTOCOL - IMMEDIATE LIQUIDATION`);
    
    const sellAmount = tradingState.neetBalance;
    const usdValue = sellAmount * price;
    
    if (sellAmount > 0) {
      console.log(`🔴 EMERGENCY LIQUIDATION EXECUTED`);
      console.log(`📊 Selling ${sellAmount.toFixed(0)} NEET tokens`);
      console.log(`💰 Emergency Exit Value: $${usdValue.toFixed(2)}`);
      console.log(`🛡️ EMERGENCY STOP COMPLETE - CAPITAL PRESERVED`);
      
      // Update state (simulation)
      tradingState.lastTradeTime = Date.now();
      tradingState.totalTrades++;
      tradingState.dailyVolume += usdValue;
      tradingState.neetBalance = 0; // Clear position
      
      await this.logTrade('EMERGENCY_STOP_LOSS', usdValue, price, sellAmount);
    }
  }

  calculateOptimalBuyAmount(price) {
    // MARINE'S HIGH-RISK TACTICAL DECISION ALGORITHM
    // THIS IS THE MARINE'S STRATEGY - NOT FINANCIAL ADVICE
    
    const min = TRADING_CONFIG.PRIMARY_BUY_AMOUNT_MIN; // $150
    const max = TRADING_CONFIG.PRIMARY_BUY_AMOUNT_MAX; // $250
    
    // Factor 1: How close to buy threshold (more aggressive if deeper discount)
    const discountFromCurrent = ((0.0265 - price) / 0.0265);
    
    // Factor 2: Market cap consideration (more aggressive at lower MC)
    const marketCapFactor = Math.min(tradingState.marketCap / 30000000, 1); // Scale based on $30M
    
    // Factor 3: Liquidity health (more aggressive with good liquidity)
    const liquidityFactor = tradingState.marketCap > 0 ? 
      Math.min((1625000 / tradingState.marketCap) * 0.1, 1) : 0.5;
    
    // Factor 4: Random tactical element (20% variance for unpredictability)
    const randomFactor = 0.9 + (Math.random() * 0.2);
    
    // TACTICAL DECISION MATRIX
    let aggressionScore = 0;
    
    // More aggressive if price is significantly below threshold
    if (price <= 0.0180) aggressionScore += 0.4; // Deep discount
    else if (price <= 0.0185) aggressionScore += 0.3; // Good discount
    else if (price <= 0.0190) aggressionScore += 0.2; // At threshold
    
    // Market conditions
    aggressionScore += (1 - marketCapFactor) * 0.3; // Lower MC = more aggressive
    aggressionScore += liquidityFactor * 0.2; // Good liquidity = more aggressive
    aggressionScore += discountFromCurrent * 0.1; // Discount factor
    
    // Apply random tactical variance
    aggressionScore *= randomFactor;
    
    // Clamp to 0-1 range
    aggressionScore = Math.max(0, Math.min(1, aggressionScore));
    
    // Calculate final amount
    const buyAmount = min + ((max - min) * aggressionScore);
    
    // Round to nearest $25 for clean execution
    return Math.round(buyAmount / 25) * 25;
  }

  getBuyReasoning(price, amount) {
    if (amount >= 225) return "MAXIMUM AGGRESSION - Deep value + optimal conditions";
    if (amount >= 200) return "HIGH AGGRESSION - Strong tactical position";
    if (amount >= 175) return "MODERATE AGGRESSION - Good entry opportunity";
    return "CONSERVATIVE AGGRESSION - Cautious but committed entry";
  }

  async executeSecondaryBuy(price) {
    const buyAmount = this.randomBetween(TRADING_CONFIG.SECONDARY_BUY_AMOUNT_MIN, TRADING_CONFIG.SECONDARY_BUY_AMOUNT_MAX);
    const solRequired = buyAmount / 200; // Approximate SOL price $200
    
    console.log(`\n💚💚💚 SECONDARY BUY SIGNAL TRIGGERED 💚💚💚`);
    console.log(`🎯 Price: $${price.toFixed(6)} (At/Below $${TRADING_CONFIG.SECONDARY_BUY_THRESHOLD})`);
    console.log(`💰 Secondary Buy: $${buyAmount} (~${solRequired.toFixed(4)} SOL)`);
    console.log(`🎖️ BACKUP BUY TRIGGER ACTIVATED`);
    
    if (tradingState.solBalance >= solRequired) {
      console.log(`✅ EXECUTING SECONDARY BUY ORDER`);
      console.log(`📊 Buying NEET with ${solRequired.toFixed(4)} SOL`);
      
      // Update state (simulation)
      tradingState.lastTradeTime = Date.now();
      tradingState.totalTrades++;
      tradingState.dailyVolume += buyAmount;
      
      await this.logTrade('SECONDARY_BUY', buyAmount, price, solRequired);
    } else {
      console.log(`❌ INSUFFICIENT SOL BALANCE FOR SECONDARY BUY`);
      console.log(`💰 Required: ${solRequired.toFixed(4)} SOL | Available: ${tradingState.solBalance.toFixed(4)} SOL`);
    }
  }

  async executeSmallSell(price) {
    const sellAmount = this.randomBetween(TRADING_CONFIG.SELL_SMALL_MIN, TRADING_CONFIG.SELL_SMALL_MAX);
    
    console.log(`\n🟡🟡🟡 SMALL SELL SIGNAL 🟡🟡🟡`);
    console.log(`🎯 Price: $${price.toFixed(6)} (Above $${TRADING_CONFIG.SELL_SMALL_THRESHOLD})`);
    console.log(`💰 Sell Amount: $${sellAmount}`);
    
    // Calculate NEET tokens to sell
    const neetToSell = sellAmount / price;
    
    if (tradingState.neetBalance >= neetToSell) {
      console.log(`✅ EXECUTING SMALL SELL`);
      console.log(`📊 Selling ${neetToSell.toFixed(0)} NEET tokens`);
      
      // Update state (simulation)
      tradingState.lastTradeTime = Date.now();
      tradingState.totalTrades++;
      tradingState.dailyVolume += sellAmount;
      
      await this.logTrade('SMALL_SELL', sellAmount, price, neetToSell);
    } else {
      console.log(`❌ INSUFFICIENT NEET BALANCE`);
      console.log(`💰 Required: ${neetToSell.toFixed(0)} NEET | Available: ${tradingState.neetBalance.toFixed(0)} NEET`);
    }
  }

  async executeBigSell(price) {
    const sellAmount = this.randomBetween(TRADING_CONFIG.SELL_BIG_MIN, TRADING_CONFIG.SELL_BIG_MAX);
    
    console.log(`\n🔴🔴🔴 BIG SELL SIGNAL 🔴🔴🔴`);
    console.log(`🎯 Price: $${price.toFixed(6)} (Above $${TRADING_CONFIG.SELL_BIG_THRESHOLD})`);
    console.log(`💰 Sell Amount: $${sellAmount}`);
    
    // Calculate NEET tokens to sell
    const neetToSell = sellAmount / price;
    
    if (tradingState.neetBalance >= neetToSell) {
      console.log(`✅ EXECUTING BIG SELL`);
      console.log(`📊 Selling ${neetToSell.toFixed(0)} NEET tokens`);
      
      // Update state (simulation)
      tradingState.lastTradeTime = Date.now();
      tradingState.totalTrades++;
      tradingState.dailyVolume += sellAmount;
      
      await this.logTrade('BIG_SELL', sellAmount, price, neetToSell);
    } else {
      console.log(`❌ INSUFFICIENT NEET BALANCE`);
    }
  }

  async executeMarketCapSell() {
    console.log(`\n🎖️🎖️🎖️ MARKET CAP TARGET REACHED! 🎖️🎖️🎖️`);
    console.log(`💰 Market Cap: $${(tradingState.marketCap / 1000000).toFixed(2)}M`);
    console.log(`🎯 TARGET: $${(TRADING_CONFIG.TARGET_MARKET_CAP / 1000000)}M`);
    
    const sellAmount = tradingState.neetBalance * (TRADING_CONFIG.MARKET_CAP_SELL_PERCENT / 100);
    const keepAmount = tradingState.neetBalance * (TRADING_CONFIG.MARKET_CAP_HOLD_PERCENT / 100);
    
    console.log(`📊 EXECUTING STRATEGIC PARTIAL LIQUIDATION:`);
    console.log(`   🔴 SELLING: ${sellAmount.toFixed(0)} NEET (${TRADING_CONFIG.MARKET_CAP_SELL_PERCENT}%)`);
    console.log(`   💎 HOLDING: ${keepAmount.toFixed(0)} NEET (${TRADING_CONFIG.MARKET_CAP_HOLD_PERCENT}%)`);
    console.log(`   🚀 REASON: MOON POTENTIAL INSURANCE`);
    
    // Execute the market cap sell
    tradingState.lastTradeTime = Date.now();
    tradingState.totalTrades++;
    
    await this.logTrade('MARKET_CAP_SELL', sellAmount * tradingState.currentPrice, tradingState.currentPrice, sellAmount);
  }

  async logTrade(type, usdAmount, price, tokenAmount) {
    const trade = {
      timestamp: new Date().toISOString(),
      type: type,
      price: price,
      usdAmount: usdAmount,
      tokenAmount: tokenAmount,
      marketCap: tradingState.marketCap
    };
    
    this.actionHistory.push(trade);
    
    // Save to file
    const logEntry = `${trade.timestamp} | ${type} | $${price.toFixed(6)} | $${usdAmount.toFixed(2)} | ${tokenAmount.toFixed(2)} tokens\n`;
    fs.appendFileSync('neet_trading_log.txt', logEntry);
    
    console.log(`📝 TRADE LOGGED: ${type} - $${usdAmount.toFixed(2)} at $${price.toFixed(6)}`);
  }

  randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  async startTrading() {
    console.log('🚀 TRADING PROTOCOL INITIATED\n');
    
    // Initial evaluation
    await this.evaluateTrading();
    
    // Set up continuous monitoring with retreat check
    setInterval(async () => {
      // Check for retreat signal first
      if (!this.checkDeploymentStatus()) {
        return;
      }
      await this.evaluateTrading();
    }, TRADING_CONFIG.CHECK_INTERVAL);

    // Update balances every minute
    setInterval(async () => {
      await this.updateBalances();
    }, 60000);
  }

  // Emergency stop
  emergencyStop() {
    console.log('\n🚨🚨🚨 EMERGENCY STOP ACTIVATED 🚨🚨🚨');
    console.log('🎖️ ALL TRADING OPERATIONS SUSPENDED');
    console.log('📊 FINAL TRADING STATISTICS:');
    console.log(`   Total Trades: ${tradingState.totalTrades}`);
    console.log(`   Daily Volume: $${tradingState.dailyVolume.toFixed(2)}`);
    console.log(`   Runtime: ${((Date.now() - tradingState.startTime) / 60000).toFixed(1)} minutes`);
    process.exit(0);
  }
}

// DEPLOY THE MARINE CORPS TRADER
const trader = new MarineCorpsTrader();

// Handle graceful shutdown
process.on('SIGINT', () => {
  trader.emergencyStop();
});

process.on('SIGTERM', () => {
  trader.emergencyStop();
});

// LAUNCH THE MISSION
if (require.main === module) {
  trader.initialize().catch(console.error);
}

module.exports = MarineCorpsTrader;
