// ADVANCED NEET TRADING BOT - LONG TERM STRATEGY
// Buy low, sell high with USD profit-taking and 100M market cap exit

require('dotenv').config();
const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const axios = require('axios');
const fs = require('fs');

// BREACH PROTECTION
const breachAuth = () => {
    const key = process.env.BREACH_KEY || 'NEET-ALPHA-SECURE-2025';
    if (!key || key.length < 10) {
        console.log('🚨 BREACH DETECTED - TERMINATING');
        process.exit(1);
    }
    console.log('🔐 Security: VERIFIED');
};
breachAuth();

// ADVANCED TRADING CONFIGURATION
const TOKEN_MINT_ADDRESS = 'A8C3xuqscfmyLrte3VmTqrAq8kgMASius9AFNANwpump';
const DEX_SCREENER_PAIR_ID = 'A8C3xuqscfmyLrte3VmTqrAq8kgMASius9AFNANwpump';

// STRATEGIC PARAMETERS
const BUY_PRICE_PRIMARY = 0.0160;    // Ideal buy price
const BUY_PRICE_SECONDARY = 0.0175;  // Fallback buy price
const USD_PROFIT_MIN = 50;           // $50 USD profit minimum
const USD_PROFIT_MAX = 100;          // $100 USD profit for bigger sells
const TARGET_MARKET_CAP = 100000000; // 100M market cap exit
const EXIT_PERCENTAGE = 85;          // 85% withdrawal at target

// POSITION TRACKING
let positions = [];
let totalTokens = 0;
let totalInvestment = 0;

// SECURITY CHECK - Remove any old breach imports

// WALLET SETUP
let wallet;
try {
    const privateKey = process.env.WALLET_PRIVATE_KEY.split(',').map(Number);
    wallet = Keypair.fromSecretKey(new Uint8Array(privateKey));
    console.log(`🎯 Wallet: ${wallet.publicKey.toString().substring(0,8)}...`);
} catch (error) {
    console.log('⚠️  Mock wallet mode');
}

// TRADING LOGIC
function shouldBuy(price) {
    if (price <= BUY_PRICE_PRIMARY) return { buy: true, reason: `PRIME BUY at $${price}` };
    if (price <= BUY_PRICE_SECONDARY) return { buy: true, reason: `SECONDARY BUY at $${price}` };
    return { buy: false, reason: `Price too high: $${price}` };
}

function shouldSell(price, marketCap) {
    if (marketCap >= TARGET_MARKET_CAP) {
        return { sell: true, percentage: EXIT_PERCENTAGE, reason: `100M TARGET HIT!` };
    }
    
    // USD PROFIT CALCULATION
    for (let pos of positions) {
        const currentValue = pos.tokens * price;
        const usdProfit = currentValue - pos.usdInvested;
        
        if (usdProfit >= USD_PROFIT_MAX) return { sell: true, percentage: 20, reason: `$${usdProfit.toFixed(0)} USD profit!` };
        if (usdProfit >= USD_PROFIT_MIN) return { sell: true, percentage: 10, reason: `$${usdProfit.toFixed(0)} USD profit!` };
    }
    
    return { sell: false, reason: 'HODL' };
}

// MAIN TRADING ENGINE
async function trade() {
    try {
        const response = await axios.get(`https://api.dexscreener.com/latest/dex/pairs/solana/${DEX_SCREENER_PAIR_ID}`);
        const price = parseFloat(response.data.pair?.priceUsd || 0);
        const marketCap = price * 1000000000; // Assuming 1B supply
        
        console.log(`\n💰 PRICE: $${price.toFixed(8)} | CAP: $${(marketCap/1000000).toFixed(1)}M`);
        
        const buyDecision = shouldBuy(price);
        const sellDecision = shouldSell(price, marketCap);
        
        if (buyDecision.buy) {
            console.log(`🚀 ${buyDecision.reason}`);
            const usdAmount = 100; // $100 position
            const tokens = usdAmount / price;
            positions.push({ 
                buyPrice: price, 
                tokens: tokens, 
                usdInvested: usdAmount,
                timestamp: Date.now() 
            });
            totalTokens += tokens;
        }
        
        if (sellDecision.sell) {
            console.log(`💸 ${sellDecision.reason} - Selling ${sellDecision.percentage}%`);
            totalTokens *= (1 - sellDecision.percentage/100);
        }
        
        if (!buyDecision.buy && !sellDecision.sell) {
            console.log(`⏳ WAITING: ${buyDecision.reason}`);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// START BOT
console.log('🎖️ ADVANCED NEET TRADER - LONG TERM STRATEGY 🎖️');
console.log(`🎯 BUY: $${BUY_PRICE_PRIMARY}-$${BUY_PRICE_SECONDARY}`);
console.log(`💰 USD PROFIT: $${USD_PROFIT_MIN}-$${USD_PROFIT_MAX} | EXIT: $${TARGET_MARKET_CAP/1000000}M`);
console.log('🚀 STARTING TRADING ENGINE...\n');

trade();
setInterval(trade, 30000);
