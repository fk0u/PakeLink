const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    fax: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    businessType: {
      type: String,
      required: true,
    },
    directorName: {
      type: String,
      required: true,
    },
    supervisorName: {
      type: String,
      required: true,
    },
    supervisorPhone: {
      type: String,
      required: true,
    },
    supervisorSignature: {
      type: String,
      required: true,
    },
    supervisorUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
