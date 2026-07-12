const express = require('express');
const router = express.Router();
const SearchController = require('../controllers/SearchController');
const { authenticateToken } = require('../middlewares/auth');

router.get('/search', authenticateToken, SearchController.globalSearch);

module.exports = router;
