const { Router } = require("express");
const {
  getItems,
  addToCart,
  createItem,
  addStock,
} = require("../controllers/item.controller");

const router = Router();

router.get("/", getItems);
router.post("/add-to-cart/:id", addToCart);
router.post("/", createItem);
router.put("/:id/add-stock", addStock);

module.exports = router;
