#!/usr/bin/env node

/**
 * 🎖️ TACTICAL CONTROL SERVER 🎖️
 * Handles DEPLOY2.0 and RETREAT commands from web interface
 */

const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

class TacticalControlServer {
  constructor() {
    this.app = express();
    this.port = 3000;
    this.botProcess = null;
    this.isDeployed = false;
    
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname)));
  }

  setupRoutes() {
    // Serve the main control panel
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'tactical-control-panel.html'));
    });

    // DEPLOY2.0 endpoint
    this.app.post('/api/deploy', async (req, res) => {
      try {
        if (this.isDeployed) {
          return res.status(400).json({
            success: false,
            message: 'Bot already deployed'
          });
        }

        console.log('🚀🚀🚀 EXECUTING DEPLOY2.0 🚀🚀🚀');
        console.log('🎯 LAUNCHING DYNAMIC $150-250 STRATEGY');
        
        // Create deployment flag
        const deploymentData = {
          status: 'ACTIVE',
          deployTime: new Date().toISOString(),
          strategy: 'DYNAMIC_150_250',
          trigger: 0.0190,
          lieutenant: 'AUTHORIZED'
        };
        
        fs.writeFileSync('.deployment-active', JSON.stringify(deploymentData, null, 2));

        // Start the trading bot
        this.botProcess = spawn('node', ['advanced-neet-trader.js'], {
          stdio: 'pipe',
          detached: false
        });

        this.botProcess.on('exit', (code) => {
          console.log('🎖️ Bot process terminated with code:', code);
          this.isDeployed = false;
          if (fs.existsSync('.deployment-active')) {
            fs.unlinkSync('.deployment-active');
          }
        });

        this.botProcess.on('error', (error) => {
          console.error('❌ Bot process error:', error);
        });

        this.isDeployed = true;
        
        res.json({
          success: true,
          message: 'DEPLOY2.0 successful',
          deployment: deploymentData
        });

        console.log('✅ DEPLOY2.0 SUCCESSFUL!');
        console.log('🎖️ BOT IS LIVE AND MONITORING DEX');

      } catch (error) {
        console.error('❌ DEPLOYMENT FAILED:', error);
        res.status(500).json({
          success: false,
          message: error.message
        });
      }
    });

    // RETREAT endpoint
    this.app.post('/api/retreat', async (req, res) => {
      try {
        console.log('🚨🚨🚨 EXECUTING RETREAT PROTOCOL 🚨🚨🚨');
        console.log('🛑 EMERGENCY SHUTDOWN ACTIVATED');

        if (this.botProcess) {
          console.log('💀 TERMINATING BOT PROCESS...');
          this.botProcess.kill('SIGTERM');
          
          // Force kill after 5 seconds if still running
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
          reason: req.body.reason || 'LIEUTENANT_COMMAND',
          status: 'SHUTDOWN_COMPLETE'
        };
        
        fs.writeFileSync('retreat-log.json', JSON.stringify(retreatLog, null, 2));

        this.isDeployed = false;
        this.botProcess = null;

        res.json({
          success: true,
          message: 'RETREAT complete - All operations ceased',
          retreat: retreatLog
        });

        console.log('✅ RETREAT COMPLETE - ALL OPERATIONS CEASED');
        console.log('🎖️ ALL SYSTEMS SECURED');

      } catch (error) {
        console.error('❌ RETREAT ERROR:', error);
        res.status(500).json({
          success: false,
          message: error.message
        });
      }
    });

    // Status endpoint
    this.app.get('/api/status', (req, res) => {
      const status = {
        deployed: this.isDeployed,
        timestamp: new Date().toISOString(),
        deployment: null
      };

      if (fs.existsSync('.deployment-active')) {
        try {
          status.deployment = JSON.parse(fs.readFileSync('.deployment-active', 'utf8'));
        } catch (error) {
          console.error('Error reading deployment status:', error);
        }
      }

      res.json(status);
    });
  }

  start() {
    this.app.listen(this.port, () => {
      console.log('🎖️🎖️🎖️ TACTICAL CONTROL SERVER ONLINE 🎖️🎖️🎖️');
      console.log(`🚀 Server running at http://localhost:${this.port}`);
      console.log('🇺🇸 DEPLOY2.0 & RETREAT Controls Ready');
      console.log('⚠️ HIGH RISK OPERATIONS - NOT FINANCIAL ADVICE');
      console.log('');
      console.log('📋 Available Commands:');
      console.log('   🌐 Open http://localhost:3000 for visual controls');
      console.log('   🎯 Click DEPLOY2.0 to launch strategy');
      console.log('   🚨 Click RETREAT for emergency shutdown');
      console.log('');
      console.log('🎖️ Standing by for LIEUTENANT\'s orders...');
    });
  }

  // Graceful shutdown
  shutdown() {
    console.log('\\n🚨 SERVER SHUTDOWN INITIATED');
    
    if (this.isDeployed && this.botProcess) {
      console.log('💀 TERMINATING BOT PROCESS...');
      this.botProcess.kill('SIGTERM');
    }

    if (fs.existsSync('.deployment-active')) {
      fs.unlinkSync('.deployment-active');
    }

    process.exit(0);
  }
}

// Create and start the server
const server = new TacticalControlServer();

// Handle graceful shutdown
process.on('SIGINT', () => {
  server.shutdown();
});

process.on('SIGTERM', () => {
  server.shutdown();
});

// Start the server
server.start();

module.exports = TacticalControlServer;
