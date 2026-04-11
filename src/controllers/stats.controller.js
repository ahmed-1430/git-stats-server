import { AppError } from "../lib/app-error.js";
import { getUserStats } from "../services/stats.service.js";
import { asyncHandler } from "../utils/async-handler.js";

const requireUsername = (query) => {
  const username = query.user?.trim();

  if (!username) {
    throw new AppError("Query parameter 'user' is required", 400);
  }

  return username;
};

export const getStats = asyncHandler(async (req, res) => {
  const username = requireUsername(req.query);
  const stats = await getUserStats(username);

  res.json(stats);
});

export const getActivity = asyncHandler(async (req, res) => {
  const username = requireUsername(req.query);
  const stats = await getUserStats(username);

  res.json({
    commits: stats.commits,
    pullRequests: stats.pullRequests,
    issues: stats.issues,
    totalContributions: stats.totalContributions,
    contributions: stats.contributions,
    status: stats.status,
    grade: stats.grade,
  });
});

export const getLanguages = asyncHandler(async (req, res) => {
  const username = requireUsername(req.query);
  const stats = await getUserStats(username);

  res.json({
    languages: stats.languages,
    stars: stats.stars,
    repos: stats.repos,
  });
});

export const getConsistency = asyncHandler(async (req, res) => {
  const username = requireUsername(req.query);
  const stats = await getUserStats(username);

  res.json({
    streak: stats.streak,
    activeWeeks: stats.activeWeeks,
    totalContributions: stats.totalContributions,
    reposContributed: stats.reposContributed,
  });
});
