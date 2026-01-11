const { Router } = require("express");
const {
  createPO,
  getPOs,
  updatePOStatus,
  getMemberPO,
} = require("../controllers/po.controller");
const auth = require("../middlewares/auth");

const router = Router();

router.post("/", createPO);
router.get("/", getPOs);
router.patch("/:id/status", updatePOStatus);
router.get("/me", auth, getMemberPO);

module.exports = router;
