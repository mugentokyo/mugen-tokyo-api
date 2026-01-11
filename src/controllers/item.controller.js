const Item = require("../models/Item");

/**
 * GET ALL ITEMS
 */
exports.getItems = async (_req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil data item" });
  }
};

/**
 * ADD TO CART (KURANGI STOK 1)
 */
exports.addToCart = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item || item.stock === 0) {
      return res.status(400).json({ message: "Out of stock" });
    }

    item.stock = item.stock - 1;
    await item.save();

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Gagal menambahkan ke cart" });
  }
};

/**
 * CREATE ITEM
 */
exports.createItem = async (req, res) => {
  try {
    const { name, category, stock, image } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        message: "Name dan category wajib diisi",
      });
    }

    const newItem = await Item.create({
      name,
      category,
      stock: stock ?? 0,
      image,
    });

    res.status(201).json({
      message: "Item berhasil ditambahkan",
      item: newItem,
    });
  } catch (err) {
    res.status(500).json({
      message: "Gagal menambahkan item",
    });
  }
};

/**
 * ADD STOCK
 */
exports.updateItem = async (req, res) => {
  try {
    const { name, category, price, qty } = req.body;

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item tidak ditemukan" });
    }

    // 🔹 Update field jika dikirim
    if (name !== undefined) item.name = name;
    if (category !== undefined) item.category = category;
    if (price !== undefined) item.price = price;

    // 🔹 Update stok (qty = penambahan / pengurangan)
    if (qty !== undefined) {
      if (typeof qty !== "number") {
        return res.status(400).json({ message: "Qty harus berupa angka" });
      }

      const newStock = qty;
      if (newStock < 0) {
        return res.status(400).json({ message: "Stok tidak boleh negatif" });
      }

      item.stock = newStock;
    }

    await item.save();

    res.json({
      message: "Item berhasil diperbarui",
      item,
    });
  } catch (err) {
    console.error("UPDATE ITEM ERROR:", err);
    res.status(500).json({ message: "Gagal memperbarui item" });
  }
};

exports.deleteItem = async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: "Item deleted" });
};