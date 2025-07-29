const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Konfigurasi Hostinger
const HOSTINGER_CONFIG = {
  host: '153.92.8.107',
  port: '65002',
  username: 'u719500717',
  // Password akan diminta saat koneksi
};

console.log('🚀 Goldium Auto Deploy ke Hostinger dengan PuTTY');
console.log('================================================');

// Fungsi untuk membuat batch file PuTTY
function createPuttyBatch() {
  const batchContent = `@echo off
echo Connecting to Hostinger via PuTTY...
echo Host: ${HOSTINGER_CONFIG.host}
echo Port: ${HOSTINGER_CONFIG.port}
echo Username: ${HOSTINGER_CONFIG.username}
echo.
echo Setelah login, jalankan perintah berikut:
echo cd public_html
echo npm install
echo npm run build
echo.
putty.exe -ssh ${HOSTINGER_CONFIG.username}@${HOSTINGER_CONFIG.host} -P ${HOSTINGER_CONFIG.port}
pause`;

  fs.writeFileSync('connect-hostinger.bat', batchContent);
  console.log('✅ File connect-hostinger.bat dibuat');
}

// Fungsi untuk membuat script deployment commands
function createDeploymentScript() {
  const deployScript = `#!/bin/bash
# Script deployment untuk Hostinger
echo "🚀 Starting Goldium deployment..."

# Masuk ke direktori public_html
cd public_html

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build aplikasi
echo "🔨 Building application..."
npm run build

# Set environment variables
echo "⚙️ Setting up environment..."
cp .env.example .env.local

# Start aplikasi (opsional)
echo "🌟 Starting application..."
# npm start

echo "✅ Deployment completed!"
echo "🌐 Your Goldium app should be live now!"`;

  fs.writeFileSync('hostinger-deploy-commands.sh', deployScript);
  console.log('✅ File hostinger-deploy-commands.sh dibuat');
}

// Fungsi untuk membuat panduan deployment
function createDeploymentGuide() {
  const guide = `# 🚀 Panduan Auto Deploy Goldium ke Hostinger

## Langkah 1: Koneksi PuTTY
1. Jalankan file: **connect-hostinger.bat**
2. Masukkan password Hostinger saat diminta
3. Tunggu hingga berhasil login

## Langkah 2: Upload Files
**Via File Manager Hostinger:**
1. Login ke hPanel Hostinger
2. Buka File Manager
3. Masuk ke folder public_html
4. Upload file: goldium-hostinger-latest.zip
5. Extract file ZIP

## Langkah 3: Deployment via SSH
Setelah login PuTTY, jalankan perintah:
\`\`\`bash
cd public_html
npm install
npm run build
cp .env.example .env.local
\`\`\`

## Langkah 4: Konfigurasi Node.js (hPanel)
1. Buka Advanced → Node.js
2. Create Application:
   - Node.js version: 18.x
   - Application root: public_html
   - Startup file: server.js
3. Set Environment Variables:
   - NODE_ENV = production

## 🎉 Selesai!
Aplikasi Goldium akan live di domain Hostinger Anda.

---
**File yang tersedia:**
- connect-hostinger.bat (koneksi PuTTY)
- hostinger-deploy-commands.sh (script deployment)
- goldium-hostinger-latest.zip (aplikasi)
- HOSTINGER_DEPLOY_GUIDE.md (panduan lengkap)`;

  fs.writeFileSync('AUTO_DEPLOY_GUIDE.md', guide);
  console.log('✅ File AUTO_DEPLOY_GUIDE.md dibuat');
}

// Fungsi utama
function main() {
  try {
    console.log('📋 Membuat file deployment otomatis...');
    
    // Buat file-file yang diperlukan
    createPuttyBatch();
    createDeploymentScript();
    createDeploymentGuide();
    
    console.log('\n🎉 Auto deployment setup selesai!');
    console.log('\n📁 File yang dibuat:');
    console.log('   ✅ connect-hostinger.bat');
    console.log('   ✅ hostinger-deploy-commands.sh');
    console.log('   ✅ AUTO_DEPLOY_GUIDE.md');
    
    console.log('\n🚀 Langkah selanjutnya:');
    console.log('   1. Jalankan: connect-hostinger.bat');
    console.log('   2. Upload goldium-hostinger-latest.zip ke hPanel');
    console.log('   3. Extract file di public_html');
    console.log('   4. Jalankan deployment commands via PuTTY');
    
    console.log('\n📖 Baca AUTO_DEPLOY_GUIDE.md untuk panduan lengkap');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Jalankan script
main();