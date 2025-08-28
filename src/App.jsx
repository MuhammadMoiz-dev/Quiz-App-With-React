import { useEffect, useState } from "react";
import "./App.css";

function App() {
  // 🧩 States
  const [questions, setQuestions] = useState([]); // store all quiz questions
  const [currentIndex, setCurrentIndex] = useState(0); // track which question we’re on
  const [selectedAnswer, setSelectedAnswer] = useState(null); // track user selection
  const [score, setScore] = useState(0); // track score
  const [isFinished, setIsFinished] = useState(false); // show result screen when quiz ends

  // 📌 Fetch questions on mount
  useEffect(() => {
    fetchQuestions();
  }, []);

  // 🔀 Utility: shuffle array
  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  // 🌐 Fetch quiz data
  function fetchQuestions() {
    fetch("https://the-trivia-api.com/v2/questions")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((q) => ({
          question: q.question.text,
          correctAnswer: q.correctAnswer,
          options: shuffle([...q.incorrectAnswers, q.correctAnswer]),
        }));
        setQuestions(formatted);
      })
      .catch((err) => console.error("Error fetching quiz data:", err));
  }

  // ⏳ Show loading while fetching
  if (questions.length === 0) {
    return (
      <div className="flex justify-center items-center h-[100vh]">
        <img
          src="https://wpamelia.com/wp-content/uploads/2018/11/ezgif-2-6d0b072c3d3f.gif"
          alt="Loading..."
        />
      </div>
    );
  }

  // ✅ Handle selecting an option
  function handleSelect(option) {
    setSelectedAnswer(option);
  }

  // ⏭️ Handle next button
  function handleNext() {
    if (selectedAnswer === null) {
      alert("Please select an option before continuing!");
      return;
    }

    // update score
    if (selectedAnswer === questions[currentIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }

    // move to next question or finish quiz
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      setIsFinished(true);
    }
  }

  // 🏆 Show final result
  if (isFinished) {
    return (
      <div className="flex flex-col justify-center items-center h-[100vh] bg-blue-800 text-white px-4">
        <h1 className="text-4xl font-bold mb-6">Quiz Completed!</h1>
        <p className="text-2xl mb-4">
          You scored <span className="font-bold">{score}</span> out of{" "}
          {questions.length}
        </p>

        <button
          className="mt-4 bg-white text-indigo-600 px-6 py-3 rounded-xl shadow-lg font-semibold hover:scale-105 transition"
          onClick={() => {
            // restart quiz
            setCurrentIndex(0);
            setScore(0);
            setIsFinished(false);
            fetchQuestions();
          }}
        >
          Restart Quiz
        </button>
      </div>
    );
  }

  // 🎯 Current question
  const currentQuestion = questions[currentIndex];

  // 📋 Question screen
  return (
    <div className="flex flex-col justify-center items-center min-h-[100vh] bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-xl">
        <h1 className="text-2xl font-bold text-center mb-6 text-indigo-600">
          Quiz App
        </h1>

        {/* Question */}
        <h3 className="text-lg font-medium mb-4">
          Q{currentIndex + 1}: {currentQuestion.question}
        </h3>

        {/* Options */}
        <div className="flex flex-col gap-3">
          {currentQuestion.options.map((option, i) => (
            <label
              key={i}
              className={`p-3 border rounded-lg cursor-pointer transition ${selectedAnswer === option
                ? "bg-indigo-100 border-indigo-500"
                : "hover:bg-gray-100"
                }`}
            >
              <input
                type="radio"
                name="options"
                value={option}
                checked={selectedAnswer === option}
                onChange={() => handleSelect(option)}
                className="hidden"
              />
              {option}
            </label>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-600">
            Question {currentIndex + 1} of {questions.length}
          </p>
          <button
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl shadow hover:bg-indigo-700 transition"
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
