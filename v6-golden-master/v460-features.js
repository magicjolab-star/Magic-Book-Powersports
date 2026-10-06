/* Magic Book V6.0 — modules additifs sur la référence V4.6 */
(function(){
'use strict';

var MODE_KEY='magicbook-v6-mode';
var INTRO_SEEN_KEY='magicbook-v6-intro-seen';

var V6_STYLE='.mb-v6-mode{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:0 0 16px}.mb-v6-mode-card{display:block;padding:13px;border:1px solid #ffffff1f;border-radius:12px;background:#020711;cursor:pointer}.mb-v6-mode-card input{display:none}.mb-v6-mode-card b{display:block;color:#fff}.mb-v6-mode-card small{display:block;margin-top:4px;color:#91a0b8}.mb-v6-mode-card.active{border-color:#e7c98c;box-shadow:0 0 18px #e7c98c33}.mb-v6-maint{border-left-color:#e7c98c}.mb-v6-maint-range{font:900 1.7rem ui-monospace,SFMono-Regular,Menlo,monospace;color:#e7c98c;margin:8px 0 10px}.mb-v6-list{margin:0;padding-left:22px}.mb-v6-list li{margin:7px 0;line-height:1.45}.mb-v6-check{border-left-color:#8b7cff}.mb-v6-check ul{list-style:none;padding-left:0}.mb-v6-consign{border-left-color:#e7c98c;background:linear-gradient(145deg,#15100a,#061a32)}.mb-v6-consign-title{font-size:1.55rem;font-weight:900;margin:8px 0 10px}.mb-v6-consign-team{color:#e7c98c;font-weight:800;line-height:1.6}.mb-v6-consign-form{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}.mb-v6-consign-form input{width:100%}.mb-v6-consign-form .full{grid-column:1/-1}.mb-v6-send{grid-column:1/-1}.mb-v6-send[disabled]{opacity:.65;cursor:wait}.mb-v6-ok{color:#00ff88;font-weight:800;margin-top:10px}.mb-v6-intro-skip{position:absolute;left:50%;bottom:24px;transform:translateX(-50%);z-index:50;min-width:230px;padding:13px 20px;border:1px solid #ffe49a;border-radius:999px;background:linear-gradient(90deg,#a77822,#f3dc8d,#b6842c);color:#07111b;font-weight:950;cursor:pointer;box-shadow:0 10px 32px #0009}@media(max-width:560px){.mb-v6-mode,.mb-v6-consign-form{grid-template-columns:1fr}.mb-v6-consign-form .full,.mb-v6-send{grid-column:1}}';
(function(){var st=document.createElement('style');st.id='magic-v6-additive-style';st.textContent=V6_STYLE;document.head.appendChild(st)})();

function el(id){return document.getElementById(id)}
function L(){return (typeof lang!=='undefined'&&lang==='en')?'en':'fr'}
function tr(fr,en){return L()==='en'?en:fr}
function s(v){return String(v==null?'':v)}
function h(v){return s(v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]})}
function getMode(){try{return localStorage.getItem(MODE_KEY)||'sell'}catch(e){return 'sell'}}
function setMode(v){try{localStorage.setItem(MODE_KEY,v)}catch(e){} refreshMode()}
function vehicleType(p){
  var x=(s(p&&p.marque)+' '+s(p&&p.modele)).toLowerCase();
  if(/waverunner|jetblaster|sea-doo|jet ski|gp1800|fx svho|vx/.test(x))return 'pwc';
  if(/ponton|pontoon|bateau|boat|g3|legend|princecraft|lund|crestliner|suncatcher/.test(x))return 'boat';
  if(/motoneige|snowmobile|ski-doo|sidewinder|srx|viper|thundercat|riot|blast|rmk|indy/.test(x))return 'snow';
  if(/moto|motorcycle|yz|wr|mt-|mt |tenere|tracer|xsr|r1|r6|ninja|crf|cbr|ktm/.test(x))return 'moto';
  return 'offroad';
}

var MAINT={
  offroad:{min:800,max:1500,fr:['Huile moteur et filtres','Courroie CVT / embrayage','Pneus, freins et roulements','Graissage, batterie et fluides'],en:['Engine oil and filters','CVT belt / clutch','Tires, brakes and bearings','Greasing, battery and fluids']},
  snow:{min:500,max:1000,fr:['Huile / bougies','Courroie d’entraînement','Chenille et glissières','Batterie et suspension'],en:['Oil / spark plugs','Drive belt','Track and sliders','Battery and suspension']},
  pwc:{min:400,max:850,fr:['Huile et filtre','Hivernage / remisage','Batterie','Turbine et anneau d’usure'],en:['Oil and filter','Winterization / storage','Battery','Impeller and wear ring']},
  boat:{min:700,max:1500,fr:['Huile moteur et pied','Hivernage','Hélice / anodes','Batteries et électricité'],en:['Engine and lower-unit oil','Winterization','Propeller / anodes','Batteries and electrical']},
  moto:{min:500,max:1000,fr:['Huile et filtre','Pneus','Chaîne / courroie','Freins et batterie'],en:['Oil and filter','Tires','Chain / belt','Brakes and battery']}
};

var CHECKS={
  offroad:{fr:['Cadre, soudures et corrosion','Cardans, roulements et soufflets','CVT : patinage, odeur et courroie','Pneus, freins et jantes','Fuites, fumée et historique d’entretien'],en:['Frame, welds and corrosion','CV joints, bearings and boots','CVT: slipping, smell and belt','Tires, brakes and wheels','Leaks, smoke and service history']},
  snow:{fr:['Compression moteur à froid','Chenille, crampons et glissières','Courroie et embrayages','Suspension et amortisseurs','Démarreur, batterie et rappels'],en:['Cold engine compression','Track, studs and sliders','Belt and clutches','Suspension and shocks','Starter, battery and recalls']},
  pwc:{fr:['Coque et réparations visibles','Turbine et anneau d’usure','Compression moteur','Heures et preuve d’hivernage','Remorque et roulements'],en:['Hull and visible repairs','Impeller and wear ring','Engine compression','Hours and winterization proof','Trailer and bearings']},
  boat:{fr:['Coque et tableau arrière','Huile du pied / infiltration d’eau','Compression et démarrage à froid','Plancher et structure','Remorque, freins et roulements'],en:['Hull and transom','Lower-unit oil / water intrusion','Compression and cold start','Floor and structure','Trailer, brakes and bearings']},
  moto:{fr:['Pneus et date de fabrication','Fourche et joints','Chaîne / courroie','Freins et disques','Traces de chute, NIV et entretien'],en:['Tires and date code','Fork and seals','Chain / belt','Brakes and rotors','Crash signs, VIN and maintenance']}
};

function maintenanceHTML(p){
  var type=vehicleType(p),m=MAINT[type]||MAINT.offroad,year=parseInt(p&&p.annee,10);
  var age=isFinite(year)?Math.max(0,new Date().getFullYear()-year):0;
  var factor=1+Math.min(Math.max(age-5,0),10)*0.04;
  var lo=Math.round(m.min*factor/50)*50,hi=Math.round(m.max*factor/50)*50;
  var items=(m[L()]||m.fr).map(function(x){return '<li>'+h(x)+'</li>'}).join('');
  return '<div class="card mb-v6-maint"><h2>🔧 '+tr("Coûts d’entretien estimés","Estimated maintenance costs")+'</h2><div class="mb-v6-maint-range">'+money(lo)+' – '+money(hi)+' / '+tr('an','yr')+'</div><ul class="mb-v6-list">'+items+'</ul><p class="fine">'+tr("Estimation indicative selon le type de machine et son âge.","Indicative estimate based on vehicle type and age.")+'</p></div>';
}

function checklistHTML(p){
  var type=vehicleType(p),a=CHECKS[type]||CHECKS.offroad;
  return '<div class="card mb-v6-check"><h2>🧐 '+tr("Points à vérifier avant d’acheter","Things to check before buying")+'</h2><ul class="mb-v6-list">'+(a[L()]||a.fr).map(function(x){return '<li>✅ '+h(x)+'</li>'}).join('')+'</ul></div>';
}

function injectMode(){
  var form=el('form');
  if(!form||el('mbV6Mode'))return;
  var d=document.createElement('div');
  d.id='mbV6Mode';
  d.className='mb-v6-mode';
  d.innerHTML='<label class="mb-v6-mode-card" data-v="sell"><input type="radio" name="mbv6mode" value="sell"><b>🏷️ '+tr("J’évalue ma machine","I’m evaluating my machine")+'</b><small>'+tr("Vente ou échange","Sale or trade-in")+'</small></label><label class="mb-v6-mode-card" data-v="buy"><input type="radio" name="mbv6mode" value="buy"><b>🛒 '+tr("Je magasine une machine","I’m shopping for a machine")+'</b><small>'+tr("Guide d’achat, sans échange","Buying guide, no trade-in")+'</small></label>';
  form.insertBefore(d,form.firstChild);
  d.querySelectorAll('input[name=mbv6mode]').forEach(function(r){r.addEventListener('change',function(){setMode(r.value)})});
  refreshMode();
}

function refreshMode(){
  var m=getMode();
  document.querySelectorAll('#mbV6Mode .mb-v6-mode-card').forEach(function(c){
    var active=c.dataset.v===m;
    c.classList.toggle('active',active);
    var r=c.querySelector('input'); if(r)r.checked=active;
  });
  var go=el('go');
  if(go){
    if(!go.dataset.mbOrig)go.dataset.mbOrig=go.textContent;
    go.textContent=m==='buy'?tr("Générer mon guide d’achat 🛒","Generate my buying guide 🛒"):go.dataset.mbOrig;
  }
}

function consignHTML(p,data){
  var v=vehicleName(p),price='';
  try{price=money(data.meta&&data.meta.sale_strategy&&data.meta.sale_strategy.average_sale)}catch(e){}
  return '<div class="card mb-v6-consign"><div class="contact-kicker">🤝 '+tr("Vendre sans le trouble?","Sell without the hassle?")+'</div><div class="mb-v6-consign-title">'+tr("Confie ta vente à Théo Récréo","Let Théo Récréo sell it for you")+'</div><p>'+tr("On prend en charge la mise en marché, les appels et le financement possible de l’acheteur. Tu gardes le contrôle, on s’occupe du reste.","We handle the listing, calls and potential buyer financing. You stay in control; we handle the rest.")+'</p><div class="mb-v6-consign-team">Jonathan — 819-616-2202<br>Jeff — 819-660-0365<br>Théo Récréo — 819-623-9445</div><div class="mb-v6-consign-form"><input id="mbConsignName" placeholder="'+tr('Ton nom','Your name')+'"><input id="mbConsignPhone" type="tel" placeholder="'+tr('Ton téléphone','Your phone')+'"><input id="mbConsignEmail" class="full" type="email" placeholder="'+tr('Ton courriel (optionnel)','Your email (optional)')+'"><button id="mbConsignSend" class="action mb-v6-send" type="button">'+tr("Confier ma vente","Send my consignment request")+'</button></div><div id="mbConsignStatus" class="mb-v6-ok" aria-live="polite"></div><p class="fine">'+h(v)+(price?' · '+price:'')+'</p></div>';
}

function wireConsign(p,data){
  var b=el('mbConsignSend'); if(!b)return;
  b.addEventListener('click',async function(){
    var status=el('mbConsignStatus');
    var name=el('mbConsignName').value.trim();
    var phone=el('mbConsignPhone').value.trim();
    var email=el('mbConsignEmail').value.trim();
    if(!name||!phone){status.textContent=tr('Entre ton nom et ton téléphone.','Enter your name and phone number.');return}
    var avg='';
    try{avg=money(data.meta&&data.meta.sale_strategy&&data.meta.sale_strategy.average_sale)}catch(e){}
    b.disabled=true; b.textContent=tr('Transmission…','Sending…'); status.textContent='';
    var payload={
      source:'consignation',
      clientName:name,
      clientPhone:phone,
      clientEmail:email,
      category:vehicleType(p),
      brand:p.marque||'',
      model:p.modele||'',
      year:p.annee||'',
      mileageHours:(p.millage_valeur||'')+' '+(p.millage_unite||''),
      condition:p.condition||'',
      notes:(p.autres_accessoires||'')+(avg?(' | Évaluation Magic Book: '+avg):''),
      vehicle:vehicleName(p)
    };
    try{
      var r=await fetch('/api/v6-lead',{method:'POST',headers:{'Content-Type':'application/json'},cache:'no-store',body:JSON.stringify(payload)});
      if(!r.ok)throw new Error('HTTP '+r.status);
      b.textContent=tr("✓ Transmis à l’équipe","✓ Sent to the team");
      status.textContent=tr("L’équipe de Théo Récréo a reçu ta demande.","Théo Récréo’s team received your request.");
    }catch(e){
      b.disabled=false;
      b.textContent=tr("Réessayer l’envoi","Retry");
      status.textContent=tr("Envoi impossible pour le moment.","Unable to send right now.");
    }
  });
}

function augment(data,p){
  var cards=el('cards'); if(!cards||!data||!data.evaluation_ia)return;
  cards.querySelectorAll('.mb-v6-maint,.mb-v6-check,.mb-v6-consign').forEach(function(n){n.remove()});
  var analysis=cards.querySelector('.proscons');
  analysis=analysis&&analysis.closest('.card');
  var wrap=document.createElement('div');
  wrap.innerHTML=maintenanceHTML(p);
  var maint=wrap.firstElementChild;
  if(analysis)analysis.insertAdjacentElement('afterend',maint); else cards.appendChild(maint);

  if(getMode()==='buy'){
    var q=document.createElement('div');
    q.innerHTML=checklistHTML(p);
    maint.insertAdjacentElement('afterend',q.firstElementChild);
    cards.querySelectorAll('.exchange,.social').forEach(function(n){n.remove()});
  }else{
    var c=document.createElement('div');
    c.innerHTML=consignHTML(p,data);
    var card=c.firstElementChild;
    cards.appendChild(card);
    wireConsign(p,data);
  }
}

function patchApp(){
  if(typeof formState==='function'){
    var fs=formState;
    formState=function(){var p=fs();p.mode=getMode();return p};
  }
  if(typeof fillForm==='function'){
    var ff=fillForm;
    fillForm=function(p){ff(p);if(p&&p.mode)setMode(p.mode==='buy'?'buy':'sell');refreshMode()};
  }
  if(typeof render==='function'){
    var rr=render;
    render=function(data,p,save){rr(data,p,save);try{augment(data,p)}catch(e){console.warn('[MagicBook V6]',e)}};
  }
  if(typeof applyLanguage==='function'){
    var al=applyLanguage;
    applyLanguage=function(){al();injectMode();refreshMode()};
  }
}

function isInstalledNativeOrReturning(){
  try{
    var platform=window.Capacitor&&window.Capacitor.getPlatform&&window.Capacitor.getPlatform();
    if(platform==='android'||platform==='ios')return true;
  }catch(e){}
  try{
    if(window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true)return true;
  }catch(e){}
  try{return localStorage.getItem(INTRO_SEEN_KEY)==='1'}catch(e){return false}
}
function markIntroSeen(){try{localStorage.setItem(INTRO_SEEN_KEY,'1')}catch(e){}}
function closeIntro(){
  var legacy=el('magic-studio-intro'),legacyVideo=el('magic-studio-intro-video');
  var v44=el('v44-studio-intro'),v44Video=el('v44-studio-video');
  try{if(legacyVideo)legacyVideo.pause()}catch(e){}
  try{if(v44Video)v44Video.pause()}catch(e){}
  if(v44)v44.remove();
  if(legacy){legacy.classList.add('fade-out');setTimeout(function(){legacy.style.display='none'},250)}
  markIntroSeen();
}
function bindSeen(video){
  if(!video||video.dataset.mbSeenBound)return;
  video.dataset.mbSeenBound='1';
  video.addEventListener('ended',markIntroSeen,{once:true});
}
function injectSkip(){
  if(!isInstalledNativeOrReturning())return;
  var host=el('v44-sound-gate')||el('magic-studio-intro');
  if(!host||el('mbV6IntroSkip'))return;
  var b=document.createElement('button');
  b.id='mbV6IntroSkip';
  b.type='button';
  b.className='mb-v6-intro-skip';
  b.textContent=tr("Passer à l’application ✨","Skip to the app ✨");
  b.addEventListener('click',closeIntro);
  host.appendChild(b);
}
function initIntro(){
  bindSeen(el('magic-studio-intro-video'));
  bindSeen(el('v44-studio-video'));
  injectSkip();
  var obs=new MutationObserver(function(){
    bindSeen(el('v44-studio-video'));
    injectSkip();
  });
  obs.observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(function(){try{obs.disconnect()}catch(e){}},30000);
}

patchApp();
injectMode();
refreshMode();
initIntro();
})();