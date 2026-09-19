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
        const filters = {
            userId: req.user.userId
        };
        const requestedPage = Number.parseInt(req.query.page, 10);
        const requestedLimit = Number.parseInt(req.query.limit, 10);
        const fromDate = req.query.from ? new Date(req.query.from) : null;
        const page = Number.isFinite(requestedPage)
            ? Math.max(requestedPage, 1)
            : null;
        const limit = Number.isFinite(requestedLimit)
            ? Math.min(Math.max(requestedLimit, 1), 100)
            : page
                ? 10
                : null;

        if (fromDate && !Number.isNaN(fromDate.getTime())) {
            filters.createdAt = { $gte: fromDate };
        }

        const query = Submission.find(filters)
            .select("status runtime createdAt problemId languageId")
            .populate("problemId", "title slug difficulty")
            .populate("languageId", "name version")
            .sort({ createdAt: -1 });

        if (limit) {
            if (page) {
                query.skip((page - 1) * limit);
            }

            query.limit(limit);
        }

        const [submissions, total] = await Promise.all([
            query,
            page ? Submission.countDocuments(filters) : Promise.resolve(null)
        ]);

        return res.status(200).json({
            submissions,
            ...(page && {
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            })
        });

    } catch (error) {
        console.error("Get submissions error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function getSubmissionById(req, res) {
    try {
        const { id } = req.params;

        const submission = await Submission.findById(id).select(
            "-code"
        );

        if (!submission) {
            return res.status(404).json({
                message: "Submission not found"
            });
        }

        if (submission.userId.toString() !== req.user.userId.toString()) {
            return res.status(403).json({
                message: "You are not authorized to view this submission"
            });
        }

        return res.status(200).json({
            message: "Submission fetched successfully",
            submission
        });

    } catch (error) {
        console.error("Get submission error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = {
    createSubmission,
    getMySubmissions,
    getSubmissionById
};