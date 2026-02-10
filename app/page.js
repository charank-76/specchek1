"use client";
import { useState } from "react";
import { createAccount } from "../lib/auth";


import { useRouter } from "next/navigation";
import { useUserStore} from "./store/useUserStore";

export default function SignUpPage() {
  const [semail, setSEmail] = useState("");      
  const [spassword, setSPassword] = useState("");
  const router = useRouter();
  //  const setUserSEmail = useUserStore((state) => state.setUserSEmail);
  //  const setUserSPassword = useUserStore((state) => state.setUserSPassword);

  const handleSignup = async () => {
    if (!semail || !spassword) {
      alert("Please fill all fields");
      return;
    }

    // setUserSEmail(semail);
    // setUserSPassword(spassword);

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
            value={semail}                       
            onChange={(event) => setSEmail(event.target.value)}
            required
          />

          <input
            type="password"
            placeholder="XXXXX"
            className="w-100 bg-white p-4 text-black"
            value={spassword}                   
            onChange={(event) => setSPassword(event.target.value)}
            required
          />

          <button
            onClick={handleSignup}              
            className="bg-amber-700 p-3 my-3 text-white w-50 mx-auto rounded-2xl"
          >
            Sign Up
          </button>
        </div>
      </div>
    </>
  );
}
