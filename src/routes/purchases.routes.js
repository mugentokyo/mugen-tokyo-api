const { Router } = require("express");
const {
  getPurchases,
  createPurchase,
} = require("../controllers/purchase.controller");

const router = Router();

router.get("/", getPurchases);
router.post("/", createPurchase);

module.exports = router;
