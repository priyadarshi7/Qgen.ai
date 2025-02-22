const { getGroqQuiz } = require("./groqAPI");

async function generateQuizFromText(text, difficulty) {
    try {
        const quizQuestions = await getGroqQuiz(text, difficulty);
        if (!quizQuestions || !Array.isArray(quizQuestions)) {
            throw new Error("Invalid quiz data received from Groq API");
        }

        return quizQuestions.map(q => ({
            question: q.question,
            options: q.options || [],
            correctAnswer: q.correctAnswer,
            difficulty: difficulty,
        }));
    } catch (error) {
        console.error("Error generating quiz:", error);
        return [];
    }
}

module.exports = {
    generateQuizFromText,
};
