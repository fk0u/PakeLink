/**
 * Authentication-related functionality
 */

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
const loginLink = document.getElementById('loginLink');
const registerLink = document.getElementById('registerLink');
const loginError = document.getElementById('loginError');
const registerError = document.getElementById('registerError');

// Event Listeners
if (loginForm) {
  loginForm.addEventListener('submit', handleLogin);
}

if (registerForm) {
  registerForm.addEventListener('submit', handleRegister);
}

if (loginLink) {
  loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerModal.hide();
    loginModal.show();
  });
}

if (registerLink) {
  registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.hide();
    registerModal.show();
  });
}

// Login handler
function handleLogin(e) {
  e.preventDefault();
  
  // Get form values
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  
  // Get users from storage
  const users = getUsers();
  
  // Find user
  const user = users.find(
    u => (u.username === username || u.email === username) && u.password === password
  );
  
  if (user) {
    // Set current user without password
    const { password, ...userWithoutPassword } = user;
    saveCurrentUser(userWithoutPassword);
    
    // Close modal
    loginModal.hide();
    
    // Show success message
    showToast('Login berhasil! Selamat datang kembali.', 'success');
    
    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } else {
    // Show error message
    loginError.textContent = 'Username atau password salah!';
    loginError.classList.remove('d-none');
  }
}

// Register handler
function handleRegister(e) {
  e.preventDefault();
  
  // Get form values
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const username = document.getElementById('registerUsername').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const role = document.getElementById('userRole').value;
  
  // Basic validation
  if (password !== confirmPassword) {
    registerError.textContent = 'Password dan konfirmasi password tidak cocok!';
    registerError.classList.remove('d-none');
    return;
  }
  
  // Get users from storage
  const users = getUsers();
  
  // Check if username or email already exists
  if (users.some(u => u.username === username)) {
    registerError.textContent = 'Username sudah digunakan!';
    registerError.classList.remove('d-none');
    return;
  }
  
  if (users.some(u => u.email === email)) {
    registerError.textContent = 'Email sudah digunakan!';
    registerError.classList.remove('d-none');
    return;
  }
  
  // Create new user
  const newUser = {
    id: generateId(),
    username,
    email,
    password,
    firstName,
    lastName,
    role,
    isActive: true,
    createdAt: new Date().toISOString()
  };
  
  // Add to users
  users.push(newUser);
  saveUsers(users);
  
  // Set current user without password
  const { password: pass, ...userWithoutPassword } = newUser;
  saveCurrentUser(userWithoutPassword);
  
  // Close modal
  registerModal.hide();
  
  // Show success message
  showToast('Registrasi berhasil! Selamat datang di PakeLink.', 'success');
  
  // Redirect to dashboard
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
}

// Logout handler
function logout() {
  clearCurrentUser();
  showToast('Logout berhasil!', 'success');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
}

// Check if user is logged in
function isLoggedIn() {
  return !!getCurrentUser();
}

// Check user role
function hasRole(roles) {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    return false;
  }
  
  if (typeof roles === 'string') {
    return currentUser.role === roles;
  }
  
  return roles.includes(currentUser.role);
}

// Get user by ID
function getUserById(userId) {
  const users = getUsers();
  return users.find(user => user.id === userId);
}

// Get user's full name
function getUserFullName(userId) {
  const user = getUserById(userId);
  return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
}
