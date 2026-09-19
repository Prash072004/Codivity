const express = require("express");

const {
	getProfile,
	getDifficultyStats,
	getDsaProgress
} = require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getProfile);
router.get("/difficulty", authMiddleware, getDifficultyStats);
router.get("/dsa-progress", authMiddleware, getDsaProgress);

module.exports = router;