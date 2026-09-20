const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const { Worker } = require("bullmq");
const Redis = require("ioredis");
const { redisUrl } = require("../redis");
const Submission = require("../models/Submission.js");
const Problem = require("../models/Problem.js");
const TestCase = require("../models/TestCase.js");
const Language = require("../models/Language.js");
const UserProblem = require("../models/UserProblem.js");
const { executeCode } = require("../services/executionService.js");
const { judgeExecution } = require("../services/judgeService.js");
const { mapExecutionStatus } = require("../services/executionStatusMapper.js");

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
            const executionResults = [];
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

        executionResults.push(executionResult);

        const executionStatus = mapExecutionStatus(executionResult);

        if (executionStatus) {
            testCaseResults.push({
                testCaseId: testCase._id.toString(),
                status: executionStatus
            });

            verdict = executionStatus;
            break;
        }

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

            // Calculate runtime and memory
            const runtimeValues = executionResults
                .map((result) => result.runtime)
                .filter((runtime) => Number.isFinite(runtime));

            const memoryValues = executionResults
                .map((result) => result.memory)
                .filter((memory) => Number.isFinite(memory));

            const runtime = runtimeValues.length > 0 ? Math.max(...runtimeValues) : null;

            const memory = memoryValues.length > 0 ? Math.max(...memoryValues) : null;

            await Submission.findByIdAndUpdate(submissionId,
                {
                    status: verdict,
                    runtime,
                    memory,
                    passedTestCases,
                    totalTestCases: testCases.length
                },
                { runValidators: true }
            );

            const userProblem = await UserProblem.findOne({
                userId: submission.userId,
                problemId: submission.problemId
            });

            if (userProblem) {
                if (verdict === "Accepted") {
                    userProblem.status = "Solved";

                    if (!userProblem.solvedAt) {
                        userProblem.solvedAt = new Date();
                    }
                } else {
                    userProblem.status = "Attempted";
                }

                await userProblem.save();
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
            connection: new Redis.Cluster(
                [
                    {
                        host: new URL(redisUrl).hostname,
                        port: 6379
                    }
                ],
                {
                    dnsLookup: (address, callback) => callback(null, address),
                    redisOptions: {
                        tls: {}
                    }
                }
            )
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
