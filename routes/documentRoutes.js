// routes/submissionRoutes.js
const express = require('express');
const multer = require('multer');
const router = express.Router();
const submissionController = require('../controllers/submissionController'); // Impor kontroler

// Setup storage untuk multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Pastikan direktori ini ada
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Route untuk submit dokumen
router.post('/submit-document', upload.single('documentFile'), submissionController.submitDocument);

// Route untuk mengambil daftar submissions
router.get('/admin/submissions', submissionController.getSubmissions);

// API untuk menyetujui submission
router.post('/api/submissions/approve/:id', submissionController.approveSubmission);

// API untuk menolak submission
router.post('/api/submissions/reject/:id', submissionController.rejectSubmission);

// API untuk mendapatkan detail submission berdasarkan ID
router.get('/api/submissions/:id', submissionController.getSubmissionById);

// Endpoint untuk mengunduh dokumen
router.get('/download/:id', submissionController.downloadDocument);

// Endpoint untuk approve dokumen
router.post('/approve/:id', submissionController.approveDocument);

// Endpoint untuk not approve dokumen
router.post('/not-approve/:id', submissionController.notApproveDocument);

// Endpoint untuk mengambil semua dokumen
router.get('/documents', submissionController.getAllDocuments);

module.exports = router;
