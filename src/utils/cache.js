import NodeCache from "node-cache";

import { config } from "../config/env.js";

const cache = new NodeCache({
  stdTTL: config.cacheTtlSeconds,
  checkperiod: Math.max(60, Math.floor(config.cacheTtlSeconds / 2)),
  useClones: false,
});

export const getCache = (key) => cache.get(key) ?? null;

export const setCache = (key, value, ttl = config.cacheTtlSeconds) => {
  cache.set(key, value, ttl);
};

export const deleteCache = (key) => {
  cache.del(key);
};
