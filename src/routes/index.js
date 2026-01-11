import { Router } from 'express';
import auth from "../middlewares/auth.js";
import authRoutes from "./auth.routes.js";
import itemRoutes from "./items.routes.js";
import purchaseRoutes from "./purchases.routes.js";
import poRoutes from "./po.routes.js";
import userRoutes from "./users.routes.js";

const router = Router();
router.use("/auth", authRoutes);
router.use("/items", itemRoutes);

// PROTECTED
router.use("/purchases", auth, purchaseRoutes);
router.use("/po", auth, poRoutes);
router.use("/users", auth, userRoutes);

export default router;