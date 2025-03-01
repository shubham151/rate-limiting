const client = require('../config/redis');

async function slidingWindowLog(userKey, limit = 5, windowSize = 60) {
    const key = `sliding_window_log:${userKey}`;
    const currentTime = Date.now();
    
    await client.zAdd(key, [{ score: currentTime, value: currentTime.toString() }]);
    await client.zRemRangeByScore(key, 0, currentTime - windowSize * 1000);

    const count = await client.zCard(key);
    return count <= limit;
}

module.exports = slidingWindowLog;

