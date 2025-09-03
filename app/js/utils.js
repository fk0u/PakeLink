/**
 * PakeLink utilities for SweetAlert2 and LocalStorage management
 */

// Custom SweetAlert2 toast notifications
const Toast = Swal.mixin({
  toast: true,
  position: 'bottom-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
  customClass: {
    popup: 'rounded-lg shadow-xl',
    title: 'text-gray-800 font-medium',
  },
  iconColor: '#3b82f6'
});

// Enhanced notifications for different states
const Notify = {
  /**
   * Show success notification
   * @param {string} message - Notification message
   * @param {number} timer - Auto-close timer in ms
   */
  success: function(message, timer = 3000) {
    Toast.fire({
      icon: 'success',
      title: message,
      timer: timer,
      iconColor: '#10b981'
    });
  },
  
  /**
   * Show error notification
   * @param {string} message - Notification message
   * @param {number} timer - Auto-close timer in ms
   */
  error: function(message, timer = 4000) {
    Toast.fire({
      icon: 'error',
      title: message,
      timer: timer,
      iconColor: '#ef4444'
    });
  },
  
  /**
   * Show warning notification
   * @param {string} message - Notification message
   * @param {number} timer - Auto-close timer in ms
   */
  warning: function(message, timer = 4000) {
    Toast.fire({
      icon: 'warning',
      title: message,
      timer: timer,
      iconColor: '#f59e0b'
    });
  },
  
  /**
   * Show info notification
   * @param {string} message - Notification message
   * @param {number} timer - Auto-close timer in ms
   */
  info: function(message, timer = 3000) {
    Toast.fire({
      icon: 'info',
      title: message,
      timer: timer,
      iconColor: '#3b82f6'
    });
  },
  
  /**
   * Show a custom notification with an animated loading icon
   * @param {string} message - Notification message
   * @return {function} close - Function to close the notification
   */
  loading: function(message = 'Memuat...') {
    const toast = Toast.fire({
      title: message,
      timer: null,
      timerProgressBar: false,
      didOpen: (toast) => {
        Swal.showLoading();
      }
    });
    
    return {
      close: function() {
        Swal.close();
      },
      update: function(newMessage) {
        Swal.getTitle().textContent = newMessage;
      }
    };
  }
};

// SweetAlert2 themed for PakeLink
const PakeLinkSwal = Swal.mixin({
  customClass: {
    container: 'swal-container',
    popup: 'rounded-xl shadow-2xl border border-gray-200',
    header: 'border-b border-gray-200 pb-2',
    title: 'text-xl font-bold text-gray-800',
    closeButton: 'focus:outline-none hover:text-red-500',
    icon: 'mb-4',
    image: 'rounded-lg',
    content: 'text-gray-600 my-2',
    htmlContainer: 'text-left',
    input: 'border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-full',
    inputLabel: 'text-gray-700 text-sm font-medium mb-1',
    validationMessage: 'bg-red-100 text-red-600 rounded-md px-3 py-2 text-sm mt-1',
    actions: 'flex justify-end gap-2 mt-4',
    confirmButton: 'px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
    denyButton: 'px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500',
    cancelButton: 'px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500',
    footer: 'mt-4 text-sm text-gray-600 border-t border-gray-200 pt-2'
  },
  buttonsStyling: false,
  heightAuto: false,
  scrollbarPadding: false,
  reverseButtons: true,
  focusConfirm: false,
  showClass: {
    popup: 'animate__animated animate__fadeIn animate__faster'
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOut animate__faster'
  }
});

// Dialog helpers
const Dialog = {
  /**
   * Show a confirmation dialog
   * @param {object} options - Dialog options
   * @returns {Promise} Promise that resolves with the result
   */
  confirm: function({title, text, icon = 'question', confirmText = 'Ya', cancelText = 'Batal', isDangerous = false}) {
    return PakeLinkSwal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      customClass: {
        confirmButton: isDangerous 
          ? 'px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
          : 'px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
      }
    });
  },
  
  /**
   * Show a prompt dialog
   * @param {object} options - Dialog options
   * @returns {Promise} Promise that resolves with the result
   */
  prompt: function({title, text, inputPlaceholder, inputValue = '', inputValidator, icon = 'question'}) {
    return PakeLinkSwal.fire({
      title: title,
      text: text,
      input: 'text',
      icon: icon,
      inputPlaceholder: inputPlaceholder,
      inputValue: inputValue,
      showCancelButton: true,
      inputValidator: inputValidator
    });
  },
  
  /**
   * Show a form dialog with multiple inputs
   * @param {object} options - Dialog options
   * @returns {Promise} Promise that resolves with the result
   */
  form: function({title, html, preConfirm, confirmButtonText = 'Simpan'}) {
    return PakeLinkSwal.fire({
      title: title,
      html: html,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      preConfirm: preConfirm
    });
  }
};

// LocalStorage utilities with data handling and caching
const PakeLinkStorage = {
  // Private caching mechanism
  _cache: {},
  _cacheEnabled: true,
  _prefix: 'pakelink_',
  
  /**
   * Enable or disable the cache
   * @param {boolean} enabled - Whether the cache is enabled
   */
  setCache: function(enabled) {
    this._cacheEnabled = !!enabled;
    if (!enabled) {
      this._cache = {};
    }
  },

  /**
   * Save data to localStorage with caching
   * @param {string} key - The key to store data under
   * @param {any} data - The data to store
   * @param {boolean} bypassCache - Whether to bypass cache for this operation
   */
  save: function(key, data, bypassCache = false) {
    try {
      const fullKey = this._prefix + key;
      const serializedData = JSON.stringify(data);
      
      // Store in localStorage
      localStorage.setItem(fullKey, serializedData);
      
      // Update cache if enabled
      if (this._cacheEnabled && !bypassCache) {
        this._cache[key] = data;
      }
      
      return true;
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
      Notify.error('Gagal menyimpan data. Coba lagi.');
      return false;
    }
  },

  /**
   * Get data from localStorage with caching
   * @param {string} key - The key to retrieve data from
   * @param {any} defaultValue - The default value if key doesn't exist
   * @param {boolean} bypassCache - Whether to bypass cache for this operation
   * @returns {any} The stored data or defaultValue
   */
  get: function(key, defaultValue = null, bypassCache = false) {
    try {
      // Check cache first if enabled and not bypassed
      if (this._cacheEnabled && !bypassCache && key in this._cache) {
        return this._cache[key];
      }
      
      const fullKey = this._prefix + key;
      const serializedData = localStorage.getItem(fullKey);
      
      if (serializedData === null) {
        return defaultValue;
      }
      
      const data = JSON.parse(serializedData);
      
      // Update cache if enabled
      if (this._cacheEnabled && !bypassCache) {
        this._cache[key] = data;
      }
      
      return data;
    } catch (error) {
      console.error('Error retrieving data from localStorage:', error);
      return defaultValue;
    }
  },

  /**
   * Remove data from localStorage and cache
   * @param {string} key - The key to remove
   */
  remove: function(key) {
    try {
      const fullKey = this._prefix + key;
      localStorage.removeItem(fullKey);
      
      // Remove from cache if present
      if (key in this._cache) {
        delete this._cache[key];
      }
      
      return true;
    } catch (error) {
      console.error('Error removing data from localStorage:', error);
      return false;
    }
  },

  /**
   * Check if key exists in localStorage or cache
   * @param {string} key - The key to check
   * @param {boolean} checkCacheOnly - Whether to only check the cache
   * @returns {boolean} True if key exists
   */
  exists: function(key, checkCacheOnly = false) {
    // Check cache first if enabled
    if (this._cacheEnabled && key in this._cache) {
      return true;
    }
    
    // If checking cache only, return false at this point
    if (checkCacheOnly) {
      return false;
    }
    
    // Otherwise check localStorage
    return localStorage.getItem(this._prefix + key) !== null;
  },

  /**
   * Get all keys in localStorage that belong to PakeLink
   * @returns {string[]} Array of keys
   */
  getAllKeys: function() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this._prefix)) {
        keys.push(key.replace(this._prefix, ''));
      }
    }
    return keys;
  },

  /**
   * Clear all PakeLink data from localStorage and cache
   */
  clearAll: function() {
    const keys = this.getAllKeys();
    keys.forEach(key => this.remove(key));
    this._cache = {};
    return keys.length;
  },

  /**
   * Get the storage usage information
   * @returns {Object} Storage usage stats
   */
  getStorageInfo: function() {
    let totalSize = 0;
    let itemCount = 0;
    
    const keys = this.getAllKeys();
    keys.forEach(key => {
      const item = localStorage.getItem(this._prefix + key);
      if (item) {
        totalSize += item.length * 2; // Unicode characters take up 2 bytes
        itemCount++;
      }
    });
    
    return {
      itemCount,
      totalSize,
      totalSizeInKB: (totalSize / 1024).toFixed(2),
      percentUsed: ((totalSize / (5 * 1024 * 1024)) * 100).toFixed(2) // 5MB limit
    };
  },
  
  /**
   * Backup all PakeLink data to a downloadable file
   * @returns {Object} Result of the backup operation
   */
  backup: function() {
    try {
      const keys = this.getAllKeys();
      const backup = {};
      
      keys.forEach(key => {
        backup[key] = this.get(key);
      });
      
      const blob = new Blob([JSON.stringify(backup, null, 2)], {type: 'application/json'});
      const url = URL.createObjectURL(blob);
      
      // Create temporary link and click it
      const a = document.createElement('a');
      a.href = url;
      a.download = `pakelink_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return {
        success: true,
        count: keys.length,
        message: `${keys.length} item berhasil dicadangkan`
      };
    } catch (error) {
      console.error('Error creating backup:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  /**
   * Restore PakeLink data from a backup file
   * @param {File} file - The backup file to restore from
   * @returns {Promise<Object>} Promise that resolves with the result
   */
  restore: function(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const backup = JSON.parse(event.target.result);
          let count = 0;
          
          for (const key in backup) {
            if (backup.hasOwnProperty(key)) {
              this.save(key, backup[key]);
              count++;
            }
          }
          
          resolve({
            success: true,
            count,
            message: `${count} item berhasil dipulihkan`
          });
        } catch (error) {
          console.error('Error restoring backup:', error);
          reject({
            success: false,
            error: error.message
          });
        }
      };
      
      reader.onerror = (error) => {
        reject({
          success: false,
          error: 'Error membaca file'
        });
      };
      
      reader.readAsText(file);
    });
  }
};

// Data models (schemas)
const DataModels = {
  // User model
  User: {
    create: function(userData) {
      const requiredFields = ['username', 'email', 'role'];
      const missingFields = requiredFields.filter(field => !userData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
      
      const user = {
        id: userData.id || generateUniqueId(),
        username: userData.username,
        email: userData.email,
        role: userData.role,
        name: userData.name || userData.username,
        profilePicture: userData.profilePicture || null,
        createdAt: userData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return user;
    },
    
    validate: function(user) {
      const requiredFields = ['id', 'username', 'email', 'role'];
      const missingFields = requiredFields.filter(field => !user[field]);
      
      if (missingFields.length > 0) {
        return {
          valid: false,
          errors: `Missing required fields: ${missingFields.join(', ')}`
        };
      }
      
      if (!['admin', 'school_supervisor', 'company_supervisor', 'student'].includes(user.role)) {
        return {
          valid: false,
          errors: 'Invalid role'
        };
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(user.email)) {
        return {
          valid: false,
          errors: 'Invalid email format'
        };
      }
      
      return { valid: true };
    }
  },
  
  // Add other models here (Student, Company, Journal, etc.)
};

// Utility for date and time formatting
const DateUtils = {
  /**
   * Format date to Indonesian format
   * @param {string|Date} dateString - Date to format
   * @returns {string} Formatted date
   */
  formatDate: function(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  },
  
  /**
   * Format date and time to Indonesian format
   * @param {string|Date} dateString - Date to format
   * @returns {string} Formatted date and time
   */
  formatDateTime: function(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },
  
  /**
   * Format relative time (e.g., "5 minutes ago")
   * @param {string|Date} dateString - Date to format
   * @returns {string} Relative time
   */
  formatRelativeTime: function(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);
    
    if (diffSec < 60) {
      return 'Baru saja';
    } else if (diffMin < 60) {
      return `${diffMin} menit yang lalu`;
    } else if (diffHr < 24) {
      return `${diffHr} jam yang lalu`;
    } else if (diffDays < 7) {
      return `${diffDays} hari yang lalu`;
    } else {
      return this.formatDate(date);
    }
  },
  
  /**
   * Get day name in Indonesian
   * @param {string|Date} dateString - Date to get day name from
   * @returns {string} Day name
   */
  getDayName: function(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { weekday: 'long' });
  }
};

// Helper functions
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Export utilities for global use
window.Toast = Toast;
window.Notify = Notify;
window.PakeLinkSwal = PakeLinkSwal;
window.Dialog = Dialog;
window.PakeLinkStorage = PakeLinkStorage;
window.DataModels = DataModels;
window.DateUtils = DateUtils;
window.generateUniqueId = generateUniqueId;
