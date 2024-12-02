// controllers/AuthController.js
const bcrypt = require('bcrypt');
const db = require('../db'); // Mengambil koneksi MySQL dari file db.js

exports.login = (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, users) => {
        if (err) {
            return res.status(500).json({ message: 'Error logging in', error: err });
        }

        if (users.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = users[0];

        // Cek apakah user sudah disetujui oleh admin
        if (!user.approved) {
            return res.status(403).json({ message: 'Your account is awaiting approval by admin' });
        }

        // Verifikasi password
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Jika password benar dan user sudah disetujui
        res.status(200).json({ message: 'Login successful', user: { id: user.id, name: user.name } });
    });
};
