const db = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_secret_key'; // Ganti dengan secret key yang lebih kuat

// Route untuk registrasi user
exports.register = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const [results] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);
        if (results.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.promise().query('INSERT INTO users (username, password, approved) VALUES (?, ?, ?)', [username, hashedPassword, false]);

        res.status(201).json({ message: 'User registered successfully. Awaiting admin approval.' });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Failed to register' });
    }
};

// Route untuk login user
exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const [results] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        if (!user.approved) {
            return res.status(403).json({ message: 'User not approved by admin' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Failed to login' });
    }
};

// Route untuk mendapatkan semua pengguna
exports.getAllUsers = async (req, res) => {
    try {
        const [results] = await db.promise().query('SELECT id, username, approved FROM users');
        res.json(results);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Failed to retrieve users' });
    }
};
