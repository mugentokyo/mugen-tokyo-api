const Counter = require("../models/Counter");

async function generatePONumber() {
  const counter = await Counter.findOneAndUpdate(
    { name: "PO" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return `PO-${String(counter.seq).padStart(4, "0")}`;
}

module.exports = generatePONumber;
