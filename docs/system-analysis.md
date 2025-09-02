# Analisis Sistem PakeLink

## 📋 PRD (Product Requirements Document)

### 1. Pendahuluan

#### 1.1 Tujuan
Dokumen ini menjelaskan persyaratan untuk pengembangan aplikasi "PakeLink", sebuah sistem administrasi dan pelaporan Praktik Kerja Lapangan (PKL) untuk SMKN 7 Samarinda.

#### 1.2 Ruang Lingkup
PakeLink adalah aplikasi berbasis web yang dirancang untuk memudahkan pengelolaan administrasi PKL, termasuk manajemen data siswa, tempat PKL, jurnal kegiatan, absensi, konsultasi, dan pelaporan.

#### 1.3 Definisi, Akronim, dan Singkatan
- **PKL**: Praktik Kerja Lapangan
- **DU/DI**: Dunia Usaha/Dunia Industri
- **CRUD**: Create, Read, Update, Delete
- **UI**: User Interface
- **UX**: User Experience

### 2. Deskripsi Produk

#### 2.1 Perspektif Produk
PakeLink merupakan aplikasi mandiri yang menggunakan penyimpanan lokal (localStorage) untuk menyimpan data. Aplikasi ini dapat diakses melalui browser web tanpa memerlukan instalasi khusus.

#### 2.2 Fungsi Produk
1. Manajemen pengguna dan otentikasi
2. Pengelolaan data siswa PKL
3. Pengelolaan data tempat PKL (DU/DI)
4. Pencatatan dan validasi jurnal kegiatan harian
5. Sistem absensi digital
6. Pengelolaan konsultasi antara siswa dan pembimbing
7. Pembuatan laporan dan evaluasi

#### 2.3 Karakteristik Pengguna
1. **Administrator**: Mengelola seluruh data dan pengguna sistem
2. **Pembimbing Sekolah**: Memantau dan mengevaluasi kegiatan PKL siswa
3. **Pembimbing DU/DI**: Membimbing dan mengevaluasi siswa di tempat PKL
4. **Siswa**: Mengisi jurnal, absensi, dan mengajukan konsultasi

#### 2.4 Batasan
1. Aplikasi berjalan pada browser web modern (Chrome, Firefox, Safari, Edge)
2. Menggunakan localStorage untuk penyimpanan data
3. Terbatas pada fitur-fitur yang dapat diimplementasikan tanpa backend server

### 3. Persyaratan Spesifik

#### 3.1 Fungsional

##### 3.1.1 Otentikasi & Otorisasi
- **F1.1**: Sistem harus menyediakan fitur pendaftaran akun
- **F1.2**: Sistem harus menyediakan fitur login
- **F1.3**: Sistem harus membatasi akses fitur berdasarkan peran pengguna
- **F1.4**: Sistem harus menyediakan fitur logout

##### 3.1.2 Manajemen Siswa
- **F2.1**: Admin dapat menambahkan data siswa
- **F2.2**: Admin dapat melihat daftar seluruh siswa
- **F2.3**: Admin dapat memperbarui data siswa
- **F2.4**: Admin dapat menghapus data siswa
- **F2.5**: Admin dapat menugaskan pembimbing untuk siswa
- **F2.6**: Admin dapat menugaskan tempat PKL untuk siswa

##### 3.1.3 Manajemen DU/DI (Tempat PKL)
- **F3.1**: Admin dapat menambahkan data tempat PKL
- **F3.2**: Admin dapat melihat daftar tempat PKL
- **F3.3**: Admin dapat memperbarui data tempat PKL
- **F3.4**: Admin dapat menghapus data tempat PKL
- **F3.5**: Admin dapat menambahkan pembimbing DU/DI

##### 3.1.4 Jurnal Kegiatan
- **F4.1**: Siswa dapat membuat entri jurnal kegiatan harian
- **F4.2**: Siswa dapat melihat riwayat jurnal kegiatannya
- **F4.3**: Siswa dapat mengedit jurnal kegiatan yang belum divalidasi
- **F4.4**: Pembimbing dapat melihat jurnal kegiatan siswa
- **F4.5**: Pembimbing dapat memvalidasi jurnal kegiatan
- **F4.6**: Pembimbing dapat memberikan feedback pada jurnal kegiatan

##### 3.1.5 Absensi
- **F5.1**: Siswa dapat mencatat kehadiran harian
- **F5.2**: Siswa dapat melihat riwayat kehadirannya
- **F5.3**: Pembimbing dapat melihat kehadiran siswa
- **F5.4**: Pembimbing dapat memvalidasi kehadiran siswa
- **F5.5**: Sistem dapat menampilkan statistik kehadiran

##### 3.1.6 Konsultasi
- **F6.1**: Siswa dapat mengajukan konsultasi
- **F6.2**: Pembimbing dapat melihat permintaan konsultasi
- **F6.3**: Pembimbing dapat menyetujui/menolak permintaan konsultasi
- **F6.4**: Pembimbing dapat mencatat hasil konsultasi
- **F6.5**: Siswa dan pembimbing dapat melihat riwayat konsultasi

##### 3.1.7 Laporan
- **F7.1**: Sistem dapat menghasilkan laporan ringkasan siswa
- **F7.2**: Sistem dapat menghasilkan laporan kehadiran
- **F7.3**: Sistem dapat menghasilkan laporan jurnal kegiatan
- **F7.4**: Sistem dapat menghasilkan laporan konsultasi
- **F7.5**: Pembimbing dapat membuat evaluasi siswa
- **F7.6**: Laporan dapat dicetak atau diunduh sebagai PDF

#### 3.2 Non-Fungsional

##### 3.2.1 Kegunaan
- **NF1.1**: Antarmuka pengguna harus intuitif dan mudah digunakan
- **NF1.2**: Sistem harus responsif pada berbagai ukuran layar

##### 3.2.2 Keandalan
- **NF2.1**: Sistem harus menyimpan data secara aman di localStorage
- **NF2.2**: Sistem harus mencegah kehilangan data dengan validasi input

##### 3.2.3 Kinerja
- **NF3.1**: Sistem harus memuat halaman dalam waktu kurang dari 3 detik
- **NF3.2**: Sistem harus merespons interaksi pengguna dengan cepat

##### 3.2.4 Keamanan
- **NF4.1**: Password pengguna harus disimpan dengan aman (tidak plain text)
- **NF4.2**: Akses ke data harus dibatasi berdasarkan peran pengguna

## 🔄 PSD (Product System Design)

### 1. Arsitektur Sistem

PakeLink menggunakan arsitektur client-side MVC (Model-View-Controller) dengan komponen berikut:

#### 1.1 Model
- **LocalStorage Data Store**: Menyimpan semua data aplikasi dalam localStorage browser
- **Data Models**: Object-based models untuk siswa, perusahaan, jurnal, absensi, konsultasi, dan laporan

#### 1.2 View
- **HTML/CSS**: Struktur dan styling antarmuka pengguna
- **Tailwind CSS**: Framework CSS untuk desain responsif
- **Komponen UI**: Modular UI components untuk form, tabel, modal, dll.

#### 1.3 Controller
- **JavaScript Modules**: Modul terpisah untuk setiap fitur utama
- **Event Handlers**: Penanganan interaksi pengguna
- **Business Logic**: Logika aplikasi untuk setiap fitur

### 2. Desain Database (LocalStorage)

Data disimpan dalam localStorage dengan struktur berikut:

```
localStorage
├── users                # Data pengguna
├── students             # Data siswa
├── companies            # Data tempat PKL
├── journals             # Data jurnal kegiatan
├── attendance           # Data absensi
├── consultations        # Data konsultasi
└── evaluations          # Data evaluasi
```

### 3. Modul Sistem

#### 3.1 Modul Otentikasi
- **Login**: Autentikasi pengguna
- **Register**: Pendaftaran pengguna baru
- **Session Management**: Pengelolaan sesi pengguna

#### 3.2 Modul Siswa
- **Student CRUD**: Operasi CRUD untuk data siswa
- **Student Assignment**: Penugasan siswa ke tempat PKL dan pembimbing

#### 3.3 Modul DU/DI
- **Company CRUD**: Operasi CRUD untuk data tempat PKL
- **Supervisor Management**: Pengelolaan pembimbing DU/DI

#### 3.4 Modul Jurnal
- **Journal Entry**: Pencatatan kegiatan harian
- **Journal Validation**: Validasi jurnal oleh pembimbing
- **Journal Reporting**: Pelaporan jurnal kegiatan

#### 3.5 Modul Absensi
- **Attendance Recording**: Pencatatan kehadiran
- **Attendance Validation**: Validasi absensi oleh pembimbing
- **Attendance Statistics**: Statistik kehadiran

#### 3.6 Modul Konsultasi
- **Consultation Request**: Pengajuan konsultasi
- **Consultation Management**: Pengelolaan jadwal konsultasi
- **Consultation Recording**: Pencatatan hasil konsultasi

#### 3.7 Modul Laporan
- **Report Generation**: Pembuatan berbagai jenis laporan
- **Student Evaluation**: Evaluasi kinerja siswa
- **Export Functionality**: Ekspor laporan ke PDF

### 4. Alur Kerja Utama

#### 4.1 Alur Kerja Siswa
1. Siswa login ke sistem
2. Siswa mencatat kehadiran harian
3. Siswa membuat entri jurnal kegiatan
4. Siswa mengajukan konsultasi jika diperlukan
5. Siswa melihat feedback dan evaluasi dari pembimbing

#### 4.2 Alur Kerja Pembimbing
1. Pembimbing login ke sistem
2. Pembimbing melihat data siswa yang dibimbing
3. Pembimbing memvalidasi absensi dan jurnal kegiatan
4. Pembimbing merespons permintaan konsultasi
5. Pembimbing membuat evaluasi siswa

#### 4.3 Alur Kerja Admin
1. Admin login ke sistem
2. Admin mengelola data siswa dan tempat PKL
3. Admin menugaskan siswa ke tempat PKL dan pembimbing
4. Admin memantau aktivitas seluruh pengguna
5. Admin menghasilkan laporan untuk keperluan administratif

## 📊 CRUD Operations

### 1. Users CRUD

| Operasi | Deskripsi | Peran yang Diizinkan |
|---------|-----------|----------------------|
| Create | Membuat akun pengguna baru | Semua (registrasi), Admin |
| Read | Melihat data pengguna | Admin, Pengguna sendiri |
| Update | Memperbarui profil pengguna | Admin, Pengguna sendiri |
| Delete | Menghapus akun pengguna | Admin |

### 2. Students CRUD

| Operasi | Deskripsi | Peran yang Diizinkan |
|---------|-----------|----------------------|
| Create | Menambahkan data siswa baru | Admin |
| Read | Melihat data siswa | Admin, Pembimbing, Siswa sendiri |
| Update | Memperbarui data siswa | Admin, Siswa sendiri (terbatas) |
| Delete | Menghapus data siswa | Admin |

### 3. Companies CRUD

| Operasi | Deskripsi | Peran yang Diizinkan |
|---------|-----------|----------------------|
| Create | Menambahkan tempat PKL baru | Admin |
| Read | Melihat data tempat PKL | Admin, Pembimbing, Siswa |
| Update | Memperbarui data tempat PKL | Admin |
| Delete | Menghapus tempat PKL | Admin |

### 4. Journals CRUD

| Operasi | Deskripsi | Peran yang Diizinkan |
|---------|-----------|----------------------|
| Create | Membuat entri jurnal baru | Siswa |
| Read | Melihat jurnal kegiatan | Admin, Pembimbing, Siswa sendiri |
| Update | Mengedit jurnal (belum divalidasi) | Siswa sendiri |
| Delete | Menghapus jurnal (belum divalidasi) | Siswa sendiri, Admin |

### 5. Attendance CRUD

| Operasi | Deskripsi | Peran yang Diizinkan |
|---------|-----------|----------------------|
| Create | Mencatat kehadiran | Siswa |
| Read | Melihat data kehadiran | Admin, Pembimbing, Siswa sendiri |
| Update | Memperbarui status kehadiran | Pembimbing, Admin |
| Delete | Menghapus catatan kehadiran | Admin |

### 6. Consultations CRUD

| Operasi | Deskripsi | Peran yang Diizinkan |
|---------|-----------|----------------------|
| Create | Mengajukan konsultasi | Siswa |
| Read | Melihat data konsultasi | Admin, Pembimbing terkait, Siswa terkait |
| Update | Memperbarui status konsultasi | Pembimbing terkait, Admin |
| Delete | Membatalkan konsultasi | Siswa (pending), Admin |

### 7. Reports CRUD

| Operasi | Deskripsi | Peran yang Diizinkan |
|---------|-----------|----------------------|
| Create | Membuat laporan/evaluasi | Pembimbing, Admin |
| Read | Melihat laporan | Admin, Pembimbing, Siswa (terbatas) |
| Update | Memperbarui laporan | Pembimbing (miliknya), Admin |
| Delete | Menghapus laporan | Admin |

## 🔄 ERD (Entity Relationship Diagram)

### Entitas dan Atribut

#### User
- id (PK)
- firstName
- lastName
- email
- password
- phone
- role (admin, school_supervisor, company_supervisor, student)
- createdAt
- updatedAt

#### Student
- id (PK)
- userId (FK)
- nis
- className
- companyId (FK)
- schoolSupervisorId (FK)
- startDate
- endDate
- status
- createdAt
- updatedAt

#### Company
- id (PK)
- name
- address
- phone
- email
- website
- industry
- description
- supervisorId (FK)
- createdAt
- updatedAt

#### Journal
- id (PK)
- studentId (FK)
- date
- activities
- learningOutcomes
- challenges
- solutions
- status (pending, approved, rejected)
- feedback
- validatedById (FK)
- createdAt
- updatedAt

#### Attendance
- id (PK)
- studentId (FK)
- date
- status (present, late, absent, permit, sick)
- timeIn
- timeOut
- notes
- validatedById (FK)
- createdAt
- updatedAt

#### Consultation
- id (PK)
- studentId (FK)
- consultationType (school, company)
- schoolSupervisorId (FK)
- companySupervisorId (FK)
- title
- description
- date
- time
- status (pending, confirmed, completed, cancelled)
- result
- notes
- createdAt
- updatedAt

#### Evaluation
- id (PK)
- studentId (FK)
- evaluatorId (FK)
- evaluationType (midterm, final)
- discipline
- responsibility
- initiative
- communication
- teamwork
- technicalSkill
- theoreticalKnowledge
- neatness
- ethics
- adaptability
- total
- average
- notes
- date
- createdAt
- updatedAt

### Relasi

1. **User - Student** (One-to-One)
   - Satu User dengan peran student dapat memiliki satu Student record

2. **Company - Student** (One-to-Many)
   - Satu Company dapat memiliki banyak Student

3. **User - Student (as Supervisor)** (One-to-Many)
   - Satu User dengan peran school_supervisor dapat membimbing banyak Student

4. **User - Company (as Supervisor)** (One-to-Many)
   - Satu User dengan peran company_supervisor dapat terkait dengan banyak Company

5. **Student - Journal** (One-to-Many)
   - Satu Student dapat memiliki banyak Journal

6. **Student - Attendance** (One-to-Many)
   - Satu Student dapat memiliki banyak Attendance

7. **Student - Consultation** (One-to-Many)
   - Satu Student dapat memiliki banyak Consultation

8. **User - Journal (as Validator)** (One-to-Many)
   - Satu User dengan peran supervisor dapat memvalidasi banyak Journal

9. **User - Attendance (as Validator)** (One-to-Many)
   - Satu User dengan peran supervisor dapat memvalidasi banyak Attendance

10. **User - Consultation (as Supervisor)** (One-to-Many)
    - Satu User dengan peran supervisor dapat terlibat dalam banyak Consultation

11. **Student - Evaluation** (One-to-Many)
    - Satu Student dapat memiliki banyak Evaluation

12. **User - Evaluation (as Evaluator)** (One-to-Many)
    - Satu User dengan peran supervisor dapat membuat banyak Evaluation

### Diagram ERD

```
+--------+       +----------+       +-----------+
|  User  |<----->|  Student |<----->|  Company  |
+--------+       +----------+       +-----------+
    ^                 |                  ^
    |                 |                  |
    v                 v                  |
+--------+       +----------+            |
| Journal|<------| Attendance|           |
+--------+       +----------+            |
                      ^                  |
                      |                  |
                 +-------------+         |
                 |Consultation |<--------+
                 +-------------+
                      ^
                      |
                 +----------+
                 |Evaluation|
                 +----------+
```

## 📱 Mockup UI

### Halaman Login
```
+----------------------------------+
|          PakeLink Logo           |
|                                  |
|  +----------------------------+  |
|  |        Email Address       |  |
|  +----------------------------+  |
|                                  |
|  +----------------------------+  |
|  |         Password           |  |
|  +----------------------------+  |
|                                  |
|  [ ] Remember Me                 |
|                                  |
|  +----------------------------+  |
|  |           Login            |  |
|  +----------------------------+  |
|                                  |
|  Belum punya akun? Register      |
+----------------------------------+
```

### Dashboard Siswa
```
+----------------------------------+
| PakeLink | Dashboard    [User ▼] |
+----------+-------------------------+
|          |                         |
| Dashboard| Selamat datang, [Name]! |
| Profil   |                         |
| Jurnal   | +------+ +------+ +------+
| Absensi  | |Jurnal| |Absensi| |Konsul|
| Konsultasi|+------+ +------+ +------+
| Laporan  |                         |
|          | Jurnal Terakhir         |
| Logout   | +-------------------------+
|          | | Tanggal | Kegiatan     |
+----------+ +-------------------------+
            | | 02/09  | Lorem ipsum...|
            | | 01/09  | Lorem ipsum...|
            | +-------------------------+
            |                         |
            | Absensi Bulan Ini       |
            | +-------------------------+
            | | Hadir: 20 | Izin: 1   |
            | | Sakit: 0  | Alpha: 0  |
            | +-------------------------+
            +-------------------------+
```

### Form Jurnal Kegiatan
```
+----------------------------------+
| PakeLink | Jurnal      [User ▼]  |
+----------+-------------------------+
|          |                         |
| Dashboard| Tambah Jurnal Kegiatan  |
| Profil   |                         |
| Jurnal   | Tanggal: [__________]   |
| Absensi  |                         |
| Konsultasi| Kegiatan:              |
| Laporan  | +---------------------+ |
|          | |                     | |
| Logout   | +---------------------+ |
|          |                         |
+----------+ Hasil Pembelajaran:     |
            | +---------------------+ |
            | |                     | |
            | +---------------------+ |
            |                         |
            | Tantangan/Masalah:      |
            | +---------------------+ |
            | |                     | |
            | +---------------------+ |
            |                         |
            | Solusi:                 |
            | +---------------------+ |
            | |                     | |
            | +---------------------+ |
            |                         |
            | [Kembali] [Simpan]      |
            +-------------------------+
```

## 📝 Kesimpulan

Dokumen ini menyediakan analisis komprehensif untuk pengembangan aplikasi PakeLink, sebuah sistem administrasi dan pelaporan PKL untuk SMKN 7 Samarinda. Dengan implementasi yang sesuai dengan spesifikasi di atas, PakeLink akan menjadi solusi efektif untuk mengelola proses PKL, mulai dari penugasan siswa hingga evaluasi akhir.

Sistem ini menggunakan pendekatan berbasis client-side dengan localStorage untuk penyimpanan data, yang membuatnya mudah diakses tanpa memerlukan infrastruktur server yang kompleks. Pengembangan selanjutnya dapat mencakup integrasi dengan backend server untuk meningkatkan skalabilitas dan keamanan.
