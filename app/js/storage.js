/**
 * Storage utilities for handling localStorage data
 */

const STORAGE_KEYS = {
  USERS: 'pakelink_users',
  CURRENT_USER: 'pakelink_current_user',
  STUDENTS: 'pakelink_students',
  COMPANIES: 'pakelink_companies',
  JOURNALS: 'pakelink_journals',
  ATTENDANCE: 'pakelink_attendance',
  CONSULTATIONS: 'pakelink_consultations',
  REGULATIONS: 'pakelink_regulations',
  SCHOOLS: 'pakelink_schools'
};

// Initialize default data if not exists
function initializeStorage() {
  // Check and initialize each storage item
  Object.values(STORAGE_KEYS).forEach(key => {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify([]));
    }
  });

  // Add default admin user if no users exist
  const users = getUsers();
  if (users.length === 0) {
    const adminUser = {
      id: generateId(),
      username: 'admin',
      email: 'admin@pakelink.com',
      password: 'admin123', // In real app, this should be hashed
      firstName: 'Admin',
      lastName: 'PakeLink',
      role: 'admin',
      isActive: true,
      createdAt: new Date().toISOString()
    };
    users.push(adminUser);
    saveUsers(users);
  }

  // Initialize default regulations
  const regulations = getRegulations();
  if (regulations.length === 0) {
    const defaultRegulations = [
      {
        id: generateId(),
        title: 'Kehadiran dan Waktu Kerja',
        content: 'a. Peserta PKL wajib hadir setiap hari kerja sesuai jadwal yang telah ditentukan oleh pihak DU/DI.\nb. Jam masuk dan pulang mengikuti ketentuan tempat PKL.\nc. Tidak diperbolehkan datang terlambat atau pulang lebih awal tanpa izin dari pembimbing lapangan dan sekolah.',
        category: 'Peraturan PKL',
        order: 1
      },
      {
        id: generateId(),
        title: 'Disiplin dan Etika',
        content: 'a. Menjaga nama baik sekolah dan menunjukkan sikap profesional selama PKL.\nb. Menggunakan pakaian rapi dan sesuai ketentuan (seragam PKL/Seragam Sekolah/ID Card).\nc. Bersikap sopan, santun, dan menghormati semua pihak di lingkungan kerja.',
        category: 'Peraturan PKL',
        order: 2
      },
      {
        id: generateId(),
        title: 'Tanggung Jawab dan Kejujuran',
        content: 'a. Menjalankan tugas yang diberikan dengan penuh tanggung jawab.\nb. Tidak diperkenankan memalsukan data, informasi, maupun laporan.\nc. Menjaga kerahasiaan data perusahaan.',
        category: 'Peraturan PKL',
        order: 3
      },
      {
        id: generateId(),
        title: 'Komunikasi dan Izin',
        content: 'a. Jika berhalangan hadir (sakit atau keperluan mendesak), wajib menginformasikan kepada pembimbing sekolah dan pembimbing dari DU/DI sebelum jam kerja dimulai.\nb. Izin hanya diberikan maksimal 2 hari berturut-turut, selebihnya harus disertai surat keterangan resmi.',
        category: 'Peraturan PKL',
        order: 4
      },
      {
        id: generateId(),
        title: 'Larangan',
        content: 'a. Dilarang menggunakan HP untuk keperluan pribadi selama jam kerja (kecuali diizinkan).\nb. Dilarang merokok, membawa/menyimpan barang terlarang (narkoba, senjata tajam), atau melakukan tindakan kriminal.\nc. Dilarang membolos, berpakaian tidak sopan, membuat gaduh, atau berperilaku tidak menyenangkan di lingkungan kerja.',
        category: 'Peraturan PKL',
        order: 5
      },
      {
        id: generateId(),
        title: 'Laporan dan Evaluasi',
        content: 'a. Peserta wajib mengisi jurnal harian PKL setiap hari dan mengumpulkan laporan PKL di akhir masa praktik.\nb. Siswa wajib mengikuti evaluasi dan pembekalan dari sekolah baik sebelum, selama, maupun setelah pelaksanaan PKL.',
        category: 'Peraturan PKL',
        order: 6
      },
      {
        id: generateId(),
        title: 'Sanksi',
        content: 'Pelanggaran terhadap peraturan ini dapat dikenakan sanksi berupa:\na. Teguran lisan/tertulis\nb. Pemanggilan orang tua\nc. Pemutusan PKL sebelum waktunya\nd. Tidak mendapatkan nilai PKL dan kembali mengulang di kelas XI\ne. Sanksi lain sesuai kebijakan sekolah',
        category: 'Peraturan PKL',
        order: 7
      }
    ];
    saveRegulations(defaultRegulations);
  }

  // Initialize default schools
  const schools = getSchools();
  if (schools.length === 0) {
    const defaultSchools = [
      {
        id: generateId(),
        name: 'SMKN 7 Samarinda',
        address: 'Jl. Soekarno-Hatta Km. 0,5, Loktuan, Kec. Bontang Utara, Kota Bontang, Kalimantan Timur',
        phone: '0548-41741',
        email: 'smkn7samarinda@gmail.com',
        website: 'https://smkn7samarinda.sch.id',
        isActive: true
      }
    ];
    saveSchools(defaultSchools);
  }
}

// Generate a unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Get all users
function getUsers() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
}

// Save users
function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

// Get current logged in user
function getCurrentUser() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) || null;
}

// Save current user
function saveCurrentUser(user) {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
}

// Clear current user (logout)
function clearCurrentUser() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

// Get all students
function getStudents() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS)) || [];
}

// Save students
function saveStudents(students) {
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
}

// Get all companies
function getCompanies() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPANIES)) || [];
}

// Save companies
function saveCompanies(companies) {
  localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies));
}

// Get all journals
function getJournals() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.JOURNALS)) || [];
}

// Save journals
function saveJournals(journals) {
  localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(journals));
}

// Get all attendance records
function getAttendance() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) || [];
}

// Save attendance records
function saveAttendance(attendance) {
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
}

// Get all consultations
function getConsultations() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CONSULTATIONS)) || [];
}

// Save consultations
function saveConsultations(consultations) {
  localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(consultations));
}

// Get all regulations
function getRegulations() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.REGULATIONS)) || [];
}

// Save regulations
function saveRegulations(regulations) {
  localStorage.setItem(STORAGE_KEYS.REGULATIONS, JSON.stringify(regulations));
}

// Get all schools
function getSchools() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.SCHOOLS)) || [];
}

// Save schools
function saveSchools(schools) {
  localStorage.setItem(STORAGE_KEYS.SCHOOLS, JSON.stringify(schools));
}

// Initialize storage when the script loads
initializeStorage();
