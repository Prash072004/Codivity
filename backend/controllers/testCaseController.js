const TestCase = require("../models/TestCase.js");
const Problem = require("../models/Problem.js");

async function createTestCase(req, res) {
    try {
        const {
            problemId,
            input,
            expectedOutput,
            isSample
        } = req.body;

        if (!problemId || input === undefined || expectedOutput === undefined) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }

        const problem = await Problem.findById(problemId);

        if (!problem) {
            return res.status(404).json({
                message: "Problem not found"
            });
        }

        const testCase = await TestCase.create({
            problemId,
            input,
            expectedOutput,
            isSample
        });

        return res.status(201).json({
            message: "Test case created successfully",
            testCase
        });

    } catch (error) {
        console.error("Create test case error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function getTestCases(req, res) {
    try {
        const { problemId } = req.params;

        const testCases = await TestCase.find({
            problemId
        });

        return res.status(200).json({
            testCases
        });

    } catch (error) {
        console.error("Get test cases error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = {
    createTestCase,
    getTestCases
};