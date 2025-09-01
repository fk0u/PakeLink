const express = require('express');
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users
// @access  Private/Admin
router.get('/', auth, checkRole(['admin']), userController.getUsers);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private/Admin
router.get('/:id', auth, checkRole(['admin']), userController.getUserById);

// @route   POST /api/users
// @desc    Create a new user (by admin)
// @access  Private/Admin
router.post(
  '/',
  [
    auth,
    checkRole(['admin']),
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('role', 'Role is required').isIn(['admin', 'student', 'company_supervisor', 'school_supervisor']),
  ],
  userController.createUser
);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private/Admin
router.put(
  '/:id',
  [
    auth,
    checkRole(['admin']),
    check('email', 'Please include a valid email').optional().isEmail(),
    check('role', 'Invalid role').optional().isIn(['admin', 'student', 'company_supervisor', 'school_supervisor']),
  ],
  userController.updateUser
);

// @route   PUT /api/users/:id/password
// @desc    Update user password
// @access  Private/Admin
router.put(
  '/:id/password',
  [
    auth,
    checkRole(['admin']),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  userController.updateUserPassword
);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/:id', auth, checkRole(['admin']), userController.deleteUser);

module.exports = router;
