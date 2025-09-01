const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    records: [
      {
        date: {
          type: Number,
          required: true,
        },
        status: {
          type: String,
          enum: ['H', 'I', 'S', 'L'],
          required: true,
        },
      },
    ],
    companySupervisorSignature: {
      type: Boolean,
      default: false,
    },
    companySupervisorSignedAt: {
      type: Date,
    },
    schoolSupervisorSignature: {
      type: Boolean,
      default: false,
    },
    schoolSupervisorSignedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for faster querying
attendanceSchema.index({ student: 1, month: 1, year: 1 });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
