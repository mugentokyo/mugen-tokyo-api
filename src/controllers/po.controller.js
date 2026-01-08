const PO = require("../models/PO");

/**
 * CREATE PO
 */
exports.createPO = async (req, res) => {
  try {
    const { user, items } = req.body;

    if (!user || !items || items.length === 0) {
      return res.status(400).json({ message: "Invalid PO data" });
    }

    const poCount = await PO.countDocuments();
    const poNumber = `PO-${String(poCount + 1).padStart(4, "0")}`;

    const po = await PO.create({
      poNumber,
      user,
      items: items.map((i) => ({
        itemId: i._id,
        name: i.name,
        kategori: i.kategori,
        qty: i.qty,
      })),
    });

    res.json({
      message: "PO berhasil dibuat",
      po,
    });
  } catch (err) {
    res.status(500).json({
      message: "Gagal membuat PO",
    });
  }
};

/**
 * LIST PO (ADMIN)
 */
exports.getPOs = async (_req, res) => {
  try {
    const pos = await PO.find().sort({ createdAt: -1 });
    res.json(pos);
  } catch (err) {
    res.status(500).json({
      message: "Gagal mengambil data PO",
    });
  }
};

/**
 * UPDATE STATUS PO (ADMIN)
 */
exports.updatePOStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const po = await PO.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!po) {
      return res.status(404).json({ message: "PO tidak ditemukan" });
    }

    res.json(po);
  } catch (err) {
    res.status(500).json({
      message: "Gagal mengupdate status PO",
    });
  }
};
