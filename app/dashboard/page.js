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
    if (level === "red") return "border-red-500";
    if (level === "yellow") return "border-yellow-500";
    if (level === "green") return "border-green-500";
    return "border-gray-300";
  };

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <div className="w-full px-6 py-4 border-b flex justify-between items-center">
        <h1 className="text-xl font-bold">SpecCheck</h1>
        <button onClick={clickTOLogin} className="px-4 py-2 border rounded hover:bg-gray-200 hover:text-black">Login</button>
      </div>

      {/* Input */}
      <div className="max-w-3xl mx-auto mt-8 px-4">
        <h2 className="text-2xl font-semibold mb-4">
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
          className="mt-4 px-6 py-2 bg-black text-white rounded"
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
<div className="max-w-3xl mx-auto mt-12 px-4">
  <h2 className="text-xl font-semibold mb-4">Previous Analyses</h2>

  {history.map((item) => (
    <div
      key={item.id}
      className="mb-3 p-3 border rounded text-sm"
    >
      <p className="font-medium">Input:</p>
      <p className="text-gray-400 mb-2">{item.textPreview}...</p>

      <div className="flex gap-2 text-xs">
        {item.risks?.map((r, i) => (
          <span
            key={i}
            className="px-2 py-1 border rounded capitalize"
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
