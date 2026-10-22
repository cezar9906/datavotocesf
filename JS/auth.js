import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

const EMAIL_ADMIN = "useradmin@goku.com"; 

export function ehAdmin(user) {
  if (!user || !user.email) return false;
  return user.email.toLowerCase() === EMAIL_ADMIN.toLowerCase();
}

export function protegerRota(papelExigido, aoAutorizar) {
  onAuthStateChanged(auth, (user) => {
    if (!user) { 
      window.location.href = "login.html"; 
      return; 
    }
    
    const isAdmin = ehAdmin(user);
    
    if (papelExigido === "admin" && !isAdmin) {
      window.location.replace("user.html");
      return;
    }

    if (papelExigido === "user" && isAdmin) {
      window.location.replace("admin.html");
      return;
    }
    
    aoAutorizar(user, isAdmin ? "admin" : "user");
  });
}

export async function fazerLogout() {
  await signOut(auth);
  window.location.href = "login.html";
}

export function exibirEmailNoHeader(user) {
  const el = document.getElementById("user-email");
  if (el) el.textContent = user.email || "Usuário";
}