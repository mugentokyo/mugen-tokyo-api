const mongoose = require("mongoose");
const Purchase = require("../models/Purchase");
const Item = require("../models/Item");
const User = require("../models/User");
const { sendToDiscord } = require("../lib/discord.js");

const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;
/**
 * GET ALL PURCHASES
 */
exports.getPurchases = async (_req, res) => {
  try {
    const purchases = await Purchase.find()
      .sort({ createdAt: -1 });

    res.json(purchases);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal ambil pembelian" });
  }
};

/**
 * CREATE PURCHASE
 */
exports.createPurchase = async (req, res) => {
  try {
    const { user, items } = req.body;

    if (!user?.id || !items?.length) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    const userId = user.id;

    await Purchase.deleteMany({
      "user.userId": userId,
      createdAt: { $lt: new Date(Date.now() - THIRTY_DAYS) },
    });

    const dbUser = await User.findById(user.id);
    if (!dbUser) {
      return res.status(400).json({ message: "User not found" });
    }

    let totalPrice = 0;
    let totalItems = 0;

    // VALIDASI STOK
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

    // SIMPAN PURCHASE
    const purchase = await Purchase.create({
      user: {
        userId: dbUser._id,
        username: dbUser.username,
        role: dbUser.role,
      },
      items: items.map((i) => ({
        itemId: i.id,
        name: i.name,
        qty: i.qty,
      })),
      status: "Belum Bayar",
      totalItems,
      totalPrice,
    });

    // KURANGI STOK
    for (const i of items) {
      await Item.findByIdAndUpdate(i.id, {
        $inc: { stock: -i.qty },
      });
    }
    const usdFormatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    // 🔔 DISCORD NOTIFICATION
    const date = new Date().toLocaleString("en-GB", {
      timeZone: "Asia/Jakarta",
    });

    const itemList = items
      .map((i) => `• ${i.name} x ${i.qty}`)
      .join("\n");

    const message = `
🛒 **TRANSAKSI BARU**
👤 **${dbUser.username}**
📦 Membeli:
${itemList}
🔢 Total Item: **${totalItems}**
💰 Total Harga: **${usdFormatter.format(totalPrice)}**
🕒 Tanggal: **${date}**
`;
    sendToDiscord(process.env.DISCORD_WEBHOOK_URL_PURCHASE, message);

    return res.json({
      message: "Pembelian berhasil",
      purchase,
    });
  } catch (err) {
    console.error("PURCHASE ERROR:", err);
    return res.status(500).json({ message: "Gagal menyimpan pembelian" });
  }
};

exports.updatePurchaseStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Belum Bayar", "Selesai", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const purchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!purchase) {
      return res.status(404).json({ message: "List Pembelian tidak ditemukan" });
    }

    res.json(purchase);
  } catch (err) {
    res.status(500).json({
      message: "Gagal mengupdate status Pembelian",
    });
  }
};

exports.getMemberPurchases = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const purchases = await Purchase.find({
      "user.userId": userId
    }).sort({ createdAt: -1 });

    res.json(purchases);
  } catch (err) {
    console.error("GET MEMBER PURCHASE ERROR:", err);
    res.status(500).json({ message: "Gagal mengambil history" });
  }
};

