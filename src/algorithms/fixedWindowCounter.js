const client = require('../config/redis');

async function fixedWindowCounter(userKey, limit = 5, windowSize = 60) {
    const key = `fixed_window:${userKey}:${Math.floor(Date.now() / (windowSize * 1000))}`;
    const currentCount = await client.incr(key);
    
    if (currentCount === 1) {
        await client.expire(key, windowSize);
    }

    return currentCount <= limit;
}

module.exports = fixedWindowCounter;

