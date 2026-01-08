import { Router } from 'express';

import authRoutes from "./auth.routes.js";
import itemRoutes from "./items.routes.js";
import purchaseRoutes from "./purchases.routes.js";
import poRoutes from "./po.routes.js";
import userRoutes from "./users.routes.js";

const router = Router();
router.use('/auth', authRoutes);
router.use('/items', itemRoutes);
router.use('/users', userRoutes);
router.use('/purchases', purchaseRoutes);
router.use('/po', poRoutes);

export default router;