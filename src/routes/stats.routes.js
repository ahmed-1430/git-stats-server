import express from "express";

import {
  getActivity,
  getConsistency,
  getLanguages,
  getStats,
} from "../controllers/stats.controller.js";

const router = express.Router();

router.get("/stats", getStats);
router.get("/activity", getActivity);
router.get("/languages", getLanguages);
router.get("/consistency", getConsistency);

export default router;
