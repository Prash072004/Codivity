const mongoose = require("mongoose");

const userProblemSchema = new mongoose.Schema(
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

        status: {
            type: String,
            enum: ["Attempted", "Solved"],
            default: "Attempted"
        },

        solvedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

userProblemSchema.index(
    { userId: 1, problemId: 1 },
    { unique: true }
);

module.exports = mongoose.model("UserProblem", userProblemSchema);