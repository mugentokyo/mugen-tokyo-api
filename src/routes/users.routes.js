const { Router } = require("express");
const {
  getUsers,
  createUser,
  deleteUser
} = require("../controllers/user.controller");

const router = Router();

router.get("/", getUsers);
router.post("/", createUser);
router.delete("/:id", deleteUser);

module.exports = router;
