"use client";

import { useState } from "react";

export default function FeedbackPage() {
  const [helpful, setHelpful] = useState(null);
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    console.log({
      helpful,
      rating,
      comment,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-gray-500 p-10 rounded-xl shadow-xl text-center border border-gray-800 animate-fadeIn">
          <h2 className="text-2xl font-semibold text-green-500 animate-pulse">
            Thanks for your feedback!
          </h2>
          <p className="text-gray-400 mt-2">We appreciate your response.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-xl bg-gray-500 border border-gray-800 shadow-xl rounded-xl p-8 animate-fadeIn">
        <h1 className="text-3xl font-bold text-center text-white mb-8 animate-pulse">
          SHARE YOUR FEEDBACK
        </h1>
        <div className="mb-7">
          <p className="text-gray-300 font-medium mb-3 text-lg">
            Was the AI helpful?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setHelpful(true)}
              className={`px-6 py-2 rounded-lg font-medium  ${
                helpful === true
                  ? "bg-green-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-green-600 hover:text-white"
              }`}
            >
              Yes
            </button>
            <button
              onClick={() => setHelpful(false)}
              className={`px-6 py-2 rounded-lg font-medium ${
                helpful === false
                  ? "bg-red-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-red-600 hover:text-white"
              }`}
            >
              No
            </button>
          </div>
        </div>

        <div className="mb-7">
          <p className="text-gray-300 font-medium mb-2 text-lg">
            Understanding Level: 
            <span className="text-yellow-400 ml-2">{rating}/5</span>
          </p>

          <input
            type="range"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full accent-yellow-400 cursor-pointer"
          />

          <div className="flex justify-between text-sm text-white mt-1">
            <span>1</span>
            <span>5</span>
          </div>
        </div>
        <div className="mb-7">
          <p className="text-gray-300 font-medium mb-2 text-lg">
            Comment <span className="text-red-500">(optional)</span>
          </p>
          <textarea
            className="w-full p-3 rounded-lg bg-black border border-gray-700 text-white placeholder-gray-500 "
            placeholder="Tell us ur opinion..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-lg shadow-md hover:bg-yellow-300 "
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
}
