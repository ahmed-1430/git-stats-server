import cors from "cors";
import express from "express";

import { config, validateEnv } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import statsRoutes from "./routes/stats.routes.js";

validateEnv();

const app = express();

app.disable("x-powered-by");
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "DevInsight",
    environment: config.nodeEnv,
  });
});

app.use("/api", statsRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

if (!process.env.VERCEL) {
  app.listen(config.port, () => {
    console.log(`DevInsight backend running on port ${config.port}`);
  });
}

export default app;
