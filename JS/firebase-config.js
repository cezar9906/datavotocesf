import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyALY4mWlgws1KZhtQYbjaf0ApsCMCMrIzs",
  authDomain: "datavotocesf-b081a.firebaseapp.com",
  projectId: "datavotocesf-b081a",
  storageBucket: "datavotocesf-b081a.firebasestorage.app",
  messagingSenderId: "694506317356",
  appId: "1:694506317356:web:a9e4f1ffd0db499c43d389"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);