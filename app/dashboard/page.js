"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function Home() {
  const [text, setText] = useState("");
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  // 🔥 Analyze contract
  const handleAnalyze = async () => {
    if (!text.trim()) {
      alert("Please paste some text first");
      return;
    }

    setLoading(true);
    setRisks([]);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      setRisks(data.risks || []);

      // Save history (non-blocking)
      try {
        await addDoc(collection(db, "reports"), {
          inputText: text,
          textPreview: text.slice(0, 120),
          risks: data.risks || [],
          createdAt: new Date(),
        });
        loadHistory();
      } catch (err) {
        console.warn("Firestore save failed");
      }
    } catch (err) {
      alert("AI analysis failed");
    }

    setLoading(false);
  };

  // 🔥 Load history
  const loadHistory = async () => {
    const q = query(
      collection(db, "reports"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setHistory(items);
  };

  // 🔥 Color helper
  const getBorderColor = (level) => {
    if (level === "red") return "border-red-500";
    if (level === "yellow") return "border-yellow-500";
    if (level === "green") return "border-green-500";
    return "border-gray-300";
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <div className="w-full bg-slate-950 px-6 py-4 border-b flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
          SpecCheck
        </h1>
        <button className="px-4 py-2 rounded bg-gradient-to-r from-indigo-500 to-purple-500">
          Login
        </button>
      </div>

      {/* Input */}
      <div className="max-w-3xl bg-gray-900 border border-gray-700 rounded-2xl mx-auto mt-8 px-4 py-6">
        <h2 className="text-2xl font-semibold mb-4 text-purple-400">
          Paste your spec or contract text
        </h2>

        <textarea
          className="w-full h-56 p-4 bg-black border border-gray-600 rounded resize-none"
          placeholder="Paste contract text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={handleAnalyze}
          className="mt-4 px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {/* Results */}
      <div className="max-w-3xl mx-auto mt-10 px-4">
        {risks.map((risk, index) => (
          <div
            key={index}
            className={`mb-4 p-4 border-l-4 rounded ${getBorderColor(
              risk.level
            )}`}
          >
            <h3 className="font-semibold capitalize">
              {risk.level} risk
            </h3>
            <p className="text-sm mt-1 text-gray-300">
              {risk.text}
            </p>
          </div>
        ))}
      </div>

      {/* History */}
      <div className="max-w-3xl mx-auto mt-14 px-4 pb-20">
        <h2 className="text-2xl font-semibold mb-6 text-yellow-300">
          Previous Analyses
        </h2>

        {history.map((item) => (
          <div
            key={item.id}
            className="mb-4 p-5 bg-gray-900 border border-gray-700 rounded-xl"
          >
            <p className="font-medium text-gray-200 mb-1">Input:</p>
            <p className="text-gray-400 mb-4 text-sm">
              {item.textPreview}...
            </p>

            <div className="flex flex-wrap gap-2 text-xs">
              {item.risks?.map((r, i) => (
                <span
                  key={i}
                  className={`px-3 py-1 rounded-full font-medium capitalize
                    ${
                      r.level === "red"
                        ? "bg-red-600 text-white"
                        : r.level === "yellow"
                        ? "bg-yellow-500 text-black"
                        : "bg-green-600 text-white"
                    }`}
                >
                  {r.level}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
