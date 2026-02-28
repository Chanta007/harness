#!/usr/bin/env node

/**
 * Digital Ocean Deployment Script
 * Deploys Harness Engineering v3 to Digital Ocean App Platform
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

const CONFIG = {
  appName: 'harness-v3-orchestrator',
  region: 'nyc1',
  repo: 'Chanta007/harness',
  branch: 'main'
};

class DigitalOceanDeployer {
  constructor() {
    this.deploymentConfig = null;
  }

  /**
   * Main deployment orchestration
   */
  async deploy() {
    console.log('🚀 Deploying Harness Engineering v3 to Digital Ocean...\n');

    try {
      // 1. Validate environment
      await this.validateEnvironment();

      // 2. Prepare deployment configuration
      await this.prepareDeploymentConfig();

      // 3. Deploy using doctl CLI
      await this.deployWithDocTL();

      // 4. Verify deployment
      await this.verifyDeployment();

      console.log('\n✅ Deployment completed successfully!');
      await this.displayDeploymentInfo();

    } catch (error) {
      console.error('\n❌ Deployment failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Validate environment and prerequisites
   */
  async validateEnvironment() {
    console.log('🔍 Validating environment...');

    // Check if doctl is installed
    try {
      execSync('doctl version', { stdio: 'ignore' });
    } catch (error) {
      throw new Error('doctl CLI not found. Install from: https://github.com/digitalocean/doctl');
    }

    // Check if authenticated
    try {
      execSync('doctl account get', { stdio: 'ignore' });
    } catch (error) {
      throw new Error('Not authenticated with Digital Ocean. Run: doctl auth init');
    }

    // Check required environment variables
    const requiredEnvVars = ['NOVITA_API_KEY'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      console.log('⚠️ Missing environment variables. Please set:');
      missingVars.forEach(varName => {
        console.log(`   export ${varName}=your_key_here`);
      });
      console.log('\nOptional: ANTHROPIC_API_KEY for enhanced LLM features');
    }

    console.log('✅ Environment validated');
  }

  /**
   * Prepare deployment configuration
   */
  async prepareDeploymentConfig() {
    console.log('📝 Preparing deployment configuration...');

    const configPath = path.join(__dirname, 'digitalocean.yaml');

    try {
      const configContent = await fs.readFile(configPath, 'utf8');
      this.deploymentConfig = configContent;
      console.log('✅ Configuration loaded');
    } catch (error) {
      throw new Error(`Failed to load deployment config: ${error.message}`);
    }
  }

  /**
   * Deploy using Digital Ocean CLI
   */
  async deployWithDocTL() {
    console.log('🚀 Starting deployment to Digital Ocean...');

    const configPath = path.join(__dirname, 'digitalocean.yaml');

    try {
      // Create or update app
      console.log('📦 Deploying app platform configuration...');

      const deployCmd = `doctl apps create --spec ${configPath}`;

      console.log('Running:', deployCmd);
      const output = execSync(deployCmd, { encoding: 'utf8' });

      console.log('Deployment initiated:', output);

      // Extract app ID from output
      const appIdMatch = output.match(/ID: ([a-f0-9-]+)/);
      if (appIdMatch) {
        this.appId = appIdMatch[1];
        console.log(`📱 App ID: ${this.appId}`);
      }

    } catch (error) {
      // If create fails, try update
      console.log('⚠️ Create failed, trying update...');

      try {
        // List apps to find existing app
        const listOutput = execSync('doctl apps list --format ID,Name', { encoding: 'utf8' });
        const appMatch = listOutput.match(/([a-f0-9-]+)\s+harness-v3-orchestrator/);

        if (appMatch) {
          this.appId = appMatch[1];
          console.log(`🔄 Updating existing app: ${this.appId}`);

          const updateCmd = `doctl apps update ${this.appId} --spec ${configPath}`;
          execSync(updateCmd, { stdio: 'inherit' });
        } else {
          throw new Error('Failed to create or find existing app');
        }
      } catch (updateError) {
        throw new Error(`Deployment failed: ${updateError.message}`);
      }
    }

    console.log('✅ Deployment configuration submitted');
  }

  /**
   * Verify deployment status
   */
  async verifyDeployment() {
    if (!this.appId) {
      console.log('⚠️ No app ID available, skipping verification');
      return;
    }

    console.log('🔍 Verifying deployment...');

    // Wait for deployment to complete
    let attempts = 0;
    const maxAttempts = 30; // 5 minutes with 10s intervals

    while (attempts < maxAttempts) {
      try {
        const statusOutput = execSync(`doctl apps get ${this.appId} --format Phase`, { encoding: 'utf8' });

        if (statusOutput.includes('ACTIVE')) {
          console.log('✅ Deployment is active');
          break;
        } else if (statusOutput.includes('ERROR')) {
          throw new Error('Deployment failed with error status');
        } else {
          console.log(`⏳ Deployment in progress... (${statusOutput.trim()})`);
          await this.delay(10000); // Wait 10 seconds
          attempts++;
        }
      } catch (error) {
        console.log('⚠️ Status check failed:', error.message);
        attempts++;
      }
    }

    if (attempts >= maxAttempts) {
      console.log('⚠️ Verification timeout. Check deployment status manually.');
    }
  }

  /**
   * Display deployment information
   */
  async displayDeploymentInfo() {
    console.log('\n📊 Deployment Information:');
    console.log('═'.repeat(50));

    if (this.appId) {
      try {
        const appInfo = execSync(`doctl apps get ${this.appId} --format Name,Phase,DefaultIngress`, { encoding: 'utf8' });
        console.log(appInfo);

        // Extract URL
        const urlMatch = appInfo.match(/https:\/\/[^\s]+/);
        if (urlMatch) {
          const baseUrl = urlMatch[0];
          console.log('\n🌐 Service Endpoints:');
          console.log(`   Main MCP Server: ${baseUrl}`);
          console.log(`   Health Check: ${baseUrl}/health`);
          console.log(`   Agent Selection: ${baseUrl}/api/select-agents`);
          console.log(`   Screenshot Analysis: ${baseUrl}/api/analyze-screenshot`);
          console.log(`   WebSocket: wss://harness-websocket-${baseUrl.split('//')[1]}/ws`);
        }
      } catch (error) {
        console.log('⚠️ Could not retrieve app info:', error.message);
      }
    }

    console.log('\n🛠️ Digital Ocean Management:');
    console.log('   Dashboard: https://cloud.digitalocean.com/apps');
    console.log('   CLI Status: doctl apps get', this.appId || '<app-id>');
    console.log('   Logs: doctl apps logs', this.appId || '<app-id>', '--follow');

    console.log('\n📚 Next Steps:');
    console.log('   1. Test the deployment: ./harness "test deployment"');
    console.log('   2. Update your local config with new endpoint URLs');
    console.log('   3. Set up monitoring and alerts in Digital Ocean dashboard');
    console.log('   4. Configure custom domain if needed');
  }

  /**
   * Utility delay function
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Display help information
   */
  static displayHelp() {
    console.log('🚀 Harness v3 Digital Ocean Deployment\n');
    console.log('Usage: node deploy/deploy-digitalocean.js [command]\n');
    console.log('Commands:');
    console.log('  deploy     Deploy to Digital Ocean (default)');
    console.log('  status     Check deployment status');
    console.log('  logs       View application logs');
    console.log('  destroy    Remove deployment\n');
    console.log('Prerequisites:');
    console.log('  - doctl CLI installed and authenticated');
    console.log('  - NOVITA_API_KEY environment variable set');
    console.log('  - Optional: ANTHROPIC_API_KEY for enhanced features\n');
    console.log('Setup:');
    console.log('  1. Install doctl: https://github.com/digitalocean/doctl');
    console.log('  2. Authenticate: doctl auth init');
    console.log('  3. Set API keys: export NOVITA_API_KEY=your_key');
    console.log('  4. Deploy: npm run deploy:do');
  }
}

// CLI interface
async function main() {
  const command = process.argv[2] || 'deploy';

  switch (command) {
    case 'deploy':
      const deployer = new DigitalOceanDeployer();
      await deployer.deploy();
      break;

    case 'help':
    case '--help':
    case '-h':
      DigitalOceanDeployer.displayHelp();
      break;

    default:
      console.log(`Unknown command: ${command}`);
      console.log('Use --help for usage information');
      process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Deployment error:', error.message);
    process.exit(1);
  });
}

module.exports = DigitalOceanDeployer;