import { auth } from "./firebase-config.js";
import { 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut 
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

// Se já estiver logado como admin, manda pro painel
onAuthStateChanged(auth, (user) => {
  if (user && user.email === "useradmin@goku.com") {
    window.location.replace("admin.html");
  }
});

document.getElementById("form-login").addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = document.getElementById("msg-login");
  const btn = document.getElementById("btn-login");
  const email = document.getElementById("login-email").value.trim();
  const senha = document.getElementById("login-senha").value;

  msg.textContent = "Entrando...";
  msg.className = "msg-auth";
  btn.disabled = true;

  try {
    await signInWithEmailAndPassword(auth, email, senha);
    
    // Se logou, mas NÃO É o admin, expulsa!
    if (email !== "useradmin@goku.com") {
      await signOut(auth);
      msg.textContent = "Acesso restrito apenas para administradores.";
      msg.className = "msg-auth erro";
      btn.disabled = false;
      return;
    }
  } catch (err) {
    msg.textContent = "E-mail ou senha incorretos.";
    msg.className = "msg-auth erro";
    btn.disabled = false;
  }
});

// Esconde a aba de "Cadastrar", pois ninguém mais precisa criar conta
const abaCadastro = document.querySelector('[data-tab="cadastro"]');
if (abaCadastro) abaCadastro.style.display = "none";