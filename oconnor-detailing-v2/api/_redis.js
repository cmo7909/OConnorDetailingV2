const { Redis } = require('@upstash/redis');

const url   = process.env.KV_REST_API_URL;
const token = process.env.KV_REST_API_TOKEN;

if (!url || !token) {
  console.error('❌ Missing KV_REST_API_URL or KV_REST_API_TOKEN');
}

const redis = new Redis({ url, token });

module.exports = redis;

