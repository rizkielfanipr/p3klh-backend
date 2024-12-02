// mailRoutes.js
const express = require('express');
const router = express.Router();
const mailController = require('../controllers/mailController');

// Route untuk menambahkan data baru (create)
router.post('/create', mailController.addMail); // Menambahkan data baru

// Route untuk mendapatkan semua data (read)
router.get('/all-mails', mailController.getAllMails);

// Route untuk mendapatkan data berdasarkan nomor registrasi (read)
router.get('/all-mails/:nomor_registrasi', mailController.getMailByNomorRegistrasi);

// Route untuk memperbarui data berdasarkan nomor registrasi (update)
router.put('/update/:nomor_registrasi', mailController.updateMail);

// Route untuk menghapus data berdasarkan nomor registrasi (delete)
router.delete('/delete/:nomor_registrasi', mailController.deleteMail);

module.exports = router;
