import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA6FHpHpOo58wu9SjMbTm3D6ifJMDzyDqc",
  authDomain: "transfersigr-2.firebaseapp.com",
  projectId: "transfersigr-2",
  storageBucket: "transfersigr-2.firebasestorage.app",
  messagingSenderId: "273802447597",
  appId: "1:273802447597:web:6bac0368087135abec5ae4",
  measurementId: "G-Z6XVJ8TD20"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
