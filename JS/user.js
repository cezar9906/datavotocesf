import { db } from "./firebase-config.js";
import { protegerRota, fazerLogout, exibirEmailNoHeader } from "./auth.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

protegerRota("user", async (user) => {
  document.getElementById("painel").hidden = false;
  exibirEmailNoHeader(user);
  document.getElementById("btn-logout").addEventListener("click", fazerLogout);

  try {
    const snap = await getDocs(collection(db, "datavoto_cesf_respostas"));
    const docs = snap.docs.map((d) => d.data());
    
    document.getElementById("total-respostas").textContent = docs.length;

    const votos = {};
    const pautas = {};
    docs.forEach((d) => {
      votos[d.intencaoVoto] = (votos[d.intencaoVoto] || 0) + 1;
      (d.pautas || []).forEach((p) => (pautas[p] = (pautas[p] || 0) + 1));
    });

    criarGrafico("grafico-votos", votos, "pie");
    criarGrafico("grafico-pautas", pautas, "bar");
  } catch (erro) {
    console.error(erro);
  }
});

function criarGrafico(id, map, tipo) {
  const ctx = document.getElementById(id);
  if (!ctx) return;
  new Chart(ctx, {
    type: tipo,
    data: {
      labels: Object.keys(map),
      datasets: [{ data: Object.values(map), backgroundColor: ["#1e3a8a", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#f59e0b", "#10b981", "#ef4444"] }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: tipo === "pie" } } }
  });
}