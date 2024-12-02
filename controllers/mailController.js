const db = require('../models/db'); // Pastikan Anda mengimpor koneksi database

// Controller untuk menambahkan data
const addMail = async (req, res) => {
    const { 
        nomor_surat, 
        surat_arahan, 
        usaha_kegiatan, 
        lokasi, 
        kegiatan_yang_dimohonkan_arahan, 
        jenis_dokumen, 
        proses, 
        sanksi_administrasi, 
        catatan, 
        sk_rekom_persetujuan_lingkungan, 
        keterangan, 
        tindak_lanjut_pertek_air_limbah_administrasi,
        tindak_lanjut_pertek_air_limbah_substansi,
        tindak_lanjut_pertek_emisi_administrasi,
        tindak_lanjut_pertek_emisi_substansi,
        tindak_lanjut_rintek_lb3_administrasi,
        tindak_lanjut_rintek_lb3_substansi,
        tindak_lanjut_andalalin_administrasi,
        tindak_lanjut_andalalin_substansi,
        tindak_lanjut_pengajuan_dokling_administrasi,
        tindak_lanjut_pengajuan_dokling_substansi
    } = req.body;

    // Validasi input
    if (!lokasi) {
        return res.status(400).json({ success: false, message: "Lokasi tidak boleh kosong" });
    }

    // Fungsi untuk membuat nomor registrasi unik dengan panjang 7 digit
    const generateNomorRegistrasi = () => {
        // Membuat angka acak 7 digit
        const randomNumber = Math.floor(1000000 + Math.random() * 9000000);
        
        return randomNumber;
    };

    // Membuat nomor registrasi
    const nomor_registrasi = generateNomorRegistrasi();

    try {
        const [result] = await db.query(
            "INSERT INTO mails (nomor_registrasi, nomor_surat, surat_arahan, usaha_kegiatan, lokasi, kegiatan_yang_dimohonkan_arahan, jenis_dokumen, proses, sanksi_administrasi, catatan, sk_rekom_persetujuan_lingkungan, keterangan, tindak_lanjut_pertek_air_limbah_administrasi, tindak_lanjut_pertek_air_limbah_substansi, tindak_lanjut_pertek_emisi_administrasi, tindak_lanjut_pertek_emisi_substansi, tindak_lanjut_rintek_lb3_administrasi, tindak_lanjut_rintek_lb3_substansi, tindak_lanjut_andalalin_administrasi, tindak_lanjut_andalalin_substansi, tindak_lanjut_pengajuan_dokling_administrasi, tindak_lanjut_pengajuan_dokling_substansi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [nomor_registrasi, nomor_surat, surat_arahan, usaha_kegiatan, lokasi, kegiatan_yang_dimohonkan_arahan, jenis_dokumen, proses, sanksi_administrasi, catatan, sk_rekom_persetujuan_lingkungan, keterangan, tindak_lanjut_pertek_air_limbah_administrasi, tindak_lanjut_pertek_air_limbah_substansi, tindak_lanjut_pertek_emisi_administrasi, tindak_lanjut_pertek_emisi_substansi, tindak_lanjut_rintek_lb3_administrasi, tindak_lanjut_rintek_lb3_substansi, tindak_lanjut_andalalin_administrasi, tindak_lanjut_andalalin_substansi, tindak_lanjut_pengajuan_dokling_administrasi, tindak_lanjut_pengajuan_dokling_substansi]
        );
        return res.status(201).json({ success: true, data: result });
    } catch (error) {
        console.error("Error inserting data:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

// Controller untuk mendapatkan semua data
const getAllMails = async (req, res) => {
    try {
        const query = 'SELECT * FROM mails';
        const [rows] = await db.query(query);
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error("Error retrieving data: ", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

// Controller untuk mendapatkan data berdasarkan nomor registrasi
const getMailByNomorRegistrasi = async (req, res) => {
    const { nomor_registrasi } = req.params;
    try {
        const query = 'SELECT * FROM mails WHERE nomor_registrasi = ?';
        const [rows] = await db.query(query, [nomor_registrasi]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Mail not found" });
        }
        res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        console.error("Error retrieving data by nomor registrasi: ", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

// Controller untuk memperbarui data berdasarkan nomor registrasi
const updateMail = async (req, res) => {
    const { nomor_registrasi } = req.params; // Ambil nomor_registrasi dari params
    // Periksa apakah nomor_registrasi ada atau tidak
    if (!nomor_registrasi) {
        return res.status(400).json({ success: false, message: "Nomor registrasi tidak ditemukan" });
    }

    const {
        nomor_surat,
        surat_arahan,
        usaha_kegiatan,
        lokasi,
        kegiatan_yang_dimohonkan_arahan,
        jenis_dokumen,
        proses,
        sanksi_administrasi,
        catatan,
        sk_rekom_persetujuan_lingkungan,
        keterangan,
        tindak_lanjut_pertek_air_limbah_administrasi,
        tindak_lanjut_pertek_air_limbah_substansi,
        tindak_lanjut_pertek_emisi_administrasi,
        tindak_lanjut_pertek_emisi_substansi,
        tindak_lanjut_rintek_lb3_administrasi,
        tindak_lanjut_rintek_lb3_substansi,
        tindak_lanjut_andalalin_administrasi,
        tindak_lanjut_andalalin_substansi,
        tindak_lanjut_pengajuan_dokling_administrasi,
        tindak_lanjut_pengajuan_dokling_substansi
    } = req.body;

    try {
        const query = `
            UPDATE mails 
            SET nomor_surat = ?, 
                surat_arahan = ?, 
                usaha_kegiatan = ?, 
                lokasi = ?, 
                kegiatan_yang_dimohonkan_arahan = ?, 
                jenis_dokumen = ?, 
                proses = ?, 
                sanksi_administrasi = ?, 
                catatan = ?, 
                sk_rekom_persetujuan_lingkungan = ?, 
                keterangan = ?,
                tindak_lanjut_pertek_air_limbah_administrasi = ?, 
                tindak_lanjut_pertek_air_limbah_substansi = ?, 
                tindak_lanjut_pertek_emisi_administrasi = ?, 
                tindak_lanjut_pertek_emisi_substansi = ?, 
                tindak_lanjut_rintek_lb3_administrasi = ?, 
                tindak_lanjut_rintek_lb3_substansi = ?, 
                tindak_lanjut_andalalin_administrasi = ?, 
                tindak_lanjut_andalalin_substansi = ?, 
                tindak_lanjut_pengajuan_dokling_administrasi = ?, 
                tindak_lanjut_pengajuan_dokling_substansi = ?
            WHERE nomor_registrasi = ?;
        `;

        const [result] = await db.query(query, [
            nomor_surat,
            surat_arahan,
            usaha_kegiatan,
            lokasi,
            kegiatan_yang_dimohonkan_arahan,
            jenis_dokumen,
            proses,
            sanksi_administrasi,
            catatan,
            sk_rekom_persetujuan_lingkungan,
            keterangan,
            tindak_lanjut_pertek_air_limbah_administrasi,
            tindak_lanjut_pertek_air_limbah_substansi,
            tindak_lanjut_pertek_emisi_administrasi,
            tindak_lanjut_pertek_emisi_substansi,
            tindak_lanjut_rintek_lb3_administrasi,
            tindak_lanjut_rintek_lb3_substansi,
            tindak_lanjut_andalalin_administrasi,
            tindak_lanjut_andalalin_substansi,
            tindak_lanjut_pengajuan_dokling_administrasi,
            tindak_lanjut_pengajuan_dokling_substansi,
            nomor_registrasi // Di sini harus ada nomor_registrasi yang valid
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
        }

        res.status(200).json({ success: true, message: "Data berhasil diperbarui" });
    } catch (error) {
        console.error("Error updating data: ", error);
        res.status(500).json({ success: false, message: "Kesalahan internal server", error: error.message });
    }
};


// Controller untuk menghapus data berdasarkan nomor registrasi
const deleteMail = async (req, res) => {
    const { nomor_registrasi } = req.params;
    try {
        const query = 'DELETE FROM mails WHERE nomor_registrasi = ?';
        const [result] = await db.query(query, [nomor_registrasi]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Mail not found" });
        }
        res.status(200).json({ success: true, message: "Mail deleted successfully" });
    } catch (error) {
        console.error("Error deleting data: ", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

module.exports = {
    addMail,
    getAllMails,
    getMailByNomorRegistrasi,
    updateMail,
    deleteMail,
};
