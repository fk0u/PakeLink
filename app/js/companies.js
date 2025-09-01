/**
 * Companies management functionality
 */

// DOM Elements
const appContainer = document.getElementById('app');

// Get all companies
function getAllCompanies() {
  return getFromStorage('companies') || [];
}

// Get company by ID
function getCompanyById(id) {
  const companies = getAllCompanies();
  return companies.find(company => company.id === id);
}

// Render companies list
function renderCompaniesList() {
  if (!appContainer) return;
  
  const companies = getAllCompanies();
  const currentUser = getCurrentUser();
  
  // Filter companies based on user role
  let filteredCompanies = companies;
  
  if (currentUser.role === 'school_supervisor') {
    // Filter companies that have students assigned to this school supervisor
    const students = getFromStorage('students') || [];
    const supervisingStudentIds = students
      .filter(student => student.schoolSupervisorId === currentUser.id)
      .map(student => student.id);
    
    filteredCompanies = companies.filter(company => {
      return students.some(student => 
        student.companyId === company.id && 
        supervisingStudentIds.includes(student.id)
      );
    });
  } else if (currentUser.role === 'company_supervisor') {
    // Show only the company associated with this supervisor
    filteredCompanies = companies.filter(company => company.id === currentUser.companyId);
  }
  
  const canAddCompany = currentUser.role === 'admin';
  
  appContainer.innerHTML = `
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3>Daftar Tempat PKL</h3>
        ${canAddCompany ? `
          <button class="btn btn-primary" data-page="${PAGES.COMPANY_FORM}">
            <i class="bi bi-plus-circle me-1"></i> Tambah Tempat PKL
          </button>
        ` : ''}
      </div>
      
      <div class="card mb-4">
        <div class="card-header bg-light">
          <div class="row">
            <div class="col-md-6">
              <input type="text" id="searchCompanies" class="form-control" placeholder="Cari tempat PKL...">
            </div>
            <div class="col-md-6">
              <select id="filterCompanies" class="form-select">
                <option value="all">Semua Bidang</option>
                <option value="IT">Teknologi Informasi</option>
                <option value="hospitality">Perhotelan</option>
                <option value="administration">Administrasi</option>
                <option value="other">Lainnya</option>
              </select>
            </div>
          </div>
        </div>
        <div class="card-body">
          ${filteredCompanies.length > 0 ? `
            <div class="row">
              ${filteredCompanies.map(company => {
                // Get company supervisor
                const users = getFromStorage('users') || [];
                const supervisor = users.find(u => u.role === 'company_supervisor' && u.companyId === company.id);
                
                // Get student count for this company
                const students = getFromStorage('students') || [];
                const studentCount = students.filter(student => student.companyId === company.id).length;
                
                return `
                  <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card h-100">
                      <div class="card-header">
                        <h5 class="card-title mb-0">${company.name}</h5>
                      </div>
                      <div class="card-body">
                        <p><i class="bi bi-geo-alt me-2"></i> ${company.address}</p>
                        <p><i class="bi bi-briefcase me-2"></i> ${company.industry || 'Tidak ditentukan'}</p>
                        <p><i class="bi bi-person-badge me-2"></i> ${supervisor ? `${supervisor.firstName} ${supervisor.lastName}` : 'Belum ada pembimbing'}</p>
                        <p><i class="bi bi-people me-2"></i> ${studentCount} siswa PKL</p>
                        <div class="d-flex justify-content-end mt-3">
                          <button class="btn btn-sm btn-info me-2 view-company" data-id="${company.id}">
                            <i class="bi bi-eye me-1"></i> Detail
                          </button>
                          ${currentUser.role === 'admin' ? `
                            <button class="btn btn-sm btn-warning me-2 edit-company" data-id="${company.id}">
                              <i class="bi bi-pencil me-1"></i> Edit
                            </button>
                            <button class="btn btn-sm btn-danger delete-company" data-id="${company.id}">
                              <i class="bi bi-trash me-1"></i> Hapus
                            </button>
                          ` : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          ` : `
            <div class="text-center py-4">
              <i class="bi bi-building display-4 text-muted"></i>
              <p class="lead mt-3">Belum ada data tempat PKL.</p>
              ${canAddCompany ? `
                <button class="btn btn-primary" data-page="${PAGES.COMPANY_FORM}">
                  <i class="bi bi-plus-circle me-1"></i> Tambah Tempat PKL
                </button>
              ` : ''}
            </div>
          `}
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners
  if (filteredCompanies.length > 0) {
    // View company detail
    document.querySelectorAll('.view-company').forEach(button => {
      button.addEventListener('click', (e) => {
        const companyId = e.currentTarget.getAttribute('data-id');
        sessionStorage.setItem('currentCompanyId', companyId);
        renderPage(PAGES.COMPANY_DETAIL);
      });
    });
    
    // Edit company
    document.querySelectorAll('.edit-company').forEach(button => {
      button.addEventListener('click', (e) => {
        const companyId = e.currentTarget.getAttribute('data-id');
        sessionStorage.setItem('currentCompanyId', companyId);
        renderPage(PAGES.COMPANY_FORM);
      });
    });
    
    // Delete company
    document.querySelectorAll('.delete-company').forEach(button => {
      button.addEventListener('click', (e) => {
        const companyId = e.currentTarget.getAttribute('data-id');
        if (confirm('Apakah Anda yakin ingin menghapus data tempat PKL ini?')) {
          deleteCompany(companyId);
        }
      });
    });
    
    // Search companies
    const searchInput = document.getElementById('searchCompanies');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const companyCards = document.querySelectorAll('.card-title');
        
        companyCards.forEach(card => {
          const parentCol = card.closest('.col-md-6');
          const companyName = card.textContent.toLowerCase();
          
          if (parentCol) {
            parentCol.style.display = companyName.includes(searchTerm) ? '' : 'none';
          }
        });
      });
    }
    
    // Filter companies
    const filterSelect = document.getElementById('filterCompanies');
    if (filterSelect) {
      filterSelect.addEventListener('change', (e) => {
        const filterValue = e.target.value;
        const companyCards = document.querySelectorAll('.card');
        
        companyCards.forEach(card => {
          const parentCol = card.closest('.col-md-6');
          const industryText = card.querySelector('.bi-briefcase').parentNode.textContent.toLowerCase();
          
          if (parentCol) {
            if (filterValue === 'all') {
              parentCol.style.display = '';
            } else if (filterValue === 'IT' && industryText.includes('teknologi informasi')) {
              parentCol.style.display = '';
            } else if (filterValue === 'hospitality' && industryText.includes('perhotelan')) {
              parentCol.style.display = '';
            } else if (filterValue === 'administration' && industryText.includes('administrasi')) {
              parentCol.style.display = '';
            } else if (filterValue === 'other' && 
                      !industryText.includes('teknologi informasi') && 
                      !industryText.includes('perhotelan') && 
                      !industryText.includes('administrasi')) {
              parentCol.style.display = '';
            } else {
              parentCol.style.display = 'none';
            }
          }
        });
      });
    }
  }
  
  // Add event listener for "Add Company" button
  document.querySelectorAll('[data-page]').forEach(button => {
    button.addEventListener('click', (e) => {
      const page = e.currentTarget.getAttribute('data-page');
      renderPage(page);
    });
  });
}

// Render company form (add/edit)
function renderCompanyForm() {
  if (!appContainer) return;
  
  const currentUser = getCurrentUser();
  
  // Check permission
  if (currentUser.role !== 'admin') {
    showToast('Anda tidak memiliki izin untuk menambah atau mengedit data tempat PKL.', 'danger');
    renderPage(PAGES.DASHBOARD);
    return;
  }
  
  // Check if editing existing company
  const companyId = sessionStorage.getItem('currentCompanyId');
  const isEditing = !!companyId;
  let company = {
    name: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    website: '',
    industry: '',
    description: ''
  };
  
  if (isEditing) {
    const existingCompany = getCompanyById(companyId);
    if (existingCompany) {
      company = { ...existingCompany };
    }
  }
  
  appContainer.innerHTML = `
    <div class="container">
      <div class="card">
        <div class="card-header">
          <h3>${isEditing ? 'Edit' : 'Tambah'} Tempat PKL</h3>
        </div>
        <div class="card-body">
          <form id="companyForm">
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="name" class="form-label">Nama Perusahaan/Instansi</label>
                <input type="text" class="form-control" id="name" value="${company.name}" required>
              </div>
              <div class="col-md-6">
                <label for="industry" class="form-label">Bidang Usaha</label>
                <select class="form-select" id="industry">
                  <option value="" ${!company.industry ? 'selected' : ''}>Pilih Bidang Usaha</option>
                  <option value="Teknologi Informasi" ${company.industry === 'Teknologi Informasi' ? 'selected' : ''}>Teknologi Informasi</option>
                  <option value="Perhotelan" ${company.industry === 'Perhotelan' ? 'selected' : ''}>Perhotelan</option>
                  <option value="Administrasi" ${company.industry === 'Administrasi' ? 'selected' : ''}>Administrasi</option>
                  <option value="Lainnya" ${company.industry === 'Lainnya' ? 'selected' : ''}>Lainnya</option>
                </select>
              </div>
            </div>
            
            <div class="mb-3">
              <label for="address" class="form-label">Alamat</label>
              <textarea class="form-control" id="address" rows="3" required>${company.address}</textarea>
            </div>
            
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="city" class="form-label">Kota</label>
                <input type="text" class="form-control" id="city" value="${company.city}" required>
              </div>
              <div class="col-md-6">
                <label for="phone" class="form-label">Telepon</label>
                <input type="tel" class="form-control" id="phone" value="${company.phone}" required>
              </div>
            </div>
            
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" value="${company.email}">
              </div>
              <div class="col-md-6">
                <label for="website" class="form-label">Website</label>
                <input type="url" class="form-control" id="website" value="${company.website}">
              </div>
            </div>
            
            <div class="mb-3">
              <label for="description" class="form-label">Deskripsi</label>
              <textarea class="form-control" id="description" rows="4">${company.description}</textarea>
            </div>
            
            <div class="d-flex justify-content-between">
              <button type="button" class="btn btn-secondary" data-page="${PAGES.COMPANIES}">
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
  document.getElementById('companyForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const formData = {
      id: isEditing ? company.id : generateId(),
      name: document.getElementById('name').value,
      address: document.getElementById('address').value,
      city: document.getElementById('city').value,
      phone: document.getElementById('phone').value,
      email: document.getElementById('email').value,
      website: document.getElementById('website').value,
      industry: document.getElementById('industry').value,
      description: document.getElementById('description').value
    };
    
    // Validate form
    if (!formData.name || !formData.address || !formData.city || !formData.phone) {
      showToast('Silakan lengkapi data yang diperlukan.', 'warning');
      return;
    }
    
    // Save company data
    const companies = getAllCompanies();
    
    if (isEditing) {
      // Update existing company
      const updatedCompanies = companies.map(c => (c.id === formData.id ? formData : c));
      saveToStorage('companies', updatedCompanies);
      showToast('Data tempat PKL berhasil diperbarui.', 'success');
    } else {
      // Add new company
      const newCompanies = [...companies, formData];
      saveToStorage('companies', newCompanies);
      showToast('Data tempat PKL berhasil ditambahkan.', 'success');
    }
    
    // Clear session storage and go back to companies list
    sessionStorage.removeItem('currentCompanyId');
    renderPage(PAGES.COMPANIES);
  });
  
  // Add event listener for back button
  document.querySelectorAll('[data-page]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const page = e.currentTarget.getAttribute('data-page');
      sessionStorage.removeItem('currentCompanyId');
      renderPage(page);
    });
  });
}

// Render company detail
function renderCompanyDetail() {
  if (!appContainer) return;
  
  const companyId = sessionStorage.getItem('currentCompanyId');
  if (!companyId) {
    showToast('Data tempat PKL tidak ditemukan.', 'danger');
    renderPage(PAGES.COMPANIES);
    return;
  }
  
  const company = getCompanyById(companyId);
  if (!company) {
    showToast('Data tempat PKL tidak ditemukan.', 'danger');
    renderPage(PAGES.COMPANIES);
    return;
  }
  
  // Get company supervisor
  const users = getFromStorage('users') || [];
  const supervisor = users.find(u => u.role === 'company_supervisor' && u.companyId === companyId);
  
  // Get students for this company
  const students = getFromStorage('students') || [];
  const companyStudents = students.filter(student => student.companyId === companyId);
  
  const currentUser = getCurrentUser();
  const canEdit = currentUser.role === 'admin';
  const canAddSupervisor = currentUser.role === 'admin' && !supervisor;
  
  appContainer.innerHTML = `
    <div class="container">
      <div class="card mb-4">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h3>Detail Tempat PKL</h3>
          <div>
            ${canEdit ? `
              <button class="btn btn-warning me-2" data-action="edit">
                <i class="bi bi-pencil me-1"></i> Edit
              </button>
            ` : ''}
            <button class="btn btn-secondary" data-page="${PAGES.COMPANIES}">
              <i class="bi bi-arrow-left me-1"></i> Kembali
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <h5>Informasi Tempat PKL</h5>
              <hr>
              <table class="table">
                <tr>
                  <th width="40%">Nama</th>
                  <td>${company.name}</td>
                </tr>
                <tr>
                  <th>Bidang Usaha</th>
                  <td>${company.industry || 'Tidak ditentukan'}</td>
                </tr>
                <tr>
                  <th>Alamat</th>
                  <td>${company.address}, ${company.city}</td>
                </tr>
                <tr>
                  <th>Telepon</th>
                  <td>${company.phone}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>${company.email || 'Tidak ada'}</td>
                </tr>
                <tr>
                  <th>Website</th>
                  <td>${company.website ? `<a href="${company.website}" target="_blank">${company.website}</a>` : 'Tidak ada'}</td>
                </tr>
              </table>
              
              <h5 class="mt-4">Deskripsi</h5>
              <hr>
              <p>${company.description || 'Tidak ada deskripsi.'}</p>
            </div>
            <div class="col-md-6">
              <h5>Pembimbing DU/DI</h5>
              <hr>
              ${supervisor ? `
                <table class="table">
                  <tr>
                    <th width="40%">Nama</th>
                    <td>${supervisor.firstName} ${supervisor.lastName}</td>
                  </tr>
                  <tr>
                    <th>Email</th>
                    <td>${supervisor.email}</td>
                  </tr>
                  <tr>
                    <th>Telepon</th>
                    <td>${supervisor.phone || 'Tidak ada'}</td>
                  </tr>
                </table>
              ` : `
                <div class="alert alert-warning">
                  <i class="bi bi-exclamation-triangle me-2"></i> Belum ada pembimbing DU/DI terdaftar.
                  ${canAddSupervisor ? `
                    <button class="btn btn-primary btn-sm mt-2" data-bs-toggle="modal" data-bs-target="#addSupervisorModal">
                      <i class="bi bi-plus-circle me-1"></i> Tambah Pembimbing
                    </button>
                  ` : ''}
                </div>
              `}
              
              <h5 class="mt-4">Siswa PKL</h5>
              <hr>
              ${companyStudents.length > 0 ? `
                <div class="list-group">
                  ${companyStudents.map(student => `
                    <a href="#" class="list-group-item list-group-item-action view-student" data-id="${student.id}">
                      <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">${student.firstName} ${student.lastName}</h6>
                        <small>${student.className}</small>
                      </div>
                      <small>NIS: ${student.nis}</small>
                    </a>
                  `).join('')}
                </div>
              ` : `
                <div class="alert alert-info">
                  <i class="bi bi-info-circle me-2"></i> Belum ada siswa PKL di tempat ini.
                </div>
              `}
            </div>
          </div>
        </div>
      </div>
      
      ${canAddSupervisor ? `
        <!-- Add Supervisor Modal -->
        <div class="modal fade" id="addSupervisorModal" tabindex="-1" aria-labelledby="addSupervisorModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="addSupervisorModalLabel">Tambah Pembimbing DU/DI</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <form id="supervisorForm">
                  <div class="mb-3">
                    <label for="firstName" class="form-label">Nama Depan</label>
                    <input type="text" class="form-control" id="firstName" required>
                  </div>
                  <div class="mb-3">
                    <label for="lastName" class="form-label">Nama Belakang</label>
                    <input type="text" class="form-control" id="lastName" required>
                  </div>
                  <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" required>
                  </div>
                  <div class="mb-3">
                    <label for="phone" class="form-label">Telepon</label>
                    <input type="tel" class="form-control" id="phone">
                  </div>
                  <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password" required>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                <button type="button" class="btn btn-primary" id="saveSupervisor">Simpan</button>
              </div>
            </div>
          </div>
        </div>
      ` : ''}
    </div>
  `;
  
  // Add event listeners
  document.querySelectorAll('[data-page]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const page = e.currentTarget.getAttribute('data-page');
      sessionStorage.removeItem('currentCompanyId');
      renderPage(page);
    });
  });
  
  // Add edit button event listener
  document.querySelector('[data-action="edit"]')?.addEventListener('click', () => {
    renderPage(PAGES.COMPANY_FORM);
  });
  
  // Add view student event listeners
  document.querySelectorAll('.view-student').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const studentId = e.currentTarget.getAttribute('data-id');
      sessionStorage.setItem('currentStudentId', studentId);
      renderPage(PAGES.STUDENT_DETAIL);
    });
  });
  
  // Add save supervisor event listener
  document.getElementById('saveSupervisor')?.addEventListener('click', () => {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    
    if (!firstName || !lastName || !email || !password) {
      showToast('Silakan lengkapi data yang diperlukan.', 'warning');
      return;
    }
    
    // Check if email is already registered
    const users = getFromStorage('users') || [];
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
      showToast('Email sudah terdaftar. Silakan gunakan email lain.', 'warning');
      return;
    }
    
    // Create new supervisor
    const newSupervisor = {
      id: generateId(),
      firstName,
      lastName,
      email,
      phone,
      password, // In real app, this should be hashed
      role: 'company_supervisor',
      companyId
    };
    
    // Save supervisor
    const updatedUsers = [...users, newSupervisor];
    saveToStorage('users', updatedUsers);
    
    // Close modal and show success message
    const modal = bootstrap.Modal.getInstance(document.getElementById('addSupervisorModal'));
    modal.hide();
    
    showToast('Pembimbing DU/DI berhasil ditambahkan.', 'success');
    
    // Refresh page
    renderCompanyDetail();
  });
}

// Delete company
function deleteCompany(companyId) {
  if (!companyId) return;
  
  // Get all companies
  const companies = getAllCompanies();
  
  // Check if company has students assigned
  const students = getFromStorage('students') || [];
  const hasStudents = students.some(student => student.companyId === companyId);
  
  if (hasStudents) {
    showToast('Tidak dapat menghapus tempat PKL karena masih ada siswa yang terdaftar.', 'danger');
    return;
  }
  
  // Remove company
  const updatedCompanies = companies.filter(company => company.id !== companyId);
  
  // Save updated companies
  saveToStorage('companies', updatedCompanies);
  
  // Remove company supervisors
  const users = getFromStorage('users') || [];
  const updatedUsers = users.filter(user => user.role !== 'company_supervisor' || user.companyId !== companyId);
  saveToStorage('users', updatedUsers);
  
  showToast('Data tempat PKL berhasil dihapus.', 'success');
  
  // Refresh companies list
  renderPage(PAGES.COMPANIES);
}
