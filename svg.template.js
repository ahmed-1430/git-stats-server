module.exports = (stats, username) => `
<svg width="520" height="240" viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0B0F14"/>
      <stop offset="100%" stop-color="#0E1623"/>
    </linearGradient>
  </defs>

  <style>
    .title { font: 600 17px Inter, Arial; fill: #E5E7EB; }
    .label { font: 12px Inter, Arial; fill: #9CA3AF; }
    .value { font: 14px Inter, Arial; fill: #F9FAFB; }
    .grade { font: 800 44px Inter, Arial; fill: #60A5FA; }
    .muted { fill: #6B7280; }
  </style>

  <!-- Card -->
  <rect width="520" height="240" rx="18" fill="url(#bg)"/>
  <rect x="1" y="1" width="518" height="238" rx="17" fill="none" stroke="#1F2937"/>

  <!-- Header -->
  <text x="28" y="38" class="title">${username} — GitHub Activity</text>
  <line x1="28" y1="48" x2="492" y2="48" stroke="#1F2937"/>

  <!-- Stats block -->
  <g transform="translate(28, 78)">
    <text class="label" y="0">Commits</text>
    <text class="value" x="180"> ${stats.commits}</text>

    <text class="label" y="28">Pull Requests</text>
    <text class="value" x="180" y="28">${stats.prs}</text>

    <text class="label" y="56">Issues</text>
    <text class="value" x="180" y="56">${stats.issues}</text>

    <text class="label" y="84">Repos Contributed</text>
    <text class="value" x="180" y="84">${stats.repos}</text>

    <text class="label" y="112">Stars Earned</text>
    <text class="value" x="180" y="112">${stats.stars}</text>
  </g>

  <!-- Grade Panel -->
  <g transform="translate(360, 80)">
    <rect width="120" height="120" rx="14" fill="#0B1220" stroke="#1F2937"/>
    <text x="60" y="60" text-anchor="middle" dominant-baseline="middle" class="grade">
      ${stats.grade}
    </text>
    <text x="60" y="95" text-anchor="middle" class="label muted">
      Activity Grade
    </text>
  </g>
</svg>
`;
