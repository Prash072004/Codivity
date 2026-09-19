const User = require("../models/User.js");
const mongoose = require("mongoose");
const Problem = require("../models/Problem.js");
const Submission = require("../models/Submission.js");
const Topic = require("../models/Topic.js");

async function getProfile (req, res) {
    try {
        // fetch the logged-in user's data while excluding the password
        const user = await User.findById(req.user.userId).select("-password");

        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt
            }
        });
    } catch (err) {
        console.error("Profile error:", err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function getDifficultyStats(req, res) {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.userId);
        const [totals, solved] = await Promise.all([
            Problem.aggregate([
                {
                    $group: {
                        _id: "$difficulty",
                        total: { $sum: 1 }
                    }
                }
            ]),
            Submission.aggregate([
                {
                    $match: {
                        userId,
                        status: "Accepted"
                    }
                },
                {
                    $group: {
                        _id: "$problemId"
                    }
                },
                {
                    $lookup: {
                        from: Problem.collection.name,
                        localField: "_id",
                        foreignField: "_id",
                        as: "problem"
                    }
                },
                { $unwind: "$problem" },
                {
                    $group: {
                        _id: "$problem.difficulty",
                        solved: { $sum: 1 }
                    }
                }
            ])
        ]);

        const difficulty = {
            Easy: { solved: 0, total: 0 },
            Medium: { solved: 0, total: 0 },
            Hard: { solved: 0, total: 0 }
        };

        totals.forEach((item) => {
            if (difficulty[item._id]) {
                difficulty[item._id].total = item.total;
            }
        });

        solved.forEach((item) => {
            if (difficulty[item._id]) {
                difficulty[item._id].solved = item.solved;
            }
        });

        return res.status(200).json({ difficulty });
    } catch (error) {
        console.error("Get difficulty stats error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function getDsaProgress(req, res) {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.userId);
        const [topics, totals, solved] = await Promise.all([
            Topic.find({}).select("name slug").sort({ createdAt: 1 }).lean(),
            Problem.aggregate([
                {
                    $match: {
                        primaryTopic: { $exists: true, $ne: null }
                    }
                },
                {
                    $group: {
                        _id: "$primaryTopic",
                        total: { $sum: 1 }
                    }
                }
            ]),
            Submission.aggregate([
                {
                    $match: {
                        userId,
                        status: "Accepted"
                    }
                },
                {
                    $group: {
                        _id: "$problemId"
                    }
                },
                {
                    $lookup: {
                        from: Problem.collection.name,
                        localField: "_id",
                        foreignField: "_id",
                        as: "problem"
                    }
                },
                { $unwind: "$problem" },
                {
                    $match: {
                        "problem.primaryTopic": { $exists: true, $ne: null }
                    }
                },
                {
                    $group: {
                        _id: "$problem.primaryTopic",
                        solved: { $sum: 1 }
                    }
                }
            ])
        ]);

        const totalByTopic = new Map(
            totals.map((item) => [item._id.toString(), item.total])
        );
        const solvedByTopic = new Map(
            solved.map((item) => [item._id.toString(), item.solved])
        );

        const progress = topics.map((topic) => ({
            name: topic.name,
            slug: topic.slug,
            solved: solvedByTopic.get(topic._id.toString()) || 0,
            total: totalByTopic.get(topic._id.toString()) || 0
        }));

        return res.status(200).json({ progress });
    } catch (error) {
        console.error("Get DSA progress error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = {
    getProfile,
    getDifficultyStats,
    getDsaProgress
};