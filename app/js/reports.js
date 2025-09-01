/**
 * Reports generation functionality
 */

// DOM Elements
const appContainer = document.getElementById('app');

// Report types
const REPORT_TYPES = {
  STUDENT_SUMMARY: 'student_summary',
  ATTENDANCE: 'attendance',
  JOURNAL: 'journal',
  CONSULTATION: 'consultation',
  SUPERVISOR_EVALUATION: 'supervisor_evaluation'
};

// Render reports dashboard
function renderReportsDashboard() {
  if (!appContainer) return;
  
  const currentUser = getCurrentUser();
  
  // Determine available report types based on user role
  const availableReports = [];
  
  if (currentUser.role === 'admin' || currentUser.role === 'school_supervisor') {
    availableReports.push({
      id: REPORT_TYPES.STUDENT_SUMMARY,
      title: 'Laporan Ringkasan Siswa',
      description: 'Laporan tentang data umum siswa PKL, tempat PKL, dan pencapaian',
      icon: 'bi-people'
    });
  }
  
  if (currentUser.role === 'admin' || currentUser.role === 'school_supervisor' || currentUser.role === 'company_supervisor') {
    availableReports.push({
      id: REPORT_TYPES.ATTENDANCE,
      title: 'Laporan Kehadiran',
      description: 'Laporan kehadiran siswa PKL selama periode tertentu',
      icon: 'bi-calendar-check'
    });
  }
  
  availableReports.push({
    id: REPORT_TYPES.JOURNAL,
    title: 'Laporan Jurnal Kegiatan',
    description: 'Laporan kegiatan harian siswa selama PKL',
    icon: 'bi-journal-text'
  });
  
  if (currentUser.role !== 'student') {
    availableReports.push({
      id: REPORT_TYPES.CONSULTATION,
      title: 'Laporan Konsultasi',
      description: 'Laporan konsultasi antara siswa dan pembimbing',
      icon: 'bi-chat-dots'
    });
  }
  
  if (currentUser.role === 'company_supervisor' || currentUser.role === 'school_supervisor') {
    availableReports.push({
      id: REPORT_TYPES.SUPERVISOR_EVALUATION,
      title: 'Penilaian Siswa',
      description: 'Form penilaian kinerja siswa PKL',
      icon: 'bi-star'
    });
  }
  
  appContainer.innerHTML = `
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="text-xl font-bold">Laporan</h3>
      </div>
      
      <div class="row">
        ${availableReports.map(report => `
          <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 shadow-lg border-0 hover:shadow-xl transition-shadow">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="me-3 bg-primary text-white p-3 rounded-circle">
                    <i class="bi ${report.icon} fs-4"></i>
                  </div>
                  <h5 class="card-title mb-0">${report.title}</h5>
                </div>
                <p class="card-text text-muted">${report.description}</p>
              </div>
              <div class="card-footer bg-white border-0 pt-0">
                <button class="btn btn-primary w-100 generate-report" data-report-type="${report.id}">
                  <i class="bi bi-file-earmark-pdf me-2"></i> Generate Laporan
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  // Add event listeners
  $('.generate-report').on('click', function() {
    const reportType = $(this).data('report-type');
    renderReportForm(reportType);
  });
}

// Render report form
function renderReportForm(reportType) {
  if (!appContainer) return;
  
  const currentUser = getCurrentUser();
  
  // Report title and fields based on type
  let reportTitle = '';
  let formFields = '';
  
  // Get current date for date inputs
  const today = new Date().toISOString().split('T')[0];
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const defaultStartDate = oneMonthAgo.toISOString().split('T')[0];
  
  // Get all students
  const students = getFromStorage('students') || [];
  
  // Filter students based on user role
  let filteredStudents = students;
  
  if (currentUser.role === 'school_supervisor') {
    // Filter students assigned to this school supervisor
    filteredStudents = students.filter(student => student.schoolSupervisorId === currentUser.id);
  } else if (currentUser.role === 'company_supervisor') {
    // Filter students assigned to this company supervisor
    filteredStudents = students.filter(student => {
      const company = getCompanyById(student.companyId);
      return company && company.supervisorId === currentUser.id;
    });
  } else if (currentUser.role === 'student') {
    // Only show the current student
    filteredStudents = students.filter(student => student.id === currentUser.studentId);
  }
  
  switch (reportType) {
    case REPORT_TYPES.STUDENT_SUMMARY:
      reportTitle = 'Laporan Ringkasan Siswa';
      formFields = `
        <div class="mb-3">
          <label for="reportStudentFilter" class="form-label">Filter Siswa</label>
          <select class="form-select" id="reportStudentFilter">
            <option value="all">Semua Siswa</option>
            <option value="by_class">Filter berdasarkan Kelas</option>
            <option value="by_company">Filter berdasarkan Tempat PKL</option>
          </select>
        </div>
        
        <div class="mb-3 d-none" id="classFilterDiv">
          <label for="classFilter" class="form-label">Pilih Kelas</label>
          <select class="form-select" id="classFilter">
            ${getUniqueClasses().map(className => `
              <option value="${className}">${className}</option>
            `).join('')}
          </select>
        </div>
        
        <div class="mb-3 d-none" id="companyFilterDiv">
          <label for="companyFilter" class="form-label">Pilih Tempat PKL</label>
          <select class="form-select" id="companyFilter">
            ${getUniqueCompanies().map(company => `
              <option value="${company.id}">${company.name}</option>
            `).join('')}
          </select>
        </div>
      `;
      break;
      
    case REPORT_TYPES.ATTENDANCE:
      reportTitle = 'Laporan Kehadiran';
      formFields = `
        <div class="mb-3">
          <label for="studentId" class="form-label">Pilih Siswa</label>
          ${filteredStudents.length > 1 ? `
            <select class="form-select" id="studentId" required>
              <option value="" selected disabled>Pilih Siswa</option>
              ${filteredStudents.map(student => `
                <option value="${student.id}">${student.firstName} ${student.lastName} - ${student.nis}</option>
              `).join('')}
            </select>
          ` : filteredStudents.length === 1 ? `
            <input type="text" class="form-control" value="${filteredStudents[0].firstName} ${filteredStudents[0].lastName} - ${filteredStudents[0].nis}" readonly>
            <input type="hidden" id="studentId" value="${filteredStudents[0].id}">
          ` : `
            <div class="alert alert-warning">
              <i class="bi bi-exclamation-triangle me-2"></i> Tidak ada siswa yang tersedia.
            </div>
          `}
        </div>
        
        <div class="row mb-3">
          <div class="col-md-6">
            <label for="startDate" class="form-label">Tanggal Mulai</label>
            <input type="date" class="form-control" id="startDate" value="${defaultStartDate}" required>
          </div>
          <div class="col-md-6">
            <label for="endDate" class="form-label">Tanggal Selesai</label>
            <input type="date" class="form-control" id="endDate" value="${today}" required>
          </div>
        </div>
      `;
      break;
      
    case REPORT_TYPES.JOURNAL:
      reportTitle = 'Laporan Jurnal Kegiatan';
      formFields = `
        <div class="mb-3">
          <label for="studentId" class="form-label">Pilih Siswa</label>
          ${filteredStudents.length > 1 ? `
            <select class="form-select" id="studentId" required>
              <option value="" selected disabled>Pilih Siswa</option>
              ${filteredStudents.map(student => `
                <option value="${student.id}">${student.firstName} ${student.lastName} - ${student.nis}</option>
              `).join('')}
            </select>
          ` : filteredStudents.length === 1 ? `
            <input type="text" class="form-control" value="${filteredStudents[0].firstName} ${filteredStudents[0].lastName} - ${filteredStudents[0].nis}" readonly>
            <input type="hidden" id="studentId" value="${filteredStudents[0].id}">
          ` : `
            <div class="alert alert-warning">
              <i class="bi bi-exclamation-triangle me-2"></i> Tidak ada siswa yang tersedia.
            </div>
          `}
        </div>
        
        <div class="row mb-3">
          <div class="col-md-6">
            <label for="startDate" class="form-label">Tanggal Mulai</label>
            <input type="date" class="form-control" id="startDate" value="${defaultStartDate}" required>
          </div>
          <div class="col-md-6">
            <label for="endDate" class="form-label">Tanggal Selesai</label>
            <input type="date" class="form-control" id="endDate" value="${today}" required>
          </div>
        </div>
        
        <div class="mb-3">
          <label for="journalStatus" class="form-label">Status Jurnal</label>
          <select class="form-select" id="journalStatus">
            <option value="all">Semua Status</option>
            <option value="approved">Disetujui</option>
            <option value="pending">Menunggu Persetujuan</option>
            <option value="rejected">Ditolak</option>
          </select>
        </div>
      `;
      break;
      
    case REPORT_TYPES.CONSULTATION:
      reportTitle = 'Laporan Konsultasi';
      formFields = `
        <div class="mb-3">
          <label for="studentId" class="form-label">Pilih Siswa</label>
          ${filteredStudents.length > 1 ? `
            <select class="form-select" id="studentId" required>
              <option value="" selected disabled>Pilih Siswa</option>
              ${filteredStudents.map(student => `
                <option value="${student.id}">${student.firstName} ${student.lastName} - ${student.nis}</option>
              `).join('')}
            </select>
          ` : filteredStudents.length === 1 ? `
            <input type="text" class="form-control" value="${filteredStudents[0].firstName} ${filteredStudents[0].lastName} - ${filteredStudents[0].nis}" readonly>
            <input type="hidden" id="studentId" value="${filteredStudents[0].id}">
          ` : `
            <div class="alert alert-warning">
              <i class="bi bi-exclamation-triangle me-2"></i> Tidak ada siswa yang tersedia.
            </div>
          `}
        </div>
        
        <div class="row mb-3">
          <div class="col-md-6">
            <label for="startDate" class="form-label">Tanggal Mulai</label>
            <input type="date" class="form-control" id="startDate" value="${defaultStartDate}" required>
          </div>
          <div class="col-md-6">
            <label for="endDate" class="form-label">Tanggal Selesai</label>
            <input type="date" class="form-control" id="endDate" value="${today}" required>
          </div>
        </div>
        
        <div class="mb-3">
          <label for="consultationType" class="form-label">Jenis Konsultasi</label>
          <select class="form-select" id="consultationType">
            <option value="all">Semua Jenis</option>
            <option value="school">Pembimbing Sekolah</option>
            <option value="company">Pembimbing DU/DI</option>
          </select>
        </div>
        
        <div class="mb-3">
          <label for="consultationStatus" class="form-label">Status Konsultasi</label>
          <select class="form-select" id="consultationStatus">
            <option value="all">Semua Status</option>
            <option value="pending">Menunggu Konfirmasi</option>
            <option value="confirmed">Terjadwal</option>
            <option value="completed">Selesai</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
        </div>
      `;
      break;
      
    case REPORT_TYPES.SUPERVISOR_EVALUATION:
      reportTitle = 'Form Penilaian Siswa';
      formFields = `
        <div class="mb-3">
          <label for="studentId" class="form-label">Pilih Siswa</label>
          ${filteredStudents.length > 1 ? `
            <select class="form-select" id="studentId" required>
              <option value="" selected disabled>Pilih Siswa</option>
              ${filteredStudents.map(student => `
                <option value="${student.id}">${student.firstName} ${student.lastName} - ${student.nis}</option>
              `).join('')}
            </select>
          ` : filteredStudents.length === 1 ? `
            <input type="text" class="form-control" value="${filteredStudents[0].firstName} ${filteredStudents[0].lastName} - ${filteredStudents[0].nis}" readonly>
            <input type="hidden" id="studentId" value="${filteredStudents[0].id}">
          ` : `
            <div class="alert alert-warning">
              <i class="bi bi-exclamation-triangle me-2"></i> Tidak ada siswa yang tersedia.
            </div>
          `}
        </div>
        
        <div class="mb-3">
          <label for="evaluationType" class="form-label">Jenis Penilaian</label>
          <select class="form-select" id="evaluationType" required>
            <option value="" selected disabled>Pilih Jenis Penilaian</option>
            <option value="midterm">Evaluasi Tengah PKL</option>
            <option value="final">Evaluasi Akhir PKL</option>
          </select>
        </div>
      `;
      break;
      
    default:
      reportTitle = 'Generate Laporan';
      formFields = `
        <div class="alert alert-warning">
          <i class="bi bi-exclamation-triangle me-2"></i> Jenis laporan tidak dikenali.
        </div>
      `;
  }
  
  appContainer.innerHTML = `
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card shadow-lg border-0">
            <div class="card-header bg-white py-3">
              <div class="d-flex justify-content-between align-items-center">
                <h3 class="card-title mb-0">${reportTitle}</h3>
                <button class="btn btn-secondary" data-page="${PAGES.REPORTS}">
                  <i class="bi bi-arrow-left me-1"></i> Kembali
                </button>
              </div>
            </div>
            <div class="card-body">
              <form id="reportForm" class="needs-validation" novalidate>
                <input type="hidden" id="reportType" value="${reportType}">
                
                ${formFields}
                
                <div class="mb-3">
                  <label for="reportFormat" class="form-label">Format Laporan</label>
                  <select class="form-select" id="reportFormat" required>
                    <option value="pdf" selected>PDF</option>
                    <option value="print">Print Preview</option>
                  </select>
                </div>
                
                <div class="d-grid mt-4">
                  <button type="submit" class="btn btn-primary">
                    <i class="bi bi-file-earmark-pdf me-1"></i> Generate Laporan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners
  
  // Toggle filters for student summary report
  if (reportType === REPORT_TYPES.STUDENT_SUMMARY) {
    $('#reportStudentFilter').on('change', function() {
      const filterType = $(this).val();
      
      $('#classFilterDiv').addClass('d-none');
      $('#companyFilterDiv').addClass('d-none');
      
      if (filterType === 'by_class') {
        $('#classFilterDiv').removeClass('d-none');
      } else if (filterType === 'by_company') {
        $('#companyFilterDiv').removeClass('d-none');
      }
    });
  }
  
  // Form submission
  $('#reportForm').on('submit', function(e) {
    e.preventDefault();
    
    // Check form validity using Bootstrap validation
    if (!this.checkValidity()) {
      e.stopPropagation();
      $(this).addClass('was-validated');
      return;
    }
    
    // Get form values
    const reportData = {
      type: $('#reportType').val(),
      format: $('#reportFormat').val()
    };
    
    // Get additional fields based on report type
    switch (reportData.type) {
      case REPORT_TYPES.STUDENT_SUMMARY:
        reportData.filterType = $('#reportStudentFilter').val();
        
        if (reportData.filterType === 'by_class') {
          reportData.className = $('#classFilter').val();
        } else if (reportData.filterType === 'by_company') {
          reportData.companyId = $('#companyFilter').val();
        }
        break;
        
      case REPORT_TYPES.ATTENDANCE:
      case REPORT_TYPES.JOURNAL:
      case REPORT_TYPES.CONSULTATION:
        reportData.studentId = $('#studentId').val();
        reportData.startDate = $('#startDate').val();
        reportData.endDate = $('#endDate').val();
        
        if (reportData.type === REPORT_TYPES.JOURNAL) {
          reportData.journalStatus = $('#journalStatus').val();
        } else if (reportData.type === REPORT_TYPES.CONSULTATION) {
          reportData.consultationType = $('#consultationType').val();
          reportData.consultationStatus = $('#consultationStatus').val();
        }
        break;
        
      case REPORT_TYPES.SUPERVISOR_EVALUATION:
        reportData.studentId = $('#studentId').val();
        reportData.evaluationType = $('#evaluationType').val();
        break;
    }
    
    // Generate and show the report
    generateReport(reportData);
  });
  
  // Back button
  $('[data-page]').on('click', function(e) {
    e.preventDefault();
    const page = $(this).data('page');
    renderPage(page);
  });
}

// Generate report based on data
function generateReport(reportData) {
  if (!reportData || !reportData.type) return;
  
  // Initialize report content
  let reportTitle = '';
  let reportContent = '';
  
  // Get school information
  const schoolName = 'SMKN 7 Samarinda';
  const schoolAddress = 'Jl. Soekarno-Hatta Km. 3,5, Samarinda';
  const schoolLogo = 'assets/images/logo.png'; // Placeholder
  
  // Generate current date
  const currentDate = formatDate(new Date().toISOString().split('T')[0]);
  
  // Generate report content based on type
  switch (reportData.type) {
    case REPORT_TYPES.STUDENT_SUMMARY:
      reportTitle = 'Laporan Ringkasan Siswa PKL';
      reportContent = generateStudentSummaryReport(reportData);
      break;
      
    case REPORT_TYPES.ATTENDANCE:
      reportTitle = 'Laporan Kehadiran Siswa PKL';
      reportContent = generateAttendanceReport(reportData);
      break;
      
    case REPORT_TYPES.JOURNAL:
      reportTitle = 'Laporan Jurnal Kegiatan PKL';
      reportContent = generateJournalReport(reportData);
      break;
      
    case REPORT_TYPES.CONSULTATION:
      reportTitle = 'Laporan Konsultasi PKL';
      reportContent = generateConsultationReport(reportData);
      break;
      
    case REPORT_TYPES.SUPERVISOR_EVALUATION:
      reportTitle = 'Form Penilaian Siswa PKL';
      reportContent = generateEvaluationForm(reportData);
      break;
      
    default:
      reportTitle = 'Laporan';
      reportContent = '<p class="text-center">Jenis laporan tidak tersedia.</p>';
  }
  
  // Create report window
  const reportWindow = window.open('', '_blank');
  
  // Create report HTML
  const reportHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${reportTitle}</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
      <style>
        body { 
          font-family: Arial, sans-serif; 
          padding: 20px;
        }
        .report-header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
        }
        .logo-img {
          max-height: 70px;
          margin-bottom: 15px;
        }
        .page-break { 
          page-break-after: always; 
        }
        .signature-section {
          margin-top: 50px;
        }
        .signature-box {
          height: 80px;
          border-bottom: 1px solid #333;
          margin-bottom: 10px;
        }
        @media print {
          .no-print { 
            display: none; 
          }
          button {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="no-print text-end mb-3">
          <button class="btn btn-primary" onclick="window.print()">Cetak</button>
        </div>
        
        <div class="report-header">
          <div class="row align-items-center">
            <div class="col-2 text-end">
              <img src="${schoolLogo}" class="logo-img" alt="${schoolName}" onerror="this.style.display='none'">
            </div>
            <div class="col-8">
              <h4 class="mb-1">${schoolName}</h4>
              <p class="mb-1">${schoolAddress}</p>
              <h3 class="mt-3">${reportTitle}</h3>
            </div>
            <div class="col-2">
              <!-- Placeholder for another logo if needed -->
            </div>
          </div>
        </div>
        
        ${reportContent}
        
        <div class="text-end mt-5">
          <p>Samarinda, ${currentDate}</p>
          <div class="signature-box"></div>
          <p>${getCurrentUser().firstName} ${getCurrentUser().lastName}</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  // Write to the window
  reportWindow.document.write(reportHTML);
  reportWindow.document.close();
  
  // Auto print if format is PDF
  if (reportData.format === 'pdf') {
    setTimeout(() => {
      reportWindow.print();
    }, 1000);
  }
}

// Generate student summary report
function generateStudentSummaryReport(reportData) {
  // Get all students
  const students = getFromStorage('students') || [];
  
  // Filter students based on report data
  let filteredStudents = students;
  
  if (reportData.filterType === 'by_class' && reportData.className) {
    filteredStudents = students.filter(student => student.className === reportData.className);
  } else if (reportData.filterType === 'by_company' && reportData.companyId) {
    filteredStudents = students.filter(student => student.companyId === reportData.companyId);
  }
  
  // Get companies
  const companies = getFromStorage('companies') || [];
  
  // Get users (for supervisors)
  const users = getFromStorage('users') || [];
  
  // Sort students by class and name
  filteredStudents.sort((a, b) => {
    if (a.className === b.className) {
      return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
    }
    return a.className.localeCompare(b.className);
  });
  
  // Generate report content
  return `
    <div class="mb-4">
      <h5>Ringkasan:</h5>
      <table class="table table-bordered">
        <tr>
          <th width="200">Total Siswa</th>
          <td>${filteredStudents.length} siswa</td>
        </tr>
        <tr>
          <th>Jumlah Kelas</th>
          <td>${getUniqueValues(filteredStudents, 'className').length} kelas</td>
        </tr>
        <tr>
          <th>Jumlah Tempat PKL</th>
          <td>${getUniqueValues(filteredStudents, 'companyId').length} tempat</td>
        </tr>
        <tr>
          <th>Filter</th>
          <td>
            ${reportData.filterType === 'by_class' ? `Kelas: ${reportData.className}` : 
              reportData.filterType === 'by_company' ? `Tempat PKL: ${companies.find(c => c.id === reportData.companyId)?.name || 'Unknown'}` : 
              'Semua Siswa'}
          </td>
        </tr>
      </table>
    </div>
    
    <h5>Daftar Siswa:</h5>
    <table class="table table-bordered table-striped">
      <thead class="table-light">
        <tr>
          <th>No</th>
          <th>NIS</th>
          <th>Nama Siswa</th>
          <th>Kelas</th>
          <th>Tempat PKL</th>
          <th>Pembimbing Sekolah</th>
        </tr>
      </thead>
      <tbody>
        ${filteredStudents.length > 0 ? filteredStudents.map((student, index) => {
          // Get company
          const company = companies.find(c => c.id === student.companyId);
          
          // Get school supervisor
          const supervisor = users.find(u => u.id === student.schoolSupervisorId);
          
          return `
            <tr>
              <td>${index + 1}</td>
              <td>${student.nis}</td>
              <td>${student.firstName} ${student.lastName}</td>
              <td>${student.className}</td>
              <td>${company ? company.name : '-'}</td>
              <td>${supervisor ? `${supervisor.firstName} ${supervisor.lastName}` : '-'}</td>
            </tr>
          `;
        }).join('') : `
          <tr>
            <td colspan="6" class="text-center">Tidak ada data siswa yang sesuai dengan filter.</td>
          </tr>
        `}
      </tbody>
    </table>
    
    ${filteredStudents.length > 0 && reportData.filterType !== 'by_company' ? `
      <div class="mt-5">
        <h5>Distribusi Siswa per Tempat PKL:</h5>
        <table class="table table-bordered">
          <thead class="table-light">
            <tr>
              <th>No</th>
              <th>Nama Perusahaan/Instansi</th>
              <th>Alamat</th>
              <th>Jumlah Siswa</th>
            </tr>
          </thead>
          <tbody>
            ${(() => {
              // Count students per company
              const companyStudentCount = {};
              
              filteredStudents.forEach(student => {
                if (student.companyId) {
                  companyStudentCount[student.companyId] = (companyStudentCount[student.companyId] || 0) + 1;
                }
              });
              
              // Generate table rows
              return Object.keys(companyStudentCount).map((companyId, index) => {
                const company = companies.find(c => c.id === companyId);
                
                return company ? `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${company.name}</td>
                    <td>${company.address}</td>
                    <td>${companyStudentCount[companyId]} siswa</td>
                  </tr>
                ` : '';
              }).join('');
            })()}
          </tbody>
        </table>
      </div>
    ` : ''}
  `;
}

// Generate attendance report
function generateAttendanceReport(reportData) {
  // Get student
  const students = getFromStorage('students') || [];
  const student = students.find(s => s.id === reportData.studentId);
  
  if (!student) {
    return `<div class="alert alert-danger">Data siswa tidak ditemukan.</div>`;
  }
  
  // Get company
  const companies = getFromStorage('companies') || [];
  const company = companies.find(c => c.id === student.companyId);
  
  // Get all attendance records
  const attendanceRecords = getFromStorage('attendance') || [];
  
  // Filter attendance records for this student and date range
  const filteredRecords = attendanceRecords.filter(record => 
    record.studentId === reportData.studentId &&
    record.date >= reportData.startDate &&
    record.date <= reportData.endDate
  );
  
  // Sort records by date
  filteredRecords.sort((a, b) => a.date.localeCompare(b.date));
  
  // Calculate statistics
  const totalDays = filteredRecords.length;
  const presentDays = filteredRecords.filter(record => record.status === 'present').length;
  const lateDays = filteredRecords.filter(record => record.status === 'late').length;
  const absentDays = filteredRecords.filter(record => record.status === 'absent').length;
  const permitDays = filteredRecords.filter(record => record.status === 'permit').length;
  const sickDays = filteredRecords.filter(record => record.status === 'sick').length;
  
  // Calculate attendance percentage
  const attendancePercentage = totalDays > 0 ? 
    Math.round(((presentDays + lateDays) / totalDays) * 100) : 0;
  
  // Generate report content
  return `
    <div class="mb-4">
      <h5>Data Siswa:</h5>
      <table class="table table-bordered">
        <tr>
          <th width="200">Nama Siswa</th>
          <td>${student.firstName} ${student.lastName}</td>
        </tr>
        <tr>
          <th>NIS</th>
          <td>${student.nis}</td>
        </tr>
        <tr>
          <th>Kelas</th>
          <td>${student.className}</td>
        </tr>
        <tr>
          <th>Tempat PKL</th>
          <td>${company ? company.name : '-'}</td>
        </tr>
        <tr>
          <th>Periode Laporan</th>
          <td>${formatDate(reportData.startDate)} s/d ${formatDate(reportData.endDate)}</td>
        </tr>
      </table>
    </div>
    
    <div class="mb-4">
      <h5>Ringkasan Kehadiran:</h5>
      <div class="row">
        <div class="col-md-6">
          <table class="table table-bordered">
            <tr>
              <th>Total Hari</th>
              <td>${totalDays} hari</td>
            </tr>
            <tr>
              <th>Hadir</th>
              <td>${presentDays} hari</td>
            </tr>
            <tr>
              <th>Terlambat</th>
              <td>${lateDays} hari</td>
            </tr>
            <tr>
              <th>Tidak Hadir</th>
              <td>${absentDays} hari</td>
            </tr>
            <tr>
              <th>Izin</th>
              <td>${permitDays} hari</td>
            </tr>
            <tr>
              <th>Sakit</th>
              <td>${sickDays} hari</td>
            </tr>
            <tr>
              <th>Persentase Kehadiran</th>
              <td>${attendancePercentage}%</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    
    <h5>Detail Kehadiran:</h5>
    <table class="table table-bordered table-striped">
      <thead class="table-light">
        <tr>
          <th>No</th>
          <th>Tanggal</th>
          <th>Hari</th>
          <th>Status</th>
          <th>Jam Masuk</th>
          <th>Jam Keluar</th>
          <th>Keterangan</th>
        </tr>
      </thead>
      <tbody>
        ${filteredRecords.length > 0 ? filteredRecords.map((record, index) => {
          // Get day of week
          const date = new Date(record.date);
          const dayOfWeek = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(date);
          
          // Format status
          let statusText = '';
          switch (record.status) {
            case 'present':
              statusText = 'Hadir';
              break;
            case 'late':
              statusText = 'Terlambat';
              break;
            case 'absent':
              statusText = 'Tidak Hadir';
              break;
            case 'permit':
              statusText = 'Izin';
              break;
            case 'sick':
              statusText = 'Sakit';
              break;
            default:
              statusText = record.status;
          }
          
          return `
            <tr>
              <td>${index + 1}</td>
              <td>${formatDate(record.date)}</td>
              <td>${dayOfWeek}</td>
              <td>${statusText}</td>
              <td>${record.timeIn || '-'}</td>
              <td>${record.timeOut || '-'}</td>
              <td>${record.notes || '-'}</td>
            </tr>
          `;
        }).join('') : `
          <tr>
            <td colspan="7" class="text-center">Tidak ada data kehadiran pada periode yang dipilih.</td>
          </tr>
        `}
      </tbody>
    </table>
  `;
}

// Generate journal report
function generateJournalReport(reportData) {
  // Get student
  const students = getFromStorage('students') || [];
  const student = students.find(s => s.id === reportData.studentId);
  
  if (!student) {
    return `<div class="alert alert-danger">Data siswa tidak ditemukan.</div>`;
  }
  
  // Get company
  const companies = getFromStorage('companies') || [];
  const company = companies.find(c => c.id === student.companyId);
  
  // Get all journal entries
  const journals = getFromStorage('journals') || [];
  
  // Filter journal entries for this student and date range
  let filteredJournals = journals.filter(journal => 
    journal.studentId === reportData.studentId &&
    journal.date >= reportData.startDate &&
    journal.date <= reportData.endDate
  );
  
  // Filter by status if specified
  if (reportData.journalStatus !== 'all') {
    filteredJournals = filteredJournals.filter(journal => journal.status === reportData.journalStatus);
  }
  
  // Sort journals by date
  filteredJournals.sort((a, b) => a.date.localeCompare(b.date));
  
  // Get users (for supervisors)
  const users = getFromStorage('users') || [];
  const supervisor = users.find(u => u.id === student.schoolSupervisorId);
  
  // Generate report content
  return `
    <div class="mb-4">
      <h5>Data Siswa:</h5>
      <table class="table table-bordered">
        <tr>
          <th width="200">Nama Siswa</th>
          <td>${student.firstName} ${student.lastName}</td>
        </tr>
        <tr>
          <th>NIS</th>
          <td>${student.nis}</td>
        </tr>
        <tr>
          <th>Kelas</th>
          <td>${student.className}</td>
        </tr>
        <tr>
          <th>Tempat PKL</th>
          <td>${company ? company.name : '-'}</td>
        </tr>
        <tr>
          <th>Pembimbing</th>
          <td>${supervisor ? `${supervisor.firstName} ${supervisor.lastName}` : '-'}</td>
        </tr>
        <tr>
          <th>Periode Laporan</th>
          <td>${formatDate(reportData.startDate)} s/d ${formatDate(reportData.endDate)}</td>
        </tr>
      </table>
    </div>
    
    <div class="mb-4">
      <h5>Ringkasan Jurnal:</h5>
      <table class="table table-bordered">
        <tr>
          <th width="200">Total Entri Jurnal</th>
          <td>${filteredJournals.length} entri</td>
        </tr>
        <tr>
          <th>Jurnal Disetujui</th>
          <td>${filteredJournals.filter(j => j.status === 'approved').length} entri</td>
        </tr>
        <tr>
          <th>Jurnal Menunggu</th>
          <td>${filteredJournals.filter(j => j.status === 'pending').length} entri</td>
        </tr>
        <tr>
          <th>Jurnal Ditolak</th>
          <td>${filteredJournals.filter(j => j.status === 'rejected').length} entri</td>
        </tr>
      </table>
    </div>
    
    <h5>Detail Jurnal Kegiatan:</h5>
    ${filteredJournals.length > 0 ? filteredJournals.map((journal, index) => {
      // Get day of week
      const date = new Date(journal.date);
      const dayOfWeek = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(date);
      
      // Format status
      let statusText = '';
      let statusClass = '';
      switch (journal.status) {
        case 'approved':
          statusText = 'Disetujui';
          statusClass = 'text-success';
          break;
        case 'pending':
          statusText = 'Menunggu';
          statusClass = 'text-warning';
          break;
        case 'rejected':
          statusText = 'Ditolak';
          statusClass = 'text-danger';
          break;
        default:
          statusText = journal.status;
      }
      
      return `
        <div class="card mb-4">
          <div class="card-header bg-light">
            <div class="d-flex justify-content-between align-items-center">
              <span>
                <strong>Tanggal:</strong> ${formatDate(journal.date)} (${dayOfWeek})
              </span>
              <span class="${statusClass}">
                <strong>Status:</strong> ${statusText}
              </span>
            </div>
          </div>
          <div class="card-body">
            <h6>Kegiatan:</h6>
            <p class="whitespace-pre-line">${journal.activities}</p>
            
            ${journal.learningOutcomes ? `
              <h6>Hasil Pembelajaran:</h6>
              <p class="whitespace-pre-line">${journal.learningOutcomes}</p>
            ` : ''}
            
            ${journal.challenges ? `
              <h6>Tantangan/Masalah:</h6>
              <p class="whitespace-pre-line">${journal.challenges}</p>
            ` : ''}
            
            ${journal.solutions ? `
              <h6>Solusi:</h6>
              <p class="whitespace-pre-line">${journal.solutions}</p>
            ` : ''}
            
            ${journal.feedback ? `
              <h6>Feedback Pembimbing:</h6>
              <p class="whitespace-pre-line">${journal.feedback}</p>
            ` : ''}
          </div>
        </div>
      `;
    }).join('') : `
      <div class="alert alert-info">
        <i class="bi bi-info-circle me-2"></i> Tidak ada data jurnal pada periode yang dipilih.
      </div>
    `}
  `;
}

// Generate consultation report
function generateConsultationReport(reportData) {
  // Get student
  const students = getFromStorage('students') || [];
  const student = students.find(s => s.id === reportData.studentId);
  
  if (!student) {
    return `<div class="alert alert-danger">Data siswa tidak ditemukan.</div>`;
  }
  
  // Get company
  const companies = getFromStorage('companies') || [];
  const company = companies.find(c => c.id === student.companyId);
  
  // Get all consultations
  const consultations = getFromStorage('consultations') || [];
  
  // Filter consultations for this student and date range
  let filteredConsultations = consultations.filter(consultation => 
    consultation.studentId === reportData.studentId &&
    consultation.date >= reportData.startDate &&
    consultation.date <= reportData.endDate
  );
  
  // Filter by type if specified
  if (reportData.consultationType !== 'all') {
    filteredConsultations = filteredConsultations.filter(consultation => 
      consultation.consultationType === reportData.consultationType
    );
  }
  
  // Filter by status if specified
  if (reportData.consultationStatus !== 'all') {
    filteredConsultations = filteredConsultations.filter(consultation => 
      consultation.status === reportData.consultationStatus
    );
  }
  
  // Sort consultations by date
  filteredConsultations.sort((a, b) => a.date.localeCompare(b.date));
  
  // Get users (for supervisors)
  const users = getFromStorage('users') || [];
  const schoolSupervisor = users.find(u => u.id === student.schoolSupervisorId);
  
  // Generate report content
  return `
    <div class="mb-4">
      <h5>Data Siswa:</h5>
      <table class="table table-bordered">
        <tr>
          <th width="200">Nama Siswa</th>
          <td>${student.firstName} ${student.lastName}</td>
        </tr>
        <tr>
          <th>NIS</th>
          <td>${student.nis}</td>
        </tr>
        <tr>
          <th>Kelas</th>
          <td>${student.className}</td>
        </tr>
        <tr>
          <th>Tempat PKL</th>
          <td>${company ? company.name : '-'}</td>
        </tr>
        <tr>
          <th>Pembimbing Sekolah</th>
          <td>${schoolSupervisor ? `${schoolSupervisor.firstName} ${schoolSupervisor.lastName}` : '-'}</td>
        </tr>
        <tr>
          <th>Periode Laporan</th>
          <td>${formatDate(reportData.startDate)} s/d ${formatDate(reportData.endDate)}</td>
        </tr>
      </table>
    </div>
    
    <div class="mb-4">
      <h5>Ringkasan Konsultasi:</h5>
      <table class="table table-bordered">
        <tr>
          <th width="200">Total Konsultasi</th>
          <td>${filteredConsultations.length} konsultasi</td>
        </tr>
        <tr>
          <th>Konsultasi Selesai</th>
          <td>${filteredConsultations.filter(c => c.status === 'completed').length} konsultasi</td>
        </tr>
        <tr>
          <th>Konsultasi Terjadwal</th>
          <td>${filteredConsultations.filter(c => c.status === 'confirmed').length} konsultasi</td>
        </tr>
        <tr>
          <th>Konsultasi Menunggu</th>
          <td>${filteredConsultations.filter(c => c.status === 'pending').length} konsultasi</td>
        </tr>
        <tr>
          <th>Konsultasi Dibatalkan</th>
          <td>${filteredConsultations.filter(c => c.status === 'cancelled').length} konsultasi</td>
        </tr>
      </table>
    </div>
    
    <h5>Detail Konsultasi:</h5>
    <table class="table table-bordered table-striped">
      <thead class="table-light">
        <tr>
          <th>No</th>
          <th>Tanggal</th>
          <th>Waktu</th>
          <th>Jenis</th>
          <th>Judul</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${filteredConsultations.length > 0 ? filteredConsultations.map((consultation, index) => {
          // Format consultation type
          const typeText = consultation.consultationType === 'school' ? 'Pembimbing Sekolah' : 'Pembimbing DU/DI';
          
          // Format status
          let statusText = '';
          switch (consultation.status) {
            case 'pending':
              statusText = 'Menunggu Konfirmasi';
              break;
            case 'confirmed':
              statusText = 'Terjadwal';
              break;
            case 'completed':
              statusText = 'Selesai';
              break;
            case 'cancelled':
              statusText = 'Dibatalkan';
              break;
            default:
              statusText = consultation.status;
          }
          
          return `
            <tr>
              <td>${index + 1}</td>
              <td>${formatDate(consultation.date)}</td>
              <td>${consultation.time}</td>
              <td>${typeText}</td>
              <td>${consultation.title}</td>
              <td>${statusText}</td>
            </tr>
          `;
        }).join('') : `
          <tr>
            <td colspan="6" class="text-center">Tidak ada data konsultasi pada periode yang dipilih.</td>
          </tr>
        `}
      </tbody>
    </table>
    
    ${filteredConsultations.filter(c => c.status === 'completed').length > 0 ? `
      <h5 class="mt-5">Detail Hasil Konsultasi:</h5>
      ${filteredConsultations.filter(c => c.status === 'completed').map((consultation, index) => {
        // Get supervisor name
        let supervisorName = '';
        if (consultation.consultationType === 'school') {
          const supervisor = users.find(u => u.id === consultation.schoolSupervisorId);
          supervisorName = supervisor ? `${supervisor.firstName} ${supervisor.lastName}` : 'Pembimbing Sekolah';
        } else {
          const supervisor = users.find(u => u.id === consultation.companySupervisorId);
          supervisorName = supervisor ? `${supervisor.firstName} ${supervisor.lastName}` : 'Pembimbing DU/DI';
        }
        
        return `
          <div class="card mb-4">
            <div class="card-header bg-light">
              <div class="d-flex justify-content-between align-items-center">
                <span>
                  <strong>${index + 1}. ${consultation.title}</strong>
                </span>
                <span>
                  ${formatDate(consultation.date)}, ${consultation.time}
                </span>
              </div>
            </div>
            <div class="card-body">
              <p><strong>Pembimbing:</strong> ${supervisorName} (${consultation.consultationType === 'school' ? 'Sekolah' : 'DU/DI'})</p>
              
              <h6>Topik Konsultasi:</h6>
              <p class="whitespace-pre-line">${consultation.description}</p>
              
              <h6>Hasil Konsultasi:</h6>
              <p class="whitespace-pre-line">${consultation.result || 'Tidak ada hasil yang dicatat.'}</p>
              
              ${consultation.notes ? `
                <h6>Catatan Tambahan:</h6>
                <p class="whitespace-pre-line">${consultation.notes}</p>
              ` : ''}
            </div>
          </div>
        `;
      }).join('')}
    ` : ''}
  `;
}

// Generate evaluation form
function generateEvaluationForm(reportData) {
  // Get student
  const students = getFromStorage('students') || [];
  const student = students.find(s => s.id === reportData.studentId);
  
  if (!student) {
    return `<div class="alert alert-danger">Data siswa tidak ditemukan.</div>`;
  }
  
  // Get company
  const companies = getFromStorage('companies') || [];
  const company = companies.find(c => c.id === student.companyId);
  
  // Get current user (supervisor)
  const currentUser = getCurrentUser();
  
  // Determine evaluation type
  const evaluationTitle = reportData.evaluationType === 'midterm' ? 
    'FORM PENILAIAN TENGAH PKL' : 'FORM PENILAIAN AKHIR PKL';
  
  // Generate report content
  return `
    <div class="mb-4 text-center">
      <h4>${evaluationTitle}</h4>
      <p>Periode Praktik Kerja Lapangan (PKL) Tahun 2023</p>
    </div>
    
    <div class="mb-4">
      <h5>Data Siswa:</h5>
      <table class="table table-bordered">
        <tr>
          <th width="200">Nama Siswa</th>
          <td>${student.firstName} ${student.lastName}</td>
        </tr>
        <tr>
          <th>NIS</th>
          <td>${student.nis}</td>
        </tr>
        <tr>
          <th>Kelas/Jurusan</th>
          <td>${student.className}</td>
        </tr>
        <tr>
          <th>Tempat PKL</th>
          <td>${company ? company.name : '-'}</td>
        </tr>
        <tr>
          <th>Alamat PKL</th>
          <td>${company ? company.address : '-'}</td>
        </tr>
      </table>
    </div>
    
    <div class="mb-4">
      <h5>Aspek Penilaian:</h5>
      <p class="text-muted small">Petunjuk: Beri nilai pada setiap aspek dengan skala 1-100</p>
      
      <table class="table table-bordered">
        <thead class="table-light">
          <tr>
            <th width="50">No</th>
            <th>Aspek yang Dinilai</th>
            <th width="100">Nilai (1-100)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Disiplin dan Kehadiran</td>
            <td></td>
          </tr>
          <tr>
            <td>2</td>
            <td>Tanggung Jawab</td>
            <td></td>
          </tr>
          <tr>
            <td>3</td>
            <td>Inisiatif dan Kreativitas</td>
            <td></td>
          </tr>
          <tr>
            <td>4</td>
            <td>Kemampuan Berkomunikasi</td>
            <td></td>
          </tr>
          <tr>
            <td>5</td>
            <td>Kemampuan Bekerja Sama</td>
            <td></td>
          </tr>
          <tr>
            <td>6</td>
            <td>Keterampilan Praktis</td>
            <td></td>
          </tr>
          <tr>
            <td>7</td>
            <td>Penguasaan Teori</td>
            <td></td>
          </tr>
          <tr>
            <td>8</td>
            <td>Kerapian dan Ketelitian</td>
            <td></td>
          </tr>
          <tr>
            <td>9</td>
            <td>Etika dan Sopan Santun</td>
            <td></td>
          </tr>
          <tr>
            <td>10</td>
            <td>Kemampuan Adaptasi</td>
            <td></td>
          </tr>
          <tr class="table-light">
            <th colspan="2" class="text-end">Total Nilai:</th>
            <td></td>
          </tr>
          <tr class="table-light">
            <th colspan="2" class="text-end">Nilai Rata-rata:</th>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="mb-4">
      <h5>Keterangan Nilai:</h5>
      <table class="table table-bordered">
        <tr>
          <th width="150">91 - 100</th>
          <td>Sangat Baik</td>
        </tr>
        <tr>
          <th>81 - 90</th>
          <td>Baik</td>
        </tr>
        <tr>
          <th>71 - 80</th>
          <td>Cukup</td>
        </tr>
        <tr>
          <th>61 - 70</th>
          <td>Kurang</td>
        </tr>
        <tr>
          <th>≤ 60</th>
          <td>Sangat Kurang</td>
        </tr>
      </table>
    </div>
    
    <div class="mb-4">
      <h5>Catatan/Saran untuk Siswa:</h5>
      <div class="border p-3 mb-3 bg-light" style="min-height: 100px;"></div>
    </div>
    
    <div class="row signature-section">
      <div class="col-6">
        <p>Mengetahui,<br>Pembimbing Sekolah</p>
        <div class="signature-box"></div>
        <p>${currentUser.role === 'school_supervisor' ? `${currentUser.firstName} ${currentUser.lastName}` : '................................'}</p>
      </div>
      <div class="col-6 text-end">
        <p>Samarinda, ${formatDate(new Date().toISOString().split('T')[0])}<br>Pembimbing DU/DI</p>
        <div class="signature-box"></div>
        <p>${currentUser.role === 'company_supervisor' ? `${currentUser.firstName} ${currentUser.lastName}` : '................................'}</p>
      </div>
    </div>
  `;
}

// Helper function to get unique values from array
function getUniqueValues(arr, key) {
  return [...new Set(arr.map(item => item[key]))];
}

// Helper function to get unique classes
function getUniqueClasses() {
  const students = getFromStorage('students') || [];
  return [...new Set(students.map(student => student.className))].sort();
}

// Helper function to get unique companies
function getUniqueCompanies() {
  const companies = getFromStorage('companies') || [];
  return companies.sort((a, b) => a.name.localeCompare(b.name));
}
