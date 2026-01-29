// Clean display name (Ahmed)
const getDisplayName = (username) => {
    const base = username.split(/[-_]/)[0];
    return base.charAt(0).toUpperCase() + base.slice(1);
};

module.exports = (trend, username) => {
    const displayName = getDisplayName(username);

    const width = 540;
    const height = 280;

    const paddingLeft = 64;
    const paddingRight = 24;
    const paddingTop = 78;
    const paddingBottom = 52;

    // Round max to even number (for clean scale)
    const maxVal = Math.max(2, Math.ceil(trend.max / 2) * 2);
    const yStep = 2;

    const stepX =
        (width - paddingLeft - paddingRight) /
        (trend.values.length - 1);

    const chartHeight = height - paddingTop - paddingBottom;

    const points = trend.values.map((v, i) => {
        const x = paddingLeft + i * stepX;
        const y =
            height -
            paddingBottom -
            (v / maxVal) * chartHeight;
        return { x, y, v };
    });

    const linePath =
        "M " + points.map(p => `${p.x} ${p.y}`).join(" L ");

    const areaPath = `
    ${linePath}
    L ${width - paddingRight} ${height - paddingBottom}
    L ${paddingLeft} ${height - paddingBottom}
    Z
  `;

    const peak = points.find(p => p.v === trend.max);
    const last = points[points.length - 1];

    return `
<svg width="${width}" height="${height}"
     viewBox="0 0 ${width} ${height}"
     xmlns="http://www.w3.org/2000/svg">

  <defs>
    <!-- Background -->
    <radialGradient id="bgGlow" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#0F1A2E"/>
      <stop offset="100%" stop-color="#0B0F14"/>
    </radialGradient>

    <!-- Area -->
    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#60A5FA" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#60A5FA" stop-opacity="0"/>
    </linearGradient>

    <!-- Glow -->
    <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2.6" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Card -->
  <rect width="${width}" height="${height}" rx="20" fill="url(#bgGlow)"/>
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}"
        rx="19" fill="none" stroke="#1F2937"/>

  <!-- Header -->
  <text x="28" y="34" font-size="17" font-weight="600" fill="#E5E7EB">
    ${displayName} — Contribution Trend
  </text>

  <text x="28" y="54" font-size="12" fill="#9CA3AF">
    Last 30 days • Avg ${trend.avg}/day • Peak ${trend.max}
  </text>

  <!-- Y Axis -->
  ${Array.from(
        { length: maxVal / yStep + 1 },
        (_, i) => i * yStep
    ).map(v => {
        const y =
            height -
            paddingBottom -
            (v / maxVal) * chartHeight;
        return `
        <text x="${paddingLeft - 10}" y="${y + 4}"
              font-size="11" fill="#64748B"
              text-anchor="end">${v}</text>
        <line x1="${paddingLeft}" y1="${y}"
              x2="${width - paddingRight}" y2="${y}"
              stroke="#1F2937" stroke-dasharray="3 5"/>
      `;
    }).join("")
        }

  <!-- X Axis labels -->
  <text x="${paddingLeft}" y="${height - 22}"
        font-size="11" fill="#64748B">1</text>

  <text x="${paddingLeft + (width - paddingLeft - paddingRight) / 2}"
        y="${height - 22}"
        font-size="11" fill="#64748B"
        text-anchor="middle">15</text>

  <text x="${width - paddingRight}"
        y="${height - 22}"
        font-size="11" fill="#64748B"
        text-anchor="end">30</text>

  <!-- Area -->
  <path d="${areaPath}" fill="url(#areaGrad)"/>

  <!-- Line -->
  <path
    d="${linePath}"
    fill="none"
    stroke="#7CB8FF"
    stroke-width="2.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    filter="url(#neonGlow)"
  />

  <!-- Peak -->
  <circle cx="${peak.x}" cy="${peak.y}" r="5" fill="#F97316"/>
  <text x="${peak.x}" y="${peak.y - 10}"
        font-size="11" fill="#F97316"
        text-anchor="middle">Peak</text>

  <!-- Latest -->
  <circle cx="${last.x}" cy="${last.y}" r="6" fill="#60A5FA"/>
  <circle cx="${last.x}" cy="${last.y}" r="11"
          fill="#60A5FA" opacity="0.15"/>

</svg>
`;
};
