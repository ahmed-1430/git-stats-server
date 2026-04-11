import "dotenv/config";

import { AppError } from "../lib/app-error.js";

export const config = {
  githubToken: process.env.GITHUB_TOKEN,
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  cacheTtlSeconds: Number(process.env.CACHE_TTL_SECONDS || 600),
};

export const validateEnv = () => {
  if (!config.githubToken) {
    throw new AppError(
      "Missing GITHUB_TOKEN environment variable",
      500,
      "Create a GitHub personal access token with access to the GraphQL API.",
    );
  }
};
