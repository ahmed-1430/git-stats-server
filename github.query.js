module.exports = `
query ($username: String!) {
  user(login: $username) {
    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
          }
        }
      }
    }

    repositoriesContributedTo(first: 100) {
      totalCount
    }

    repositories(first: 100, ownerAffiliations: OWNER) {
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
  }
}
`;
