const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    supervisorSignature: {
      type: Boolean,
      default: false,
    },
    signedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for faster querying
consultationSchema.index({ student: 1, date: 1 });

const Consultation = mongoose.model('Consultation', consultationSchema);

module.exports = Consultation;
