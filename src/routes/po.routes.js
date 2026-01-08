const { Router } = require("express");
const {
  createPO,
  getPOs,
  updatePOStatus,
} = require("../controllers/po.controller");

const router = Router();

router.post("/", createPO);
router.get("/", getPOs);
router.patch("/:id/status", updatePOStatus);

module.exports = router;
