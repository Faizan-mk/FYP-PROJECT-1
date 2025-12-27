const express = require('express');
const router = express.Router();
const chatController = require('../controller/chatController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, chatController.sendMessage);
router.get('/', authMiddleware, chatController.getChatHistory);

module.exports = router;
