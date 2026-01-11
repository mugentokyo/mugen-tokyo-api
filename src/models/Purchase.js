const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PurchaseSchema = new Schema(
  {
    user: {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        required: true,
      },
    },
    items: [
      {
        itemId: {
          type: Schema.Types.ObjectId,
          ref: "Item",
          required: true,
        },
        name: String,
        qty: Number,
      },
    ],
    status: {
      type: String,
      enum: ["Belum Bayar", "Selesai", "Rejected"],
      default: "Belum Bayar",
    },
    totalPrice: Number,
    totalItems: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Purchase",
  PurchaseSchema,
  "pembelian"
);
