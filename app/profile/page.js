"use client";

import { useUserStore } from "../store/useUserStore";
import { useRouter} from "next/navigation";

export default function ProfilePage(){
     
    const userEmail = useUserStore((state) => state.userEmail);
    const clearUserEmail = useUserStore((state) => state.clearUserEmail);
    const router = useRouter();

    const handleLogout = () => {
         clearUserEmail();
         router.push("/login");
    }
     const handleDash = () => {
        //  clearUserEmail();
         router.push("/dashboard");
    }

    return(
         <div>
            <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-10 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to your Dashboard</h1>
        
        <div className="bg-amber-100 p-4 rounded-xl mb-6">
          <p className="text-amber-800">
            You are logged in as: <span className="font-bold">{userEmail || "Guest"}</span>
          </p>
        </div>
<div className="flex flex-col gap-4 items-center">
  
        <button 
          onClick={handleLogout}
          className="bg-red-500 w-[200px] text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
        
         <button 
          onClick={handleDash}
          className="bg-red-500 w-[200px] text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          DashBoard
        </button>
        </div>
      </div>
    </div>
         </div>
    )
}

