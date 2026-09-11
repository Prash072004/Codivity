const express = require("express");

const { createLanguage, getLanguages } = require("../controllers/languageController.js");

const router = express.Router();

router.post("/", createLanguage);
router.get("/", getLanguages);

module.exports = router;