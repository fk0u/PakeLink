/**
 * PakeLink - Dashboard functionality
 */

// Render dashboard page
function renderDashboardPage() {
  // Different dashboard based on user role
  let dashboardContent = '';
  
  if (!currentUser) {
    // If no user is logged in, redirect to home page
    renderPage(PAGES.HOME);
    return;
  }
  
  // Common dashboard header
  const dashboardHeader = `
    <div class="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 mb-8 slide-in">
      <div class="bg-gradient-to-r from-primary-700 to-primary-900 px-6 py-5 text-white">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-2xl font-bold">Dashboard</h1>
            <p class="text-primary-100">Selamat datang, ${currentUser.name}</p>
          </div>
          <div class="mt-4 md:mt-0">
            <span class="px-4 py-1.5 bg-primary-800 rounded-full text-sm font-medium shadow-inner flex items-center justify-center space-x-1.5 w-max">
              <span class="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>${getRoleName(currentUser.role)}</span>
            </span>
          </div>
        </div>
      </div>
      
      <div class="p-6">
        <div class="text-sm text-gray-600 mb-4 flex flex-col sm:flex-row sm:justify-between">
          <p class="mb-2 sm:mb-0 flex items-center">
            <svg class="w-4 h-4 mr-1.5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            ${DateUtils.formatDate(new Date())}
          </p>
          <p class="flex items-center">
            <svg class="w-4 h-4 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
            </svg>
            Status: <span class="text-green-600 font-medium">Online</span>
          </p>
        </div>
        
        <div class="border-t border-gray-200 pt-4">
          <h2 class="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            Ringkasan Aktivitas
          </h2>
        </div>
      </div>
    </div>
  `;
  
  // Role-specific dashboard content
  switch(currentUser.role) {
    case ROLES.ADMIN:
      dashboardContent = renderAdminDashboard();
      break;
    case ROLES.SCHOOL_SUPERVISOR:
      dashboardContent = renderSchoolSupervisorDashboard();
      break;
    case ROLES.COMPANY_SUPERVISOR:
      dashboardContent = renderCompanySupervisorDashboard();
      break;
    case ROLES.STUDENT:
      dashboardContent = renderStudentDashboard();
      break;
  }
  
  // Render dashboard
  appContainer.innerHTML = dashboardHeader + dashboardContent;
  
  // Add event listeners
  addDashboardEventListeners();
  
  // Show welcome notification
  setTimeout(() => {
    Notify.success(`Selamat datang kembali, ${currentUser.name}!`);
  }, 500);
}

// Render Admin Dashboard
function renderAdminDashboard() {
  return `
    <div class="card-grid">
      <div class="stats-card scale-in" style="animation-delay: 0.1s">
        <div class="stats-icon bg-blue-100 text-blue-500">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
        </div>
        <div class="stats-info">
          <div class="stats-value">120</div>
          <div class="stats-label">Total Siswa</div>
          <div class="stats-trend trend-up">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
            <span>5% dari bulan lalu</span>
          </div>
        </div>
      </div>
      
      <div class="stats-card scale-in" style="animation-delay: 0.2s">
        <div class="stats-icon bg-green-100 text-green-500">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        </div>
        <div class="stats-info">
          <div class="stats-value">25</div>
          <div class="stats-label">Total DU/DI</div>
          <div class="stats-trend trend-up">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
            <span>2 baru bulan ini</span>
          </div>
        </div>
      </div>
      
      <div class="stats-card scale-in" style="animation-delay: 0.3s">
        <div class="stats-icon bg-purple-100 text-purple-500">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <div class="stats-info">
          <div class="stats-value">348</div>
          <div class="stats-label">Total Jurnal</div>
          <div class="stats-trend trend-up">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
            <span>12 hari ini</span>
          </div>
        </div>
      </div>
      
      <div class="stats-card scale-in" style="animation-delay: 0.4s">
        <div class="stats-icon bg-red-100 text-red-500">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="stats-info">
          <div class="stats-value">98.2%</div>
          <div class="stats-label">Tingkat Kehadiran</div>
          <div class="stats-trend trend-up">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
            <span>1.2% dari minggu lalu</span>
          </div>
        </div>
      </div>
    </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500 card-hover">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-500 text-sm">Jurnal Hari Ini</p>
            <h3 class="text-2xl font-bold text-gray-800 mt-1">42</h3>
          </div>
          <div class="bg-purple-100 p-2 rounded-full">
            ${getIconSvg('book')}
          </div>
        </div>
        <div class="mt-4">
          <a href="#" class="text-purple-600 hover:text-purple-800 text-sm font-medium" data-page="${PAGES.JOURNALS}">Lihat Detail &rarr;</a>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500 card-hover">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-500 text-sm">Konsultasi Pending</p>
            <h3 class="text-2xl font-bold text-gray-800 mt-1">8</h3>
          </div>
          <div class="bg-yellow-100 p-2 rounded-full">
            ${getIconSvg('chat')}
          </div>
        </div>
        <div class="mt-4">
          <a href="#" class="text-yellow-600 hover:text-yellow-800 text-sm font-medium" data-page="${PAGES.CONSULTATIONS}">Lihat Detail &rarr;</a>
        </div>
      </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
      <div class="lg:col-span-2">
        <div class="bg-white p-6 rounded-xl shadow-md slide-in" style="animation-delay: 0.3s">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800 flex items-center">
              <svg class="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
              </svg>
              Analitik PKL
            </h3>
            <div class="mt-2 md:mt-0">
              <select class="custom-input py-1 px-2 text-sm" id="chartPeriodSelect">
                <option value="week">Minggu Ini</option>
                <option value="month" selected>Bulan Ini</option>
                <option value="year">Tahun Ini</option>
              </select>
            </div>
          </div>
          
          <div class="h-64 bg-gray-50 rounded-lg p-4 border border-gray-200 mb-2 relative">
            <!-- Chart would go here in a real implementation -->
            <div class="absolute inset-0 flex items-center justify-center flex-col">
              <div class="text-gray-400 mb-2">
                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                </svg>
              </div>
              <p class="text-gray-500 text-sm">Grafik akan ditampilkan di sini</p>
            </div>
          </div>
          
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div class="text-sm text-gray-500">Jurnal</div>
              <div class="text-lg font-semibold text-primary-700">+12.5%</div>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div class="text-sm text-gray-500">Kehadiran</div>
              <div class="text-lg font-semibold text-green-600">+8.2%</div>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div class="text-sm text-gray-500">Konsultasi</div>
              <div class="text-lg font-semibold text-yellow-600">+5.4%</div>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div class="text-sm text-gray-500">Nilai Rata-rata</div>
              <div class="text-lg font-semibold text-purple-600">B+</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="lg:col-span-1">
        <div class="bg-white p-6 rounded-xl shadow-md slide-in" style="animation-delay: 0.4s">
          <h3 class="text-lg font-semibold text-gray-800 flex items-center mb-4">
            <svg class="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Aktivitas Terbaru
          </h3>
          
          <div class="space-y-4">
            <div class="flex items-start">
              <div class="flex-shrink-0 mr-3">
                <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </div>
              </div>
              <div>
                <p class="text-sm text-gray-800 font-medium">Sinta mengisi jurnal kegiatan</p>
                <p class="text-xs text-gray-500">Baru saja</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="flex-shrink-0 mr-3">
                <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <div>
                <p class="text-sm text-gray-800 font-medium">Budi melakukan absensi</p>
                <p class="text-xs text-gray-500">5 menit yang lalu</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="flex-shrink-0 mr-3">
                <div class="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
              <div>
                <p class="text-sm text-gray-800 font-medium">Konsultasi dijadwalkan dengan Pak Andi</p>
                <p class="text-xs text-gray-500">20 menit yang lalu</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="flex-shrink-0 mr-3">
                <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
              </div>
              <div>
                <p class="text-sm text-gray-800 font-medium">Jurnal Deni divalidasi oleh pembimbing</p>
                <p class="text-xs text-gray-500">1 jam yang lalu</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="flex-shrink-0 mr-3">
                <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                  </svg>
                </div>
              </div>
              <div>
                <p class="text-sm text-gray-800 font-medium">Pengajuan PKL baru dari Rini</p>
                <p class="text-xs text-gray-500">3 jam yang lalu</p>
              </div>
            </div>
          </div>
          
          <div class="mt-4 pt-4 border-t border-gray-200">
            <a href="#" class="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center justify-center">
              Lihat Semua Aktivitas
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      <div class="bg-white p-6 rounded-xl shadow-md slide-in" style="animation-delay: 0.5s">
        <h3 class="text-lg font-semibold text-gray-800 flex items-center mb-4">
          <svg class="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          Siswa Teratas
        </h3>
        
        <div class="overflow-x-auto">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Kelas</th>
                <th>DU/DI</th>
                <th>Progres</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="font-medium">Sinta Dewi</td>
                <td>XII RPL 1</td>
                <td>PT Maju Jaya</td>
                <td>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-green-500 h-2 rounded-full" style="width: 85%"></div>
                  </div>
                </td>
                <td><span class="status-badge status-approved">Baik</span></td>
              </tr>
              <tr>
                <td class="font-medium">Budi Santoso</td>
                <td>XII RPL 2</td>
                <td>CV Teknologi</td>
                <td>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-green-500 h-2 rounded-full" style="width: 78%"></div>
                  </div>
                </td>
                <td><span class="status-badge status-approved">Baik</span></td>
              </tr>
              <tr>
                <td class="font-medium">Deni Cahyadi</td>
                <td>XII MM 1</td>
                <td>PT Digital Kreasi</td>
                <td>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-yellow-500 h-2 rounded-full" style="width: 65%"></div>
                  </div>
                </td>
                <td><span class="status-badge status-pending">Sedang</span></td>
              </tr>
              <tr>
                <td class="font-medium">Rini Puspita</td>
                <td>XII TKJ 1</td>
                <td>CV Jaringan Mandiri</td>
                <td>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-green-500 h-2 rounded-full" style="width: 72%"></div>
                  </div>
                </td>
                <td><span class="status-badge status-approved">Baik</span></td>
              </tr>
              <tr>
                <td class="font-medium">Andi Firmansyah</td>
                <td>XII RPL 1</td>
                <td>PT Solusi Digital</td>
                <td>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-red-500 h-2 rounded-full" style="width: 45%"></div>
                  </div>
                </td>
                <td><span class="status-badge status-rejected">Kurang</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="mt-4 pt-2 border-t border-gray-200">
          <a href="#" class="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center justify-center" data-page="${PAGES.STUDENTS}">
            Lihat Semua Siswa
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </a>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-xl shadow-md slide-in" style="animation-delay: 0.6s">
        <h3 class="text-lg font-semibold text-gray-800 flex items-center mb-4">
          <svg class="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
          DU/DI Terpopuler
        </h3>
        
        <div class="overflow-x-auto">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Jenis</th>
                <th>Lokasi</th>
                <th>Kuota</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="font-medium">PT Maju Jaya</td>
                <td>Software House</td>
                <td>Samarinda</td>
                <td>10/15</td>
                <td><span class="status-badge status-approved">Tersedia</span></td>
              </tr>
              <tr>
                <td class="font-medium">CV Teknologi</td>
                <td>Web Developer</td>
                <td>Samarinda</td>
                <td>8/10</td>
                <td><span class="status-badge status-approved">Tersedia</span></td>
              </tr>
              <tr>
                <td class="font-medium">PT Digital Kreasi</td>
                <td>Multimedia</td>
                <td>Balikpapan</td>
                <td>12/12</td>
                <td><span class="status-badge status-rejected">Penuh</span></td>
              </tr>
              <tr>
                <td class="font-medium">CV Jaringan Mandiri</td>
                <td>Networking</td>
                <td>Samarinda</td>
                <td>5/8</td>
                <td><span class="status-badge status-approved">Tersedia</span></td>
              </tr>
              <tr>
                <td class="font-medium">PT Solusi Digital</td>
                <td>Software House</td>
                <td>Tenggarong</td>
                <td>3/5</td>
                <td><span class="status-badge status-approved">Tersedia</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="mt-4 pt-2 border-t border-gray-200">
          <a href="#" class="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center justify-center" data-page="${PAGES.COMPANIES}">
            Lihat Semua DU/DI
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  `;
}

// Render School Supervisor Dashboard
function renderSchoolSupervisorDashboard() {
  return `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 card-hover">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-500 text-sm">Siswa Bimbingan</p>
            <h3 class="text-2xl font-bold text-gray-800 mt-1">25</h3>
          </div>
          <div class="bg-blue-100 p-2 rounded-full">
            ${getIconSvg('users')}
          </div>
        </div>
        <div class="mt-4">
          <a href="#" class="text-blue-600 hover:text-blue-800 text-sm font-medium" data-page="${PAGES.STUDENTS}">Lihat Detail &rarr;</a>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500 card-hover">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-500 text-sm">Jurnal Pending</p>
            <h3 class="text-2xl font-bold text-gray-800 mt-1">12</h3>
          </div>
          <div class="bg-purple-100 p-2 rounded-full">
            ${getIconSvg('book')}
          </div>
        </div>
        <div class="mt-4">
          <a href="#" class="text-purple-600 hover:text-purple-800 text-sm font-medium" data-page="${PAGES.JOURNALS}">Lihat Detail &rarr;</a>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500 card-hover">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-500 text-sm">Konsultasi Pending</p>
            <h3 class="text-2xl font-bold text-gray-800 mt-1">5</h3>
          </div>
          <div class="bg-yellow-100 p-2 rounded-full">
            ${getIconSvg('chat')}
          </div>
        </div>
        <div class="mt-4">
          <a href="#" class="text-yellow-600 hover:text-yellow-800 text-sm font-medium" data-page="${PAGES.CONSULTATIONS}">Lihat Detail &rarr;</a>
        </div>
      </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
        <div class="p-4 border-b border-gray-200 bg-gray-50">
          <h3 class="font-bold text-gray-800">Jurnal Terbaru</h3>
        </div>
        <div class="p-4">
          <!-- Similar to admin dashboard but with data specific to this supervisor's students -->
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th class="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Siswa</th>
                  <th class="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr>
                  <td class="py-2 px-3 whitespace-nowrap text-sm text-gray-500">02 Sep 2025</td>
                  <td class="py-2 px-3 whitespace-nowrap text-sm font-medium text-gray-800">Siswa 1</td>
                  <td class="py-2 px-3 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                  </td>
                  <td class="py-2 px-3 whitespace-nowrap text-sm font-medium">
                    <a href="#" class="text-primary-600 hover:text-primary-800">Lihat</a>
                  </td>
                </tr>
                <tr>
                  <td class="py-2 px-3 whitespace-nowrap text-sm text-gray-500">01 Sep 2025</td>
                  <td class="py-2 px-3 whitespace-nowrap text-sm font-medium text-gray-800">Siswa 2</td>
                  <td class="py-2 px-3 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Disetujui</span>
                  </td>
                  <td class="py-2 px-3 whitespace-nowrap text-sm font-medium">
                    <a href="#" class="text-primary-600 hover:text-primary-800">Lihat</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mt-4 text-right">
            <a href="#" class="text-primary-600 hover:text-primary-800 text-sm font-medium" data-page="${PAGES.JOURNALS}">Lihat Semua &rarr;</a>
          </div>
        </div>
      </div>
      
      <div class="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
        <div class="p-4 border-b border-gray-200 bg-gray-50">
          <h3 class="font-bold text-gray-800">Jadwal Konsultasi</h3>
        </div>
        <div class="p-4">
          <div class="space-y-4">
            <div class="flex items-start p-3 bg-gray-50 rounded-lg">
              <div class="flex-shrink-0 bg-primary-100 rounded-full p-2 mr-3">
                ${getIconSvg('calendar')}
              </div>
              <div class="flex-1">
                <div class="flex justify-between">
                  <h4 class="text-sm font-medium text-gray-800">Diskusi Laporan Akhir</h4>
                  <span class="text-xs text-gray-500">05 Sep 2025</span>
                </div>
                <p class="text-sm text-gray-600 mt-1">Siswa: Siswa 1</p>
                <p class="text-xs text-gray-500 mt-1">Waktu: 09:00 - 10:00</p>
              </div>
            </div>
            
            <div class="flex items-start p-3 bg-gray-50 rounded-lg">
              <div class="flex-shrink-0 bg-primary-100 rounded-full p-2 mr-3">
                ${getIconSvg('calendar')}
              </div>
              <div class="flex-1">
                <div class="flex justify-between">
                  <h4 class="text-sm font-medium text-gray-800">Evaluasi Tengah PKL</h4>
                  <span class="text-xs text-gray-500">06 Sep 2025</span>
                </div>
                <p class="text-sm text-gray-600 mt-1">Siswa: Siswa 2</p>
                <p class="text-xs text-gray-500 mt-1">Waktu: 13:00 - 14:00</p>
              </div>
            </div>
          </div>
          <div class="mt-4 text-right">
            <a href="#" class="text-primary-600 hover:text-primary-800 text-sm font-medium" data-page="${PAGES.CONSULTATIONS}">Lihat Semua &rarr;</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Render Company Supervisor Dashboard (similar to School Supervisor)
function renderCompanySupervisorDashboard() {
  return `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 card-hover">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-500 text-sm">Siswa PKL</p>
            <h3 class="text-2xl font-bold text-gray-800 mt-1">15</h3>
          </div>
          <div class="bg-blue-100 p-2 rounded-full">
            ${getIconSvg('users')}
          </div>
        </div>
        <div class="mt-4">
          <a href="#" class="text-blue-600 hover:text-blue-800 text-sm font-medium" data-page="${PAGES.STUDENTS}">Lihat Detail &rarr;</a>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 card-hover">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-500 text-sm">Absensi Hari Ini</p>
            <h3 class="text-2xl font-bold text-gray-800 mt-1">12</h3>
          </div>
          <div class="bg-green-100 p-2 rounded-full">
            ${getIconSvg('calendar')}
          </div>
        </div>
        <div class="mt-4">
          <a href="#" class="text-green-600 hover:text-green-800 text-sm font-medium" data-page="${PAGES.ATTENDANCE}">Lihat Detail &rarr;</a>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500 card-hover">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-500 text-sm">Jurnal Pending</p>
            <h3 class="text-2xl font-bold text-gray-800 mt-1">8</h3>
          </div>
          <div class="bg-purple-100 p-2 rounded-full">
            ${getIconSvg('book')}
          </div>
        </div>
        <div class="mt-4">
          <a href="#" class="text-purple-600 hover:text-purple-800 text-sm font-medium" data-page="${PAGES.JOURNALS}">Lihat Detail &rarr;</a>
        </div>
      </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Similar to school supervisor but with data specific to this company -->
      <div class="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
        <div class="p-4 border-b border-gray-200 bg-gray-50">
          <h3 class="font-bold text-gray-800">Absensi Terbaru</h3>
        </div>
        <div class="p-4">
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th class="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Siswa</th>
                  <th class="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr>
                  <td class="py-2 px-3 whitespace-nowrap text-sm text-gray-500">02 Sep 2025</td>
                  <td class="py-2 px-3 whitespace-nowrap text-sm font-medium text-gray-800">Siswa 1</td>
                  <td class="py-2 px-3 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Hadir</span>
                  </td>
                  <td class="py-2 px-3 whitespace-nowrap text-sm font-medium">
                    <a href="#" class="text-primary-600 hover:text-primary-800">Lihat</a>
                  </td>
                </tr>
                <tr>
                  <td class="py-2 px-3 whitespace-nowrap text-sm text-gray-500">02 Sep 2025</td>
                  <td class="py-2 px-3 whitespace-nowrap text-sm font-medium text-gray-800">Siswa 2</td>
                  <td class="py-2 px-3 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Terlambat</span>
                  </td>
                  <td class="py-2 px-3 whitespace-nowrap text-sm font-medium">
                    <a href="#" class="text-primary-600 hover:text-primary-800">Lihat</a>
                  </td>
                </tr>
                <tr>
                  <td class="py-2 px-3 whitespace-nowrap text-sm text-gray-500">02 Sep 2025</td>
                  <td class="py-2 px-3 whitespace-nowrap text-sm font-medium text-gray-800">Siswa 3</td>
                  <td class="py-2 px-3 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Tidak Hadir</span>
                  </td>
                  <td class="py-2 px-3 whitespace-nowrap text-sm font-medium">
                    <a href="#" class="text-primary-600 hover:text-primary-800">Lihat</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mt-4 text-right">
            <a href="#" class="text-primary-600 hover:text-primary-800 text-sm font-medium" data-page="${PAGES.ATTENDANCE}">Lihat Semua &rarr;</a>
          </div>
        </div>
      </div>
      
      <div class="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
        <div class="p-4 border-b border-gray-200 bg-gray-50">
          <h3 class="font-bold text-gray-800">Jurnal Terbaru</h3>
        </div>
        <div class="p-4">
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th class="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Siswa</th>
                  <th class="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr>
                  <td class="py-2 px-3 whitespace-nowrap text-sm text-gray-500">01 Sep 2025</td>
                  <td class="py-2 px-3 whitespace-nowrap text-sm font-medium text-gray-800">Siswa 1</td>
                  <td class="py-2 px-3 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                  </td>
                  <td class="py-2 px-3 whitespace-nowrap text-sm font-medium">
                    <a href="#" class="text-primary-600 hover:text-primary-800">Lihat</a>
                  </td>
                </tr>
                <tr>
                  <td class="py-2 px-3 whitespace-nowrap text-sm text-gray-500">01 Sep 2025</td>
                  <td class="py-2 px-3 whitespace-nowrap text-sm font-medium text-gray-800">Siswa 2</td>
                  <td class="py-2 px-3 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                  </td>
                  <td class="py-2 px-3 whitespace-nowrap text-sm font-medium">
                    <a href="#" class="text-primary-600 hover:text-primary-800">Lihat</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mt-4 text-right">
            <a href="#" class="text-primary-600 hover:text-primary-800 text-sm font-medium" data-page="${PAGES.JOURNALS}">Lihat Semua &rarr;</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Render Student Dashboard
function renderStudentDashboard() {
  return `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500 card-hover">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-500 text-sm">Total Jurnal</p>
            <h3 class="text-2xl font-bold text-gray-800 mt-1">28</h3>
          </div>
          <div class="bg-purple-100 p-2 rounded-full">
            ${getIconSvg('book')}
          </div>
        </div>
        <div class="mt-4">
          <a href="#" class="text-purple-600 hover:text-purple-800 text-sm font-medium" data-page="${PAGES.JOURNALS}">Lihat Detail &rarr;</a>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 card-hover">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-500 text-sm">Kehadiran</p>
            <h3 class="text-2xl font-bold text-gray-800 mt-1">92%</h3>
          </div>
          <div class="bg-green-100 p-2 rounded-full">
            ${getIconSvg('calendar')}
          </div>
        </div>
        <div class="mt-4">
          <a href="#" class="text-green-600 hover:text-green-800 text-sm font-medium" data-page="${PAGES.ATTENDANCE}">Lihat Detail &rarr;</a>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500 card-hover">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-500 text-sm">Konsultasi</p>
            <h3 class="text-2xl font-bold text-gray-800 mt-1">5</h3>
          </div>
          <div class="bg-yellow-100 p-2 rounded-full">
            ${getIconSvg('chat')}
          </div>
        </div>
        <div class="mt-4">
          <a href="#" class="text-yellow-600 hover:text-yellow-800 text-sm font-medium" data-page="${PAGES.CONSULTATIONS}">Lihat Detail &rarr;</a>
        </div>
      </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
        <div class="p-4 border-b border-gray-200 bg-gray-50">
          <h3 class="font-bold text-gray-800">Informasi PKL</h3>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div class="flex items-start">
              <div class="flex-shrink-0 bg-primary-100 rounded-full p-2 mr-3">
                ${getIconSvg('building')}
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-800">Tempat PKL</h4>
                <p class="text-sm text-gray-600 mt-1">PT. Contoh Perusahaan</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="flex-shrink-0 bg-primary-100 rounded-full p-2 mr-3">
                ${getIconSvg('user')}
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-800">Pembimbing Sekolah</h4>
                <p class="text-sm text-gray-600 mt-1">Nama Pembimbing Sekolah</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="flex-shrink-0 bg-primary-100 rounded-full p-2 mr-3">
                ${getIconSvg('user')}
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-800">Pembimbing DU/DI</h4>
                <p class="text-sm text-gray-600 mt-1">Nama Pembimbing DU/DI</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="flex-shrink-0 bg-primary-100 rounded-full p-2 mr-3">
                ${getIconSvg('calendar')}
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-800">Periode PKL</h4>
                <p class="text-sm text-gray-600 mt-1">01 Agu 2025 - 31 Okt 2025</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="flex-shrink-0 bg-primary-100 rounded-full p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-800">Status</h4>
                <p class="text-sm text-gray-600 mt-1">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Aktif</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
        <div class="p-4 border-b border-gray-200 bg-gray-50">
          <h3 class="font-bold text-gray-800">Jadwal Konsultasi</h3>
        </div>
        <div class="p-4">
          <div class="space-y-4">
            <div class="flex items-start p-3 bg-gray-50 rounded-lg">
              <div class="flex-shrink-0 bg-primary-100 rounded-full p-2 mr-3">
                ${getIconSvg('calendar')}
              </div>
              <div class="flex-1">
                <div class="flex justify-between">
                  <h4 class="text-sm font-medium text-gray-800">Diskusi Laporan Akhir</h4>
                  <span class="text-xs text-gray-500">05 Sep 2025</span>
                </div>
                <p class="text-sm text-gray-600 mt-1">Pembimbing: Nama Pembimbing Sekolah</p>
                <p class="text-xs text-gray-500 mt-1">Waktu: 09:00 - 10:00</p>
                <p class="text-xs mt-2">
                  <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Menunggu Konfirmasi</span>
                </p>
              </div>
            </div>
            
            <div class="flex items-start p-3 bg-gray-50 rounded-lg">
              <div class="flex-shrink-0 bg-primary-100 rounded-full p-2 mr-3">
                ${getIconSvg('calendar')}
              </div>
              <div class="flex-1">
                <div class="flex justify-between">
                  <h4 class="text-sm font-medium text-gray-800">Evaluasi Minggu Ke-4</h4>
                  <span class="text-xs text-gray-500">01 Sep 2025</span>
                </div>
                <p class="text-sm text-gray-600 mt-1">Pembimbing: Nama Pembimbing DU/DI</p>
                <p class="text-xs text-gray-500 mt-1">Waktu: 13:00 - 14:00</p>
                <p class="text-xs mt-2">
                  <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Terjadwal</span>
                </p>
              </div>
            </div>
          </div>
          <div class="mt-4 text-right">
            <a href="#" class="text-primary-600 hover:text-primary-800 text-sm font-medium" data-page="${PAGES.CONSULTATIONS}">Lihat Semua &rarr;</a>
          </div>
        </div>
      </div>
    </div>
    
    <div class="mt-6 bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
      <div class="p-4 border-b border-gray-200 bg-gray-50">
        <div class="flex justify-between items-center">
          <h3 class="font-bold text-gray-800">Jurnal Terbaru</h3>
          <a href="#" class="text-primary-600 hover:text-primary-800 text-sm font-medium" data-page="${PAGES.JOURNAL_FORM}">+ Tambah Jurnal</a>
        </div>
      </div>
      <div class="p-4">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th class="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kegiatan</th>
                <th class="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr>
                <td class="py-2 px-3 whitespace-nowrap text-sm text-gray-500">02 Sep 2025</td>
                <td class="py-2 px-3 text-sm text-gray-800">Membuat desain aplikasi...</td>
                <td class="py-2 px-3 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                </td>
                <td class="py-2 px-3 whitespace-nowrap text-sm font-medium">
                  <a href="#" class="text-primary-600 hover:text-primary-800">Lihat</a>
                </td>
              </tr>
              <tr>
                <td class="py-2 px-3 whitespace-nowrap text-sm text-gray-500">01 Sep 2025</td>
                <td class="py-2 px-3 text-sm text-gray-800">Meeting dengan tim...</td>
                <td class="py-2 px-3 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Disetujui</span>
                </td>
                <td class="py-2 px-3 whitespace-nowrap text-sm font-medium">
                  <a href="#" class="text-primary-600 hover:text-primary-800">Lihat</a>
                </td>
              </tr>
              <tr>
                <td class="py-2 px-3 whitespace-nowrap text-sm text-gray-500">31 Agu 2025</td>
                <td class="py-2 px-3 text-sm text-gray-800">Mempelajari dokumentasi...</td>
                <td class="py-2 px-3 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Disetujui</span>
                </td>
                <td class="py-2 px-3 whitespace-nowrap text-sm font-medium">
                  <a href="#" class="text-primary-600 hover:text-primary-800">Lihat</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-4 text-right">
          <a href="#" class="text-primary-600 hover:text-primary-800 text-sm font-medium" data-page="${PAGES.JOURNALS}">Lihat Semua &rarr;</a>
        </div>
      </div>
    </div>
  `;
}

// Add event listeners for dashboard
function addDashboardEventListeners() {
  // Add click event listeners to all dashboard links
  document.querySelectorAll('[data-page]').forEach(link => {
    if (!link.getAttribute('listener')) {
      link.setAttribute('listener', 'true');
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.getAttribute('data-page');
        renderPage(page);
      });
    }
  });
}

// Helper function to get role name
function getRoleName(role) {
  switch(role) {
    case ROLES.ADMIN:
      return 'Administrator';
    case ROLES.SCHOOL_SUPERVISOR:
      return 'Pembimbing Sekolah';
    case ROLES.COMPANY_SUPERVISOR:
      return 'Pembimbing DU/DI';
    case ROLES.STUDENT:
      return 'Siswa';
    default:
      return 'Pengguna';
  }
}
