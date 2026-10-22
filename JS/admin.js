import { db } from "./firebase-config.js";
import { protegerRota, fazerLogout, exibirEmailNoHeader } from "./auth.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

const COLECAO = "datavoto_cesf_respostas";
let cacheDocs = [];

protegerRota("admin", (user) => {
  document.getElementById("painel").hidden = false;
  exibirEmailNoHeader(user);
  
  document.getElementById("btn-logout").addEventListener("click", fazerLogout);
  document.getElementById("btn-atualizar").addEventListener("click", () => carregarPainel());
  document.getElementById("btn-exportar").addEventListener("click", exportarCSV);
  
  carregarPainel();
});

async function carregarPainel() {
  try {
    const snap = await getDocs(collection(db, COLECAO));
    cacheDocs = snap.docs.map((d) => d.data());
    renderizar();
  } catch (erro) {
    console.error(erro);
    alert("Erro ao carregar dados.");
  }
}

function renderizar() {
  const docs = cacheDocs;
  const total = docs.length;
  const somaMoradores = docs.reduce((a, d) => a + Number(d.moradores || 0), 0);
  const somaIdade = docs.reduce((a, d) => a + Number(d.idade || 0), 0);

  document.getElementById("total-respostas").textContent = total;
  document.getElementById("media-moradores").textContent = total ? (somaMoradores / total).toFixed(1) : 0;
  document.getElementById("media-idade").textContent = total ? (somaIdade / total).toFixed(1) : 0;

  const contar = (campo) => {
    const map = {};
    docs.forEach((d) => { const v = d[campo] || "Não informado"; map[v] = (map[v] || 0) + 1; });
    return map;
  };

  const pautasMap = {};
  docs.forEach((d) => { (d.pautas || []).forEach((p) => { pautasMap[p] = (pautasMap[p] || 0) + 1; }); });

  criarGrafico("grafico-votos", contar("intencaoVoto"), "pie");
  criarGrafico("grafico-bairro", contar("bairro"), "bar");
  criarGrafico("grafico-escolaridade", contar("escolaridade"), "doughnut");
  criarGrafico("grafico-pautas", pautasMap, "bar");
  criarGrafico("grafico-genero", contar("genero"), "doughnut");
  criarGrafico("grafico-renda", contar("renda"), "bar");
}

function criarGrafico(id, dadosMap, tipo) {
  const ctx = document.getElementById(id);
  if (!ctx) return;
  const existing = Chart.getChart(ctx);
  if (existing) existing.destroy();

  new Chart(ctx, {
    type: tipo,
    data: {
      labels: Object.keys(dadosMap),
      datasets: [{
        data: Object.values(dadosMap),
        backgroundColor: ["#1e3a8a", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#f59e0b", "#f97316", "#10b981", "#ef4444", "#8b5cf6", "#ec4899"]
      }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: tipo === "pie" || tipo === "doughnut" } } }
  });
}

function exportarCSV() {
  if (!cacheDocs.length) return alert("Nenhum dado.");
  const linhas = cacheDocs.map((r) => [r.idade, r.genero, r.bairro, r.escolaridade, r.renda, r.moradores, r.trabalhadores, r.intencaoVoto, r.certezaVoto, `"${(r.pautas || []).join("; ")}"`].join(","));
  const csv = ["idade,genero,bairro,escolaridade,renda,moradores,trabalhadores,intencaoVoto,certezaVoto,pautas", ...linhas].join("\n");
  
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `datavoto_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
}