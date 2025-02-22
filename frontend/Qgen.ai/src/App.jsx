import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import PDFZone from "./pages/PDFzone/PDFzone";
import QuizPage from "./pages/Quiz/Quiz";

export default function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pdf" element={<PDFZone />} />
        <Route path="/quiz/:id" element={<QuizPage />} /> {/* Dynamic Quiz Page */}
      </Routes>
    </div>
  );
}
