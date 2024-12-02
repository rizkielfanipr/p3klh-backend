const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

// Buat koneksi menggunakan mysql2/promise
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Sesuaikan dengan kebutuhan
  queueLimit: 0
});

// Fungsi untuk memastikan koneksi berhasil
(async () => {
  try {
    const connection = await db.getConnection(); // Mengambil koneksi
    console.log('Connected to MySQL database');
    connection.release(); // Kembalikan koneksi ke pool setelah digunakan
  } catch (err) {
    console.error('Failed to connect to MySQL:', err);
    process.exit(1); // Exit jika koneksi gagal
  }
})();

module.exports = db;
