const BAR_WIDTH = 392;
const MIN_BAR_WIDTH = 12;

module.exports = (languages, username) => {
    const bars = languages
        .map((lang, i) => {
            const y = 70 + i * 34;

            const realWidth = (BAR_WIDTH * Number(lang.percent)) / 100;
            const visualWidth = Math.max(realWidth, MIN_BAR_WIDTH);

            return `
        <text x="28" y="${y}" class="label">${lang.name}</text>
        <text x="420" y="${y}" class="value" text-anchor="end">${lang.percent}%</text>

        <rect
          x="28"
          y="${y + 8}"
          width="${BAR_WIDTH}"
          height="8"
          rx="4"
          fill="#1F2937"
        />
        <rect
          x="28"
          y="${y + 8}"
          width="${visualWidth}"
          height="8"
          rx="4"
          fill="#60A5FA"
        />
      `;
        })
        .join("");

    return `
<svg width="520" height="220" viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgLang" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0B0F14"/>
      <stop offset="100%" stop-color="#0E1623"/>
    </linearGradient>
  </defs>

  <style>
    .title { font: 600 17px Inter, Arial, sans-serif; fill: #E5E7EB; }
    .label { font: 12px Inter, Arial, sans-serif; fill: #9CA3AF; }
    .value { font: 12px Inter, Arial, sans-serif; fill: #E5E7EB; }
  </style>

  <!-- Card background -->
  <rect width="520" height="220" rx="18" fill="url(#bgLang)"/>
  <rect
    x="1"
    y="1"
    width="518"
    height="218"
    rx="17"
    fill="none"
    stroke="#1F2937"
  />

  <!-- Header -->
  <text x="28" y="36" class="title">
    ${username} — Language Mastery
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
