/* ============================================================
   Magic Book V6.0 — Pack nouveautés 460
   1) Coûts d'entretien estimés (ajoutés à l'analyse)
   2) Mode acheteur : guide d'achat sans échange
   3) Consignation : Théo Récréo vend ta machine pour toi
   ============================================================ */
(function () {
'use strict';

/* ---------- Textes FR / EN ---------- */
var S = {
fr: {
  modeSell: "J'évalue ma machine",
  modeSellSub: "Vente ou échange",
  modeBuy: "Je magasine une machine",
  modeBuySub: "Guide d'achat, sans échange",
  ctaBuy: "Générer mon guide d'achat 🛒",
  maintTitle: "🔧 Coûts d'entretien estimés",
  maintPerYear: "/ an",
  maintNote: "Estimation indicative selon le type de machine et son âge. Les coûts réels varient selon l'utilisation, l'entretien antérieur et les tarifs en vigueur.",
  checklistTitle: "🧐 Points à vérifier avant d'acheter",
  checklistNote: "À inspecter (ou faire inspecter par un pro) avant de conclure l'achat.",
  consignKicker: "🤝 Vendre sans le trouble?",
  consignTitle: "Confie ta vente à Théo Récréo",
  consignText: "Tu ne veux pas t'occuper de vendre ta machine et éviter tous les désagréments? L'équipe des ventes de Théo Récréo se charge de tout pour une légère commission : on gère la vente, on peut même proposer du financement et de la garantie à l'acheteur — en plus d'ajouter l'expertise de notre équipe et de rassurer l'acheteur.",
  consignName: "Ton nom",
  consignPhone: "Ton téléphone",
  consignSms: "📱 Envoyer par texto",
  consignEmail: "✉️ Envoyer par courriel",
  consignHint: "Ta demande arrive directement à l'équipe des ventes, avec les détails de ta machine déjà remplis.",
  consignSend: "🤝 Confier ma vente",
  consignSending: "Envoi en cours…",
  consignSent: "✓ Transmis à l'équipe",
  consignNeedInfo: "Indique ton nom et ton téléphone.",
  consignOk: "Ta demande a bien été transmise à l'équipe des ventes.",
  consignFail: "Échec de l'envoi. Réessaie dans un moment."
},
en: {
  modeSell: "I'm evaluating my machine",
  modeSellSub: "Sale or trade-in",
  modeBuy: "I'm shopping for a machine",
  modeBuySub: "Buying guide, no trade-in",
  ctaBuy: "Generate my buying guide 🛒",
  maintTitle: "🔧 Estimated maintenance costs",
  maintPerYear: "/ yr",
  maintNote: "Indicative estimate based on vehicle type and age. Actual costs vary with usage, prior maintenance and current rates.",
  checklistTitle: "🧐 Things to check before buying",
  checklistNote: "Inspect (or have inspected by a pro) before closing the deal.",
  consignKicker: "🤝 Sell without the hassle?",
  consignTitle: "Let Théo Récréo sell it for you",
  consignText: "Don't want to deal with selling your machine yourself and avoid all the hassle? Théo Récréo's sales team handles everything for a small commission: we manage the sale, we can even offer financing and warranty to the buyer — plus our team's expertise to reassure them.",
  consignName: "Your name",
  consignPhone: "Your phone",
  consignSms: "📱 Send by text",
  consignEmail: "✉️ Send by email",
  consignHint: "Your request goes straight to the sales team, with your machine's details pre-filled.",
  consignSend: "🤝 Let them sell it",
  consignSending: "Sending…",
  consignSent: "✓ Sent to the team",
  consignNeedInfo: "Please enter your name and phone.",
  consignOk: "Your request has been sent to the sales team.",
  consignFail: "Send failed. Please try again in a moment."
}};

function L() { return (typeof lang !== 'undefined' && lang === 'en') ? 'en' : 'fr'; }
function tx(k) { return (S[L()] && S[L()][k]) || S.fr[k] || k; }

/* ---------- Détection du type de véhicule (même taxonomie que l'app) ---------- */
function v460type(marque, modele) {
  var b = String(marque || '').toLowerCase().trim();
  var m = ' ' + String(modele || '').toLowerCase() + ' ';
  if (/\b(ponton|pontoon|bowrider|deck boat|chaloupe|bateau)\b/.test(m)) return 'boat';
  if (/\b(waverunner|wave runner|jetblaster|jet blaster|superjet|gp1800|spark|gti|gtx|rxt|rxp|fish pro|wake pro|jet ski)\b/.test(m)) return 'pwc';
  if (/\b(sidewinder|srx|viper|phazer|apex|vector|nytro|rmk|switchback|indy|norseman|thundercat|riot|blast|pantera)\b/.test(m) || /\bzr\s?\d/.test(m)) return 'snow';
  if (/\b(grizzly|kodiak|raptor|wolverine|viking|yxz|rhino|sportsman|scrambler|ranger|rzr|general|outlaw|outlander|defender|maverick|commander|rancher|foreman|rubicon|rincon|talon|pioneer|brute force|teryx|mule|kingquad|alterra|prowler|wildcat)\b/.test(m) || /\b(yfz|trx|kfx|ltz)\d/.test(m)) return 'offroad';
  if (/\b(tenere|xsr|tracer|rebel|africa twin|gold wing|grom|ninja|versys|vulcan|eliminator|gsx|v-strom|hayabusa|boulevard|duke|adventure|exc|sx|xc|smr|spyder|ryker|sportster|softail)\b/.test(m) || /\b(yz|wr|mt|crf|cbr|cb|kx|klx)\s?-?\d/.test(m)) return 'moto';
  if (['princecraft','g3 boats','lund','crestliner','commere','sylvan','starcraft','bennington'].indexOf(b) >= 0) return 'boat';
  if (b === 'sea-doo') return 'pwc';
  if (b === 'ski-doo') return 'snow';
  if (['harley-davidson','bmw motorrad','ktm','husqvarna','gasgas'].indexOf(b) >= 0) return 'moto';
  if (b === 'can-am') return /\b(spyder|ryker)\b/.test(m) ? 'moto' : 'offroad';
  if (b === 'arctic cat') return /\b(alterra|prowler|wildcat)\b/.test(m) ? 'offroad' : 'snow';
  return 'unknown';
}

/* ---------- Coûts d'entretien indicatifs ($ CAD / an) ---------- */
var MAINT = {
  offroad: { min: 800, max: 1500,
    fr: ['Huile moteur + filtres', 'Courroie CVT', 'Pneus et freins', 'Batterie et graissage'],
    en: ['Engine oil + filters', 'CVT belt', 'Tires and brakes', 'Battery and greasing'] },
  snow: { min: 500, max: 1000,
    fr: ['Huile 2 temps + bougies', 'Chenille et glissières', 'Batterie et démarreur', "Courroie d'entraînement"],
    en: ['2-stroke oil + spark plugs', 'Track and sliders', 'Battery and starter', 'Drive belt'] },
  pwc: { min: 400, max: 850,
    fr: ['Huile + filtre', 'Hivernage / remisage', 'Batterie', 'Anneau d’usure et turbine'],
    en: ['Oil + filter', 'Winterization / storage', 'Battery', 'Wear ring and impeller'] },
  boat: { min: 700, max: 1500,
    fr: ['Huile de pied + moteur', 'Hivernage', 'Hélice et anode', 'Batterie et électricité'],
    en: ['Lower-unit + engine oil', 'Winterization', 'Propeller and anode', 'Battery and electrical'] },
  moto: { min: 500, max: 1000,
    fr: ['Pneus', 'Huile + filtre', 'Chaîne / courroie', 'Plaquettes de frein'],
    en: ['Tires', 'Oil + filter', 'Chain / belt', 'Brake pads'] },
  unknown: { min: 500, max: 1200,
    fr: ['Huile + filtres', 'Pneus / chenille', 'Batterie', 'Freins'],
    en: ['Oil + filters', 'Tires / track', 'Battery', 'Brakes'] }
};

function maintHTML(p) {
  var type = v460type(p.marque, p.modele);
  var m = MAINT[type] || MAINT.unknown;
  var year = parseInt(p.annee, 10);
  var age = isFinite(year) ? Math.max(0, new Date().getFullYear() - year) : 0;
  var factor = 1 + Math.min(Math.max(age - 5, 0), 10) * 0.04; /* +4 %/an après 5 ans, max +40 % */
  var lo = Math.round(m.min * factor / 50) * 50;
  var hi = Math.round(m.max * factor / 50) * 50;
  var items = (m[L()] || m.fr).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
  return '<div class="card maint"><h2>' + esc(tx('maintTitle')) + '</h2>' +
    '<div class="maint-range">' + esc(money(lo)) + ' – ' + esc(money(hi)) + ' ' + esc(tx('maintPerYear')) + '</div>' +
    '<ul class="maint-list">' + items + '</ul>' +
    '<p class="fine">' + esc(tx('maintNote')) + '</p></div>';
}

/* ---------- Points à vérifier avant d'acheter (mode acheteur) ---------- */
var CHECKS = {
  offroad: {
    fr: ['Cadre : fissures, soudures refaites, rouille perforante',
         'Cardans : soufflets déchirés, claquements en virage',
         'CVT : patinage de la courroie, odeur de brûlé',
         'Pneus : usure, flancs craquelés, jantes voilées',
         'Moteur : fuites, fumée au démarrage, factures d’entretien'],
    en: ['Frame: cracks, re-welds, perforating rust',
         'CV joints: torn boots, clicking when turning',
         'CVT: belt slipping, burnt smell',
         'Tires: wear, cracked sidewalls, bent rims',
         'Engine: leaks, smoke on startup, maintenance records'] },
  snow: {
    fr: ['Compression moteur (test à froid idéalement)',
         'Chenille : déchirures, crampons manquants, trous',
         'Glissières (sliders) : usure',
         'Suspension : amortisseurs qui fuient, ressorts affaissés',
         'Démarreur et batterie, rappels du fabricant'],
    en: ['Engine compression (cold test ideally)',
         'Track: tears, missing studs, holes',
         'Sliders: wear',
         'Suspension: leaking shocks, sagging springs',
         'Starter and battery, manufacturer recalls'] },
  pwc: {
    fr: ['Coque : fissures, réparations de fibre visibles',
         'Turbine et anneau d’usure : jeu excessif',
         'Compression des cylindres',
         'Preuve d’hivernage chaque année, heures moteur',
         'Remorque : roulements, treuil, lumières'],
    en: ['Hull: cracks, visible fiberglass repairs',
         'Impeller and wear ring: excessive play',
         'Cylinder compression',
         'Proof of yearly winterization, engine hours',
         'Trailer: bearings, winch, lights'] },
  boat: {
    fr: ['Coque et tableau arrière : fissures, bois mou',
         'Pied du moteur : huile laiteuse = infiltration d’eau',
         'Compression du hors-bord, démarrage à froid',
         'Plancher : zones molles (pourriture)',
         'Remorque : freins, roulements, structure'],
    en: ['Hull and transom: cracks, soft wood',
         'Lower unit: milky oil = water intrusion',
         'Outboard compression, cold start',
         'Floor: soft spots (rot)',
         'Trailer: brakes, bearings, frame'] },
  moto: {
    fr: ['Pneus : usure, date de fabrication, craquelures',
         'Fourche : fuites d’huile aux joints',
         'Chaîne / courroie : tension et usure',
         'Freins : plaquettes, disques voilés',
         'Traces de chute, historique d’entretien, NIV'],
    en: ['Tires: wear, date code, cracking',
         'Forks: oil leaking from seals',
         'Chain / belt: tension and wear',
         'Brakes: pads, warped rotors',
         'Crash damage, maintenance history, VIN'] },
  unknown: {
    fr: ['État général et corrosion',
         'Démarrage à froid, bruits anormaux',
         'Fuites de liquides',
         'Factures et historique d’entretien',
         'Essai routier avant de conclure'],
    en: ['Overall condition and corrosion',
         'Cold start, abnormal noises',
         'Fluid leaks',
         'Receipts and maintenance history',
         'Test ride before closing the deal'] }
};

function checklistHTML(p) {
  var type = v460type(p.marque, p.modele);
  var c = CHECKS[type] || CHECKS.unknown;
  var items = (c[L()] || c.fr).map(function (x) { return '<li>✅ ' + esc(x) + '</li>'; }).join('');
  return '<div class="card checklist"><h2>' + esc(tx('checklistTitle')) + '</h2>' +
    '<ul class="check-list">' + items + '</ul>' +
    '<p class="fine">' + esc(tx('checklistNote')) + '</p></div>';
}

/* ---------- Consignation Théo Récréo ---------- */
function consignHTML(p, data) {
  var v = vehicleName(p);
  var price = '';
  try { price = money(data.meta && data.meta.sale_strategy && data.meta.sale_strategy.average_sale); } catch (e) {}
  return '<div class="card consign">' +
    '<div class="contact-kicker">' + esc(tx('consignKicker')) + '</div>' +
    '<div class="contact-title">' + esc(tx('consignTitle')) + '</div>' +
    '<p>' + esc(tx('consignText')) + '</p>' +
    '<div class="consign-form">' +
      '<input id="consignName" type="text" autocomplete="name" placeholder="' + esc(tx('consignName')) + '">' +
      '<input id="consignPhone" type="tel" autocomplete="tel" placeholder="' + esc(tx('consignPhone')) + '">' +
      '<div class="consign-actions">' +
        '<button id="consignSend" class="action" type="button">' + esc(tx('consignSend')) + '</button>' +
      '</div>' +
      '<p id="consignMsg" class="fine" style="display:none"></p>' +
      '<p class="fine">' + esc(tx('consignHint')) + '</p>' +
    '</div></div>';
}

function wireConsign(p, data) {
  var nameEl = $('consignName'), phoneEl = $('consignPhone');
  var sendBtn = $('consignSend'), msgEl = $('consignMsg');
  if (!sendBtn) return;
  function showMsg(t, isErr) {
    if (!msgEl) return;
    msgEl.style.display = 'block';
    msgEl.style.color = isErr ? '#ff8a8a' : '';
    msgEl.textContent = t;
  }
  sendBtn.addEventListener('click', function () {
    var nm = nameEl ? nameEl.value.trim() : '';
    var ph = phoneEl ? phoneEl.value.trim() : '';
    if (!nm || !ph) { showMsg(tx('consignNeedInfo'), true); return; }
    var v = vehicleName(p);
    var price = '';
    try { price = money(data.meta && data.meta.sale_strategy && data.meta.sale_strategy.average_sale); } catch (e) {}
    var millage = ((p.millage_valeur || '') + ' ' + (p.millage_unite || '')).trim();
    sendBtn.disabled = true;
    var original = sendBtn.textContent;
    sendBtn.textContent = tx('consignSending');
    showMsg('', false); msgEl.style.display = 'none';
    fetch('/api/v6-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'consignation',
        clientName: nm,
        clientPhone: ph,
        category: v460type(p.marque, p.modele),
        brand: p.marque || '',
        model: p.modele || '',
        year: p.annee || '',
        mileageHours: millage,
        condition: p.condition || '',
        notes: (L() === 'fr' ? 'Demande de consignation — ' : 'Consignment request — ') +
          'Machine : ' + v + '. ' +
          (price ? (L() === 'fr' ? 'Évaluation Magic Book : ' + price + '.' : 'Magic Book estimate: ' + price + '.') : '')
      })
    }).then(function (r) {
      return r.json().then(function (j) { return { ok: r.ok && j && j.ok, err: j && j.error }; });
    }).then(function (res) {
      if (res.ok) {
        sendBtn.textContent = tx('consignSent');
        showMsg(tx('consignOk'), false);
      } else { throw new Error(res.err || 'send_failed'); }
    }).catch(function () {
      sendBtn.disabled = false;
      sendBtn.textContent = original;
      showMsg(tx('consignFail'), true);
    });
  });
}

/* ---------- Mode vendeur / acheteur ---------- */
var MODE_KEY = 'magicbook-mode-v460';
function getMode() { try { return localStorage.getItem(MODE_KEY) || 'sell'; } catch (e) { return 'sell'; } }
function setMode(m) {
  try { localStorage.setItem(MODE_KEY, m); } catch (e) {}
  refreshModeUI();
}

function injectModeToggle() {
  var form = $('form');
  if (!form || $('modeToggle')) return;
  var d = document.createElement('div');
  d.className = 'mode-toggle';
  d.id = 'modeToggle';
  d.innerHTML =
    '<label class="mode-card" data-mode="sell"><input type="radio" name="mbmode" value="sell"><b>🏷️ ' + esc(tx('modeSell')) + '</b><small>' + esc(tx('modeSellSub')) + '</small></label>' +
    '<label class="mode-card" data-mode="buy"><input type="radio" name="mbmode" value="buy"><b>🛒 ' + esc(tx('modeBuy')) + '</b><small>' + esc(tx('modeBuySub')) + '</small></label>';
  form.insertBefore(d, form.firstChild);
  d.querySelectorAll('input[name=mbmode]').forEach(function (r) {
    r.addEventListener('change', function () { setMode(r.value); });
  });
}

function refreshModeUI() {
  var mode = getMode();
  document.querySelectorAll('#modeToggle .mode-card').forEach(function (c) {
    var active = c.dataset.mode === mode;
    c.classList.toggle('active', active);
    var r = c.querySelector('input');
    if (r) r.checked = active;
  });
  var go = $('go');
  if (go) {
    if (mode === 'buy') {
      if (!go.dataset.origCta) go.dataset.origCta = go.textContent;
      go.textContent = tx('ctaBuy');
    } else if (go.dataset.origCta) {
      go.textContent = go.dataset.origCta;
    }
  }
}

/* Inclure le mode dans l'état du formulaire (utile pour l'historique) */
try {
  var baseFormState = formState;
  formState = function () { var p = baseFormState(); p.mode = getMode(); return p; };
  var baseFillForm = fillForm;
  fillForm = function (p) { baseFillForm(p); if (p && p.mode) setMode(p.mode === 'buy' ? 'buy' : 'sell'); };
} catch (e) { console.warn('v460 mode bridge', e); }

/* ---------- Enrichissement des résultats ---------- */
function v460augment(data, p) {
  var cards = document.querySelector('#cards');
  if (!cards || !data || !data.evaluation_ia) return;
  var mode = (p && p.mode) || getMode();

  /* 1) Coûts d'entretien juste après l'analyse (points forts/faibles) */
  var analysisCard = null;
  var pros = cards.querySelector('.proscons');
  if (pros) analysisCard = pros.closest('.card');
  var maintTmp = document.createElement('div');
  maintTmp.innerHTML = maintHTML(p);
  var maintCard = maintTmp.firstChild;
  if (analysisCard && maintCard) analysisCard.insertAdjacentElement('afterend', maintCard);
  else if (maintCard) cards.appendChild(maintCard);

  if (mode === 'buy') {
    /* 2) Mode acheteur : checklist + retrait des cartes vendeur */
    if (maintCard) {
      var chkTmp = document.createElement('div');
      chkTmp.innerHTML = checklistHTML(p);
      if (chkTmp.firstChild) maintCard.insertAdjacentElement('afterend', chkTmp.firstChild);
    }
    cards.querySelectorAll('.card.exchange, .card.social').forEach(function (el) { el.remove(); });
  } else {
    /* 3) Mode vendeur : carte consignation à la fin */
    var cTmp = document.createElement('div');
    cTmp.innerHTML = consignHTML(p, data);
    var cCard = cTmp.firstChild;
    if (cCard) { cards.appendChild(cCard); wireConsign(p, data); }
  }
}

try {
  var baseRender = render;
  render = function (data, p, save) {
    baseRender(data, p, save);
    try { v460augment(data, p); } catch (e) { console.warn('v460 augment', e); }
  };
  var baseApplyLanguage = applyLanguage;
  applyLanguage = function () { baseApplyLanguage(); try { injectModeToggle(); refreshModeUI(); } catch (e) {} };
} catch (e) { console.warn('v460 render bridge', e); }

/* ---------- Bouton "Passer l'intro" (seulement si l'app est installée) ----------
   L'intro v44 (v44-intro.js, chargée par premium-360.js) affiche une
   "sound gate" qui exige un toucher. Le bouton Passer n'apparaît que si
   l'app est installée (standalone) — à la première utilisation (navigateur),
   l'intro reste obligatoire. */
function v460isStandalone() {
  try {
    var cap = (window.Capacitor && window.Capacitor.getPlatform) ? window.Capacitor.getPlatform() : null;
    if (cap === 'android' || cap === 'ios') return true;
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }
  catch (e) { return false; }
}
function initIntroSkip() {
  if (!v460isStandalone()) return; /* intro obligatoire à la première utilisation */
  var done = false;
  function skipIntro() {
    var ov = document.getElementById('v44-studio-intro');
    var v = document.getElementById('v44-studio-video');
    if (v) { try { v.pause(); } catch (e) {} }
    if (ov) ov.remove();
    try { document.documentElement.classList.add('v44-first-use-ready'); } catch (e) {}
  }
  function tryInject() {
    if (done) return;
    var gate = document.getElementById('v44-sound-gate');
    if (!gate || document.getElementById('v460-intro-skip')) return;
    var btn = document.createElement('button');
    btn.id = 'v460-intro-skip';
    btn.type = 'button';
    btn.className = 'intro-skip';
    btn.textContent = (typeof lang !== 'undefined' && lang === 'en') ? '⏭ Skip intro' : '⏭ Passer l’intro';
    btn.addEventListener('click', function () { done = true; skipIntro(); });
    gate.appendChild(btn);
    done = true;
  }
  tryInject();
  try {
    var obs = new MutationObserver(function () { tryInject(); if (done) obs.disconnect(); });
    obs.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(function () { try { obs.disconnect(); } catch (e) {} }, 30000);
  } catch (e) {}
}

/* ---------- Init ---------- */
injectModeToggle();
refreshModeUI();
initIntroSkip();

})();
