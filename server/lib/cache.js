const NodeCache = require('node-cache')

const cache = new NodeCache({ stdTTL: 900 }) // 15min default

module.exports = {
  get: (key) => cache.get(key),
  set: (key, value, ttl) => ttl ? cache.set(key, value, ttl) : cache.set(key, value),
}
