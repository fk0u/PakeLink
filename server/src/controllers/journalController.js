const Journal = require('../models/Journal');
const Student = require('../models/Student');
const Company = require('../models/Company');
const { validationResult } = require('express-validator');

// @desc    Get all journals or filtered by student
// @route   GET /api/journals
// @access  Private
exports.getJournals = async (req, res) => {
  try {
    const { student, startDate, endDate } = req.query;
    
    // Build filter object
    let filter = {};
    
    if (student) {
      filter.student = student;
    }
    
    // Date filtering
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    
    // Access control based on user role
    if (req.user.role === 'student') {
      // Students can only see their own journals
      const studentRecord = await Student.findOne({ user: req.user._id });
      if (!studentRecord) {
        return res.status(404).json({ message: 'Student record not found' });
      }
      filter.student = studentRecord._id;
    } else if (req.user.role === 'company_supervisor') {
      // Company supervisors can only see journals from students at their company
      const companies = await Company.find({ supervisorUser: req.user._id });
      const companyIds = companies.map(company => company._id);
      
      const students = await Student.find({ company: { $in: companyIds } });
      const studentIds = students.map(student => student._id);
      
      if (student && !studentIds.includes(student)) {
        return res.status(403).json({ message: 'Not authorized to access journals for this student' });
      }
      
      filter.student = { $in: studentIds };
    } else if (req.user.role === 'school_supervisor') {
      // School supervisors can only see journals from students they supervise
      const students = await Student.find({ schoolSupervisor: req.user._id });
      const studentIds = students.map(student => student._id);
      
      if (student && !studentIds.includes(student)) {
        return res.status(403).json({ message: 'Not authorized to access journals for this student' });
      }
      
      filter.student = { $in: studentIds };
    }
    
    // Get journals with population
    const journals = await Journal.find(filter)
      .populate('student', 'nisn')
      .populate({
        path: 'student',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        }
      })
      .sort({ date: -1 });
    
    res.json(journals);
  } catch (error) {
    console.error('Get journals error:', error.message);
    res.status(500).json({ message: 'Server error while fetching journals' });
  }
};

// @desc    Get journal by ID
// @route   GET /api/journals/:id
// @access  Private
exports.getJournalById = async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id)
      .populate('student', 'nisn')
      .populate({
        path: 'student',
        populate: [
          {
            path: 'user',
            select: 'firstName lastName'
          },
          {
            path: 'company',
            select: 'name supervisorName'
          }
        ]
      });
    
    if (!journal) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }
    
    // Check permissions
    if (req.user.role === 'student') {
      const studentRecord = await Student.findOne({ user: req.user._id });
      if (!studentRecord || studentRecord._id.toString() !== journal.student._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to access this journal' });
      }
    } else if (req.user.role === 'company_supervisor') {
      const companies = await Company.find({ supervisorUser: req.user._id });
      const companyIds = companies.map(company => company._id.toString());
      
      const student = await Student.findById(journal.student._id);
      if (!student || !companyIds.includes(student.company.toString())) {
        return res.status(403).json({ message: 'Not authorized to access this journal' });
      }
    } else if (req.user.role === 'school_supervisor') {
      const student = await Student.findById(journal.student._id);
      if (!student || student.schoolSupervisor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to access this journal' });
      }
    }
    
    res.json(journal);
  } catch (error) {
    console.error('Get journal by ID error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Journal entry not found' });
    }
    res.status(500).json({ message: 'Server error while fetching journal' });
  }
};

// @desc    Create a new journal entry
// @route   POST /api/journals
// @access  Private/Student
exports.createJournal = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { date, activities } = req.body;

  try {
    // Students can only create journal entries for themselves
    if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user._id });
      if (!student) {
        return res.status(404).json({ message: 'Student record not found' });
      }
      
      // Check if a journal entry already exists for this date
      const existingJournal = await Journal.findOne({
        student: student._id,
        date: new Date(date),
      });
      
      if (existingJournal) {
        return res.status(400).json({ message: 'Journal entry already exists for this date' });
      }
      
      // Create new journal entry
      const journal = new Journal({
        student: student._id,
        date: new Date(date),
        activities,
      });
      
      await journal.save();
      
      res.status(201).json(journal);
    } else {
      return res.status(403).json({ message: 'Only students can create journal entries' });
    }
  } catch (error) {
    console.error('Create journal error:', error.message);
    res.status(500).json({ message: 'Server error while creating journal entry' });
  }
};

// @desc    Update journal entry
// @route   PUT /api/journals/:id
// @access  Private/Student
exports.updateJournal = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { activities } = req.body;

  try {
    let journal = await Journal.findById(req.params.id);
    
    if (!journal) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }
    
    // Check if the user is the student who created this journal
    if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user._id });
      if (!student || student._id.toString() !== journal.student.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this journal entry' });
      }
      
      // Students can only update the activities
      journal.activities = activities;
    } else if (req.user.role === 'company_supervisor') {
      // Company supervisor can sign off and add weekly evaluation
      const { supervisorSignature, weeklyEvaluation } = req.body;
      
      // Verify this supervisor is responsible for this student
      const student = await Student.findById(journal.student);
      const companies = await Company.find({ supervisorUser: req.user._id });
      const companyIds = companies.map(company => company._id.toString());
      
      if (!student || !companyIds.includes(student.company.toString())) {
        return res.status(403).json({ message: 'Not authorized to update this journal entry' });
      }
      
      if (supervisorSignature !== undefined) {
        journal.supervisorSignature = supervisorSignature;
        if (supervisorSignature) {
          journal.signedAt = Date.now();
        }
      }
      
      if (weeklyEvaluation !== undefined) {
        journal.weeklyEvaluation = weeklyEvaluation;
        journal.weeklyEvaluationDate = Date.now();
      }
    } else {
      return res.status(403).json({ message: 'Not authorized to update this journal entry' });
    }
    
    await journal.save();
    
    res.json(journal);
  } catch (error) {
    console.error('Update journal error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Journal entry not found' });
    }
    res.status(500).json({ message: 'Server error while updating journal entry' });
  }
};

// @desc    Delete journal entry
// @route   DELETE /api/journals/:id
// @access  Private/Admin or Student
exports.deleteJournal = async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);
    
    if (!journal) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }
    
    // Check permissions
    if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user._id });
      if (!student || student._id.toString() !== journal.student.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this journal entry' });
      }
      
      // Students can only delete unsigned journal entries
      if (journal.supervisorSignature) {
        return res.status(400).json({ message: 'Cannot delete a journal entry that has been signed by a supervisor' });
      }
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this journal entry' });
    }
    
    await journal.remove();
    
    res.json({ message: 'Journal entry removed' });
  } catch (error) {
    console.error('Delete journal error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Journal entry not found' });
    }
    res.status(500).json({ message: 'Server error while deleting journal entry' });
  }
};
