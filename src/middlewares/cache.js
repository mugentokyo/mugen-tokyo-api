export const noCache = (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
};

export const cache60s = (req, res, next) => {
  res.setHeader("Cache-Control", "public, max-age=60");
  next();
};
