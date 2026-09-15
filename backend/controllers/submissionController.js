const Submission = require("../models/Submission.js");
const Problem = require("../models/Problem.js");
const Language = require("../models/Language.js");
const submissionQueue = require("../submissionQueue.js");

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

        // Save submission
        const submission = await Submission.create({
            userId: req.user.userId,
            problemId,
            languageId,
            code,
            status: "PENDING"
        });

        try {
            await submissionQueue.add("submission", {
                submissionId: submission._id.toString()
            });
        } catch (queueError) {
            console.error("Submission queue error:", queueError);

            return res.status(503).json({
                message: "Submission created but could not be queued",
                submissionId: submission._id
            });
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