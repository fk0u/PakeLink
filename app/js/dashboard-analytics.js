/**
 * Dashboard Charts & Analytics
 */

// Dashboard chart initialization
function initDashboardCharts() {
  // Event listener untuk periode chart
  const chartPeriodSelect = document.getElementById('chartPeriodSelect');
  if (chartPeriodSelect) {
    chartPeriodSelect.addEventListener('change', function() {
      // Implementasi untuk mengubah data grafik berdasarkan periode yang dipilih
      // Di implementasi nyata, ini akan memanggil API atau mengakses data lokal
      console.log('Periode grafik diubah ke:', this.value);
      Notify.info(`Data grafik diperbarui untuk periode: ${this.value}`);
    });
  }
  
  // Implementasi chart akan menggunakan library seperti Chart.js di implementasi sebenarnya
  // Di sini kita hanya simulasikan bahwa chart sudah diinisialisasi
  console.log('Dashboard charts initialized');
}

// Analytics data handler
const Analytics = {
  // Mendapatkan data analitik untuk dashboard
  getDashboardData: function(period = 'month') {
    // Simulasi mendapatkan data dari server atau localStorage
    return {
      journals: {
        count: 348,
        trend: '+12.5%',
        growth: true
      },
      attendance: {
        rate: '98.2%',
        trend: '+8.2%',
        growth: true
      },
      consultations: {
        count: 42,
        trend: '+5.4%',
        growth: true
      },
      averageGrade: {
        value: 'B+',
        trend: '+0.3',
        growth: true
      },
      // Data grafik (akan digunakan dengan library chart)
      chartData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Jurnal',
            data: [30, 40, 35, 50, 45, 60]
          },
          {
            label: 'Kehadiran',
            data: [90, 85, 95, 92, 98, 99]
          }
        ]
      }
    };
  },
  
  // Mendapatkan data aktivitas terbaru
  getRecentActivities: function(limit = 5) {
    // Simulasi mendapatkan data aktivitas terbaru
    return [
      {
        id: 1,
        type: 'journal',
        user: 'Sinta Dewi',
        action: 'mengisi jurnal kegiatan',
        time: 'Baru saja',
        icon: 'edit'
      },
      {
        id: 2,
        type: 'attendance',
        user: 'Budi Santoso',
        action: 'melakukan absensi',
        time: '5 menit yang lalu',
        icon: 'check'
      },
      {
        id: 3,
        type: 'consultation',
        user: 'Deni Cahyadi',
        action: 'dijadwalkan konsultasi dengan Pak Andi',
        time: '20 menit yang lalu',
        icon: 'calendar'
      },
      {
        id: 4,
        type: 'approval',
        user: 'Jurnal Deni',
        action: 'divalidasi oleh pembimbing',
        time: '1 jam yang lalu',
        icon: 'document'
      },
      {
        id: 5,
        type: 'notification',
        user: 'Rini Puspita',
        action: 'mengajukan PKL baru',
        time: '3 jam yang lalu',
        icon: 'bell'
      }
    ];
  },
  
  // Mendapatkan data performa siswa teratas
  getTopStudents: function(limit = 5) {
    // Simulasi mendapatkan data siswa teratas
    return [
      {
        id: 1,
        name: 'Sinta Dewi',
        class: 'XII RPL 1',
        company: 'PT Maju Jaya',
        progress: 85,
        status: 'Baik'
      },
      {
        id: 2,
        name: 'Budi Santoso',
        class: 'XII RPL 2',
        company: 'CV Teknologi',
        progress: 78,
        status: 'Baik'
      },
      {
        id: 3,
        name: 'Deni Cahyadi',
        class: 'XII MM 1',
        company: 'PT Digital Kreasi',
        progress: 65,
        status: 'Sedang'
      },
      {
        id: 4,
        name: 'Rini Puspita',
        class: 'XII TKJ 1',
        company: 'CV Jaringan Mandiri',
        progress: 72,
        status: 'Baik'
      },
      {
        id: 5,
        name: 'Andi Firmansyah',
        class: 'XII RPL 1',
        company: 'PT Solusi Digital',
        progress: 45,
        status: 'Kurang'
      }
    ];
  },
  
  // Mendapatkan data DU/DI populer
  getPopularCompanies: function(limit = 5) {
    // Simulasi mendapatkan data DU/DI populer
    return [
      {
        id: 1,
        name: 'PT Maju Jaya',
        type: 'Software House',
        location: 'Samarinda',
        quota: '10/15',
        status: 'Tersedia'
      },
      {
        id: 2,
        name: 'CV Teknologi',
        type: 'Web Developer',
        location: 'Samarinda',
        quota: '8/10',
        status: 'Tersedia'
      },
      {
        id: 3,
        name: 'PT Digital Kreasi',
        type: 'Multimedia',
        location: 'Balikpapan',
        quota: '12/12',
        status: 'Penuh'
      },
      {
        id: 4,
        name: 'CV Jaringan Mandiri',
        type: 'Networking',
        location: 'Samarinda',
        quota: '5/8',
        status: 'Tersedia'
      },
      {
        id: 5,
        name: 'PT Solusi Digital',
        type: 'Software House',
        location: 'Tenggarong',
        quota: '3/5',
        status: 'Tersedia'
      }
    ];
  }
};

// Tambahkan ke event listeners dashboard
function addDashboardEventListeners() {
  // Tambahkan event handlers yang sudah ada
  
  // Tambahkan inisialisasi charts
  initDashboardCharts();
}
