const Language = require("../models/Language.js");

async function createLanguage(req, res) {
    try {
        const { name, version } = req.body;

        if (!name || !version) {
            return res.status(400).json({
                message: "Name and version are required"
            });
        }

        const existingLanguage = await Language.findOne({ name });

        if (existingLanguage) {
            return res.status(409).json({
                message: "Language already exists"
            });
        }

        const language = await Language.create({
            name,
            version
        });

        return res.status(201).json({
            message: "Language created successfully",
            language
        });

    } catch (error) {
        console.error("Create language error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function getLanguages(req, res) {
    try {
        const languages = await Language.find({
            isActive: true
        })
        .select("name version")
        .sort({ name: 1 });

        return res.status(200).json({
            languages
        });

    } catch (error) {
        console.error("Get languages error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = {
    createLanguage,
    getLanguages
};