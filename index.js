require("dotenv").config();
const express = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");

const query = require("./github.query");
const calculateStats = require("./stats.service");
const svgTemplate = require("./svg.template");

const cache = new NodeCache({ stdTTL: 1800 });
const app = express();

app.get("/api/stats/:username.svg", async (req, res) => {
    const { username } = req.params;

    if (cache.has(username)) {
        res.setHeader("Content-Type", "image/svg+xml");
        return res.send(cache.get(username));
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

    cache.set(username, svg);

    res.setHeader("Content-Type", "image/svg+xml");
    res.send(svg);
});

app.listen(5000, () => console.log("Stats server running"));
