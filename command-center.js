#!/usr/bin/env node

/**
 * 🎖️ MARINE CORPS COMMAND CENTER 🎖️
 * DEPLOY 2.0 & RETREAT CONTROL SYSTEM
 * SGT-LEVEL TACTICAL INTERFACE
 */

const readline = require('readline');
const { spawn } = require('child_process');
const fs = require('fs');

class MarineCommandCenter {
  constructor() {
    this.botProcess = null;
    this.isDeployed = false;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async initialize() {
    console.log('🎖️🎖️🎖️ MARINE CORPS COMMAND CENTER 🎖️🎖️🎖️');
    console.log('🇺🇸 SGT-LEVEL TACTICAL INTERFACE 🇺🇸');
    console.log('⚠️ HIGH RISK OPERATIONS - NOT FINANCIAL ADVICE');
    console.log('');
    
    await this.showMainMenu();
  }

  async showMainMenu() {
    console.log('📋 COMMAND OPTIONS:');
    console.log('   [D] DEPLOY 2.0  - Launch trading strategy');
    console.log('   [R] RETREAT     - Emergency shutdown');
    console.log('   [S] STATUS      - Check bot status');
    console.log('   [T] TEST        - Run simulation test');
    console.log('   [Q] QUIT        - Exit command center');
    console.log('');

    this.rl.question('🎖️ SGT, ENTER COMMAND: ', async (command) => {
      await this.processCommand(command.toUpperCase());
    });
  }

  async processCommand(command) {
    switch(command) {
      case 'D':
      case 'DEPLOY':
      case 'DEPLOY 2.0':
        await this.deploy20();
        break;
      case 'R':
      case 'RETREAT':
        await this.retreat();
        break;
      case 'S':
      case 'STATUS':
        await this.checkStatus();
        break;
      case 'T':
      case 'TEST':
        await this.runTest();
        break;
      case 'Q':
      case 'QUIT':
        await this.quit();
        return;
      default:
        console.log('❌ INVALID COMMAND, SGT!');
        break;
    }
    
    setTimeout(() => {
      console.log('');
      this.showMainMenu();
    }, 2000);
  }

  async deploy20() {
    if (this.isDeployed) {
      console.log('🚨 BOT ALREADY DEPLOYED, SGT!');
      console.log('📊 Use RETREAT to shutdown first');
      return;
    }

    console.log('🚀🚀🚀 INITIATING DEPLOY 2.0 🚀🚀🚀');
    console.log('🎯 LAUNCHING DYNAMIC $150-250 STRATEGY');
    console.log('📡 CONNECTING TO DEX SCREENER...');
    console.log('💰 MONITORING FOR $0.0190 BUY TRIGGER...');
    console.log('');

    // Create deployment flag
    fs.writeFileSync('.deployment-active', JSON.stringify({
      status: 'ACTIVE',
      deployTime: new Date().toISOString(),
      strategy: 'DYNAMIC_150_250',
      trigger: 0.0190
    }));

    try {
      this.botProcess = spawn('node', ['advanced-neet-trader.js'], {
        stdio: 'inherit',
        detached: false
      });

      this.isDeployed = true;
      console.log('✅ DEPLOY 2.0 SUCCESSFUL!');
      console.log('🎖️ BOT IS LIVE AND MONITORING DEX');
      console.log('📊 Press any key to return to command center...');

      this.botProcess.on('exit', (code) => {
        this.isDeployed = false;
        if (fs.existsSync('.deployment-active')) {
          fs.unlinkSync('.deployment-active');
        }
        console.log('\\n🎖️ BOT PROCESS TERMINATED');
      });

    } catch (error) {
      console.log('❌ DEPLOYMENT FAILED:', error.message);
    }
  }

  async retreat() {
    console.log('🚨🚨🚨 INITIATING RETREAT PROTOCOL 🚨🚨🚨');
    console.log('🛑 EMERGENCY SHUTDOWN ACTIVATED');
    
    if (this.botProcess) {
      console.log('💀 TERMINATING BOT PROCESS...');
      this.botProcess.kill('SIGTERM');
      
      setTimeout(() => {
        if (this.botProcess && !this.botProcess.killed) {
          console.log('💀 FORCE KILLING BOT PROCESS...');
          this.botProcess.kill('SIGKILL');
        }
      }, 5000);
    }

    // Remove deployment flag
    if (fs.existsSync('.deployment-active')) {
      fs.unlinkSync('.deployment-active');
    }

    // Create retreat log
    const retreatLog = {
      timestamp: new Date().toISOString(),
      action: 'RETREAT_EXECUTED',
      reason: 'SGT_COMMAND',
      status: 'SHUTDOWN_COMPLETE'
    };
    
    fs.writeFileSync('retreat-log.json', JSON.stringify(retreatLog, null, 2));

    this.isDeployed = false;
    console.log('✅ RETREAT COMPLETE - ALL OPERATIONS CEASED');
    console.log('🎖️ SGT, ALL SYSTEMS SECURED');
  }

  async checkStatus() {
    console.log('📊📊📊 TACTICAL STATUS REPORT 📊📊📊');
    
    if (fs.existsSync('.deployment-active')) {
      const deployment = JSON.parse(fs.readFileSync('.deployment-active', 'utf8'));
      console.log('🟢 STATUS: DEPLOYED AND ACTIVE');
      console.log('⏰ Deploy Time:', new Date(deployment.deployTime).toLocaleString());
      console.log('🎯 Strategy:', deployment.strategy);
      console.log('💰 Buy Trigger: $' + deployment.trigger);
    } else {
      console.log('🔴 STATUS: NOT DEPLOYED');
    }
    
    console.log('🤖 Process Status:', this.isDeployed ? 'RUNNING' : 'STOPPED');
    
    // Check SOL price for context
    try {
      const axios = require('axios');
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
      console.log('💰 Current SOL Price: $' + response.data.solana.usd);
    } catch (error) {
      console.log('⚠️ Unable to fetch SOL price');
    }
  }

  async runTest() {
    console.log('🧪🧪🧪 INITIATING SIMULATION TEST 🧪🧪🧪');
    console.log('📊 RUNNING DEX SIMULATION...');
    
    try {
      const testProcess = spawn('node', ['dex-simulation-test.js'], {
        stdio: 'inherit'
      });
      
      testProcess.on('exit', () => {
        console.log('✅ SIMULATION COMPLETE');
      });
      
    } catch (error) {
      console.log('❌ TEST FAILED:', error.message);
    }
  }

  async quit() {
    console.log('🎖️ SGT SIGNING OFF');
    console.log('🇺🇸 SEMPER FI, MARINE! 🇺🇸');
    
    if (this.isDeployed) {
      console.log('⚠️ WARNING: BOT STILL DEPLOYED');
      console.log('🔄 Use RETREAT before quitting for clean shutdown');
    }
    
    this.rl.close();
    process.exit(0);
  }
}

// Signal handlers for clean shutdown
process.on('SIGINT', () => {
  console.log('\\n🚨 CTRL+C DETECTED - INITIATING EMERGENCY RETREAT');
  if (fs.existsSync('.deployment-active')) {
    fs.unlinkSync('.deployment-active');
  }
  process.exit(0);
});

// Launch Command Center
if (require.main === module) {
  const commandCenter = new MarineCommandCenter();
  commandCenter.initialize();
}

module.exports = MarineCommandCenter;
