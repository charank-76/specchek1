
import {create } from 'zustand';

export const useUserStore = create((set) => ({
    semail: "",
     spassword: "",
    email: "",
    setUserEmail:(email)=>set({email}),
     setUserSEmail:(semail)=>set({semail}),
    setUserSPassword:(spassword)=>set({spassword})

}));