const jwt = require('jsonwebtoken');
const User = require('../models/user.models');
module.exports = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ success: false });
  const token = authHeader.split(' ')[1];
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(verified._id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ success: false });
  }
};
