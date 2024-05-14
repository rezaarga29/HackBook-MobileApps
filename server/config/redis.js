const Redis = require("ioredis");

const redis = new Redis({
  port: 18971, // Redis port
  host: process.env.HOST_REDIS,
  password: process.env.PW_REDIS,
});

module.exports = redis;
