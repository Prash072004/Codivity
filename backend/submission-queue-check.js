require("dotenv").config();

const { connectRedis, redisClient } = require("./redis");

async function verifySubmissionQueue() {
    let job;
    let submissionQueue;

    try {
        await connectRedis();
        submissionQueue = require("./submissionQueue");

        job = await submissionQueue.add("verification", {
            type: "TEST"
        });

        console.log("BullMQ test job created successfully");
        console.log(`Job ID: ${job.id}`);
    } catch (error) {
        console.error("BullMQ queue verification failed:", error.message);
        process.exitCode = 1;
    } finally {
        if (job) {
            await job.remove();
        }

        if (submissionQueue) {
            await submissionQueue.close();
        }

        if (redisClient.isOpen) {
            await redisClient.quit();
        }
    }
}

verifySubmissionQueue();
