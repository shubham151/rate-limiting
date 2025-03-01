const tokenBucket = require('../algorithms/tokenBucket');
const leakingBucket = require('../algorithms/leakingBucket');
const fixedWindowCounter = require('../algorithms/fixedWindowCounter');
const slidingWindowLog = require('../algorithms/slidingWindowLog');
const slidingWindowCounter = require('../algorithms/slidingWindowCounter');

const strategies = {
    'token_bucket': tokenBucket,
    'leaking_bucket': leakingBucket,
    'fixed_window': fixedWindowCounter,
    'sliding_window_log': slidingWindowLog,
    'sliding_window_counter': slidingWindowCounter
};

function rateLimiter(strategy) {
    return async (req, res, next) => {
        const userKey = req.ip; 
        if (await strategies[strategy](userKey)) {
            next();
        } else {
            res.status(429).json({ message: "Too many requests" });
        }
    };
}

module.exports = rateLimiter;

