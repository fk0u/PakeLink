/**
 * Consultations management functionality
 */

// DOM Elements
const appContainer = document.getElementById('app');

// Get all consultations
function getAllConsultations() {
  return getFromStorage('consultations') || [];
}

// Get consultation by ID
function getConsultationById(id) {
  const consultations = getAllConsultations();
  return consultations.find(consultation => consultation.id === id);
}

// Render consultations list
function renderConsultationsList() {
  if (!appContainer) return;
  
  const consultations = getAllConsultations();
  const currentUser = getCurrentUser();
  
  // Filter consultations based on user role
  let filteredConsultations = consultations;
  
  if (currentUser.role === 'student') {
    // Only show consultations for this student
    filteredConsultations = consultations.filter(consultation => consultation.studentId === currentUser.studentId);
  } else if (currentUser.role === 'company_supervisor') {
    // Filter consultations where this user is the company supervisor
    filteredConsultations = consultations.filter(consultation => consultation.companySupervisorId === currentUser.id);
  } else if (currentUser.role === 'school_supervisor') {
    // Filter consultations where this user is the school supervisor
    filteredConsultations = consultations.filter(consultation => consultation.schoolSupervisorId === currentUser.id);
  }
  
  // Sort consultations by date (newest first)
  filteredConsultations.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  const canAddConsultation = currentUser.role === 'student';
  
  appContainer.innerHTML = `
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="text-xl font-bold">Konsultasi Pembimbing</h3>
        ${canAddConsultation ? `
          <button class="btn btn-primary hover:bg-blue-600 transition-colors" data-page="${PAGES.CONSULTATION_FORM}">
            <i class="bi bi-plus-circle me-1"></i> Ajukan Konsultasi
          </button>
        ` : ''}
      </div>
      
      <div class="row">
        <div class="col-lg-8">
          <div class="card shadow-lg border-0 mb-4">
            <div class="card-header bg-light py-3">
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="input-group">
                    <span class="input-group-text bg-white border-end-0">
                      <i class="bi bi-search text-muted"></i>
                    </span>
                    <input type="text" id="searchConsultations" class="form-control border-start-0 ps-0" placeholder="Cari konsultasi...">
                  </div>
                </div>
                <div class="col-md-6">
                  <select id="filterStatus" class="form-select">
                    <option value="all">Semua Status</option>
                    <option value="pending">Menunggu Konfirmasi</option>
                    <option value="confirmed">Terjadwal</option>
                    <option value="completed">Selesai</option>
                    <option value="cancelled">Dibatalkan</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="card-body p-0">
              ${filteredConsultations.length > 0 ? `
                <div class="list-group list-group-flush">
                  ${filteredConsultations.map(consultation => {
                    // Get student name
                    const students = getFromStorage('students') || [];
                    const student = students.find(s => s.id === consultation.studentId);
                    const studentName = student ? `${student.firstName} ${student.lastName}` : 'Unknown';
                    
                    // Get supervisor name based on type
                    const users = getFromStorage('users') || [];
                    let supervisorName = '';
                    
                    if (consultation.consultationType === 'school') {
                      const supervisor = users.find(u => u.id === consultation.schoolSupervisorId);
                      supervisorName = supervisor ? `${supervisor.firstName} ${supervisor.lastName}` : 'Pembimbing Sekolah';
                    } else {
                      const supervisor = users.find(u => u.id === consultation.companySupervisorId);
                      supervisorName = supervisor ? `${supervisor.firstName} ${supervisor.lastName}` : 'Pembimbing DU/DI';
                    }
                    
                    // Format date and time
                    const consultationDate = formatDate(consultation.date);
                    
                    // Status badge
                    let statusBadge = '';
                    switch (consultation.status) {
                      case 'pending':
                        statusBadge = '<span class="badge bg-warning text-dark">Menunggu Konfirmasi</span>';
                        break;
                      case 'confirmed':
                        statusBadge = '<span class="badge bg-primary">Terjadwal</span>';
                        break;
                      case 'completed':
                        statusBadge = '<span class="badge bg-success">Selesai</span>';
                        break;
                      case 'cancelled':
                        statusBadge = '<span class="badge bg-danger">Dibatalkan</span>';
                        break;
                      default:
                        statusBadge = '<span class="badge bg-light text-dark">-</span>';
                    }
                    
                    return `
                      <div class="list-group-item list-group-item-action p-3 hover:bg-gray-50 consultation-item" data-id="${consultation.id}" data-status="${consultation.status}">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                          <h5 class="mb-0 fw-semibold">${consultation.title}</h5>
                          ${statusBadge}
                        </div>
                        <div class="d-flex text-muted mb-2 small">
                          <div class="me-3">
                            <i class="bi bi-calendar me-1"></i> ${consultationDate}
                          </div>
                          <div class="me-3">
                            <i class="bi bi-clock me-1"></i> ${consultation.time}
                          </div>
                          <div>
                            <i class="${consultation.consultationType === 'school' ? 'bi bi-mortarboard' : 'bi bi-building'} me-1"></i>
                            ${consultation.consultationType === 'school' ? 'Sekolah' : 'DU/DI'}
                          </div>
                        </div>
                        <div class="mb-2">
                          <p class="mb-0 text-truncate">${consultation.description}</p>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                          <div>
                            ${currentUser.role !== 'student' ? `
                              <span class="text-muted small">
                                <i class="bi bi-person me-1"></i> ${studentName}
                              </span>
                            ` : `
                              <span class="text-muted small">
                                <i class="bi bi-person-badge me-1"></i> ${supervisorName}
                              </span>
                            `}
                          </div>
                          <div class="btn-group">
                            <button class="btn btn-sm btn-info view-consultation" data-id="${consultation.id}" title="Lihat Detail">
                              <i class="bi bi-eye"></i>
                            </button>
                            ${currentUser.role === 'student' && consultation.status === 'pending' ? `
                              <button class="btn btn-sm btn-warning edit-consultation" data-id="${consultation.id}" title="Edit">
                                <i class="bi bi-pencil"></i>
                              </button>
                              <button class="btn btn-sm btn-danger cancel-consultation" data-id="${consultation.id}" title="Batalkan">
                                <i class="bi bi-x-circle"></i>
                              </button>
                            ` : ''}
                            ${(currentUser.role === 'company_supervisor' && consultation.companySupervisorId === currentUser.id && consultation.status === 'pending') || 
                              (currentUser.role === 'school_supervisor' && consultation.schoolSupervisorId === currentUser.id && consultation.status === 'pending') ? `
                              <button class="btn btn-sm btn-success confirm-consultation" data-id="${consultation.id}" title="Konfirmasi">
                                <i class="bi bi-check-circle"></i>
                              </button>
                              <button class="btn btn-sm btn-danger reject-consultation" data-id="${consultation.id}" title="Tolak">
                                <i class="bi bi-x-circle"></i>
                              </button>
                            ` : ''}
                            ${(currentUser.role === 'company_supervisor' && consultation.companySupervisorId === currentUser.id && consultation.status === 'confirmed') || 
                              (currentUser.role === 'school_supervisor' && consultation.schoolSupervisorId === currentUser.id && consultation.status === 'confirmed') ? `
                              <button class="btn btn-sm btn-success complete-consultation" data-id="${consultation.id}" title="Selesai">
                                <i class="bi bi-check2-all"></i>
                              </button>
                            ` : ''}
                          </div>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              ` : `
                <div class="text-center py-5">
                  <i class="bi bi-chat-dots display-4 text-muted"></i>
                  <p class="lead mt-3">Belum ada data konsultasi.</p>
                  ${canAddConsultation ? `
                    <button class="btn btn-primary mt-2" data-page="${PAGES.CONSULTATION_FORM}">
                      <i class="bi bi-plus-circle me-1"></i> Ajukan Konsultasi
                    </button>
                  ` : ''}
                </div>
              `}
            </div>
          </div>
        </div>
        
        <div class="col-lg-4">
          <!-- Upcoming Consultations -->
          <div class="card shadow-lg border-0 mb-4">
            <div class="card-header bg-white py-3">
              <h5 class="card-title mb-0">Konsultasi Akan Datang</h5>
            </div>
            <div class="card-body p-0">
              <div class="list-group list-group-flush">
                ${(() => {
                  const upcomingConsultations = filteredConsultations.filter(c => 
                    c.status === 'confirmed' && new Date(`${c.date} ${c.time}`) >= new Date()
                  ).sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`)).slice(0, 3);
                  
                  if (upcomingConsultations.length === 0) {
                    return `
                      <div class="list-group-item text-center py-4">
                        <i class="bi bi-calendar-x text-muted fs-4"></i>
                        <p class="mb-0 mt-2">Tidak ada konsultasi terjadwal.</p>
                      </div>
                    `;
                  }
                  
                  return upcomingConsultations.map(consultation => {
                    // Get student name
                    const students = getFromStorage('students') || [];
                    const student = students.find(s => s.id === consultation.studentId);
                    const studentName = student ? `${student.firstName} ${student.lastName}` : 'Unknown';
                    
                    // Get supervisor name based on type
                    const users = getFromStorage('users') || [];
                    let supervisorName = '';
                    
                    if (consultation.consultationType === 'school') {
                      const supervisor = users.find(u => u.id === consultation.schoolSupervisorId);
                      supervisorName = supervisor ? `${supervisor.firstName} ${supervisor.lastName}` : 'Pembimbing Sekolah';
                    } else {
                      const supervisor = users.find(u => u.id === consultation.companySupervisorId);
                      supervisorName = supervisor ? `${supervisor.firstName} ${supervisor.lastName}` : 'Pembimbing DU/DI';
                    }
                    
                    return `
                      <div class="list-group-item list-group-item-action p-3 hover:bg-gray-50 view-consultation" data-id="${consultation.id}">
                        <div class="d-flex align-items-center">
                          <div class="me-3 bg-primary text-white rounded-3 p-2 text-center" style="width: 45px; height: 45px">
                            <i class="${consultation.consultationType === 'school' ? 'bi bi-mortarboard' : 'bi bi-building'}"></i>
                          </div>
                          <div>
                            <h6 class="mb-0">${consultation.title}</h6>
                            <div class="text-muted small">
                              ${formatDate(consultation.date)}, ${consultation.time}
                            </div>
                            <div class="text-muted small">
                              ${currentUser.role === 'student' ? supervisorName : studentName}
                            </div>
                          </div>
                        </div>
                      </div>
                    `;
                  }).join('');
                })()}
              </div>
            </div>
          </div>
          
          <!-- Consultation Statistics -->
          ${filteredConsultations.length > 0 ? `
            <div class="card shadow-lg border-0 mb-4">
              <div class="card-header bg-white py-3">
                <h5 class="card-title mb-0">Statistik Konsultasi</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-6 mb-3">
                    <div class="text-center p-3 bg-light rounded-3">
                      <h3 class="text-primary">${filteredConsultations.length}</h3>
                      <p class="text-muted mb-0">Total</p>
                    </div>
                  </div>
                  <div class="col-6 mb-3">
                    <div class="text-center p-3 bg-light rounded-3">
                      <h3 class="text-success">${filteredConsultations.filter(c => c.status === 'completed').length}</h3>
                      <p class="text-muted mb-0">Selesai</p>
                    </div>
                  </div>
                  <div class="col-6 mb-3">
                    <div class="text-center p-3 bg-light rounded-3">
                      <h3 class="text-warning">${filteredConsultations.filter(c => c.status === 'pending').length}</h3>
                      <p class="text-muted mb-0">Menunggu</p>
                    </div>
                  </div>
                  <div class="col-6 mb-3">
                    <div class="text-center p-3 bg-light rounded-3">
                      <h3 class="text-danger">${filteredConsultations.filter(c => c.status === 'cancelled').length}</h3>
                      <p class="text-muted mb-0">Dibatalkan</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners
  if (filteredConsultations.length > 0) {
    // View consultation detail
    $('.view-consultation').on('click', function() {
      const consultationId = $(this).data('id');
      sessionStorage.setItem('currentConsultationId', consultationId);
      renderPage(PAGES.CONSULTATION_DETAIL);
    });
    
    // Edit consultation
    $('.edit-consultation').on('click', function() {
      const consultationId = $(this).data('id');
      sessionStorage.setItem('currentConsultationId', consultationId);
      renderPage(PAGES.CONSULTATION_FORM);
    });
    
    // Cancel consultation
    $('.cancel-consultation').on('click', function() {
      const consultationId = $(this).data('id');
      if (confirm('Apakah Anda yakin ingin membatalkan konsultasi ini?')) {
        updateConsultationStatus(consultationId, 'cancelled');
      }
    });
    
    // Confirm consultation
    $('.confirm-consultation').on('click', function() {
      const consultationId = $(this).data('id');
      if (confirm('Konfirmasi jadwal konsultasi ini?')) {
        updateConsultationStatus(consultationId, 'confirmed');
      }
    });
    
    // Reject consultation
    $('.reject-consultation').on('click', function() {
      const consultationId = $(this).data('id');
      if (confirm('Tolak permintaan konsultasi ini?')) {
        updateConsultationStatus(consultationId, 'cancelled');
      }
    });
    
    // Complete consultation
    $('.complete-consultation').on('click', function() {
      const consultationId = $(this).data('id');
      if (confirm('Tandai konsultasi ini sebagai selesai?')) {
        updateConsultationStatus(consultationId, 'completed');
      }
    });
    
    // Search consultations
    $('#searchConsultations').on('input', function() {
      const searchTerm = $(this).val().toLowerCase();
      $('.consultation-item').each(function() {
        const text = $(this).text().toLowerCase();
        $(this).toggle(text.includes(searchTerm));
      });
    });
    
    // Filter by status
    $('#filterStatus').on('change', function() {
      const status = $(this).val();
      
      $('.consultation-item').each(function() {
        if (status === 'all') {
          $(this).show();
        } else {
          const itemStatus = $(this).data('status');
          $(this).toggle(itemStatus === status);
        }
      });
    });
  }
  
  // Add event listener for "Add Consultation" button
  $('[data-page]').on('click', function(e) {
    e.preventDefault();
    const page = $(this).data('page');
    renderPage(page);
  });
}

// Render consultation form (add/edit)
function renderConsultationForm() {
  if (!appContainer) return;
  
  const currentUser = getCurrentUser();
  
  // Check permission
  if (currentUser.role !== 'student') {
    showToast('Anda tidak memiliki izin untuk mengajukan konsultasi.', 'danger');
    renderPage(PAGES.DASHBOARD);
    return;
  }
  
  // Check if editing existing consultation
  const consultationId = sessionStorage.getItem('currentConsultationId');
  const isEditing = !!consultationId;
  let consultation = {
    title: '',
    description: '',
    consultationType: '',
    date: '',
    time: '',
    studentId: currentUser.studentId,
    schoolSupervisorId: '',
    companySupervisorId: '',
    status: 'pending',
    result: '',
    notes: ''
  };
  
  if (isEditing) {
    const existingConsultation = getConsultationById(consultationId);
    if (existingConsultation) {
      // Check if consultation belongs to this student
      if (existingConsultation.studentId !== currentUser.studentId) {
        showToast('Anda tidak dapat mengedit konsultasi milik siswa lain.', 'danger');
        renderPage(PAGES.CONSULTATIONS);
        return;
      }
      
      // Check if consultation status is still pending
      if (existingConsultation.status !== 'pending') {
        showToast('Hanya konsultasi dengan status menunggu yang dapat diedit.', 'warning');
        renderPage(PAGES.CONSULTATIONS);
        return;
      }
      
      consultation = { ...existingConsultation };
    }
  }
  
  // Get student data
  const students = getFromStorage('students') || [];
  const student = students.find(s => s.id === currentUser.studentId);
  
  if (!student) {
    showToast('Data siswa tidak ditemukan.', 'danger');
    renderPage(PAGES.DASHBOARD);
    return;
  }
  
  // Get supervisors
  const users = getFromStorage('users') || [];
  const schoolSupervisor = users.find(u => u.id === student.schoolSupervisorId);
  
  // Get company supervisors
  const companySupervisors = users.filter(u => 
    u.role === 'company_supervisor' && u.companyId === student.companyId
  );
  
  // Get min date (today)
  const today = new Date().toISOString().split('T')[0];
  
  appContainer.innerHTML = `
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card shadow-lg border-0">
            <div class="card-header bg-white py-3">
              <h3 class="card-title mb-0">${isEditing ? 'Edit' : 'Ajukan'} Konsultasi</h3>
            </div>
            <div class="card-body">
              <form id="consultationForm" class="needs-validation" novalidate>
                <div class="mb-3">
                  <label for="consultationType" class="form-label">Jenis Konsultasi</label>
                  <select class="form-select" id="consultationType" required>
                    <option value="" selected disabled>Pilih Jenis Konsultasi</option>
                    <option value="school" ${consultation.consultationType === 'school' ? 'selected' : ''}>Pembimbing Sekolah</option>
                    <option value="company" ${consultation.consultationType === 'company' ? 'selected' : ''}>Pembimbing DU/DI</option>
                  </select>
                  <div class="invalid-feedback">Jenis konsultasi harus dipilih.</div>
                </div>
                
                <div id="schoolSupervisorField" class="mb-3 ${consultation.consultationType !== 'school' ? 'd-none' : ''}">
                  <label for="schoolSupervisorId" class="form-label">Pembimbing Sekolah</label>
                  ${schoolSupervisor ? `
                    <input type="text" class="form-control" value="${schoolSupervisor.firstName} ${schoolSupervisor.lastName}" readonly>
                    <input type="hidden" id="schoolSupervisorId" value="${schoolSupervisor.id}">
                  ` : `
                    <div class="alert alert-warning">
                      <i class="bi bi-exclamation-triangle me-2"></i> Anda belum memiliki pembimbing sekolah.
                    </div>
                  `}
                </div>
                
                <div id="companySupervisorField" class="mb-3 ${consultation.consultationType !== 'company' ? 'd-none' : ''}">
                  <label for="companySupervisorId" class="form-label">Pembimbing DU/DI</label>
                  ${companySupervisors.length > 0 ? `
                    <select class="form-select" id="companySupervisorId">
                      ${companySupervisors.map(supervisor => `
                        <option value="${supervisor.id}" ${consultation.companySupervisorId === supervisor.id ? 'selected' : ''}>
                          ${supervisor.firstName} ${supervisor.lastName}
                        </option>
                      `).join('')}
                    </select>
                  ` : `
                    <div class="alert alert-warning">
                      <i class="bi bi-exclamation-triangle me-2"></i> Anda belum memiliki pembimbing DU/DI.
                    </div>
                  `}
                </div>
                
                <div class="mb-3">
                  <label for="title" class="form-label">Judul Konsultasi</label>
                  <input type="text" class="form-control" id="title" value="${consultation.title}" required>
                  <div class="invalid-feedback">Judul konsultasi harus diisi.</div>
                </div>
                
                <div class="mb-3">
                  <label for="description" class="form-label">Deskripsi</label>
                  <textarea class="form-control" id="description" rows="4" required>${consultation.description}</textarea>
                  <div class="invalid-feedback">Deskripsi harus diisi.</div>
                  <small class="text-muted">Jelaskan secara detail apa yang ingin dikonsultasikan.</small>
                </div>
                
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label for="date" class="form-label">Tanggal Konsultasi</label>
                    <input type="date" class="form-control" id="date" min="${today}" value="${consultation.date}" required>
                    <div class="invalid-feedback">Tanggal konsultasi harus diisi.</div>
                  </div>
                  <div class="col-md-6">
                    <label for="time" class="form-label">Jam Konsultasi</label>
                    <input type="time" class="form-control" id="time" value="${consultation.time}" required>
                    <div class="invalid-feedback">Jam konsultasi harus diisi.</div>
                  </div>
                </div>
                
                <div class="alert alert-info" role="alert">
                  <i class="bi bi-info-circle-fill me-2"></i>
                  Pengajuan konsultasi Anda akan dikirim ke pembimbing untuk dikonfirmasi.
                </div>
                
                <div class="d-flex justify-content-between mt-4">
                  <button type="button" class="btn btn-secondary" data-page="${PAGES.CONSULTATIONS}">
                    <i class="bi bi-arrow-left me-1"></i> Kembali
                  </button>
                  <button type="submit" class="btn btn-primary">
                    <i class="bi bi-save me-1"></i> ${isEditing ? 'Perbarui' : 'Ajukan'} Konsultasi
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
  
  // Toggle supervisor fields based on consultation type
  $('#consultationType').on('change', function() {
    const type = $(this).val();
    
    if (type === 'school') {
      $('#schoolSupervisorField').removeClass('d-none');
      $('#companySupervisorField').addClass('d-none');
    } else if (type === 'company') {
      $('#schoolSupervisorField').addClass('d-none');
      $('#companySupervisorField').removeClass('d-none');
    }
  });
  
  // Form submission
  $('#consultationForm').on('submit', function(e) {
    e.preventDefault();
    
    // Check form validity using Bootstrap validation
    if (!this.checkValidity()) {
      e.stopPropagation();
      $(this).addClass('was-validated');
      return;
    }
    
    const consultationType = $('#consultationType').val();
    let schoolSupervisorId = '';
    let companySupervisorId = '';
    
    if (consultationType === 'school') {
      schoolSupervisorId = $('#schoolSupervisorId').val();
      if (!schoolSupervisorId) {
        showToast('Anda belum memiliki pembimbing sekolah.', 'warning');
        return;
      }
    } else if (consultationType === 'company') {
      companySupervisorId = $('#companySupervisorId').val();
      if (!companySupervisorId) {
        showToast('Anda belum memiliki pembimbing DU/DI.', 'warning');
        return;
      }
    }
    
    // Get form values
    const formData = {
      id: isEditing ? consultation.id : generateId(),
      title: $('#title').val(),
      description: $('#description').val(),
      consultationType,
      date: $('#date').val(),
      time: $('#time').val(),
      studentId: currentUser.studentId,
      schoolSupervisorId,
      companySupervisorId,
      status: 'pending',
      result: '',
      notes: '',
      createdAt: isEditing ? consultation.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save consultation data
    const consultations = getAllConsultations();
    
    if (isEditing) {
      // Update existing consultation
      const updatedConsultations = consultations.map(c => (c.id === formData.id ? formData : c));
      saveToStorage('consultations', updatedConsultations);
      showToast('Konsultasi berhasil diperbarui.', 'success');
    } else {
      // Add new consultation
      const newConsultations = [...consultations, formData];
      saveToStorage('consultations', newConsultations);
      showToast('Konsultasi berhasil diajukan.', 'success');
    }
    
    // Clear session storage and go back to consultations list
    sessionStorage.removeItem('currentConsultationId');
    renderPage(PAGES.CONSULTATIONS);
  });
  
  // Add event listener for back button
  $('[data-page]').on('click', function(e) {
    e.preventDefault();
    const page = $(this).data('page');
    sessionStorage.removeItem('currentConsultationId');
    renderPage(page);
  });
}

// Render consultation detail
function renderConsultationDetail() {
  if (!appContainer) return;
  
  const consultationId = sessionStorage.getItem('currentConsultationId');
  if (!consultationId) {
    showToast('Data konsultasi tidak ditemukan.', 'danger');
    renderPage(PAGES.CONSULTATIONS);
    return;
  }
  
  const consultation = getConsultationById(consultationId);
  if (!consultation) {
    showToast('Data konsultasi tidak ditemukan.', 'danger');
    renderPage(PAGES.CONSULTATIONS);
    return;
  }
  
  // Get student
  const students = getFromStorage('students') || [];
  const student = students.find(s => s.id === consultation.studentId);
  
  // Get supervisors
  const users = getFromStorage('users') || [];
  const schoolSupervisor = users.find(u => u.id === consultation.schoolSupervisorId);
  const companySupervisor = users.find(u => u.id === consultation.companySupervisorId);
  
  const currentUser = getCurrentUser();
  
  // Status badge
  let statusBadge = '';
  let statusClass = '';
  switch (consultation.status) {
    case 'pending':
      statusBadge = 'Menunggu Konfirmasi';
      statusClass = 'bg-warning text-dark';
      break;
    case 'confirmed':
      statusBadge = 'Terjadwal';
      statusClass = 'bg-primary text-white';
      break;
    case 'completed':
      statusBadge = 'Selesai';
      statusClass = 'bg-success text-white';
      break;
    case 'cancelled':
      statusBadge = 'Dibatalkan';
      statusClass = 'bg-danger text-white';
      break;
    default:
      statusBadge = '-';
      statusClass = 'bg-light text-dark';
  }
  
  // Check if current user can edit this consultation
  const canEdit = currentUser.role === 'student' && 
                  consultation.studentId === currentUser.studentId && 
                  consultation.status === 'pending';
  
  // Check if current user can update this consultation status
  const canUpdateStatus = (currentUser.role === 'company_supervisor' && 
                          consultation.companySupervisorId === currentUser.id && 
                          (consultation.status === 'pending' || consultation.status === 'confirmed')) || 
                          (currentUser.role === 'school_supervisor' && 
                          consultation.schoolSupervisorId === currentUser.id && 
                          (consultation.status === 'pending' || consultation.status === 'confirmed'));
  
  appContainer.innerHTML = `
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-10">
          <div class="card shadow-lg border-0 mb-4">
            <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
              <h3 class="card-title mb-0">Detail Konsultasi</h3>
              <div>
                ${canEdit ? `
                  <button class="btn btn-warning me-2" data-action="edit">
                    <i class="bi bi-pencil me-1"></i> Edit
                  </button>
                ` : ''}
                <button class="btn btn-secondary" data-page="${PAGES.CONSULTATIONS}">
                  <i class="bi bi-arrow-left me-1"></i> Kembali
                </button>
              </div>
            </div>
            <div class="card-body">
              <div class="row mb-4">
                <div class="col-md-8">
                  <h4 class="fw-bold text-primary mb-3">${consultation.title}</h4>
                  <div class="d-flex flex-wrap align-items-center mb-3">
                    <span class="badge ${statusClass} me-2 mb-2 py-2 px-3">${statusBadge}</span>
                    <span class="badge bg-secondary me-2 mb-2 py-2 px-3">
                      <i class="${consultation.consultationType === 'school' ? 'bi bi-mortarboard' : 'bi bi-building'} me-1"></i>
                      ${consultation.consultationType === 'school' ? 'Pembimbing Sekolah' : 'Pembimbing DU/DI'}
                    </span>
                  </div>
                  <p class="text-muted mb-2">
                    <i class="bi bi-calendar me-2"></i> ${formatDate(consultation.date)}
                  </p>
                  <p class="text-muted mb-2">
                    <i class="bi bi-clock me-2"></i> ${consultation.time}
                  </p>
                </div>
                <div class="col-md-4 text-md-end">
                  <div class="mt-2">
                    <small class="text-muted">Dibuat: ${formatDate(consultation.createdAt)}</small>
                    ${consultation.updatedAt !== consultation.createdAt ? `
                      <br><small class="text-muted">Diperbarui: ${formatDate(consultation.updatedAt)}</small>
                    ` : ''}
                  </div>
                </div>
              </div>
              
              <div class="row mb-4">
                <div class="col-md-6">
                  <div class="card border-0 shadow-sm mb-4">
                    <div class="card-header bg-light">
                      <h5 class="mb-0"><i class="bi bi-person me-2"></i> Siswa</h5>
                    </div>
                    <div class="card-body">
                      ${student ? `
                        <p class="mb-1"><strong>Nama:</strong> ${student.firstName} ${student.lastName}</p>
                        <p class="mb-1"><strong>NIS:</strong> ${student.nis}</p>
                        <p class="mb-0"><strong>Kelas:</strong> ${student.className}</p>
                      ` : `
                        <p class="text-muted">Data siswa tidak ditemukan.</p>
                      `}
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card border-0 shadow-sm mb-4">
                    <div class="card-header bg-light">
                      <h5 class="mb-0">
                        <i class="${consultation.consultationType === 'school' ? 'bi bi-mortarboard' : 'bi bi-building'} me-2"></i> 
                        Pembimbing ${consultation.consultationType === 'school' ? 'Sekolah' : 'DU/DI'}
                      </h5>
                    </div>
                    <div class="card-body">
                      ${consultation.consultationType === 'school' && schoolSupervisor ? `
                        <p class="mb-1"><strong>Nama:</strong> ${schoolSupervisor.firstName} ${schoolSupervisor.lastName}</p>
                        <p class="mb-1"><strong>Email:</strong> ${schoolSupervisor.email}</p>
                        <p class="mb-0"><strong>Telepon:</strong> ${schoolSupervisor.phone || '-'}</p>
                      ` : consultation.consultationType === 'company' && companySupervisor ? `
                        <p class="mb-1"><strong>Nama:</strong> ${companySupervisor.firstName} ${companySupervisor.lastName}</p>
                        <p class="mb-1"><strong>Email:</strong> ${companySupervisor.email}</p>
                        <p class="mb-0"><strong>Telepon:</strong> ${companySupervisor.phone || '-'}</p>
                      ` : `
                        <p class="text-muted">Data pembimbing tidak ditemukan.</p>
                      `}
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="card border-0 shadow-sm mb-4">
                <div class="card-header bg-light">
                  <h5 class="mb-0"><i class="bi bi-chat-dots me-2"></i> Deskripsi Konsultasi</h5>
                </div>
                <div class="card-body">
                  <p class="whitespace-pre-line">${consultation.description}</p>
                </div>
              </div>
              
              ${consultation.status === 'completed' ? `
                <div class="card border-0 shadow-sm mb-4">
                  <div class="card-header bg-light">
                    <h5 class="mb-0"><i class="bi bi-clipboard-check me-2"></i> Hasil Konsultasi</h5>
                  </div>
                  <div class="card-body">
                    <p class="whitespace-pre-line">${consultation.result || 'Tidak ada hasil yang dicatat.'}</p>
                  </div>
                </div>
              ` : ''}
              
              ${canUpdateStatus ? `
                <div class="card border-0 shadow-sm mb-4">
                  <div class="card-header bg-light">
                    <h5 class="mb-0"><i class="bi bi-pencil-square me-2"></i> Update Status</h5>
                  </div>
                  <div class="card-body">
                    <form id="updateStatusForm">
                      ${consultation.status === 'pending' ? `
                        <div class="mb-3">
                          <label for="action" class="form-label">Tindakan</label>
                          <select class="form-select" id="action" required>
                            <option value="" selected disabled>Pilih Tindakan</option>
                            <option value="confirmed">Konfirmasi Jadwal</option>
                            <option value="cancelled">Tolak Permintaan</option>
                          </select>
                        </div>
                        <div class="mb-3">
                          <label for="notes" class="form-label">Catatan (Opsional)</label>
                          <textarea class="form-control" id="notes" rows="3">${consultation.notes}</textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">
                          <i class="bi bi-check-circle me-1"></i> Update Status
                        </button>
                      ` : consultation.status === 'confirmed' ? `
                        <div class="mb-3">
                          <label for="result" class="form-label">Hasil Konsultasi</label>
                          <textarea class="form-control" id="result" rows="4" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-success" data-action="complete">
                          <i class="bi bi-check-circle me-1"></i> Tandai Selesai
                        </button>
                      ` : ''}
                    </form>
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
          
          ${consultation.status === 'completed' ? `
            <div class="d-flex justify-content-center mb-5">
              <button class="btn btn-primary" id="printConsultation">
                <i class="bi bi-printer me-1"></i> Cetak Hasil Konsultasi
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners
  
  // Back button
  $('[data-page]').on('click', function(e) {
    e.preventDefault();
    const page = $(this).data('page');
    sessionStorage.removeItem('currentConsultationId');
    renderPage(page);
  });
  
  // Edit button
  $('[data-action="edit"]').on('click', function() {
    renderPage(PAGES.CONSULTATION_FORM);
  });
  
  // Update status form
  $('#updateStatusForm').on('submit', function(e) {
    e.preventDefault();
    
    if ($('[data-action="complete"]').length) {
      // Mark as completed
      const result = $('#result').val();
      
      if (!result) {
        showToast('Hasil konsultasi harus diisi.', 'warning');
        return;
      }
      
      updateConsultationStatus(consultationId, 'completed', null, result);
    } else {
      // Update to confirmed or cancelled
      const action = $('#action').val();
      const notes = $('#notes').val();
      
      if (!action) {
        showToast('Silakan pilih tindakan.', 'warning');
        return;
      }
      
      updateConsultationStatus(consultationId, action, notes);
    }
  });
  
  // Print consultation
  $('#printConsultation').on('click', function() {
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Hasil Konsultasi - ${consultation.title}</title>
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
            <h3>HASIL KONSULTASI PKL</h3>
            <h5>SMKN 7 SAMARINDA</h5>
          </div>
          
          <div class="row mb-4">
            <div class="col-12">
              <table class="table table-bordered">
                <tr>
                  <th width="30%">Judul Konsultasi</th>
                  <td>${consultation.title}</td>
                </tr>
                <tr>
                  <th>Jenis Konsultasi</th>
                  <td>${consultation.consultationType === 'school' ? 'Pembimbing Sekolah' : 'Pembimbing DU/DI'}</td>
                </tr>
                <tr>
                  <th>Tanggal & Waktu</th>
                  <td>${formatDate(consultation.date)}, ${consultation.time}</td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>${statusBadge}</td>
                </tr>
              </table>
            </div>
          </div>
          
          <div class="row mb-4">
            <div class="col-6">
              <h5>Siswa:</h5>
              <table class="table table-bordered">
                <tr>
                  <th>Nama</th>
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
              <h5>Pembimbing:</h5>
              <table class="table table-bordered">
                <tr>
                  <th>Nama</th>
                  <td>
                    ${consultation.consultationType === 'school' && schoolSupervisor ? 
                      `${schoolSupervisor.firstName} ${schoolSupervisor.lastName}` : 
                      consultation.consultationType === 'company' && companySupervisor ? 
                      `${companySupervisor.firstName} ${companySupervisor.lastName}` : '-'}
                  </td>
                </tr>
                <tr>
                  <th>Jabatan</th>
                  <td>${consultation.consultationType === 'school' ? 'Pembimbing Sekolah' : 'Pembimbing DU/DI'}</td>
                </tr>
              </table>
            </div>
          </div>
          
          <div class="mb-4">
            <h5>Deskripsi Konsultasi:</h5>
            <p style="white-space: pre-line">${consultation.description}</p>
          </div>
          
          <div class="mb-4">
            <h5>Hasil Konsultasi:</h5>
            <p style="white-space: pre-line">${consultation.result || '-'}</p>
          </div>
          
          <div class="row mt-5">
            <div class="col-6 text-center">
              <h5>Siswa</h5>
              <div style="height: 100px; border: 1px solid #ddd; margin-bottom: 10px;"></div>
              <p><strong>${student ? `${student.firstName} ${student.lastName}` : '-'}</strong></p>
            </div>
            <div class="col-6 text-center">
              <h5>Pembimbing</h5>
              <div style="height: 100px; border: 1px solid #ddd; margin-bottom: 10px;"></div>
              <p><strong>
                ${consultation.consultationType === 'school' && schoolSupervisor ? 
                  `${schoolSupervisor.firstName} ${schoolSupervisor.lastName}` : 
                  consultation.consultationType === 'company' && companySupervisor ? 
                  `${companySupervisor.firstName} ${companySupervisor.lastName}` : '-'}
              </strong></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
  });
}

// Update consultation status
function updateConsultationStatus(id, status, notes = null, result = null) {
  if (!id || !status) return;
  
  // Get all consultations
  const consultations = getAllConsultations();
  
  // Find the consultation to update
  const consultationIndex = consultations.findIndex(c => c.id === id);
  
  if (consultationIndex === -1) {
    showToast('Konsultasi tidak ditemukan.', 'danger');
    return;
  }
  
  // Update the consultation
  const updatedConsultation = {
    ...consultations[consultationIndex],
    status,
    updatedAt: new Date().toISOString()
  };
  
  // Update notes if provided
  if (notes !== null) {
    updatedConsultation.notes = notes;
  }
  
  // Update result if provided
  if (result !== null) {
    updatedConsultation.result = result;
  }
  
  // Save the updated consultation
  consultations[consultationIndex] = updatedConsultation;
  saveToStorage('consultations', consultations);
  
  // Show success message
  let message = '';
  switch (status) {
    case 'confirmed':
      message = 'Konsultasi berhasil dikonfirmasi.';
      break;
    case 'completed':
      message = 'Konsultasi berhasil ditandai selesai.';
      break;
    case 'cancelled':
      message = 'Konsultasi berhasil dibatalkan.';
      break;
    default:
      message = 'Status konsultasi berhasil diperbarui.';
  }
  
  showToast(message, 'success');
  
  // Refresh consultations list or detail
  if (sessionStorage.getItem('currentConsultationId')) {
    renderConsultationDetail();
  } else {
    renderConsultationsList();
  }
}
