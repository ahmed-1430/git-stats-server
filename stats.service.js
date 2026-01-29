function calculateStats(data) {
    const user = data.user;

    const stars = user.repositories.nodes.reduce(
        (sum, r) => sum + r.stargazerCount,
        0
    );

    const grade =
        user.contributionsCollection.totalCommitContributions > 800
            ? "A"
            : user.contributionsCollection.totalCommitContributions > 400
                ? "B"
                : "C";

    return {
        commits: user.contributionsCollection.totalCommitContributions,
        prs: user.contributionsCollection.totalPullRequestContributions,
        issues: user.contributionsCollection.totalIssueContributions,
        repos: user.repositoriesContributedTo.totalCount,
        stars,
        grade
    };
}

function calculateLanguages(repos) {
  const langMap = {};

  repos.forEach(repo => {
    if (!repo.languages || !repo.languages.edges) return;

    repo.languages.edges.forEach(({ node, size }) => {
      if (!node?.name || !size) return;

      langMap[node.name] = (langMap[node.name] || 0) + size;
    });
  });

  const total = Object.values(langMap).reduce((a, b) => a + b, 0);
  if (total === 0) return [];

  return Object.entries(langMap)
    .map(([name, size]) => ({
      name,
      percent: ((size / total) * 100).toFixed(1)
    }))
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 4);
}


module.exports = {
    calculateStats,
    calculateLanguages
};
