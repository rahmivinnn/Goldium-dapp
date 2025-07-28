#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Goldium Netlify Auto Deployment');
console.log('===================================');

// Check if Netlify CLI is installed
function checkNetlifyCLI() {
  try {
    execSync('netlify --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

// Install Netlify CLI if not present
if (!checkNetlifyCLI()) {
  console.log('\n📦 Installing Netlify CLI...');
  try {
    execSync('npm install -g netlify-cli', { stdio: 'inherit' });
    console.log('✅ Netlify CLI installed');
  } catch (error) {
    console.error('❌ Failed to install Netlify CLI. Please install manually:');
    console.error('   npm install -g netlify-cli');
    process.exit(1);
  }
}

// Create netlify.toml configuration
console.log('\n⚙️  Creating Netlify configuration...');
const netlifyConfig = `[build]
  publish = "out"
  command = "npm run build && npm run export"

[build.environment]
  NEXT_PUBLIC_SOLANA_NETWORK = "mainnet-beta"
  NEXT_PUBLIC_RPC_ENDPOINT = "https://api.mainnet-beta.solana.com"
  NEXT_PUBLIC_APP_NAME = "Goldium"
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/api/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
    Access-Control-Allow-Methods = "GET, POST, PUT, DELETE, OPTIONS"
    Access-Control-Allow-Headers = "Content-Type, Authorization"

# Cache static assets
[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
`;

try {
  fs.writeFileSync('netlify.toml', netlifyConfig);
  console.log('✅ netlify.toml created');
} catch (error) {
  console.error('❌ Failed to create netlify.toml:', error.message);
}

// Update next.config.js for static export
console.log('\n🔧 Updating Next.js configuration for Netlify...');
const nextConfigContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['api.coingecko.com', 'assets.coingecko.com']
  },
  env: {
    NEXT_PUBLIC_SOLANA_NETWORK: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta',
    NEXT_PUBLIC_RPC_ENDPOINT: process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com',
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Goldium'
  },
  // Enable static export for Netlify
  output: 'export',
  distDir: 'out'
}

module.exports = nextConfig
`;

try {
  fs.writeFileSync('next.config.js', nextConfigContent);
  console.log('✅ next.config.js updated for Netlify');
} catch (error) {
  console.error('❌ Failed to update next.config.js:', error.message);
}

// Update package.json with export script
console.log('\n📦 Adding export script to package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  packageJson.scripts.export = 'next export';
  packageJson.scripts['build:netlify'] = 'next build && next export';
  
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  console.log('✅ package.json updated with export scripts');
} catch (error) {
  console.error('❌ Failed to update package.json:', error.message);
}

// Create _redirects file for SPA routing
console.log('\n🔄 Creating redirects configuration...');
const redirectsContent = `# SPA routing
/*    /index.html   200

# API routes (if using Netlify Functions)
/api/*  /.netlify/functions/:splat  200

# Security headers
/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
`;

try {
  if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
  }
  fs.writeFileSync('public/_redirects', redirectsContent);
  console.log('✅ _redirects file created');
} catch (error) {
  console.error('❌ Failed to create _redirects:', error.message);
}

// Create environment variables file
console.log('\n📝 Creating environment configuration...');
const envContent = `# Netlify Environment Variables
# Add these in your Netlify dashboard under Site settings > Environment variables

NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_RPC_ENDPOINT=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_APP_NAME=Goldium
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app

# Optional: Custom RPC for better performance
# NEXT_PUBLIC_RPC_ENDPOINT=https://your-custom-rpc.com
`;

try {
  fs.writeFileSync('.env.netlify', envContent);
  console.log('✅ .env.netlify created');
} catch (error) {
  console.error('❌ Failed to create .env.netlify:', error.message);
}

// Build and test locally
console.log('\n🏗️  Building project for static export...');
try {
  execSync('npm run build:netlify', { stdio: 'inherit' });
  console.log('✅ Static export build successful');
} catch (error) {
  console.error('❌ Build failed. Please fix errors before deploying.');
  console.log('\n🔧 Common issues:');
  console.log('   - Remove dynamic API routes or move to Netlify Functions');
  console.log('   - Check for client-side only code in components');
  console.log('   - Verify all imports are correct');
  process.exit(1);
}

// Deploy options
console.log('\n🚀 Netlify Deployment Options');
console.log('==============================');
console.log('\n📋 Choose deployment method:');
console.log('   1. Auto deploy via CLI (recommended)');
console.log('   2. Manual drag & drop');
console.log('   3. Git integration setup');
console.log('   4. Setup only (no deploy)');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('\nChoose option (1-4): ', (answer) => {
  rl.close();
  
  switch(answer.trim()) {
    case '1':
      console.log('\n🚀 Starting CLI deployment...');
      try {
        console.log('\n📝 First, you need to login to Netlify...');
        execSync('netlify login', { stdio: 'inherit' });
        
        console.log('\n🚀 Deploying to Netlify...');
        execSync('netlify deploy --prod --dir=out', { stdio: 'inherit' });
        
        console.log('\n🎉 Deployment completed!');
        console.log('\n📋 Post-deployment checklist:');
        console.log('   ✅ Set custom domain in Netlify dashboard');
        console.log('   ✅ Configure environment variables');
        console.log('   ✅ Enable HTTPS (automatic with Netlify)');
        console.log('   ✅ Test wallet connections');
        console.log('   ✅ Test all DApp functions');
      } catch (error) {
        console.error('❌ CLI deployment failed:', error.message);
        console.log('\n🔧 Try manual deployment instead.');
      }
      break;
      
    case '2':
      console.log('\n📁 Manual deployment instructions:');
      console.log('   1. Go to https://app.netlify.com/drop');
      console.log('   2. Drag and drop the "out" folder');
      console.log('   3. Wait for deployment to complete');
      console.log('   4. Configure custom domain if needed');
      console.log('\n📂 Deployment folder: ./out/');
      break;
      
    case '3':
      console.log('\n🔗 Git integration setup:');
      console.log('   1. Push your code to GitHub/GitLab/Bitbucket');
      console.log('   2. Go to https://app.netlify.com/start');
      console.log('   3. Connect your repository');
      console.log('   4. Set build command: npm run build:netlify');
      console.log('   5. Set publish directory: out');
      console.log('   6. Add environment variables from .env.netlify');
      break;
      
    case '4':
      console.log('\n⚙️  Setup completed!');
      console.log('\n📋 Manual deployment options:');
      console.log('   • CLI: netlify deploy --prod --dir=out');
      console.log('   • Drag & Drop: https://app.netlify.com/drop');
      console.log('   • Git Integration: https://app.netlify.com/start');
      break;
      
    default:
      console.log('\n❌ Invalid option. Setup completed.');
  }
  
  console.log('\n🌟 Goldium Netlify deployment process completed!');
  console.log('\n📁 Files created/updated:');
  console.log('   📄 netlify.toml - Netlify configuration');
  console.log('   📄 next.config.js - Updated for static export');
  console.log('   📄 package.json - Added export scripts');
  console.log('   📄 public/_redirects - SPA routing');
  console.log('   📄 .env.netlify - Environment variables');
  console.log('   📂 out/ - Static export build');
  console.log('\n🔗 Useful links:');
  console.log('   📊 Netlify Dashboard: https://app.netlify.com/');
  console.log('   📚 Netlify Docs: https://docs.netlify.com/');
  console.log('   🛠️  Next.js Static Export: https://nextjs.org/docs/advanced-features/static-html-export');
});