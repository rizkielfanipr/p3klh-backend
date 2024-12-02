const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware untuk memverifikasi token JWT
const authenticateToken = (req, res, next) => {
    // Validasi jika JWT_SECRET tidak terdefinisi
    if (!JWT_SECRET) {
        return res.status(500).json({ message: 'Server error: JWT_SECRET is not defined.' });
    }

    // Ambil token dari header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') 
        ? authHeader.split(' ')[1] 
        : null;

    // Jika token tidak ada, kirimkan respon Unauthorized
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // Verifikasi token JWT
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Token verification failed:', err);  // Logging error
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }

        // Simpan informasi pengguna dari token ke req.user
        req.user = decoded;
        next();
    });
};

module.exports = authenticateToken;
