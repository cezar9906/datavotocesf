import { db } from "./firebase-config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

const form = document.getElementById("form-pesquisa");
const msg = document.getElementById("mensagem");
const btn = document.getElementById("btn-enviar");
const COLECAO = "datavoto_cesf_respostas";

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

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "";
  msg.className = "";

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const pautas = [...document.querySelectorAll('input[name="pautas"]:checked')].map((c) => c.value);
  const resposta = {
    idade: Number(document.getElementById("idade").value),
    genero: document.getElementById("genero").value,
    bairro: document.getElementById("bairro").value,
    escolaridade: document.getElementById("escolaridade").value,
    renda: document.getElementById("renda").value,
    moradores: Number(document.getElementById("moradores").value),
    trabalhadores: Number(document.getElementById("trabalhadores").value),
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