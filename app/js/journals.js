/**
 * Journals management functionality
 */

// DOM Elements
const appContainer = document.getElementById('app');

// Get all journals
function getAllJournals() {
  return getFromStorage('journals') || [];
}

// Get journal by ID
function getJournalById(id) {
  const journals = getAllJournals();
  return journals.find(journal => journal.id === id);
}

// Render journals list
function renderJournalsList() {
  if (!appContainer) return;
  
  const journals = getAllJournals();
  const currentUser = getCurrentUser();
  
  // Filter journals based on user role
  let filteredJournals = journals;
  
  if (currentUser.role === 'student') {
    // Only show journals for this student
    filteredJournals = journals.filter(journal => journal.studentId === currentUser.studentId);
  } else if (currentUser.role === 'company_supervisor') {
    // Filter journals for students at this supervisor's company
    const students = getFromStorage('students') || [];
    const studentIds = students
      .filter(student => student.companyId === currentUser.companyId)
      .map(student => student.id);
    
    filteredJournals = journals.filter(journal => studentIds.includes(journal.studentId));
  } else if (currentUser.role === 'school_supervisor') {
    // Filter journals for students assigned to this supervisor
    const students = getFromStorage('students') || [];
    const studentIds = students
      .filter(student => student.schoolSupervisorId === currentUser.id)
      .map(student => student.id);
    
    filteredJournals = journals.filter(journal => studentIds.includes(journal.studentId));
  }
  
  // Sort journals by date (newest first)
  filteredJournals.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  const canAddJournal = currentUser.role === 'student';
  
  appContainer.innerHTML = `
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="text-xl font-bold">Jurnal Kegiatan PKL</h3>
        ${canAddJournal ? `
          <button class="btn btn-primary hover:bg-blue-600 transition-colors" data-page="${PAGES.JOURNAL_FORM}">
            <i class="bi bi-plus-circle me-1"></i> Tambah Jurnal
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
                <input type="text" id="searchJournals" class="form-control border-start-0 ps-0" placeholder="Cari jurnal...">
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
              <input type="month" id="filterMonth" class="form-control" value="${new Date().toISOString().substring(0, 7)}">
            </div>
          </div>
        </div>
        <div class="card-body">
          ${filteredJournals.length > 0 ? `
            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead class="table-light">
                  <tr>
                    <th>Tanggal</th>
                    ${currentUser.role !== 'student' ? '<th>Siswa</th>' : ''}
                    <th>Kegiatan</th>
                    <th>Status</th>
                    <th class="text-center">Tanda Tangan</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  ${filteredJournals.map(journal => {
                    // Get student name
                    const students = getFromStorage('students') || [];
                    const student = students.find(s => s.id === journal.studentId);
                    const studentName = student ? `${student.firstName} ${student.lastName}` : 'Unknown';
                    
                    // Format date
                    const journalDate = formatDate(journal.date);
                    
                    // Get status
                    let status = 'Menunggu Verifikasi';
                    let statusClass = 'bg-warning text-dark';
                    
                    if (journal.isVerifiedByCompany && journal.isVerifiedBySchool) {
                      status = 'Terverifikasi';
                      statusClass = 'bg-success text-white';
                    } else if (journal.isVerifiedByCompany) {
                      status = 'Diverifikasi DU/DI';
                      statusClass = 'bg-info text-dark';
                    } else if (journal.isVerifiedBySchool) {
                      status = 'Diverifikasi Sekolah';
                      statusClass = 'bg-primary text-white';
                    }
                    
                    return `
                      <tr class="hover:bg-gray-50">
                        <td>${journalDate}</td>
                        ${currentUser.role !== 'student' ? `<td>${studentName}</td>` : ''}
                        <td>
                          <div class="fw-semibold">${journal.title}</div>
                          <div class="text-muted small text-truncate" style="max-width: 300px;">${journal.description}</div>
                        </td>
                        <td><span class="badge ${statusClass}">${status}</span></td>
                        <td class="text-center">
                          ${journal.companySignature ? '<i class="bi bi-check-circle-fill text-success"></i>' : '<i class="bi bi-dash-circle text-muted"></i>'}
                          /
                          ${journal.schoolSignature ? '<i class="bi bi-check-circle-fill text-success"></i>' : '<i class="bi bi-dash-circle text-muted"></i>'}
                        </td>
                        <td>
                          <div class="btn-group" role="group">
                            <button class="btn btn-sm btn-info view-journal" data-id="${journal.id}" title="Lihat Detail">
                              <i class="bi bi-eye"></i>
                            </button>
                            ${currentUser.role === 'student' && (!journal.isVerifiedByCompany && !journal.isVerifiedBySchool) ? `
                              <button class="btn btn-sm btn-warning edit-journal" data-id="${journal.id}" title="Edit">
                                <i class="bi bi-pencil"></i>
                              </button>
                              <button class="btn btn-sm btn-danger delete-journal" data-id="${journal.id}" title="Hapus">
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
          ` : `
            <div class="text-center py-5">
              <i class="bi bi-journal-text display-4 text-muted"></i>
              <p class="lead mt-3">Belum ada data jurnal kegiatan PKL.</p>
              ${canAddJournal ? `
                <button class="btn btn-primary mt-2" data-page="${PAGES.JOURNAL_FORM}">
                  <i class="bi bi-plus-circle me-1"></i> Tambah Jurnal Kegiatan
                </button>
              ` : ''}
            </div>
          `}
        </div>
      </div>
      
      <!-- Journal Statistics -->
      ${filteredJournals.length > 0 ? `
        <div class="row">
          <div class="col-md-6">
            <div class="card shadow-sm border-0 mb-4">
              <div class="card-header bg-light">
                <h5 class="card-title mb-0">Statistik Jurnal</h5>
              </div>
              <div class="card-body">
                <div class="row text-center">
                  <div class="col-4">
                    <h3 class="text-primary">${filteredJournals.length}</h3>
                    <p class="text-muted mb-0">Total Jurnal</p>
                  </div>
                  <div class="col-4">
                    <h3 class="text-success">${filteredJournals.filter(j => j.isVerifiedByCompany && j.isVerifiedBySchool).length}</h3>
                    <p class="text-muted mb-0">Terverifikasi</p>
                  </div>
                  <div class="col-4">
                    <h3 class="text-warning">${filteredJournals.filter(j => !j.isVerifiedByCompany || !j.isVerifiedBySchool).length}</h3>
                    <p class="text-muted mb-0">Menunggu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="col-md-6">
            <div class="card shadow-sm border-0 mb-4">
              <div class="card-header bg-light">
                <h5 class="card-title mb-0">Aktivitas Terbaru</h5>
              </div>
              <div class="card-body p-0">
                <div class="list-group list-group-flush">
                  ${filteredJournals.slice(0, 3).map(journal => {
                    const students = getFromStorage('students') || [];
                    const student = students.find(s => s.id === journal.studentId);
                    const studentName = student ? `${student.firstName} ${student.lastName}` : 'Unknown';
                    
                    return `
                      <a href="#" class="list-group-item list-group-item-action view-recent-journal" data-id="${journal.id}">
                        <div class="d-flex w-100 justify-content-between">
                          <h6 class="mb-1">${journal.title}</h6>
                          <small>${formatDate(journal.date)}</small>
                        </div>
                        ${currentUser.role !== 'student' ? `<small class="text-primary">${studentName}</small>` : ''}
                      </a>
                    `;
                  }).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      ` : ''}
    </div>
  `;
  
  // Add event listeners
  if (filteredJournals.length > 0) {
    // View journal detail
    document.querySelectorAll('.view-journal, .view-recent-journal').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const journalId = e.currentTarget.getAttribute('data-id');
        sessionStorage.setItem('currentJournalId', journalId);
        renderPage(PAGES.JOURNAL_DETAIL);
      });
    });
    
    // Edit journal
    document.querySelectorAll('.edit-journal').forEach(button => {
      button.addEventListener('click', (e) => {
        const journalId = e.currentTarget.getAttribute('data-id');
        sessionStorage.setItem('currentJournalId', journalId);
        renderPage(PAGES.JOURNAL_FORM);
      });
    });
    
    // Delete journal
    document.querySelectorAll('.delete-journal').forEach(button => {
      button.addEventListener('click', (e) => {
        const journalId = e.currentTarget.getAttribute('data-id');
        if (confirm('Apakah Anda yakin ingin menghapus jurnal ini?')) {
          deleteJournal(journalId);
        }
      });
    });
    
    // Search journals
    $('#searchJournals').on('input', function() {
      const searchTerm = $(this).val().toLowerCase();
      $('tbody tr').each(function() {
        const text = $(this).text().toLowerCase();
        $(this).toggle(text.includes(searchTerm));
      });
    });
    
    // Filter by student
    $('#filterStudents').on('change', function() {
      const studentId = $(this).val();
      $('tbody tr').each(function() {
        if (studentId === 'all') {
          $(this).show();
        } else {
          const rowStudentId = $(this).find('.view-journal').data('student-id');
          $(this).toggle(rowStudentId === studentId);
        }
      });
    });
    
    // Filter by month
    $('#filterMonth').on('change', function() {
      const monthYear = $(this).val(); // Format: YYYY-MM
      
      if (monthYear) {
        $('tbody tr').each(function() {
          const dateCell = $(this).find('td:first-child').text(); // Get date text
          const dateParts = dateCell.split(' '); // Split by space
          
          // Convert month name to number
          const months = {
            'Januari': '01', 'Februari': '02', 'Maret': '03', 'April': '04',
            'Mei': '05', 'Juni': '06', 'Juli': '07', 'Agustus': '08',
            'September': '09', 'Oktober': '10', 'November': '11', 'Desember': '12'
          };
          
          // Extract month and year
          const month = months[dateParts[1]];
          const year = dateParts[2];
          
          // Construct YYYY-MM format
          const rowMonthYear = `${year}-${month}`;
          
          // Compare with filter value
          $(this).toggle(rowMonthYear === monthYear);
        });
      } else {
        $('tbody tr').show();
      }
    });
  }
  
  // Add event listener for "Add Journal" button
  document.querySelectorAll('[data-page]').forEach(button => {
    button.addEventListener('click', (e) => {
      const page = e.currentTarget.getAttribute('data-page');
      renderPage(page);
    });
  });
}

// Render journal form (add/edit)
function renderJournalForm() {
  if (!appContainer) return;
  
  const currentUser = getCurrentUser();
  
  // Check permission
  if (currentUser.role !== 'student') {
    showToast('Anda tidak memiliki izin untuk menambah atau mengedit jurnal kegiatan.', 'danger');
    renderPage(PAGES.DASHBOARD);
    return;
  }
  
  // Check if editing existing journal
  const journalId = sessionStorage.getItem('currentJournalId');
  const isEditing = !!journalId;
  let journal = {
    date: new Date().toISOString().split('T')[0],
    title: '',
    description: '',
    learningOutcome: '',
    problems: '',
    solutions: '',
    studentId: currentUser.studentId,
    isVerifiedByCompany: false,
    isVerifiedBySchool: false,
    companySignature: '',
    schoolSignature: '',
    companyNotes: '',
    schoolNotes: ''
  };
  
  if (isEditing) {
    const existingJournal = getJournalById(journalId);
    if (existingJournal) {
      // Check if journal belongs to this student
      if (existingJournal.studentId !== currentUser.studentId) {
        showToast('Anda tidak dapat mengedit jurnal milik siswa lain.', 'danger');
        renderPage(PAGES.JOURNALS);
        return;
      }
      
      // Check if journal is already verified
      if (existingJournal.isVerifiedByCompany || existingJournal.isVerifiedBySchool) {
        showToast('Jurnal yang sudah diverifikasi tidak dapat diedit.', 'warning');
        renderPage(PAGES.JOURNALS);
        return;
      }
      
      journal = { ...existingJournal };
    }
  }
  
  appContainer.innerHTML = `
    <div class="container">
      <div class="card shadow-lg border-0">
        <div class="card-header bg-white py-3">
          <h3 class="card-title mb-0">${isEditing ? 'Edit' : 'Tambah'} Jurnal Kegiatan</h3>
        </div>
        <div class="card-body">
          <form id="journalForm" class="needs-validation" novalidate>
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="date" class="form-label">Tanggal</label>
                <input type="date" class="form-control" id="date" value="${journal.date}" required>
                <div class="invalid-feedback">Tanggal harus diisi.</div>
              </div>
              <div class="col-md-6">
                <label for="title" class="form-label">Judul Kegiatan</label>
                <input type="text" class="form-control" id="title" value="${journal.title}" required>
                <div class="invalid-feedback">Judul kegiatan harus diisi.</div>
              </div>
            </div>
            
            <div class="mb-3">
              <label for="description" class="form-label">Deskripsi Kegiatan</label>
              <textarea class="form-control" id="description" rows="4" required>${journal.description}</textarea>
              <div class="invalid-feedback">Deskripsi kegiatan harus diisi.</div>
            </div>
            
            <div class="mb-3">
              <label for="learningOutcome" class="form-label">Hasil Pembelajaran</label>
              <textarea class="form-control" id="learningOutcome" rows="3">${journal.learningOutcome}</textarea>
              <small class="text-muted">Apa yang Anda pelajari dari kegiatan ini?</small>
            </div>
            
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="problems" class="form-label">Kendala</label>
                <textarea class="form-control" id="problems" rows="3">${journal.problems}</textarea>
                <small class="text-muted">Kendala apa yang Anda hadapi?</small>
              </div>
              <div class="col-md-6">
                <label for="solutions" class="form-label">Solusi</label>
                <textarea class="form-control" id="solutions" rows="3">${journal.solutions}</textarea>
                <small class="text-muted">Bagaimana Anda mengatasi kendala tersebut?</small>
              </div>
            </div>
            
            <div class="alert alert-info" role="alert">
              <i class="bi bi-info-circle-fill me-2"></i>
              Jurnal akan dikirim untuk verifikasi pembimbing DU/DI dan pembimbing sekolah.
            </div>
            
            <div class="d-flex justify-content-between mt-4">
              <button type="button" class="btn btn-secondary" data-page="${PAGES.JOURNALS}">
                <i class="bi bi-arrow-left me-1"></i> Kembali
              </button>
              <button type="submit" class="btn btn-primary">
                <i class="bi bi-save me-1"></i> ${isEditing ? 'Perbarui' : 'Simpan'} Jurnal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners
  $('#journalForm').on('submit', function(e) {
    e.preventDefault();
    
    // Check form validity using Bootstrap validation
    if (!this.checkValidity()) {
      e.stopPropagation();
      $(this).addClass('was-validated');
      return;
    }
    
    // Get form values
    const formData = {
      id: isEditing ? journal.id : generateId(),
      date: $('#date').val(),
      title: $('#title').val(),
      description: $('#description').val(),
      learningOutcome: $('#learningOutcome').val(),
      problems: $('#problems').val(),
      solutions: $('#solutions').val(),
      studentId: currentUser.studentId,
      isVerifiedByCompany: false,
      isVerifiedBySchool: false,
      companySignature: '',
      schoolSignature: '',
      companyNotes: '',
      schoolNotes: '',
      createdAt: isEditing ? journal.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save journal data
    const journals = getAllJournals();
    
    if (isEditing) {
      // Update existing journal
      const updatedJournals = journals.map(j => (j.id === formData.id ? formData : j));
      saveToStorage('journals', updatedJournals);
      showToast('Jurnal berhasil diperbarui.', 'success');
    } else {
      // Add new journal
      const newJournals = [...journals, formData];
      saveToStorage('journals', newJournals);
      showToast('Jurnal berhasil ditambahkan.', 'success');
    }
    
    // Clear session storage and go back to journals list
    sessionStorage.removeItem('currentJournalId');
    renderPage(PAGES.JOURNALS);
  });
  
  // Add event listener for back button
  $('[data-page]').on('click', function(e) {
    e.preventDefault();
    const page = $(this).data('page');
    sessionStorage.removeItem('currentJournalId');
    renderPage(page);
  });
}

// Render journal detail
function renderJournalDetail() {
  if (!appContainer) return;
  
  const journalId = sessionStorage.getItem('currentJournalId');
  if (!journalId) {
    showToast('Data jurnal tidak ditemukan.', 'danger');
    renderPage(PAGES.JOURNALS);
    return;
  }
  
  const journal = getJournalById(journalId);
  if (!journal) {
    showToast('Data jurnal tidak ditemukan.', 'danger');
    renderPage(PAGES.JOURNALS);
    return;
  }
  
  // Get student
  const students = getFromStorage('students') || [];
  const student = students.find(s => s.id === journal.studentId);
  
  // Get company and supervisors
  const companies = getFromStorage('companies') || [];
  const company = companies.find(c => c.id === student?.companyId);
  
  const users = getFromStorage('users') || [];
  const schoolSupervisor = users.find(u => u.id === student?.schoolSupervisorId);
  const companySupervisor = users.find(u => u.role === 'company_supervisor' && u.companyId === student?.companyId);
  
  const currentUser = getCurrentUser();
  
  // Check if current user can verify this journal
  const canVerifyAsCompany = currentUser.role === 'company_supervisor' && 
                            currentUser.companyId === student?.companyId && 
                            !journal.isVerifiedByCompany;
  
  const canVerifyAsSchool = currentUser.role === 'school_supervisor' && 
                           currentUser.id === student?.schoolSupervisorId && 
                           !journal.isVerifiedBySchool;
  
  appContainer.innerHTML = `
    <div class="container">
      <div class="card shadow-lg border-0 mb-4">
        <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h3 class="card-title mb-0">Detail Jurnal Kegiatan</h3>
          <div>
            ${currentUser.role === 'student' && journal.studentId === currentUser.studentId && 
              !journal.isVerifiedByCompany && !journal.isVerifiedBySchool ? `
              <button class="btn btn-warning me-2" data-action="edit">
                <i class="bi bi-pencil me-1"></i> Edit
              </button>
            ` : ''}
            <button class="btn btn-secondary" data-page="${PAGES.JOURNALS}">
              <i class="bi bi-arrow-left me-1"></i> Kembali
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="row mb-4">
            <div class="col-md-8">
              <h4 class="fw-bold text-primary mb-3">${journal.title}</h4>
              <p class="text-muted mb-2">
                <i class="bi bi-calendar me-2"></i> ${formatDate(journal.date)}
              </p>
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
              <div class="badge p-2 mb-2 ${
                journal.isVerifiedByCompany && journal.isVerifiedBySchool 
                  ? 'bg-success text-white' 
                  : journal.isVerifiedByCompany || journal.isVerifiedBySchool 
                    ? 'bg-info text-dark'
                    : 'bg-warning text-dark'
              }">
                <i class="bi ${
                  journal.isVerifiedByCompany && journal.isVerifiedBySchool
                    ? 'bi-check-circle-fill' 
                    : journal.isVerifiedByCompany || journal.isVerifiedBySchool
                      ? 'bi-check-circle' 
                      : 'bi-clock'
                } me-1"></i>
                ${
                  journal.isVerifiedByCompany && journal.isVerifiedBySchool
                    ? 'Terverifikasi'
                    : journal.isVerifiedByCompany
                      ? 'Diverifikasi DU/DI'
                      : journal.isVerifiedBySchool
                        ? 'Diverifikasi Sekolah'
                        : 'Menunggu Verifikasi'
                }
              </div>
              <div class="mt-2">
                <small class="text-muted">Dibuat: ${formatDate(journal.createdAt)}</small>
                ${journal.updatedAt !== journal.createdAt ? `
                  <br><small class="text-muted">Diperbarui: ${formatDate(journal.updatedAt)}</small>
                ` : ''}
              </div>
            </div>
          </div>
          
          <div class="row">
            <div class="col-md-8">
              <div class="card border-0 shadow-sm mb-4">
                <div class="card-header bg-light">
                  <h5 class="mb-0"><i class="bi bi-journal-text me-2"></i> Deskripsi Kegiatan</h5>
                </div>
                <div class="card-body">
                  <p class="whitespace-pre-line">${journal.description}</p>
                </div>
              </div>
              
              <div class="card border-0 shadow-sm mb-4">
                <div class="card-header bg-light">
                  <h5 class="mb-0"><i class="bi bi-lightbulb me-2"></i> Hasil Pembelajaran</h5>
                </div>
                <div class="card-body">
                  <p class="whitespace-pre-line">${journal.learningOutcome || 'Tidak ada hasil pembelajaran yang dicatat.'}</p>
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-6">
                  <div class="card border-0 shadow-sm mb-4">
                    <div class="card-header bg-light">
                      <h5 class="mb-0"><i class="bi bi-exclamation-triangle me-2"></i> Kendala</h5>
                    </div>
                    <div class="card-body">
                      <p class="whitespace-pre-line">${journal.problems || 'Tidak ada kendala yang dicatat.'}</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card border-0 shadow-sm mb-4">
                    <div class="card-header bg-light">
                      <h5 class="mb-0"><i class="bi bi-wrench me-2"></i> Solusi</h5>
                    </div>
                    <div class="card-body">
                      <p class="whitespace-pre-line">${journal.solutions || 'Tidak ada solusi yang dicatat.'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-md-4">
              <div class="card border-0 shadow-sm mb-4">
                <div class="card-header bg-light">
                  <h5 class="mb-0"><i class="bi bi-building me-2"></i> Verifikasi DU/DI</h5>
                </div>
                <div class="card-body">
                  ${journal.isVerifiedByCompany ? `
                    <div class="text-center mb-3">
                      <div class="mb-2">
                        ${journal.companySignature ? `
                          <img src="${journal.companySignature}" alt="Tanda Tangan DU/DI" class="img-fluid border rounded" style="max-height: 100px;">
                        ` : `
                          <div class="p-3 bg-light rounded">
                            <i class="bi bi-check-circle-fill text-success fs-1"></i>
                          </div>
                        `}
                      </div>
                      <p class="mb-0 fw-bold">${companySupervisor ? `${companySupervisor.firstName} ${companySupervisor.lastName}` : 'Pembimbing DU/DI'}</p>
                      <small class="text-muted">Telah memverifikasi</small>
                    </div>
                    ${journal.companyNotes ? `
                      <div class="mt-3">
                        <h6>Catatan:</h6>
                        <p class="whitespace-pre-line">${journal.companyNotes}</p>
                      </div>
                    ` : ''}
                  ` : `
                    <div class="text-center mb-3">
                      <div class="p-3 bg-light rounded mb-2">
                        <i class="bi bi-clock text-warning fs-1"></i>
                      </div>
                      <p class="mb-0">Belum diverifikasi</p>
                    </div>
                    
                    ${canVerifyAsCompany ? `
                      <form id="companyVerificationForm">
                        <div class="mb-3">
                          <label for="companyNotes" class="form-label">Catatan Pembimbing DU/DI:</label>
                          <textarea class="form-control" id="companyNotes" rows="3"></textarea>
                        </div>
                        
                        <div class="mb-3">
                          <label class="form-label">Tanda Tangan:</label>
                          <div id="companySignaturePad" class="signature-pad border rounded"></div>
                          <div class="d-flex justify-content-between mt-2">
                            <button type="button" class="btn btn-sm btn-outline-secondary" id="clearCompanySignature">
                              <i class="bi bi-eraser me-1"></i> Hapus
                            </button>
                          </div>
                        </div>
                        
                        <button type="submit" class="btn btn-success w-100">
                          <i class="bi bi-check-circle me-1"></i> Verifikasi Jurnal
                        </button>
                      </form>
                    ` : ''}
                  `}
                </div>
              </div>
              
              <div class="card border-0 shadow-sm mb-4">
                <div class="card-header bg-light">
                  <h5 class="mb-0"><i class="bi bi-mortarboard me-2"></i> Verifikasi Sekolah</h5>
                </div>
                <div class="card-body">
                  ${journal.isVerifiedBySchool ? `
                    <div class="text-center mb-3">
                      <div class="mb-2">
                        ${journal.schoolSignature ? `
                          <img src="${journal.schoolSignature}" alt="Tanda Tangan Sekolah" class="img-fluid border rounded" style="max-height: 100px;">
                        ` : `
                          <div class="p-3 bg-light rounded">
                            <i class="bi bi-check-circle-fill text-success fs-1"></i>
                          </div>
                        `}
                      </div>
                      <p class="mb-0 fw-bold">${schoolSupervisor ? `${schoolSupervisor.firstName} ${schoolSupervisor.lastName}` : 'Pembimbing Sekolah'}</p>
                      <small class="text-muted">Telah memverifikasi</small>
                    </div>
                    ${journal.schoolNotes ? `
                      <div class="mt-3">
                        <h6>Catatan:</h6>
                        <p class="whitespace-pre-line">${journal.schoolNotes}</p>
                      </div>
                    ` : ''}
                  ` : `
                    <div class="text-center mb-3">
                      <div class="p-3 bg-light rounded mb-2">
                        <i class="bi bi-clock text-warning fs-1"></i>
                      </div>
                      <p class="mb-0">Belum diverifikasi</p>
                    </div>
                    
                    ${canVerifyAsSchool ? `
                      <form id="schoolVerificationForm">
                        <div class="mb-3">
                          <label for="schoolNotes" class="form-label">Catatan Pembimbing Sekolah:</label>
                          <textarea class="form-control" id="schoolNotes" rows="3"></textarea>
                        </div>
                        
                        <div class="mb-3">
                          <label class="form-label">Tanda Tangan:</label>
                          <div id="schoolSignaturePad" class="signature-pad border rounded"></div>
                          <div class="d-flex justify-content-between mt-2">
                            <button type="button" class="btn btn-sm btn-outline-secondary" id="clearSchoolSignature">
                              <i class="bi bi-eraser me-1"></i> Hapus
                            </button>
                          </div>
                        </div>
                        
                        <button type="submit" class="btn btn-success w-100">
                          <i class="bi bi-check-circle me-1"></i> Verifikasi Jurnal
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
        <button class="btn btn-primary" id="printJournal">
          <i class="bi bi-printer me-1"></i> Cetak Jurnal
        </button>
      </div>
    </div>
  `;
  
  // Add event listeners
  
  // Back button
  $('[data-page]').on('click', function(e) {
    e.preventDefault();
    const page = $(this).data('page');
    sessionStorage.removeItem('currentJournalId');
    renderPage(page);
  });
  
  // Edit button
  $('[data-action="edit"]').on('click', function() {
    renderPage(PAGES.JOURNAL_FORM);
  });
  
  // Initialize signature pads if needed
  if (canVerifyAsCompany) {
    const companySignaturePad = new SignaturePad(document.getElementById('companySignaturePad'), {
      backgroundColor: 'rgba(255, 255, 255, 0)',
      penColor: 'black'
    });
    
    $('#clearCompanySignature').on('click', function() {
      companySignaturePad.clear();
    });
    
    $('#companyVerificationForm').on('submit', function(e) {
      e.preventDefault();
      
      if (companySignaturePad.isEmpty()) {
        showToast('Silakan tanda tangan terlebih dahulu.', 'warning');
        return;
      }
      
      const companyNotes = $('#companyNotes').val();
      const companySignature = companySignaturePad.toDataURL();
      
      // Update journal
      const journals = getAllJournals();
      const updatedJournals = journals.map(j => {
        if (j.id === journal.id) {
          return {
            ...j,
            isVerifiedByCompany: true,
            companySignature,
            companyNotes,
            updatedAt: new Date().toISOString()
          };
        }
        return j;
      });
      
      saveToStorage('journals', updatedJournals);
      showToast('Jurnal berhasil diverifikasi.', 'success');
      
      // Refresh page
      renderJournalDetail();
    });
  }
  
  if (canVerifyAsSchool) {
    const schoolSignaturePad = new SignaturePad(document.getElementById('schoolSignaturePad'), {
      backgroundColor: 'rgba(255, 255, 255, 0)',
      penColor: 'black'
    });
    
    $('#clearSchoolSignature').on('click', function() {
      schoolSignaturePad.clear();
    });
    
    $('#schoolVerificationForm').on('submit', function(e) {
      e.preventDefault();
      
      if (schoolSignaturePad.isEmpty()) {
        showToast('Silakan tanda tangan terlebih dahulu.', 'warning');
        return;
      }
      
      const schoolNotes = $('#schoolNotes').val();
      const schoolSignature = schoolSignaturePad.toDataURL();
      
      // Update journal
      const journals = getAllJournals();
      const updatedJournals = journals.map(j => {
        if (j.id === journal.id) {
          return {
            ...j,
            isVerifiedBySchool: true,
            schoolSignature,
            schoolNotes,
            updatedAt: new Date().toISOString()
          };
        }
        return j;
      });
      
      saveToStorage('journals', updatedJournals);
      showToast('Jurnal berhasil diverifikasi.', 'success');
      
      // Refresh page
      renderJournalDetail();
    });
  }
  
  // Print journal
  $('#printJournal').on('click', function() {
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Jurnal PKL - ${journal.title}</title>
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
            <h3>JURNAL KEGIATAN PKL</h3>
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
                  <th>Alamat</th>
                  <td>${company ? `${company.address}, ${company.city}` : '-'}</td>
                </tr>
                <tr>
                  <th>Tanggal Jurnal</th>
                  <td>${formatDate(journal.date)}</td>
                </tr>
              </table>
            </div>
          </div>
          
          <div class="mb-4">
            <h5>Judul Kegiatan:</h5>
            <p class="fw-bold">${journal.title}</p>
          </div>
          
          <div class="mb-4">
            <h5>Deskripsi Kegiatan:</h5>
            <p style="white-space: pre-line">${journal.description}</p>
          </div>
          
          <div class="mb-4">
            <h5>Hasil Pembelajaran:</h5>
            <p style="white-space: pre-line">${journal.learningOutcome || '-'}</p>
          </div>
          
          <div class="row mb-4">
            <div class="col-6">
              <h5>Kendala:</h5>
              <p style="white-space: pre-line">${journal.problems || '-'}</p>
            </div>
            <div class="col-6">
              <h5>Solusi:</h5>
              <p style="white-space: pre-line">${journal.solutions || '-'}</p>
            </div>
          </div>
          
          <div class="row mt-5">
            <div class="col-6 text-center">
              <h5>Verifikasi Pembimbing DU/DI</h5>
              <div class="signature-container">
                ${journal.companySignature ? `
                  <img src="${journal.companySignature}" alt="Tanda Tangan DU/DI" style="max-height: 100px;">
                ` : `
                  <p class="text-muted">Belum Ditandatangani</p>
                `}
              </div>
              <p class="fw-bold">${companySupervisor ? `${companySupervisor.firstName} ${companySupervisor.lastName}` : 'Pembimbing DU/DI'}</p>
              ${journal.companyNotes ? `
                <div class="text-start">
                  <h6>Catatan:</h6>
                  <p style="white-space: pre-line">${journal.companyNotes}</p>
                </div>
              ` : ''}
            </div>
            <div class="col-6 text-center">
              <h5>Verifikasi Pembimbing Sekolah</h5>
              <div class="signature-container">
                ${journal.schoolSignature ? `
                  <img src="${journal.schoolSignature}" alt="Tanda Tangan Sekolah" style="max-height: 100px;">
                ` : `
                  <p class="text-muted">Belum Ditandatangani</p>
                `}
              </div>
              <p class="fw-bold">${schoolSupervisor ? `${schoolSupervisor.firstName} ${schoolSupervisor.lastName}` : 'Pembimbing Sekolah'}</p>
              ${journal.schoolNotes ? `
                <div class="text-start">
                  <h6>Catatan:</h6>
                  <p style="white-space: pre-line">${journal.schoolNotes}</p>
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

// Delete journal
function deleteJournal(journalId) {
  if (!journalId) return;
  
  // Get all journals
  const journals = getAllJournals();
  
  // Get the journal to delete
  const journal = journals.find(j => j.id === journalId);
  
  if (!journal) {
    showToast('Jurnal tidak ditemukan.', 'danger');
    return;
  }
  
  // Check if current user can delete this journal
  const currentUser = getCurrentUser();
  
  if (currentUser.role !== 'student' || journal.studentId !== currentUser.studentId) {
    showToast('Anda tidak memiliki izin untuk menghapus jurnal ini.', 'danger');
    return;
  }
  
  // Check if journal is already verified
  if (journal.isVerifiedByCompany || journal.isVerifiedBySchool) {
    showToast('Jurnal yang sudah diverifikasi tidak dapat dihapus.', 'warning');
    return;
  }
  
  // Remove journal
  const updatedJournals = journals.filter(j => j.id !== journalId);
  
  // Save updated journals
  saveToStorage('journals', updatedJournals);
  
  showToast('Jurnal berhasil dihapus.', 'success');
  
  // Refresh journals list
  renderPage(PAGES.JOURNALS);
}
