#!/usr/bin/env node

/**
 * 🎯 DEX TESTING PROTOCOL - LIVE NEET TOKEN INTEGRATION
 * MARINE CORPS TACTICAL DEPLOYMENT
 * AUTHORIZED FOR DEX OPERATIONS
 */

const axios = require('axios');
const fs = require('fs');

class DexTestSetup {
    constructor() {
        this.searchTerms = ['NEET', 'neet', 'Neet Token'];
        this.dexScreenerUrl = 'https://api.dexscreener.com/latest/dex/search';
        this.realNeetData = null;
    }

    async findNeetToken() {
        console.log('\n🎯🎯🎯 DEX RECON MISSION - FINDING NEET TOKEN 🎯🎯🎯');
        console.log('🔍 SCANNING DEX FOR NEET TOKEN...');

        for (const term of this.searchTerms) {
            try {
                console.log(`🔎 Searching for: ${term}`);
                const response = await axios.get(`${this.dexScreenerUrl}?q=${term}`);
                
                if (response.data && response.data.pairs) {
                    const neetPairs = response.data.pairs.filter(pair => 
                        pair.baseToken && 
                        (pair.baseToken.name.toLowerCase().includes('neet') || 
                         pair.baseToken.symbol.toLowerCase().includes('neet'))
                    );

                    if (neetPairs.length > 0) {
                        console.log(`\n✅ FOUND ${neetPairs.length} NEET TOKEN(S)!`);
                        
                        // Display all found tokens
                        neetPairs.forEach((pair, index) => {
                            console.log(`\n📊 NEET TOKEN #${index + 1}:`);
                            console.log(`   💰 Name: ${pair.baseToken.name}`);
                            console.log(`   🎯 Symbol: ${pair.baseToken.symbol}`);
                            console.log(`   🔑 Address: ${pair.baseToken.address}`);
                            console.log(`   💵 Price USD: $${pair.priceUsd || 'N/A'}`);
                            console.log(`   📈 24h Change: ${pair.priceChange?.h24 || 'N/A'}%`);
                            console.log(`   💧 Liquidity: $${pair.liquidity?.usd || 'N/A'}`);
                            console.log(`   🏪 DEX: ${pair.dexId}`);
                            console.log(`   🔗 Pair ID: ${pair.pairAddress}`);
                        });

                        // Use the first (most liquid) token
                        this.realNeetData = neetPairs[0];
                        return true;
                    }
                }
            } catch (error) {
                console.log(`❌ Error searching for ${term}: ${error.message}`);
            }
        }

        console.log('\n⚠️ NO NEET TOKEN FOUND - USING MOCK DATA FOR TESTING');
        return false;
    }

    async updateEnvironmentFile() {
        console.log('\n🔧 UPDATING TACTICAL CONFIGURATION...');

        let envContent = fs.readFileSync('.env', 'utf8');

        if (this.realNeetData) {
            console.log('✅ DEPLOYING REAL NEET TOKEN DATA');
            
            // Update with real data
            envContent = envContent.replace(
                'TOKEN_MINT_ADDRESS=PUT_REAL_NEET_TOKEN_MINT_ADDRESS_HERE',
                `TOKEN_MINT_ADDRESS=${this.realNeetData.baseToken.address}`
            );
            
            envContent = envContent.replace(
                'DEX_SCREENER_PAIR_ID=PUT_REAL_DEXSCREENER_PAIR_ID_HERE',
                `DEX_SCREENER_PAIR_ID=${this.realNeetData.pairAddress}`
            );

            // Add additional data
            envContent += `\n# LIVE DEX DATA - DEPLOYED ${new Date().toISOString()}\n`;
            envContent += `NEET_TOKEN_NAME=${this.realNeetData.baseToken.name}\n`;
            envContent += `NEET_TOKEN_SYMBOL=${this.realNeetData.baseToken.symbol}\n`;
            envContent += `CURRENT_PRICE_USD=${this.realNeetData.priceUsd || '0'}\n`;
            envContent += `DEX_PLATFORM=${this.realNeetData.dexId}\n`;
            envContent += `LIQUIDITY_USD=${this.realNeetData.liquidity?.usd || '0'}\n`;

        } else {
            console.log('⚠️ DEPLOYING TEST CONFIGURATION');
            
            // Use mock data for testing
            envContent = envContent.replace(
                'TOKEN_MINT_ADDRESS=PUT_REAL_NEET_TOKEN_MINT_ADDRESS_HERE',
                'TOKEN_MINT_ADDRESS=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
            );
            
            envContent = envContent.replace(
                'DEX_SCREENER_PAIR_ID=PUT_REAL_DEXSCREENER_PAIR_ID_HERE',
                'DEX_SCREENER_PAIR_ID=mock-test-pair'
            );

            envContent += `\n# TEST MODE - MOCK DATA ${new Date().toISOString()}\n`;
            envContent += `NEET_TOKEN_NAME=MOCK NEET TOKEN\n`;
            envContent += `NEET_TOKEN_SYMBOL=NEET\n`;
            envContent += `CURRENT_PRICE_USD=0.01\n`;
            envContent += `DEX_PLATFORM=raydium\n`;
            envContent += `TEST_MODE=true\n`;
        }

        fs.writeFileSync('.env', envContent);
        console.log('✅ CONFIGURATION UPDATED');
    }

    async generateTestWallet() {
        console.log('\n🔑 GENERATING TEST WALLET FOR DEX OPERATIONS...');
        
        // Generate a test wallet (not for real funds)
        const testKey = Array.from({length: 64}, (_, i) => i + 1);
        
        let envContent = fs.readFileSync('.env', 'utf8');
        envContent = envContent.replace(
            'WALLET_PRIVATE_KEY=1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64',
            `WALLET_PRIVATE_KEY=${testKey.join(',')}`
        );
        
        fs.writeFileSync('.env', envContent);
        console.log('✅ TEST WALLET CONFIGURED');
    }

    async runDexTest() {
        console.log('\n🚀🚀🚀 INITIATING DEX TEST DEPLOYMENT 🚀🚀🚀');
        console.log('⚠️ WARNING: TEST MODE - NO REAL TRADES EXECUTED');
        console.log('🎯 TARGET: NEET TOKEN DEX INTEGRATION TEST');
        
        await this.findNeetToken();
        await this.updateEnvironmentFile();
        await this.generateTestWallet();
        
        console.log('\n✅ DEX TEST SETUP COMPLETE!');
        console.log('🎯 READY FOR BOT DEPLOYMENT');
        console.log('\n📋 AVAILABLE COMMANDS:');
        console.log('   🔸 npm run basic     - Basic stop-loss bot');
        console.log('   🔸 npm run max-risk   - Maximum risk bot');
        console.log('   🔸 npm run whale-trap - Whale manipulation detector');
        console.log('\n🚨 OR RUN DIRECTLY: node index.js');
    }
}

if (require.main === module) {
    const dexTest = new DexTestSetup();
    dexTest.runDexTest().catch(console.error);
}

module.exports = DexTestSetup;
