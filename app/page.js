"use client";
import { useState } from "react";
import { createAccount } from "../lib/auth";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [semail, setSEmail] = useState("");
  const [spassword, setSPassword] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    if (!semail || !spassword) {
      alert("Please fill all fields");
      return;
    }

    try {
      await createAccount(semail, spassword);
      alert("Account created! Check your email for verification.");
      router.push("/login");
    } catch (err) {
      console.log(err);
      alert("Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-amber-500 px-4">
    
      <div className="bg-white flex flex-col shadow-2xl rounded-2xl p-6 sm:p-10 w-full max-w-sm sm:max-w-md hover:scale-[1.02] transition">
        
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-amber-700 mb-6">
          Sign Up
        </h1>

        <input
          type="email"
          placeholder="abc@gmail.com"
          className="w-full bg-white p-3 sm:p-4 mb-4 border rounded-lg text-black"
          value={semail}
          onChange={(e) => setSEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full bg-white p-3 sm:p-4 mb-6 border rounded-lg text-black"
          value={spassword}
          onChange={(e) => setSPassword(e.target.value)}
          required
        />

        <button
          onClick={handleSignup}
          className="bg-amber-700 p-3 text-white  w-full sm:w-1/2 mx-auto  rounded-2xl font-semibold hover:bg-amber-800 transition"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
