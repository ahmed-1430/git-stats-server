import { getStats } from "../services/stats.service.js";
import { renderSVG } from "../renderers/svg/stats.renderer.js";

export const statsController = async (req, res) => {
    try {
        const username = req.query.user;
        const type = req.query.type || "svg";

        if (!username) {
            return res.status(400).send("Username is required");
        }

        const stats = await getStats(username);

        if (type === "json") {
            return res.json(stats);
        }

        const svg = renderSVG(stats);

        res.setHeader("Content-Type", "image/svg+xml");
        res.send(svg);
    } catch (err) {
        res.status(500).send(err.message);
    }
};