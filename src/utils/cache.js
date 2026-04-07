
const cache = new Map();

export const getCache = (key) => {
  const item = cache.get(key);
  if (!item) return null;

  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }

  return item.data;
};

export const setCache = (key, data, ttl = 300000) => {
  cache.set(key, {
    data,
    expiry: Date.now() + ttl,
  });
};