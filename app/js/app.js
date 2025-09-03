/**
 * PakeLink - Main Application
 * Core functionality and app initialization
 */

// DOM Elements
const appContainer = document.getElementById('app');
const navLinks = document.getElementById('navLinks');
const mobileNavLinks = document.getElementById('mobileNavLinks');

// Page templates
const PAGES = {
  HOME: 'home',
  DASHBOARD: 'dashboard',
  PROFILE: 'profile',
  STUDENTS: 'students',
  STUDENT_FORM: 'student-form',
  STUDENT_DETAIL: 'student-detail',
  COMPANIES: 'companies',
  COMPANY_FORM: 'company-form',
  COMPANY_DETAIL: 'company-detail',
  JOURNALS: 'journals',
  JOURNAL_FORM: 'journal-form',
  JOURNAL_DETAIL: 'journal-detail',
  ATTENDANCE: 'attendance',
  ATTENDANCE_FORM: 'attendance-form',
  ATTENDANCE_DETAIL: 'attendance-detail',
  CONSULTATIONS: 'consultations',
  CONSULTATION_FORM: 'consultation-form',
  CONSULTATION_DETAIL: 'consultation-detail',
  REPORTS: 'reports',
  SETTINGS: 'settings'
};

// User roles
const ROLES = {
  ADMIN: 'admin',
  SCHOOL_SUPERVISOR: 'school_supervisor',
  COMPANY_SUPERVISOR: 'company_supervisor',
  STUDENT: 'student'
};

// Current page
let currentPage = PAGES.HOME;
// Current user
let currentUser = null;

// Initialize the application
function initApp() {
  console.log('Initializing PakeLink application...');
  
  // Check if user data exists in localStorage
  const savedUser = PakeLinkStorage.get('currentUser');
  if (savedUser) {
    currentUser = savedUser;
    console.log('User found in localStorage:', currentUser);
    renderNavigation();
    renderPage(PAGES.DASHBOARD);
  } else {
    console.log('No user found, showing home page');
    renderNavigation();
    renderHomePage();
  }
  
  // Check for app updates if this is a PWA
  checkForAppUpdates();
  
  // Add event listener for online/offline status
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  
  // Initial online status check
  updateOnlineStatus();
}

// Check for PWA updates
function checkForAppUpdates() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      Toast.fire({
        icon: 'info',
        title: 'Aplikasi telah diperbarui. Silakan refresh halaman.'
      });
    });
  }
}

// Update online status
function updateOnlineStatus() {
  const isOnline = navigator.onLine;
  if (!isOnline) {
    Toast.fire({
      icon: 'warning',
      title: 'Anda sedang offline. Beberapa fitur mungkin tidak tersedia.'
    });
  }
}

// Render navigation menu based on user role
function renderNavigation() {
  let navHTML = '';
  let mobileNavHTML = '';
  
  if (currentUser) {
    // Common navigation items for logged in users
    const commonItems = [
      { id: PAGES.DASHBOARD, label: 'Dashboard', icon: 'home' },
      { id: PAGES.PROFILE, label: 'Profil', icon: 'user' }
    ];
    
    // Role specific navigation items
    let roleItems = [];
    
    switch(currentUser.role) {
      case ROLES.ADMIN:
        roleItems = [
          { id: PAGES.STUDENTS, label: 'Siswa', icon: 'users' },
          { id: PAGES.COMPANIES, label: 'DU/DI', icon: 'building' },
          { id: PAGES.JOURNALS, label: 'Jurnal', icon: 'book' },
          { id: PAGES.ATTENDANCE, label: 'Absensi', icon: 'calendar' },
          { id: PAGES.CONSULTATIONS, label: 'Konsultasi', icon: 'chat' },
          { id: PAGES.REPORTS, label: 'Laporan', icon: 'chart-bar' },
          { id: PAGES.SETTINGS, label: 'Pengaturan', icon: 'cog' }
        ];
        break;
        
      case ROLES.SCHOOL_SUPERVISOR:
      case ROLES.COMPANY_SUPERVISOR:
        roleItems = [
          { id: PAGES.STUDENTS, label: 'Siswa', icon: 'users' },
          { id: PAGES.JOURNALS, label: 'Jurnal', icon: 'book' },
          { id: PAGES.ATTENDANCE, label: 'Absensi', icon: 'calendar' },
          { id: PAGES.CONSULTATIONS, label: 'Konsultasi', icon: 'chat' },
          { id: PAGES.REPORTS, label: 'Laporan', icon: 'chart-bar' }
        ];
        break;
        
      case ROLES.STUDENT:
        roleItems = [
          { id: PAGES.JOURNALS, label: 'Jurnal', icon: 'book' },
          { id: PAGES.ATTENDANCE, label: 'Absensi', icon: 'calendar' },
          { id: PAGES.CONSULTATIONS, label: 'Konsultasi', icon: 'chat' }
        ];
        break;
    }
    
    // Combine common and role specific items
    const navItems = [...commonItems, ...roleItems];
    
    // Add logout button
    navItems.push({ id: 'logout', label: 'Logout', icon: 'logout' });
    
    // Generate HTML for both desktop and mobile navs
    navItems.forEach(item => {
      const isActive = currentPage === item.id ? 'text-white bg-primary-800' : 'text-primary-100 hover:bg-primary-800 hover:text-white';
      
      navHTML += `
        <li>
          <a href="#" class="${isActive} px-3 py-2 rounded-md text-sm font-medium flex items-center" data-page="${item.id}">
            ${getIconSvg(item.icon)}
            <span class="ml-1">${item.label}</span>
          </a>
        </li>
      `;
      
      mobileNavHTML += `
        <li>
          <a href="#" class="${isActive} block px-3 py-2 rounded-md text-base font-medium" data-page="${item.id}">
            ${getIconSvg(item.icon)}
            <span class="ml-2">${item.label}</span>
          </a>
        </li>
      `;
    });
  } else {
    // Navigation for not logged in users
    navHTML = `
      <li>
        <a href="#" class="text-primary-100 hover:bg-primary-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium" data-page="login">
          ${getIconSvg('login')}
          <span class="ml-1">Login</span>
        </a>
      </li>
      <li>
        <a href="#" class="text-primary-100 hover:bg-primary-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium" data-page="register">
          ${getIconSvg('user-plus')}
          <span class="ml-1">Register</span>
        </a>
      </li>
    `;
    
    mobileNavHTML = `
      <li>
        <a href="#" class="text-primary-100 hover:bg-primary-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium" data-page="login">
          ${getIconSvg('login')}
          <span class="ml-2">Login</span>
        </a>
      </li>
      <li>
        <a href="#" class="text-primary-100 hover:bg-primary-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium" data-page="register">
          ${getIconSvg('user-plus')}
          <span class="ml-2">Register</span>
        </a>
      </li>
    `;
  }
function renderNavigation() {
  if (!navLinks) return;
  
  navLinks.innerHTML = '';
  
  if (isLoggedIn()) {
    const currentUser = getCurrentUser();
    
    // Common links for all authenticated users
    const commonLinks = [
      { label: 'Dashboard', url: '#', page: PAGES.DASHBOARD, icon: 'bi-speedometer2' },
      { label: 'Peraturan PKL', url: '#', page: PAGES.REGULATIONS, icon: 'bi-clipboard-check' }
    ];
    
    // Role-specific links
    let roleLinks = [];
    
    switch (currentUser.role) {
      case 'admin':
        roleLinks = [
          { label: 'Siswa PKL', url: '#', page: PAGES.STUDENTS, icon: 'bi-person-badge' },
          { label: 'Tempat PKL', url: '#', page: PAGES.COMPANIES, icon: 'bi-building' },
          { label: 'Jurnal Kegiatan', url: '#', page: PAGES.JOURNALS, icon: 'bi-journal-text' },
          { label: 'Absensi', url: '#', page: PAGES.ATTENDANCE, icon: 'bi-calendar-check' },
          { label: 'Konsultasi', url: '#', page: PAGES.CONSULTATIONS, icon: 'bi-chat-dots' }
        ];
        break;
      case 'student':
        roleLinks = [
          { label: 'Jurnal Kegiatan', url: '#', page: PAGES.JOURNALS, icon: 'bi-journal-text' },
          { label: 'Absensi', url: '#', page: PAGES.ATTENDANCE, icon: 'bi-calendar-check' },
          { label: 'Konsultasi', url: '#', page: PAGES.CONSULTATIONS, icon: 'bi-chat-dots' }
        ];
        break;
      case 'company_supervisor':
        roleLinks = [
          { label: 'Siswa PKL', url: '#', page: PAGES.STUDENTS, icon: 'bi-person-badge' },
          { label: 'Jurnal Kegiatan', url: '#', page: PAGES.JOURNALS, icon: 'bi-journal-text' },
          { label: 'Absensi', url: '#', page: PAGES.ATTENDANCE, icon: 'bi-calendar-check' },
          { label: 'Konsultasi', url: '#', page: PAGES.CONSULTATIONS, icon: 'bi-chat-dots' }
        ];
        break;
      case 'school_supervisor':
        roleLinks = [
          { label: 'Siswa PKL', url: '#', page: PAGES.STUDENTS, icon: 'bi-person-badge' },
          { label: 'Tempat PKL', url: '#', page: PAGES.COMPANIES, icon: 'bi-building' },
          { label: 'Jurnal Kegiatan', url: '#', page: PAGES.JOURNALS, icon: 'bi-journal-text' },
          { label: 'Absensi', url: '#', page: PAGES.ATTENDANCE, icon: 'bi-calendar-check' },
          { label: 'Konsultasi', url: '#', page: PAGES.CONSULTATIONS, icon: 'bi-chat-dots' }
        ];
        break;
    }
    
    // Combine common and role-specific links
    const links = [...commonLinks, ...roleLinks];
    
    // Add profile and logout links
    const userLinks = [
      { label: 'Profil', url: '#', page: PAGES.PROFILE, icon: 'bi-person-circle' },
      { label: 'Logout', url: '#', onclick: 'logout()', icon: 'bi-box-arrow-right' }
    ];
    
    // Render all links
    links.forEach(link => {
      const li = document.createElement('li');
      li.className = 'nav-item';
      li.innerHTML = `
        <a class="nav-link" href="${link.url}" data-page="${link.page}">
          <i class="bi ${link.icon} me-1"></i> ${link.label}
        </a>
      `;
      navLinks.appendChild(li);
    });
    
    // Create dropdown for user links
    const userDropdown = document.createElement('li');
    userDropdown.className = 'nav-item dropdown';
    userDropdown.innerHTML = `
      <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="bi bi-person-circle me-1"></i> ${currentUser.firstName}
      </a>
      <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
        ${userLinks.map(link => 
          `<li><a class="dropdown-item" href="${link.url}" data-page="${link.page}" ${link.onclick ? `onclick="${link.onclick}"` : ''}>
            <i class="bi ${link.icon} me-1"></i> ${link.label}
          </a></li>`
        ).join('')}
      </ul>
    `;
    navLinks.appendChild(userDropdown);
    
    // Add event listeners to navigation links
    document.querySelectorAll('[data-page]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.currentTarget.getAttribute('data-page');
        if (page) {
          renderPage(page);
        }
      });
    });
    
  } else {
    // Links for non-authenticated users
    const loginLi = document.createElement('li');
    loginLi.className = 'nav-item';
    loginLi.innerHTML = `
      <a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#loginModal">
        <i class="bi bi-box-arrow-in-right me-1"></i> Login
      </a>
    `;
    
    const registerLi = document.createElement('li');
    registerLi.className = 'nav-item';
    registerLi.innerHTML = `
      <a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#registerModal">
        <i class="bi bi-person-plus me-1"></i> Register
      </a>
    `;
    
    navLinks.appendChild(loginLi);
    navLinks.appendChild(registerLi);
  }
}

// Render the appropriate page based on the selected page
function renderPage(page) {
  currentPage = page;
  
  // Check if user is logged in for protected pages
  if (page !== PAGES.HOME && !isLoggedIn()) {
    loginModal.show();
    return;
  }
  
  switch (page) {
    case PAGES.HOME:
      renderHomePage();
      break;
    case PAGES.DASHBOARD:
      renderDashboard();
      break;
    case PAGES.PROFILE:
      renderProfile();
      break;
    case PAGES.STUDENTS:
      renderStudentsList();
      break;
    case PAGES.STUDENT_FORM:
      renderStudentForm();
      break;
    case PAGES.STUDENT_DETAIL:
      renderStudentDetail();
      break;
    case PAGES.COMPANIES:
      renderCompaniesList();
      break;
    case PAGES.COMPANY_FORM:
      renderCompanyForm();
      break;
    case PAGES.COMPANY_DETAIL:
      renderCompanyDetail();
      break;
    case PAGES.JOURNALS:
      renderJournalsList();
      break;
    case PAGES.JOURNAL_FORM:
      renderJournalForm();
      break;
    case PAGES.JOURNAL_DETAIL:
      renderJournalDetail();
      break;
    case PAGES.ATTENDANCE:
      renderAttendanceList();
      break;
    case PAGES.ATTENDANCE_FORM:
      renderAttendanceForm();
      break;
    case PAGES.ATTENDANCE_DETAIL:
      renderAttendanceDetail();
      break;
    case PAGES.CONSULTATIONS:
      renderConsultationsList();
      break;
    case PAGES.CONSULTATION_FORM:
      renderConsultationForm();
      break;
    case PAGES.CONSULTATION_DETAIL:
      renderConsultationDetail();
      break;
    case PAGES.REGULATIONS:
      renderRegulations();
      break;
    default:
      renderHomePage();
  }
}

// Render home page for non-authenticated users
function renderHomePage() {
  if (!appContainer) return;
  
  appContainer.innerHTML = `
    <div class="container">
      <div class="row align-items-center py-5">
        <div class="col-lg-6">
          <h1 class="display-4 fw-bold text-primary">PakeLink</h1>
          <p class="lead">Catat PKL Lo, Biar Nggak Lupa Rasanya! 🤪</p>
          <p class="mb-4">Aplikasi pengelolaan administrasi dan pelaporan Praktik Kerja Lapangan (PKL) untuk siswa SMKN 7 Samarinda.</p>
          <div class="d-grid gap-2 d-md-flex">
            <button class="btn btn-primary btn-lg px-4" data-bs-toggle="modal" data-bs-target="#loginModal">
              <i class="bi bi-box-arrow-in-right me-2"></i> Login
            </button>
            <button class="btn btn-outline-primary btn-lg px-4" data-bs-toggle="modal" data-bs-target="#registerModal">
              <i class="bi bi-person-plus me-2"></i> Register
            </button>
          </div>
        </div>
        <div class="col-lg-6 d-none d-lg-block">
          <img src="assets/hero.svg" alt="PakeLink Illustration" class="img-fluid">
        </div>
      </div>
      
      <div class="row py-5">
        <div class="col-12 text-center mb-5">
          <h2 class="section-title">Fitur Utama</h2>
          <p class="lead text-muted">Berbagai fitur untuk memudahkan administrasi dan pelaporan PKL</p>
        </div>
        
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <div class="feature-icon">
                <i class="bi bi-journal-text"></i>
              </div>
              <h5 class="card-title">Jurnal Kegiatan</h5>
              <p class="card-text">Catat kegiatan harian PKL dengan mudah dan dapatkan tanda tangan pembimbing secara digital.</p>
            </div>
          </div>
        </div>
        
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <div class="feature-icon">
                <i class="bi bi-calendar-check"></i>
              </div>
              <h5 class="card-title">Absensi Digital</h5>
              <p class="card-text">Rekam kehadiran selama PKL dengan sistem absensi digital yang mudah digunakan.</p>
            </div>
          </div>
        </div>
        
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <div class="feature-icon">
                <i class="bi bi-chat-dots"></i>
              </div>
              <h5 class="card-title">Konsultasi</h5>
              <p class="card-text">Ajukan pertanyaan dan dapatkan feedback dari pembimbing secara online.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="row py-5">
        <div class="col-12 text-center mb-5">
          <h2 class="section-title">Bagaimana Cara Kerjanya?</h2>
        </div>
        
        <div class="col-md-3 mb-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <h1 class="display-4 text-primary mb-3">1</h1>
              <h5 class="card-title">Register</h5>
              <p class="card-text">Daftar sebagai siswa, pembimbing DU/DI, atau pembimbing sekolah.</p>
            </div>
          </div>
        </div>
        
        <div class="col-md-3 mb-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <h1 class="display-4 text-primary mb-3">2</h1>
              <h5 class="card-title">Isi Data</h5>
              <p class="card-text">Lengkapi data diri dan tempat PKL untuk memulai.</p>
            </div>
          </div>
        </div>
        
        <div class="col-md-3 mb-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <h1 class="display-4 text-primary mb-3">3</h1>
              <h5 class="card-title">Catat Kegiatan</h5>
              <p class="card-text">Isi jurnal kegiatan harian dan absensi selama PKL.</p>
            </div>
          </div>
        </div>
        
        <div class="col-md-3 mb-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <h1 class="display-4 text-primary mb-3">4</h1>
              <h5 class="card-title">Dapatkan Laporan</h5>
              <p class="card-text">Lihat dan cetak laporan PKL kapan saja.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="row py-5">
        <div class="col-12 text-center">
          <h2 class="section-title">Siap Mulai?</h2>
          <p class="lead text-muted mb-4">Bergabunglah sekarang dan mudahkan administrasi PKL Anda.</p>
          <button class="btn btn-primary btn-lg px-5" data-bs-toggle="modal" data-bs-target="#registerModal">
            Daftar Sekarang
          </button>
        </div>
      </div>
    </div>
  `;
}

// Render dashboard
function renderDashboard() {
  if (!appContainer) return;
  
  const currentUser = getCurrentUser();
  
  // Define cards based on user role
  let cards = [];
  
  // Common cards
  const regulationsCard = {
    title: 'Peraturan PKL',
    icon: 'bi-clipboard-check',
    description: 'Lihat peraturan dan tata tertib yang berlaku selama PKL.',
    buttonText: 'Lihat Peraturan',
    page: PAGES.REGULATIONS,
    color: 'bg-info'
  };
  
  switch (currentUser.role) {
    case 'admin':
      cards = [
        {
          title: 'Siswa PKL',
          icon: 'bi-person-badge',
          description: 'Kelola data siswa yang sedang menjalani PKL.',
          buttonText: 'Kelola Siswa',
          page: PAGES.STUDENTS,
          color: 'bg-primary'
        },
        {
          title: 'Tempat PKL',
          icon: 'bi-building',
          description: 'Kelola data perusahaan atau instansi tempat PKL.',
          buttonText: 'Kelola Tempat PKL',
          page: PAGES.COMPANIES,
          color: 'bg-warning'
        },
        {
          title: 'Jurnal Kegiatan',
          icon: 'bi-journal-text',
          description: 'Akses dan tinjau jurnal kegiatan harian siswa PKL.',
          buttonText: 'Lihat Jurnal',
          page: PAGES.JOURNALS,
          color: 'bg-success'
        },
        {
          title: 'Absensi',
          icon: 'bi-calendar-check',
          description: 'Lihat dan kelola absensi siswa PKL.',
          buttonText: 'Lihat Absensi',
          page: PAGES.ATTENDANCE,
          color: 'bg-danger'
        },
        {
          title: 'Konsultasi',
          icon: 'bi-chat-dots',
          description: 'Lihat agenda konsultasi dan permasalahan siswa PKL.',
          buttonText: 'Lihat Konsultasi',
          page: PAGES.CONSULTATIONS,
          color: 'bg-secondary'
        },
        regulationsCard
      ];
      break;
    case 'student':
      cards = [
        {
          title: 'Jurnal Kegiatan',
          icon: 'bi-journal-text',
          description: 'Catat kegiatan harian kamu selama PKL.',
          buttonText: 'Isi Jurnal',
          page: PAGES.JOURNALS,
          color: 'bg-success'
        },
        {
          title: 'Absensi',
          icon: 'bi-calendar-check',
          description: 'Lihat rekap absensi kamu selama PKL.',
          buttonText: 'Lihat Absensi',
          page: PAGES.ATTENDANCE,
          color: 'bg-danger'
        },
        {
          title: 'Konsultasi',
          icon: 'bi-chat-dots',
          description: 'Ajukan konsultasi atau sampaikan permasalahan ke pembimbing.',
          buttonText: 'Buat Konsultasi',
          page: PAGES.CONSULTATIONS,
          color: 'bg-secondary'
        },
        regulationsCard
      ];
      break;
    case 'company_supervisor':
      cards = [
        {
          title: 'Siswa PKL',
          icon: 'bi-person-badge',
          description: 'Lihat siswa yang PKL di tempat Anda.',
          buttonText: 'Lihat Siswa',
          page: PAGES.STUDENTS,
          color: 'bg-primary'
        },
        {
          title: 'Jurnal Kegiatan',
          icon: 'bi-journal-text',
          description: 'Beri paraf dan evaluasi jurnal kegiatan siswa.',
          buttonText: 'Tinjau Jurnal',
          page: PAGES.JOURNALS,
          color: 'bg-success'
        },
        {
          title: 'Absensi',
          icon: 'bi-calendar-check',
          description: 'Isi dan tanda tangani absensi siswa PKL.',
          buttonText: 'Isi Absensi',
          page: PAGES.ATTENDANCE,
          color: 'bg-danger'
        },
        {
          title: 'Konsultasi',
          icon: 'bi-chat-dots',
          description: 'Tanggapi konsultasi dari siswa PKL.',
          buttonText: 'Lihat Konsultasi',
          page: PAGES.CONSULTATIONS,
          color: 'bg-secondary'
        },
        regulationsCard
      ];
      break;
    case 'school_supervisor':
      cards = [
        {
          title: 'Siswa PKL',
          icon: 'bi-person-badge',
          description: 'Kelola siswa yang menjadi bimbingan Anda.',
          buttonText: 'Kelola Siswa',
          page: PAGES.STUDENTS,
          color: 'bg-primary'
        },
        {
          title: 'Tempat PKL',
          icon: 'bi-building',
          description: 'Lihat data tempat PKL siswa bimbingan Anda.',
          buttonText: 'Lihat Tempat PKL',
          page: PAGES.COMPANIES,
          color: 'bg-warning'
        },
        {
          title: 'Jurnal Kegiatan',
          icon: 'bi-journal-text',
          description: 'Tinjau jurnal kegiatan siswa bimbingan Anda.',
          buttonText: 'Tinjau Jurnal',
          page: PAGES.JOURNALS,
          color: 'bg-success'
        },
        {
          title: 'Absensi',
          icon: 'bi-calendar-check',
          description: 'Verifikasi absensi siswa bimbingan Anda.',
          buttonText: 'Verifikasi Absensi',
          page: PAGES.ATTENDANCE,
          color: 'bg-danger'
        },
        {
          title: 'Konsultasi',
          icon: 'bi-chat-dots',
          description: 'Tanggapi konsultasi dari siswa bimbingan Anda.',
          buttonText: 'Lihat Konsultasi',
          page: PAGES.CONSULTATIONS,
          color: 'bg-secondary'
        },
        regulationsCard
      ];
      break;
  }
  
  appContainer.innerHTML = `
    <div class="container">
      <div class="card mb-4">
        <div class="card-body">
          <h4 class="card-title">Halo, ${currentUser.firstName} ${currentUser.lastName}!</h4>
          <p class="card-text">Selamat datang di PakeLink, aplikasi manajemen PKL SMKN 7 Samarinda.</p>
        </div>
      </div>
      
      <div class="row">
        ${cards.map(card => `
          <div class="col-md-4 mb-4">
            <div class="card dashboard-card">
              <div class="card-header ${card.color}">
                <h5 class="card-title mb-0">
                  <i class="bi ${card.icon} me-2"></i> ${card.title}
                </h5>
              </div>
              <div class="card-body">
                <p class="card-text">${card.description}</p>
                <button class="btn btn-outline-primary btn-sm" data-page="${card.page}">
                  ${card.buttonText}
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      
      <div class="card mt-4">
        <div class="card-body">
          <h5 class="card-title">PakeLink: Catat PKL Lo, Biar Nggak Lupa Rasanya! 🤪</h5>
          <hr>
          <p class="card-text">
            PakeLink adalah aplikasi pengelolaan administrasi dan pelaporan Praktik Kerja Lapangan (PKL) 
            untuk siswa SMKN 7 Samarinda. Aplikasi ini dirancang untuk memudahkan proses administrasi 
            dan dokumentasi selama masa PKL.
          </p>
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners to dashboard cards
  document.querySelectorAll('[data-page]').forEach(button => {
    button.addEventListener('click', (e) => {
      const page = e.currentTarget.getAttribute('data-page');
      renderPage(page);
    });
  });
}

// Show toast notification
function showToast(message, type = 'success') {
  if (!toast || !toastMessage) return;
  
  // Set toast message
  toastMessage.textContent = message;
  
  // Set toast type (success, danger, warning, info)
  toast.className = `toast align-items-center text-white bg-${type} border-0`;
  
  // Show toast
  const bsToast = new bootstrap.Toast(toast);
  bsToast.show();
}

// Helper function to format date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', initApp);
