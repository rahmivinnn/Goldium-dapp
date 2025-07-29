# Script PowerShell untuk koneksi SSH ke Hostinger
Write-Host "🚀 Goldium Auto Deploy ke Hostinger" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📡 Koneksi SSH ke Hostinger:" -ForegroundColor Yellow
Write-Host "   Host: 153.92.8.107" -ForegroundColor Cyan
Write-Host "   Port: 65002" -ForegroundColor Cyan
Write-Host "   Username: u719500717" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔑 Masukkan password Hostinger saat diminta" -ForegroundColor Yellow
Write-Host ""

# Cek apakah SSH tersedia
try {
    $sshCommand = Get-Command ssh -ErrorAction Stop
    Write-Host "✅ SSH client ditemukan, memulai koneksi..." -ForegroundColor Green
    Write-Host ""
    
    # Tampilkan perintah yang akan dijalankan setelah login
    Write-Host "📋 Setelah login berhasil, jalankan perintah berikut:" -ForegroundColor Yellow
    Write-Host "   cd public_html" -ForegroundColor White
    Write-Host "   npm install" -ForegroundColor White
    Write-Host "   npm run build" -ForegroundColor White
    Write-Host "   cp .env.example .env.local" -ForegroundColor White
    Write-Host ""
    
    # Mulai koneksi SSH
    ssh -p 65002 u719500717@153.92.8.107
    
} catch {
    Write-Host "❌ SSH client tidak ditemukan!" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Solusi alternatif:" -ForegroundColor Yellow
    Write-Host "1. Install OpenSSH via Windows Features" -ForegroundColor White
    Write-Host "2. Gunakan PuTTY (jalankan connect-hostinger.bat)" -ForegroundColor White
    Write-Host "3. Gunakan Windows Terminal dengan WSL" -ForegroundColor White
    Write-Host ""
    Write-Host "📥 Download PuTTY: https://www.putty.org/" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "📖 Baca AUTO_DEPLOY_GUIDE.md untuk panduan lengkap" -ForegroundColor Green
Read-Host "Tekan Enter untuk melanjutkan"