@echo off
color 0A
echo.
echo ========================================
echo    🚀 GOLDIUM AUTO DEPLOY HELPER
echo ========================================
echo.
echo 📦 File deployment yang tersedia:
echo    ✅ goldium-hostinger-latest.zip (211 KB)
echo    ✅ goldium-hostinger-cpanel-latest.zip (212 KB)
echo.
echo 📋 Pilih metode deployment:
echo    [1] File Manager (TERMUDAH - Recommended)
echo    [2] PuTTY/SSH Connection
echo    [3] Lihat Panduan Lengkap
echo    [4] Exit
echo.
set /p choice=Pilih opsi (1-4): 

if "%choice%"=="1" goto filemanager
if "%choice%"=="2" goto putty
if "%choice%"=="3" goto panduan
if "%choice%"=="4" goto exit
goto invalid

:filemanager
cls
echo.
echo 🌐 DEPLOYMENT VIA FILE MANAGER
echo ================================
echo.
echo 📝 Langkah-langkah:
echo.
echo 1️⃣  Buka https://hpanel.hostinger.com
echo 2️⃣  Login dan pilih domain goldium.io
echo 3️⃣  Klik File Manager
echo 4️⃣  Masuk ke folder public_html
echo 5️⃣  Hapus semua file yang ada (jika ada)
echo 6️⃣  Upload goldium-hostinger-latest.zip
echo 7️⃣  Extract file zip
echo 8️⃣  Pindahkan isi folder ke public_html
echo 9️⃣  Rename .env.example menjadi .env.local
echo 🔟 Klik Terminal di hPanel, jalankan:
echo     cd public_html
echo     npm install
echo     npm run build
echo.
echo 🎯 Setup Node.js App di hPanel:
echo    - Node.js version: 18.x
echo    - Application root: public_html
echo    - Application URL: /
echo    - Startup file: server.js
echo.
echo 🌍 Website akan tersedia di: https://goldium.io
echo.
start https://hpanel.hostinger.com
echo ✅ Browser terbuka ke hPanel Hostinger
echo.
pause
goto menu

:putty
cls
echo.
echo 🔐 DEPLOYMENT VIA PUTTY/SSH
echo ==============================
echo.
echo 📡 Koneksi SSH:
echo    Host: 153.92.8.107
echo    Port: 65002
echo    Username: u719500717
echo    Password: [Password Hostinger Anda]
echo.
echo 💻 Perintah setelah login SSH:
echo    cd public_html
echo    rm -rf * (hapus file lama)
echo    npm install
echo    npm run build
echo    cp .env.example .env.local
echo.
echo 🔧 Mencoba membuka PuTTY...
echo.
if exist "C:\Program Files\PuTTY\putty.exe" (
    "C:\Program Files\PuTTY\putty.exe" -ssh u719500717@153.92.8.107 -P 65002
) else if exist "C:\Program Files (x86)\PuTTY\putty.exe" (
    "C:\Program Files (x86)\PuTTY\putty.exe" -ssh u719500717@153.92.8.107 -P 65002
) else if exist "%USERPROFILE%\Desktop\putty.exe" (
    "%USERPROFILE%\Desktop\putty.exe" -ssh u719500717@153.92.8.107 -P 65002
) else if exist "%USERPROFILE%\Downloads\putty.exe" (
    "%USERPROFILE%\Downloads\putty.exe" -ssh u719500717@153.92.8.107 -P 65002
) else (
    echo ❌ PuTTY tidak ditemukan!
    echo 📥 Download dari: https://www.putty.org/
    start https://www.putty.org/
)
echo.
pause
goto menu

:panduan
cls
echo.
echo 📖 MEMBUKA PANDUAN LENGKAP
echo ============================
echo.
echo 📄 File panduan yang tersedia:
echo    ✅ PANDUAN_DEPLOYMENT_MUDAH.md
echo    ✅ HOSTINGER_DEPLOYMENT_README.md
echo    ✅ AUTO_DEPLOY_GUIDE.md
echo.
start PANDUAN_DEPLOYMENT_MUDAH.md
echo ✅ Panduan terbuka di editor default
echo.
pause
goto menu

:invalid
echo.
echo ❌ Pilihan tidak valid! Silakan pilih 1-4.
echo.
pause

:menu
cls
goto start

:exit
echo.
echo 👋 Terima kasih! Deployment package siap digunakan.
echo 📦 Jangan lupa upload goldium-hostinger-latest.zip
echo.
pause
exit