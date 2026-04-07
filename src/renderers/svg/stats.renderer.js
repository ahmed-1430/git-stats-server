// src/renderers/svg/stats.renderer.js

const buildSmoothPath = (data) => {
    const max = Math.max(...data);
    const stepX = 10;
    const height = 80;

    return data
        .map((value, i) => {
            const x = i * stepX;
            const y = height - (value / max) * height;
            return `${i === 0 ? "M" : "L"} ${x} ${y}`;
        })
        .join(" ");
};

export const renderSVG = (stats) => {
    const path = stats.contributions
        ? buildSmoothPath(stats.contributions.slice(-30))
        : "";

    return `
<svg width="460" height="300" viewBox="0 0 460 300" xmlns="http://www.w3.org/2000/svg">

  <defs>
    <!-- Gradient -->
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>

    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#22d3ee"/>
    </linearGradient>

    <!-- Glow -->
    <filter id="glow">
      <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="100%" height="100%" rx="18" fill="url(#bgGrad)" />

  <!-- Title -->
  <text x="20" y="30" fill="#ffffff" font-size="18" font-weight="600">
    ${stats.name?.toUpperCase()}'s GitHub Stats
  </text>

  <!-- Cards -->
  <g font-size="13">
    ${card(20, 50, "Commits", stats.commits)}
    ${card(240, 50, "Repos", stats.repos)}
    ${card(20, 120, "Followers", stats.followers)}
    ${card(240, 120, "Stars", stats.stars)}
  </g>

  <!-- Graph -->
  ${path
            ? `
    <g transform="translate(20,230)">
      <path d="${path}" fill="none" stroke="url(#lineGrad)" stroke-width="2" filter="url(#glow)" />
    </g>
  `
            : ""
        }

</svg>
`;
};

// 🔥 Card component
const card = (x, y, title, value) => `
  <g>
    <rect x="${x}" y="${y}" width="180" height="60" rx="12" fill="#0b1220" />
    <text x="${x + 12}" y="${y + 25}" fill="#94a3b8">${title}</text>
    <text x="${x + 12}" y="${y + 45}" fill="#ffffff" font-size="18">${value}</text>
  </g>
`;