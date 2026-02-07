import { create } from "zustand";
import { persisit, persist } from "zustand/middleware";

export const useUserStore = create(
     persist(
         (set) => ({
               userEmail : null,
               setUserEmail : (email) =>set({userEmail : email}),
               clearUserEmail : () => set({userEmail : null})
         }),
         {
            name : "user-storage",
         }
     )
);