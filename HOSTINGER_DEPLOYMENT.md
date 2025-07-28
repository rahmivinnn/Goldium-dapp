# 🚀 Panduan Deployment Goldium ke Hostinger

## 📋 Persiapan Sebelum Upload

### 1. File yang Sudah Dikemas
File `goldium-hostinger.zip` berisi:
- ✅ Folder `src/` - Source code aplikasi
- ✅ Folder `public/` - Asset statis
- ✅ `package.json` - Dependencies
- ✅ `package-lock.json` - Lock file
- ✅ `next.config.js` - Konfigurasi Next.js
- ✅ `tailwind.config.js` - Konfigurasi Tailwind
- ✅ `tsconfig.json` - Konfigurasi TypeScript
- ✅ `postcss.config.js` - Konfigurasi PostCSS
- ✅ `next-env.d.ts` - Type definitions

### 2. File yang Tidak Disertakan (Normal)
- ❌ `node_modules/` - Akan diinstall otomatis
- ❌ `.next/` - Build folder, akan dibuat saat build
- ❌ `.git/` - Version control
- ❌ Development files

## 🔧 Langkah Deployment di Hostinger

### Step 1: Upload File
1. Login ke **Hostinger Control Panel**
2. Buka **File Manager**
3. Navigate ke folder `public_html/`
4. Upload file `goldium-hostinger.zip`
5. Extract file zip di dalam `public_html/`

### Step 2: Install Dependencies
1. Buka **Terminal** di Hostinger
2. Navigate ke folder project:
   ```bash
   cd public_html
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Step 3: Build Project
1. Build aplikasi untuk production:
   ```bash
   npm run build
   ```
2. Tunggu proses build selesai

### Step 4: Start Application
1. Start aplikasi:
   ```bash
   npm start
   ```
   Atau untuk development:
   ```bash
   npm run dev
   ```

## ⚙️ Konfigurasi Environment

### 1. Buat File .env.local
Buat file `.env.local` di root folder dengan:
```env
# Solana Network Configuration
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_RPC_ENDPOINT=https://api.mainnet-beta.solana.com

# Application Settings
NEXT_PUBLIC_APP_NAME=Goldium
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 2. Update next.config.js (Jika Diperlukan)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone', // Untuk hosting
  images: {
    unoptimized: true // Untuk static hosting
  }
}

module.exports = nextConfig
```

## 🌐 Konfigurasi Domain

### 1. Subdomain Setup
- Buat subdomain di Hostinger (misal: `goldium.yourdomain.com`)
- Arahkan ke folder aplikasi

### 2. SSL Certificate
- Aktifkan SSL di Hostinger Control Panel
- Tunggu propagasi (5-10 menit)

## 🔍 Troubleshooting

### Error: Module Not Found
```bash
# Hapus node_modules dan install ulang
rm -rf node_modules
npm install
```

### Error: Build Failed
```bash
# Clear cache dan build ulang
npm run clean
npm run build
```

### Error: Port Already in Use
```bash
# Kill process dan restart
pkill -f node
npm start
```

## 📊 Monitoring

### 1. Check Application Status
```bash
# Check if app is running
ps aux | grep node
```

### 2. View Logs
```bash
# View application logs
npm run logs
```

## 🚀 Optimasi Performance

### 1. Enable Compression
Tambahkan di `next.config.js`:
```javascript
const nextConfig = {
  compress: true,
  poweredByHeader: false
}
```

### 2. Cache Headers
Konfigurasi cache di hosting panel untuk:
- CSS/JS files: 1 year
- Images: 1 month
- HTML: 1 hour

## 📞 Support

Jika mengalami masalah:
1. Check error logs di terminal
2. Verify semua dependencies terinstall
3. Pastikan Node.js version compatible (16+)
4. Contact Hostinger support jika diperlukan

---

**✅ File goldium-hostinger.zip siap untuk upload ke Hostinger!**

**📁 Size:** ~538KB  
**🕒 Created:** $(Get-Date)  
**🎯 Target:** Hostinger Shared/VPS Hosting  
**⚡ Framework:** Next.js 13+ dengan TypeScript