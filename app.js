// ⚠️ À remplacer par l'URL /exec de votre déploiement Apps Script (voir README.md)
const API_URL = "https://script.google.com/macros/s/AKfycbxCXS7U0JpkNw40dZOrJamHMEsf1W2hH0pc4veQUOEI-QeGn76iSMZFXKdAbcr1cufE/exec";

const CATEGORIES = ["Louange", "Méditation", "Esprit-Saint", "Marie"];

let seanceActive = null;
let tousLesChants = [];

// ---- Livret de prière (texte fixe, affiché à l'écran) --------------------

const LIVRET_PRIERE = [
  {
    titre: "1) Prière d'introduction",
    texte: `Seigneur Jésus, par l'intercession de Louis et Zélie, nous nous confions à Toi ce soir et nous nous remettons entre Tes mains. Détourne-nous de tout ce qui pourrait en cet instant nous séparer de Toi, Seigneur. Puisse chacun de nous, mieux découvrir de quel amour tu nous aimes !

Seigneur, nous voulons devenir tes amis. Aide-nous à T'ouvrir maintenant la porte de notre vie, et tout particulièrement la porte de notre cœur. Viens prendre TA place, la place d'un Roi qui s'est donné pour nous sauver. Aide-nous dans tous les détails de nos vies comme dans les grandes décisions que nous avons parfois à prendre !

Seigneur, nous te confions toutes nos inquiétudes, toutes nos préoccupations du moment, toutes les croix, petites ou grandes, que nous portons peut-être depuis des années.

(Ici on fait une pause, chacun présente au Seigneur dans le silence de son cœur ce qu'il a en tête).

Merci pour la place que tu viens de faire dans notre cœur pour que nous puissions accueillir ton Esprit-Saint.`
  },
  {
    titre: "2) Prière à l'Esprit-Saint",
    texte: `Viens Seigneur Esprit-Saint ! Viens visiter chacun des recoins de notre cœur, particulièrement ceux que nous voulons garder fermés et dont nous estimons qu'ils ne te concernent pas. Viens habiter nos pensées, nos prières, notre louange. Sois l'inspirateur, la source de cette soirée.

Donne-nous un Esprit de charité et d'amour les uns pour les autres, donne-nous un cœur qui accueille et écoute comme TOI tu nous accueilles et comme TOI tu nous écoutes en ce moment même ! Viens nous inspirer, nous renouveler avec force, puissance et douceur. Amen.

(Nous pouvons prendre un ou plusieurs chants à l'Esprit-Saint.)`
  },
  {
    titre: "3) Prière de demande de pardon",
    texte: `Seigneur, Tu nous connais, c'est Toi qui nous as créés. Tu connais l'étroitesse de nos cœurs, nous Te demandons pardon pour le mal que nous avons commis et ses répercussions pour notre couple, notre famille et nos enfants.

Tu es celui qui dit au bon larron « Ce soir tu seras avec moi au paradis ». Tu ne juges pas. Tu ne condamnes pas. Tu n'accuses pas, tu accueilles, tu pardonnes, tu nous aimes tant ! Tu es là, ce soir, pour nous libérer de ce qui nous détourne du bonheur, de la paix, de la joie.

Nous te rendons grâce et te remercions de n'être qu'Amour et Miséricorde.

(Nous demandons pardon à tour de rôle à voix haute en terminant par « Amen », ou simplement dans notre cœur et, dans ce cas, nous disons simplement « Amen ».)`
  },
  {
    titre: "4) Lecture de la Bible",
    texte: `Nous pouvons prier l'Esprit-Saint et ouvrir la Bible pour en lire un passage, ou prendre l'évangile du jour (voir l'onglet dédié). Chacun peut, s'il le souhaite, souligner telle ou telle phrase qui l'a interpellé. Sinon, nous restons en silence et méditons quelques minutes.`
  },
  {
    titre: "5) Prière pour notre couple",
    texte: `Par le sacrement du mariage, Seigneur, nous qui nous sommes reçus comme époux et épouse, nous voulons nous promettre à nouveau aujourd'hui de rester fidèles dans le bonheur et dans les épreuves, dans la santé et dans la maladie, pour nous aimer tous les jours de notre vie.

Si nous sommes séparés de notre conjoint ou qu'il est déjà auprès de Toi, viens nous garder unis dans ton amour pour que nous puissions un jour, ensemble, te louer éternellement.

Sois le ciment de notre couple, et le terreau de notre amour, pour lui donner la largeur, la hauteur, la profondeur de TON amour. Aide-nous à te mettre à la PREMIÈRE place, notamment en vivant l'Eucharistie et les sacrements aussi souvent que possible.

Que notre couple soit signe de Ta présence pour le monde. Renouvelle le regard que nous posons sur notre conjoint, donne-nous de nous révéler l'un à l'autre nos talents et nos qualités. Qu'il n'y ait pas entre nous de place pour la rancune, les mesquineries ou le mépris.

Nous te donnons nos cœurs, nos âmes et nos corps, viens faire l'unité en nous. Veille sur notre santé pour que nous puissions être des témoins de la Vie et de Ton amour jusqu'à la dernière seconde de notre vie sur terre. Que notre couple soit ouvert à la fécondité que tu veux lui donner pour ta Gloire.`
  },
  {
    titre: "6) Prière pour notre travail",
    texte: `Quelle que soit notre situation professionnelle actuelle, Seigneur, aide-nous à faire notre travail en le recevant comme une mission que TU nous confies. Reste à nos côtés dans chacune des tâches que nous avons à accomplir au fil de nos journées.

Aide-nous à te présenter chaque jour tout ce que nous avons à faire, afin que tu passes devant nous et que tu nous prépares le chemin. Aide-nous à faire jour après jour notre travail de manière consciencieuse, en recherchant la vérité et la justice. Quels que soient nos emplois du temps, que tu sois toujours le premier servi.

Nous confions à Ta Providence nos agendas, toutes les personnes avec lesquelles nous travaillons, tous nos projets, toutes nos difficultés. Ne laisse pas l'orgueil nous envahir, certains que c'est d'abord de TOI que naissent tous nos succès. Donne-nous un cœur de louange, les bons comme les mauvais jours. Que par notre travail nous fassions fructifier les talents que tu nous as donnés !

Saint Joseph, nous te confions tous les pères de famille, particulièrement ceux qui cherchent un travail pour subvenir aux besoins de la famille que tu leur as confiée. Sois leur modèle en tout et leur guide.`
  },
  {
    titre: "7) Prière pour les familles du monde",
    texte: `Seigneur, donne-nous un cœur ouvert aux autres, particulièrement aux plus pauvres, aux plus fragiles. Montre-nous les « pauvres » que tu veux nous confier. Viens nous inspirer pour être le « bon samaritain » sur leur route. Donne-nous une audace et un cœur missionnaires pour T'annoncer dans le monde. Donne-nous un cœur qui déborde de charité !

Nous Te confions tous ceux qui se préparent au mariage, aide-les à mesurer la beauté de cet engagement. Nous Te confions tous les couples qui se déchirent, tous les couples qui connaissent le chômage, la maladie ou le handicap, tous les couples qui ont perdu un enfant (né ou à naître), tous les couples qui sont frappés par l'alcool, la violence, la drogue, toutes les familles qui connaissent le martyre dans le monde à cause de leur Foi…

(Ici, nous nommons les uns après les autres les prénoms des couples en difficulté que nous connaissons, et finissons par « Amen » - si l'un de nous ne souhaite pas s'exprimer, il dira simplement « Amen », signifiant ainsi que nous pouvons poursuivre la prière.)

Seigneur, viens à leur rencontre, viens les bénir, les prendre sous Ta tendre protection, pour qu'ils trouvent en Toi le réconfort, la force et l'Espérance.`
  },
  {
    titre: "8) Prière pour avoir le désir d'aller au Ciel - et donc de devenir saint !",
    texte: `Seigneur, donne-nous de désirer aller au Ciel et donc… devenir des saints ! Fais grandir en nous ce désir, ou peut-être simplement fais-le naître. Change nos cœurs pour que nous t'aimions aujourd'hui plus qu'hier, et demain plus encore qu'aujourd'hui, et qu'au jour de notre mort notre cœur soit à la dimension de Ton amour !

Nous qui nous préoccupons si souvent de la réussite matérielle ou professionnelle, donne-nous de voir plus loin, plus haut, plus grand ! Si nous avons des enfants, guide les choix que nous faisons pour eux. Éclaire notre intelligence et notre cœur pour que nous puissions les conduire chaque jour, par le témoignage de nos vies, vers le Ciel !

Donne-nous un cœur qui sache reconnaître les traits de Ton visage dans notre conjoint et dans chacun de nos enfants. Donne-nous un cœur plein de patience, un cœur disponible pour notre conjoint et chacun de nos enfants (particulièrement ceux que nous trouvons les plus difficiles), afin que nous donnions à chacun un témoignage de Ton amour.

Seigneur, ouvre nos cœurs à la vie telle qu'elle veut se donner dans notre couple. Dimensionne nos cœurs à l'amour que tu veux nous donner, pour que nous vivions dès ici-bas dans la JOIE, la joie du Ciel !

Permets qu'en accomplissant notre mission conjugale et familiale avec l'incroyable force du sacrement du mariage, nous nous aidions l'un l'autre à devenir des saints, comme l'ont fait Louis et Zélie qui te louent désormais.`
  },
  {
    titre: "9) Prière de louange / action de grâce",
    texte: `(Nous pouvons prendre des chants de louange - c'est-à-dire de remerciement à Dieu pour ce qu'Il est - puis chacun exprime à voix haute plusieurs motifs d'action de grâce et finit par « Amen ». Si le groupe a du mal à exprimer des motifs de louange, nous pouvons lire la prière ci-après.)

Seigneur, nous voulons Te louer pour la manne que tu nous donnes chaque jour. Si Tu venais une seule seconde à ne plus nous aimer : nous mourrions ! Merci Seigneur pour Ton amour, pour ce que nous sommes chacun, pour nos talents, pour les dons que Tu nous as donnés et que nous n'avons peut-être pas encore tous découverts.

Nous Te louons et te rendons grâce pour notre conjoint, pour ses qualités qui sont pour nous une source d'émerveillement, et pour ses défauts qui nous font grandir dans la patience. Nous Te louons pour les enfants que tu nous as peut-être confiés et qui ne sont peut-être pas tels que nous les avions imaginés ou rêvés. Nous te louons pour le désir que Tu mets dans notre cœur d'accueillir la vie, viens habiter cette attente de Ta présence.

Nous Te remercions pour la vie, pour notre vie, quelle qu'elle soit ! Nous te louons car nous sommes irremplaçables, nous sommes uniques, personne ne sera jamais ce que nous sommes ! Nous te louons car Tu nous as sauvés, car nous sommes faits pour vivre éternellement !

Nous Te louons pour la joie et la grâce que Tu nous donnes chaque jour, comme Tu donnais la manne aux Hébreux dans le désert. Nous Te louons car notre cœur est fait pour cela !`
  },
  {
    titre: "10) Prière d'intercession - confier notre couple au Christ par les mains de Louis et Zélie",
    texte: `Seigneur, Tu es là, maintenant, au milieu de nous. Tu nous as montré par la vie de Saints Louis et Zélie Martin, les parents de Sainte Thérèse, combien Tu as été présent dans le quotidien de leur vie, et particulièrement dans les tempêtes qu'ils ont traversées. Tu n'étais pas un étranger, ni un Dieu lointain, mais Tu étais le pilier de leur famille. Tu es un père qui s'occupe avec une infinie bienveillance de ses enfants.

C'est avec la confiance des petits enfants que nous venons devant Toi Te confier notre couple, nos enfants, nos projets et les intentions que nous portons.

(Nous pouvons prendre un chant méditatif, par exemple « En toi, j'ai mis ma confiance ». Puis chaque couple peut s'agenouiller à tour de rôle devant la Croix de Jésus et déposer un petit papier rond portant les prénoms du couple, et un pour chaque enfant. On dira par exemple : « Seigneur, nous [prénoms], nous nous confions à Toi… nous te confions nos enfants [prénoms] et tout particulièrement [une intention] » - puis le couple revient s'asseoir pendant qu'un chant méditatif accompagne le passage du couple suivant, jusqu'à ce que tous aient déposé leur famille devant la Croix du Christ.)`
  },
  {
    titre: "11) Prière à Marie",
    texte: `Marie, notre maman du Ciel, nous te prenons comme maîtresse de maison de notre famille. Tu es là devant nous, accueille-nous tous sous ton manteau, protège-nous de tout mal et conduis-nous vers ton Fils !

(Nous pouvons prendre un chant à Marie.)

Nous finissons par un Notre Père et un Gloire au Père chantés, et l'invocation suivante :

« Louis et Zélie, merci de nous avoir ouvert la voie de la sainteté en couple et en famille. Aidez-nous à guider nos enfants sur le chemin de la vie qui conduit au Ciel, et tenez-nous par la main pour qu'encordés avec vous nous marchions à votre suite, vers le Christ, et soyons des lumières pour le monde. » Amen.

Sainte Thérèse de l'Enfant Jésus, priez pour nous.
Notre Dame des Victoires, priez pour nous.`
  }
];

function rendreLivret() {
  const container = document.getElementById("livret-contenu");
  container.innerHTML = "";
  LIVRET_PRIERE.forEach(section => {
    const bloc = document.createElement("div");
    bloc.className = "livret-section";
    const h3 = document.createElement("h3");
    h3.textContent = section.titre;
    bloc.appendChild(h3);
    section.texte.split("\n\n").forEach(paragraphe => {
      const estRubrique = paragraphe.trim().startsWith("(");
      const p = document.createElement("p");
      p.className = estRubrique ? "rubrique" : "livret-texte";
      p.textContent = paragraphe.trim();
      bloc.appendChild(p);
    });
    container.appendChild(bloc);
  });
}

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
    if (btn.dataset.tab === "livret" && !document.getElementById("livret-contenu").childElementCount) rendreLivret();
    if (btn.dataset.tab === "evangile") chargerEvangileOnglet();
  });
});

// ---- Onglet Évangile du jour (indépendant) --------------------------------

document.getElementById("evangile-date").valueAsDate = new Date();
document.getElementById("btn-actualiser-evangile").addEventListener("click", chargerEvangileOnglet);

async function chargerEvangileOnglet() {
  const dateInput = document.getElementById("evangile-date");
  if (!dateInput.value) dateInput.valueAsDate = new Date();
  const box = document.getElementById("evangile-jour-contenu");
  box.textContent = "Chargement…";
  try {
    const evangile = await apiGet("obtenirEvangileDuJour", { date: dateInput.value });
    box.innerHTML = `<strong>${evangile.titre}</strong> (${evangile.ref})\n\n${evangile.texte}`;
  } catch (e) {
    box.textContent = "Évangile indisponible (" + e.message + ").";
  }
}

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
  await afficherChoixChants();
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
    await apiPost("modifierSeance", { id: seanceActive.id, chantsIds, notes });
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

const dialogAjoutChant = document.getElementById("dialog-ajouter-chant");

document.getElementById("btn-ouvrir-ajout-chant").addEventListener("click", () => {
  dialogAjoutChant.showModal();
});
document.getElementById("btn-annuler-ajout-chant").addEventListener("click", () => {
  dialogAjoutChant.close();
});

document.getElementById("btn-ajouter-chant").addEventListener("click", async () => {
  const titre = document.getElementById("nouveau-titre").value;
  const categorie = document.getElementById("nouveau-categorie").value;
  const source = document.getElementById("nouveau-source").value;
  const paroles = document.getElementById("nouveau-paroles").value;
  const lien = document.getElementById("nouveau-lien").value;
  const fichierPartition = document.getElementById("nouveau-partition").files[0];
  if (!titre) return alert("Merci de renseigner un titre.");

  const btn = document.getElementById("btn-ajouter-chant");
  btn.disabled = true;
  try {
    const { id } = await apiPost("ajouterChant", { titre, categorie, source, paroles, lien });

    if (fichierPartition) {
      const fileBase64 = await lireFichierEnBase64_(fichierPartition);
      await apiPost("televerserPartition", {
        chantId: id,
        fileBase64,
        fileName: fichierPartition.name,
        mimeType: fichierPartition.type
      });
    }

    ["nouveau-titre", "nouveau-source", "nouveau-paroles", "nouveau-lien"].forEach(
      idChamp => (document.getElementById(idChamp).value = "")
    );
    document.getElementById("nouveau-partition").value = "";
    dialogAjoutChant.close();
    tousLesChants = []; // force le rechargement
    await chargerReferentielChants();
  } catch (e) {
    alert("Erreur : " + e.message);
  } finally {
    btn.disabled = false;
  }
});

/** Lit un fichier <input type=file> et renvoie son contenu en base64 (sans le préfixe data:...;base64,). */
function lireFichierEnBase64_(fichier) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(fichier);
  });
}

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

    const liens = [];
    if (chant.lien) liens.push(`<a href="${echapperHtml_(chant.lien)}" target="_blank">▶ Écouter</a>`);
    if (chant.partitionUrl) liens.push(`<a href="${echapperHtml_(chant.partitionUrl)}" target="_blank">🎼 Partition</a>`);

    div.innerHTML = `
      <h4>${echapperHtml_(chant.titre)}</h4>
      <div class="meta">${echapperHtml_(chant.categorie)}${chant.source ? " · " + echapperHtml_(chant.source) : ""} · utilisé ${chant.nbUtilisations || 0} fois</div>
      ${liens.length ? `<div class="chant-liens">${liens.join(" · ")}</div>` : ""}
      ${chant.paroles ? `
        <details class="chant-paroles">
          <summary>Voir les paroles</summary>
          <pre>${echapperHtml_(chant.paroles)}</pre>
        </details>
      ` : ""}
    `;
    container.appendChild(div);
  });
}

function echapperHtml_(texte) {
  const div = document.createElement("div");
  div.textContent = texte == null ? "" : String(texte);
  return div.innerHTML;
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
