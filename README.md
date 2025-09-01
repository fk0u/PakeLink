# PakeLink - Sistem Administrasi PKL

![PakeLink Logo](https://via.placeholder.com/150x50?text=PakeLink)

PakeLink adalah sistem administrasi dan pelaporan Praktik Kerja Lapangan (PKL) untuk SMKN 7 Samarinda. Aplikasi ini memudahkan pengelolaan, monitoring, dan evaluasi kegiatan PKL bagi siswa, pembimbing sekolah, pembimbing industri, dan administrator.

## Fitur Utama

- **Manajemen Siswa PKL**  
  Kelola data siswa yang mengikuti PKL, penempatan, dan pembimbing yang ditugaskan.

- **Manajemen DU/DI (Dunia Usaha/Dunia Industri)**  
  Kelola data perusahaan atau instansi tempat siswa melaksanakan PKL.

- **Jurnal Kegiatan**  
  Siswa dapat mencatat kegiatan harian, yang dapat divalidasi oleh pembimbing.

- **Absensi Digital**  
  Pencatatan kehadiran siswa selama PKL dengan validasi dari pembimbing.

- **Konsultasi**  
  Fitur untuk mengajukan dan mencatat konsultasi antara siswa dan pembimbing.

- **Laporan**  
  Berbagai jenis laporan terkait kegiatan PKL, seperti laporan kehadiran, jurnal, dan evaluasi siswa.

## Teknologi yang Digunakan

- **Frontend**: HTML5, CSS3, JavaScript
- **Styling**: Tailwind CSS
- **DOM Manipulation**: jQuery
- **Data Storage**: Web Storage API (localStorage)
- **Digital Signature**: SignaturePad.js

## Struktur Aplikasi

```
app/
├── index.html            # Halaman utama aplikasi
├── assets/               # Gambar, font, dan resource statis lainnya
└── js/
    ├── app.js            # Core aplikasi dan fungsionalitas umum
    ├── students.js       # Pengelolaan data siswa
    ├── companies.js      # Pengelolaan data DU/DI
    ├── journals.js       # Pengelolaan jurnal kegiatan
    ├── attendance.js     # Pengelolaan absensi
    ├── consultations.js  # Pengelolaan konsultasi
    └── reports.js        # Pembuatan laporan
```

## Peran Pengguna

1. **Administrator**
   - Mengelola seluruh data sistem
   - Mengatur penempatan siswa dan pembimbing
   - Melihat dan mengekspor semua laporan

2. **Pembimbing Sekolah**
   - Memantau kegiatan siswa yang dibimbing
   - Memvalidasi jurnal kegiatan
   - Melakukan konsultasi dengan siswa
   - Membuat evaluasi siswa

3. **Pembimbing DU/DI**
   - Memantau kehadiran dan kegiatan siswa
   - Memvalidasi absensi dan jurnal kegiatan
   - Melakukan konsultasi dengan siswa
   - Membuat evaluasi siswa

4. **Siswa**
   - Mengisi jurnal kegiatan harian
   - Mencatat kehadiran
   - Mengajukan konsultasi dengan pembimbing
   - Melihat dan mencetak laporan individu

## Cara Penggunaan

### Instalasi dan Setup

1. Clone repositori ini ke komputer lokal Anda:
   ```
   git clone https://github.com/fk0u/PakeLink.git
   ```

2. Buka folder aplikasi:
   ```
   cd PakeLink/app
   ```

3. Buka `index.html` di browser web Anda atau gunakan server lokal:
   ```
   # Menggunakan Python SimpleHTTPServer
   python -m http.server
   ```

4. Aplikasi akan berjalan di `http://localhost:8000`

### Penggunaan Awal

1. **Register Akun**: Buat akun baru dengan memilih peran yang sesuai (admin, pembimbing, atau siswa).
2. **Login**: Masuk ke aplikasi menggunakan email dan password yang telah didaftarkan.
3. **Dashboard**: Akses fitur-fitur aplikasi sesuai dengan peran pengguna melalui menu navigasi.

## Demo Aplikasi

Demo online tersedia di: [https://fk0u.github.io/PakeLink](https://fk0u.github.io/PakeLink)

Akun demo:
- **Admin**: admin@example.com / password123
- **Pembimbing Sekolah**: supervisor@school.com / password123
- **Pembimbing DU/DI**: supervisor@company.com / password123
- **Siswa**: student@example.com / password123

## Pengembangan Lokal

Aplikasi ini menggunakan penyimpanan lokal (localStorage), sehingga tidak memerlukan server backend. Namun, untuk pengembangan lebih lanjut, Anda dapat mengintegrasikan dengan backend menggunakan:

- RESTful API dengan Node.js/Express
- Database seperti MySQL atau MongoDB
- Autentikasi dengan JWT atau OAuth

## Tim Pengembang

KOU Team

## Lisensi

Hak Cipta © 2025 KOU Team. Hak Cipta Dilindungi.
