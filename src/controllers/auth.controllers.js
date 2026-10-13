const User = require('../models/user.models');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validators/user.validators');
const { sendVerificationEmail } = require('../helpers/email');

exports.register = async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });
  const token = crypto.createHash('sha256').update(plainToken).digest('hex');
  const user = new User({ ...req.body, verificationToken: token, verificationTokenExpires: Date.now() + 3600000 });
  await user.save();
  await sendVerificationEmail(user.email, token);
  res.status(201).json({ success: true, message: 'Verified email dispatched.' });
};

exports.verifyEmail = async (req, res) => {
  try {
    const plainToken = req.query.token;
    if (!plainToken) return res.status(400).json({ success: false, message: "Token missing" });

    // 1. Hash the incoming token from the URL to match database storage format
    const hashedToken = crypto.createHash('sha256').update(plainToken).digest('hex');

    // 2. Query using the hashed token
    const user = await User.findOne({ 
      verificationToken: hashedToken, 
      verificationTokenExpires: { $gt: Date.now() } 
    });
    
    if (!user) return res.status(400).json({ success: false, message: "Invalid or expired token" });
    
    // 3. Update verification state
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();
    
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await user.comparePassword(req.body.password))) return res.status(401).json({ success: false });
  if (!user.isVerified) return res.status(403).json({ success: false, message: 'Unverified.' });
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.status(200).json({ success: true, token });
};
