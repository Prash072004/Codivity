require("dotenv").config();

const { connectRedis, redisClient } = require("./redis");

connectRedis()
    .then(async () => {
        console.log("Redis connection successful");
        await redisClient.quit();
    })
    .catch((error) => {
        console.error("Redis connection failed:", error.message);
        process.exitCode = 1;
    });
