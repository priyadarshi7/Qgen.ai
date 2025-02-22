const multer = require("multer");
const pdfParse = require("pdf-parse");
const { pdfModel } = require("../model/pdf.model");
const { userModel } = require("../model/user.model");
const { generateQuizFromText } = require("../utils/generateQuiz");
const {quizModel} = require("../model/quiz.model");
const { default: mongoose } = require("mongoose");

// Multer storage (memory-based, 5MB limit)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage});

async function uploadPDF(req, res) {
    try {

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const { auth0Id, difficulty} = req.body; // Get Auth0 ID from request
        const user = await userModel.findOne({auth0Id});
        if (!user) return res.status(404).json({ error: "User not found" });

        const fileBuffer = req.file.buffer;

        // Extract text from PDF using pdf-parse
        const pdfData = await pdfParse(fileBuffer);
        const extractedText = pdfData.text;

        // Save extracted text in MongoDB
        const newPdf = new pdfModel({
            filename: req.file.originalname,
            data: fileBuffer,
            extractedText: extractedText.trim(),
            uploadedBy: user._id,
        });

        await newPdf.save();

        //Save Quiz in the database
        const generatedQuiz = await generateQuizFromText(extractedText, difficulty);

        const newQuiz = new quizModel({
            title: `Quiz from ${req.file.originalname}`,
            questions: generatedQuiz,
            createdBy: user._id,
        });

        await newQuiz.save();
        res.status(201).json({ message: "PDF uploaded, quiz generated and saved!", extractedText, quiz: newQuiz, quizId: newQuiz._id });        ;

    } catch (error) {
        console.error("PDF Processing Error:", error);
        res.status(500).json({ error: "Failed to process PDF" });
    }
}

// Fetch Extracted Text from MongoDB
async function getPDF(req, res) {
    try {
        const pdf = await pdfModel.findById(req.params.id).populate("uploadedBy");;
        if (!pdf) return res.status(404).json({ error: "PDF not found" });

        res.json({ filename: pdf.filename, extractedText: pdf.extractedText });

    } catch (error) {
        console.error("Error retrieving PDF:", error);
        res.status(500).json({ error: "Error retrieving PDF" });
    }
}

module.exports = {
    uploadPDF,
    getPDF,
    upload,
};
