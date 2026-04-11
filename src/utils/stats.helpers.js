export const flattenContributionDays = (weeks) =>
  weeks.flatMap((week) =>
    week.contributionDays.map((day) => ({
      date: day.date,
      count: day.contributionCount,
    })),
  );

export const calculateLongestStreak = (contributions) => {
  let longestStreak = 0;
  let streak = 0;

  for (const day of contributions) {
    if (day.count > 0) {
      streak += 1;
      longestStreak = Math.max(longestStreak, streak);
    } else {
      streak = 0;
    }
  }

  return longestStreak;
};

export const calculateCurrentStreak = (contributions) => {
  let currentStreak = 0;

  for (let index = contributions.length - 1; index >= 0; index -= 1) {
    const day = contributions[index];

    // Ignore today when there are no contributions yet.
    if (index === contributions.length - 1 && day.count === 0) {
      continue;
    }

    if (day.count > 0) {
      currentStreak += 1;
    } else {
      break;
    }
  }

  return currentStreak;
};

export const calculateActiveWeeks = (weeks) => {
  const recent52Weeks = weeks.slice(-52);

  return recent52Weeks.filter((week) =>
    week.contributionDays.some((day) => day.contributionCount > 0),
  ).length;
};

export const calculateLanguageBreakdown = (repositories) => {
  const languageTotals = {};
  let totalStars = 0;

  for (const repo of repositories) {
    totalStars += repo.stargazerCount || 0;

    for (const language of repo.languages.edges) {
      const languageName = language.node.name;
      languageTotals[languageName] =
        (languageTotals[languageName] || 0) + language.size;
    }
  }

  const totalLanguageBytes =
    Object.values(languageTotals).reduce((sum, value) => sum + value, 0) || 1;

  const languages = Object.entries(languageTotals)
    .map(([name, bytes]) => ({
      name,
      percent: Number(((bytes / totalLanguageBytes) * 100).toFixed(1)),
    }))
    .sort((left, right) => right.percent - left.percent);

  return {
    languages,
    totalStars,
  };
};

export const calculateExternalRepoContributions = (repositories, username) =>
  repositories.filter(
    (repository) =>
      repository.owner?.login?.toLowerCase() !== username.toLowerCase(),
  ).length;

export const deriveActivityStatus = (currentStreak, totalContributions) => {
  if (currentStreak >= 90) return "Elite";
  if (currentStreak >= 30) return "Highly Active";
  if (currentStreak >= 7) return "Active";
  if (totalContributions >= 200) return "Consistent";

  return "Learning";
};

export const deriveGrade = ({
  currentStreak,
  totalContributions,
  reposContributed,
}) => {
  if (currentStreak >= 90 || totalContributions >= 1000) {
    return "A";
  }

  if (
    currentStreak >= 30 ||
    totalContributions >= 400 ||
    reposContributed >= 10
  ) {
    return "B";
  }

  return "C";
};
