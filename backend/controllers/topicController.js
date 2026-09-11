const Topic = require("../models/Topic.js");

async function createTopic(req, res) {
    try {
        const { name, slug } = req.body;

        if (!name || !slug) {
            return res.status(400).json({
                message: "Name and slug are required"
            });
        }

        const existingTopic = await Topic.findOne({
            $or: [{ name }, { slug }]
        });

        if (existingTopic) {
            return res.status(409).json({
                message: "Topic already exists"
            });
        }

        const topic = await Topic.create({
            name,
            slug
        });

        return res.status(201).json({
            message: "Topic created successfully",
            topic
        });

    } catch (error) {
        console.error("Create topic error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


async function getTopics(req, res) {
    try {
        const topics = await Topic.find()
            .select("name slug")
            .sort({ name: 1 });

        return res.status(200).json({
            topics
        });

    } catch (error) {
        console.error("Get topics error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


module.exports = {
    createTopic,
    getTopics
};