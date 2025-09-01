# PakeLink

PakeLink: Catat PKL Lo, Biar Nggak Lupa Rasanya! 🤪

Aplikasi pengelolaan administrasi dan pelaporan Praktik Kerja Lapangan (PKL) untuk siswa SMKN 7 Samarinda.

## Fitur Utama

- **Otentikasi & Otorisasi**:
  - Sistem login untuk siswa, pembimbing DU/DI, dan pembimbing sekolah
  - Manajemen user (CRUD)

- **Form & Manajemen Data**:
  - Form pendaftaran siswa PKL
  - Form pendaftaran tempat PKL
  - Validasi data
  - Autocomplete untuk nama sekolah

- **Jurnal Kegiatan Harian**:
  - Pencatatan kegiatan harian
  - Paraf dan evaluasi mingguan pembimbing

- **Absensi**:
  - Pencatatan absensi siswa
  - Tanda tangan pembimbing DU/DI dan sekolah

- **Agenda Konsultasi**:
  - Pencatatan agenda konsultasi
  - Paraf pembimbing

- **Peraturan PKL**:
  - Tampilan peraturan PKL

- **Laporan & Analisis**:
  - Laporan rekap data siswa dan tempat PKL
  - Laporan absensi dan jurnal kegiatan

## Teknologi

- **Frontend**: React, Material UI, Redux Toolkit
- **Backend**: Node.js, Express.js, MongoDB
- **Autentikasi**: JWT (JSON Web Tokens)

## Cara Penggunaan

### Prasyarat

- Node.js (v14 atau lebih baru)
- MongoDB
- npm atau yarn

### Instalasi

1. Clone repositori ini
```
git clone https://github.com/yourusername/PakeLink.git
cd PakeLink
```

2. Instalasi dependencies server
```
cd server
npm install
```

3. Instalasi dependencies client
```
cd ../client
npm install
```

4. Setup environment variables
   - Buat file `.env` di folder `server` dengan isi:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/pakelink
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

### Menjalankan Aplikasi

1. Jalankan server
```
cd server
npm run dev
```

2. Jalankan client
```
cd client
npm start
```

3. Buka browser dan akses `http://localhost:3000`

## Role Pengguna

- **Admin**: Akses penuh ke semua fitur dan manajemen pengguna
- **Siswa**: Mengisi jurnal kegiatan, melihat absensi, dan mengatur konsultasi
- **Pembimbing DU/DI**: Menandatangani jurnal, mengisi absensi, dan evaluasi
- **Pembimbing Sekolah**: Memonitor siswa, validasi jurnal, dan laporan

## Tim Pengembang

KOU Team

## Lisensi

Hak Cipta © 2025 KOU Team. Hak Cipta Dilindungi.
