/**
 * PakeLink - Login and Registration functionality
 */

// Render login page
function renderLoginPage() {
  appContainer.innerHTML = `
    <div class="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 my-8">
      <div class="bg-primary-700 px-6 py-8 text-white text-center">
        <h1 class="text-2xl font-bold mb-2">Login PakeLink</h1>
        <p>Masuk ke akun Anda</p>
      </div>
      
      <div class="p-6">
        <form id="loginForm" class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input type="text" id="username" name="username" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500" required>
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" id="password" name="password" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500" required>
          </div>
          
          <div class="flex items-center">
            <input type="checkbox" id="remember" name="remember" class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded">
            <label for="remember" class="ml-2 block text-sm text-gray-700">Ingat saya</label>
          </div>
          
          <div>
            <button type="submit" class="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition duration-300">Login</button>
          </div>
        </form>
        
        <div class="mt-4 text-center text-sm">
          <p>Belum punya akun? <a href="#" id="registerLink" class="text-primary-600 hover:text-primary-800">Register</a></p>
        </div>
        
        <div class="mt-8 pt-6 border-t border-gray-200">
          <h3 class="text-center text-sm font-medium text-gray-500 mb-4">Demo Accounts</h3>
          <div class="space-y-2">
            <button type="button" class="login-demo w-full text-left text-sm py-1 px-2 rounded hover:bg-gray-100" data-username="admin" data-password="admin123" data-role="admin">
              <span class="badge badge-blue">Admin</span> admin / admin123
            </button>
            <button type="button" class="login-demo w-full text-left text-sm py-1 px-2 rounded hover:bg-gray-100" data-username="guru" data-password="guru123" data-role="school_supervisor">
              <span class="badge badge-green">Guru</span> guru / guru123
            </button>
            <button type="button" class="login-demo w-full text-left text-sm py-1 px-2 rounded hover:bg-gray-100" data-username="dudi" data-password="dudi123" data-role="company_supervisor">
              <span class="badge badge-purple">DU/DI</span> dudi / dudi123
            </button>
            <button type="button" class="login-demo w-full text-left text-sm py-1 px-2 rounded hover:bg-gray-100" data-username="siswa" data-password="siswa123" data-role="student">
              <span class="badge badge-yellow">Siswa</span> siswa / siswa123
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
  document.getElementById('registerLink').addEventListener('click', (e) => {
    e.preventDefault();
    renderPage('register');
  });
  
  // Add event listeners for demo accounts
  document.querySelectorAll('.login-demo').forEach(button => {
    button.addEventListener('click', () => {
      document.getElementById('username').value = button.getAttribute('data-username');
      document.getElementById('password').value = button.getAttribute('data-password');
    });
  });
}

// Handle login form submission
function handleLogin(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const remember = document.getElementById('remember').checked;
  
  // Since we're using localStorage instead of a real authentication system,
  // we'll check for demo accounts
  let user = null;
  
  // Check for demo accounts
  if (username === 'admin' && password === 'admin123') {
    user = {
      id: 'admin-001',
      username: 'admin',
      name: 'Administrator',
      email: 'admin@pakelink.com',
      role: ROLES.ADMIN
    };
  } else if (username === 'guru' && password === 'guru123') {
    user = {
      id: 'guru-001',
      username: 'guru',
      name: 'Pembimbing Sekolah',
      email: 'guru@pakelink.com',
      role: ROLES.SCHOOL_SUPERVISOR
    };
  } else if (username === 'dudi' && password === 'dudi123') {
    user = {
      id: 'dudi-001',
      username: 'dudi',
      name: 'Pembimbing DU/DI',
      email: 'dudi@pakelink.com',
      role: ROLES.COMPANY_SUPERVISOR
    };
  } else if (username === 'siswa' && password === 'siswa123') {
    user = {
      id: 'siswa-001',
      username: 'siswa',
      name: 'Nama Siswa',
      email: 'siswa@pakelink.com',
      role: ROLES.STUDENT
    };
  }
  
  if (user) {
    // Save user to localStorage if remember is checked
    if (remember) {
      PakeLinkStorage.save('currentUser', user);
    }
    
    // Set current user
    currentUser = user;
    
    // Show success message
    PakeLinkSwal.fire({
      title: 'Login Berhasil',
      text: `Selamat datang, ${user.name}!`,
      icon: 'success',
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      // Update navigation and render dashboard
      renderNavigation();
      renderPage(PAGES.DASHBOARD);
    });
  } else {
    // Show error message
    PakeLinkSwal.fire({
      title: 'Login Gagal',
      text: 'Username atau password salah',
      icon: 'error'
    });
  }
}

// Render register page
function renderRegisterPage() {
  appContainer.innerHTML = `
    <div class="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 my-8">
      <div class="bg-primary-700 px-6 py-8 text-white text-center">
        <h1 class="text-2xl font-bold mb-2">Register PakeLink</h1>
        <p>Buat akun baru</p>
      </div>
      
      <div class="p-6">
        <form id="registerForm" class="space-y-4">
          <div>
            <label for="regName" class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input type="text" id="regName" name="name" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500" required>
          </div>
          
          <div>
            <label for="regUsername" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input type="text" id="regUsername" name="username" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500" required>
          </div>
          
          <div>
            <label for="regEmail" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" id="regEmail" name="email" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500" required>
          </div>
          
          <div>
            <label for="regPassword" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" id="regPassword" name="password" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500" required>
          </div>
          
          <div>
            <label for="regConfirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
            <input type="password" id="regConfirmPassword" name="confirmPassword" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500" required>
          </div>
          
          <div>
            <label for="regRole" class="block text-sm font-medium text-gray-700 mb-1">Peran</label>
            <select id="regRole" name="role" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500" required>
              <option value="">Pilih Peran</option>
              <option value="${ROLES.STUDENT}">Siswa</option>
              <option value="${ROLES.SCHOOL_SUPERVISOR}">Pembimbing Sekolah</option>
              <option value="${ROLES.COMPANY_SUPERVISOR}">Pembimbing DU/DI</option>
            </select>
          </div>
          
          <div>
            <button type="submit" class="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition duration-300">Register</button>
          </div>
        </form>
        
        <div class="mt-4 text-center text-sm">
          <p>Sudah punya akun? <a href="#" id="loginLink" class="text-primary-600 hover:text-primary-800">Login</a></p>
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners
  document.getElementById('registerForm').addEventListener('submit', handleRegister);
  document.getElementById('loginLink').addEventListener('click', (e) => {
    e.preventDefault();
    renderPage('login');
  });
}

// Handle register form submission
function handleRegister(e) {
  e.preventDefault();
  
  const name = document.getElementById('regName').value;
  const username = document.getElementById('regUsername').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('regConfirmPassword').value;
  const role = document.getElementById('regRole').value;
  
  // Validate input
  if (password !== confirmPassword) {
    PakeLinkSwal.fire({
      title: 'Error',
      text: 'Password dan konfirmasi password tidak cocok',
      icon: 'error'
    });
    return;
  }
  
  if (!role) {
    PakeLinkSwal.fire({
      title: 'Error',
      text: 'Pilih peran terlebih dahulu',
      icon: 'error'
    });
    return;
  }
  
  // In a real application, we would send this data to a server for registration
  // Since we're using localStorage, we'll just show a success message
  
  PakeLinkSwal.fire({
    title: 'Registrasi Berhasil',
    text: 'Akun Anda telah dibuat. Silakan login dengan akun Anda.',
    icon: 'success'
  }).then(() => {
    renderPage('login');
  });
}
