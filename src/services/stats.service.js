import { AppError } from "../lib/app-error.js";
import { fetchGitHubData } from "../lib/github.client.js";
import { getCache, setCache } from "../utils/cache.js";
import {
  calculateActiveWeeks,
  calculateCurrentStreak,
  calculateExternalRepoContributions,
  calculateLanguageBreakdown,
  calculateLongestStreak,
  deriveActivityStatus,
  deriveGrade,
  flattenContributionDays,
} from "../utils/stats.helpers.js";

const statsQuery = `
  query DevInsightUserStats($login: String!) {
    user(login: $login) {
      name
      followers {
        totalCount
      }
      repositories(first: 100, ownerAffiliations: OWNER) {
        totalCount
        nodes {
          stargazerCount
          languages(first: 10) {
            edges {
              size
              node {
                name
              }
            }
          }
        }
      }
      repositoriesContributedTo(
        first: 100
        contributionTypes: [COMMIT, PULL_REQUEST, ISSUE]
        includeUserRepositories: true
      ) {
        nodes {
          name
          owner {
            login
          }
        }
      }
      contributionsCollection {
        totalCommitContributions
        totalPullRequestContributions
        totalIssueContributions
        totalRepositoryContributions
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
    }
  }
`;

const buildCacheKey = (username) => `devinsight:stats:${username.toLowerCase()}`;

export const getUserStats = async (username) => {
  const normalizedUsername = username.trim();
  const cacheKey = buildCacheKey(normalizedUsername);
  const cachedStats = getCache(cacheKey);

  if (cachedStats) {
    return cachedStats;
  }

  const data = await fetchGitHubData(statsQuery, { login: normalizedUsername });

  if (!data?.user) {
    throw new AppError("GitHub user not found", 404);
  }

  const user = data.user;
  const contributionCollection = user.contributionsCollection;
  const contributionWeeks = contributionCollection.contributionCalendar.weeks;
  const contributions = flattenContributionDays(contributionWeeks);
  const currentStreak = calculateCurrentStreak(contributions);
  const longestStreak = calculateLongestStreak(contributions);
  const activeWeeks = calculateActiveWeeks(contributionWeeks);

  const { languages, totalStars } = calculateLanguageBreakdown(
    user.repositories.nodes,
  );

  const reposContributed = calculateExternalRepoContributions(
    user.repositoriesContributedTo.nodes,
    normalizedUsername,
  );

  const totalContributions =
    contributionCollection.contributionCalendar.totalContributions;

  const stats = {
    name: user.name || normalizedUsername,
    commits: contributionCollection.totalCommitContributions,
    pullRequests: contributionCollection.totalPullRequestContributions,
    issues: contributionCollection.totalIssueContributions,
    reposContributed,
    repos: user.repositories.totalCount,
    followers: user.followers.totalCount,
    stars: totalStars,
    totalContributions,
    activeWeeks,
    streak: {
      current: currentStreak,
      longest: longestStreak,
    },
    languages,
    contributions,
    grade: deriveGrade({
      currentStreak,
      totalContributions,
      reposContributed,
    }),
    status: deriveActivityStatus(currentStreak, totalContributions),
  };

  setCache(cacheKey, stats);

  return stats;
};
