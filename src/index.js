import express from "express";
import statsRoutes from "./routes/stats.routes.js";
import { config } from "./config/env.js";
import "dotenv/config";
import cors from "cors";


const app = express();
app.use(cors());

app.use("/api", statsRoutes);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});