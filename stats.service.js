function calculateStats(data) {
    const user = data.user;

    const stars = user.repositories.nodes.reduce(
        (sum, r) => sum + r.stargazerCount,
        0
    );

    const grade = (user.contributionsCollection.totalCommitContributions > 800)
        ? "A"
        : (user.contributionsCollection.totalCommitContributions > 400)
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

module.exports = calculateStats;
