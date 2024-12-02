// routes/konsultasiRoutes.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql2'); // Pastikan MySQL diimpor jika diperlukan untuk koneksi

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234', // Ganti dengan password MySQL Anda
    database: 'konsultasi_db'
});

// Rute untuk mengirim pesan konsultasi
router.post('/', (req, res) => {
    const { name, email, phone, message } = req.body;

    // Validasi input
    if (!name || !email || !phone || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const sql = 'INSERT INTO messages (name, email, phone, message) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, phone, message], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Failed to submit message' });
        }
        res.status(200).json({ success: true, message: 'Message submitted successfully' });
    });
});

// Rute untuk mendapatkan semua pesan konsultasi (admin)
router.get('/messages', (req, res) => {
    const sql = 'SELECT * FROM messages ORDER BY created_at DESC';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Failed to retrieve messages' });
        }
        res.status(200).json({ success: true, data: results });
    });
});

// Rute untuk menghapus pesan konsultasi
router.delete('/messages/:id', (req, res) => {
    const messageId = req.params.id;

    const sql = 'DELETE FROM messages WHERE id = ?';
    db.query(sql, [messageId], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Failed to delete message' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }
        res.status(200).json({ success: true, message: 'Message deleted successfully' });
    });
});

// Rute untuk menjawab pesan konsultasi
router.put('/messages/:id/answer', (req, res) => {
    const messageId = req.params.id;
    const { answer } = req.body;

    // Validasi input
    if (!answer) {
        return res.status(400).json({ success: false, message: 'Answer is required' });
    }

    const sql = 'UPDATE messages SET answer = ? WHERE id = ?';
    db.query(sql, [answer, messageId], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Failed to update message' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }
        res.status(200).json({ success: true, message: 'Message answered successfully' });
    });
});

module.exports = router;
