const Problem = require("../models/Problem.js");

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
            topics
        } = req.body;

        if (!title || !slug || !difficulty || !description || !inputFormat || !outputFormat || !constraints) {
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

module.exports = {
    createProblem
};