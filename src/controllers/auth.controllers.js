const User = require('../models/user.models');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validators/user.validators');
const { sendVerificationEmail } = require('../helpers/email');

exports.register = async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });
  const token = crypto.randomBytes(32).toString('hex');
  const user = new User({ ...req.body, verificationToken: token, verificationTokenExpires: Date.now() + 3600000 });
  await user.save();
  await sendVerificationEmail(user.email, token);
  res.status(201).json({ success: true, message: 'Verified email dispatched.' });
};

exports.verifyEmail = async (req, res) => {
  const user = await User.findOne({ verificationToken: req.query.token, verificationTokenExpires: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ success: false });
  user.isVerified = true;
  user.verificationToken = null;
  user.verificationTokenExpires = null;
  await user.save();
  res.status(200).json({ success: true });
};

exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await user.comparePassword(req.body.password))) return res.status(401).json({ success: false });
  if (!user.isVerified) return res.status(403).json({ success: false, message: 'Unverified.' });
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.status(200).json({ success: true, token });
};
