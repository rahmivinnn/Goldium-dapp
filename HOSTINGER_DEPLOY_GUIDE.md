# 🚀 PANDUAN DEPLOY OTOMATIS KE HOSTINGER

## 📋 Langkah-langkah Deploy:

### 1. 🔐 Persiapan Hostinger hPanel
1. Login ke hPanel Hostinger Anda
2. Buka **File Manager** atau gunakan **FTP**
3. Pastikan Node.js sudah aktif di hosting Anda:
   - Buka **Advanced** → **Node.js**
   - Pilih versi Node.js 16+ atau 18+
   - Set startup file ke: `startup.js`

### 2. 📁 Upload Files
**Opsi A: File Manager (Mudah)**
1. Buka File Manager di hPanel
2. Masuk ke folder `public_html`
3. Upload semua file dari folder `goldium-hostinger-deploy`
4. Extract jika dalam bentuk ZIP

**Opsi B: FTP (Advanced)**
1. Gunakan FileZilla atau FTP client lain
2. Connect ke FTP Hostinger:
   - Host: `ftp.your-domain.com`
   - Username: [username FTP Anda]
   - Password: [password FTP Anda]
3. Upload ke folder `public_html`

### 3. ⚙️ Konfigurasi Node.js di hPanel
1. Buka **Advanced** → **Node.js**
2. Klik **Create Application**
3. Isi konfigurasi:
   - **Node.js version**: 18.x atau 16.x
   - **Application root**: `public_html`
   - **Application URL**: `/` (root domain)
   - **Application startup file**: `startup.js`
4. Klik **Create**

### 4. 🔧 Install Dependencies
1. Di halaman Node.js app, klik **Open Terminal**
2. Jalankan perintah:
   ```bash
   npm install
   npm run hostinger:build
   ```
3. Tunggu hingga selesai

### 5. 🌍 Set Environment Variables
1. Di halaman Node.js app, scroll ke **Environment Variables**
2. Tambahkan variabel berikut:
   - `NODE_ENV` = `production`
   - `NEXT_PUBLIC_SOLANA_NETWORK` = `mainnet-beta`
   - `NEXT_PUBLIC_RPC_ENDPOINT` = `https://api.mainnet-beta.solana.com`
   - `PORT` = `3000`

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
2. Hapus folder `node_modules` dan `.next`
3. Jalankan ulang `npm install` dan `npm run hostinger:build`

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
