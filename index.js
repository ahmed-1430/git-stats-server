require("dotenv").config();
const express = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");

const query = require("./github.query");
const {
  calculateStats,
  calculateLanguages,
  calculateConsistency,
  calculateContributionTrend
} = require("./stats.service");

const svgTemplate = require("./svg.template");
const languageSvg = require("./svg.languages");
const consistencySvg = require("./svg.consistency");
const contributionSvg = require("./svg.contributions");

const cache = new NodeCache({ stdTTL: 1800 });
const app = express();

/* ------------------ ACTIVITY STATS CARD ------------------ */
app.get("/api/stats/:username.svg", async (req, res) => {
  const { username } = req.params;
  const cacheKey = `stats-${username}`;

  if (cache.has(cacheKey)) {
    res.setHeader("Content-Type", "image/svg+xml");
    return res.send(cache.get(cacheKey));
  }

  const response = await axios.post(
    "https://api.github.com/graphql",
    { query, variables: { username } },
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    }
  );

  const stats = calculateStats(response.data.data);
  const svg = svgTemplate(stats, username);

  cache.set(cacheKey, svg);
  res.setHeader("Content-Type", "image/svg+xml");
  res.send(svg);
});

/* ------------------ LANGUAGE MASTERY CARD ------------------ */
app.get("/api/languages/:username.svg", async (req, res) => {
  const { username } = req.params;
  const cacheKey = `lang-${username}`;

  if (cache.has(cacheKey)) {
    res.setHeader("Content-Type", "image/svg+xml");
    return res.send(cache.get(cacheKey));
  }

  const response = await axios.post(
    "https://api.github.com/graphql",
    { query, variables: { username } },
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    }
  );

  const user = response.data.data.user;
  const languages = calculateLanguages(user.repositories.nodes);

  const svg = languageSvg(languages, username);

  cache.set(cacheKey, svg);
  res.setHeader("Content-Type", "image/svg+xml");
  res.send(svg);
});

/* ------------------ CONSISTENCY CARD ------------------ */
app.get("/api/consistency/:username.svg", async (req, res) => {
  const { username } = req.params;
  const cacheKey = `consistency-${username}`;

  if (cache.has(cacheKey)) {
    res.setHeader("Content-Type", "image/svg+xml");
    return res.send(cache.get(cacheKey));
  }

  const response = await axios.post(
    "https://api.github.com/graphql",
    { query, variables: { username } },
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    }
  );

  const calendar =
    response.data.data.user.contributionsCollection.contributionCalendar;

  const consistency = calculateConsistency(calendar);
  const svg = consistencySvg(consistency, username);

  cache.set(cacheKey, svg);
  res.setHeader("Content-Type", "image/svg+xml");
  res.send(svg);
});

/* ------------------ CONTRIBUTION GRAPH ------------------ */
app.get("/api/contributions/:username.svg", async (req, res) => {
  const { username } = req.params;
  const cacheKey = `contrib-${username}`;

  if (cache.has(cacheKey)) {
    res.setHeader("Content-Type", "image/svg+xml");
    return res.send(cache.get(cacheKey));
  }

  const response = await axios.post(
    "https://api.github.com/graphql",
    { query, variables: { username } },
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    }
  );

  const calendar =
    response.data.data.user.contributionsCollection.contributionCalendar;

  const trend = calculateContributionTrend(calendar);
  const svg = contributionSvg(trend, username);

  cache.set(cacheKey, svg);
  res.setHeader("Content-Type", "image/svg+xml");
  res.send(svg);
});

/* ------------------ LOCAL DEV ONLY ------------------ */
if (require.main === module) {
  app.listen(5000, () =>
    console.log("Local server running on http://localhost:5000")
  );
}

/* ------------------ REQUIRED FOR VERCEL ------------------ */
module.exports = app;
