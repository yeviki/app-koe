// controllers/public/angsuranController.js
const ModelData = require("../../models/public/angsuranModel");
const { sanitize } = require("../../utils/validate");

const formatDateOnly = (val) => {
  if (!val) return null;

  // kalau sudah YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
    return val;
  }

  // ISO date → ambil tanggal saja
  const d = new Date(val);
  return d.toISOString().slice(0, 10);
};

// ambil payload
const getMetaData = (body) => ({
  id_pinjaman           : body.id_pinjaman,
  tgl_transaksi         : formatDateOnly(body.tgl_transaksi),
  jumlah_setor          : sanitize(body.jumlah_setor),
  angsuran_ke           : sanitize(body.angsuran_ke),
  keterangan            : body.keterangan,
});

exports.listAngsuran = async (req, res, next) => {
  try {
    const [rows] = await ModelData.getByPinjaman(req.params.id);
    const [[{ total_setor }]] = await ModelData.getTotalSetor(req.params.id);

    res.json({
      list: rows,
      total_setor,
    });
  } catch (e) {
    next(e);
  }
};

exports.createAngsuran = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const createdDate = new Date();
    const data = getMetaData(req.body);

    const setor = Number(data.jumlah_setor);

    // ===============================
    // VALIDASI JUMLAH SETOR
    // ===============================
    if (!setor || setor <= 0) {
      return res.status(400).json({
        message: "Jumlah setor harus lebih dari 0"
      });
    }

    // ===============================
    // AMBIL DATA PINJAMAN
    // ===============================
    const [pinjamanRows] = await ModelData.getDetailPinjaman(data.id_pinjaman);
    if (pinjamanRows.length === 0) {
      return res.status(404).json({
        message: "Data pinjaman tidak ditemukan"
      });
    }

    const pinjaman = pinjamanRows[0];
    const total_keseluruhan = Number(pinjaman.total_keseluruhan);
    const angsuranWajib = Number(pinjaman.total_angsuran);
    const tenor = Number(pinjaman.tenor_hari);

    // ===============================
    // VALIDASI TENOR
    // ===============================
    if (data.angsuran_ke > tenor) {
      return res.status(400).json({
        message: `Angsuran ke-${data.angsuran_ke} melebihi tenor pinjaman (${tenor})`
      });
    }

    // ===============================
    // VALIDASI DUPLIKASI
    // ===============================
    const [cekKe] = await ModelData.checkAngsuranKe(
      data.id_pinjaman,
      data.angsuran_ke
    );
    if (cekKe.length > 0) {
      return res.status(400).json({
        message: `Angsuran ke-${data.angsuran_ke} sudah tercatat`
      });
    }

    const [cekTanggal] = await ModelData.checkTanggal(
      data.id_pinjaman,
      data.tgl_transaksi
    );
    if (cekTanggal.length > 0) {
      return res.status(400).json({
        message: `Tanggal angsuran ${data.tgl_transaksi} sudah tercatat`
      });
    }

    // ===============================
    // HITUNG TOTAL SETOR & SISA
    // ===============================
    const [[{ total_setor }]] = await ModelData.getTotalSetor(data.id_pinjaman);
    const sudahSetor = Number(total_setor);
    const sisa = total_keseluruhan - sudahSetor;

    if (sisa <= 0) {
      return res.status(400).json({
        message: "Pinjaman sudah lunas, tidak dapat melakukan angsuran lagi"
      });
    }

    // ===============================
    // VALIDASI NOMINAL SETOR
    // ===============================
    const isAngsuranTerakhir = Number(data.angsuran_ke) === tenor;

    // ===============================
    // JIKA ANGSURAN TERAKHIR
    // ===============================
    if (isAngsuranTerakhir) {
      if (setor !== sisa) {
        return res.status(400).json({
          message: `Nominal angsuran terakhir harus sesuai dengan sisa pinjaman yaitu Rp ${sisa.toLocaleString("id-ID")}`
        });
      }
    }
    // ===============================
    // JIKA BUKAN ANGSURAN TERAKHIR
    // ===============================
    else {
      if (setor > angsuranWajib) {
        return res.status(400).json({
          message: `Nominal angsuran tidak boleh melebihi Rp ${angsuranWajib.toLocaleString("id-ID")}`
        });
      }
    }

    // ===============================
    // SIMPAN
    // ===============================
    data.id_users = userId;
    data.created_date = createdDate;

    await ModelData.create(data);

    res.json({ message: "Angsuran berhasil disimpan" });
  } catch (err) {
    next(err);
  }
};


exports.deleteAngsuran = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await ModelData.getById(id);
    if (rows.length === 0) {
      fieldError({ general: "Data tidak ditemukan" }, 404);
    }

    await ModelData.delete(id);

    res.json({ message: "Data berhasil dihapus" });
  } catch (err) {
    next(err);
  }
};


// ===============================
// LAPORAN ANGSURAN (CETAK)
// ===============================
exports.getLaporanAngsuran = async (req, res, next) => {
  try {
    const { mode, tanggal, start, end, bulan, tahun } = req.query;

    const userId  = req.user.id;
    const roleId  = req.user.roles_id;

    // role 1 & 2 boleh lihat semua
    const isAdmin = [1, 2].includes(Number(roleId));

    let rows;

    switch (mode) {
      case "harian":
        if (!tanggal) fieldError({ tanggal: "Tanggal wajib diisi" });

        [rows] = await ModelData.getAngsuranHarian(
          tanggal,
          isAdmin ? null : userId
        );
        break;

      case "range":
        if (!start || !end) fieldError({ range: "Tanggal awal & akhir wajib diisi" });

        [rows] = await ModelData.getAngsuranRange(
          start,
          end,
          isAdmin ? null : userId
        );
        break;

      case "bulan":
        if (!bulan) fieldError({ bulan: "Bulan wajib diisi" });

        [rows] = await ModelData.getAngsuranBulanan(
          bulan,
          isAdmin ? null : userId
        );
        break;

      case "tahun":
        if (!tahun) fieldError({ tahun: "Tahun wajib diisi" });

        [rows] = await ModelData.getAngsuranTahunan(
          tahun,
          isAdmin ? null : userId
        );
        break;

      default:
        fieldError({ mode: "Mode filter tidak valid" });
    }

    res.json(rows);
  } catch (err) {
    next(err);
  }
};
