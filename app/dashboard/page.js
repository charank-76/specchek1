"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // Load history on page load
  useEffect(() => {
    loadHistory();
  }, []);

  const clickToLogin = () => {
    router.push("/profile");
  };

  const loadHistory = async () => {
    try {
      const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHistory(items);
    } catch (err) {
      console.error("Failed to load history:", err);
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim()) {
      alert("Please paste some text first");
      return;
    }

    setLoading(true);
    setRisks([]);

    try {
      // 1. AI Analysis Call
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("Analysis failed");
      
      const data = await res.json();
      const detectedRisks = data.risks || [];
      setRisks(detectedRisks);

      // 2. Save to Firestore (Non-blocking)
      try {
        await addDoc(collection(db, "reports"), {
          inputText: text,
          textPreview: text.slice(0, 120),
          risks: detectedRisks,
          createdAt: new Date(),
        });
        loadHistory(); // Refresh the list
      } catch (fireErr) {
        console.warn("History save failed:", fireErr);
      }

    } catch (err) {
      console.error(err);
      alert("AI analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getBorderColor = (level) => {
    switch (level) {
      case "red": return "border-red-500";
      case "yellow": return "border-yellow-500";
      case "green": return "border-green-500";
      default: return "border-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <div className="w-full bg-slate-950 px-6 py-4 border-b border-gray-800 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent animate-pulse">
          SpecCheck
        </h1>
        <button 
          onClick={clickToLogin}
          className="px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition animate-bounce"
        >
          Profile
        </button>
      </div>

      {/* Input Area */}
      <div className="max-w-3xl bg-gray-900 border border-gray-700 rounded-2xl mx-auto mt-8 px-6 py-8">
        <h2 className="text-2xl font-semibold mb-4 text-purple-400">
          Paste your spec or contract text
        </h2>

        <textarea
          className="w-full h-56 p-4 bg-black border border-gray-600 rounded-lg resize-none focus:border-purple-500 outline-none transition"
          placeholder="Paste contract text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className={`mt-4 px-8 py-2 rounded-lg font-bold transition ${
            loading ? "bg-gray-600 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

    {/* Live Results */}
<div className="max-w-3xl mx-auto mt-10 px-4">
  {risks.length > 0 ? (
    risks.map((risk, index) => (
      <div
        key={index}
        className={`mb-4 p-4 border-l-4 rounded bg-gray-900 ${getBorderColor(risk.level)}`}
      >
        {/* Risk Level */}
        <h3 className="font-bold capitalize text-lg">
          {risk.level === "red" && "🔴 Red Risk"}
          {risk.level === "yellow" && "🟡 Yellow Risk"}
          {risk.level === "green" && "🟢 Safe"}
        </h3>

        {/* TITLE */}
        <p className="mt-2 font-semibold text-white">
          {risk.title}
        </p>

        {/* DESCRIPTION */}
        <p className="text-sm mt-1 text-gray-300">
          {risk.desc}
        </p>
      </div>
    ))
  ) : !loading && text && (
    <p className="text-center text-gray-500">No specific risks detected yet.</p>
  )}
</div>

      {/* History Section */}
      <div className="max-w-3xl mx-auto mt-14 px-4 pb-20">
        <h2 className="text-2xl font-semibold mb-6 text-yellow-300 border-b border-yellow-300/20 pb-2">
          Previous Analyses
        </h2>

        {history.length === 0 && <p className="text-gray-500">No history found.</p>}

        {history.map((item) => (
          <div
            key={item.id}
            className="mb-4 p-5 bg-gray-900 border border-gray-700 rounded-xl hover:border-gray-500 transition"
          >
            <p className="font-medium text-gray-200 mb-1 text-xs uppercase tracking-wider text-gray-500">Preview:</p>
            <p className="text-gray-400 mb-4 text-sm italic">
              "{item.textPreview}..."
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