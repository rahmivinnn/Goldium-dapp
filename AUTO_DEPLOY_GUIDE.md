# 🚀 Panduan Auto Deploy Goldium ke Hostinger

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
```bash
cd public_html
npm install
npm run build
cp .env.example .env.local
```

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
- HOSTINGER_DEPLOY_GUIDE.md (panduan lengkap)