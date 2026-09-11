const express = require("express");

const {
    getMyProblemStatus,
    getMyProgress
} = require("../controllers/userProblemController.js");

const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

router.get("/:problemId", authMiddleware, getMyProblemStatus);
router.get("/", authMiddleware, getMyProgress);

module.exports = router;