const { createClient } = require("redis");

const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379"
});

let connectPromise = null;

redisClient.on("error", (error) => {
    console.error("Redis client error:", error.message);
});

async function connectRedis() {
    if (redisClient.isReady) {
        return redisClient;
    }

    if (!connectPromise) {
        connectPromise = redisClient.connect()
            .then(() => {
                console.log("Redis connected");
                return redisClient;
            })
            .catch((error) => {
                connectPromise = null;
                throw error;
            });
    }

    return connectPromise;
}

module.exports = {
    redisClient,
    connectRedis
};
