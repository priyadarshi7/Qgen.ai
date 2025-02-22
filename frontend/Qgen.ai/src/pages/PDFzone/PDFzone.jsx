import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PDFZone.css';
import { useAuth0 } from '@auth0/auth0-react';
import { X, Upload, FileText, Sun, Moon } from 'lucide-react';

export default function PDFZone() {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);

  const { user } = useAuth0();
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
    } else {
      alert("Please upload a valid PDF file!");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else if (selectedFile) {
      alert("Please upload a valid PDF file!");
    }
  };

  const handleGenerateClick = () => {
    if (!file) {
      alert("Please upload a PDF");
      return;
    }
    setShowDifficultyModal(true);
  };

  const handleDifficultySelect = async (difficulty) => {
    setShowDifficultyModal(false);
    setLoading(true);
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("auth0Id", user?.sub);
    formData.append("difficulty", difficulty);
  
    try {
      const response = await fetch("http://localhost:8000/pdf/upload", {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      setExtractedText(data.extractedText);
      setQuizData(data.quiz); // Store the quiz data
  
      // Ensure the response contains a quiz ID
      if (data.quizId) {
        navigate(`/quiz/${data.quizId}`);
      } else {
        alert("Quiz ID is missing. Please try again.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  const removeFile = () => {
    setFile(null);
    setExtractedText('');
    setQuizData(null);
  };

  const handleAttemptQuiz = () => {
    navigate('/quiz', { state: { quiz: quizData } });
  };

  return (
    <div className={`app ${isDarkMode ? 'dark' : ''}`}>
      <div className="container">
        <header className="header" style={{ marginTop: "80px" }}>
          <div className="logo">
            <h1>QGen.ai</h1>
          </div>
          <button 
            className="theme-toggle"
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Moon className="theme-icon" /> : <Sun className="theme-icon" />}
          </button>
        </header>

        <main className="main-content">
          <div className="upload-container">
            <h2>Transform Your PDF into an Interactive Quiz</h2>
            <p className="subtitle-1">Upload your PDF and let AI generate engaging questions</p>

            <div
              className={`upload-zone ${dragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                accept="application/pdf"
                className="file-input"
              />
              <label htmlFor="file-upload" className="upload-label">
                {file ? (
                  <div className="file-info">
                    <FileText className="file-icon" />
                    <span className="filename">{file.name}</span>
                    <button className="remove-file" onClick={removeFile}>
                      <X className="remove-icon" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="upload-icon" />
                    <span>Drop your PDF here or click to browse</span>
                    <span className="upload-hint">Maximum file size: 10MB</span>
                  </>
                )}
              </label>
            </div>

            <button
              className={`generate-button ${loading ? 'loading' : ''}`}
              onClick={handleGenerateClick}
              disabled={!file || loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  <span>Generating Quiz...</span>
                </>
              ) : (
                <>
                  <FileText className="generate-icon" />
                  <span>Generate Quiz</span>
                </>
              )}
            </button>

            {extractedText && (
              <div className="extracted-text">
                <h3>Extracted Content</h3>
                <p>{extractedText}</p>
              </div>
            )}

            {quizData && (
              <button className="attempt-quiz-button" onClick={handleAttemptQuiz}>
                Attempt Quiz
              </button>
            )}
          </div>
        </main>

        {/* Difficulty Selection Modal */}
        {showDifficultyModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Select Difficulty Level</h3>
                <button 
                  className="modal-close"
                  onClick={() => setShowDifficultyModal(false)}
                >
                  <X className="close-icon" />
                </button>
              </div>
              <div className="modal-body">
                <button 
                  className="difficulty-btn easy"
                  onClick={() => handleDifficultySelect('Easy')}
                >
                  Easy
                </button>
                <button 
                  className="difficulty-btn medium"
                  onClick={() => handleDifficultySelect('Medium')}
                >
                  Medium
                </button>
                <button 
                  className="difficulty-btn hard"
                  onClick={() => handleDifficultySelect('Hard')}
                >
                  Hard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
