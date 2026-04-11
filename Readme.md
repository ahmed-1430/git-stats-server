# DevInsight Backend

Production-ready GitHub analytics backend built with Express, GitHub GraphQL, and NodeCache.

## Endpoints

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
