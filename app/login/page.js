"use client";

import { useState } from "react";
import { loginWithEmail } from "../../lib/auth";
import { useUserStore} from "../store/useUserStore";

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
      alert("Account logged in!");
      setUserEmail(email);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Failed to login. Check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex justify-between items-center p-10 bg-amber-500">
      <div>
           
      </div>
      <div className="bg-white flex flex-col shadow-2xl rounded-2xl p-10 w-[500px] hover:scale-[1.02]">
        <h1 className="text-3xl font-bold text-center text-amber-700 mb-6">
          Sign In
        </h1>
         
        <input
          type="email"
          placeholder="abc@gmail.com"
          className="w-[400px] bg-white p-4 text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="XXXXX"
          className="w-[400px] bg-white p-4 text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="bg-amber-700 p-3 my-3 text-white w-[200px] mx-auto rounded-2xl"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
