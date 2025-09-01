const Student = require('../models/Student');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Get all students
// @route   GET /api/students
// @access  Private
exports.getStudents = async (req, res) => {
  try {
    // Filter options based on user role
    let filter = {};
    
    // If school supervisor, only show students they supervise
    if (req.user.role === 'school_supervisor') {
      filter.schoolSupervisor = req.user._id;
    }
    // If company supervisor, only show students at their company
    else if (req.user.role === 'company_supervisor') {
      // Get the company where this supervisor works
      const companies = await Company.find({ supervisorUser: req.user._id });
      if (companies.length > 0) {
        const companyIds = companies.map(company => company._id);
        filter.company = { $in: companyIds };
      } else {
        return res.json([]);  // No companies, so no students
      }
    }
    // Student should only see their own record
    else if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user._id });
      if (student) {
        return res.json([student]);
      } else {
        return res.json([]);
      }
    }
    
    const students = await Student.find(filter)
      .populate('user', 'firstName lastName username email')
      .populate('company', 'name address')
      .populate('school', 'name address')
      .populate('schoolSupervisor', 'firstName lastName username');
      
    res.json(students);
  } catch (error) {
    console.error('Get students error:', error.message);
    res.status(500).json({ message: 'Server error while fetching students' });
  }
};

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Private
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('user', 'firstName lastName username email')
      .populate('company', 'name address businessType supervisorName')
      .populate('school', 'name address')
      .populate('schoolSupervisor', 'firstName lastName username');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Check permissions
    if (
      req.user.role !== 'admin' && 
      req.user.role !== 'school_supervisor' && 
      student.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'company_supervisor'
    ) {
      return res.status(403).json({ message: 'Not authorized to access this student data' });
    }
    
    // If company supervisor, check if student belongs to their company
    if (req.user.role === 'company_supervisor') {
      const companies = await Company.find({ supervisorUser: req.user._id });
      const companyIds = companies.map(company => company._id.toString());
      if (!companyIds.includes(student.company._id.toString())) {
        return res.status(403).json({ message: 'Not authorized to access this student data' });
      }
    }
    
    // If school supervisor, check if they supervise this student
    if (req.user.role === 'school_supervisor' && 
        student.schoolSupervisor._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this student data' });
    }
    
    res.json(student);
  } catch (error) {
    console.error('Get student by ID error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(500).json({ message: 'Server error while fetching student' });
  }
};

// @desc    Create a new student
// @route   POST /api/students
// @access  Private/Admin or School_Supervisor
exports.createStudent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    user,
    nisn,
    placeOfBirth,
    dateOfBirth,
    gender,
    religion,
    bloodType,
    address,
    phoneNumber,
    class: studentClass,
    expertise,
    school,
    parentName,
    parentAddress,
    parentPhoneNumber,
    internshipPeriod,
    academicYear,
    photo,
    signature,
    company,
    schoolSupervisor,
  } = req.body;

  try {
    // Check if student with NISN already exists
    let student = await Student.findOne({ nisn });
    if (student) {
      return res.status(400).json({ message: 'Student already exists with that NISN' });
    }

    // Create new student
    student = new Student({
      user,
      nisn,
      placeOfBirth,
      dateOfBirth,
      gender,
      religion,
      bloodType,
      address,
      phoneNumber,
      class: studentClass,
      expertise,
      school,
      parentName,
      parentAddress,
      parentPhoneNumber,
      internshipPeriod,
      academicYear,
      photo,
      signature,
      company,
      schoolSupervisor,
    });

    await student.save();

    res.status(201).json(student);
  } catch (error) {
    console.error('Create student error:', error.message);
    res.status(500).json({ message: 'Server error while creating student' });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Admin or School_Supervisor
exports.updateStudent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && 
        req.user.role !== 'school_supervisor' &&
        student.schoolSupervisor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this student' });
    }

    // Update all fields from request body that are provided
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        student[key] = req.body[key];
      }
    });

    await student.save();

    res.json(student);
  } catch (error) {
    console.error('Update student error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(500).json({ message: 'Server error while updating student' });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    await student.remove();
    
    res.json({ message: 'Student removed' });
  } catch (error) {
    console.error('Delete student error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(500).json({ message: 'Server error while deleting student' });
  }
};
