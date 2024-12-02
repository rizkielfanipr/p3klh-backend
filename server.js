const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const konsultasiRoutes = require('./routes/konsultasiRoutes'); // Pastikan jalur ini benar
const adminRoutes = require('./routes/adminRoutes'); // Pastikan jalur ini benar
const documentRoutes = require('./routes/documentRoutes'); // Tambahkan rute dokumen
const mailRoutes = require('./routes/mailRoutes');

const app = express();
const PORT = 5001;

// Middleware untuk parsing body dan menangani file statis
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Untuk rute statis

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234', // Ganti dengan password MySQL Anda
    database: 'konsultasi_db'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Failed to connect to MySQL:', err);
        process.exit(1); // Keluar jika tidak dapat terhubung
    } else {
        console.log('Connected to MySQL database');
    }
});

// Route to test server
app.get('/', (req, res) => {
    res.send('Welcome to the Consultation API!');
});

// Gunakan rute konsultasi
app.use('/konsultasi', konsultasiRoutes);

// Gunakan rute admin
app.use('/api', adminRoutes);

// Gunakan rute mail
app.use('/mail', mailRoutes);

// Gunakan rute dokumen
app.use('/documents', documentRoutes); // Tambahkan rute dokumen

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
