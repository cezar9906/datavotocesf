import { auth } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

export function ehAdmin(user) {
  if (!user || !user.email) return false;
  // Retorna true APENAS se o e-mail for exatamente este:
  return user.email.toLowerCase() === "useradmin@goku.com";
}

export async function fazerLogout() {
  await signOut(auth);
  window.location.href = "login.html";
}

export function exibirEmailNoHeader(user) {
  const el = document.getElementById("user-email");
  if (el) el.textContent = user.email || "Usuário";
}