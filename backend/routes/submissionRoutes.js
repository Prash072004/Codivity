const express = require("express");

const { createSubmission, getMySubmissions } = require("../controllers/submissionController.js");

const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/", authMiddleware, createSubmission);
router.get("/my", authMiddleware, getMySubmissions);

module.exports = router;