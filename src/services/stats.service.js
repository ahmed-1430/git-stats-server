import { fetchGitHubData } from "../lib/github.client.js";
import { getCache, setCache } from "../utils/cache.js";

const query = `
query($login: String!) {
  user(login: $login) {
    name

    followers {
      totalCount
    }

    repositories(first: 100, ownerAffiliations: OWNER) {
      totalCount
      nodes {
        stargazerCount
        languages(first: 5) {
          edges {
            size
            node {
              name
            }
          }
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

export const getStats = async (username) => {
    const cached = getCache(username);
    if (cached) return cached;

    const data = await fetchGitHubData(query, { login: username });

    if (!data || !data.user) {
        throw new Error("User not found");
    }

    const user = data.user;

    // CONTRIBUTIONS

    const weeks =
        user.contributionsCollection.contributionCalendar.weeks;

    const contributions = weeks.flatMap((week) =>
        week.contributionDays.map((day) => ({
            count: day.contributionCount,
            date: day.date,
        }))
    );

    const totalContributions =
        user.contributionsCollection.contributionCalendar.totalContributions;


    //  STREAK CALCULATION (FIXED)

    let longestStreak = 0;
    let tempStreak = 0;

    contributions.forEach((day) => {
        if (day.count > 0) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
        } else {
            tempStreak = 0;
        }
    });

    //  SMART CURRENT STREAK (ignore today if 0)
    let currentStreak = 0;

    for (let i = contributions.length - 1; i >= 0; i--) {
        const day = contributions[i];

        // Skip today if no commits
        if (i === contributions.length - 1 && day.count === 0) {
            continue;
        }

        if (day.count > 0) {
            currentStreak++;
        } else {
            break;
        }
    }


    //  LANGUAGES + STARS (FIXED)

    let totalStars = 0;
    let languageMap = {};

    user.repositories.nodes.forEach((repo) => {
        totalStars += repo.stargazerCount || 0;

        repo.languages.edges.forEach((lang) => {
            const name = lang.node.name;
            const size = lang.size;

            languageMap[name] = (languageMap[name] || 0) + size;
        });
    });

    const totalLangSize =
        Object.values(languageMap).reduce((a, b) => a + b, 0) || 1;

    const languages = Object.entries(languageMap)
        .map(([name, size]) => ({
            name,
            percent: Number(((size / totalLangSize) * 100).toFixed(1)),
        }))
        .sort((a, b) => b.percent - a.percent);


    //  SCORE SYSTEM (IMPROVED)

    const scoreRaw =
        totalContributions * 0.3 +
        currentStreak * 5 +
        totalStars * 2 +
        user.repositories.totalCount * 2;

    const score = Math.min(100, Math.round(scoreRaw / 100));

    let grade = "C";
    if (score >= 80) grade = "A";
    else if (score >= 60) grade = "B";
    const collection = user.contributionsCollection;

    const pullRequests = collection.totalPullRequestContributions;
    const issues = collection.totalIssueContributions;
    const reposContributed = collection.totalRepositoryContributions;
    const commits = collection.totalCommitContributions;


    const activeWeeks = weeks.filter((week) =>
        week.contributionDays.some((day) => day.contributionCount > 0)
    ).length;

    //  FINAL RESPONSE

    const stats = {
        name: user.name,

        commits,
        pullRequests,
        issues,
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

        score,
        grade,
    };

    setCache(username, stats);
    return stats;
};