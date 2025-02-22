
const {quizModel} = require("../model/quiz.model")

//Generate Quiz from the pdf using Gemini API

async function getQuiz(req, res) {
    try {
        const quiz = await quizModel.findById(req.params.id).populate("createdBy");
        if (!quiz) return res.status(404).json({ error: "Quiz not found" });

        res.json(quiz);
    } catch (error) {
        console.error("Error retrieving quiz:", error);
        res.status(500).json({ error: "Error retrieving quiz" });
    }
}

async function deleteQuiz(req, res) {
    try {
        const quiz = await quizModel.findByIdAndDelete(req.params.id);
        if (!quiz) return res.status(404).json({ error: "Quiz not found" });

        res.json({ message: "Quiz deleted successfully!" });
    } catch (error) {
        console.error("Error deleting quiz:", error);
        res.status(500).json({ error: "Failed to delete quiz" });
    }
}

module.exports = {
    getQuiz,
    deleteQuiz,
};
