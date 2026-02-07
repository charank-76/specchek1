"use client";
import { useState } from "react";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useEffect } from "react";
import { useRouter} from "next/navigation";






export default function Home() {

  const router = useRouter();

   const clickTOLogin = () => {
     router.push("/login");
   }

  const [text, setText] = useState("");
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

useEffect(() => {
  loadHistory();
}, []);

 const handleAnalyze = async () => {
  if (!text.trim()) {
    alert("Please paste some text first");
    return;
  }
 
  

  setLoading(true);
  setRisks([]);

  try {
    // 1️⃣ AI ANALYSIS
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    setRisks(data.risks || []);

    // 2️⃣ FIRESTORE SAVE (DO NOT BLOCK UI)
    try {
     await addDoc(collection(db, "reports"), {
  inputText: text,                 // 🔥 FULL INPUT
  textPreview: text.slice(0, 120), // for list display
  risks: data.risks || [],         // AI output
  createdAt: new Date(),
});


      loadHistory();
    } catch (fireErr) {
      console.warn("History save failed:", fireErr);
      // ❌ NO ALERT HERE
    }

  } catch (err) {
    alert("AI analysis failed");
  }

  setLoading(false);
};

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


  const getBorderColor = (level) => {
    if (level === "high") return "border-red-500";
    if (level === "medium") return "border-yellow-500";
    if (level === "low") return "border-green-500";
    return "border-gray-300";
  };

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <div className="w-full bg-slate-950 px-6 py-4 border-b flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent tracking-wide animate-pulse">SpecCheck</h1>
        <button className="px-4 py-2 border rounded animate-bounce text-white bg-gradient-to-r from-indigo-500 to-purple-500 ">Login</button>
      </div>

      {/* Input */}
      <div className="max-w-3xl bg-gray-900 border border-gray-700 rounded-2xl mx-auto mt-8 px-4">
        <h2 className="text-2xl font-semibold mb-4 text-purple-500  ">
          Paste your spec or contract text
        </h2>

        <textarea
          className="w-full h-56 p-4 border rounded resize-none"
          placeholder="Paste text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={handleAnalyze}
         className="mt-4 px-6 py-2 rounded-lg bg-red-500 text-white font-medium
hover:bg-red-600 transition-all duration-300 
hover:scale-105 shadow-md hover:shadow-red-500/30"
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
              {risk.level} risk – {risk.title}
            </h3>
            <p className="text-sm mt-1">{risk.desc}</p>
          </div>
        ))}
      </div>
      {/* History */}
<div className="max-w-3xl mx-auto mt-14 px-4">
  <h2 className="text-2xl font-semibold mb-6 text-yellow-300">
    Previous Analyses
  </h2>

  {history.map((item) => (
    <div
      key={item.id}
      className="mb-4 p-5 bg-gray-900 border border-gray-700 rounded-xl"
    >
      {/* Input text */}
      <p className="font-medium text-gray-200 mb-1">Input:</p>
      <p className="text-gray-400 mb-4 text-sm">
        {item.textPreview}...
      </p>

      {/* Risk badges */}
      <div className="flex flex-wrap gap-2 text-xs">
        {item.risks?.map((r, i) => (
          <span
            key={i}
            className={`px-3 py-1 rounded-full font-medium capitalize
            ${
              r.level === "high"
                ? "bg-red-600 text-white"
                : r.level === "medium"
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
