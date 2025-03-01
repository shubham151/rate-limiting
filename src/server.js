const express = require('express');
const rateLimiter = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 3000;

// Apply rate limiter based on query param (strategy)
app.use((req, res, next) => {
    const strategy = req.query.strategy || 'fixed_window';
    if (!['token_bucket', 'leaking_bucket', 'fixed_window', 'sliding_window_log', 'sliding_window_counter'].includes(strategy)) {
        return res.status(400).json({ message: 'Invalid strategy' });
    }
    rateLimiter(strategy)(req, res, next);
});

// Test route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

