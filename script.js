import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyALY4mWlgws1KZhtQYbjaf0ApsCMCMrIzs",
  authDomain: "datavotocesf-b081a.firebaseapp.com",
  projectId: "datavotocesf-b081a",
  storageBucket: "datavotocesf-b081a.firebasestorage.app",
  messagingSenderId: "694506317356",
  appId: "1:694506317356:web:a9e4f1ffd0db499c43d389",
  measurementId: "G-BHJL9XJL3V"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const pollForm = document.getElementById("pollForm");

if (pollForm) {
  pollForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "datavoto_cesf_respostas"), {
        faixaEtaria: document.getElementById("faixaEtaria").value,
        bairro: document.getElementById("bairro").value,
        rotina: document.getElementById("rotina").value,
        renda: document.getElementById("renda").value,
        moradores: Number(document.getElementById("moradores").value),
        trabalhadores: Number(document.getElementById("trabalhadores").value),
        candidatoPrefeito: document.getElementById("candidatoPrefeito").value,
        rejeicaoPrefeito: document.getElementById("rejeicaoPrefeito").value,
        certezaVoto: document.getElementById("certezaVoto").value,
        avaliacaoGestao: document.getElementById("avaliacaoGestao").value,
        pauta: document.getElementById("pauta").value,
        dataCriacao: serverTimestamp()
      });

      alert("Resposta enviada com sucesso!");
      pollForm.reset();
    } catch (error) {
      console.error("Erro ao salvar resposta: ", error);
      alert("Erro ao enviar dados.");
    }
  });
}