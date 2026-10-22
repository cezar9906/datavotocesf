import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

const EMAIL_ADMIN = "useradmin@goku.com"; 

export async function ehAdmin(user) {
  if (!user || !user.email) return false;
  // Compara as strings exatas
  return user.email.toLowerCase() === EMAIL_ADMIN.toLowerCase();
}

export async function fazerLogout() {
  await signOut(auth);
  window.location.href = "login.html";
}

export function exibirEmailNoHeader(user) {
  const el = document.getElementById("user-email");
  if (el) el.textContent = user.email || "Usuário";
}