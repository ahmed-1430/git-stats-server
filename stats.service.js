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


function calculateConsistency(contributionCalendar) {
    const days = contributionCalendar.weeks.flatMap(
        week => week.contributionDays
    );

    let activeWeeks = 0;
    let longestStreak = 0;
    let currentStreak = 0;
    let tempStreak = 0;

    // Active weeks
    contributionCalendar.weeks.forEach(week => {
        const weekTotal = week.contributionDays.reduce(
            (sum, d) => sum + d.contributionCount,
            0
        );
        if (weekTotal > 0) activeWeeks++;
    });

    // Longest streak
    days.forEach(day => {
        if (day.contributionCount > 0) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
        } else {
            tempStreak = 0;
        }
    });

    // Current streak (count backwards from today)
    for (let i = days.length - 1; i >= 0; i--) {
        if (days[i].contributionCount > 0) {
            currentStreak++;
        } else {
            break;
        }
    }

    return {
        contributions: contributionCalendar.totalContributions,
        activeWeeks,
        longestStreak,
        currentStreak
    };
}

function calculateContributionTrend(contributionCalendar) {
  // Flatten days
  const days = contributionCalendar.weeks.flatMap(
    week => week.contributionDays
  );

  // Take last 30 days
  const last30 = days.slice(-30);

  const values = last30.map(d => d.contributionCount);

  const max = Math.max(...values);
  const avg =
    values.reduce((a, b) => a + b, 0) / values.length;

  return {
    values,
    max,
    avg: avg.toFixed(1)
  };
}




module.exports = {
    calculateStats,
    calculateLanguages,
    calculateConsistency,
    calculateContributionTrend
};
