const express = require("express");
const { uploadPDF, getPDF, upload } = require("../controller/pdf.controller");

const router = express.Router();

// POST Request to upload PDF
router.post("/upload", upload.single("file"), uploadPDF);

// GET Request to get data from PDF
router.get("/:id", getPDF);

module.exports = router;
