/**
 * Attendance management functionality
 */

// DOM Elements
const appContainer = document.getElementById('app');

// Get all attendances
function getAllAttendances() {
  return getFromStorage('attendances') || [];
}

// Get attendance by ID
function getAttendanceById(id) {
  const attendances = getAllAttendances();
  return attendances.find(attendance => attendance.id === id);
}

// Render attendances list
function renderAttendanceList() {
  if (!appContainer) return;
  
  const attendances = getAllAttendances();
  const currentUser = getCurrentUser();
  
  // Filter attendances based on user role
  let filteredAttendances = attendances;
  
  if (currentUser.role === 'student') {
    // Only show attendances for this student
    filteredAttendances = attendances.filter(attendance => attendance.studentId === currentUser.studentId);
  } else if (currentUser.role === 'company_supervisor') {
    // Filter attendances for students at this supervisor's company
    const students = getFromStorage('students') || [];
    const studentIds = students
      .filter(student => student.companyId === currentUser.companyId)
      .map(student => student.id);
    
    filteredAttendances = attendances.filter(attendance => studentIds.includes(attendance.studentId));
  } else if (currentUser.role === 'school_supervisor') {
    // Filter attendances for students assigned to this supervisor
    const students = getFromStorage('students') || [];
    const studentIds = students
      .filter(student => student.schoolSupervisorId === currentUser.id)
      .map(student => student.id);
    
    filteredAttendances = attendances.filter(attendance => studentIds.includes(attendance.studentId));
  }
  
  // Group attendances by month
  const groupedAttendances = {};
  
  filteredAttendances.forEach(attendance => {
    const date = new Date(attendance.date);
    const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    
    if (!groupedAttendances[monthYear]) {
      groupedAttendances[monthYear] = [];
    }
    
    groupedAttendances[monthYear].push(attendance);
  });
  
  // Sort months
  const sortedMonths = Object.keys(groupedAttendances).sort().reverse();
  
  const canAddAttendance = currentUser.role === 'student';
  
  appContainer.innerHTML = `
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="text-xl font-bold">Absensi PKL</h3>
        ${canAddAttendance ? `
          <button class="btn btn-primary hover:bg-blue-600 transition-colors" data-page="${PAGES.ATTENDANCE_FORM}">
            <i class="bi bi-plus-circle me-1"></i> Tambah Absensi
          </button>
        ` : ''}
      </div>
      
      <div class="card shadow-lg border-0 mb-4">
        <div class="card-header bg-light py-3">
          <div class="row g-3">
            <div class="col-md-4">
              <div class="input-group">
                <span class="input-group-text bg-white border-end-0">
                  <i class="bi bi-search text-muted"></i>
                </span>
                <input type="text" id="searchAttendance" class="form-control border-start-0 ps-0" placeholder="Cari absensi...">
              </div>
            </div>
            ${currentUser.role !== 'student' ? `
              <div class="col-md-4">
                <select id="filterStudents" class="form-select">
                  <option value="all">Semua Siswa</option>
                  ${(() => {
                    const students = getFromStorage('students') || [];
                    let relevantStudents = [];
                    
                    if (currentUser.role === 'company_supervisor') {
                      relevantStudents = students.filter(s => s.companyId === currentUser.companyId);
                    } else if (currentUser.role === 'school_supervisor') {
                      relevantStudents = students.filter(s => s.schoolSupervisorId === currentUser.id);
                    } else {
                      relevantStudents = students;
                    }
                    
                    return relevantStudents.map(student => 
                      `<option value="${student.id}">${student.firstName} ${student.lastName}</option>`
                    ).join('');
                  })()}
                </select>
              </div>
            ` : ''}
            <div class="col-md-4">
              <input type="month" id="filterMonth" class="form-select" value="${new Date().toISOString().substring(0, 7)}">
            </div>
          </div>
        </div>
        <div class="card-body p-0">
          ${sortedMonths.length > 0 ? `
            <div class="accordion" id="attendanceAccordion">
              ${sortedMonths.map((monthYear, index) => {
                const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                const [year, month] = monthYear.split('-');
                const monthName = monthNames[parseInt(month, 10) - 1];
                const monthTitle = `${monthName} ${year}`;
                
                // Count attendance status
                const totalDays = groupedAttendances[monthYear].length;
                const presentDays = groupedAttendances[monthYear].filter(a => a.status === 'present').length;
                const lateDays = groupedAttendances[monthYear].filter(a => a.status === 'late').length;
                const absentDays = groupedAttendances[monthYear].filter(a => a.status === 'absent').length;
                const permissionDays = groupedAttendances[monthYear].filter(a => a.status === 'permission').length;
                const sickDays = groupedAttendances[monthYear].filter(a => a.status === 'sick').length;
                
                // Sort attendances by date
                const sortedAttendances = groupedAttendances[monthYear].sort((a, b) => 
                  new Date(a.date) - new Date(b.date)
                );
                
                return `
                  <div class="accordion-item border-0">
                    <h2 class="accordion-header" id="heading${monthYear}">
                      <button class="accordion-button ${index !== 0 ? 'collapsed' : ''}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${monthYear}" aria-expanded="${index === 0 ? 'true' : 'false'}" aria-controls="collapse${monthYear}">
                        <div class="d-flex justify-content-between align-items-center w-100 me-3">
                          <span class="fw-bold">${monthTitle}</span>
                          <div>
                            <span class="badge bg-success me-1" title="Hadir">${presentDays}</span>
                            <span class="badge bg-warning text-dark me-1" title="Terlambat">${lateDays}</span>
                            <span class="badge bg-danger me-1" title="Absen">${absentDays}</span>
                            <span class="badge bg-info text-dark me-1" title="Izin">${permissionDays}</span>
                            <span class="badge bg-secondary me-1" title="Sakit">${sickDays}</span>
                          </div>
                        </div>
                      </button>
                    </h2>
                    <div id="collapse${monthYear}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" aria-labelledby="heading${monthYear}" data-bs-parent="#attendanceAccordion">
                      <div class="accordion-body p-0">
                        <div class="table-responsive">
                          <table class="table table-hover align-middle mb-0">
                            <thead class="table-light">
                              <tr>
                                <th>Tanggal</th>
                                ${currentUser.role !== 'student' ? '<th>Siswa</th>' : ''}
                                <th>Status</th>
                                <th>Jam Masuk</th>
                                <th>Jam Keluar</th>
                                <th>Keterangan</th>
                                <th>Verifikasi</th>
                                <th>Aksi</th>
                              </tr>
                            </thead>
                            <tbody>
                              ${sortedAttendances.map(attendance => {
                                // Get student name
                                const students = getFromStorage('students') || [];
                                const student = students.find(s => s.id === attendance.studentId);
                                const studentName = student ? `${student.firstName} ${student.lastName}` : 'Unknown';
                                
                                // Format date
                                const attendanceDate = formatDate(attendance.date);
                                
                                // Status badge
                                let statusBadge = '';
                                switch (attendance.status) {
                                  case 'present':
                                    statusBadge = '<span class="badge bg-success">Hadir</span>';
                                    break;
                                  case 'late':
                                    statusBadge = '<span class="badge bg-warning text-dark">Terlambat</span>';
                                    break;
                                  case 'absent':
                                    statusBadge = '<span class="badge bg-danger">Absen</span>';
                                    break;
                                  case 'permission':
                                    statusBadge = '<span class="badge bg-info text-dark">Izin</span>';
                                    break;
                                  case 'sick':
                                    statusBadge = '<span class="badge bg-secondary">Sakit</span>';
                                    break;
                                  default:
                                    statusBadge = '<span class="badge bg-light text-dark">-</span>';
                                }
                                
                                // Verification status
                                const isVerified = attendance.isVerified;
                                const verificationIcon = isVerified ? 
                                  '<i class="bi bi-check-circle-fill text-success"></i>' : 
                                  '<i class="bi bi-clock text-warning"></i>';
                                
                                return `
                                  <tr class="hover:bg-gray-50">
                                    <td>${attendanceDate}</td>
                                    ${currentUser.role !== 'student' ? `<td>${studentName}</td>` : ''}
                                    <td>${statusBadge}</td>
                                    <td>${attendance.timeIn || '-'}</td>
                                    <td>${attendance.timeOut || '-'}</td>
                                    <td class="text-truncate" style="max-width: 150px;">${attendance.notes || '-'}</td>
                                    <td class="text-center">${verificationIcon}</td>
                                    <td>
                                      <div class="btn-group" role="group">
                                        <button class="btn btn-sm btn-info view-attendance" data-id="${attendance.id}" title="Lihat Detail">
                                          <i class="bi bi-eye"></i>
                                        </button>
                                        ${currentUser.role === 'student' && !attendance.isVerified ? `
                                          <button class="btn btn-sm btn-warning edit-attendance" data-id="${attendance.id}" title="Edit">
                                            <i class="bi bi-pencil"></i>
                                          </button>
                                          <button class="btn btn-sm btn-danger delete-attendance" data-id="${attendance.id}" title="Hapus">
                                            <i class="bi bi-trash"></i>
                                          </button>
                                        ` : ''}
                                      </div>
                                    </td>
                                  </tr>
                                `;
                              }).join('')}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          ` : `
            <div class="text-center py-5">
              <i class="bi bi-calendar-check display-4 text-muted"></i>
              <p class="lead mt-3">Belum ada data absensi PKL.</p>
              ${canAddAttendance ? `
                <button class="btn btn-primary mt-2" data-page="${PAGES.ATTENDANCE_FORM}">
                  <i class="bi bi-plus-circle me-1"></i> Tambah Absensi
                </button>
              ` : ''}
            </div>
          `}
        </div>
      </div>
      
      <!-- Attendance Summary -->
      ${filteredAttendances.length > 0 ? `
        <div class="card shadow-lg border-0 mb-4">
          <div class="card-header bg-white py-3">
            <h5 class="card-title mb-0">Rekap Absensi</h5>
          </div>
          <div class="card-body">
            <div class="row text-center">
              <div class="col-md-2 col-sm-4 col-6 mb-3">
                <div class="p-3 bg-light rounded-3">
                  <h3 class="text-success">${filteredAttendances.filter(a => a.status === 'present').length}</h3>
                  <p class="text-muted mb-0">Hadir</p>
                </div>
              </div>
              <div class="col-md-2 col-sm-4 col-6 mb-3">
                <div class="p-3 bg-light rounded-3">
                  <h3 class="text-warning">${filteredAttendances.filter(a => a.status === 'late').length}</h3>
                  <p class="text-muted mb-0">Terlambat</p>
                </div>
              </div>
              <div class="col-md-2 col-sm-4 col-6 mb-3">
                <div class="p-3 bg-light rounded-3">
                  <h3 class="text-danger">${filteredAttendances.filter(a => a.status === 'absent').length}</h3>
                  <p class="text-muted mb-0">Absen</p>
                </div>
              </div>
              <div class="col-md-2 col-sm-4 col-6 mb-3">
                <div class="p-3 bg-light rounded-3">
                  <h3 class="text-info">${filteredAttendances.filter(a => a.status === 'permission').length}</h3>
                  <p class="text-muted mb-0">Izin</p>
                </div>
              </div>
              <div class="col-md-2 col-sm-4 col-6 mb-3">
                <div class="p-3 bg-light rounded-3">
                  <h3 class="text-secondary">${filteredAttendances.filter(a => a.status === 'sick').length}</h3>
                  <p class="text-muted mb-0">Sakit</p>
                </div>
              </div>
              <div class="col-md-2 col-sm-4 col-6 mb-3">
                <div class="p-3 bg-light rounded-3">
                  <h3 class="text-primary">${filteredAttendances.length}</h3>
                  <p class="text-muted mb-0">Total</p>
                </div>
              </div>
            </div>
            
            <div class="d-flex justify-content-end mt-3">
              <button class="btn btn-primary" id="printAttendanceSummary">
                <i class="bi bi-printer me-1"></i> Cetak Rekap
              </button>
            </div>
          </div>
        </div>
      ` : ''}
    </div>
  `;
  
  // Add event listeners
  if (sortedMonths.length > 0) {
    // View attendance detail
    $('.view-attendance').on('click', function() {
      const attendanceId = $(this).data('id');
      sessionStorage.setItem('currentAttendanceId', attendanceId);
      renderPage(PAGES.ATTENDANCE_DETAIL);
    });
    
    // Edit attendance
    $('.edit-attendance').on('click', function() {
      const attendanceId = $(this).data('id');
      sessionStorage.setItem('currentAttendanceId', attendanceId);
      renderPage(PAGES.ATTENDANCE_FORM);
    });
    
    // Delete attendance
    $('.delete-attendance').on('click', function() {
      const attendanceId = $(this).data('id');
      if (confirm('Apakah Anda yakin ingin menghapus data absensi ini?')) {
        deleteAttendance(attendanceId);
      }
    });
    
    // Search attendance
    $('#searchAttendance').on('input', function() {
      const searchTerm = $(this).val().toLowerCase();
      $('tbody tr').each(function() {
        const text = $(this).text().toLowerCase();
        $(this).toggle(text.includes(searchTerm));
      });
    });
    
    // Filter by student
    $('#filterStudents').on('change', function() {
      const studentId = $(this).val();
      
      if (studentId === 'all') {
        $('#attendanceAccordion .accordion-item').show();
        $('tbody tr').show();
      } else {
        // First, show all accordion items
        $('#attendanceAccordion .accordion-item').show();
        
        // Then filter rows by student ID
        $('tbody tr').each(function() {
          const rowStudentId = $(this).find('.view-attendance').data('student-id');
          $(this).toggle(studentId === 'all' || rowStudentId === studentId);
        });
        
        // Hide empty months
        $('#attendanceAccordion .accordion-item').each(function() {
          const visibleRows = $(this).find('tbody tr:visible').length;
          if (visibleRows === 0) {
            $(this).hide();
          }
        });
      }
    });
    
    // Filter by month
    $('#filterMonth').on('change', function() {
      const monthYear = $(this).val(); // Format: YYYY-MM
      
      if (monthYear) {
        // Hide all accordion items initially
        $('#attendanceAccordion .accordion-item').hide();
        
        // Show only the selected month
        $(`#collapse${monthYear}`).parent().show();
        
        // Expand the selected month
        $(`#collapse${monthYear}`).collapse('show');
      } else {
        // Show all accordion items
        $('#attendanceAccordion .accordion-item').show();
      }
    });
    
    // Print attendance summary
    $('#printAttendanceSummary').on('click', function() {
      const printWindow = window.open('', '_blank');
      const currentUser = getCurrentUser();
      
      let title = 'Rekap Absensi PKL';
      let subtitle = '';
      
      if (currentUser.role === 'student') {
        const students = getFromStorage('students') || [];
        const student = students.find(s => s.id === currentUser.studentId);
        if (student) {
          subtitle = `${student.firstName} ${student.lastName} (${student.className})`;
        }
      }
      
      // Group attendance by month
      const monthlyData = {};
      
      filteredAttendances.forEach(attendance => {
        const date = new Date(attendance.date);
        const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        
        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = {
            present: 0,
            late: 0,
            absent: 0,
            permission: 0,
            sick: 0,
            total: 0
          };
        }
        
        monthlyData[monthYear][attendance.status]++;
        monthlyData[monthYear].total++;
      });
      
      // Sort months
      const sortedMonthKeys = Object.keys(monthlyData).sort();
      
      // Create month names for display
      const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title}</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
          <style>
            body { padding: 20px; }
            @media print {
              .no-print { display: none; }
              .page-break { page-break-after: always; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="no-print text-end mb-3">
              <button class="btn btn-primary" onclick="window.print()">Cetak</button>
            </div>
            
            <div class="text-center mb-4">
              <h3>${title}</h3>
              ${subtitle ? `<h5>${subtitle}</h5>` : ''}
              <p>Periode: ${formatDate(new Date(sortedMonthKeys[0] + '-01'))} - ${formatDate(new Date())}</p>
            </div>
            
            <div class="mb-4">
              <h5>Rekap Kehadiran per Bulan</h5>
              <div class="table-responsive">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th>Bulan</th>
                      <th>Hadir</th>
                      <th>Terlambat</th>
                      <th>Absen</th>
                      <th>Izin</th>
                      <th>Sakit</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${sortedMonthKeys.map(monthKey => {
                      const [year, month] = monthKey.split('-');
                      const monthName = `${monthNames[parseInt(month, 10) - 1]} ${year}`;
                      const data = monthlyData[monthKey];
                      
                      return `
                        <tr>
                          <td>${monthName}</td>
                          <td>${data.present}</td>
                          <td>${data.late}</td>
                          <td>${data.absent}</td>
                          <td>${data.permission}</td>
                          <td>${data.sick}</td>
                          <td>${data.total}</td>
                        </tr>
                      `;
                    }).join('')}
                    <tr class="table-light fw-bold">
                      <td>Total</td>
                      <td>${filteredAttendances.filter(a => a.status === 'present').length}</td>
                      <td>${filteredAttendances.filter(a => a.status === 'late').length}</td>
                      <td>${filteredAttendances.filter(a => a.status === 'absent').length}</td>
                      <td>${filteredAttendances.filter(a => a.status === 'permission').length}</td>
                      <td>${filteredAttendances.filter(a => a.status === 'sick').length}</td>
                      <td>${filteredAttendances.length}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div class="mt-5">
              <p class="text-end">Dicetak pada: ${formatDate(new Date())}</p>
            </div>
          </div>
        </body>
        </html>
      `);
      
      printWindow.document.close();
    });
  }
  
  // Add event listener for "Add Attendance" button
  $('[data-page]').on('click', function(e) {
    e.preventDefault();
    const page = $(this).data('page');
    renderPage(page);
  });
}

// Render attendance form (add/edit)
function renderAttendanceForm() {
  if (!appContainer) return;
  
  const currentUser = getCurrentUser();
  
  // Check permission
  if (currentUser.role !== 'student') {
    showToast('Anda tidak memiliki izin untuk menambah atau mengedit absensi.', 'danger');
    renderPage(PAGES.DASHBOARD);
    return;
  }
  
  // Check if editing existing attendance
  const attendanceId = sessionStorage.getItem('currentAttendanceId');
  const isEditing = !!attendanceId;
  let attendance = {
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    timeIn: '',
    timeOut: '',
    notes: '',
    studentId: currentUser.studentId,
    isVerified: false,
    signature: '',
    verifiedBy: '',
    verificationNotes: ''
  };
  
  if (isEditing) {
    const existingAttendance = getAttendanceById(attendanceId);
    if (existingAttendance) {
      // Check if attendance belongs to this student
      if (existingAttendance.studentId !== currentUser.studentId) {
        showToast('Anda tidak dapat mengedit absensi milik siswa lain.', 'danger');
        renderPage(PAGES.ATTENDANCE);
        return;
      }
      
      // Check if attendance is already verified
      if (existingAttendance.isVerified) {
        showToast('Absensi yang sudah diverifikasi tidak dapat diedit.', 'warning');
        renderPage(PAGES.ATTENDANCE);
        return;
      }
      
      attendance = { ...existingAttendance };
    }
  }
  
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Get current time in HH:MM format
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  // If not editing, set default time in
  if (!isEditing) {
    attendance.timeIn = currentTime;
  }
  
  appContainer.innerHTML = `
    <div class="container">
      <div class="card shadow-lg border-0">
        <div class="card-header bg-white py-3">
          <h3 class="card-title mb-0">${isEditing ? 'Edit' : 'Tambah'} Absensi</h3>
        </div>
        <div class="card-body">
          <form id="attendanceForm" class="needs-validation" novalidate>
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="date" class="form-label">Tanggal</label>
                <input type="date" class="form-control" id="date" value="${attendance.date}" max="${today}" required>
                <div class="invalid-feedback">Tanggal harus diisi dan tidak boleh lebih dari hari ini.</div>
              </div>
              <div class="col-md-6">
                <label for="status" class="form-label">Status Kehadiran</label>
                <select class="form-select" id="status" required>
                  <option value="present" ${attendance.status === 'present' ? 'selected' : ''}>Hadir</option>
                  <option value="late" ${attendance.status === 'late' ? 'selected' : ''}>Terlambat</option>
                  <option value="absent" ${attendance.status === 'absent' ? 'selected' : ''}>Absen</option>
                  <option value="permission" ${attendance.status === 'permission' ? 'selected' : ''}>Izin</option>
                  <option value="sick" ${attendance.status === 'sick' ? 'selected' : ''}>Sakit</option>
                </select>
                <div class="invalid-feedback">Status kehadiran harus dipilih.</div>
              </div>
            </div>
            
            <div class="row mb-3 time-inputs">
              <div class="col-md-6">
                <label for="timeIn" class="form-label">Jam Masuk</label>
                <input type="time" class="form-control" id="timeIn" value="${attendance.timeIn}">
              </div>
              <div class="col-md-6">
                <label for="timeOut" class="form-label">Jam Pulang</label>
                <input type="time" class="form-control" id="timeOut" value="${attendance.timeOut}">
              </div>
            </div>
            
            <div class="mb-3">
              <label for="notes" class="form-label">Keterangan</label>
              <textarea class="form-control" id="notes" rows="3">${attendance.notes}</textarea>
              <small class="text-muted notes-help">Berikan keterangan tambahan jika diperlukan.</small>
            </div>
            
            <div class="alert alert-info" role="alert">
              <i class="bi bi-info-circle-fill me-2"></i>
              Absensi akan dikirim untuk diverifikasi oleh pembimbing DU/DI.
            </div>
            
            <div class="d-flex justify-content-between mt-4">
              <button type="button" class="btn btn-secondary" data-page="${PAGES.ATTENDANCE}">
                <i class="bi bi-arrow-left me-1"></i> Kembali
              </button>
              <button type="submit" class="btn btn-primary">
                <i class="bi bi-save me-1"></i> ${isEditing ? 'Perbarui' : 'Simpan'} Absensi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners
  
  // Toggle time inputs based on status
  $('#status').on('change', function() {
    const status = $(this).val();
    const timeInputs = $('.time-inputs');
    const notesHelp = $('.notes-help');
    
    if (status === 'absent' || status === 'permission' || status === 'sick') {
      timeInputs.slideUp();
      $('#timeIn, #timeOut').prop('required', false);
      
      if (status === 'permission' || status === 'sick') {
        notesHelp.text('Berikan alasan izin/sakit dan lampirkan surat keterangan jika ada.');
      } else {
        notesHelp.text('Berikan keterangan mengapa tidak hadir.');
      }
    } else {
      timeInputs.slideDown();
      $('#timeIn').prop('required', true);
      
      notesHelp.text('Berikan keterangan tambahan jika diperlukan.');
    }
  }).trigger('change');
  
  // Form submission
  $('#attendanceForm').on('submit', function(e) {
    e.preventDefault();
    
    // Check form validity using Bootstrap validation
    if (!this.checkValidity()) {
      e.stopPropagation();
      $(this).addClass('was-validated');
      return;
    }
    
    const status = $('#status').val();
    let timeIn = $('#timeIn').val();
    let timeOut = $('#timeOut').val();
    
    // Clear time values if absent/permission/sick
    if (status === 'absent' || status === 'permission' || status === 'sick') {
      timeIn = '';
      timeOut = '';
    }
    
    // Get form values
    const formData = {
      id: isEditing ? attendance.id : generateId(),
      date: $('#date').val(),
      status,
      timeIn,
      timeOut,
      notes: $('#notes').val(),
      studentId: currentUser.studentId,
      isVerified: false,
      signature: '',
      verifiedBy: '',
      verificationNotes: '',
      createdAt: isEditing ? attendance.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save attendance data
    const attendances = getAllAttendances();
    
    // Check if there's already an attendance for this date and student
    const existingAttendanceIndex = attendances.findIndex(a => 
      a.date === formData.date && 
      a.studentId === formData.studentId &&
      (isEditing ? a.id !== formData.id : true)
    );
    
    if (existingAttendanceIndex !== -1) {
      showToast('Anda sudah memiliki absensi untuk tanggal ini.', 'warning');
      return;
    }
    
    if (isEditing) {
      // Update existing attendance
      const updatedAttendances = attendances.map(a => (a.id === formData.id ? formData : a));
      saveToStorage('attendances', updatedAttendances);
      showToast('Absensi berhasil diperbarui.', 'success');
    } else {
      // Add new attendance
      const newAttendances = [...attendances, formData];
      saveToStorage('attendances', newAttendances);
      showToast('Absensi berhasil ditambahkan.', 'success');
    }
    
    // Clear session storage and go back to attendances list
    sessionStorage.removeItem('currentAttendanceId');
    renderPage(PAGES.ATTENDANCE);
  });
  
  // Add event listener for back button
  $('[data-page]').on('click', function(e) {
    e.preventDefault();
    const page = $(this).data('page');
    sessionStorage.removeItem('currentAttendanceId');
    renderPage(page);
  });
}

// Render attendance detail
function renderAttendanceDetail() {
  if (!appContainer) return;
  
  const attendanceId = sessionStorage.getItem('currentAttendanceId');
  if (!attendanceId) {
    showToast('Data absensi tidak ditemukan.', 'danger');
    renderPage(PAGES.ATTENDANCE);
    return;
  }
  
  const attendance = getAttendanceById(attendanceId);
  if (!attendance) {
    showToast('Data absensi tidak ditemukan.', 'danger');
    renderPage(PAGES.ATTENDANCE);
    return;
  }
  
  // Get student
  const students = getFromStorage('students') || [];
  const student = students.find(s => s.id === attendance.studentId);
  
  // Get company and supervisors
  const companies = getFromStorage('companies') || [];
  const company = companies.find(c => c.id === student?.companyId);
  
  const users = getFromStorage('users') || [];
  const companySupervisor = users.find(u => u.role === 'company_supervisor' && u.companyId === student?.companyId);
  
  const currentUser = getCurrentUser();
  
  // Check if current user can verify this attendance
  const canVerify = currentUser.role === 'company_supervisor' && 
                    currentUser.companyId === student?.companyId && 
                    !attendance.isVerified;
  
  // Status badge
  let statusBadge = '';
  switch (attendance.status) {
    case 'present':
      statusBadge = '<span class="badge bg-success">Hadir</span>';
      break;
    case 'late':
      statusBadge = '<span class="badge bg-warning text-dark">Terlambat</span>';
      break;
    case 'absent':
      statusBadge = '<span class="badge bg-danger">Absen</span>';
      break;
    case 'permission':
      statusBadge = '<span class="badge bg-info text-dark">Izin</span>';
      break;
    case 'sick':
      statusBadge = '<span class="badge bg-secondary">Sakit</span>';
      break;
    default:
      statusBadge = '<span class="badge bg-light text-dark">-</span>';
  }
  
  appContainer.innerHTML = `
    <div class="container">
      <div class="card shadow-lg border-0 mb-4">
        <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h3 class="card-title mb-0">Detail Absensi</h3>
          <div>
            ${currentUser.role === 'student' && attendance.studentId === currentUser.studentId && !attendance.isVerified ? `
              <button class="btn btn-warning me-2" data-action="edit">
                <i class="bi bi-pencil me-1"></i> Edit
              </button>
            ` : ''}
            <button class="btn btn-secondary" data-page="${PAGES.ATTENDANCE}">
              <i class="bi bi-arrow-left me-1"></i> Kembali
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="row mb-4">
            <div class="col-md-8">
              <div class="d-flex align-items-center mb-3">
                <h4 class="fw-bold mb-0">Absensi: ${formatDate(attendance.date)}</h4>
                <div class="ms-3">${statusBadge}</div>
              </div>
              ${student ? `
                <p class="text-muted mb-2">
                  <i class="bi bi-person me-2"></i> ${student.firstName} ${student.lastName} (${student.className})
                </p>
              ` : ''}
              ${company ? `
                <p class="text-muted mb-0">
                  <i class="bi bi-building me-2"></i> ${company.name}
                </p>
              ` : ''}
            </div>
            <div class="col-md-4 text-md-end">
              <div class="badge p-2 mb-2 ${attendance.isVerified ? 'bg-success text-white' : 'bg-warning text-dark'}">
                <i class="bi ${attendance.isVerified ? 'bi-check-circle-fill' : 'bi-clock'} me-1"></i>
                ${attendance.isVerified ? 'Terverifikasi' : 'Menunggu Verifikasi'}
              </div>
              <div class="mt-2">
                <small class="text-muted">Dibuat: ${formatDate(attendance.createdAt)}</small>
                ${attendance.updatedAt !== attendance.createdAt ? `
                  <br><small class="text-muted">Diperbarui: ${formatDate(attendance.updatedAt)}</small>
                ` : ''}
              </div>
            </div>
          </div>
          
          <div class="row">
            <div class="col-md-8">
              <div class="card border-0 shadow-sm mb-4">
                <div class="card-header bg-light">
                  <h5 class="mb-0"><i class="bi bi-info-circle me-2"></i> Informasi Absensi</h5>
                </div>
                <div class="card-body">
                  <div class="row mb-3">
                    <div class="col-md-6">
                      <p class="mb-1 text-muted">Status Kehadiran:</p>
                      <p class="fw-semibold">${statusBadge}</p>
                    </div>
                    <div class="col-md-6">
                      <p class="mb-1 text-muted">Tanggal:</p>
                      <p class="fw-semibold">${formatDate(attendance.date)}</p>
                    </div>
                  </div>
                  
                  ${attendance.status === 'present' || attendance.status === 'late' ? `
                    <div class="row mb-3">
                      <div class="col-md-6">
                        <p class="mb-1 text-muted">Jam Masuk:</p>
                        <p class="fw-semibold">${attendance.timeIn || '-'}</p>
                      </div>
                      <div class="col-md-6">
                        <p class="mb-1 text-muted">Jam Pulang:</p>
                        <p class="fw-semibold">${attendance.timeOut || '-'}</p>
                      </div>
                    </div>
                  ` : ''}
                  
                  <div class="mb-0">
                    <p class="mb-1 text-muted">Keterangan:</p>
                    <p class="fw-semibold whitespace-pre-line">${attendance.notes || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-md-4">
              <div class="card border-0 shadow-sm mb-4">
                <div class="card-header bg-light">
                  <h5 class="mb-0"><i class="bi bi-check-circle me-2"></i> Verifikasi</h5>
                </div>
                <div class="card-body">
                  ${attendance.isVerified ? `
                    <div class="text-center mb-3">
                      <div class="mb-2">
                        ${attendance.signature ? `
                          <img src="${attendance.signature}" alt="Tanda Tangan Pembimbing" class="img-fluid border rounded" style="max-height: 100px;">
                        ` : `
                          <div class="p-3 bg-light rounded">
                            <i class="bi bi-check-circle-fill text-success fs-1"></i>
                          </div>
                        `}
                      </div>
                      <p class="mb-0 fw-bold">${attendance.verifiedBy || 'Pembimbing DU/DI'}</p>
                      <small class="text-muted">Telah memverifikasi</small>
                    </div>
                    ${attendance.verificationNotes ? `
                      <div class="mt-3">
                        <h6>Catatan:</h6>
                        <p class="whitespace-pre-line">${attendance.verificationNotes}</p>
                      </div>
                    ` : ''}
                  ` : `
                    <div class="text-center mb-3">
                      <div class="p-3 bg-light rounded mb-2">
                        <i class="bi bi-clock text-warning fs-1"></i>
                      </div>
                      <p class="mb-0">Belum diverifikasi</p>
                    </div>
                    
                    ${canVerify ? `
                      <form id="verificationForm">
                        <div class="mb-3">
                          <label for="verificationNotes" class="form-label">Catatan Verifikasi:</label>
                          <textarea class="form-control" id="verificationNotes" rows="3"></textarea>
                        </div>
                        
                        <div class="mb-3">
                          <label class="form-label">Tanda Tangan:</label>
                          <div id="signaturePad" class="signature-pad border rounded"></div>
                          <div class="d-flex justify-content-between mt-2">
                            <button type="button" class="btn btn-sm btn-outline-secondary" id="clearSignature">
                              <i class="bi bi-eraser me-1"></i> Hapus
                            </button>
                          </div>
                        </div>
                        
                        <button type="submit" class="btn btn-success w-100">
                          <i class="bi bi-check-circle me-1"></i> Verifikasi Absensi
                        </button>
                      </form>
                    ` : ''}
                  `}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="d-flex justify-content-center mb-5">
        <button class="btn btn-primary" id="printAttendance">
          <i class="bi bi-printer me-1"></i> Cetak Absensi
        </button>
      </div>
    </div>
  `;
  
  // Add event listeners
  
  // Back button
  $('[data-page]').on('click', function(e) {
    e.preventDefault();
    const page = $(this).data('page');
    sessionStorage.removeItem('currentAttendanceId');
    renderPage(page);
  });
  
  // Edit button
  $('[data-action="edit"]').on('click', function() {
    renderPage(PAGES.ATTENDANCE_FORM);
  });
  
  // Initialize signature pad if needed
  if (canVerify) {
    const signaturePad = new SignaturePad(document.getElementById('signaturePad'), {
      backgroundColor: 'rgba(255, 255, 255, 0)',
      penColor: 'black'
    });
    
    $('#clearSignature').on('click', function() {
      signaturePad.clear();
    });
    
    $('#verificationForm').on('submit', function(e) {
      e.preventDefault();
      
      if (signaturePad.isEmpty()) {
        showToast('Silakan tanda tangan terlebih dahulu.', 'warning');
        return;
      }
      
      const verificationNotes = $('#verificationNotes').val();
      const signature = signaturePad.toDataURL();
      
      // Update attendance
      const attendances = getAllAttendances();
      const updatedAttendances = attendances.map(a => {
        if (a.id === attendance.id) {
          return {
            ...a,
            isVerified: true,
            signature,
            verificationNotes,
            verifiedBy: `${currentUser.firstName} ${currentUser.lastName}`,
            updatedAt: new Date().toISOString()
          };
        }
        return a;
      });
      
      saveToStorage('attendances', updatedAttendances);
      showToast('Absensi berhasil diverifikasi.', 'success');
      
      // Refresh page
      renderAttendanceDetail();
    });
  }
  
  // Print attendance
  $('#printAttendance').on('click', function() {
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Absensi PKL - ${formatDate(attendance.date)}</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
        <style>
          body { padding: 20px; }
          .signature-container { border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; }
          @media print {
            .no-print { display: none; }
            .page-break { page-break-after: always; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="no-print text-end mb-3">
            <button class="btn btn-primary" onclick="window.print()">Cetak</button>
          </div>
          
          <div class="text-center mb-4">
            <h3>LEMBAR ABSENSI PKL</h3>
            <h5>SMKN 7 SAMARINDA</h5>
          </div>
          
          <div class="row mb-4">
            <div class="col-6">
              <table class="table table-bordered">
                <tr>
                  <th width="40%">Nama Siswa</th>
                  <td>${student ? `${student.firstName} ${student.lastName}` : '-'}</td>
                </tr>
                <tr>
                  <th>NIS</th>
                  <td>${student ? student.nis : '-'}</td>
                </tr>
                <tr>
                  <th>Kelas</th>
                  <td>${student ? student.className : '-'}</td>
                </tr>
              </table>
            </div>
            <div class="col-6">
              <table class="table table-bordered">
                <tr>
                  <th width="40%">Tempat PKL</th>
                  <td>${company ? company.name : '-'}</td>
                </tr>
                <tr>
                  <th>Tanggal</th>
                  <td>${formatDate(attendance.date)}</td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>${
                    attendance.status === 'present' ? 'Hadir' :
                    attendance.status === 'late' ? 'Terlambat' :
                    attendance.status === 'absent' ? 'Absen' :
                    attendance.status === 'permission' ? 'Izin' :
                    attendance.status === 'sick' ? 'Sakit' : '-'
                  }</td>
                </tr>
              </table>
            </div>
          </div>
          
          ${attendance.status === 'present' || attendance.status === 'late' ? `
            <div class="mb-4">
              <h5>Jam Kehadiran:</h5>
              <div class="row">
                <div class="col-6">
                  <p><strong>Jam Masuk:</strong> ${attendance.timeIn || '-'}</p>
                </div>
                <div class="col-6">
                  <p><strong>Jam Pulang:</strong> ${attendance.timeOut || '-'}</p>
                </div>
              </div>
            </div>
          ` : ''}
          
          <div class="mb-4">
            <h5>Keterangan:</h5>
            <p>${attendance.notes || '-'}</p>
          </div>
          
          <div class="row mt-5">
            <div class="col-6 text-center">
              <h5>Siswa</h5>
              <div class="signature-container">
                <p class="text-muted">Tanda Tangan Siswa</p>
              </div>
              <p class="fw-bold">${student ? `${student.firstName} ${student.lastName}` : '-'}</p>
            </div>
            <div class="col-6 text-center">
              <h5>Pembimbing DU/DI</h5>
              <div class="signature-container">
                ${attendance.signature ? `
                  <img src="${attendance.signature}" alt="Tanda Tangan Pembimbing" style="max-height: 100px;">
                ` : `
                  <p class="text-muted">Belum Ditandatangani</p>
                `}
              </div>
              <p class="fw-bold">${companySupervisor ? `${companySupervisor.firstName} ${companySupervisor.lastName}` : 'Pembimbing DU/DI'}</p>
              ${attendance.verificationNotes ? `
                <div class="text-start mt-2">
                  <p><strong>Catatan:</strong> ${attendance.verificationNotes}</p>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
  });
}

// Delete attendance
function deleteAttendance(attendanceId) {
  if (!attendanceId) return;
  
  // Get all attendances
  const attendances = getAllAttendances();
  
  // Get the attendance to delete
  const attendance = attendances.find(a => a.id === attendanceId);
  
  if (!attendance) {
    showToast('Absensi tidak ditemukan.', 'danger');
    return;
  }
  
  // Check if current user can delete this attendance
  const currentUser = getCurrentUser();
  
  if (currentUser.role !== 'student' || attendance.studentId !== currentUser.studentId) {
    showToast('Anda tidak memiliki izin untuk menghapus absensi ini.', 'danger');
    return;
  }
  
  // Check if attendance is already verified
  if (attendance.isVerified) {
    showToast('Absensi yang sudah diverifikasi tidak dapat dihapus.', 'warning');
    return;
  }
  
  // Remove attendance
  const updatedAttendances = attendances.filter(a => a.id !== attendanceId);
  
  // Save updated attendances
  saveToStorage('attendances', updatedAttendances);
  
  showToast('Absensi berhasil dihapus.', 'success');
  
  // Refresh attendances list
  renderPage(PAGES.ATTENDANCE);
}
