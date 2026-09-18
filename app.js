// ⚠️ À remplacer par l'URL /exec de votre déploiement Apps Script (voir README.md)
const API_URL = "https://script.google.com/macros/s/AKfycbxCXS7U0JpkNw40dZOrJamHMEsf1W2hH0pc4veQUOEI-QeGn76iSMZFXKdAbcr1cufE/exec";

const CATEGORIES = ["Louange", "Méditation", "Esprit-Saint", "Marie"];

let seanceActive = null;
let tousLesChants = [];

// ---- Appels API -------------------------------------------------------

async function apiGet(action, params = {}) {
  const url = new URL(API_URL);
  url.searchParams.set("action", action);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url);
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || "Erreur inconnue");
  return json.data;
}

async function apiPost(action, payload = {}) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" }, // évite le préflight CORS
    body: JSON.stringify({ action, ...payload })
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || "Erreur inconnue");
  return json.data;
}

// ---- Onglets ------------------------------------------------------------

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
    if (btn.dataset.tab === "chants") chargerReferentielChants();
    if (btn.dataset.tab === "historique") chargerHistorique();
  });
});

// ---- Préparer une soirée -------------------------------------------------

document.getElementById("seance-date").valueAsDate = new Date();

document.getElementById("btn-nouvelle-seance").addEventListener("click", async () => {
  const date = document.getElementById("seance-date").value;
  if (!date) return alert("Merci de choisir une date.");

  try {
    const { id } = await apiPost("creerSeance", { date });
    seanceActive = await apiGet("obtenirSeance", { id });
    await afficherSeanceActive();
  } catch (e) {
    alert("Erreur : " + e.message);
  }
});

async function afficherSeanceActive() {
  document.getElementById("panel-seance-active").hidden = false;
  document.getElementById("seance-active-date").textContent = seanceActive.date;
  document.getElementById("seance-notes").value = seanceActive.notes || "";

  chargerEvangile(seanceActive.date);
  await afficherChoixChants();
}

async function chargerEvangile(date) {
  const box = document.getElementById("evangile-contenu");
  box.textContent = "Chargement…";
  try {
    const evangile = await apiGet("obtenirEvangileDuJour", { date });
    box.innerHTML = `<strong>${evangile.titre}</strong> (${evangile.ref})\n\n${evangile.texte}`;
    seanceActive.evangileRef = evangile.ref;
    seanceActive.evangileTitre = evangile.titre;
    seanceActive.evangileTexte = evangile.texte;
  } catch (e) {
    box.textContent = "Évangile indisponible (" + e.message + "). Vous pouvez continuer sans.";
  }
}

async function afficherChoixChants() {
  if (tousLesChants.length === 0) {
    tousLesChants = await apiGet("listerChants");
  }
  const container = document.getElementById("chants-par-categorie");
  container.innerHTML = "";

  CATEGORIES.forEach(cat => {
    const chantsCat = tousLesChants.filter(c => c.categorie === cat);
    if (chantsCat.length === 0) return;

    const bloc = document.createElement("div");
    bloc.className = "categorie-bloc";

    const header = document.createElement("div");
    header.className = "categorie-header";
    header.innerHTML = `
      <h4>${cat}</h4>
      <span class="tirage-controls">
        <input type="number" class="nb-a-tirer" data-cat="${cat}" min="0" max="${chantsCat.length}" value="1">
        <button type="button" class="btn-tirer" data-cat="${cat}">🎲 Tirer</button>
      </span>
    `;
    bloc.appendChild(header);

    chantsCat.forEach(chant => {
      const row = document.createElement("div");
      row.className = "chant-checkbox";
      const checked = seanceActive.chantsIds.includes(chant.id) ? "checked" : "";
      row.innerHTML = `
        <label>
          <input type="checkbox" value="${chant.id}" data-categorie="${cat}" data-usage="${chant.nbUtilisations || 0}" ${checked}>
          ${chant.titre} <span class="usage-badge" title="Nombre de fois utilisé dans les soirées passées">${chant.nbUtilisations || 0}×</span>
        </label>
        <button type="button" class="btn-shuffle" data-cat="${cat}" title="Proposer un autre chant à la place">🔀</button>
      `;
      bloc.appendChild(row);
    });

    container.appendChild(bloc);
  });

  container.querySelectorAll(".btn-tirer").forEach(btn => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.cat;
      const nInput = container.querySelector(`.nb-a-tirer[data-cat="${cssEscape_(cat)}"]`);
      tirerChantsAleatoires(cat, parseInt(nInput.value, 10) || 0);
    });
  });

  container.querySelectorAll(".btn-shuffle").forEach(btn => {
    btn.addEventListener("click", () => {
      const checkbox = btn.parentElement.querySelector("input[type=checkbox]");
      remplacerChant(btn.dataset.cat, checkbox);
    });
  });
}

document.getElementById("btn-tirer-tout").addEventListener("click", () => {
  document.querySelectorAll(".nb-a-tirer").forEach(input => {
    tirerChantsAleatoires(input.dataset.cat, parseInt(input.value, 10) || 0);
  });
});

/** Tire au sort `n` chants dans `categorie` (en favorisant les moins utilisés), remplaçant la sélection actuelle. */
function tirerChantsAleatoires(categorie, n) {
  const checkboxes = Array.from(
    document.querySelectorAll(`#chants-par-categorie input[type=checkbox][data-categorie="${cssEscape_(categorie)}"]`)
  );
  checkboxes.forEach(cb => (cb.checked = false));
  const poids = checkboxes.map(cb => poidsSelonUsage_(cb));
  tirageSansRemiseAvecPoids_(checkboxes, poids, n).forEach(cb => (cb.checked = true));
}

/** Décoche `checkbox` et coche à la place un autre chant (favorisant les moins utilisés) de la même catégorie. */
function remplacerChant(categorie, checkbox) {
  checkbox.checked = false;
  const candidats = Array.from(
    document.querySelectorAll(`#chants-par-categorie input[type=checkbox][data-categorie="${cssEscape_(categorie)}"]:not(:checked)`)
  );
  if (candidats.length === 0) {
    alert("Aucun autre chant disponible dans cette catégorie.");
    checkbox.checked = true;
    return;
  }
  const poids = candidats.map(cb => poidsSelonUsage_(cb));
  tirageSansRemiseAvecPoids_(candidats, poids, 1).forEach(cb => (cb.checked = true));
}

/** Plus un chant a été utilisé, plus son poids de tirage diminue (sans jamais tomber à zéro). */
function poidsSelonUsage_(checkbox) {
  const usage = parseInt(checkbox.dataset.usage, 10) || 0;
  return 1 / (usage + 1);
}

/** Tirage aléatoire sans remise, pondéré : plus le poids est élevé, plus l'élément a de chances de sortir tôt. */
function tirageSansRemiseAvecPoids_(items, poids, n) {
  const pool = items.map((item, i) => ({ item, poids: poids[i] }));
  const resultat = [];
  for (let k = 0; k < n && pool.length > 0; k++) {
    const total = pool.reduce((s, p) => s + p.poids, 0);
    let r = Math.random() * total;
    let idx = 0;
    for (; idx < pool.length - 1; idx++) {
      r -= pool[idx].poids;
      if (r <= 0) break;
    }
    resultat.push(pool.splice(idx, 1)[0].item);
  }
  return resultat;
}

function cssEscape_(str) {
  return window.CSS && CSS.escape ? CSS.escape(str) : str.replace(/([^\w-])/g, "\\$1");
}

document.getElementById("btn-sauver-seance").addEventListener("click", async () => {
  const chantsIds = Array.from(
    document.querySelectorAll("#chants-par-categorie input[type=checkbox]:checked")
  ).map(el => el.value);
  const notes = document.getElementById("seance-notes").value;

  try {
    await apiPost("modifierSeance", {
      id: seanceActive.id,
      chantsIds,
      notes,
      evangileRef: seanceActive.evangileRef,
      evangileTitre: seanceActive.evangileTitre,
      evangileTexte: seanceActive.evangileTexte
    });
    seanceActive.chantsIds = chantsIds;
    alert("Soirée enregistrée.");
  } catch (e) {
    alert("Erreur : " + e.message);
  }
});

document.getElementById("btn-export-priere").addEventListener("click", () => exporterLivret("genererLivretPriere"));
document.getElementById("btn-export-chants").addEventListener("click", () => exporterLivret("genererLivretChants"));

async function exporterLivret(action) {
  const zoneLiens = document.getElementById("export-liens");
  zoneLiens.textContent = "Génération du PDF en cours…";
  try {
    const { url } = await apiPost(action, { seanceId: seanceActive.id });
    const lien = document.createElement("a");
    lien.href = url;
    lien.target = "_blank";
    lien.textContent = "📎 Télécharger le PDF généré";
    zoneLiens.innerHTML = "";
    zoneLiens.appendChild(lien);
  } catch (e) {
    zoneLiens.textContent = "Erreur : " + e.message;
  }
}

// ---- Référentiel des chants -----------------------------------------------

document.getElementById("btn-ajouter-chant").addEventListener("click", async () => {
  const titre = document.getElementById("nouveau-titre").value;
  const categorie = document.getElementById("nouveau-categorie").value;
  const source = document.getElementById("nouveau-source").value;
  const paroles = document.getElementById("nouveau-paroles").value;
  if (!titre) return alert("Merci de renseigner un titre.");

  try {
    await apiPost("ajouterChant", { titre, categorie, source, paroles });
    document.getElementById("nouveau-titre").value = "";
    document.getElementById("nouveau-source").value = "";
    document.getElementById("nouveau-paroles").value = "";
    tousLesChants = []; // force le rechargement
    await chargerReferentielChants();
  } catch (e) {
    alert("Erreur : " + e.message);
  }
});

async function chargerReferentielChants() {
  tousLesChants = await apiGet("listerChants");
  afficherListeChants(tousLesChants);
}

function afficherListeChants(chants) {
  const container = document.getElementById("liste-chants");
  container.innerHTML = "";
  chants.forEach(chant => {
    const div = document.createElement("div");
    div.className = "chant-item";
    div.innerHTML = `
      <h4>${chant.titre}</h4>
      <div class="meta">${chant.categorie}${chant.source ? " · " + chant.source : ""} · utilisé ${chant.nbUtilisations || 0} fois</div>
    `;
    container.appendChild(div);
  });
}

document.getElementById("recherche-chants").addEventListener("input", e => {
  const q = e.target.value.toLowerCase();
  afficherListeChants(tousLesChants.filter(c => c.titre.toLowerCase().includes(q)));
});

// ---- Historique -----------------------------------------------------------

async function chargerHistorique() {
  const seances = await apiGet("listerSeances");
  const container = document.getElementById("liste-seances");
  container.innerHTML = "";
  seances.forEach(s => {
    const div = document.createElement("div");
    div.className = "chant-item";
    div.innerHTML = `
      <h4>${s.date}</h4>
      <div class="meta">${s.chantsIds.length} chant(s) sélectionné(s) · ${s.statut}</div>
    `;
    container.appendChild(div);
  });
}
