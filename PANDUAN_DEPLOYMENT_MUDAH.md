# 🚀 Panduan Deployment Goldium ke Hostinger (Mudah)

## 📋 Yang Anda Butuhkan
- ✅ Akun Hostinger dengan hPanel
- ✅ File `goldium-hostinger-latest.zip` (sudah tersedia)
- ✅ PuTTY (untuk SSH) atau gunakan File Manager

## 🎯 Metode 1: Deployment via File Manager (TERMUDAH)

### Langkah 1: Login ke hPanel
1. Buka https://hpanel.hostinger.com
2. Login dengan akun Hostinger Anda
3. Pilih domain `goldium.io`

### Langkah 2: Upload File
1. Klik **File Manager** di hPanel
2. Masuk ke folder `public_html`
3. **Hapus semua file** yang ada di `public_html` (jika ada)
4. Upload file `goldium-hostinger-latest.zip`
5. **Extract** file zip tersebut
6. Pindahkan semua isi folder hasil extract ke `public_html`

### Langkah 3: Setup Environment
1. Di File Manager, rename file `.env.example` menjadi `.env.local`
2. Edit file `.env.local` jika diperlukan

### Langkah 4: Install Dependencies
1. Klik **Terminal** di hPanel (atau gunakan SSH)
2. Jalankan perintah:
```bash
cd public_html
npm install
npm run build
```

### Langkah 5: Setup Node.js App
1. Di hPanel, klik **Node.js**
2. **Create Application**:
   - Node.js version: **18.x** atau **16.x**
   - Application root: `public_html`
   - Application URL: `/` (root domain)
   - Application startup file: `server.js` atau `next.config.js`
3. Klik **Create**

---

## 🎯 Metode 2: Deployment via PuTTY/SSH

### Koneksi SSH:
- **Host:** 153.92.8.107
- **Port:** 65002
- **Username:** u719500717
- **Password:** [Password Hostinger Anda]

### Perintah SSH:
```bash
# Masuk ke direktori web
cd public_html

# Hapus file lama (jika ada)
rm -rf *

# Upload dan extract file (via File Manager terlebih dahulu)
# Atau gunakan wget jika file sudah di-upload ke server lain

# Install dependencies
npm install

# Build aplikasi
npm run build

# Setup environment
cp .env.example .env.local
```

---

## 🔧 Troubleshooting

### Jika Node.js tidak tersedia:
1. Di hPanel, aktifkan **Node.js** terlebih dahulu
2. Pilih versi Node.js 16.x atau 18.x

### Jika build gagal:
1. Pastikan semua dependencies ter-install
2. Cek file `.env.local` sudah benar
3. Jalankan `npm run build` lagi

### Jika website tidak muncul:
1. Cek **Node.js App** sudah aktif
2. Pastikan startup file sudah benar
3. Restart aplikasi di hPanel

---

## 📁 File yang Sudah Tersedia
- ✅ `goldium-hostinger-latest.zip` (211 KB)
- ✅ `goldium-hostinger-cpanel-latest.zip` (212 KB)
- ✅ `HOSTINGER_DEPLOYMENT_README.md`
- ✅ `AUTO_DEPLOY_GUIDE.md`
- ✅ `connect-hostinger.bat` (untuk PuTTY)

---

## 🎉 Setelah Deployment Berhasil

Website Goldium akan dapat diakses di:
- **Domain utama:** https://goldium.io
- **Subdomain:** https://goldium.io (setelah DNS propagation)

### Fitur yang Tersedia:
- ✅ Wallet Connection (Phantom, Solflare, Coinbase, Trust Wallet)
- ✅ Responsive UI
- ✅ Error messages dalam Bahasa Inggris
- ✅ "Coming Soon" popups untuk NFT dan Games
- ✅ Staking interface
- ✅ Token swap functionality

---

## 📞 Bantuan

Jika mengalami kesulitan:
1. Cek log error di hPanel Terminal
2. Pastikan semua file sudah ter-upload dengan benar
3. Verifikasi Node.js app sudah running
4. Restart aplikasi jika diperlukan

**Deployment package siap digunakan! 🚀**