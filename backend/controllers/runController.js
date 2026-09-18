const Problem = require("../models/Problem.js");
const TestCase = require("../models/TestCase.js");
const Language = require("../models/Language.js");
const { executeCode } = require("../services/executionService.js");

async function runCode(req, res) {
    try {
        const { problemId, languageId, code } = req.body;

        if (!problemId || !languageId || !code) {
            return res.status(400).json({
                message: "Please provide problem, language and code"
            });
        }

        const problem = await Problem.findById(problemId);

        if (!problem) {
            return res.status(404).json({
                message: "Problem not found"
            });
        }

        const language = await Language.findOne({
            _id: languageId,
            isActive: true
        });

        if (!language) {
            return res.status(404).json({
                message: "Language not found or inactive"
            });
        }

        const testCases = await TestCase.find({
            problemId,
            isSample: true
        })
            .sort({ createdAt: 1 })
            .lean();

        if (testCases.length === 0) {
            return res.status(404).json({
                message: "No sample test cases found"
            });
        }

        const results = [];

        for (const testCase of testCases) {
            const executionResult = await executeCode({
                language,
                sourceCode: code,
                input: testCase.input,
                limits: {
                    timeoutMs: 5000,
                    memoryMb: 128,
                    cpus: 1
                }
            });

            results.push({
                testCaseId: testCase._id.toString(),
                executionResult
            });

            if (
                executionResult.status === "COMPILATION_ERROR" ||
                executionResult.status === "RUNTIME_ERROR" ||
                executionResult.status === "TIME_LIMIT_EXCEEDED" ||
                executionResult.status === "MEMORY_LIMIT_EXCEEDED" ||
                executionResult.status === "EXECUTION_ERROR"
            ) {
                break;
            }
        }

        return res.status(200).json({
            status: "Run Completed",
            message: "Code executed successfully",
            results
        });

    } catch (error) {
        console.error("Run code error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = {
    runCode
};