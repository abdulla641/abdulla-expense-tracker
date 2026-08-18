const KEY='itdesk-v2-assets';
const cfg=window.ITDESK_SUPABASE||{};
const cloudReady=Boolean(cfg.url&&cfg.anonKey&&window.supabase);
const db=cloudReady?window.supabase.createClient(cfg.url,cfg.anonKey):null;
const state={assets:JSON.parse(localStorage.getItem(KEY)||'[]')};
const $=s=>document.querySelector(s),content=$('#content'),modal=$('#modal');
function saveLocal(){localStorage.setItem(KEY,JSON.stringify(state.assets))}
function esc(v=''){return String(v).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function daysTo(d){if(!d)return null;return Math.ceil((new Date(d)-new Date())/86400000)}
function setSync(text,good=false){$('#syncStatus').textContent=text;$('#userStatus').textContent=text;$('#userStatus').classList.toggle('good',good)}
async function loadAssets(){
  if(!db){setSync('Local mode');return}
  try{const {data,error}=await db.from('assets').select('*').order('created_at',{ascending:false});if(error)throw error;state.assets=(data||[]).map(a=>({...a,assetId:a.asset_id}));saveLocal();setSync('Cloud synced',true)}
  catch(e){console.error(e);setSync('Cloud error — local data kept')}
}
async function createAsset(asset){
  state.assets.unshift(asset);saveLocal();
  if(!db){setSync('Local mode');return}
  const row={id:asset.id,name:asset.name,type:asset.type,model:asset.model||'',asset_id:asset.assetId||'',serial:asset.serial||'',ip:asset.ip||'',location:asset.location||'',warranty:asset.warranty||null,notes:asset.notes||''};
  const {error}=await db.from('assets').insert(row);if(error){console.error(error);setSync('Cloud save failed — local copy kept')}else{setSync('Cloud synced',true)}
}
async function removeAsset(id){if(!confirm('Delete this asset?'))return;state.assets=state.assets.filter(a=>a.id!==id);saveLocal();if(db){const {error}=await db.from('assets').delete().eq('id',id);if(error){console.error(error);setSync('Cloud delete failed — local data kept')}}renderRows();dashboard()}
function dashboard(){const exp=state.assets.filter(a=>{const x=daysTo(a.warranty);return x!==null&&x<=60&&x>=0});content.innerHTML=`<div class="cards"><div class="card"><div class="label">TOTAL ASSETS</div><div class="value">${state.assets.length}</div><div class="sub">Tracked devices</div></div><div class="card"><div class="label">NETWORK</div><div class="value">${state.assets.filter(a=>['Firewall','Switch','Access Point'].includes(a.type)).length}</div><div class="sub">Core infrastructure</div></div><div class="card"><div class="label">SERVERS</div><div class="value">${state.assets.filter(a=>a.type==='Server').length}</div><div class="sub">Compute assets</div></div><div class="card"><div class="label">EXPIRING SOON</div><div class="value ${exp.length?'danger':''}">${exp.length}</div><div class="sub">Warranty within 60 days</div></div></div><div class="panel"><div class="panel-head"><h2>Recent assets</h2><button class="ghost" onclick="showPage('assets')">View all</button></div>${state.assets.length?`<div class="list">${state.assets.slice(0,5).map(a=>`<div class="row"><div><strong>${esc(a.name)}</strong><div class="muted">${esc(a.type)} · ${esc(a.location||'No location')}</div></div><span class="pill">${esc(a.assetId||'No ID')}</span></div>`).join('')}</div>`:'<div class="empty">No assets yet. Add your first device to start the IT inventory.</div>'}</div>`}
function assets(){content.innerHTML=`<div class="panel"><div class="panel-head"><h2>Asset inventory</h2><div class="toolbar"><input class="search" id="assetSearch" placeholder="Search name, asset ID, IP, serial..."></div></div><div class="table-wrap"><table class="table"><thead><tr><th>Asset</th><th>Type</th><th>Location</th><th>IP</th><th>Warranty</th><th></th></tr></thead><tbody id="assetRows"></tbody></table></div></div>`;renderRows();$('#assetSearch').oninput=renderRows}
function renderRows(){const q=($('#assetSearch')?.value||'').toLowerCase();const rows=state.assets.filter(a=>Object.values(a).join(' ').toLowerCase().includes(q));$('#assetRows').innerHTML=rows.length?rows.map(a=>`<tr><td><strong>${esc(a.name)}</strong><div class="muted">${esc(a.assetId||'')} ${a.model?'· '+esc(a.model):''}</div></td><td><span class="pill">${esc(a.type)}</span></td><td>${esc(a.location||'—')}</td><td>${esc(a.ip||'—')}</td><td>${a.warranty?esc(a.warranty):'—'}</td><td><button class="ghost" onclick="removeAsset('${a.id}')">Delete</button></td></tr>`).join(''):`<tr><td colspan="6"><div class="empty">No matching assets.</div></td></tr>`}
function simplePage(title,desc,items){content.innerHTML=`<div class="panel"><div class="panel-head"><div><h2>${title}</h2><div class="muted">${desc}</div></div></div><div class="empty">${items||'This module is prepared for V2.'}</div></div>`}
function network(){const n=state.assets.filter(a=>['Firewall','Switch','Access Point'].includes(a.type));simplePage('Network inventory','Firewall, switches and access points',n.length?`<div class="list">${n.map(a=>`<div class="row"><div><strong>${esc(a.name)}</strong><div class="muted">${esc(a.type)} · ${esc(a.location||'')}</div></div><span>${esc(a.ip||'No IP')}</span></div>`).join('')}</div>`:null)}
function maintenance(){simplePage('Maintenance','Service schedules and maintenance history','<strong>Ready for V2</strong><br><span class="muted">Tasks, due dates, technician, status and service history.</span>')}
function licenses(){simplePage('Licenses & Contracts','Track renewals, AMCs and vendor contracts','<strong>Ready for V2</strong><br><span class="muted">Expiry dates, vendors, renewal reminders and cost tracking.</span>')}
function incidents(){simplePage('Incidents','Track IT problems from open to resolved','<strong>Ready for V2</strong><br><span class="muted">Priority, assignment, status, resolution and history.</span>')}
function showPage(page){document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b.dataset.page===page));$('#pageTitle').textContent={dashboard:'Dashboard',assets:'Assets',network:'Network',maintenance:'Maintenance',licenses:'Licenses & Contracts',incidents:'Incidents'}[page];({dashboard,assets,network,maintenance,licenses,incidents}[page])();document.querySelector('.sidebar').classList.remove('open')}
function openModal(){modal.classList.remove('hidden');$('#assetForm').reset()}function closeModal(){modal.classList.add('hidden')}
$('#nav').onclick=e=>{const b=e.target.closest('button');if(b)showPage(b.dataset.page)};$('#quickAdd').onclick=openModal;$('#closeModal').onclick=closeModal;$('#cancelModal').onclick=closeModal;$('#menu').onclick=()=>document.querySelector('.sidebar').classList.toggle('open');
$('#assetForm').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);await createAsset({id:crypto.randomUUID(),name:f.get('name'),type:f.get('type'),model:f.get('model'),assetId:f.get('assetId'),serial:f.get('serial'),ip:f.get('ip'),location:f.get('location'),warranty:f.get('warranty'),notes:f.get('notes')});closeModal();showPage('assets')};
window.removeAsset=removeAsset;window.showPage=showPage;
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');
showPage('dashboard');loadAssets();
