const { createClient } = require('redis');
require('dotenv').config();

const client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6380'
});

client.on('error', (err) => console.log('Redis Client Error', err));

client.connect();

module.exports = client;

