const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema(
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
    activities: {
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
    weeklyEvaluation: {
      type: String,
      default: '',
    },
    weeklyEvaluationDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for faster querying
journalSchema.index({ student: 1, date: 1 });

const Journal = mongoose.model('Journal', journalSchema);

module.exports = Journal;
