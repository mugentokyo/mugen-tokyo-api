import axios from "axios";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const otpStore = new Map();
/**
 * LOGIN
 */
export const login = async (req, res) => {
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
export const register = async (req, res) => {
  const { username, password, otp } = req.body;

  if (!username || !password || !otp) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  const otpData = otpStore.get(username);
  if (!otpData) {
    return res.status(400).json({ message: "OTP belum diminta" });
  }

  if (otpData.expiredAt < Date.now()) {
    otpStore.delete(username);
    return res.status(400).json({ message: "OTP expired" });
  }

  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
  if (otpHash !== otpData.otpHash) {
    return res.status(400).json({ message: "OTP salah" });
  }

  const existing = await User.findOne({ username });
  if (existing) {
    return res.status(409).json({ message: "Username sudah digunakan" });
  }

  const hashed = await bcrypt.hash(password, 10);

  await User.create({
    username,
    password: hashed,
    role: "user",
  });

  otpStore.delete(username);

  res.status(201).json({ message: "Register berhasil" });
};

export const requestOtp = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Username wajib diisi" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  otpStore.set(username, {
    otpHash,
    expiredAt: Date.now() + 5 * 60 * 1000, // 5 menit
  });

  await axios.post(process.env.DISCORD_WEBHOOK_URL_OTP, {
    content: `🔐 OTP Register\nUser: **${username}**\nOTP: **${otp}**`,
  });

  res.json({ message: "OTP dikirim" });
};