const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    website: {
      type: String,
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

// Add default SMKN 7 Samarinda as default
schoolSchema.statics.initializeDefaultSchool = async function () {
  const defaultSchool = {
    name: 'SMKN 7 Samarinda',
    address: 'Jl. Soekarno-Hatta Km. 0,5, Loktuan, Kec. Bontang Utara, Kota Bontang, Kalimantan Timur',
    phone: '0548-41741',
    email: 'smkn7samarinda@gmail.com',
    website: 'https://smkn7samarinda.sch.id',
    isActive: true,
  };
  
  try {
    const existingSchool = await this.findOne({ name: defaultSchool.name });
    if (!existingSchool) {
      await this.create(defaultSchool);
      console.log('Default school SMKN 7 Samarinda created');
    }
  } catch (error) {
    console.error('Error initializing default school:', error);
  }
};

const School = mongoose.model('School', schoolSchema);

module.exports = School;
