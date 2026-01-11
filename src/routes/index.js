import { Router } from 'express';
import auth from "../middlewares/auth.js";
import { noCache, cache60s } from "../middlewares/cache.js";
import authRoutes from "./auth.routes.js";
import itemRoutes from "./items.routes.js";
import purchaseRoutes from "./purchases.routes.js";
import poRoutes from "./po.routes.js";
import userRoutes from "./users.routes.js";

const router = Router();
router.use("/auth", authRoutes);

router.use("/items", cache60s, itemRoutes);

router.use("/purchases", auth, noCache, purchaseRoutes);
router.use("/po", auth, noCache, poRoutes);
router.use("/users", auth, noCache, userRoutes);

export default router;