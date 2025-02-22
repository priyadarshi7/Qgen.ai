const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema({
    filename: {
        type:String,
    },
    data: Buffer,
    extractedText: String,
    uploadedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required:true,
    }
}, {timestamps:true})

const pdfModel = mongoose.model("pdf", pdfSchema);

module.exports = {pdfModel};