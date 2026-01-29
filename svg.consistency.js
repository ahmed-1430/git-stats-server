const getDisplayName = (username) => {
    const base = username.split(/[-_]/)[0];
    return base.charAt(0).toUpperCase() + base.slice(1);
};

module.exports = (data, username) => {
    const isHot = data.currentStreak >= 7;
    const displayName = getDisplayName(username);

    return `
<svg width="520" height="260" viewBox="0 0 520 260" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background -->
    <linearGradient id="bgCons" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0B0F14"/>
      <stop offset="100%" stop-color="#0E1623"/>
    </linearGradient>

    <!-- Flame gradient -->
    <radialGradient id="flameGrad" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#FDBA74"/>
      <stop offset="70%" stop-color="#F97316"/>
      <stop offset="100%" stop-color="#EA580C"/>
    </radialGradient>

    <!-- Flame glow -->
    <filter id="flameGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <style>
    .title { font: 600 17px Inter, Arial, sans-serif; fill: #E5E7EB; }
    .subtitle { font: 12px Inter, Arial, sans-serif; fill: #9CA3AF; }
    .label { font: 12px Inter, Arial, sans-serif; fill: #9CA3AF; }
    .value { font: 700 22px Inter, Arial, sans-serif; fill: #F9FAFB; }
    .value-hot { font: 700 22px Inter, Arial, sans-serif; fill: #F97316; }
    .unit { font: 12px Inter, Arial, sans-serif; fill: #9CA3AF; }
  </style>

  <!-- Card -->
  <rect width="520" height="260" rx="18" fill="url(#bgCons)"/>
  <rect x="1" y="1" width="518" height="258" rx="17" fill="none" stroke="#1F2937"/>

  <!-- Header -->
  <text x="28" y="34" class="title">${displayName} — Consistency</text>
  <text x="28" y="52" class="subtitle">Daily activity over the last 12 months</text>
  <line x1="28" y1="62" x2="492" y2="62" stroke="#1F2937"/>

  <!-- CURRENT STREAK -->
  <g transform="translate(28, 82)">
    <rect
      width="220"
      height="72"
      rx="12"
      fill="#0B1220"
      stroke="${isHot ? "#F97316" : "#1F2937"}"
    />

    ${isHot
            ? `
      <!-- Flame icon -->
      <path
        d="M28 30
           C28 18, 44 20, 42 34
           C40 48, 28 52, 28 62
           C28 52, 16 48, 14 34
           C12 22, 20 18, 22 26
           C22 16, 32 14, 32 24"
        fill="url(#flameGrad)"
        filter="url(#flameGlow)"
        transform="scale(0.6) translate(10 10)"
      />
      `
            : ""
        }

    <text x="48" y="26" class="label">Current Streak</text>
    <text x="48" y="52" class="${isHot ? "value-hot" : "value"}">
      ${data.currentStreak}
    </text>
    <text x="92" y="52" class="unit">days</text>
  </g>

  <!-- LONGEST STREAK -->
  <g transform="translate(272, 82)">
    <rect width="220" height="72" rx="12" fill="#0B1220" stroke="#1F2937"/>
    <text x="16" y="26" class="label">Longest Streak</text>
    <text x="16" y="52" class="value">${data.longestStreak}</text>
    <text x="60" y="52" class="unit">days</text>
  </g>

  <!-- CONTRIBUTIONS -->
  <g transform="translate(28, 166)">
    <rect width="220" height="72" rx="12" fill="#0B1220" stroke="#1F2937"/>
    <text x="16" y="26" class="label">Contributions</text>
    <text x="16" y="52" class="value">${data.contributions}</text>
    <text x="16" y="68" class="unit">last 12 months</text>
  </g>

  <!-- ACTIVE WEEKS -->
  <g transform="translate(272, 166)">
    <rect width="220" height="72" rx="12" fill="#0B1220" stroke="#1F2937"/>
    <text x="16" y="26" class="label">Active Weeks</text>
    <text x="16" y="52" class="value">${data.activeWeeks}</text>
    <text x="16" y="68" class="unit">out of 52</text>
  </g>
</svg>
`;
};
