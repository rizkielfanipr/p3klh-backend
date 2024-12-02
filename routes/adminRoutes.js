const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

const router = express.Router();

// Route untuk registrasi admin
router.post('/register', adminController.register);

// Route untuk login admin
router.post('/login', adminController.login);

// Route untuk mendapatkan seluruh admin
router.get('/admin-list', adminController.getAllAdmins);

// Route untuk approve admin
router.put('/admin/approve/:id', adminController.approve);

// Route untuk not approve admin (delete)
router.delete('/admin/not-approve/:id', adminController.notApprove);

// Route untuk menambahkan user
router.post('/users/add', authenticateToken, adminController.addUser);

// Route untuk mengubah user
router.patch('/users/update/:id', authenticateToken, adminController.updateUser);

// Route untuk menghapus user
router.delete('/users/delete/:id', authenticateToken, adminController.deleteUser);

// Route untuk mendapatkan statistik dashboard
router.get('/admin/dashboard-stats', adminController.getDashboardStats);

// Rute untuk mengambil data admin
router.get('/profile', adminController.getPublicAdminProfile);

module.exports = router;
