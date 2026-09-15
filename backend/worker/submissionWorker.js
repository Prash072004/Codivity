require("dotenv").config();

const mongoose = require("mongoose");
const { Worker } = require("bullmq");
const { redisUrl } = require("../redis");
const Submission = require("../models/Submission.js");
const Problem = require("../models/Problem.js");
const TestCase = require("../models/TestCase.js");
const Language = require("../models/Language.js");

async function startWorker() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected for submission worker");

    const worker = new Worker(
        "submissionQueue",
        async (job) => {
            const submissionId = job.data?.submissionId;

            if (!submissionId) {
                throw new Error("Submission job is missing submissionId");
            }

            const submission = await Submission.findById(submissionId).lean();

            if (!submission) {
                throw new Error(`Submission not found: ${submissionId}`);
            }

            const problem = await Problem.findById(submission.problemId).lean();

            if (!problem) {
                throw new Error(`Problem not found: ${submission.problemId}`);
            }

            const testCases = await TestCase.find({
                problemId: submission.problemId
            }).lean();

            const language = await Language.findById(submission.languageId).lean();

            if (!language) {
                throw new Error(`Language not found: ${submission.languageId}`);
            }

            console.log(`Submission loaded: ${submission._id}`);
            console.log(`Problem loaded: ${problem.title}`);
            console.log(`Language loaded: ${language.name} ${language.version}`);
            console.log(`Test cases loaded: ${testCases.length}`);
            console.log(`Submission status: ${submission.status}`);

            return {
                submissionId,
                status: "DATA_LOADED"
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
