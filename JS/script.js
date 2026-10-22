import { db, auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

const form = document.getElementById("form-pesquisa");
const msg = document.getElementById("mensagem");
const btn = document.getElementById("btn-enviar");
const COLECAO = "datavoto_cesf_respostas";

// Variável para guardar o usuário logado
let usuarioLogado = null;

// 1. VERIFICAÇÃO OBRIGATÓRIA DE LOGIN
// Esconde o formulário enquanto verifica
if (form) form.style.display = "none";

onAuthStateChanged(auth, (user) => {
  if (user) {
    // Usuário está logado. Mostra o formulário!
    usuarioLogado = user;
    if (form) form.style.display = "flex";
  } else {
    // Usuário NÃO está logado. Expulsa para a tela de login!
    alert("Você precisa entrar ou criar uma conta para responder à pesquisa.");
    window.location.href = "login.html";
  }
});

// 2. LÓGICA DOS CHECKBOXES (Máximo 3 pautas)
const checkboxes = document.querySelectorAll('input[name="pautas"]');
checkboxes.forEach((cb) => {
  cb.addEventListener("change", () => {
    const marcados = document.querySelectorAll('input[name="pautas"]:checked');
    if (marcados.length > 3) {
      cb.checked = false;
      alert("Você pode selecionar no máximo 3 pautas prioritárias.");
    }
  });
});

// 3. ENVIO DO FORMULÁRIO
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "";
  msg.className = "";

  // Trava de segurança extra: se por algum motivo não tiver usuário, barra o envio
  if (!usuarioLogado) {
    msg.textContent = "Erro: Você precisa estar logado para enviar.";
    msg.className = "erro";
    return;
  }

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const pautas = [...document.querySelectorAll('input[name="pautas"]:checked')].map((c) => c.value);

  const idade = Number(document.getElementById("idade").value);
  const moradores = Number(document.getElementById("moradores").value);
  const trabalhadores = Number(document.getElementById("trabalhadores").value);

  if (trabalhadores > moradores) {
    msg.textContent = "Pessoas que trabalham não pode ser maior que moradores.";
    msg.className = "erro";
    return;
  }

  const resposta = {
    // SALVA O EMAIL DE QUEM RESPONDEU (Bônus para o Admin)
    emailUsuario: usuarioLogado.email,
    uidUsuario: usuarioLogado.uid,

    idade: idade,
    genero: document.getElementById("genero").value,
    bairro: document.getElementById("bairro").value,
    escolaridade: document.getElementById("escolaridade").value,
    renda: document.getElementById("renda").value,
    moradores: moradores,
    trabalhadores: trabalhadores,
    intencaoVoto: document.getElementById("intencaoVoto").value,
    certezaVoto: document.getElementById("certezaVoto").value,
    pautas: pautas,
    criadoEm: serverTimestamp()
  };

  btn.disabled = true;
  btn.textContent = "Enviando...";
  
  try {
    await addDoc(collection(db, COLECAO), resposta);
    msg.textContent = "Resposta enviada com sucesso! Muito obrigado.";
    msg.className = "ok";
    form.reset();
  } catch (erro) {
    console.error("Erro ao gravar:", erro);
    msg.textContent = "Erro ao enviar. Tente novamente.";
    msg.className = "erro";
  } finally {
    btn.disabled = false;
    btn.textContent = "Enviar Minhas Respostas";
  }
});