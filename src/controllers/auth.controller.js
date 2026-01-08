const bcrypt = require("bcryptjs");
const User = require("../models/User");

/**
 * LOGIN
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username dan password wajib diisi",
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "User tidak ditemukan" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Password salah" });
    }

    // TANPA JWT
    return res.json({
      message: "Login berhasil",
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
};

/**
 * REGISTER USER (ADMIN ONLY)
 */
exports.register = async (req, res) => {
  try {
    const { username, password, adminSecret } = req.body;

    if (adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (!username || !password) {
      return res.status(400).json({
        message: "Username dan password wajib diisi",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashed,
      role: "user",
    });

    return res.json({
      message: "User berhasil dibuat",
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (err) {
    return res.status(400).json({
      message: "Username sudah digunakan",
    });
  }
};