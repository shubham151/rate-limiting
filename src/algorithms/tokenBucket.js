const client = require('../config/redis');

async function tokenBucket(userKey, maxTokens = 10, refillRate = 1) {
    const key = `token_bucket:${userKey}`;
    const currentTime = Date.now();
    const bucket = await client.hGetAll(key);

    let tokens = bucket.tokens ? parseFloat(bucket.tokens) : maxTokens;
    let lastRefill = bucket.lastRefill ? parseInt(bucket.lastRefill) : currentTime;

    const elapsedTime = (currentTime - lastRefill) / 1000;
    tokens = Math.min(maxTokens, tokens + elapsedTime * refillRate);

    if (tokens > 0) {
        tokens--;
        await client.hSet(key, { tokens, lastRefill: currentTime });
        return true;
    } else {
        return false;
    }
}

module.exports = tokenBucket;

