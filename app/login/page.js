"use client";

import { useState } from "react";
import { loginWithEmail } from "../../lib/auth";
import { useUserStore } from "../store/useUserStore";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const setUserEmail = useUserStore((state) => state.setUserEmail);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      await loginWithEmail(email, password);
      setUserEmail(email);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-amber-500 px-4">
     
      <div
        className="bg-white flex flex-col shadow-2xl rounded-2xl p-6 sm:p-10 w-full max-w-sm sm:max-w-md hover:scale-[1.02] transition"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-amber-700 mb-6">
          Login
        </h1>

        <input
          type="email"
          placeholder="abc@gmail.com"
          className="w-full bg-white p-3 sm:p-4 mb-4 border rounded-lg text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full bg-white p-3 sm:p-4 mb-6 border rounded-lg text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="bg-amber-700 p-3 text-whitew-full sm:w-1/2 mx-auto rounded-2xl font-semibold hover:bg-amber-800 transition"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
