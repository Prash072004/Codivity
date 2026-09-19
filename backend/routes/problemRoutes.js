const express = require("express");

const {
    createProblem,
    getProblems,
    getProblemBySlug,
    updateProblem,
    deleteProblem
} = require("../controllers/problemController.js");

const router = express.Router();

router.post("/", createProblem);
router.get("/", getProblems);
router.get("/:slug", getProblemBySlug);
router.put("/:id", updateProblem);
router.delete("/:id", deleteProblem);

module.exports = router;