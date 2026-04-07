// src/services/stats.service.js

import { fetchGitHubData } from "../lib/github.client.js";
import { userQuery } from "../github.query.js";

export const getStats = async (username) => {
  const data = await fetchGitHubData(userQuery, { login: username });

  const user = data.user;

  return {
    commits: user?.contributionsCollection?.totalCommitContributions || 0,
    repos: user?.repositories?.totalCount || 0,
    followers: user?.followers?.totalCount || 0,
  };
};