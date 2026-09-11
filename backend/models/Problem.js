const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unqiue: true,
        lowercase: true,
        trim: true
    },
    difficulty: {
        type: String,
        required: true,
        enum: ["Easy", "Medium", "Hard"]
    },
    description: {
        type: String,
        required: true
    },
    inputFormat: {
        type: String,
        required: true,
        trim: true
    },
    outputFormat: {
        type: String,
        required: true,
        trim: true
    },
    constraints: {
        type: String,
        required: true,
        trim: true
    },
    topics: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Topic"
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model("Problem", problemSchema);