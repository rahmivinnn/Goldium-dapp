@echo off
echo 🚀 Membuat paket deployment untuk Hostinger...
echo.

if exist "goldium-hostinger.zip" del "goldium-hostinger.zip"

echo 📦 Mengompres file...
powershell Compress-Archive -Path "goldium-hostinger-deploy\*" -DestinationPath "goldium-hostinger.zip" -Force

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
pause