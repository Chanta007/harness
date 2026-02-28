#!/usr/bin/env node

/**
 * Harness Environment Setup Utility
 * Simple static API key configuration following HARNESS.md Security Gateway Pattern
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class HarnessEnvironmentSetup {
  constructor() {
    this.envExample = path.join(process.cwd(), '.env.example');
    this.envLocal = path.join(process.cwd(), '.env.local');
  }

  /**
   * Generate a secure random API key for shared secret authentication
   */
  generateSecureKey() {
    // Generate 32 bytes (256 bits) of random data
    const randomBytes = crypto.randomBytes(32);
    return `harness_${randomBytes.toString('hex')}`;
  }

  /**
   * Setup local development environment
   */
  setupLocalEnvironment() {
    console.log('🔧 Setting up Harness Engineering v3 environment...\n');

    // Generate secure API key
    const apiKey = this.generateSecureKey();
    console.log('🔑 Generated secure API key for development\n');

    // Read template
    let envContent = '';
    try {
      if (fs.existsSync(this.envExample)) {
        envContent = fs.readFileSync(this.envExample, 'utf8');
      }
    } catch (error) {
      console.error('❌ Error reading .env.example:', error.message);
      return;
    }

    // Replace template key with generated key
    const updatedContent = envContent.replace(
      'harness_your_secure_random_key_here_32plus_chars',
      apiKey
    );

    // Write to .env.local
    try {
      fs.writeFileSync(this.envLocal, updatedContent);
      console.log('✅ Created .env.local with secure configuration');
    } catch (error) {
      console.error('❌ Error creating .env.local:', error.message);
      return;
    }

    // Display setup instructions
    this.displaySetupInstructions(apiKey);
  }

  /**
   * Display deployment instructions
   */
  displaySetupInstructions(apiKey) {
    console.log('\n📋 Deployment Instructions:');
    console.log('=' .repeat(50));

    console.log('\n🏠 Local Development:');
    console.log('   ✅ .env.local created with secure API key');
    console.log('   ✅ Ready for local development');

    console.log('\n🚀 Render.com Production Setup:');
    console.log('   1. Go to Render.com dashboard');
    console.log('   2. Navigate to your service → Environment');
    console.log('   3. Add this environment variable:');
    console.log('   ┌─────────────────────────────────────────┐');
    console.log('   │ Key:   HARNESS_API_KEY                 │');
    console.log(`   │ Value: ${apiKey.substring(0, 20)}... │`);
    console.log('   └─────────────────────────────────────────┘');

    console.log('\n🔒 Security Notes:');
    console.log('   • Same API key used in both local and production');
    console.log('   • Key stored as environment variable (secure)');
    console.log('   • No key generation tools in production container');
    console.log('   • Follows HARNESS.md Security Gateway Pattern');

    console.log('\n✨ Next Steps:');
    console.log('   ./harness "test local setup"    # Test local');
    console.log('   npm run deploy                  # Deploy to production');

    console.log('\n💡 Pro Tip: Keep this API key secure and rotate periodically');
  }

  /**
   * Display help information
   */
  displayHelp() {
    console.log(`
🔧 Harness Environment Setup

Usage:
  npm run setup-env         Setup local development environment
  node scripts/setup-env.js  Direct script execution

What this does:
  1. Generates a secure random API key (256-bit)
  2. Creates .env.local with proper configuration
  3. Provides deployment instructions for Render.com

Security:
  • Uses static shared secret approach (industry standard)
  • Same API key for local development and production
  • Environment variable deployment (never in code)
  • No key generation tools in production containers

Following HARNESS.md Security Gateway Pattern ✅
`);
  }
}

// CLI interface
async function main() {
  const setupManager = new HarnessEnvironmentSetup();
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    setupManager.displayHelp();
    return;
  }

  setupManager.setupLocalEnvironment();
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Setup error:', error.message);
    process.exit(1);
  });
}

module.exports = HarnessEnvironmentSetup;