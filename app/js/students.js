/**
 * Students management functionality
 */

// DOM Elements
const appContainer = document.getElementById('app');

// Get all students
function getAllStudents() {
  return getFromStorage('students') || [];
}

// Get student by ID
function getStudentById(id) {
  const students = getAllStudents();
  return students.find(student => student.id === id);
}

// Render students list
function renderStudentsList() {
  if (!appContainer) return;
  
  const students = getAllStudents();
  const currentUser = getCurrentUser();
  
  // Filter students based on user role
  let filteredStudents = students;
  
  if (currentUser.role === 'company_supervisor') {
    // Filter students assigned to this company supervisor's company
    filteredStudents = students.filter(student => student.companyId === currentUser.companyId);
  } else if (currentUser.role === 'school_supervisor') {
    // Filter students assigned to this school supervisor
    filteredStudents = students.filter(student => student.schoolSupervisorId === currentUser.id);
  }
  
  const canAddStudent = ['admin', 'school_supervisor'].includes(currentUser.role);
  
  appContainer.innerHTML = `
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3>Daftar Siswa PKL</h3>
        ${canAddStudent ? `
          <button class="btn btn-primary" data-page="${PAGES.STUDENT_FORM}">
            <i class="bi bi-plus-circle me-1"></i> Tambah Siswa
          </button>
        ` : ''}
      </div>
      
      <div class="card mb-4">
        <div class="card-header bg-light">
          <div class="row">
            <div class="col-md-6">
              <input type="text" id="searchStudents" class="form-control" placeholder="Cari siswa...">
            </div>
            <div class="col-md-6">
              <select id="filterStudents" class="form-select">
                <option value="all">Semua Status</option>
                <option value="active">Aktif PKL</option>
                <option value="completed">Selesai PKL</option>
                <option value="not_started">Belum Mulai</option>
              </select>
            </div>
          </div>
        </div>
        <div class="card-body">
          ${filteredStudents.length > 0 ? `
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>NIS</th>
                    <th>Nama</th>
                    <th>Kelas</th>
                    <th>Tempat PKL</th>
                    <th>Periode PKL</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  ${filteredStudents.map(student => {
                    // Get company name
                    const companies = getFromStorage('companies') || [];
                    const company = companies.find(c => c.id === student.companyId);
                    const companyName = company ? company.name : 'Belum ditentukan';
                    
                    // Get school supervisor name
                    const users = getFromStorage('users') || [];
                    const schoolSupervisor = users.find(u => u.id === student.schoolSupervisorId);
                    const schoolSupervisorName = schoolSupervisor 
                      ? `${schoolSupervisor.firstName} ${schoolSupervisor.lastName}`
                      : 'Belum ditentukan';
                    
                    // Format period
                    const startDate = student.startDate ? formatDate(student.startDate) : 'Belum ditentukan';
                    const endDate = student.endDate ? formatDate(student.endDate) : 'Belum ditentukan';
                    const period = `${startDate} - ${endDate}`;
                    
                    // Determine status
                    let status = 'Belum Mulai';
                    let statusClass = 'text-secondary';
                    
                    if (student.startDate && student.endDate) {
                      const now = new Date();
                      const start = new Date(student.startDate);
                      const end = new Date(student.endDate);
                      
                      if (now < start) {
                        status = 'Belum Mulai';
                        statusClass = 'text-secondary';
                      } else if (now > end) {
                        status = 'Selesai';
                        statusClass = 'text-success';
                      } else {
                        status = 'Aktif';
                        statusClass = 'text-primary';
                      }
                    }
                    
                    return `
                      <tr>
                        <td>${student.nis}</td>
                        <td>${student.firstName} ${student.lastName}</td>
                        <td>${student.className}</td>
                        <td>${companyName}</td>
                        <td>${period}</td>
                        <td><span class="${statusClass}">${status}</span></td>
                        <td>
                          <button class="btn btn-sm btn-info view-student" data-id="${student.id}">
                            <i class="bi bi-eye"></i>
                          </button>
                          ${currentUser.role === 'admin' ? `
                            <button class="btn btn-sm btn-warning edit-student" data-id="${student.id}">
                              <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-danger delete-student" data-id="${student.id}">
                              <i class="bi bi-trash"></i>
                            </button>
                          ` : ''}
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          ` : `
            <div class="text-center py-4">
              <i class="bi bi-people display-4 text-muted"></i>
              <p class="lead mt-3">Belum ada data siswa PKL.</p>
              ${canAddStudent ? `
                <button class="btn btn-primary" data-page="${PAGES.STUDENT_FORM}">
                  <i class="bi bi-plus-circle me-1"></i> Tambah Siswa
                </button>
              ` : ''}
            </div>
          `}
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners
  if (filteredStudents.length > 0) {
    // View student detail
    document.querySelectorAll('.view-student').forEach(button => {
      button.addEventListener('click', (e) => {
        const studentId = e.currentTarget.getAttribute('data-id');
        sessionStorage.setItem('currentStudentId', studentId);
        renderPage(PAGES.STUDENT_DETAIL);
      });
    });
    
    // Edit student
    document.querySelectorAll('.edit-student').forEach(button => {
      button.addEventListener('click', (e) => {
        const studentId = e.currentTarget.getAttribute('data-id');
        sessionStorage.setItem('currentStudentId', studentId);
        renderPage(PAGES.STUDENT_FORM);
      });
    });
    
    // Delete student
    document.querySelectorAll('.delete-student').forEach(button => {
      button.addEventListener('click', (e) => {
        const studentId = e.currentTarget.getAttribute('data-id');
        if (confirm('Apakah Anda yakin ingin menghapus data siswa ini?')) {
          deleteStudent(studentId);
        }
      });
    });
    
    // Search students
    const searchInput = document.getElementById('searchStudents');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
      });
    }
    
    // Filter students by status
    const filterSelect = document.getElementById('filterStudents');
    if (filterSelect) {
      filterSelect.addEventListener('change', (e) => {
        const filterValue = e.target.value;
        const rows = document.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
          const statusCell = row.querySelector('td:nth-child(6)');
          const status = statusCell.textContent.trim().toLowerCase();
          
          if (filterValue === 'all') {
            row.style.display = '';
          } else if (filterValue === 'active' && status === 'aktif') {
            row.style.display = '';
          } else if (filterValue === 'completed' && status === 'selesai') {
            row.style.display = '';
          } else if (filterValue === 'not_started' && status === 'belum mulai') {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
    }
  }
  
  // Add event listener for "Add Student" button
  document.querySelectorAll('[data-page]').forEach(button => {
    button.addEventListener('click', (e) => {
      const page = e.currentTarget.getAttribute('data-page');
      renderPage(page);
    });
  });
}

// Render student form (add/edit)
function renderStudentForm() {
  if (!appContainer) return;
  
  const currentUser = getCurrentUser();
  
  // Check permission
  if (!['admin', 'school_supervisor'].includes(currentUser.role)) {
    showToast('Anda tidak memiliki izin untuk menambah atau mengedit data siswa.', 'danger');
    renderPage(PAGES.DASHBOARD);
    return;
  }
  
  // Check if editing existing student
  const studentId = sessionStorage.getItem('currentStudentId');
  const isEditing = !!studentId;
  let student = { 
    firstName: '', 
    lastName: '', 
    nis: '', 
    className: '', 
    email: '', 
    phone: '',
    address: '',
    companyId: '',
    schoolSupervisorId: currentUser.role === 'school_supervisor' ? currentUser.id : '',
    startDate: '',
    endDate: ''
  };
  
  if (isEditing) {
    const existingStudent = getStudentById(studentId);
    if (existingStudent) {
      student = { ...existingStudent };
    }
  }
  
  // Get companies and school supervisors for dropdowns
  const companies = getFromStorage('companies') || [];
  const users = getFromStorage('users') || [];
  const schoolSupervisors = users.filter(user => user.role === 'school_supervisor');
  
  appContainer.innerHTML = `
    <div class="container">
      <div class="card">
        <div class="card-header">
          <h3>${isEditing ? 'Edit' : 'Tambah'} Siswa PKL</h3>
        </div>
        <div class="card-body">
          <form id="studentForm">
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="firstName" class="form-label">Nama Depan</label>
                <input type="text" class="form-control" id="firstName" value="${student.firstName}" required>
              </div>
              <div class="col-md-6">
                <label for="lastName" class="form-label">Nama Belakang</label>
                <input type="text" class="form-control" id="lastName" value="${student.lastName}" required>
              </div>
            </div>
            
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="nis" class="form-label">NIS</label>
                <input type="text" class="form-control" id="nis" value="${student.nis}" required>
              </div>
              <div class="col-md-6">
                <label for="className" class="form-label">Kelas</label>
                <input type="text" class="form-control" id="className" value="${student.className}" required>
              </div>
            </div>
            
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" value="${student.email}" required>
              </div>
              <div class="col-md-6">
                <label for="phone" class="form-label">Nomor Telepon</label>
                <input type="tel" class="form-control" id="phone" value="${student.phone}" required>
              </div>
            </div>
            
            <div class="mb-3">
              <label for="address" class="form-label">Alamat</label>
              <textarea class="form-control" id="address" rows="3">${student.address}</textarea>
            </div>
            
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="companyId" class="form-label">Tempat PKL</label>
                <select class="form-select" id="companyId">
                  <option value="">Pilih Tempat PKL</option>
                  ${companies.map(company => `
                    <option value="${company.id}" ${student.companyId === company.id ? 'selected' : ''}>
                      ${company.name}
                    </option>
                  `).join('')}
                </select>
              </div>
              <div class="col-md-6">
                <label for="schoolSupervisorId" class="form-label">Pembimbing Sekolah</label>
                <select class="form-select" id="schoolSupervisorId" ${currentUser.role === 'school_supervisor' ? 'disabled' : ''}>
                  <option value="">Pilih Pembimbing Sekolah</option>
                  ${schoolSupervisors.map(supervisor => `
                    <option value="${supervisor.id}" ${student.schoolSupervisorId === supervisor.id ? 'selected' : ''}>
                      ${supervisor.firstName} ${supervisor.lastName}
                    </option>
                  `).join('')}
                </select>
              </div>
            </div>
            
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="startDate" class="form-label">Tanggal Mulai PKL</label>
                <input type="date" class="form-control" id="startDate" value="${student.startDate || ''}">
              </div>
              <div class="col-md-6">
                <label for="endDate" class="form-label">Tanggal Selesai PKL</label>
                <input type="date" class="form-control" id="endDate" value="${student.endDate || ''}">
              </div>
            </div>
            
            <div class="d-flex justify-content-between">
              <button type="button" class="btn btn-secondary" data-page="${PAGES.STUDENTS}">
                <i class="bi bi-arrow-left me-1"></i> Kembali
              </button>
              <button type="submit" class="btn btn-primary">
                <i class="bi bi-save me-1"></i> ${isEditing ? 'Perbarui' : 'Simpan'} Data
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners
  document.getElementById('studentForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const formData = {
      id: isEditing ? student.id : generateId(),
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      nis: document.getElementById('nis').value,
      className: document.getElementById('className').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      address: document.getElementById('address').value,
      companyId: document.getElementById('companyId').value,
      schoolSupervisorId: document.getElementById('schoolSupervisorId').value,
      startDate: document.getElementById('startDate').value,
      endDate: document.getElementById('endDate').value
    };
    
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.nis || !formData.className || !formData.email || !formData.phone) {
      showToast('Silakan lengkapi data yang diperlukan.', 'warning');
      return;
    }
    
    // Check if student with same NIS exists
    const students = getAllStudents();
    const existingStudent = students.find(s => s.nis === formData.nis && s.id !== formData.id);
    if (existingStudent) {
      showToast('NIS sudah terdaftar. Silakan gunakan NIS lain.', 'warning');
      return;
    }
    
    // Save student data
    if (isEditing) {
      // Update existing student
      const updatedStudents = students.map(s => (s.id === formData.id ? formData : s));
      saveToStorage('students', updatedStudents);
      showToast('Data siswa berhasil diperbarui.', 'success');
    } else {
      // Add new student
      const newStudents = [...students, formData];
      saveToStorage('students', newStudents);
      
      // Create user account for student
      const userPassword = formData.nis; // Default password is NIS
      const newUser = {
        id: generateId(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: userPassword, // In real app, this should be hashed
        role: 'student',
        studentId: formData.id
      };
      
      const users = getFromStorage('users') || [];
      const updatedUsers = [...users, newUser];
      saveToStorage('users', updatedUsers);
      
      showToast('Data siswa berhasil ditambahkan.', 'success');
    }
    
    // Clear session storage and go back to students list
    sessionStorage.removeItem('currentStudentId');
    renderPage(PAGES.STUDENTS);
  });
  
  // Add event listener for back button
  document.querySelectorAll('[data-page]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const page = e.currentTarget.getAttribute('data-page');
      sessionStorage.removeItem('currentStudentId');
      renderPage(page);
    });
  });
}

// Render student detail
function renderStudentDetail() {
  if (!appContainer) return;
  
  const studentId = sessionStorage.getItem('currentStudentId');
  if (!studentId) {
    showToast('Data siswa tidak ditemukan.', 'danger');
    renderPage(PAGES.STUDENTS);
    return;
  }
  
  const student = getStudentById(studentId);
  if (!student) {
    showToast('Data siswa tidak ditemukan.', 'danger');
    renderPage(PAGES.STUDENTS);
    return;
  }
  
  // Get related data
  const companies = getFromStorage('companies') || [];
  const users = getFromStorage('users') || [];
  const company = companies.find(c => c.id === student.companyId);
  const schoolSupervisor = users.find(u => u.id === student.schoolSupervisorId);
  const companySupervisor = company ? users.find(u => u.role === 'company_supervisor' && u.companyId === company.id) : null;
  
  // Get student activities
  const journals = getFromStorage('journals') || [];
  const attendances = getFromStorage('attendances') || [];
  const consultations = getFromStorage('consultations') || [];
  
  const studentJournals = journals.filter(j => j.studentId === student.id);
  const studentAttendances = attendances.filter(a => a.studentId === student.id);
  const studentConsultations = consultations.filter(c => c.studentId === student.id);
  
  const currentUser = getCurrentUser();
  const canEdit = currentUser.role === 'admin' || 
                  (currentUser.role === 'school_supervisor' && student.schoolSupervisorId === currentUser.id);
  
  appContainer.innerHTML = `
    <div class="container">
      <div class="card mb-4">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h3>Detail Siswa PKL</h3>
          <div>
            ${canEdit ? `
              <button class="btn btn-warning me-2" data-action="edit">
                <i class="bi bi-pencil me-1"></i> Edit
              </button>
            ` : ''}
            <button class="btn btn-secondary" data-page="${PAGES.STUDENTS}">
              <i class="bi bi-arrow-left me-1"></i> Kembali
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <h5>Informasi Siswa</h5>
              <hr>
              <table class="table">
                <tr>
                  <th width="40%">Nama Lengkap</th>
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
                  <th>Email</th>
                  <td>${student.email}</td>
                </tr>
                <tr>
                  <th>Telepon</th>
                  <td>${student.phone}</td>
                </tr>
                <tr>
                  <th>Alamat</th>
                  <td>${student.address}</td>
                </tr>
              </table>
            </div>
            <div class="col-md-6">
              <h5>Informasi PKL</h5>
              <hr>
              <table class="table">
                <tr>
                  <th width="40%">Tempat PKL</th>
                  <td>${company ? company.name : 'Belum ditentukan'}</td>
                </tr>
                <tr>
                  <th>Alamat PKL</th>
                  <td>${company ? company.address : 'Belum ditentukan'}</td>
                </tr>
                <tr>
                  <th>Pembimbing Sekolah</th>
                  <td>${schoolSupervisor ? `${schoolSupervisor.firstName} ${schoolSupervisor.lastName}` : 'Belum ditentukan'}</td>
                </tr>
                <tr>
                  <th>Pembimbing DU/DI</th>
                  <td>${companySupervisor ? `${companySupervisor.firstName} ${companySupervisor.lastName}` : 'Belum ditentukan'}</td>
                </tr>
                <tr>
                  <th>Periode PKL</th>
                  <td>
                    ${student.startDate ? formatDate(student.startDate) : 'Belum ditentukan'} - 
                    ${student.endDate ? formatDate(student.endDate) : 'Belum ditentukan'}
                  </td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>
                    ${(() => {
                      if (!student.startDate || !student.endDate) return '<span class="text-secondary">Belum Mulai</span>';
                      
                      const now = new Date();
                      const start = new Date(student.startDate);
                      const end = new Date(student.endDate);
                      
                      if (now < start) {
                        return '<span class="text-secondary">Belum Mulai</span>';
                      } else if (now > end) {
                        return '<span class="text-success">Selesai</span>';
                      } else {
                        return '<span class="text-primary">Aktif</span>';
                      }
                    })()}
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <div class="row">
        <div class="col-md-4">
          <div class="card mb-4">
            <div class="card-header bg-success text-white">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="mb-0"><i class="bi bi-journal-text me-2"></i> Jurnal Kegiatan</h5>
                <span class="badge bg-light text-dark">${studentJournals.length}</span>
              </div>
            </div>
            <div class="card-body">
              <p>Jurnal kegiatan harian selama PKL.</p>
              <button class="btn btn-outline-success" data-page="${PAGES.JOURNALS}">
                Lihat Jurnal <i class="bi bi-arrow-right ms-1"></i>
              </button>
            </div>
          </div>
        </div>
        
        <div class="col-md-4">
          <div class="card mb-4">
            <div class="card-header bg-danger text-white">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="mb-0"><i class="bi bi-calendar-check me-2"></i> Absensi</h5>
                <span class="badge bg-light text-dark">${studentAttendances.length}</span>
              </div>
            </div>
            <div class="card-body">
              <p>Rekap kehadiran selama PKL.</p>
              <button class="btn btn-outline-danger" data-page="${PAGES.ATTENDANCE}">
                Lihat Absensi <i class="bi bi-arrow-right ms-1"></i>
              </button>
            </div>
          </div>
        </div>
        
        <div class="col-md-4">
          <div class="card mb-4">
            <div class="card-header bg-secondary text-white">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="mb-0"><i class="bi bi-chat-dots me-2"></i> Konsultasi</h5>
                <span class="badge bg-light text-dark">${studentConsultations.length}</span>
              </div>
            </div>
            <div class="card-body">
              <p>Daftar konsultasi dengan pembimbing.</p>
              <button class="btn btn-outline-secondary" data-page="${PAGES.CONSULTATIONS}">
                Lihat Konsultasi <i class="bi bi-arrow-right ms-1"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners
  document.querySelectorAll('[data-page]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const page = e.currentTarget.getAttribute('data-page');
      renderPage(page);
    });
  });
  
  // Add edit button event listener
  document.querySelector('[data-action="edit"]')?.addEventListener('click', () => {
    renderPage(PAGES.STUDENT_FORM);
  });
}

// Delete student
function deleteStudent(studentId) {
  if (!studentId) return;
  
  // Get all students
  const students = getAllStudents();
  
  // Remove student
  const updatedStudents = students.filter(student => student.id !== studentId);
  
  // Save updated students
  saveToStorage('students', updatedStudents);
  
  // Remove student user account
  const users = getFromStorage('users') || [];
  const updatedUsers = users.filter(user => user.role !== 'student' || user.studentId !== studentId);
  saveToStorage('users', updatedUsers);
  
  showToast('Data siswa berhasil dihapus.', 'success');
  
  // Refresh student list
  renderPage(PAGES.STUDENTS);
}
