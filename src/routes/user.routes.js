const express = require('express');
const router = express.Router();
const user = require('../controllers/user.controllers');
const guard = require('../middlewares/auth.middleware');
router.get('/profile', guard, user.getProfile);
module.exports = router;
