# Panduan Penggunaan SOL-GOLD DApp

## 🚀 Cara Menjalankan DApp

### 1. Install Dependencies
```bash
npm install
```

### 2. Jalankan Server Development
```bash
npm run dev
```

### 3. Buka Browser
Kunjungi `http://localhost:3000`

## 🔗 Cara Connect Wallet

### Langkah 1: Install Wallet
- **Phantom**: Download dari [phantom.app](https://phantom.app)
- **Solflare**: Download dari [solflare.com](https://solflare.com)
- **Backpack**: Download dari [backpack.app](https://backpack.app)

### Langkah 2: Setup Wallet
1. Install extension wallet di browser
2. Buat wallet baru atau import existing wallet
3. Pastikan wallet terhubung ke **Solana Mainnet**
4. Pastikan ada SOL untuk transaction fees

### Langkah 3: Connect ke DApp
1. Buka DApp di browser
2. Klik tombol "Connect Wallet" 
3. Pilih wallet yang sudah diinstall
4. Approve connection di popup wallet
5. Wallet address akan muncul di dashboard

## 💰 Fitur Send (Kirim Token)

### Cara Mengirim SOL:
1. Klik tab **"Send"**
2. Pilih token **"SOL"**
3. Masukkan alamat penerima (Solana address)
4. Masukkan jumlah SOL yang akan dikirim
5. Klik **"Send SOL"**
6. Approve transaction di wallet
7. Tunggu konfirmasi

### Cara Mengirim GOLD:
1. Klik tab **"Send"**
2. Pilih token **"GOLD"**
3. Masukkan alamat penerima
4. Masukkan jumlah GOLD
5. Klik **"Send GOLD"**
6. Approve transaction di wallet

**Catatan**: Jika penerima belum punya GOLD token account, akan dibuat otomatis.

## 🔄 Fitur Swap (Tukar Token)

### Cara Swap SOL ke GOLD:
1. Klik tab **"Swap"**
2. Pilih **"From: SOL"** dan **"To: GOLD"**
3. Masukkan jumlah SOL yang akan ditukar
4. Review quote yang muncul:
   - Jumlah GOLD yang akan diterima
   - Price impact
   - Exchange rate
5. Klik **"Swap"**
6. Approve transaction di wallet

### Cara Swap GOLD ke SOL:
1. Klik tab **"Swap"**
2. Pilih **"From: GOLD"** dan **"To: SOL"**
3. Masukkan jumlah GOLD
4. Review quote
5. Klik **"Swap"**
6. Approve transaction

**Catatan**: Swap menggunakan Jupiter aggregator untuk best price.

## 🔒 Fitur Staking (Stake SOL)

### Cara Stake SOL:
1. Klik tab **"Staking"**
2. Review informasi staking:
   - Lock period: 30 hari
   - Daily reward rate: 0.033%
   - APY: 12%
   - Reward token: GOLD
3. Masukkan jumlah SOL (minimum 0.01 SOL)
4. Klik **"Stake SOL"**
5. Approve transaction di wallet

### Informasi Staking:
- **Minimum stake**: 0.01 SOL
- **Lock period**: 30 hari
- **Reward rate**: 0.033% per hari
- **APY**: 12%
- **Reward token**: GOLD

## ⚠️ Troubleshooting

### Wallet Tidak Connect:
- Pastikan wallet extension sudah diinstall
- Refresh halaman browser
- Pastikan wallet tidak terkunci
- Coba wallet lain (Phantom/Solflare)

### Transaction Gagal:
- Pastikan ada SOL untuk transaction fees
- Pastikan balance token cukup
- Pastikan alamat penerima valid
- Cek network connection

### Swap Quote Tidak Muncul:
- Coba jumlah yang lebih kecil
- Pastikan ada liquidity untuk token pair
- Refresh halaman

### Error Messages:
- **"Insufficient balance"**: Tambah token ke wallet
- **"Invalid address"**: Cek format alamat Solana
- **"Transaction failed"**: Cek koneksi dan coba lagi
- **"Quote not available"**: Coba jumlah atau token pair lain

## 🔧 Konfigurasi Token

### GOLD Token:
- **Contract Address**: `APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump`
- **Decimals**: 6
- **Network**: Solana Mainnet

### SOL Token:
- **Native Solana token**
- **Decimals**: 9
- **Network**: Solana Mainnet

## 📱 Wallet yang Didukung

✅ **Phantom** - Paling populer
✅ **Solflare** - Fitur lengkap
✅ **Backpack** - Modern UI
✅ **Slope** - Mobile friendly
✅ **Torus** - Social login
✅ **Ledger** - Hardware wallet

## 🎯 Tips Penggunaan

1. **Selalu cek balance** sebelum transaksi
2. **Simpan alamat wallet** dengan aman
3. **Gunakan Phantom** untuk pengalaman terbaik
4. **Pastikan ada SOL** untuk transaction fees
5. **Review transaction** sebelum approve
6. **Simpan transaction hash** untuk tracking

## 🆘 Support

Jika ada masalah:
1. Cek console browser untuk error detail
2. Pastikan wallet terhubung ke mainnet
3. Pastikan ada SOL untuk fees
4. Coba refresh halaman
5. Coba wallet lain

**Happy Trading! 🚀** 