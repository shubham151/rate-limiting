const client = require('../config/redis');

async function slidingWindowCounter(userKey, limit = 5, windowSize = 60) {
    const key = `sliding_window_counter:${userKey}`;
    const currentTime = Date.now();
    const bucket1 = `bucket:${Math.floor(currentTime / (windowSize * 1000))}`;
    const bucket2 = `bucket:${Math.floor(currentTime / (windowSize * 1000)) - 1}`;

    const count1 = parseInt(await client.get(bucket1)) || 0;
    const count2 = parseInt(await client.get(bucket2)) || 0;

    const elapsedTime = (currentTime % (windowSize * 1000)) / 1000;
    const weightedCount = count1 + count2 * (1 - elapsedTime / windowSize);

    if (weightedCount < limit) {
        await client.incr(bucket1);
        await client.expire(bucket1, windowSize);
        return true;
    } else {
        return false;
    }
}

module.exports = slidingWindowCounter;

