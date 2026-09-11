const Problem = require("../models/Problem.js");
const Topic = require("../models/Topic.js");

async function createProblem(req, res) {
    try {
        const {
            title,
            slug,
            difficulty,
            description,
            inputFormat,
            outputFormat,
            examples,
            constraints,
            primaryTopic,
            topics
        } = req.body;

        if (!title || !slug || !difficulty || !description || !inputFormat || !outputFormat || !constraints || !primaryTopic) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }

        const existingProblem = await Problem.findOne({ slug });

        if (existingProblem) {
            return res.status(409).json({
                message: "A problem with this slug already exists"
            });
        }

        const problem = await Problem.create({
            title,
            slug,
            difficulty,
            description,
            inputFormat,
            outputFormat,
            examples,
            constraints,
            primaryTopic,
            topics
        });

        return res.status(201).json({
            message: "Problem created successfully",
            problem
        });

    } catch (error) {
        console.error("Create problem error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function getProblems(req, res) {
    try {
        const problems = await Problem.find().select("title slug difficulty primaryTopic topics").populate("primaryTopic", "name slug").populate("topics", "name slug")

        return res.status(200).json({
            problems
        });

    } catch (error) {
        console.error("Get problems error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function getProblemBySlug(req, res) {
    try {
        const { slug } = req.params;

        const problem = await Problem.findOne({ slug })
            .populate("primaryTopic", "name slug")
            .populate("topics", "name slug");

        if (!problem) {
            return res.status(404).json({
                message: "Problem not found"
            });
        }

        return res.status(200).json({
            problem
        });

    } catch (error) {
        console.error("Get problem error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = {
    createProblem,
    getProblems,
    getProblemBySlug
};