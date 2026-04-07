import express from "express";
import { statsController } from "../controllers/stats.controller.js";

const router = express.Router();

router.get("/stats", statsController);
router.get("/activity", statsController);
router.get("/languages", statsController);
router.get("/consistency", statsController);

export default router;