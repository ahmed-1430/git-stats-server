import { config } from "../config/env.js";
import { AppError } from "./app-error.js";

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

export const fetchGitHubData = async (query, variables = {}) => {
  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.githubToken}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
      "User-Agent": "DevInsight",
    },
    body: JSON.stringify({ query, variables }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new AppError(
      "GitHub API request failed",
      response.status,
      payload,
    );
  }

  if (payload.errors?.length) {
    const [firstError] = payload.errors;
    const statusCode = firstError.type === "NOT_FOUND" ? 404 : 502;

    throw new AppError(firstError.message, statusCode, payload.errors);
  }

  return payload.data;
};
