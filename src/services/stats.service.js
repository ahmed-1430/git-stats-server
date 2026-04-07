import { fetchGitHubData } from "../lib/github.client.js";
import { getCache, setCache } from "../utils/cache.js";

const query = `
query($login: String!) {
  user(login: $login) {
    name
    contributionsCollection {
      contributionCalendar {
        totalContributions
      }
    }
    repositories(first: 50) {
      totalCount
      nodes {
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
    const user = data.user;

    let totalStars = 0;
    let languageMap = {};

    user.repositories.nodes.forEach((repo) => {
        totalStars += repo.stargazerCount;

        repo.languages.nodes.forEach((lang) => {
            languageMap[lang.name] = (languageMap[lang.name] || 0) + 1;
        });
    });

    const stats = {
        name: user.name,
        commits: user.contributionsCollection.contributionCalendar.totalContributions,
        repos: user.repositories.totalCount,
        followers: user.followers.totalCount,
        stars: totalStars,
        languages: languageMap,
    };

    setCache(username, stats);
    return stats;
};