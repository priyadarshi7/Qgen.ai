import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Quiz.css";
import { useAuth0 } from "@auth0/auth0-react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

export default function QuizPage() {
  const { id } = useParams();
  const { user } = useAuth0();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    if (id) {
      fetchQuiz(id);
    }
  }, [id]);

  const fetchQuiz = async (quizId) => {
    try {
      const response = await fetch(`http://localhost:8000/quiz/${quizId}`);
      if (!response.ok) throw new Error("Failed to fetch quiz");
      const data = await response.json();
      setQuiz(data);
    } catch (error) {
      console.error("Error fetching quiz:", error);
    }
  };

  const handleOptionChange = (questionId, selectedOption) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedOption,
    }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    let total = quiz?.questions?.length || 0;

    quiz?.questions.forEach((q) => {
      if (answers[q._id] === q.correctAnswer) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setTotalQuestions(total);
    setSubmitted(true);
  };

  if (!quiz) {
    return (
      <div className="loading">
        <h2>Loading quiz...</h2>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h1>{quiz.title}</h1>

      {!submitted ? (
        <div className="quiz-content">
          {quiz.questions.map((question) => (
            <div key={question._id} className="question">
              <h3>{question.question}</h3>
              {question.options.map((option) => (
                <label key={option} className="option-label">
                  <input
                    type="radio"
                    name={question._id}
                    value={option}
                    onChange={() => handleOptionChange(question._id, option)}
                    checked={answers[question._id] === option}
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}
          <button onClick={handleSubmit} className="submit-btn">
            Submit Quiz
          </button>
        </div>
      ) : (
        <div className="result-section">
          <h2>Quiz Analysis</h2>
          <p>
            Your Score: <strong>{score}</strong> out of <strong>{totalQuestions}</strong>
          </p>
          <Bar
            data={{
              labels: ["Correct", "Incorrect"],
              datasets: [
                {
                  label: "Quiz Performance",
                  data: [score, totalQuestions - score],
                  backgroundColor: ["#4caf50", "#f44336"],
                },
              ],
            }}
            options={{
              responsive: true,
              scales: {
                y: { 
                  beginAtZero: true,
                  ticks: {
                    color: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#f7fafc' : '#2d3748'
                  }
                },
                x: {
                  ticks: {
                    color: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#f7fafc' : '#2d3748'
                  }
                }
              },
              plugins: {
                legend: {
                  labels: {
                    color: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#f7fafc' : '#2d3748'
                  }
                }
              }
            }}
          />
          <button onClick={() => setSubmitted(false)} className="retry-btn">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}