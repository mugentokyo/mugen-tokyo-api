const bcrypt = require("bcryptjs");
const User = require("../models/User");

/**
 * GET ALL USERS
 */
exports.getUsers = async (_req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil data user" });
  }
};

/**
 * CREATE USER
 */
exports.createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username dan password wajib diisi",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashed,
      role: role || "user",
    });

    res.json({
      message: "User berhasil dibuat",
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(400).json({
      message: "Username sudah digunakan",
    });
  }
};
