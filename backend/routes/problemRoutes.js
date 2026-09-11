const express = require("express");

const { createProblem, getProblems, getProblemBySlug } = require("../controllers/problemController.js");

const router = express.Router();

router.post("/", createProblem);
router.get("/", getProblems);
router.get("/:slug", getProblemBySlug);

module.exports = router;