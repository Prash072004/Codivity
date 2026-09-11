const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        problemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Problem",
            required: true
        },

        languageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Language",
            required: true
        },

        code: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: [
                "Accepted",
                "Wrong Answer",
                "Time Limit Exceeded",
                "Memory Limit Exceeded",
                "Compilation Error",
                "Runtime Error"
            ],
            required: true
        },

        runtime: {
            type: Number,
            default: null
        },

        memory: {
            type: Number,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Submission", submissionSchema);