require("dotenv").config();

const { Worker } = require("bullmq");
const { redisUrl } = require("../redis");

async function startWorker() {
    const worker = new Worker(
        "submissionQueue",
        async (job) => {
            const { submissionId } = job.data;

            console.log("Job received");
            console.log(`Submission ID: ${submissionId}`);

            return {
                submissionId,
                status: "RECEIVED"
            };
        },
        {
            connection: {
                url: redisUrl
            }
        }
    );

    worker.on("error", (error) => {
        console.error("Submission worker error:", error.message);
    });

    worker.on("failed", (job, error) => {
        console.error(
            `Submission job failed${job ? ` (${job.id})` : ""}:`,
            error.message
        );
    });

    worker.on("ready", () => {
        console.log("Submission worker connected to Redis");
    });

    console.log("Submission worker is listening on submissionQueue");
}

startWorker().catch((error) => {
    console.error("Failed to start submission worker:", error.message);
    process.exitCode = 1;
});
