const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./db");
const { connectRedis } = require("./redis");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const profileRoutes = require("./routes/profileRoutes");
const problemRoutes = require("./routes/problemRoutes");
const topicRoutes = require("./routes/topicRoutes");
const testCaseRoutes = require("./routes/testCaseRoutes");
const languageRoutes = require("./routes/languageRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const userProblemRoutes = require("./routes/userProblemRoutes");
const runRoutes = require("./routes/runRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Codivity API is running" });
});


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/topics", topicRoutes);
app.use("/api/v1/test-cases", testCaseRoutes);
app.use("/api/v1/languages", languageRoutes);
app.use("/api/v1/submissions", submissionRoutes);
app.use("/api/v1/user-problems", userProblemRoutes);
app.use("/api/v1/run", runRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    connectRedis()
        .catch((error) => {
            console.error("Redis connection failed:", error.message);
        });

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
