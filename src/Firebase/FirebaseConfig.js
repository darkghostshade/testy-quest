
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBdvWs81xL8nvvizm0TanTtQgKC4FLs1l8",
  authDomain: "testy-quest.firebaseapp.com",
  projectId: "testy-quest",
  storageBucket: "testy-quest.appspot.com",
  messagingSenderId: "931258783508",
  appId: "1:931258783508:web:27c72022b6f54af10d9401",
  measurementId: "G-RRCXYPYLHP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
