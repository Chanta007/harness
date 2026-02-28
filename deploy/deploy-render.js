#!/usr/bin/env node

/**
 * Render.com Deployment Script for Harness Engineering v3
 * Deploys Docker container with multiple services
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

const CONFIG = {
  serviceName: 'harness-orchestrator',
  dockerImage: 'harness-engineering-v3',
  region: 'oregon',
  repo: 'https://github.com/Chanta007/harness.git',
  branch: 'main'
};

class RenderDeployer {
  constructor() {
    this.serviceId = null;
    this.renderConfig = null;
  }

  /**
   * Main deployment orchestration
   */
  async deploy() {
    console.log('🚀 Deploying Harness Engineering v3 to Render.com...\n');

    try {
      // 1. Validate environment and prerequisites
      await this.validateEnvironment();

      // 2. Prepare deployment configuration
      await this.prepareDeploymentConfig();

      // 3. Deploy to Render.com
      await this.deployToRender();

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

    // Check if render CLI is installed
    try {
      execSync('render version', { stdio: 'ignore' });
    } catch (error) {
      console.log('⚠️ Render CLI not found. You can deploy via Git push or Render Dashboard');
      console.log('   Git deployment: git push origin main');
      console.log('   Dashboard: https://dashboard.render.com');
    }

    // Check required files
    const requiredFiles = ['Dockerfile', 'render.yaml', 'HARNESS.md'];
    for (const file of requiredFiles) {
      try {
        await fs.access(file);
      } catch (error) {
        throw new Error(`Required file missing: ${file}`);
      }
    }

    // Check for API keys
    const apiKeys = ['NOVITA_API_KEY', 'ANTHROPIC_API_KEY'];
    const missingKeys = apiKeys.filter(key => !process.env[key]);

    if (missingKeys.length > 0) {
      console.log('⚠️ Missing environment variables for full functionality:');
      missingKeys.forEach(key => {
        console.log(`   ${key} - Set in Render.com dashboard`);
      });
      console.log('   The system will run in demo mode without these keys');
    }

    // CRITICAL SECURITY CHECK: Validate HARNESS_API_KEY is prepared for production
    if (!process.env.HARNESS_API_KEY) {
      console.log('🚨 CRITICAL: HARNESS_API_KEY not set for deployment');
      console.log('📋 HARNESS.md Security Gateway Requirement:');
      console.log('   1. Setup environment locally: npm run setup-env');
      console.log('   2. Copy the API key from .env.local');
      console.log('   3. Set HARNESS_API_KEY in Render.com environment variables');
      console.log('   4. Use the SAME key in both local and production');
      console.log('');
      console.log('⚠️ Proceeding without HARNESS_API_KEY - remember to set it in Render dashboard');
    } else {
      console.log('✅ HARNESS_API_KEY detected - MCP authentication configured');
    }

    console.log('✅ Environment validated');
  }

  /**
   * Prepare deployment configuration
   */
  async prepareDeploymentConfig() {
    console.log('📝 Preparing deployment configuration...');

    try {
      // Read render.yaml configuration
      const configPath = path.join(__dirname, '..', 'render.yaml');
      const configContent = await fs.readFile(configPath, 'utf8');
      this.renderConfig = configContent;

      // Validate Docker configuration
      await fs.access('Dockerfile');

      console.log('✅ Configuration prepared');
    } catch (error) {
      throw new Error(`Failed to prepare config: ${error.message}`);
    }
  }

  /**
   * Deploy to Render.com
   */
  async deployToRender() {
    console.log('🚀 Starting deployment to Render.com...');

    // Method 1: Git-based deployment (recommended)
    await this.deployViaGit();

    // Method 2: CLI deployment (if render CLI is available)
    // await this.deployViaCLI();
  }

  /**
   * Deploy via Git push (most reliable method)
   */
  async deployViaGit() {
    console.log('📦 Deploying via Git...');

    try {
      // Ensure all changes are committed
      const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
      if (gitStatus.trim()) {
        console.log('⚠️ Uncommitted changes detected. Committing...');
        execSync('git add .', { stdio: 'inherit' });
        execSync('git commit -m "Deploy: Update for Render.com Docker deployment"', { stdio: 'inherit' });
      }

      // Push to trigger deployment
      console.log('🔄 Pushing to GitHub (this will trigger Render.com deployment)...');
      execSync('git push origin main', { stdio: 'inherit' });

      console.log('✅ Code pushed - Render.com will automatically deploy');
      console.log('📊 Monitor deployment at: https://dashboard.render.com');

    } catch (error) {
      throw new Error(`Git deployment failed: ${error.message}`);
    }
  }

  /**
   * Deploy via Render CLI (if available)
   */
  async deployViaCLI() {
    console.log('🔧 Deploying via Render CLI...');

    try {
      const renderYamlPath = path.join(__dirname, '..', 'render.yaml');

      // Deploy using render CLI
      const deployCmd = `render services create --config ${renderYamlPath}`;
      console.log('Running:', deployCmd);

      const output = execSync(deployCmd, { encoding: 'utf8', stdio: 'inherit' });
      console.log('✅ CLI deployment initiated');

    } catch (error) {
      console.log('⚠️ CLI deployment failed, using Git deployment instead');
      await this.deployViaGit();
    }
  }

  /**
   * Verify deployment status
   */
  async verifyDeployment() {
    console.log('🔍 Verifying deployment...');

    // Wait a moment for deployment to start
    console.log('⏳ Waiting for deployment to initialize...');
    await this.delay(5000);

    console.log('✅ Deployment verification initiated');
    console.log('📊 Check deployment status at: https://dashboard.render.com');
  }

  /**
   * Display deployment information
   */
  async displayDeploymentInfo() {
    console.log('\n📊 Render.com Deployment Information:');
    console.log('═'.repeat(50));

    console.log('\n🌐 Service Configuration:');
    console.log('   Service Type: Docker Web Service');
    console.log('   Region: Oregon');
    console.log('   Plan: Starter');
    console.log('   Auto-deploy: Enabled');

    console.log('\n🔗 Deployment URLs:');
    console.log('   Dashboard: https://dashboard.render.com');
    console.log('   Service URL: https://harness-orchestrator.onrender.com');
    console.log('   Health Check: https://harness-orchestrator.onrender.com/health');
    console.log('   API Docs: https://harness-orchestrator.onrender.com/');

    console.log('\n🔧 Service Endpoints:');
    console.log('   Agent Selection: /api/select-agents');
    console.log('   Screenshot Analysis: /api/analyze-screenshot');
    console.log('   Task Validation: /api/validate');
    console.log('   Methodology: /api/methodology');

    console.log('\n📱 Environment Variables (Set in Render Dashboard):');
    console.log('   HARNESS_API_KEY - Required for MCP server authentication (HARNESS.md Security Gateway)');
    console.log('   NOVITA_API_KEY - LLM coordination and screenshot analysis');
    console.log('   ANTHROPIC_API_KEY - Enhanced Claude features (optional)');

    console.log('\n🔑 API Key Setup (CRITICAL):');
    console.log('   1. Setup environment: npm run setup-env');
    console.log('   2. Copy the API key from .env.local file');
    console.log('   3. Set HARNESS_API_KEY in Render.com dashboard');
    console.log('   4. Use SAME key for both local and production');

    console.log('\n📊 Monitoring & Management:');
    console.log('   Logs: https://dashboard.render.com → Service → Logs');
    console.log('   Metrics: https://dashboard.render.com → Service → Metrics');
    console.log('   Settings: https://dashboard.render.com → Service → Settings');

    console.log('\n🚀 Usage After Deployment:');
    console.log('   Update your local config:');
    console.log('   export HARNESS_MCP_URL=https://harness-orchestrator.onrender.com');
    console.log('   export HARNESS_API_KEY=your_generated_api_key');
    console.log('   ./harness "test deployment"');

    console.log('\n💡 Next Steps:');
    console.log('   1. Generate API key: npm run keygen');
    console.log('   2. Set HARNESS_API_KEY in Render dashboard (CRITICAL)');
    console.log('   3. Set other environment variables in Render dashboard');
    console.log('   4. Test deployment with: curl https://harness-orchestrator.onrender.com/health');
    console.log('   5. Configure custom domain if needed');
    console.log('   6. Set up monitoring alerts');

    console.log('\n💰 Cost Estimation:');
    console.log('   Starter Plan: $7/month');
    console.log('   Redis Cache: $3/month (optional)');
    console.log('   Total: ~$7-10/month');
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
    console.log('🚀 Harness v3 Render.com Deployment\n');
    console.log('Usage: node deploy/deploy-render.js [command]\n');
    console.log('Commands:');
    console.log('  deploy     Deploy to Render.com (default)');
    console.log('  help       Show this help message\n');
    console.log('Deployment Methods:');
    console.log('  1. Automatic Git deployment (recommended)');
    console.log('  2. Manual dashboard deployment');
    console.log('  3. CLI deployment (if render CLI installed)\n');
    console.log('Prerequisites:');
    console.log('  - GitHub repository connected to Render.com');
    console.log('  - Dockerfile and render.yaml configured');
    console.log('  - Environment variables set in Render dashboard\n');
    console.log('Setup Steps:');
    console.log('  1. Connect GitHub repo at: https://dashboard.render.com');
    console.log('  2. Create new Web Service from Docker');
    console.log('  3. Set environment variables: NOVITA_API_KEY, ANTHROPIC_API_KEY');
    console.log('  4. Deploy: npm run deploy:render');
  }
}

// CLI interface
async function main() {
  const command = process.argv[2] || 'deploy';

  switch (command) {
    case 'deploy':
      const deployer = new RenderDeployer();
      await deployer.deploy();
      break;

    case 'help':
    case '--help':
    case '-h':
      RenderDeployer.displayHelp();
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

module.exports = RenderDeployer;