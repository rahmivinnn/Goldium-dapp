# Panduan Deployment Goldium ke Hostinger menggunakan PuTTY

## Persiapan

### 1. Download PuTTY
- Download PuTTY dari: https://www.putty.org/
- Install PuTTY di komputer Anda

### 2. File yang Diperlukan
- `goldium-hostinger-cpanel-latest.zip` (212 KB) - sudah tersedia di folder ini
- Kredensial SSH dari panel Hostinger

## Langkah-langkah Deployment

### Step 1: Koneksi SSH dengan PuTTY

1. **Buka PuTTY**
2. **Konfigurasi Koneksi:**
   - Host Name (or IP address): `153.92.8.107`
   - Port: `65002`
   - Connection type: `SSH`
3. **Klik "Open"**
4. **Login:**
   - Username: `u719500717`
   - Password: [gunakan password yang ditampilkan di panel SSH Hostinger]

### Step 2: Upload File (Via File Manager)

**Sebelum melanjutkan di SSH, upload file terlebih dahulu:**

1. Login ke hPanel Hostinger
2. Buka "File Manager"
3. Masuk ke folder `public_html`
4. Upload file `goldium-hostinger-cpanel-latest.zip`
5. Extract file zip tersebut

### Step 3: Setup via SSH (PuTTY)

Setelah berhasil login SSH, jalankan perintah berikut:

```bash
# 1. Masuk ke direktori public_html
cd public_html

# 2. Lihat isi direktori
ls -la

# 3. Masuk ke folder hasil extract (jika ada)
cd goldium-hostinger-cpanel-latest

# 4. Install dependencies
npm install

# 5. Build aplikasi
npm run build

# 6. Copy file .env.example ke .env.local
cp .env.example .env.local

# 7. Edit environment variables (opsional)
nano .env.local
```

### Step 4: Konfigurasi Environment

Edit file `.env.local` dengan konfigurasi yang sesuai:

```env
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_SOLANA_RPC_HOST=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_APP_NAME=Goldium
NEXT_PUBLIC_APP_DESCRIPTION=Advanced Web3 Platform for Solana
```

### Step 5: Testing (Opsional)

```bash
# Test aplikasi
npm start
```

## Alternatif: Deployment via File Manager (Lebih Mudah)

Jika mengalami kesulitan dengan SSH, gunakan metode ini:

### 1. Upload dan Extract
- Login ke hPanel Hostinger
- Buka File Manager
- Upload `goldium-hostinger-cpanel-latest.zip` ke `public_html`
- Extract file zip

### 2. Setup Environment
- Rename `.env.example` menjadi `.env.local`
- Edit file sesuai kebutuhan

### 3. Konfigurasi Node.js App (jika tersedia)
- Di hPanel, cari "Node.js App"
- Create new app dengan:
  - Node.js version: 18.x atau terbaru
  - Application root: `/public_html/goldium-hostinger-cpanel-latest`
  - Application startup file: `server.js` atau `next.config.js`

## Troubleshooting

### Masalah Umum:

1. **SSH Connection Failed**
   - Pastikan kredensial benar
   - Cek firewall/antivirus
   - Gunakan alternatif File Manager

2. **npm install gagal**
   - Pastikan Node.js terinstall di hosting
   - Gunakan `npm install --legacy-peer-deps`

3. **Build error**
   - Cek log error dengan `npm run build --verbose`
   - Pastikan semua dependencies terinstall

4. **Domain tidak menampilkan aplikasi**
   - Pastikan file ada di `public_html`
   - Cek konfigurasi domain di hPanel
   - Tunggu propagasi DNS (5-24 jam)

## File yang Sudah Disiapkan

✅ `goldium-hostinger-cpanel-latest.zip` - Package lengkap
✅ `HOSTINGER_DEPLOYMENT_README.md` - Panduan detail
✅ Semua konfigurasi sudah dioptimalkan
✅ Wallet adapters sudah diperbaiki
✅ UI dalam bahasa Inggris

## Support

Jika masih mengalami kesulitan:
1. Cek dokumentasi Hostinger untuk Node.js hosting
2. Gunakan live chat support Hostinger
3. Pastikan paket hosting mendukung Node.js

---

**Status Aplikasi:**
- ✅ Wallet connection berfungsi
- ✅ Error messages dalam bahasa Inggris
- ✅ "Coming Soon" popups untuk NFT dan Games
- ✅ UI responsive dan modern
- ✅ Siap untuk production

**Estimasi waktu deployment: 15-30 menit**