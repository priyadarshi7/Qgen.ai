require("dotenv").config();
const axios = require("axios");

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const API_KEY = process.env.GROQ_API; // Use a valid API key

async function getGroqQuiz(text, difficulty) {
    const prompt = `
    Generate a multiple-choice quiz in strict JSON format. Do NOT include Markdown. Do NOT include explanations.

    Text:
    ${text}

    Expected JSON Format:
    {
      "questions": [
        {
          "question": "What is ...?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": "Option A"
        }
      ]
    }

    Only return JSON, nothing else.
    `;

    try {
        const response = await axios.post(GROQ_API_URL, {
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are a helpful quiz generator." },
                { role: "user", content: prompt }
            ],
            max_tokens: 1000 // Increased to avoid truncation
        }, {
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.data?.choices?.length) {
            throw new Error("Invalid response from Groq API");
        }

        let rawOutput = response.data.choices[0]?.message?.content?.trim();
        if (!rawOutput) {
            throw new Error("No valid quiz data found in response");
        }

        // Remove Markdown formatting
        rawOutput = rawOutput.replace(/```json|```/g, "").trim();

        console.log("Raw Output Before Parsing:", rawOutput);

        // Validate JSON structure before parsing
        if (!rawOutput.startsWith("{") || !rawOutput.endsWith("}")) {
            throw new Error("Invalid JSON format detected");
        }

        const quizData = JSON.parse(rawOutput);
        return quizData.questions || [];

    } catch (error) {
        console.error("Error generating quiz:", error);
        return [];
    }
}

module.exports = {
    getGroqQuiz
};
