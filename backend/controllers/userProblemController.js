const UserProblem = require("../models/UserProblem.js");
const Problem = require("../models/Problem.js");

async function getMyProblemStatus(req, res) {
    try {
        const { problemId } = req.params;

        const problem = await Problem.findById(problemId);

        if (!problem) {
            return res.status(404).json({
                message: "Problem not found"
            });
        }

        const userProblem = await UserProblem.findOne({
            userId: req.user.userId,
            problemId
        });

        return res.status(200).json({
            status: userProblem?.status || "Unattempted",
            solvedAt: userProblem?.solvedAt || null
        });

    } catch (error) {
        console.error("Get problem status error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


async function getMyProgress(req, res) {
    try {
        const progress = await UserProblem.find({
            userId: req.user.userId
        })
            .populate("problemId", "title slug difficulty")
            .sort({ updatedAt: -1 });

        return res.status(200).json({
            progress
        });

    } catch (error) {
        console.error("Get progress error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


module.exports = {
    getMyProblemStatus,
    getMyProgress
};