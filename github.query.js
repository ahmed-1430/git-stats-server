module.exports = `
query($username: String!) {
  user(login: $username) {
    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
    }
    repositoriesContributedTo(first: 100) {
      totalCount
    }
    repositories(first: 100, ownerAffiliations: OWNER) {
      nodes {
        stargazerCount
        primaryLanguage {
          name
        }
      }
    }
  }
}
`;
