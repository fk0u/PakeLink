const User = require('../models/User');

// Check if user has required role
const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      
      if (!roles.includes(user.role)) {
        return res.status(403).json({ 
          message: 'Access denied. You do not have the required permissions for this action' 
        });
      }
      
      next();
    } catch (error) {
      console.error('Role check error:', error.message);
      res.status(500).json({ message: 'Server error during role verification' });
    }
  };
};

module.exports = checkRole;
