const express = require("express");
const { getQuiz, deleteQuiz } = require("../controller/quiz.controller");

const router = express.Router();

//Store user data
router.post("/", deleteQuiz);

//Get user data
router.get("/:id",  getQuiz);

module.exports = router;