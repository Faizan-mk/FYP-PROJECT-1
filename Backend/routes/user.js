const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.put('/profile', userController.updateProfile);
router.put('/password', userController.updatePassword);

module.exports = router;
