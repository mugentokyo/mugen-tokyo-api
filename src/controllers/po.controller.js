const PO = require("../models/PO");
const User = require("../models/User");
const Item = require("../models/Item");
const generatePONumber = require("../utils/generatePONumber");
const { sendToDiscord } = require("../lib/discord.js");

const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;
/**
 * CREATE PO
 */
exports.createPO = async (req, res) => {
  try {
    const { user, items } = req.body;

    if (!user?.id || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid PO data" });
    }

    const userId = user.id;

    await PO.deleteMany({
      "user.userId": userId,
      createdAt: { $lt: new Date(Date.now() - THIRTY_DAYS) },
    });

    const dbUser = await User.findById(user.id);
    if (!dbUser) {
      return res.status(400).json({ message: "User tidak ditemukan" });
    }
    let totalItems = 0;
    let totalPrice = 0;

    for (const i of items) {
      const dbItem = await Item.findById(i.id);
      if (!dbItem) {
        return res.status(400).json({ message: "Item tidak ditemukan" });
      }
      if (dbItem.stock < i.qty) {
        return res.status(400).json({
          message: `Stok tidak cukup untuk ${dbItem.name}`,
        });
      }
      totalItems += i.qty;
      totalPrice += dbItem.price * i.qty;
    }

    const poNumber = await generatePONumber();

    const po = await PO.create({
      poNumber,
      user: {
        username: dbUser.username, 
        role: dbUser.role,         
      },
      items: items.map(i => ({
        itemId: i.id,
        name: i.name,
        qty: i.qty,
      })),
      status: "pending",
      totalItems: items.reduce((a, b) => a + b.qty, 0),
      totalPrice,
    });

    // 🔔 DISCORD NOTIFICATION
    const date = new Date().toLocaleString("en-GB", {
      timeZone: "Asia/Jakarta",
    });

    const usdFormatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    const itemList = items
      .map((i) => `• ${i.name} x ${i.qty}`)
      .join("\n");

    const message = `
      🛒 **PO BARU**
      👤 **${dbUser.username}**
      📦 Memesan:
      ${itemList}
      🔢 Total Item: **${totalItems}**
      💰 Total Harga: **${usdFormatter.format(totalPrice)}**
      🕒 Tanggal: **${date}**
      `;

    sendToDiscord(process.env.DISCORD_WEBHOOK_URL_PO, message);

    res.json({
      message: "PO berhasil dibuat",
      po,
    });
  } catch (err) {
    console.error("CREATE PO ERROR:", err);
    res.status(500).json({ message: "Gagal membuat PO" });
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

exports.getMemberPO = async (req, res) => {
  try {
    const userId = req.user.id;

    const pos = await PO.find({
      userId: userId
    }).sort({ createdAt: -1 });

    res.json(pos);
  } catch (err) {
    console.error("GET MY PO ERROR:", err);
    res.status(500).json({ message: "Gagal mengambil history PO" });
  }
};
