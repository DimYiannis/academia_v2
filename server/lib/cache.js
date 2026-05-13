const NodeCache = require('node-cache')

const cache = new NodeCache({ stdTTL: 300 })

module.exports = {
  get: (key) => cache.get(key),
  set: (key, value) => cache.set(key, value),
}
