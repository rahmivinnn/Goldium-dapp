const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Hostinger Auto Deploy - Goldium DApp');
console.log('=========================================');

// Konfigurasi Hostinger
const HOSTINGER_CONFIG = {
  // Domain/subdomain Anda di Hostinger
  domain: 'your-domain.com', // Ganti dengan domain Anda
  
  // Path ke public_html di Hostinger (biasanya public_html)
  remotePath: '/public_html',
  
  // FTP credentials (akan diminta saat deploy)
  ftpHost: 'ftp.your-domain.com', // Ganti dengan FTP host Anda
  ftpPort: 21,
  
  // Node.js version (Hostinger biasanya support Node 16+)
  nodeVersion: '18'
};

function createHostingerPackage() {
  console.log('📦 Membuat paket deployment untuk Hostinger...');
  
  // Buat folder khusus Hostinger
  const hostingerDir = 'goldium-hostinger-deploy';
  if (fs.existsSync(hostingerDir)) {
    execSync(`rmdir /s /q "${hostingerDir}"`, { stdio: 'inherit' });
  }
  fs.mkdirSync(hostingerDir);
  
  // Copy files dari goldium-manual-deploy
  console.log('📋 Menyalin file aplikasi...');
  execSync(`xcopy "goldium-manual-deploy" "${hostingerDir}" /E /I /H /Y`, { stdio: 'inherit' });
  
  // Buat .htaccess untuk Apache (Hostinger menggunakan Apache)
  const htaccess = `# Hostinger Apache Configuration for Next.js
RewriteEngine On

# Handle client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>`;
  
  fs.writeFileSync(path.join(hostingerDir, '.htaccess'), htaccess);
  
  // Update package.json untuk Hostinger
  const packagePath = path.join(hostingerDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  packageJson.scripts = {
    ...packageJson.scripts,
    "start": "node server.js",
    "build": "next build && next export",
    "hostinger:build": "npm install && npm run build",
    "hostinger:start": "node server.js"
  };
  
  // Tambah engines untuk Hostinger
  packageJson.engines = {
    "node": ">=16.0.0",
    "npm": ">=8.0.0"
  };
  
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  
  // Buat startup.js untuk Hostinger Node.js app
  const startupJs = `// Hostinger Node.js Startup File
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');

// Hostinger environment
const dev = false; // Always production on Hostinger
const hostname = '0.0.0.0'; // Listen on all interfaces
const port = process.env.PORT || 3000;

console.log('🚀 Starting Goldium DApp on Hostinger...');
console.log('Environment:', process.env.NODE_ENV || 'production');
console.log('Port:', port);

const app = next({ 
  dev, 
  hostname, 
  port,
  dir: __dirname
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Add CORS headers for Solana
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }
      
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  })
  .once('error', (err) => {
    console.error('Server error:', err);
    process.exit(1);
  })
  .listen(port, hostname, () => {
    console.log(\`✅ Goldium DApp ready on http://\${hostname}:\${port}\`);
    console.log('🌐 Accessible at your Hostinger domain');
  });
}).catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});`;
  
  fs.writeFileSync(path.join(hostingerDir, 'startup.js'), startupJs);
  
  return hostingerDir;
}

function createDeploymentInstructions(hostingerDir) {
  const instructions = `# 🚀 PANDUAN DEPLOY OTOMATIS KE HOSTINGER

## 📋 Langkah-langkah Deploy:

### 1. 🔐 Persiapan Hostinger hPanel
1. Login ke hPanel Hostinger Anda
2. Buka **File Manager** atau gunakan **FTP**
3. Pastikan Node.js sudah aktif di hosting Anda:
   - Buka **Advanced** → **Node.js**
   - Pilih versi Node.js 16+ atau 18+
   - Set startup file ke: \`startup.js\`

### 2. 📁 Upload Files
**Opsi A: File Manager (Mudah)**
1. Buka File Manager di hPanel
2. Masuk ke folder \`public_html\`
3. Upload semua file dari folder \`${hostingerDir}\`
4. Extract jika dalam bentuk ZIP

**Opsi B: FTP (Advanced)**
1. Gunakan FileZilla atau FTP client lain
2. Connect ke FTP Hostinger:
   - Host: \`ftp.your-domain.com\`
   - Username: [username FTP Anda]
   - Password: [password FTP Anda]
3. Upload ke folder \`public_html\`

### 3. ⚙️ Konfigurasi Node.js di hPanel
1. Buka **Advanced** → **Node.js**
2. Klik **Create Application**
3. Isi konfigurasi:
   - **Node.js version**: 18.x atau 16.x
   - **Application root**: \`public_html\`
   - **Application URL**: \`/\` (root domain)
   - **Application startup file**: \`startup.js\`
4. Klik **Create**

### 4. 🔧 Install Dependencies
1. Di halaman Node.js app, klik **Open Terminal**
2. Jalankan perintah:
   \`\`\`bash
   npm install
   npm run hostinger:build
   \`\`\`
3. Tunggu hingga selesai

### 5. 🌍 Set Environment Variables
1. Di halaman Node.js app, scroll ke **Environment Variables**
2. Tambahkan variabel berikut:
   - \`NODE_ENV\` = \`production\`
   - \`NEXT_PUBLIC_SOLANA_NETWORK\` = \`mainnet-beta\`
   - \`NEXT_PUBLIC_RPC_ENDPOINT\` = \`https://api.mainnet-beta.solana.com\`
   - \`PORT\` = \`3000\`

### 6. 🚀 Start Application
1. Klik **Restart** pada Node.js application
2. Tunggu beberapa menit
3. Buka domain Anda di browser
4. Goldium DApp sudah live! 🎉

## 🔍 Troubleshooting

### Jika aplikasi tidak jalan:
1. **Check Terminal**: Buka terminal Node.js dan lihat error logs
2. **Restart App**: Klik restart di Node.js application
3. **Check Files**: Pastikan semua file terupload dengan benar
4. **Check Permissions**: Pastikan file permissions sudah benar (755 untuk folder, 644 untuk file)

### Jika build gagal:
1. Pastikan Node.js version 16+ atau 18+
2. Hapus folder \`node_modules\` dan \`.next\`
3. Jalankan ulang \`npm install\` dan \`npm run hostinger:build\`

### Jika wallet tidak connect:
1. Check environment variables sudah benar
2. Pastikan HTTPS aktif (SSL certificate)
3. Check browser console untuk error

## 📱 Fitur yang Tersedia:
- ✅ Wallet Connection (Phantom, Solflare, dll)
- ✅ Token Swapping via Jupiter
- ✅ Portfolio Analytics
- ✅ Market Dashboard
- ✅ Transaction History
- ✅ Staking Interface
- ✅ Real-time Price Data
- ✅ Responsive Design

## 🎯 Tips Optimasi:
1. **SSL Certificate**: Aktifkan SSL untuk HTTPS
2. **CDN**: Gunakan Cloudflare jika tersedia
3. **Caching**: .htaccess sudah dikonfigurasi untuk caching
4. **Monitoring**: Check logs secara berkala

---

**🎉 Selamat! Goldium DApp Anda sudah live di Hostinger!**

Domain Anda: https://your-domain.com
`;
  
  fs.writeFileSync('HOSTINGER_DEPLOY_GUIDE.md', instructions);
  
  // Buat script otomatis untuk zip
  const zipScript = `@echo off
echo 🚀 Membuat paket deployment untuk Hostinger...
echo.

if exist "goldium-hostinger.zip" del "goldium-hostinger.zip"

echo 📦 Mengompres file...
powershell Compress-Archive -Path "${hostingerDir}\\*" -DestinationPath "goldium-hostinger.zip" -Force

echo.
echo ✅ Paket deployment siap!
echo 📁 File: goldium-hostinger.zip
echo 📋 Panduan: HOSTINGER_DEPLOY_GUIDE.md
echo.
echo 🚀 Langkah selanjutnya:
echo 1. Upload goldium-hostinger.zip ke File Manager Hostinger
echo 2. Extract di folder public_html
echo 3. Ikuti panduan di HOSTINGER_DEPLOY_GUIDE.md
echo.
pause`;
  
  fs.writeFileSync('create-hostinger-package.bat', zipScript);
}

async function main() {
  try {
    console.log('🎯 Memulai proses deployment otomatis ke Hostinger...');
    
    // Buat paket Hostinger
    const hostingerDir = createHostingerPackage();
    
    // Buat panduan deployment
    createDeploymentInstructions(hostingerDir);
    
    // Buat ZIP otomatis
    console.log('📦 Membuat paket ZIP untuk upload...');
    try {
      execSync(`powershell Compress-Archive -Path "${hostingerDir}\\*" -DestinationPath "goldium-hostinger.zip" -Force`, { stdio: 'inherit' });
      console.log('✅ ZIP file berhasil dibuat!');
    } catch (error) {
      console.log('⚠️  Gagal membuat ZIP otomatis, gunakan script manual.');
    }
    
    console.log('\n🎉 Paket Deployment Hostinger Siap!');
    console.log('=====================================');
    console.log('📁 File yang dibuat:');
    console.log(`   • ${hostingerDir}/ (Folder aplikasi)`);
    console.log('   • goldium-hostinger.zip (Paket upload)');
    console.log('   • HOSTINGER_DEPLOY_GUIDE.md (Panduan lengkap)');
    console.log('   • create-hostinger-package.bat (Script ZIP manual)');
    console.log('\n🚀 Langkah Selanjutnya:');
    console.log('1. Login ke hPanel Hostinger Anda');
    console.log('2. Buka File Manager → public_html');
    console.log('3. Upload goldium-hostinger.zip');
    console.log('4. Extract file ZIP');
    console.log('5. Ikuti panduan di HOSTINGER_DEPLOY_GUIDE.md');
    console.log('\n🌐 DApp Anda akan live di domain Hostinger!');
    
  } catch (error) {
    console.error('❌ Error saat membuat paket deployment:', error.message);
    process.exit(1);
  }
}

main();