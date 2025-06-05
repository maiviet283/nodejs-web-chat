const express = require('express');
const router = express.Router();

const { sendFriendRequest } = require('../controllers/friends/add');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/request',authMiddleware, sendFriendRequest);

module.exports = router;
