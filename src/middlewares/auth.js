module.exports = (req, res, next) => {
  try {
    // Ambil user dari header
    const raw = req.headers["x-user"];

    if (!raw) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Parse user object
    const user = JSON.parse(raw);

    if (!user.id) {
      return res.status(401).json({ message: "Invalid user data" });
    }

    // Simpan ke request
    req.user = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
