"use client";
import { useState } from "react";
import { createAccount } from "../lib/auth";


import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [email, setEmail] = useState("");      // ✅ fix
  const [password, setPassword] = useState(""); // ✅ fix
  const router = useRouter();

  const handleSignup = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      await createAccount(email, password);
      alert("Account created! Check your email for verification.");
      router.push("/login");
    } catch (err) {
      console.log(err);
      alert("Signup failed");
    }
  };

  return (
    <>
      <div className="min-h-screen flex justify-center items-center bg-amber-500">
        <div className="bg-white flex flex-col shadow-2xl rounded-2xl p-10 w-125 hover:scale-[1.02]">
          <h1 className="text-3xl font-bold text-center text-amber-700 mb-6">
            Sign Up
          </h1>

          <input
            type="email"
            placeholder="abc@gmail.com"
            className="w-100 bg-white p-4 text-black"
            value={email}                       // ✅ controlled input
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <input
            type="password"
            placeholder="XXXXX"
            className="w-100 bg-white p-4 text-black"
            value={password}                    // ✅ controlled input
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button
            onClick={handleSignup}              // ✅ cleaner handler
            className="bg-amber-700 p-3 my-3 text-white w-50 mx-auto rounded-2xl"
          >
            Sign Up
          </button>
        </div>
      </div>
    </>
  );
}
