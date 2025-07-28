#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Goldium Auto Deployment Manager');
console.log('===================================');
console.log('🌟 Welcome to Goldium DApp Deployment!');
console.log('\n📱 This tool will help you deploy your Solana DApp to various platforms.');

// Check Node.js version
const nodeVersion = process.version;
console.log(`\n🔧 Node.js version: ${nodeVersion}`);
if (parseInt(nodeVersion.slice(1)) < 16) {
  console.error('❌ Node.js 16+ is required. Please upgrade your Node.js version.');
  process.exit(1);
}

// Check if npm is available
try {
  execSync('npm --version', { stdio: 'pipe' });
  console.log('✅ npm is available');
} catch (error) {
  console.error('❌ npm is not available. Please install Node.js with npm.');
  process.exit(1);
}

// Display deployment options
console.log('\n🌐 Available Deployment Platforms:');
console.log('=====================================');
console.log('\n1. 🚀 Vercel (Recommended)');
console.log('   • ✅ Zero configuration');
console.log('   • ✅ Automatic HTTPS');
console.log('   • ✅ Global CDN');
console.log('   • ✅ Serverless functions');
console.log('   • ✅ Custom domains');
console.log('   • 🆓 Free tier available');

console.log('\n2. 🌊 Netlify');
console.log('   • ✅ Static site hosting');
console.log('   • ✅ Form handling');
console.log('   • ✅ Split testing');
console.log('   • ✅ Edge functions');
console.log('   • ✅ Git integration');
console.log('   • 🆓 Free tier available');

console.log('\n3. 🏠 Traditional Hosting (Hostinger, cPanel, etc.)');
console.log('   • ✅ Full control');
console.log('   • ✅ Custom server configuration');
console.log('   • ✅ Database support');
console.log('   • ✅ SSH access');
console.log('   • 💰 Paid hosting required');

console.log('\n4. 📦 Build Only (Manual deployment)');
console.log('   • ✅ Create production build');
console.log('   • ✅ Generate deployment package');
console.log('   • ✅ Manual upload to any hosting');

console.log('\n5. ℹ️  Show deployment information only');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('\n🎯 Choose deployment platform (1-5): ', (answer) => {
  rl.close();
  
  switch(answer.trim()) {
    case '1':
      console.log('\n🚀 Starting Vercel deployment...');
      console.log('\n📋 Vercel Features:');
      console.log('   • Automatic deployments from Git');
      console.log('   • Built-in CI/CD');
      console.log('   • Edge network (99.99% uptime)');
      console.log('   • Real-time collaboration');
      console.log('   • Analytics and monitoring');
      
      try {
        execSync('node deploy-vercel.js', { stdio: 'inherit' });
      } catch (error) {
        console.error('❌ Vercel deployment script failed:', error.message);
        console.log('\n🔧 Manual Vercel deployment:');
        console.log('   1. npm install -g vercel');
        console.log('   2. vercel login');
        console.log('   3. vercel --prod');
      }
      break;
      
    case '2':
      console.log('\n🌊 Starting Netlify deployment...');
      console.log('\n📋 Netlify Features:');
      console.log('   • Drag & drop deployment');
      console.log('   • Branch previews');
      console.log('   • Form submissions');
      console.log('   • Identity management');
      console.log('   • A/B testing');
      
      try {
        execSync('node deploy-netlify.js', { stdio: 'inherit' });
      } catch (error) {
        console.error('❌ Netlify deployment script failed:', error.message);
        console.log('\n🔧 Manual Netlify deployment:');
        console.log('   1. npm install -g netlify-cli');
        console.log('   2. netlify login');
        console.log('   3. netlify deploy --prod --dir=out');
      }
      break;
      
    case '3':
      console.log('\n🏠 Starting traditional hosting deployment...');
      console.log('\n📋 Traditional Hosting Features:');
      console.log('   • Full server control');
      console.log('   • Custom configurations');
      console.log('   • Database integration');
      console.log('   • SSH/FTP access');
      console.log('   • Email hosting');
      
      try {
        execSync('node deploy.js', { stdio: 'inherit' });
      } catch (error) {
        console.error('❌ Traditional hosting script failed:', error.message);
        console.log('\n🔧 Manual traditional hosting:');
        console.log('   1. npm run build');
        console.log('   2. Upload files to public_html');
        console.log('   3. npm install on server');
        console.log('   4. npm start');
      }
      break;
      
    case '4':
      console.log('\n📦 Creating production build...');
      console.log('\n📋 Build Features:');
      console.log('   • Optimized production build');
      console.log('   • Static asset optimization');
      console.log('   • Code splitting');
      console.log('   • Bundle analysis');
      
      try {
        console.log('\n🏗️  Building project...');
        execSync('npm run build', { stdio: 'inherit' });
        
        console.log('\n📦 Creating deployment package...');
        execSync('node deploy.js', { stdio: 'inherit' });
        
        console.log('\n✅ Build completed successfully!');
        console.log('\n📁 Generated files:');
        console.log('   📂 .next/ - Next.js build output');
        console.log('   📂 goldium-deploy/ - Deployment folder');
        console.log('   📦 goldium-production-ready.zip - Upload package');
        
      } catch (error) {
        console.error('❌ Build failed:', error.message);
      }
      break;
      
    case '5':
      console.log('\n📚 Deployment Information');
      console.log('==========================');
      
      console.log('\n🚀 Vercel Deployment:');
      console.log('   • Best for: Next.js applications');
      console.log('   • Cost: Free tier (100GB bandwidth)');
      console.log('   • Setup time: 5 minutes');
      console.log('   • Custom domain: ✅ Free');
      console.log('   • SSL: ✅ Automatic');
      console.log('   • CDN: ✅ Global');
      console.log('   • Command: node deploy-vercel.js');
      
      console.log('\n🌊 Netlify Deployment:');
      console.log('   • Best for: Static sites and JAMstack');
      console.log('   • Cost: Free tier (100GB bandwidth)');
      console.log('   • Setup time: 5 minutes');
      console.log('   • Custom domain: ✅ Free');
      console.log('   • SSL: ✅ Automatic');
      console.log('   • CDN: ✅ Global');
      console.log('   • Command: node deploy-netlify.js');
      
      console.log('\n🏠 Traditional Hosting:');
      console.log('   • Best for: Full control and custom configs');
      console.log('   • Cost: $3-20/month');
      console.log('   • Setup time: 15-30 minutes');
      console.log('   • Custom domain: ✅ Included');
      console.log('   • SSL: ✅ Available');
      console.log('   • CDN: ❌ Optional');
      console.log('   • Command: node deploy.js');
      
      console.log('\n💡 Recommendations:');
      console.log('   🥇 For beginners: Vercel (easiest setup)');
      console.log('   🥈 For static sites: Netlify (great features)');
      console.log('   🥉 For advanced users: Traditional hosting (full control)');
      
      console.log('\n🔧 Prerequisites:');
      console.log('   • Node.js 16+ installed');
      console.log('   • npm or yarn package manager');
      console.log('   • Git (for Vercel/Netlify)');
      console.log('   • Domain name (optional)');
      
      console.log('\n🌐 Environment Variables Needed:');
      console.log('   • NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta');
      console.log('   • NEXT_PUBLIC_RPC_ENDPOINT=https://api.mainnet-beta.solana.com');
      console.log('   • NEXT_PUBLIC_APP_NAME=Goldium');
      console.log('   • NEXT_PUBLIC_APP_URL=https://yourdomain.com');
      break;
      
    default:
      console.log('\n❌ Invalid option selected.');
      console.log('\n📋 Available options:');
      console.log('   1 - Vercel deployment');
      console.log('   2 - Netlify deployment');
      console.log('   3 - Traditional hosting');
      console.log('   4 - Build only');
      console.log('   5 - Show information');
      console.log('\n🔄 Run the script again to choose a valid option.');
  }
  
  console.log('\n🎉 Goldium Auto Deployment Manager completed!');
  console.log('\n🔗 Useful Resources:');
  console.log('   📚 Goldium Documentation: ./README.md');
  console.log('   🚀 Vercel: https://vercel.com');
  console.log('   🌊 Netlify: https://netlify.com');
  console.log('   🏠 Hostinger: https://hostinger.com');
  console.log('   💬 Solana Discord: https://discord.gg/solana');
  console.log('\n✨ Thank you for using Goldium!');
});