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
exports.addStock = async (req, res) => {
  try {
    const { qty } = req.body;

    if (!qty || qty <= 0) {
      return res.status(400).json({ message: "Qty tidak valid" });
    }

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item tidak ditemukan" });
    }

    item.stock += qty;
    await item.save();

    res.json({
      message: "Stok berhasil ditambahkan",
      item,
    });
  } catch (err) {
    res.status(500).json({ message: "Gagal menambahkan stok" });
  }
};
