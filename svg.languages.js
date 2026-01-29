const BAR_WIDTH = 392;
const MIN_BAR_WIDTH = 14;

// Clean display name (Ahmed)
const getDisplayName = (username) => {
  const base = username.split(/[-_]/)[0];
  return base.charAt(0).toUpperCase() + base.slice(1);
};

module.exports = (languages, username) => {
  const displayName = getDisplayName(username);

  const bars = languages
    .map((lang, i) => {
      const y = 72 + i * 36;

      const realWidth = (BAR_WIDTH * Number(lang.percent)) / 100;
      const visualWidth = Math.max(realWidth, MIN_BAR_WIDTH);

      return `
        <!-- Language label -->
        <text x="44" y="${y}" class="label">${lang.name}</text>

        <!-- Percentage -->
        <text
          x="${28 + BAR_WIDTH}"
          y="${y}"
          class="value"
          text-anchor="end"
        >
          ${lang.percent}%
        </text>

        <!-- Accent dot -->
        <circle cx="30" cy="${y - 4}" r="4" fill="#60A5FA"/>

        <!-- Track -->
        <rect
          x="28"
          y="${y + 8}"
          width="${BAR_WIDTH}"
          height="10"
          rx="5"
          fill="#1F2937"
        />

        <!-- Filled bar -->
        <rect
          x="28"
          y="${y + 8}"
          width="${visualWidth}"
          height="10"
          rx="5"
          fill="#60A5FA"
          opacity="0.95"
        />
      `;
    })
    .join("");

  return `
<svg width="520" height="240" viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgLang" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0B0F14"/>
      <stop offset="100%" stop-color="#0E1623"/>
    </linearGradient>
  </defs>

  <style>
    .title { font: 600 17px Inter, Arial, sans-serif; fill: #E5E7EB; }
    .label { font: 12px Inter, Arial, sans-serif; fill: #CBD5E1; }
    .value { font: 12px Inter, Arial, sans-serif; fill: #E5E7EB; }
  </style>

  <!-- Card -->
  <rect width="520" height="240" rx="18" fill="url(#bgLang)"/>
  <rect
    x="1"
    y="1"
    width="518"
    height="238"
    rx="17"
    fill="none"
    stroke="#1F2937"
  />

  <!-- Header -->
  <text x="28" y="36" class="title">
    ${displayName} — Language Mastery
  </text>
  <line
    x1="28"
    y1="46"
    x2="492"
    y2="46"
    stroke="#1F2937"
  />

  <!-- Bars -->
  ${bars}
</svg>
`;
};
