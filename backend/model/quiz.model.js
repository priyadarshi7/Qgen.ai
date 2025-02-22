const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [
    {
      question: { type: String, required: true },
      options: { type: [String], required: true, validate: v => v.length === 4 }, 
      correctAnswer: { type: String, required: true },
      difficulty: { 
        type: String, 
        enum: ["Easy", "Medium", "Hard"], 
        required: true 
      }, 
    },
  ],
  pdfId: { type: mongoose.Schema.Types.ObjectId, ref: "pdf", required: false }, // Optional PDF reference
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, // Reference to the user who created it
}, { timestamps: true });

const quizModel = mongoose.model("quiz", quizSchema);
module.exports = {quizModel};
