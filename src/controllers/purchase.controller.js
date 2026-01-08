const mongoose = require("mongoose");
const Purchase = require("../models/Purchase");
const Item = require("../models/Item");
const User = require("../models/User");

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
  const session = await mongoose.startSession();

  try {
    const { user, items } = req.body;

    if (!user?.id || !items?.length) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    session.startTransaction();

    const dbUser = await User.findById(user.id).session(session);
    if (!dbUser) {
      await session.abortTransaction();
      return res.status(400).json({ message: "User not found" });
    }

    // VALIDASI STOK
    for (const i of items) {
      const dbItem = await Item.findById(i.id).session(session);
      if (!dbItem) {
        await session.abortTransaction();
        return res.status(400).json({ message: "Item tidak ditemukan" });
      }
      if (dbItem.stock < i.qty) {
        await session.abortTransaction();
        return res.status(400).json({
          message: `Stok tidak cukup untuk ${dbItem.name}`,
        });
      }
    }

    // SIMPAN PURCHASE
    const purchase = await Purchase.create(
      [
        {
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
          totalItems: items.reduce((a, b) => a + b.qty, 0),
        },
      ],
      { session }
    );

    // KURANGI STOK
    for (const i of items) {
      await Item.findByIdAndUpdate(
        i.id,
        { $inc: { stock: -i.qty } },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    res.json({
      message: "Pembelian berhasil",
      purchase: purchase[0],
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.error("PURCHASE ERROR:", err);
    res.status(500).json({ message: "Gagal menyimpan pembelian" });
  }
};