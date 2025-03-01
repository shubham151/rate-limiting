const client = require('../config/redis');

async function leakingBucket(userKey, capacity = 10, leakRate = 1) {
    const key = `leaking_bucket:${userKey}`;
    const currentTime = Date.now();
    const bucket = await client.hGetAll(key);

    let water = bucket.water ? parseFloat(bucket.water) : 0;
    let lastChecked = bucket.lastChecked ? parseInt(bucket.lastChecked) : currentTime;

    const elapsedTime = (currentTime - lastChecked) / 1000;
    water = Math.max(0, water - elapsedTime * leakRate);

    if (water < capacity) {
        water++;
        await client.hSet(key, { water, lastChecked: currentTime });
        return true;
    } else {
        return false;
    }
}

module.exports = leakingBucket;

