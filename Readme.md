# ⚙️ DevInsight Backend

A custom GitHub analytics engine built with Node.js and GitHub GraphQL API.

This backend processes raw GitHub data into meaningful insights such as streaks, activity levels, language usage, and contribution trends.

---

## 🚀 Live API

👉 https://your-api.vercel.app/api/stats?user=ahmed-1430

---

## ✨ Features

- 📊 GitHub GraphQL integration
- 🔥 Streak calculation (current & longest)
- 📈 Contribution analysis (daily + yearly)
- 🌍 Language breakdown (percentage-based)
- ⭐ Total stars aggregation
- 🤝 External repository contributions tracking
- 🧠 Activity status detection (Elite, Active, etc.)
- 🏷 Grade system (A / B / C)
- ⚡ Caching system (NodeCache)

---

## 🧠 Tech Stack

- **Node.js**
- **Express.js**
- **GitHub GraphQL API**
- **Axios**
- **NodeCache**

---

## 📡 API Endpoints


- `/api/stats?user=ahmed-1430`
- `/api/activity?user=ahmed-1430`
- `/api/languages?user=ahmed-1430`
- `/api/consistency?user=ahmed-1430`
- `/api/health`

## Environment

Create a `.env` file with:

```env
GITHUB_TOKEN=your_github_token
PORT=3000
CACHE_TTL_SECONDS=600
```

## Run locally

```bash
npm install
npm run dev
```
