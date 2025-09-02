# PakeLink - Sistem Administrasi PKL

<div align="center">

![PakeLink Logo](https://via.placeholder.com/150x50?text=PakeLink)

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/fk0u/PakeLink)
[![License](https://img.shields.io/badge/license-WTFPL-green.svg)](https://github.com/fk0u/PakeLink/blob/main/LICENSE)
[![Status](https://img.shields.io/badge/status-active-success.svg)](https://github.com/fk0u/PakeLink)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/fk0u/PakeLink/pulls)
[![GitHub issues](https://img.shields.io/github/issues/fk0u/PakeLink.svg)](https://github.com/fk0u/PakeLink/issues)
[![GitHub stars](https://img.shields.io/github/stars/fk0u/PakeLink.svg)](https://github.com/fk0u/PakeLink/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/fk0u/PakeLink.svg)](https://github.com/fk0u/PakeLink/network)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-2.2.19-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![jQuery](https://img.shields.io/badge/jQuery-3.6.0-0769AD?logo=jquery&logoColor=white)](https://jquery.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

</div>

PakeLink adalah sistem administrasi dan pelaporan Praktik Kerja Lapangan (PKL) yang komprehensif untuk SMKN 7 Samarinda. Aplikasi ini memudahkan pengelolaan, monitoring, dan evaluasi kegiatan PKL bagi siswa, pembimbing sekolah, pembimbing industri, dan administrator. Dengan antarmuka yang intuitif dan fitur yang lengkap, PakeLink membantu mengoptimalkan proses administrasi PKL dari awal hingga akhir.

[📚 Lihat Analisis Sistem Lengkap](./docs/system-analysis.md)

## ✨ Fitur Utama

- **Manajemen Siswa PKL** 🧑‍🎓  
  Kelola data siswa yang mengikuti PKL, penempatan, dan pembimbing yang ditugaskan dengan mudah dan efisien.

- **Manajemen DU/DI (Dunia Usaha/Dunia Industri)** 🏢  
  Kelola data perusahaan atau instansi tempat siswa melaksanakan PKL dengan detail lengkap.

- **Jurnal Kegiatan** 📝  
  Siswa dapat mencatat kegiatan harian, yang dapat divalidasi oleh pembimbing dengan sistem persetujuan yang transparan.

- **Absensi Digital** ✅  
  Pencatatan kehadiran siswa selama PKL dengan validasi dari pembimbing, termasuk statistik kehadiran.

- **Konsultasi** 💬  
  Fitur untuk mengajukan dan mencatat konsultasi antara siswa dan pembimbing, dengan penjadwalan dan pencatatan hasil.

- **Laporan Komprehensif** 📊  
  Berbagai jenis laporan terkait kegiatan PKL, seperti laporan kehadiran, jurnal, dan evaluasi siswa yang dapat diekspor.

## 🛠️ Teknologi yang Digunakan

<div align="center">

| Teknologi | Versi | Deskripsi |
|-----------|-------|-----------|
| HTML5 | 5 | Struktur halaman web |
| CSS3 | 3 | Styling aplikasi |
| JavaScript | ES6+ | Logika dan fungsionalitas aplikasi |
| Tailwind CSS | 2.2.19 | Framework CSS untuk styling responsif |
| jQuery | 3.6.0 | Library JavaScript untuk manipulasi DOM |
| Web Storage API | - | Penyimpanan data lokal (localStorage) |
| SignaturePad.js | 2.3.2 | Penanganan tanda tangan digital |
| jsPDF | 2.5.1 | Pembuatan dokumen PDF |

</div>

## 📂 Struktur Aplikasi

```
app/
├── index.html                # Halaman utama aplikasi
├── assets/                   # Gambar, font, dan resource statis lainnya
│   ├── css/                  # File CSS tambahan
│   ├── img/                  # Gambar dan ikon
│   └── js/                   # Library JavaScript pihak ketiga
└── js/
    ├── app.js                # Core aplikasi dan fungsionalitas umum
    ├── students.js           # Pengelolaan data siswa
    ├── companies.js          # Pengelolaan data DU/DI
    ├── journals.js           # Pengelolaan jurnal kegiatan
    ├── attendance.js         # Pengelolaan absensi
    ├── consultations.js      # Pengelolaan konsultasi
    └── reports.js            # Pembuatan laporan
```

## 👥 Peran Pengguna

1. **Administrator** 👨‍💼
   - Mengelola seluruh data sistem
   - Mengatur penempatan siswa dan pembimbing
   - Melihat dan mengekspor semua laporan
   - Mengelola akun pengguna

2. **Pembimbing Sekolah** 👨‍🏫
   - Memantau kegiatan siswa yang dibimbing
   - Memvalidasi jurnal kegiatan
   - Melakukan konsultasi dengan siswa
   - Membuat evaluasi siswa

3. **Pembimbing DU/DI** 👩‍💼
   - Memantau kehadiran dan kegiatan siswa
   - Memvalidasi absensi dan jurnal kegiatan
   - Melakukan konsultasi dengan siswa
   - Membuat evaluasi siswa

4. **Siswa** 👨‍🎓
   - Mengisi jurnal kegiatan harian
   - Mencatat kehadiran
   - Mengajukan konsultasi dengan pembimbing
   - Melihat dan mencetak laporan individu

## 🚀 Cara Penggunaan

### 📥 Instalasi dan Setup

1. Clone repositori ini ke komputer lokal Anda:
   ```bash
   git clone https://github.com/fk0u/PakeLink.git
   ```

2. Buka folder aplikasi:
   ```bash
   cd PakeLink/app
   ```

3. Buka `index.html` di browser web Anda atau gunakan server lokal:
   ```bash
   # Menggunakan Python SimpleHTTPServer
   python -m http.server

   # Atau menggunakan Node.js dengan http-server
   npx http-server
   ```

4. Aplikasi akan berjalan di `http://localhost:8000` atau `http://localhost:8080`

### 🏁 Penggunaan Awal

1. **Register Akun**: Buat akun baru dengan memilih peran yang sesuai (admin, pembimbing, atau siswa).
2. **Login**: Masuk ke aplikasi menggunakan email dan password yang telah didaftarkan.
3. **Dashboard**: Akses fitur-fitur aplikasi sesuai dengan peran pengguna melalui menu navigasi.

<details>
<summary>📱 Tampilan Aplikasi</summary>
<br>

| Halaman | Deskripsi |
|---------|-----------|
| Login | Halaman autentikasi pengguna |
| Dashboard | Ringkasan aktivitas dan statistik |
| Manajemen Siswa | CRUD data siswa PKL |
| Manajemen DU/DI | CRUD data tempat PKL |
| Jurnal Kegiatan | Pencatatan dan validasi kegiatan |
| Absensi | Pencatatan dan validasi kehadiran |
| Konsultasi | Penjadwalan dan pencatatan konsultasi |
| Laporan | Generasi berbagai jenis laporan |

</details>

## 🌐 Demo Aplikasi

Demo online tersedia di: [https://fk0u.github.io/PakeLink](https://fk0u.github.io/PakeLink)

### 🔑 Akun Demo

| Peran | Email | Password |
|-------|-------|----------|
| Admin | admin@example.com | password123 |
| Pembimbing Sekolah | supervisor@school.com | password123 |
| Pembimbing DU/DI | supervisor@company.com | password123 |
| Siswa | student@example.com | password123 |

## 💻 Pengembangan Lokal

Aplikasi ini menggunakan penyimpanan lokal (localStorage), sehingga tidak memerlukan server backend. Untuk pengembangan lebih lanjut, Anda dapat:

- 🔄 Mengintegrasikan dengan RESTful API menggunakan Node.js/Express
- 🗃️ Menambahkan database seperti MySQL atau MongoDB
- 🔐 Mengimplementasikan autentikasi dengan JWT atau OAuth
- 📱 Mengembangkan versi mobile dengan framework seperti React Native atau Flutter

<details>
<summary>🛠️ Diagram Arsitektur</summary>
<br>

```
+-------------------+        +-------------------+
|                   |        |                   |
|  Browser Client   |<------>|  Local Storage    |
|                   |        |                   |
+-------------------+        +-------------------+
        |
        | (Potential Future Development)
        v
+-------------------+        +-------------------+
|                   |        |                   |
|  RESTful API      |<------>|  Database Server  |
|                   |        |                   |
+-------------------+        +-------------------+
```

</details>

## 🧪 Testing

Untuk menjalankan pengujian aplikasi:

1. Buka aplikasi di browser
2. Gunakan Akun Demo yang tersedia
3. Uji setiap fitur sesuai dengan peran pengguna

## 👨‍💻 Kontributor

KOU Team

<div align="center">

[![KOU Team](https://img.shields.io/badge/Built%20by-KOU%20Team-blue)](https://github.com/fk0u)

</div>

## 📚 Dokumentasi

Dokumentasi lebih lengkap tentang aplikasi PakeLink dapat ditemukan di:

- [Analisis Sistem](./docs/system-analysis.md) - PRD, PSD, CRUD, ERD, dan detail implementasi
- [Panduan Pengguna](https://github.com/fk0u/PakeLink/wiki) - Petunjuk penggunaan bagi pengguna akhir

## 📝 Changelog

<details>
<summary>Lihat Changelog</summary>

### v1.0.0 (2 September 2025)
- Rilis awal PakeLink
- Implementasi semua fitur utama
- Dokumentasi lengkap

</details>

## 📜 Lisensi

<div align="center">

[![WTFPL License](https://img.shields.io/badge/License-WTFPL-brightgreen.svg)](http://www.wtfpl.net/)

</div>

Dilisensikan di bawah [WTFPL License](http://www.wtfpl.net/) - Lakukan apa yang Anda inginkan dengan kode ini.

```
        DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE 
                    Version 2, December 2004 

 Copyright (C) 2025 KOU Team

 Everyone is permitted to copy and distribute verbatim or modified 
 copies of this license document, and changing it is allowed as long 
 as the name is changed. 

            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE 
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION 

  0. You just DO WHAT THE FUCK YOU WANT TO.
```
