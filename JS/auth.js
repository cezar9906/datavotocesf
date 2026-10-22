import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

// A REGRA DE OURO DO ADMIN AQUI:
const EMAIL_ADMIN = "useradmin@goku.com"; 

export function ehAdmin(user) {
  if (!user || !user.email) return false;
  return user.email.toLowerCase() === EMAIL_ADMIN.toLowerCase();
}

export function protegerRota(papelExigido, aoAutorizar) {
  onAuthStateChanged(auth, (user) => {
    if (!user) { 
      // Se não tem ninguém logado, vai pro login
      window.location.href = "login.html"; 
      return; 
    }
    
    const isAdmin = ehAdmin(user);
    
    if (papelExigido === "admin" && !isAdmin) {
      // Tentou entrar no admin sem ser admin? Volta pro user.
      window.location.replace("user.html");
      return;
    }

    if (papelExigido === "user" && isAdmin) {
      // Admin logado tentando ver a tela de user? Manda pro admin.
      window.location.replace("admin.html");
      return;
    }
    
    // Se passou pelas regras, autoriza!
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