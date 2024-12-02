const db = require('../models/db');
const bcrypt = require('bcrypt');

// Register Admin

exports.register = async (req, res) => {
    const { name, email, password, username } = req.body;

    console.log("Data pendaftaran diterima:", req.body); // Log request body

    try {
        if (!name || !email || !password || !username) {
            return res.status(400).json({ message: 'Semua field harus diisi' });
        }

        // Cek apakah username sudah ada
        const [existingUser] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Username sudah terdaftar, silakan pilih yang lain.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Pastikan Anda mendestructure hasilnya
        const [result] = await db.query('INSERT INTO admins (name, email, password, username) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, username]);
        
        // Log hasil untuk debugging
        console.log("Hasil insert database:", result);

        // Periksa hasilnya dengan tepat
        if (result && result.affectedRows > 0) {
            return res.status(201).json({ message: 'Admin registered successfully' });
        } else {
            return res.status(500).json({ message: 'Failed to register admin' });
        }
    } catch (error) {
        console.error('Error registering admin:', error); // Log kesalahan lengkap
        res.status(500).json({ message: 'Error registering admin', error });
    }
};

// Login Admin
exports.login = async (req, res) => {
  const { username, password } = req.body; // Mengubah email menjadi username

  try {
      // Ubah query untuk mencari berdasarkan username
      const [results] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);

      if (results.length === 0) {
          return res.status(400).json({ message: 'Admin not found' });
      }

      const admin = results[0];
      const passwordMatch = await bcrypt.compare(password, admin.password);

      if (!passwordMatch) {
          return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate and send token (JWT logic should be added here)
      res.json({ message: 'Login successful', admin: { id: admin.id, username: admin.username } });
  } catch (error) {
      res.status(500).json({ message: 'Login error', error: error.message });
  }
};

// Get All Admins
exports.getAllAdmins = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM admins');
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admins', error: error.message });
    }
};

// Approve Admin
exports.approve = async (req, res) => {
    const adminId = req.params.id;

    try {
        await db.query('UPDATE admins SET approved = ? WHERE id = ?', [true, adminId]);
        res.status(200).json({ message: 'Admin approved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error approving admin', error: error.message });
    }
};

// Delete Admin (Not Approved)
exports.notApprove = async (req, res) => {
    const adminId = req.params.id;

    try {
        await db.query('DELETE FROM admins WHERE id = ?', [adminId]);
        res.status(200).json({ message: 'Admin not approved and deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting admin', error: error.message });
    }
};

// Add User
exports.addUser = async (req, res) => {
    const { name, email, password, approved = 0, active = 1 } = req.body;

    try {
        const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [results] = await db.query('INSERT INTO users (name, email, password, approved, active) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, approved, active]);

        res.status(201).json({ id: results.insertId, name, email, approved, active });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

// Update User
exports.updateUser = async (req, res) => {
    const { approved, active } = req.body;
    const userId = req.params.id;

    try {
        await db.query('UPDATE users SET approved = ?, active = ? WHERE id = ?', [approved, active, userId]);
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

// Delete User
exports.deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        await db.query('DELETE FROM users WHERE id = ?', [userId]);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

// Get Admin Dashboard Stats
exports.getDashboardStats = async (req, res) => {
    try {
        const [messages] = await db.query('SELECT COUNT(*) AS total FROM messages');
        const [submissions] = await db.query('SELECT COUNT(*) AS total FROM submissions');
        const [admins] = await db.query('SELECT COUNT(*) AS total FROM admins');
        const [mails] = await db.query('SELECT COUNT(*) AS total FROM mails');
        res.json({
            pesanKonsultasi: messages[0].total,
            pengajuanDokling: submissions[0].total,
            daftarAdmin: admins[0].total,
            jumlahSurat: mails[0].total
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
    }
};

exports.getPublicAdminProfile = async (req, res) => {
  const adminId = req.query.id; // Ambil ID admin dari parameter query

  if (!adminId) {
      return res.status(400).json({ message: 'ID Admin diperlukan' });
  }

  try {
      const [results] = await db.query('SELECT name, email FROM admins WHERE id = ?', [adminId]);

      if (results.length === 0) {
          return res.status(404).json({ message: 'Admin tidak ditemukan' });
      }

      res.json(results[0]); // Kirim data admin
  } catch (error) {
      res.status(500).json({ message: 'Kesalahan saat mengambil profil admin', error: error.message });
  }
};