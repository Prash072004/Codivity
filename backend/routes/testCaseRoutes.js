const express = require("express");

const { createTestCase, getTestCases } = require("../controllers/testCaseController.js");

const router = express.Router();

router.post("/", createTestCase);
router.get("/:problemId", getTestCases);

module.exports = router;