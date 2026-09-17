require("dotenv").config();

const mongoose = require("mongoose");
const { Worker } = require("bullmq");
const { redisUrl } = require("../redis");
const Submission = require("../models/Submission.js");
const Problem = require("../models/Problem.js");
const TestCase = require("../models/TestCase.js");
const Language = require("../models/Language.js");
const { executeCode } = require("../services/executionService.js");
const { judgeExecution } = require("../services/judgeService.js");

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

            if (testCases.length === 0) {
                throw new Error(`No test cases found for problem: ${submission.problemId}`);
            }

            const testCaseResults = [];
            let passedTestCases = 0;
            let verdict = "Accepted";

            for (const testCase of testCases) {
                const executionResult = await executeCode({
                    language,
                    sourceCode: submission.code,
                    input: testCase.input,
                    limits: {
                        timeoutMs: 5000,
                        memoryMb: 128,
                        cpus: 1
                    }
                });

                const testCaseVerdict = judgeExecution({
                    executionResult,
                    expectedOutput: testCase.expectedOutput
                });

                testCaseResults.push({
                    testCaseId: testCase._id.toString(),
                    status: testCaseVerdict.status
                });

                if (testCaseVerdict.status !== "Accepted") {
                    verdict = testCaseVerdict.status;
                    break;
                }

                passedTestCases += 1;
            }

            const result = {
                submissionId: submission._id.toString(),
                verdict,
                passedTestCases,
                totalTestCases: testCases.length,
                testCaseResults
            };

            console.log("Submission judging summary:", result);

            return result;
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
