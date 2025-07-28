#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Goldium Vercel Auto Deployment');
console.log('==================================');

// Check if Vercel CLI is installed
function checkVercelCLI() {
  try {
    execSync('vercel --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

// Install Vercel CLI if not present
if (!checkVercelCLI()) {
  console.log('\n📦 Installing Vercel CLI...');
  try {
    execSync('npm install -g vercel', { stdio: 'inherit' });
    console.log('✅ Vercel CLI installed');
  } catch (error) {
    console.error('❌ Failed to install Vercel CLI. Please install manually:');
    console.error('   npm install -g vercel');
    process.exit(1);
  }
}

// Create vercel.json configuration
console.log('\n⚙️  Creating Vercel configuration...');
const vercelConfig = {
  "name": "goldium-dapp",
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_SOLANA_NETWORK": "mainnet-beta",
    "NEXT_PUBLIC_RPC_ENDPOINT": "https://api.mainnet-beta.solana.com",
    "NEXT_PUBLIC_APP_NAME": "Goldium"
  },
  "functions": {
    "src/pages/api/**/*.ts": {
      "maxDuration": 30
    }
  }
};

try {
  fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
  console.log('✅ vercel.json created');
} catch (error) {
  console.error('❌ Failed to create vercel.json:', error.message);
}

// Update next.config.js for Vercel
console.log('\n🔧 Updating Next.js configuration for Vercel...');
const nextConfigContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: false
  },
  images: {
    domains: ['api.coingecko.com', 'assets.coingecko.com']
  },
  env: {
    NEXT_PUBLIC_SOLANA_NETWORK: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta',
    NEXT_PUBLIC_RPC_ENDPOINT: process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com',
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Goldium'
  }
}

module.exports = nextConfig
`;

try {
  fs.writeFileSync('next.config.js', nextConfigContent);
  console.log('✅ next.config.js updated for Vercel');
} catch (error) {
  console.error('❌ Failed to update next.config.js:', error.message);
}

// Create .env.example
console.log('\n📝 Creating environment example...');
const envExample = `# Solana Configuration
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_RPC_ENDPOINT=https://api.mainnet-beta.solana.com

# Application Settings
NEXT_PUBLIC_APP_NAME=Goldium
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# Optional: Custom RPC (for better performance)
# NEXT_PUBLIC_RPC_ENDPOINT=https://your-custom-rpc-endpoint.com
`;

try {
  fs.writeFileSync('.env.example', envExample);
  console.log('✅ .env.example created');
} catch (error) {
  console.error('❌ Failed to create .env.example:', error.message);
}

// Build and test locally first
console.log('\n🏗️  Building project locally...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Local build successful');
} catch (error) {
  console.error('❌ Local build failed. Please fix errors before deploying.');
  process.exit(1);
}

// Deploy to Vercel
console.log('\n🚀 Deploying to Vercel...');
console.log('\n📋 Deployment options:');
console.log('   1. Production deployment (recommended)');
console.log('   2. Preview deployment');
console.log('   3. Setup only (no deploy)');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('\nChoose option (1-3): ', (answer) => {
  rl.close();
  
  switch(answer.trim()) {
    case '1':
      console.log('\n🚀 Starting production deployment...');
      try {
        execSync('vercel --prod', { stdio: 'inherit' });
        console.log('\n🎉 Production deployment completed!');
        console.log('\n📋 Post-deployment checklist:');
        console.log('   ✅ Set custom domain in Vercel dashboard');
        console.log('   ✅ Configure environment variables');
        console.log('   ✅ Enable HTTPS (automatic with Vercel)');
        console.log('   ✅ Test wallet connections');
        console.log('   ✅ Test all trading functions');
      } catch (error) {
        console.error('❌ Deployment failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('   1. Run: vercel login');
        console.log('   2. Check build errors');
        console.log('   3. Verify environment variables');
      }
      break;
      
    case '2':
      console.log('\n🔍 Starting preview deployment...');
      try {
        execSync('vercel', { stdio: 'inherit' });
        console.log('\n✅ Preview deployment completed!');
      } catch (error) {
        console.error('❌ Preview deployment failed:', error.message);
      }
      break;
      
    case '3':
      console.log('\n⚙️  Setup completed!');
      console.log('\n📋 Manual deployment steps:');
      console.log('   1. Run: vercel login');
      console.log('   2. Run: vercel (for preview) or vercel --prod (for production)');
      console.log('   3. Configure custom domain in Vercel dashboard');
      break;
      
    default:
      console.log('\n❌ Invalid option. Setup completed.');
      console.log('\n📋 Manual deployment steps:');
      console.log('   1. Run: vercel login');
      console.log('   2. Run: vercel --prod');
  }
  
  console.log('\n🌟 Goldium deployment process completed!');
  console.log('\n📁 Files created/updated:');
  console.log('   📄 vercel.json - Vercel configuration');
  console.log('   📄 next.config.js - Updated for Vercel');
  console.log('   📄 .env.example - Environment variables template');
  console.log('\n🔗 Useful links:');
  console.log('   📊 Vercel Dashboard: https://vercel.com/dashboard');
  console.log('   📚 Vercel Docs: https://vercel.com/docs');
  console.log('   🛠️  Next.js Docs: https://nextjs.org/docs');
});