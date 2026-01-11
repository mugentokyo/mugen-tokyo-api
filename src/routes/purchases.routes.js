const { Router } = require("express");
const {
  getPurchases,
  createPurchase,
  updatePurchaseStatus,
  getMemberPurchases,
} = require("../controllers/purchase.controller");
const auth = require("../middlewares/auth");

const router = Router();

router.get("/", getPurchases);
router.post("/", createPurchase);
router.patch("/:id/status", updatePurchaseStatus);
router.get("/me", auth, getMemberPurchases);

module.exports = router;
