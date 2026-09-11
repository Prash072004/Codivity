const Submission = require("../models/Submission.js");
const Problem = require("../models/Problem.js");
const Language = require("../models/Language.js");
const UserProblem = require("../models/UserProblem.js");

async function createSubmission(req, res) {
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

        // For now, we are not executing the code.
        // The judge system will be added later.
        // Temporary status
        const status = "Accepted";

        // Save submission
        const submission = await Submission.create({
            userId: req.user.userId,
            problemId,
            languageId,
            code,
            status
        });

        // Update user's problem progress
        if (status === "Accepted") {
            await UserProblem.findOneAndUpdate(
                {
                    userId: req.user.userId,
                    problemId
                },
                {
                    status: "Solved",
                    solvedAt: new Date()
                },
                {
                    upsert: true,
                    new: true
                }
            );
        }
        else {
            await UserProblem.findOneAndUpdate(
                {
                    userId: req.user.userId,
                    problemId
                },
                {
                    $setOnInsert: {
                        status: "Attempted"
                    }
                },
                {
                    upsert: true
                }
            );
        }

        return res.status(201).json({
            message: "Submission created successfully",
            submission
        });

    } catch (error) {
        console.error("Create submission error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


async function getMySubmissions(req, res) {
    try {
        const submissions = await Submission.find({
            userId: req.user.userId
        })
            .populate("problemId", "title slug difficulty")
            .populate("languageId", "name version")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            submissions
        });

    } catch (error) {
        console.error("Get submissions error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


module.exports = {
    createSubmission,
    getMySubmissions
};