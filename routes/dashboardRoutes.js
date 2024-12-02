// routes/dashboardRoutes.js (Contoh)
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');

// Rute untuk dashboard admin
router.get('/admin/dashboard', verifyToken, (req, res) => {
    res.send('Welcome to the Admin Dashboard!');
});

module.exports = router;
