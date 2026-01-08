const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true, default: 0 },
  image: { type: String },
});

module.exports = mongoose.model("Item", ItemSchema);