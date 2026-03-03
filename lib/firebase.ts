import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging,getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBGvDoWIsHzOAn4KC5S-k_tdzKfL5zZvgo",
  authDomain: "travel-admin-app.firebaseapp.com",
  projectId: "travel-admin-app",
  storageBucket: "travel-admin-app.firebasestorage.app",
  messagingSenderId: "258759706014",
  appId: "1:258759706014:web:4b38f5cee50a2797e7428f"
};



const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = typeof window !== "undefined"
  ? getMessaging(app)
  : null;  