const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Vercel Auto Deploy - Goldium DApp');
console.log('===================================');

function createVercelPackage() {
  console.log('📦 Membuat paket deployment untuk Vercel...');
  
  // Buat folder khusus Vercel
  const vercelDir = 'goldium-vercel-deploy';
  if (fs.existsSync(vercelDir)) {
    try {
      execSync(`rmdir /s /q "${vercelDir}"`, { stdio: 'inherit' });
    } catch (error) {
      console.log('⚠️  Folder sudah ada, melanjutkan...');
    }
  }
  fs.mkdirSync(vercelDir, { recursive: true });
  
  // Copy files dari goldium-manual-deploy
  console.log('📋 Menyalin file aplikasi...');
  try {
    execSync(`xcopy "goldium-manual-deploy" "${vercelDir}" /E /I /H /Y`, { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️  Menggunakan metode copy alternatif...');
    // Fallback copy method
    const copyRecursive = (src, dest) => {
      if (fs.statSync(src).isDirectory()) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
        fs.readdirSync(src).forEach(item => {
          copyRecursive(path.join(src, item), path.join(dest, item));
        });
      } else {
        fs.copyFileSync(src, dest);
      }
    };
    copyRecursive('goldium-manual-deploy', vercelDir);
  }
  
  // Buat vercel.json untuk konfigurasi deployment
  const vercelConfig = {
    "version": 2,
    "name": "goldium-dapp",
    "builds": [
      {
        "src": "package.json",
        "use": "@vercel/next"
      }
    ],
    "env": {
      "NEXT_PUBLIC_SOLANA_NETWORK": "mainnet-beta",
      "NEXT_PUBLIC_RPC_ENDPOINT": "https://api.mainnet-beta.solana.com",
      "NEXT_PUBLIC_JUPITER_API": "https://quote-api.jup.ag/v6"
    },
    "headers": [
      {
        "source": "/(.*)",
        "headers": [
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          }
        ]
      }
    ],
    "rewrites": [
      {
        "source": "/(.*)",
        "destination": "/"
      }
    ]
  };
  
  fs.writeFileSync(path.join(vercelDir, 'vercel.json'), JSON.stringify(vercelConfig, null, 2));
  
  // Update package.json untuk Vercel
  const packagePath = path.join(vercelDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  packageJson.scripts = {
    ...packageJson.scripts,
    "build": "next build",
    "start": "next start",
    "dev": "next dev",
    "vercel:build": "npm run build"
  };
  
  // Tambah engines untuk Vercel
  packageJson.engines = {
    "node": ">=16.0.0",
    "npm": ">=8.0.0"
  };
  
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  
  // Buat .env.example untuk Vercel
  const envExample = `# Vercel Environment Variables
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_RPC_ENDPOINT=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_JUPITER_API=https://quote-api.jup.ag/v6

# Optional: Custom RPC (untuk performa lebih baik)
# NEXT_PUBLIC_RPC_ENDPOINT=https://your-custom-rpc-endpoint.com

# Optional: Analytics
# NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id`;
  
  fs.writeFileSync(path.join(vercelDir, '.env.example'), envExample);
  
  return vercelDir;
}

function createVercelInstructions(vercelDir) {
  const instructions = `# 🚀 PANDUAN DEPLOY OTOMATIS KE VERCEL

## 📋 Langkah-langkah Deploy (Super Mudah!):

### 🎯 Metode 1: Upload Folder (Paling Mudah)
1. **Buka Vercel**: Pergi ke [vercel.com](https://vercel.com)
2. **Sign Up/Login**: Gunakan GitHub, GitLab, atau email
3. **New Project**: Klik tombol "New Project"
4. **Upload**: Drag & drop folder \`${vercelDir}\` ke Vercel
5. **Deploy**: Klik "Deploy" dan tunggu 2-3 menit
6. **Live**: DApp Anda sudah live! 🎉

### 🎯 Metode 2: GitHub Integration (Recommended)
1. **Upload ke GitHub**:
   - Buat repository baru di GitHub
   - Upload folder \`${vercelDir}\` ke repository
2. **Connect Vercel**:
   - Di Vercel, pilih "Import Git Repository"
   - Pilih repository GitHub Anda
   - Klik "Deploy"
3. **Auto Deploy**: Setiap update di GitHub akan auto-deploy!

## ⚙️ Environment Variables (Otomatis Terset)
Vercel sudah dikonfigurasi dengan environment variables berikut:
- \`NEXT_PUBLIC_SOLANA_NETWORK\` = \`mainnet-beta\`
- \`NEXT_PUBLIC_RPC_ENDPOINT\` = \`https://api.mainnet-beta.solana.com\`
- \`NEXT_PUBLIC_JUPITER_API\` = \`https://quote-api.jup.ag/v6\`

### 🔧 Custom Environment Variables (Opsional)
Jika ingin mengubah konfigurasi:
1. Di dashboard Vercel, buka project Anda
2. Pergi ke **Settings** → **Environment Variables**
3. Tambah/edit variabel sesuai kebutuhan

## 🌐 Custom Domain (Gratis!)
1. **Beli Domain**: Beli domain di provider manapun (Namecheap, GoDaddy, dll)
2. **Add Domain**: Di Vercel dashboard → **Domains** → **Add**
3. **DNS Setup**: Ikuti instruksi DNS dari Vercel
4. **SSL**: SSL certificate otomatis aktif!

## 📱 Fitur yang Sudah Siap:
- ✅ **Wallet Connection**: Phantom, Solflare, Backpack, dll
- ✅ **Token Swapping**: Via Jupiter aggregator
- ✅ **Portfolio Analytics**: Real-time tracking
- ✅ **Market Dashboard**: Live price data
- ✅ **Transaction History**: Complete history
- ✅ **Staking Interface**: SOL staking
- ✅ **Notification Center**: Real-time alerts
- ✅ **Responsive Design**: Mobile & desktop
- ✅ **Dark Theme**: Modern UI
- ✅ **Performance Optimized**: Fast loading

## 🚀 Optimasi Performa:
- **CDN Global**: Vercel CDN otomatis aktif
- **Image Optimization**: Next.js image optimization
- **Caching**: Smart caching untuk performa maksimal
- **Compression**: Gzip/Brotli compression
- **Analytics**: Built-in Vercel analytics

## 🔍 Troubleshooting:

### Build Error:
- Check **Functions** tab di Vercel dashboard
- Lihat build logs untuk error details
- Pastikan Node.js version 16+

### Runtime Error:
- Check **Functions** → **View Function Logs**
- Verify environment variables
- Test di local: \`npm run dev\`

### Wallet Connection Issues:
- Pastikan HTTPS aktif (otomatis di Vercel)
- Check browser console untuk errors
- Verify RPC endpoint working

## 💡 Tips Pro:
1. **Preview Deployments**: Setiap push ke branch akan create preview
2. **Analytics**: Enable Vercel Analytics untuk insights
3. **Monitoring**: Setup Vercel monitoring untuk uptime
4. **Speed Insights**: Enable untuk performance metrics

## 🎯 Setelah Deploy:
1. **Test Wallet**: Connect wallet dan test semua fitur
2. **Test Swapping**: Coba swap token
3. **Check Analytics**: Pastikan data loading
4. **Mobile Test**: Test di mobile device
5. **Share**: Bagikan link ke komunitas!

---

## 🌟 URL Anda:
- **Vercel URL**: \`https://your-project.vercel.app\`
- **Custom Domain**: \`https://your-domain.com\` (jika setup)

**🎉 Selamat! Goldium DApp Anda sudah live di Vercel!**

### 📞 Support:
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Next.js Docs: [nextjs.org/docs](https://nextjs.org/docs)
- Solana Docs: [docs.solana.com](https://docs.solana.com)
`;
  
  fs.writeFileSync('VERCEL_DEPLOY_GUIDE.md', instructions);
  
  // Buat quick start script
  const quickStart = `# 🚀 QUICK START - VERCEL DEPLOYMENT

## ⚡ Deploy dalam 3 Langkah:

### 1. 📁 Siapkan Folder
✅ Folder \`${vercelDir}\` sudah siap!

### 2. 🌐 Upload ke Vercel
1. Buka [vercel.com](https://vercel.com)
2. Login/Sign up
3. Klik "New Project"
4. Drag & drop folder \`${vercelDir}\`
5. Klik "Deploy"

### 3. 🎉 Live!
DApp Anda akan live dalam 2-3 menit di:
\`https://your-project.vercel.app\`

---

## 🔗 Fitur Utama:
- 💰 **Token Swapping** via Jupiter
- 📊 **Portfolio Analytics** real-time
- 🏪 **Market Dashboard** dengan live prices
- 📱 **Mobile Responsive** design
- 🔐 **Multi-Wallet** support
- ⚡ **Lightning Fast** performance

**Total waktu deploy: < 5 menit!** ⏱️
`;
  
  fs.writeFileSync('VERCEL_QUICK_START.md', quickStart);
}

async function main() {
  try {
    console.log('🎯 Memulai proses deployment otomatis ke Vercel...');
    
    // Buat paket Vercel
    const vercelDir = createVercelPackage();
    
    // Buat panduan deployment
    createVercelInstructions(vercelDir);
    
    console.log('\n🎉 Paket Deployment Vercel Siap!');
    console.log('==================================');
    console.log('📁 File yang dibuat:');
    console.log(`   • ${vercelDir}/ (Folder aplikasi siap deploy)`);
    console.log('   • VERCEL_DEPLOY_GUIDE.md (Panduan lengkap)');
    console.log('   • VERCEL_QUICK_START.md (Quick start)');
    console.log('   • vercel.json (Konfigurasi otomatis)');
    console.log('\n🚀 Langkah Selanjutnya:');
    console.log('1. Buka https://vercel.com');
    console.log('2. Login/Sign up (gratis)');
    console.log('3. Klik "New Project"');
    console.log(`4. Drag & drop folder "${vercelDir}"`);
    console.log('5. Klik "Deploy"');
    console.log('6. Tunggu 2-3 menit');
    console.log('7. DApp Anda sudah live! 🎉');
    console.log('\n🌐 URL: https://your-project.vercel.app');
    console.log('💡 Baca VERCEL_QUICK_START.md untuk panduan cepat!');
    
  } catch (error) {
    console.error('❌ Error saat membuat paket deployment:', error.message);
    process.exit(1);
  }
}

main();