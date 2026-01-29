module.exports = (stats, username) => `
<svg width="420" height="220" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: Inter, Arial; fill: #E5E7EB; }
    .title { font-size: 16px; font-weight: 600; }
    .label { fill: #9CA3AF; font-size: 12px; }
    .value { font-size: 13px; }
  </style>

  <rect width="100%" height="100%" rx="12" fill="#0B0F14"/>

  <text x="20" y="30" class="title">${username}'s GitHub Stats</text>

  <text x="20" y="60" class="label">Commits</text>
  <text x="140" y="60" class="value">${stats.commits}</text>

  <text x="20" y="85" class="label">Pull Requests</text>
  <text x="140" y="85" class="value">${stats.prs}</text>

  <text x="20" y="110" class="label">Issues</text>
  <text x="140" y="110" class="value">${stats.issues}</text>

  <text x="20" y="135" class="label">Repos Contributed</text>
  <text x="140" y="135" class="value">${stats.repos}</text>

  <text x="20" y="160" class="label">Stars Earned</text>
  <text x="140" y="160" class="value">${stats.stars}</text>

  <text x="320" y="120" font-size="32" font-weight="700" fill="#3B82F6">
    ${stats.grade}
  </text>
</svg>
`;
