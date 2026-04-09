import { fetchGitHubData } from "../lib/github.client.js";
import { getCache, setCache } from "../utils/cache.js";

const query = `
query($login: String!) {
  user(login: $login) {
    name

    followers {
      totalCount
    }

    # OWN REPOSITORIES
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

    #  CONTRIBUTED REPOSITORIES (IMPORTANT)
    repositoriesContributedTo(
      first: 100
      contributionTypes: [COMMIT, PULL_REQUEST, ISSUE]
    ) {
      totalCount
      nodes {
        name
        owner {
          login
        }
      }
    }

    # CONTRIBUTIONS
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
    const collection = user.contributionsCollection;

    /* ========================
        CONTRIBUTIONS
    ======================== */

    const weeks = collection.contributionCalendar.weeks;

    const contributions = weeks.flatMap((week) =>
        week.contributionDays.map((day) => ({
            count: day.contributionCount,
            date: day.date,
        }))
    );

    const totalContributions =
        collection.contributionCalendar.totalContributions;


    // STREAK


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

    let currentStreak = 0;

    for (let i = contributions.length - 1; i >= 0; i--) {
        const day = contributions[i];

        if (i === contributions.length - 1 && day.count === 0) continue;

        if (day.count > 0) currentStreak++;
        else break;
    }


    //     ACTIVE WEEKS


    const activeWeeks = weeks.filter((week) =>
        week.contributionDays.some((d) => d.contributionCount > 0)
    ).length;


    // LANGUAGES + STARS


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


    //     ACTIVITY METRICS

    const commits = collection.totalCommitContributions;
    const pullRequests = collection.totalPullRequestContributions;
    const issues = collection.totalIssueContributions;
    const contributedRepos =
        user.repositoriesContributedTo.nodes;

    const reposContributed = contributedRepos.filter(
        (repo) => repo.owner.login !== username
    ).length;


    // ACTIVITY STATUS (NEW)


    let status = "Inactive";

    if (currentStreak >= 90) status = "Elite";
    else if (currentStreak >= 30) status = "Highly Active";
    else if (currentStreak >= 7) status = "Active";
    else if (totalContributions > 200) status = "Consistent";
    else status = "Learning";


    // FINAL RESPONSE


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

        status, //  NEW (REPLACE SCORE)
    };

    setCache(username, stats);
    return stats;
};