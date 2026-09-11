const express = require("express");

const { createTopic, getTopics } = require("../controllers/topicController.js");

const router = express.Router();

router.post("/", createTopic);
router.get("/", getTopics);

module.exports = router;