import express from "express";
import { statsController } from "../controllers/stats.controller.js";

const router = express.Router();

router.get("/stats", statsController);

export default router;