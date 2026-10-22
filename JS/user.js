import { db, auth } from "./firebase-config.js";
import { fazerLogout, exibirEmailNoHeader, ehAdmin } from "./auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

// Em vez de usar protegerRota("admin"), usamos a verificação direta do Firebase
onAuthStateChanged(auth, async (user) => {
  // 1. Se não estiver logado, manda pro login
  if (!user) {
    window.location.replace("login.html");
    return;
  }

  // 2. Se for o admin tentando acessar a tela de user, manda ele pro admin
  if (ehAdmin(user)) {
    window.location.replace("admin.html");
    return;
  }

  // 3. Se for um usuário comum, libera a tela!
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
    console.error("Erro ao carregar dados:", erro);
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