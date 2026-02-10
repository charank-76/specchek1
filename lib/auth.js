import { auth } from "./firebase";
import {signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signOut} from 'firebase/auth';

export async function loginWithEmail(email,password){
    try {
   const result =  await signInWithEmailAndPassword(auth,email,password);
    console.log(JSON.stringify(result))
    if(result.user.emailVerified){
        alert('You can use the app')
    }else{
       alert("Please verify your email first");
      await signOut(auth);
      return null;    }
    } catch(exception){
            console.log(JSON.stringify(exception))

    }
}

export async function createAccount(email,password){
    try{
        const result = await createUserWithEmailAndPassword(auth,email,password);
        console.log(JSON.stringify(result))
        await sendEmailVerification(result.user)
    }catch(exception){
        console.log(JSON.stringify(exception))

    }
}
export async function logoutAccount() {
  try {
    await signOut(auth);
    alert("Logged out successfully!");
  } catch (error) {
    alert(error.message);
    console.log(error);
  }
}