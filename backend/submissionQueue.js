const { Queue } = require("bullmq");
const { redisClient } = require("./redis");

const submissionQueue = new Queue("submissionQueue", {
    connection: redisClient,
    prefix: "{codivity}"
});

module.exports = submissionQueue;
