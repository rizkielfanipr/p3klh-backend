// controllers/submissionController.js
const fs = require('fs');
const path = require('path');
const db = require('../models/db'); // Pastikan jalur ini benar

// Fungsi untuk submit dokumen
const submitDocument = async (req, res) => {
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);

    const {
        applicantName,
        companyName,
        address,
        team,
        contactPerson,
        submissionType,
        documentType,
        documentPosition,
        applicationLetterUploaded,
        documentLink
    } = req.body;

    if (!applicantName || !companyName || !address) {
        return res.status(400).json({ message: 'Required fields cannot be empty' });
    }

    const documentFile = req.file ? req.file.filename : null;

    const query = `INSERT INTO submissions (applicant_name, company_name, address, team, contact_person, submission_type, document_type, document_position, application_letter_uploaded, document_file, document_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    try {
        const [result] = await db.query(query, [
            applicantName,
            companyName,
            address,
            team,
            contactPerson,
            submissionType,
            documentType,
            documentPosition,
            applicationLetterUploaded ? 1 : 0,
            documentFile,
            documentLink
        ]);
        res.status(201).json({ message: 'Document submission successful', result });
    } catch (err) {
        console.error('Error inserting data:', err);
        return res.status(500).json({ message: 'Error inserting data' });
    }
};

// Fungsi untuk mengambil daftar submissions
const getSubmissions = async (req, res) => {
    const query = 'SELECT * FROM submissions ORDER BY created_at DESC';

    try {
        const [results] = await db.query(query);
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching data:', err);
        return res.status(500).json({ message: 'Error fetching data' });
    }
};

// Fungsi untuk menyetujui submission
const approveSubmission = async (req, res) => {
    const submissionId = req.params.id;
    const query = `UPDATE submissions SET status = 'approved', approved_at = NOW() WHERE id = ?`;

    try {
        const [result] = await db.query(query, [submissionId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Submission not found' });
        }
        res.json({ message: 'Submission approved successfully' });
    } catch (err) {
        return res.status(500).json({ error: 'Database error' });
    }
};

// Fungsi untuk menolak submission
const rejectSubmission = async (req, res) => {
    const submissionId = req.params.id;
    const query = `UPDATE submissions SET status = 'rejected', rejected_at = NOW() WHERE id = ?`;

    try {
        const [result] = await db.query(query, [submissionId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Submission not found' });
        }
        res.json({ message: 'Submission rejected successfully' });
    } catch (err) {
        return res.status(500).json({ error: 'Database error' });
    }
};

// Fungsi untuk mendapatkan detail submission berdasarkan ID
const getSubmissionById = async (req, res) => {
    const submissionId = req.params.id;
    const query = 'SELECT * FROM submissions WHERE id = ?';

    try {
        const [result] = await db.query(query, [submissionId]);
        if (result.length === 0) {
            return res.status(404).json({ message: 'Submission not found' });
        }
        res.json(result[0]);
    } catch (err) {
        return res.status(500).json({ error: 'Database error' });
    }
};

// Fungsi untuk mengunduh dokumen
const downloadDocument = async (req, res) => {
    const documentId = req.params.id;

    const sql = 'SELECT document_file FROM submissions WHERE id = ?';
    try {
        const [results] = await db.query(sql, [documentId]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Dokumen tidak ditemukan.' });
        }

        const documentFile = path.join(__dirname, '../uploads', results[0].document_file);

        if (fs.existsSync(documentFile)) {
            res.download(documentFile, (err) => {
                if (err) {
                    res.status(500).json({ message: 'Gagal mengunduh file.', error: err });
                }
            });
        } else {
            res.status(404).json({ message: 'File tidak ditemukan di server.' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Gagal mengunduh file.', error: err });
    }
};

// Fungsi untuk approve dokumen
const approveDocument = async (req, res) => {
    const documentId = req.params.id;

    // Ensure documentId is provided
    if (!documentId) {
        return res.status(400).json({ message: 'Document ID is required' });
    }

    try {
        // Update the status of the document to 'Disetujui'
        const [result] = await db.query('UPDATE submissions SET status = ? WHERE id = ?', ['Disetujui', documentId]);
        
        // Check if the document was found and updated
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Document not found' });
        }

        res.status(200).json({ message: 'Dokumen approved successfully' });
    } catch (err) {
        console.error('Error approving dokumen:', err);
        res.status(500).json({ message: 'Error approving dokumen' });
    }
};

// Fungsi untuk not approve dokumen
const notApproveDocument = async (req, res) => {
    const documentId = req.params.id;

    // Ensure documentId is provided
    if (!documentId) {
        return res.status(400).json({ message: 'Document ID is required' });
    }

    try {
        // Update the status of the document to 'Tidak Disetujui'
        const [result] = await db.query('UPDATE submissions SET status = ? WHERE id = ?', ['Tidak Disetujui', documentId]);
        
        // Check if the document was found and updated
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Document not found' });
        }

        res.status(200).json({ message: 'Dokumen not approved successfully' });
    } catch (err) {
        console.error('Error not approving dokumen:', err);
        res.status(500).json({ message: 'Error not approving dokumen' });
    }
};

// Fungsi untuk mengambil semua dokumen
const getAllDocuments = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM documents');
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    submitDocument,
    getSubmissions,
    approveSubmission,
    rejectSubmission,
    getSubmissionById,
    downloadDocument,
    approveDocument,
    notApproveDocument,
    getAllDocuments
};
