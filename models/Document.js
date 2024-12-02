// models/Document.js
const db = require('../models/db'); // Buat file db.js untuk koneksi database

const Document = {
  create: (data, callback) => {
    const query = 'INSERT INTO documents SET ?';
    db.query(query, data, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },

  findAll: (callback) => {
    const query = 'SELECT * FROM documents';
    db.query(query, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },

  findById: (id, callback) => {
    const query = 'SELECT * FROM documents WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  updateStatus: (id, status, callback) => {
    const query = 'UPDATE documents SET status = ? WHERE id = ?';
    db.query(query, [status, id], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },

  downloadFile: (id, callback) => {
    const query = 'SELECT file_path FROM documents WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },
};

module.exports = Document;
