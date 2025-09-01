const mongoose = require('mongoose');

const regulationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add default regulations
regulationSchema.statics.initializeDefaultRegulations = async function () {
  const defaultRegulations = [
    {
      title: 'Kehadiran dan Waktu Kerja',
      content: 'a. Peserta PKL wajib hadir setiap hari kerja sesuai jadwal yang telah ditentukan oleh pihak DU/DI.\nb. Jam masuk dan pulang mengikuti ketentuan tempat PKL.\nc. Tidak diperbolehkan datang terlambat atau pulang lebih awal tanpa izin dari pembimbing lapangan dan sekolah.',
      category: 'Peraturan PKL',
      order: 1,
      isActive: true,
    },
    {
      title: 'Disiplin dan Etika',
      content: 'a. Menjaga nama baik sekolah dan menunjukkan sikap profesional selama PKL.\nb. Menggunakan pakaian rapi dan sesuai ketentuan (seragam PKL/Seragam Sekolah/ID Card).\nc. Bersikap sopan, santun, dan menghormati semua pihak di lingkungan kerja.',
      category: 'Peraturan PKL',
      order: 2,
      isActive: true,
    },
    {
      title: 'Tanggung Jawab dan Kejujuran',
      content: 'a. Menjalankan tugas yang diberikan dengan penuh tanggung jawab.\nb. Tidak diperkenankan memalsukan data, informasi, maupun laporan.\nc. Menjaga kerahasiaan data perusahaan.',
      category: 'Peraturan PKL',
      order: 3,
      isActive: true,
    },
    {
      title: 'Komunikasi dan Izin',
      content: 'a. Jika berhalangan hadir (sakit atau keperluan mendesak), wajib menginformasikan kepada pembimbing sekolah dan pembimbing dari DU/DI sebelum jam kerja dimulai.\nb. Izin hanya diberikan maksimal 2 hari berturut-turut, selebihnya harus disertai surat keterangan resmi.',
      category: 'Peraturan PKL',
      order: 4,
      isActive: true,
    },
    {
      title: 'Larangan',
      content: 'a. Dilarang menggunakan HP untuk keperluan pribadi selama jam kerja (kecuali diizinkan).\nb. Dilarang merokok, membawa/menyimpan barang terlarang (narkoba, senjata tajam), atau melakukan tindakan kriminal.\nc. Dilarang membolos, berpakaian tidak sopan, membuat gaduh, atau berperilaku tidak menyenangkan di lingkungan kerja.',
      category: 'Peraturan PKL',
      order: 5,
      isActive: true,
    },
    {
      title: 'Laporan dan Evaluasi',
      content: 'a. Peserta wajib mengisi jurnal harian PKL setiap hari dan mengumpulkan laporan PKL di akhir masa praktik.\nb. Siswa wajib mengikuti evaluasi dan pembekalan dari sekolah baik sebelum, selama, maupun setelah pelaksanaan PKL.',
      category: 'Peraturan PKL',
      order: 6,
      isActive: true,
    },
    {
      title: 'Sanksi',
      content: 'Pelanggaran terhadap peraturan ini dapat dikenakan sanksi berupa:\na. Teguran lisan/tertulis\nb. Pemanggilan orang tua\nc. Pemutusan PKL sebelum waktunya\nd. Tidak mendapatkan nilai PKL dan kembali mengulang di kelas XI\ne. Sanksi lain sesuai kebijakan sekolah',
      category: 'Peraturan PKL',
      order: 7,
      isActive: true,
    },
  ];
  
  try {
    const existingRegulations = await this.find({ category: 'Peraturan PKL' });
    if (existingRegulations.length === 0) {
      await this.insertMany(defaultRegulations);
      console.log('Default regulations created');
    }
  } catch (error) {
    console.error('Error initializing default regulations:', error);
  }
};

const Regulation = mongoose.model('Regulation', regulationSchema);

module.exports = Regulation;
