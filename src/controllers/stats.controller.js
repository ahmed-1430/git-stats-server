import { getStats } from "../services/stats.service.js";

export const statsController = async (req, res) => {
    try {
        const { user, type } = req.query;

        if (!user) {
            return res.status(400).json({ error: "Username required" });
        }

        const stats = await getStats(user);

        // Different endpoints
        if (req.path.includes("languages")) {
            return res.json(stats.languages);
        }

        if (req.path.includes("activity")) {
            return res.json({
                contributions: stats.contributions,
                commits: stats.commits,
            });
        }

        if (req.path.includes("consistency")) {
            return res.json(stats.streak);
        }

        return res.json(stats);
    } catch (err) {
        res.status(500).json({
            error: true,
            message: err.message,
        });
    }
};