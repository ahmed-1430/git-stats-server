import { fetchGitHubData } from "../lib/github.client.js";
import { getCache, setCache } from "../utils/cache.js";

const query = `
query($login: String!) {
  user(login: $login) {
    name

    contributionsCollection {
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

    repositories(first: 100, ownerAffiliations: OWNER) {
      totalCount
      nodes {
        name
        stargazerCount
        languages(first: 5) {
          nodes {
            name
          }
        }
      }
    }

    followers {
      totalCount
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

    // ========================
    // 📊 CONTRIBUTIONS
    // ========================
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

    // ========================
    // 🔥 STREAK CALCULATION
    // ========================
    let currentStreak = 0;
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

    // current streak (reverse)
    for (let i = contributions.length - 1; i >= 0; i--) {
        if (contributions[i].count > 0) currentStreak++;
        else break;
    }

    // ========================
    // 🌍 LANGUAGES + STARS
    // ========================
    let totalStars = 0;
    let languageMap = {};

    user.repositories.nodes.forEach((repo) => {
        totalStars += repo.stargazerCount;

        repo.languages.nodes.forEach((lang) => {
            languageMap[lang.name] =
                (languageMap[lang.name] || 0) + 1;
        });
    });

    // Convert to percentage
    const totalLangs = Object.values(languageMap).reduce(
        (a, b) => a + b,
        0
    );

    const languages = Object.entries(languageMap).map(
        ([name, count]) => ({
            name,
            percent: ((count / totalLangs) * 100).toFixed(1),
        })
    );

    // ========================
    // 🎯 SCORE SYSTEM
    // ========================
    const scoreRaw =
        totalContributions * 0.4 +
        currentStreak * 2 +
        totalStars * 3 +
        user.repositories.totalCount * 2;

    const score = Math.min(100, Math.round(scoreRaw / 50));

    let grade = "C";
    if (score > 80) grade = "A";
    else if (score > 60) grade = "B";

    // ========================
    // 📦 FINAL RESPONSE
    // ========================
    const stats = {
        name: user.name,
        commits: totalContributions,
        repos: user.repositories.totalCount,
        followers: user.followers.totalCount,
        stars: totalStars,

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