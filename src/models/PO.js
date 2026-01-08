const mongoose = require("mongoose");

const POSchema = new mongoose.Schema(
  {
    poNumber: { type: String, required: true, unique: true },

    user: {
      username: { type: String, required: true },
      role: { type: String, required: true },
    },

    items: [
      {
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
        name: String,
        kategori: String,
        qty: Number,
      },
    ],

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: "list_PO",
  }
);

module.exports = mongoose.model("PO", POSchema);
