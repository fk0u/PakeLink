# Panduan Instalasi PakeLink

Berikut adalah langkah-langkah untuk menginstal dan menjalankan aplikasi PakeLink di lingkungan pengembangan.

## Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:

1. Node.js (versi 14.x atau lebih tinggi)
2. MongoDB (versi 4.x atau lebih tinggi)
3. npm (biasanya terinstal bersama Node.js)
4. Git

## Langkah Instalasi

### 1. Clone Repositori

```bash
git clone https://github.com/yourusername/PakeLink.git
cd PakeLink
```

### 2. Instal Dependencies

Jalankan perintah berikut untuk menginstal semua dependencies yang diperlukan untuk server dan client:

```bash
npm run install-all
```

Perintah ini akan menginstal dependencies untuk:
- Root project
- Server (backend)
- Client (frontend)

### 3. Konfigurasi Lingkungan

Buat file `.env` di folder `server` dengan informasi berikut:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pakelink
JWT_SECRET=your_jwt_secret_key_change_in_production
NODE_ENV=development
```

Pastikan untuk mengubah nilai `JWT_SECRET` ke string acak yang kuat untuk keamanan.

### 4. Jalankan MongoDB

Pastikan layanan MongoDB berjalan di komputer Anda. Jika belum, mulai layanannya dengan perintah yang sesuai dengan sistem operasi Anda.

Untuk Windows:
```bash
# Jika MongoDB diinstal sebagai layanan
net start MongoDB

# Atau jika diinstal secara manual
"C:\Program Files\MongoDB\Server\4.4\bin\mongod.exe" --dbpath="C:\data\db"
```

Untuk Linux/Mac:
```bash
sudo service mongod start
# atau
sudo systemctl start mongod
```

### 5. Jalankan Aplikasi

Untuk menjalankan aplikasi dalam mode pengembangan, gunakan perintah:

```bash
npm start
```

Perintah ini akan memulai:
- Server backend di http://localhost:5000
- Client frontend di http://localhost:3000

### 6. Akses Aplikasi

Buka browser dan akses http://localhost:3000 untuk mengakses antarmuka aplikasi PakeLink.

## Akun Default

Saat pertama kali menjalankan aplikasi, Anda dapat membuat akun administrator dengan mendaftar di halaman registrasi.

## Pemecahan Masalah

Jika Anda mengalami masalah saat instalasi atau menjalankan aplikasi, coba langkah-langkah berikut:

1. Pastikan Node.js dan MongoDB terinstal dengan benar
2. Periksa apakah MongoDB berjalan
3. Pastikan semua dependencies telah terinstal dengan benar
4. Periksa log server untuk kesalahan

Jika masalah berlanjut, silakan buka issue di repositori GitHub.
