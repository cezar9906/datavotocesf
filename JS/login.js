import { auth } from "./firebase-config.js";
import { ehAdmin } from "./auth.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

// Limpa sessão antiga
signOut(auth).then(() => {
  console.log("Sessão limpa.");
});

// Redirecionamento
onAuthStateChanged(auth, (user) => {
  if (user) {
    setTimeout(() => {
      if (ehAdmin(user)) {
        window.location.replace("admin.html"); // Admin vai pro painel
      } else {
        window.location.replace("index.html"); // Usuário comum vai pra PESQUISA
      }
    }, 1500); // 1.5 segundos de espera
  }
});

// Alternar abas
document.querySelectorAll(".tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((b) => b.classList.remove("ativo"));
    btn.classList.add("ativo");
    const alvo = btn.dataset.tab;
    document.getElementById("form-login").hidden = alvo !== "login";
    document.getElementById("form-cadastro").hidden = alvo !== "cadastro";
  });
});

// LOGIN
document.getElementById("form-login").addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = document.getElementById("msg-login");
  const btn = document.getElementById("btn-login");
  msg.textContent = "Entrando...";
  msg.className = "msg-auth";
  btn.disabled = true;

  try {
    await signInWithEmailAndPassword(
      auth,
      document.getElementById("login-email").value.trim(),
      document.getElementById("login-senha").value
    );
  } catch (err) {
    msg.textContent = traduzirErro(err.code);
    msg.className = "msg-auth erro";
    btn.disabled = false;
  }
});

// CADASTRO
document.getElementById("form-cadastro").addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = document.getElementById("msg-cad");
  const btn = document.getElementById("btn-cad");
  const s1 = document.getElementById("cad-senha").value;
  const s2 = document.getElementById("cad-senha2").value;

  if (s1 !== s2) {
    msg.textContent = "As senhas não coincidem.";
    msg.className = "msg-auth erro";
    return;
  }

  msg.textContent = "Criando conta...";
  msg.className = "msg-auth";
  btn.disabled = true;

  try {
    await createUserWithEmailAndPassword(
      auth,
      document.getElementById("cad-email").value.trim(),
      s1
    );
  } catch (err) {
    msg.textContent = traduzirErro(err.code);
    msg.className = "msg-auth erro";
    btn.disabled = false;
  }
});

function traduzirErro(code) {
  const erros = {
    "auth/invalid-email": "E-mail inválido.",
    "auth/email-already-in-use": "Este e-mail já está cadastrado.",
    "auth/weak-password": "A senha precisa ter 6 caracteres ou mais.",
    "auth/wrong-password": "Senha incorreta.",
    "auth/invalid-credential": "E-mail ou senha incorretos."
  };
  return erros[code] || "Erro: " + code;
}