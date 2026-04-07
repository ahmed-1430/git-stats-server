import express from "express";
import statsRoutes from "./routes/stats.routes.js";
import { config } from "./config/env.js";
import "dotenv/config";

const app = express();

app.use("/api", statsRoutes);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});