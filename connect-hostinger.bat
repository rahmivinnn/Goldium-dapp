@echo off
echo Connecting to Hostinger via PuTTY...
echo Host: 153.92.8.107
echo Port: 65002
echo Username: u719500717
echo.
echo Setelah login, jalankan perintah berikut:
echo cd public_html
echo npm install
echo npm run build
echo.

REM Cari PuTTY di lokasi umum
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
    echo 📥 Download PuTTY dari: https://www.putty.org/
    echo 💡 Atau letakkan putty.exe di Desktop/Downloads
    echo.
    echo 🔧 Alternatif: Gunakan Windows Terminal dengan SSH:
    echo ssh -p 65002 u719500717@153.92.8.107
)
pause