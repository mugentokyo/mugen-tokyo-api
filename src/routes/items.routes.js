const { Router } = require("express");
const {
  getItems,
  addToCart,
  createItem,
  updateItem,
  deleteItem,
} = require("../controllers/item.controller");

const router = Router();

router.get("/", getItems);
router.post("/add-to-cart/:id", addToCart);
router.post("/", createItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

module.exports = router;
