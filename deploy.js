#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Goldium Auto Deployment Process...');

// Step 1: Clean previous builds
console.log('\n📦 Step 1: Cleaning previous builds...');
try {
  if (fs.existsSync('.next')) {
    execSync('rmdir /s /q .next', { stdio: 'inherit' });
  }
  if (fs.existsSync('out')) {
    execSync('rmdir /s /q out', { stdio: 'inherit' });
  }
  console.log('✅ Clean completed');
} catch (error) {
  console.log('⚠️  Clean step completed with warnings');
}

// Step 2: Install dependencies
console.log('\n📦 Step 2: Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Step 3: Build for production
console.log('\n🏗️  Step 3: Building for production...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Step 4: Create deployment package
console.log('\n📦 Step 4: Creating deployment package...');
try {
  // Create deployment folder
  const deployDir = 'goldium-deploy';
  if (fs.existsSync(deployDir)) {
    execSync(`rmdir /s /q ${deployDir}`, { stdio: 'inherit' });
  }
  fs.mkdirSync(deployDir);

  // Copy necessary files
  const filesToCopy = [
    '.next',
    'public',
    'package.json',
    'package-lock.json',
    'next.config.js'
  ];

  filesToCopy.forEach(file => {
    if (fs.existsSync(file)) {
      if (fs.statSync(file).isDirectory()) {
        execSync(`xcopy "${file}" "${deployDir}\\${file}" /E /I /H /Y`, { stdio: 'inherit' });
      } else {
        execSync(`copy "${file}" "${deployDir}\\"`, { stdio: 'inherit' });
      }
    }
  });

  console.log('✅ Deployment package created');
} catch (error) {
  console.error('❌ Failed to create deployment package:', error.message);
  process.exit(1);
}

// Step 5: Create production environment file
console.log('\n⚙️  Step 5: Creating production environment...');
try {
  const envContent = `# Production Environment Configuration
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_RPC_ENDPOINT=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_APP_NAME=Goldium
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
`;
  
  fs.writeFileSync(path.join('goldium-deploy', '.env.production'), envContent);
  console.log('✅ Production environment file created');
} catch (error) {
  console.error('❌ Failed to create environment file:', error.message);
}

// Step 6: Create deployment instructions
console.log('\n📋 Step 6: Creating deployment instructions...');
try {
  const instructions = `# 🚀 Goldium Production Deployment Instructions

## Quick Deploy Commands:

### For VPS/Dedicated Server:
\`\`\`bash
# 1. Upload goldium-deploy folder to your server
# 2. Navigate to the folder
cd goldium-deploy

# 3. Install production dependencies
npm ci --only=production

# 4. Start the application
npm start
\`\`\`

### For Shared Hosting (like Hostinger):
\`\`\`bash
# 1. Upload all files from goldium-deploy folder to public_html
# 2. In hosting terminal:
npm install
npm start
\`\`\`

### For Vercel/Netlify:
\`\`\`bash
# 1. Push code to GitHub
# 2. Connect repository to Vercel/Netlify
# 3. Deploy automatically
\`\`\`

## Environment Variables to Set:
- NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
- NEXT_PUBLIC_RPC_ENDPOINT=https://api.mainnet-beta.solana.com
- NEXT_PUBLIC_APP_NAME=Goldium
- NEXT_PUBLIC_APP_URL=https://yourdomain.com

## Port Configuration:
- Default: 3000
- Production: Set PORT environment variable

## SSL Certificate:
- Enable HTTPS in your hosting panel
- Update APP_URL to https://yourdomain.com

---
✅ Deployment package ready!
`;
  
  fs.writeFileSync(path.join('goldium-deploy', 'DEPLOY_INSTRUCTIONS.md'), instructions);
  console.log('✅ Deployment instructions created');
} catch (error) {
  console.error('❌ Failed to create instructions:', error.message);
}

// Step 7: Create ZIP for easy upload
console.log('\n📦 Step 7: Creating deployment ZIP...');
try {
  execSync('powershell Compress-Archive -Path .\\goldium-deploy\\* -DestinationPath .\\goldium-production-ready.zip -Force', { stdio: 'inherit' });
  console.log('✅ Production ZIP created: goldium-production-ready.zip');
} catch (error) {
  console.error('❌ Failed to create ZIP:', error.message);
}

console.log('\n🎉 Deployment preparation completed!');
console.log('\n📁 Files created:');
console.log('   📂 goldium-deploy/ - Deployment folder');
console.log('   📦 goldium-production-ready.zip - Ready to upload');
console.log('\n🚀 Next steps:');
console.log('   1. Upload goldium-production-ready.zip to your hosting');
console.log('   2. Extract files to public_html or web root');
console.log('   3. Run: npm install && npm start');
console.log('   4. Configure domain and SSL');
console.log('\n✨ Your Goldium app is ready for production!');