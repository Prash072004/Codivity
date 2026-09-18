const express = require("express");

const { runCode } = require("../controllers/runController.js");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/", authMiddleware, runCode);

module.exports = router;