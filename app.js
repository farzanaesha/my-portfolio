// ── HELPERS ──────────────────────────────────────────
function op(id){document.getElementById(id).classList.add('on');}
function cl(id){document.getElementById(id).classList.remove('on');}
function ge(id){return document.getElementById(id);}

function toast(title,sub,head){
  const c=ge('toast-container');
  const id='t'+Date.now();
  const d=document.createElement('div');
  d.className='tst';d.id=id;
  d.innerHTML=`<div class="tst-h">${head||'SAVED'}</div><div class="tst-t">${title}</div><div class="tst-s">${sub||''}</div><button class="tst-c" onclick="this.parentElement.remove()">✕</button>`;
  c.appendChild(d);
  setTimeout(()=>{const el=ge(id);if(el)el.remove();},5000);
}

function escX(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

// ── NAVIGATION ────────────────────────────────────────
function nav(btn){
  const id=btn.dataset.page;
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('on'));
  document.querySelectorAll('.nb').forEach(b=>b.classList.remove('on'));
  ge('page-'+id).classList.add('on');
  btn.classList.add('on');
  if(id==='portfolio')renderProjects();
  if(id==='planner'){renderCal();renderTasks();}
  if(id==='about')updateHero();
  if(id==='research'){resPath=null;resViewing=null;renderRes();}
}

// ── ABOUT / HERO ─────────────────────────────────────
let hero=JSON.parse(localStorage.getItem('hero')||'{}');
function updateHero(){
  const n=hero.name||'';const pts=n.split(' ');
  ge('hname').innerHTML=pts.length>1?`${pts[0]}<br><span class="it">${pts.slice(1).join(' ')}</span>`:(n||'Your<br><span class="it">Name Here</span>');
  if(hero.bio)ge('hbio').textContent=hero.bio;
  if(hero.email)ge('hemail').href='mailto:'+hero.email;
  if(hero.exp)ge('hexp').textContent=hero.exp;
  if(hero.clients)ge('hclients').textContent=hero.clients;
  if(hero.skills)ge('hskills').innerHTML=hero.skills.split(',').map(s=>`<span class="stag">${s.trim()}</span>`).join('');
  ge('hprojects').textContent=projects.length;
}
function openHeroEdit(){
  ge('mn').value=hero.name||'';ge('mb').value=hero.bio||'';
  ge('me').value=hero.email||'';ge('mx').value=hero.exp||'';
  ge('mk').value=hero.clients||'';ge('ms').value=hero.skills||'JavaScript, React, Python, CSS, Git';
  op('m-hero');
}
function saveHero(){
  hero={name:ge('mn').value,bio:ge('mb').value,email:ge('me').value,exp:ge('mx').value,clients:ge('mk').value,skills:ge('ms').value};
  localStorage.setItem('hero',JSON.stringify(hero));
  updateHero();cl('m-hero');
}

// ── PORTFOLIO ─────────────────────────────────────────
let projects=JSON.parse(localStorage.getItem('projects')||'[]');
let editPid=null;
function openAddProject(){
  editPid=null;ge('mptitle').textContent='Add Project';
  ['pt','pca','py','pd','pte','pl3','pg2'].forEach(id=>ge(id).value='');
  op('m-proj');
}
function editProject(id,e){
  e.stopPropagation();editPid=id;
  const p=projects.find(x=>x.id===id);
  ge('mptitle').textContent='Edit Project';
  ge('pt').value=p.title||'';ge('pca').value=p.cat||'';ge('py').value=p.year||'';
  ge('pd').value=p.desc||'';ge('pte').value=p.tech||'';ge('pl3').value=p.live||'';ge('pg2').value=p.github||'';
  op('m-proj');
}
function saveProject(){
  const title=ge('pt').value.trim();if(!title){alert('Title required');return;}
  const p={id:editPid||Date.now(),title,cat:ge('pca').value.trim(),year:ge('py').value.trim(),desc:ge('pd').value.trim(),tech:ge('pte').value.trim(),live:ge('pl3').value.trim(),github:ge('pg2').value.trim()};
  if(editPid){const i=projects.findIndex(x=>x.id===editPid);projects[i]=p;}else projects.unshift(p);
  localStorage.setItem('projects',JSON.stringify(projects));
  renderProjects();cl('m-proj');ge('hprojects').textContent=projects.length;
}
function deleteProject(id,e){
  e.stopPropagation();if(!confirm('Delete?'))return;
  projects=projects.filter(p=>p.id!==id);localStorage.setItem('projects',JSON.stringify(projects));
  renderProjects();ge('hprojects').textContent=projects.length;
}
function renderProjects(){
  const g=ge('proj-grid'),emp=ge('proj-empty');
  if(!projects.length){g.innerHTML='';g.appendChild(emp);emp.style.display='block';return;}
  g.innerHTML=projects.map(p=>`
    <div class="pc">
      <div class="cy">${p.year||''}</div>
      <div class="cc">${p.cat||'Project'}</div>
      <div class="ct">${p.title}</div>
      <div class="cd">${p.desc||'No description.'}</div>
      ${p.tech?`<div class="ctc">${p.tech.split(',').map(t=>`<span class="ttag">${t.trim()}</span>`).join('')}</div>`:''}
      <div class="cl2">
        ${p.live?`<a href="${p.live}" target="_blank">Live ↗</a>`:''}
        ${p.github?`<a href="${p.github}" target="_blank">GitHub ↗</a>`:''}
        <button onclick="editProject(${p.id},event)">Edit</button>
        <button onclick="deleteProject(${p.id},event)" style="color:#c00;border-color:#c00">Delete</button>
      </div>
    </div>`).join('');
}

// ── CALCULATOR ───────────────────────────────────────
let cex='',chist=[];
function ci(v){cex+=v;updC();}
function cc(){cex='';ge('cres').textContent='0';updC();}
function cd(){cex=cex.slice(0,-1);updC();}
function ceq(){
  try{
    const o=(cex.match(/\(/g)||[]).length,cl2=(cex.match(/\)/g)||[]).length;
    const expr=cex+')'.repeat(Math.max(0,o-cl2));
    const r=Function('"use strict";return('+expr+')')();
    const d=Number.isFinite(r)?+r.toFixed(10):'Error';
    chist.unshift({e:cex,r:d});if(chist.length>30)chist.pop();
    ge('cres').textContent=d;ge('cexpr').textContent=cex+' =';
    cex=String(d);renderHist();
  }catch(e){ge('cres').textContent='Error';cex='';}
}
function updC(){
  ge('cexpr').textContent=cex;
  try{
    const o=(cex.match(/\(/g)||[]).length,cl2=(cex.match(/\)/g)||[]).length;
    const r=Function('"use strict";return('+cex+')'.repeat(Math.max(0,o-cl2))+'')();
    if(Number.isFinite(r))ge('cres').textContent=+r.toFixed(10);
  }catch(e){}
}
function renderHist(){
  const b=ge('chb');
  if(!chist.length){b.innerHTML='<div class="es" style="padding:16px;font-size:10px">No calculations yet</div>';return;}
  b.innerHTML=chist.map(h=>`<div class="hi"><div class="hex">${h.e}</div><div class="hre">= ${h.r}</div></div>`).join('');
}
document.addEventListener('keydown',e=>{
  if(!ge('page-calc').classList.contains('on'))return;
  if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;
  if(e.key==='Enter')ceq();
  else if(e.key==='Backspace')cd();
  else if(e.key==='Escape')cc();
  else if('0123456789+-*/.%()'.includes(e.key))ci(e.key);
});

// ── FLOWCHART ────────────────────────────────────────
let fcN=[],fcC=[],selId=null,connMode=false,connFrom=null;
let doff={x:0,y:0},dragging=null,shQ=null,nCounter=0;

function fds(e,type){shQ=type;e.dataTransfer.effectAllowed='copy';}
function fdrop(e){
  e.preventDefault();
  const r=ge('fcw').getBoundingClientRect();
  if(shQ){addNode(shQ,e.clientX-r.left-50,e.clientY-r.top-20);shQ=null;}
}
function fcQ(type,label){
  const w=ge('fcw');
  addNode(type,60+Math.random()*(w.clientWidth-180),40+Math.random()*(w.clientHeight-120),label);
}
function addNode(type,x,y,label){
  const id=++nCounter;
  const labs={terminal:'Terminal',process:'Process',decision:'Decision?',io:'Input/Output',data:'Data Store',subprocess:'Sub-Process',predefined:'Predefined'};
  const sizes={terminal:{w:120,h:42},process:{w:120,h:42},decision:{w:130,h:76},io:{w:130,h:42},data:{w:120,h:42},subprocess:{w:130,h:42},predefined:{w:130,h:42}};
  const s=sizes[type]||{w:120,h:42};
  fcN.push({id,type,x,y,label:label||labs[type]||'Node',w:s.w,h:s.h});
  renderNode(fcN[fcN.length-1]);selectNode(id);
}
function renderNode(node){
  const ex=ge('fcn-'+node.id);if(ex)ex.remove();
  const el=document.createElement('div');
  el.className='fn '+node.type;el.id='fcn-'+node.id;
  el.style.left=node.x+'px';el.style.top=node.y+'px';
  el.style.width=node.w+'px';el.style.height=node.h+'px';
  el.style.minWidth=node.w+'px';el.style.minHeight=node.h+'px';
  el.innerHTML=`<span class="nl">${node.label}</span>`;
  el.addEventListener('mousedown',ev=>{if(!connMode)startDrag(ev,node.id);});
  el.addEventListener('click',ev=>{ev.stopPropagation();nodeClick(node.id);});
  el.addEventListener('dblclick',ev=>{ev.stopPropagation();renameNode(node.id);});
  ge('fcc').appendChild(el);
}
function startDrag(e,id){
  e.preventDefault();dragging=id;
  const n=fcN.find(x=>x.id===id);doff.x=e.clientX-n.x;doff.y=e.clientY-n.y;
  const mv=ev=>{
    if(!dragging)return;
    const nd=fcN.find(x=>x.id===dragging);
    nd.x=ev.clientX-doff.x;nd.y=ev.clientY-doff.y;
    const el=ge('fcn-'+dragging);if(el){el.style.left=nd.x+'px';el.style.top=nd.y+'px';}
    renderConns();
  };
  const up=()=>{dragging=null;document.removeEventListener('mousemove',mv);document.removeEventListener('mouseup',up);};
  document.addEventListener('mousemove',mv);document.addEventListener('mouseup',up);
}
function nodeClick(id){
  if(connMode){
    if(!connFrom){connFrom=id;ge('fcn-'+id).style.boxShadow='0 0 0 3px #000';}
    else if(connFrom!==id){fcC.push({from:connFrom,to:id});ge('fcn-'+connFrom).style.boxShadow='';connFrom=null;renderConns();}
    return;
  }
  selectNode(id);
}
function selectNode(id){
  document.querySelectorAll('.fn').forEach(el=>el.classList.remove('sel'));
  selId=id;ge('fcn-'+id)?.classList.add('sel');renderFcProps(id);
}
function fcClick(e){
  if(e.target===ge('fcc')||e.target.closest('svg')){
    selId=null;document.querySelectorAll('.fn').forEach(el=>el.classList.remove('sel'));
    ge('fprb').innerHTML='<div class="ph2">Select a node</div>';
    if(connMode&&connFrom){ge('fcn-'+connFrom).style.boxShadow='';connFrom=null;}
  }
}
function renameNode(id){
  const node=fcN.find(n=>n.id===id);const el=ge('fcn-'+id);
  const lbl=el.querySelector('.nl');const inp=document.createElement('input');
  inp.value=node.label;
  inp.style.cssText='background:transparent;border:none;outline:none;color:#000;font-family:Inter,sans-serif;font-size:12px;text-align:center;width:100%;font-weight:500';
  lbl.replaceWith(inp);inp.focus();inp.select();
  const done=()=>{
    node.label=inp.value||node.label;
    const s=document.createElement('span');s.className='nl';s.textContent=node.label;inp.replaceWith(s);renderFcProps(id);
  };
  inp.addEventListener('blur',done);
  inp.addEventListener('keydown',ev=>{if(ev.key==='Enter')done();ev.stopPropagation();});
}
function renderFcProps(id){
  const node=fcN.find(n=>n.id===id);if(!node)return;
  ge('fprb').innerHTML=`
    <div class="pg2"><label>Label</label><input type="text" value="${node.label.replace(/"/g,'&quot;')}" oninput="updNP(${id},'label',this.value)"></div>
    <div class="pg2"><label>Type</label>
      <select onchange="updNT(${id},this.value)">
        ${['terminal','process','decision','io','data','subprocess','predefined'].map(t=>`<option ${node.type===t?'selected':''}>${t}</option>`).join('')}
      </select>
    </div>
    <div class="pg2"><label>Width (px)</label><input type="number" value="${node.w}" min="60" max="400" oninput="updNP(${id},'w',+this.value)"></div>
    <div class="pg2"><label>Height (px)</label><input type="number" value="${node.h}" min="30" max="300" oninput="updNP(${id},'h',+this.value)"></div>
    <div class="pg2" style="margin-top:10px"><button onclick="fcDel()" style="width:100%;padding:6px;border:1px solid #c00;border-radius:2px;color:#c00;background:#fff;font-family:'JetBrains Mono',monospace;font-size:9px;cursor:pointer">Delete Node</button></div>`;
}
function updNP(id,prop,val){
  const node=fcN.find(n=>n.id===id);if(!node)return;node[prop]=val;
  const el=ge('fcn-'+id);if(!el)return;
  if(prop==='label'){const l=el.querySelector('.nl');if(l)l.textContent=val;}
  if(prop==='w'){el.style.width=val+'px';el.style.minWidth=val+'px';renderConns();}
  if(prop==='h'){el.style.height=val+'px';el.style.minHeight=val+'px';renderConns();}
}
function updNT(id,type){
  const node=fcN.find(n=>n.id===id);node.type=type;
  const sizes={terminal:{w:120,h:42},process:{w:120,h:42},decision:{w:130,h:76},io:{w:130,h:42},data:{w:120,h:42},subprocess:{w:130,h:42},predefined:{w:130,h:42}};
  const s=sizes[type]||{w:120,h:42};node.w=s.w;node.h=s.h;
  renderNode(node);selectNode(id);
}
function fcDel(){
  if(!selId)return;
  fcC=fcC.filter(c=>c.from!==selId&&c.to!==selId);
  ge('fcn-'+selId)?.remove();fcN=fcN.filter(n=>n.id!==selId);selId=null;
  renderConns();ge('fprb').innerHTML='<div class="ph2">Select a node</div>';
}
function clearCanvas(){
  if(!confirm('Clear all?'))return;
  fcN=[];fcC=[];selId=null;document.querySelectorAll('.fn').forEach(el=>el.remove());renderConns();
}
function toggleConn(){
  connMode=!connMode;connFrom=null;
  const btn=ge('connbtn');btn.classList.toggle('on',connMode);
  btn.innerHTML=connMode?'<i class="fa-solid fa-link-slash"></i> Cancel':'<i class="fa-solid fa-link"></i> Connect';
  ge('fcc').style.cursor=connMode?'crosshair':'default';
}

// STRAIGHT LINES — smart port selection
function renderConns(){
  const svg=ge('fsvg');svg.querySelectorAll('line').forEach(e=>e.remove());
  fcC.forEach(conn=>{
    const fn=fcN.find(n=>n.id===conn.from),tn=fcN.find(n=>n.id===conn.to);
    if(!fn||!tn)return;
    const fe=ge('fcn-'+fn.id),te=ge('fcn-'+tn.id);if(!fe||!te)return;
    const fw=fe.offsetWidth,fh=fe.offsetHeight,tw=te.offsetWidth,th=te.offsetHeight;
    const fcx=fn.x+fw/2,fcy=fn.y+fh/2,tcx=tn.x+tw/2,tcy=tn.y+th/2;
    const pf=[{x:fcx,y:fn.y},{x:fcx,y:fn.y+fh},{x:fn.x,y:fcy},{x:fn.x+fw,y:fcy}];
    const pt=[{x:tcx,y:tn.y},{x:tcx,y:tn.y+th},{x:tn.x,y:tcy},{x:tn.x+tw,y:tcy}];
    let best=Infinity,x1,y1,x2,y2;
    pf.forEach(a=>pt.forEach(b=>{const d=Math.hypot(a.x-b.x,a.y-b.y);if(d<best){best=d;x1=a.x;y1=a.y;x2=b.x;y2=b.y;}}));
    const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy);if(len<2)return;
    const off=10,ex2=x2-(dx/len)*off,ey2=y2-(dy/len)*off;
    const line=document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1',x1);line.setAttribute('y1',y1);
    line.setAttribute('x2',ex2);line.setAttribute('y2',ey2);
    line.setAttribute('stroke','#000');line.setAttribute('stroke-width',conn.thickness||1.5);
    line.setAttribute('marker-end','url(#arr)');svg.appendChild(line);
  });
}

function genXML(){
  let x=`<?xml version="1.0" encoding="UTF-8"?>\n<mxGraphModel><root>\n<mxCell id="0"/><mxCell id="1" parent="0"/>\n`;
  const sm={terminal:'rounded=1;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#000;fontColor=#000;',process:'rounded=0;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#000;fontColor=#000;',decision:'rhombus;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#000;fontColor=#000;',io:'parallelogram;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#000;fontColor=#000;',data:'rounded=0;dashed=1;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#000;fontColor=#000;',subprocess:'rounded=0;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#000;fontColor=#000;',predefined:'rounded=0;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#000;fontColor=#000;strokeWidth=3;'};
  fcN.forEach(n=>{x+=`<mxCell id="${n.id}" value="${escX(n.label)}" style="${sm[n.type]||sm.process}" vertex="1" parent="1"><mxGeometry x="${Math.round(n.x)}" y="${Math.round(n.y)}" width="${n.w}" height="${n.h}" as="geometry"/></mxCell>\n`;});
  fcC.forEach((c,i)=>{x+=`<mxCell id="e${i}" style="edgeStyle=orthogonalEdgeStyle;strokeColor=#000;" edge="1" source="${c.from}" target="${c.to}" parent="1"><mxGeometry relative="1" as="geometry"/></mxCell>\n`;});
  return x+'</root></mxGraphModel>';
}

function fcExportSVG(){
  if(!fcN.length){alert('Canvas is empty.');return;}
  let mx=Infinity,my=Infinity,maxX=0,maxY=0;
  fcN.forEach(n=>{mx=Math.min(mx,n.x);my=Math.min(my,n.y);maxX=Math.max(maxX,n.x+n.w);maxY=Math.max(maxY,n.y+n.h);});
  const pad=40,W=maxX-mx+pad*2,H=maxY-my+pad*2;
  let svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" style="background:#fff">`;
  svg+=`<defs><marker id="arr" markerWidth="7" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0,7 3,0 6" fill="#000"/></marker></defs>`;
  fcC.forEach(conn=>{
    const fn=fcN.find(n=>n.id===conn.from),tn=fcN.find(n=>n.id===conn.to);if(!fn||!tn)return;
    const x1=fn.x-mx+pad+fn.w/2,y1=fn.y-my+pad+fn.h/2;
    const x2=tn.x-mx+pad+tn.w/2,y2=tn.y-my+pad+tn.h/2;
    const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy);const off=10;
    const ex=x2-(dx/len)*off,ey=y2-(dy/len)*off;
    svg+=`<line x1="${x1}" y1="${y1}" x2="${ex}" y2="${ey}" stroke="#000" stroke-width="${conn.thickness||1.5}" marker-end="url(#arr)"/>`;
  });
  fcN.forEach(n=>{
    const x=n.x-mx+pad,y=n.y-my+pad,cx=x+n.w/2,cy=y+n.h/2;
    if(n.type==='terminal')svg+=`<rect x="${x}" y="${y}" width="${n.w}" height="${n.h}" rx="${n.h/2}" fill="none" stroke="#000" stroke-width="2"/>`;
    else if(n.type==='decision')svg+=`<polygon points="${cx},${y} ${x+n.w},${cy} ${cx},${y+n.h} ${x},${cy}" fill="none" stroke="#000" stroke-width="2"/>`;
    else if(n.type==='io')svg+=`<polygon points="${x+n.w*.12},${y} ${x+n.w},${y} ${x+n.w*.88},${y+n.h} ${x},${y+n.h}" fill="none" stroke="#000" stroke-width="2"/>`;
    else if(n.type==='data')svg+=`<rect x="${x}" y="${y}" width="${n.w}" height="${n.h}" fill="none" stroke="#000" stroke-width="2" stroke-dasharray="5,3"/>`;
    else svg+=`<rect x="${x}" y="${y}" width="${n.w}" height="${n.h}" fill="none" stroke="#000" stroke-width="2"/>`;
    svg+=`<text x="${cx}" y="${cy+4}" font-family="Inter,sans-serif" font-size="12" fill="#000" text-anchor="middle" font-weight="500">${escX(n.label)}</text>`;
  });
  svg+='</svg>';
  dl(new Blob([svg],{type:'image/svg+xml'}),'flowchart.svg');
}
function fcExportXML(){
  if(!fcN.length){alert('Canvas is empty.');return;}
  dl(new Blob([genXML()],{type:'application/xml'}),'flowchart.drawio');
}
function fcSaveRes(){
  if(!fcN.length){alert('Canvas is empty.');return;}
  popFolderSel('xrf');
  ge('xrn').value='Diagram '+new Date().toLocaleDateString('en-US',{month:'short',day:'numeric'});
  ge('xrno').value='';op('m-xres');
}
function confirmXmlRes(){
  const name=ge('xrn').value.trim()||'Untitled Diagram';
  resFiles.unshift({id:Date.now(),type:'xml',name,folderId:ge('xrf').value,notes:ge('xrno').value.trim(),xml:genXML(),nodeCount:fcN.length,connCount:fcC.length,date:new Date().toISOString()});
  saveResData();cl('m-xres');toast(name,'Saved to Research Files','DIAGRAM SAVED');
}
function dl(blob,fname){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=fname;a.click();}

// ── PLANNER ──────────────────────────────────────────
let tasks=JSON.parse(localStorage.getItem('tasks')||'[]');
let calM=new Date().getMonth(),calY=new Date().getFullYear();
let selDate=new Date().toISOString().split('T')[0];
let planView='day';
const MNS=['January','February','March','April','May','June','July','August','September','October','November','December'];

function renderCal(){
  ge('callbl').textContent=MNS[calM]+' '+calY;
  const g=ge('calgrid');
  const ds=['Su','Mo','Tu','We','Th','Fr','Sa'];
  g.innerHTML=ds.map(d=>`<div class="mcdl">${d}</div>`).join('');
  const first=new Date(calY,calM,1).getDay();
  const inM=new Date(calY,calM+1,0).getDate();
  const prev=new Date(calY,calM,0).getDate();
  const today=new Date().toISOString().split('T')[0];
  for(let i=first-1;i>=0;i--){
    const d=prev-i,date=new Date(calY,calM-1,d).toISOString().split('T')[0];
    g.innerHTML+=`<div class="mcd om ${date===selDate?'sel':''}" onclick="pickDate('${date}')">${d}</div>`;
  }
  for(let d=1;d<=inM;d++){
    const date=new Date(calY,calM,d).toISOString().split('T')[0];
    const ht=tasks.some(t=>t.date===date);
    g.innerHTML+=`<div class="mcd ${date===today?'tod':''} ${date===selDate&&date!==today?'sel':''} ${ht?'has':''}" onclick="pickDate('${date}')">${d}</div>`;
  }
}
function calNav(dir){calM+=dir;if(calM>11){calM=0;calY++;}if(calM<0){calM=11;calY--;}renderCal();}
function pickDate(d){
  selDate=d;ge('tdate').value=d;renderCal();
  if(planView==='day')renderTasks();
  const dt=new Date(d+'T00:00:00');
  ge('plandlbl').textContent=dt.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});
}
function planV(v,btn){
  planView=v;document.querySelectorAll('.ptb').forEach(b=>b.classList.remove('on'));btn.classList.add('on');renderTasks();
}
function addTask(){
  const title=ge('tt').value.trim();if(!title){alert('Enter a task title');return;}
  const t={id:Date.now(),title,time:ge('ttime').value,date:ge('tdate').value||selDate,priority:ge('tpri').value,desc:ge('tdesc').value.trim(),done:false,fired:false};
  tasks.unshift(t);localStorage.setItem('tasks',JSON.stringify(tasks));
  ge('tt').value='';ge('tdesc').value='';ge('ttime').value='';
  renderTasks();renderCal();
}
function toggleTask(id){const t=tasks.find(x=>x.id===id);if(t){t.done=!t.done;localStorage.setItem('tasks',JSON.stringify(tasks));renderTasks();}}
function delTask(id){tasks=tasks.filter(x=>x.id!==id);localStorage.setItem('tasks',JSON.stringify(tasks));renderTasks();renderCal();}
function renderTasks(){
  const body=ge('tasksbody');
  const today=new Date().toISOString().split('T')[0];
  let list=planView==='day'?tasks.filter(t=>t.date===selDate):planView==='done'?tasks.filter(t=>t.done):tasks;
  list=[...list].sort((a,b)=>{if(a.done!==b.done)return a.done?1:-1;if(a.time&&b.time)return a.time.localeCompare(b.time);return 0;});
  if(!list.length){body.innerHTML='<div class="es">No tasks here.</div>';return;}
  const dl=planView!=='day';
  body.innerHTML=list.map(t=>`
    <div class="ti ${t.done?'done':''} ${!t.done&&t.date<today?'overdue':''} ${t.priority}">
      <div class="tpb"></div>
      <button class="tch ${t.done?'chk':''}" onclick="toggleTask(${t.id})">${t.done?'✓':''}</button>
      <div class="tbd">
        <div class="tit">${t.title}</div>
        <div class="tme">
          ${t.time?`<span class="tml">⏰ ${t.time}</span>`:''}
          ${dl?`<span class="tml">📅 ${t.date}</span>`:''}
          <span class="tpr">${t.priority}</span>
          ${!t.done&&t.date<today?'<span class="tpr" style="color:#c00;border-color:#c00">overdue</span>':''}
        </div>
        ${t.desc?`<div style="font-size:10px;color:var(--tf);margin-top:3px;font-family:'JetBrains Mono',monospace">${t.desc}</div>`:''}
      </div>
      ${t.time?'<span class="rd">⏰</span>':''}
      <button class="tde" onclick="delTask(${t.id})"><i class="fa-solid fa-trash"></i></button>
    </div>`).join('');
}
function checkReminders(){
  const now=new Date(),today=now.toISOString().split('T')[0];
  const hm=now.getHours().toString().padStart(2,'0')+':'+now.getMinutes().toString().padStart(2,'0');
  tasks.forEach(t=>{
    if(!t.done&&!t.fired&&t.date===today&&t.time){
      const[th,tm]=t.time.split(':').map(Number),[nh,nm]=hm.split(':').map(Number);
      if(nh*60+nm>=th*60+tm-1&&nh*60+nm<=th*60+tm+1){
        t.fired=true;localStorage.setItem('tasks',JSON.stringify(tasks));
        toast(t.title,t.time+(t.desc?' · '+t.desc:''),'⏰ REMINDER');
        if('Notification' in window&&Notification.permission==='granted')new Notification('Reminder: '+t.title,{body:t.time});
      }
    }
  });
}
if('Notification' in window&&Notification.permission==='default')Notification.requestPermission();
setInterval(checkReminders,30000);checkReminders();

// ── RESEARCH ─────────────────────────────────────────
let resFolders=JSON.parse(localStorage.getItem('res_folders')||'[]');
let resFiles=JSON.parse(localStorage.getItem('res_files')||'[]');
let resPath=null,resViewing=null,editNoteId=null,upSrc='device',upFiles=[];

function saveResData(){localStorage.setItem('res_folders',JSON.stringify(resFolders));localStorage.setItem('res_files',JSON.stringify(resFiles));}

function popFolderSel(...ids){
  ids.forEach(id=>{
    const sel=ge(id);if(!sel)return;
    sel.innerHTML='<option value="__root__">Root</option>';
    resFolders.forEach(f=>{const o=document.createElement('option');o.value=f.id;o.textContent='📂 '+f.name;if(resPath&&resPath===f.id)o.selected=true;sel.appendChild(o);});
  });
}

function openFolderModal(){ge('fn2').value='';ge('fd2').value='';op('m-folder');}
function saveFolder(){
  const name=ge('fn2').value.trim();if(!name){alert('Enter a name');return;}
  resFolders.push({id:'f'+Date.now(),name,desc:ge('fd2').value.trim(),parentId:resPath||'__root__',date:new Date().toISOString()});
  saveResData();cl('m-folder');renderRes();
}

function openNoteModal(id){
  editNoteId=id||null;ge('mntitle').textContent=id?'Edit Note':'New Note';
  if(id){const f=resFiles.find(x=>x.id===id);ge('ntit').value=f.name||'';ge('ncon').value=f.content||'';ge('ntag').value=f.tags||'';}
  else{ge('ntit').value='';ge('ncon').value='';ge('ntag').value='';}
  popFolderSel('nfol');
  if(id){const f=resFiles.find(x=>x.id===id);ge('nfol').value=f.folderId||'__root__';}
  op('m-note');
}
function saveNote(){
  const title=ge('ntit').value.trim();if(!title){alert('Title required');return;}
  const note={id:editNoteId||Date.now(),type:'note',name:title,folderId:ge('nfol').value,content:ge('ncon').value,tags:ge('ntag').value,date:new Date().toISOString()};
  if(editNoteId){const i=resFiles.findIndex(f=>f.id===editNoteId);resFiles[i]=note;}else resFiles.unshift(note);
  saveResData();cl('m-note');renderRes();
}

function openUploadModal(){
  upFiles=[];ge('flist').innerHTML='';ge('drurl').value='';ge('drname').value='';ge('ghurl').value='';ge('ghname').value='';
  selSrc('device');popFolderSel('upfol');op('m-upload');
}
function selSrc(src){
  upSrc=src;['device','drive','github'].forEach(s=>{ge('usb-'+s).classList.toggle('sel',s===src);ge('up-'+s).style.display=s===src?'block':'none';});
}
function onFileInput(e){
  upFiles=[...e.target.files];
  ge('flist').innerHTML=upFiles.map(f=>`<div>📄 ${f.name} (${(f.size/1024).toFixed(1)} KB)</div>`).join('');
}
// drag-drop onto upload zone
(()=>{
  const dz=ge('dropzone');
  if(!dz)return;
  dz.addEventListener('dragover',e=>{e.preventDefault();dz.style.borderColor='#000';});
  dz.addEventListener('dragleave',()=>dz.style.borderColor='');
  dz.addEventListener('drop',e=>{
    e.preventDefault();dz.style.borderColor='';
    upFiles=[...e.dataTransfer.files];
    ge('flist').innerHTML=upFiles.map(f=>`<div>📄 ${f.name}</div>`).join('');
  });
})();

function confirmUpload(){
  const fid=ge('upfol').value||'__root__';
  if(upSrc==='device'){
    if(!upFiles.length){alert('No files selected');return;}
    let done=0;
    upFiles.forEach(file=>{
      const isImg = file.type.startsWith('image/');
      const isPdf = file.type==='application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      const reader=new FileReader();
      reader.onload=ev=>{
        resFiles.unshift({
          id: Date.now()+Math.random(),
          type: 'file',
          name: file.name,
          folderId: fid,
          content: ev.target.result,   // dataURL for images/PDFs, text for others
          fileType: file.type,
          size: file.size,
          highlights: [],
          date: new Date().toISOString()
        });
        done++;
        if(done===upFiles.length){saveResData();renderRes();cl('m-upload');toast('Imported '+done+' file(s)','From device','UPLOAD');}
      };
      if(isImg || isPdf) reader.readAsDataURL(file);   // preserve binary as base64
      else               reader.readAsText(file);
    });
  } else if(upSrc==='drive'){
    const url=ge('drurl').value.trim(),name=ge('drname').value.trim();
    if(!url||!name){alert('URL and name required');return;}
    resFiles.unshift({id:Date.now(),type:'link',name,folderId:fid,url,source:'Google Drive',highlights:[],date:new Date().toISOString()});
    saveResData();cl('m-upload');renderRes();toast(name,'Linked from Google Drive','IMPORT');
  } else {alert('Use "Fetch & Import" for GitHub.');}
}

async function fetchGH(){
  const url=ge('ghurl').value.trim(),name=ge('ghname').value.trim();
  if(!url||!name){alert('URL and name required');return;}
  const fid=ge('upfol').value||'__root__';
  try{
    const raw=url.includes('raw.githubusercontent.com')?url:url.replace('github.com','raw.githubusercontent.com').replace('/blob/','/')
    const resp=await fetch(raw);if(!resp.ok)throw new Error('HTTP '+resp.status);
    const text=await resp.text();
    resFiles.unshift({id:Date.now(),type:'file',name,folderId:fid,content:text,source:'GitHub',url:raw,date:new Date().toISOString()});
    saveResData();cl('m-upload');renderRes();toast(name,'Fetched from GitHub','IMPORT');
  }catch(e){alert('Failed: '+e.message+'\nMake sure it\'s a public raw file URL.');}
}

function renderRes(){
  const con=ge('rcontent'),bc=ge('rbc');
  const q=(ge('rsearch')?.value||'').toLowerCase();
  if(resPath){const f=resFolders.find(x=>x.id===resPath);bc.innerHTML=`<span onclick="resPath=null;resViewing=null;renderRes()">Root</span><span style="color:var(--tf);margin:0 4px">›</span><span>${f?f.name:''}</span>`;}
  else bc.innerHTML=`<span>Root</span>`;
  if(resViewing){renderFileView(resViewing,con);return;}
  const folders=resFolders.filter(f=>{const ip=resPath?f.parentId===resPath:(f.parentId==='__root__'||!f.parentId);return ip&&(!q||f.name.toLowerCase().includes(q));});
  const files=resFiles.filter(f=>{const ip=resPath?f.folderId===resPath:(f.folderId==='__root__'||!f.folderId);return ip&&(!q||f.name.toLowerCase().includes(q)||(f.tags&&f.tags.toLowerCase().includes(q)));});
  if(!folders.length&&!files.length){con.innerHTML='<div class="es">Empty. Create folders, notes, or upload files.</div>';return;}
  let html='<div class="rg">';
  folders.forEach(f=>{
    const fc=resFiles.filter(x=>x.folderId===f.id).length;
    html+=`<div class="rc" onclick="resPath='${f.id}';resViewing=null;renderRes()">
      <div class="rca"><button class="ra del" onclick="event.stopPropagation();delFolder('${f.id}')"><i class="fa-solid fa-trash"></i></button></div>
      <div class="rci">📂</div><div class="rcn">${f.name}</div>
      ${f.desc?`<div class="rcd">${f.desc}</div>`:''}
      <div class="rcm">${fc} file${fc!==1?'s':''} · ${fmtD(f.date)}</div>
    </div>`;
  });
  files.forEach(f=>{
    const icon=f.type==='xml'?'📊':f.type==='link'?'🔗':f.type==='paper'?'🔬':
               (f.fileType||'').includes('image')?'🖼️':
               (f.name||'').match(/\.pdf$/i)?'📄':'📝';
    const typeLbl=f.type==='xml'?'draw.io XML':f.type==='paper'?'Research Paper':(f.source||f.type);
    const tags=f.tags?f.tags.split(',').filter(Boolean).map(t=>`<span class="rtag">${t.trim()}</span>`).join(''):'';
    const canView=f.type!=='xml'&&f.type!=='link';
    const hlCount=(f.highlights||[]).length;
    html+=`<div class="rc" onclick="resViewing=${f.id};renderRes()">
      <div class="rca">
        ${f.type==='note'?`<button class="ra" onclick="event.stopPropagation();openNoteModal(${f.id})"><i class="fa-solid fa-pen"></i></button>`:''}
        ${canView?`<button class="ra" style="color:#111;border-color:#111" onclick="event.stopPropagation();showDocViewer(${f.id})"><i class="fa-solid fa-highlighter"></i></button>`:''}
        <button class="ra" onclick="event.stopPropagation();dlRes(${f.id})"><i class="fa-solid fa-download"></i></button>
        <button class="ra del" onclick="event.stopPropagation();delRes(${f.id})"><i class="fa-solid fa-trash"></i></button>
      </div>
      <div class="rci">${icon}</div>
      <span class="rtyp">${typeLbl}</span>
      <div class="rcn">${f.name}</div>
      ${f.type==='paper'?`<div class="rcm">${f.authors?f.authors.split(',')[0]+(f.year?' · '+f.year:''):''}${hlCount?' · '+hlCount+' hl':''}</div>`:''}
      ${f.type==='xml'?`<div class="rcm">${f.nodeCount} nodes · ${f.connCount} conns</div>`:''}
      ${hlCount&&f.type!=='paper'?`<div class="rcm" style="color:#b8860b;">✦ ${hlCount} highlight${hlCount!==1?'s':''}</div>`:''}
      ${f.type!=='paper'&&(f.notes||f.content)?`<div class="rcd">${((f.notes||f.content||'').slice(0,68))}${((f.notes||f.content||'').length>68?'…':'')}</div>`:''}
      ${tags?`<div class="rtags">${tags}</div>`:''}
      <div class="rcm">${fmtD(f.date)}</div>
    </div>`;
  });
  html+='</div>';con.innerHTML=html;
}

function renderFileView(id,con){
  const f=resFiles.find(x=>x.id===id);if(!f){resViewing=null;renderRes();return;}
  const tags=f.tags?f.tags.split(',').filter(Boolean).map(t=>`<span class="rtag">${t.trim()}</span>`).join(''):'';
  let body='';
  if(f.type==='xml') {
    body=`<div style="font-size:12px;color:var(--td);margin-bottom:10px">Open in draw.io by importing the downloaded file.</div><pre>${escX(f.xml)}</pre>`;
  } else if(f.type==='link') {
    body=`<div style="margin:10px 0"><a href="${f.url}" target="_blank" style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#000">${f.url}</a></div><p style="font-size:10px;color:var(--tf);font-family:'JetBrains Mono',monospace">Source: ${f.source}</p>`;
  } else if(f.type==='paper') {
    const hlSummary = (f.highlights||[]).length
      ? `<div style="margin-top:14px;padding:12px;background:#fffbea;border:1px solid #e8d800;border-radius:3px;">
          <div style="font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#888;margin-bottom:8px;">Highlights (${f.highlights.length})</div>
          ${f.highlights.map((h,i)=>`<div style="display:flex;gap:8px;align-items:flex-start;margin-bottom:6px;">
            <div style="width:16px;height:16px;background:${h.color};border-radius:2px;flex-shrink:0;margin-top:1px;"></div>
            <div><span style="font-family:'JetBrains Mono',monospace;font-size:9px;color:#aaa;">Page ${h.page}</span>${h.note?`<div style="font-size:12px;color:#333;margin-top:1px">${escX(h.note)}</div>`:''}</div>
          </div>`).join('')}
        </div>` : '';
    body=`<div class="rnv">${f.content||''}</div>${hlSummary}`;
  } else if(f.type==='note') {
    body=`<div class="rnv">${f.content||''}</div>`;
  } else {
    const isImg=(f.fileType||'').startsWith('image/')||(f.name||'').match(/\.(png|jpe?g|gif|webp|svg)$/i);
    const isPdf=(f.fileType||'')==='application/pdf'||(f.name||'').toLowerCase().endsWith('.pdf');
    if(isImg){
      body=`<div style="text-align:center;padding:10px 0"><img src="${f.content||f.url||''}" alt="${escX(f.name)}" style="max-width:100%;max-height:360px;object-fit:contain;border:1px solid #e0e0e0;border-radius:2px;"></div>`;
    } else if(isPdf){
      body=`<div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#666;padding:16px 0;">PDF file · ${f.size?(f.size/1024).toFixed(1)+' KB':'unknown size'} · Click "Open &amp; Highlight" to view and annotate.</div>`;
    } else {
      body=`<pre style="font-size:11px;line-height:1.6;white-space:pre-wrap;word-break:break-all;">${escX((f.content||'').slice(0,6000))}${(f.content||'').length>6000?'\n…truncated':''}</pre>`;
    }
  }
  // Highlight summary for ALL types
  const hlSum=(f.highlights||[]).length?`
    <div style="margin-top:14px;padding:12px;background:#fffbea;border:1px solid #e8d800;border-radius:3px;">
      <div style="font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#888;margin-bottom:8px;">Highlights (${(f.highlights||[]).length})</div>
      ${(f.highlights||[]).map(h=>`<div style="display:flex;gap:8px;align-items:flex-start;margin-bottom:5px;">
        <div style="width:14px;height:14px;min-width:14px;background:${h.color};border-radius:2px;margin-top:1px;"></div>
        <div><span style="font-family:'JetBrains Mono',monospace;font-size:9px;color:#aaa;">${h.lineStart!==undefined?'Lines '+(h.lineStart+1)+'–'+(h.lineEnd+1):'Page '+(h.page||1)}</span>
        ${h.note?`<div style="font-size:11px;color:#333;margin-top:1px;">${escX(h.note)}</div>`:''}</div>
      </div>`).join('')}
    </div>`:'';
  body += hlSum;
  con.innerHTML=`
    <button class="rbk" onclick="resViewing=null;renderRes()"><i class="fa-solid fa-arrow-left"></i> Back</button>
    <div class="rv">
      <h2>${f.name}</h2>
      <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--tf);margin-bottom:10px;display:flex;gap:10px;flex-wrap:wrap">
        ${f.type==='paper'?`<span>${f.authors||''}</span>${f.year?'<span>'+f.year+'</span>':''}${f.doi?`<span>DOI: ${f.doi}</span>`:''}`:``}
        <span>${fmtD(f.date)}</span>
        ${f.type==='xml'?`<span>${f.nodeCount} nodes · ${f.connCount} connections</span>`:''}
        ${f.source&&f.type!=='paper'?`<span>${f.source}</span>`:''}
      </div>
      ${tags?`<div class="rtags" style="margin-bottom:10px">${tags}</div>`:''}
      ${f.notes?`<div style="font-size:12px;color:var(--td);background:var(--s1);border:1px solid var(--b);border-radius:2px;padding:10px;margin-bottom:12px">${f.notes}</div>`:''}
      ${body}
      <div style="margin-top:16px;display:flex;gap:7px;flex-wrap:wrap">
        ${f.type!=='xml'&&f.type!=='link'?`<button class="bp" onclick="showDocViewer(${f.id})"><i class="fa-solid fa-highlighter"></i> Open &amp; Highlight</button>`:''}
        <button class="bs" onclick="dlRes(${f.id})"><i class="fa-solid fa-download"></i> Download</button>
        ${f.type==='note'?`<button class="bs" onclick="openNoteModal(${f.id})"><i class="fa-solid fa-pen"></i> Edit</button>`:''}
        ${f.type==='paper'&&f.doi?`<button class="bs" onclick="window.open('https://doi.org/${f.doi}','_blank')"><i class="fa-solid fa-link"></i> DOI</button>`:''}
      </div>
    </div>`;
}

function delFolder(id){if(!confirm('Delete folder and contents?'))return;resFolders=resFolders.filter(f=>f.id!==id);resFiles=resFiles.filter(f=>f.folderId!==id);saveResData();renderRes();}
function delRes(id){if(!confirm('Delete?'))return;resFiles=resFiles.filter(f=>f.id!==id);saveResData();resViewing=null;renderRes();}
function dlRes(id){
  const f=resFiles.find(x=>x.id===id);if(!f)return;
  if(f.type==='link'){window.open(f.url,'_blank');return;}
  const content=f.type==='xml'?f.xml:(f.content||'');
  const ext=f.type==='xml'?'.drawio':'.txt';
  dl(new Blob([content],{type:f.type==='xml'?'application/xml':'text/plain'}),f.name.replace(/[^a-z0-9.]/gi,'_')+ext);
}
function fmtD(iso){if(!iso)return'';return new Date(iso).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});}

// fix .ms2 modal save buttons styling
document.querySelectorAll('.ms2').forEach(el=>{
  Object.assign(el.style,{background:'#111',border:'none',borderRadius:'3px',padding:'7px 18px',color:'#fff',fontFamily:'Inter,sans-serif',fontSize:'12px',fontWeight:'500',cursor:'pointer'});
  el.onmouseenter=()=>el.style.opacity='.8';
  el.onmouseleave=()=>el.style.opacity='1';
});

// ── INIT ─────────────────────────────────────────────
function init(){
  updateHero(); renderProjects();
  const today=new Date().toISOString().split('T')[0];
  selDate=today; ge('tdate').value=today;
  ge('plandlbl').textContent=new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});
  renderCal(); renderTasks();
}
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ── PAPER SEARCH ─────────────────────────────────────────────────────────────
let paperResults = [];
let paperFilter  = 'all';
let currentPaperPdf = null; // { url, title, paper }

function openPaperSearch() {
  ge('paper-q').value = '';
  ge('paper-results').innerHTML = '<div style="font-family:\'JetBrains Mono\',monospace;font-size:11px;color:#aaa;text-align:center;padding:44px 0;">Enter a search term above and press Search</div>';
  ge('paper-count').textContent = '';
  paperResults = [];
  op('m-paper-search');
  setTimeout(() => ge('paper-q').focus(), 120);
}

function setPaperFilter(f, btn) {
  paperFilter = f;
  document.querySelectorAll('.ps-tab').forEach(t => t.classList.remove('on'));
  btn.classList.add('on');
  renderPaperResults();
}

async function fetchWithRetry(url, attempts=3) {
  for (let i = 0; i < attempts; i++) {
    try {
      const r = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (r.status === 429) {
        // Rate limited — wait 1.5s and retry
        await new Promise(res => setTimeout(res, 1500 * (i + 1)));
        continue;
      }
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return await r.json();
    } catch(e) {
      if (i === attempts - 1) throw e;
      await new Promise(res => setTimeout(res, 800));
    }
  }
}

async function searchPapers() {
  const q = ge('paper-q').value.trim();
  if (!q) return;
  const res = ge('paper-results');
  res.innerHTML = '<div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#aaa;text-align:center;padding:44px 0;"><i class="fa-solid fa-circle-notch fa-spin"></i>&nbsp; Searching…</div>';
  ge('paper-count').textContent = '';

  const isDOI = /^(doi:)?10\.\d{4,}\//.test(q.trim());

  // ── Try Semantic Scholar ──────────────────────────────────────────────────
  try {
    let url, data;
    if (isDOI) {
      const doi = q.replace(/^doi:/i,'').trim();
      url = `https://api.semanticscholar.org/graph/v1/paper/${encodeURIComponent(doi)}?fields=paperId,title,authors,year,abstract,openAccessPdf,externalIds,fieldsOfStudy,citationCount,isOpenAccess,url`;
      data = await fetchWithRetry(url);
      paperResults = data.paperId ? [data] : [];
    } else {
      url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(q)}&fields=paperId,title,authors,year,abstract,openAccessPdf,externalIds,fieldsOfStudy,citationCount,isOpenAccess,url&limit=20`;
      data = await fetchWithRetry(url);
      paperResults = data.data || [];
    }
    if (paperResults.length > 0) { renderPaperResults(); return; }
  } catch(e) { /* fall through to CrossRef */ }

  // ── Fallback: CrossRef (works reliably from browsers, no key needed) ──────
  res.innerHTML = '<div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#aaa;text-align:center;padding:44px 0;"><i class="fa-solid fa-circle-notch fa-spin"></i>&nbsp; Trying CrossRef…</div>';
  try {
    let crUrl;
    if (isDOI) {
      const doi = q.replace(/^doi:/i,'').trim();
      crUrl = `https://api.crossref.org/works/${encodeURIComponent(doi)}`;
      const d = await fetchWithRetry(crUrl);
      const w = d.message;
      paperResults = w ? [crossrefToItem(w)] : [];
    } else {
      crUrl = `https://api.crossref.org/works?query=${encodeURIComponent(q)}&rows=20&select=DOI,title,author,published,abstract,is-referenced-by-count,URL,link`;
      const d = await fetchWithRetry(crUrl);
      paperResults = (d.message?.items || []).map(crossrefToItem);
    }
    renderPaperResults();
  } catch(e2) {
    res.innerHTML = `<div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#c00;text-align:center;padding:44px 20px;">
      <i class="fa-solid fa-triangle-exclamation"></i>&nbsp; Search unavailable right now<br><br>
      <span style="color:#aaa;font-size:10px;">Both Semantic Scholar and CrossRef could not be reached.<br>Try again in a moment.</span>
      <br><br><button onclick="searchPapers()" style="background:#111;color:#fff;border:none;border-radius:3px;padding:6px 16px;font-family:'JetBrains Mono',monospace;font-size:10px;cursor:pointer;">Retry</button>
    </div>`;
  }
}

function crossrefToItem(w) {
  // Normalise a CrossRef work object to match our Semantic Scholar shape
  const authors = (w.author||[]).map(a => ({ name: [a.given,a.family].filter(Boolean).join(' ') }));
  const year    = w.published?.['date-parts']?.[0]?.[0] || null;
  const doi     = w.DOI || '';
  const title   = Array.isArray(w.title) ? w.title[0] : (w.title || 'Untitled');
  const abstract= w.abstract ? w.abstract.replace(/<[^>]+>/g,'') : '';
  // Find open-access PDF link from CrossRef links
  const pdfLink = (w.link||[]).find(l => l['content-type']==='application/pdf');
  return {
    paperId: doi,
    title, authors, year, abstract,
    isOpenAccess: !!pdfLink,
    openAccessPdf: pdfLink ? { url: pdfLink.URL } : null,
    externalIds: { DOI: doi },
    fieldsOfStudy: [],
    citationCount: w['is-referenced-by-count'] ?? null,
    url: w.URL || (doi ? 'https://doi.org/'+doi : ''),
    _source: 'crossref'
  };
}

function renderPaperResults() {
  const res = ge('paper-results');
  let list = paperResults;

  if (paperFilter === 'open') list = list.filter(p => p.isOpenAccess);
  if (paperFilter === 'pdf')  list = list.filter(p => p.openAccessPdf?.url);

  ge('paper-count').textContent = `${list.length} result${list.length !== 1 ? 's' : ''}`;

  if (!list.length) {
    res.innerHTML = '<div style="font-family:\'JetBrains Mono\',monospace;font-size:11px;color:#aaa;text-align:center;padding:44px 0;">No results found. Try a different query or filter.</div>';
    return;
  }

  res.innerHTML = list.map((p, i) => {
    const authors = (p.authors||[]).slice(0,4).map(a=>a.name).join(', ') + ((p.authors||[]).length > 4 ? ' et al.' : '');
    const doi     = p.externalIds?.DOI || '';
    const hasPdf  = !!p.openAccessPdf?.url;
    const fields  = (p.fieldsOfStudy||[]).slice(0,3).map(f=>`<span class="pr-badge">${f}</span>`).join('');

    return `<div class="pr-card">
      <div class="pr-title">${escX(p.title||'Untitled')}</div>
      <div class="pr-authors">${escX(authors)||'Unknown authors'} ${p.year ? '· '+p.year : ''}</div>
      <div class="pr-meta">
        ${p.isOpenAccess ? '<span class="pr-badge open">Open Access</span>' : '<span class="pr-badge">Closed Access</span>'}
        ${hasPdf ? '<span class="pr-badge pdf">📄 PDF Available</span>' : ''}
        ${p.citationCount != null ? `<span class="pr-badge">↗ ${p.citationCount} citations</span>` : ''}
        ${doi ? `<span class="pr-badge">DOI: ${escX(doi)}</span>` : ''}
        ${fields}
      </div>
      ${p.abstract ? `<div class="pr-abstract">${escX(p.abstract)}</div>` : ''}
      <div class="pr-actions">
        ${hasPdf ? `<button class="pr-btn primary" onclick="openPaperPdf(${i})"><i class="fa-solid fa-file-pdf"></i> Open PDF</button>` : ''}
        ${p.url ? `<button class="pr-btn" onclick="window.open('${p.url}','_blank')"><i class="fa-solid fa-arrow-up-right-from-square"></i> Semantic Scholar</button>` : ''}
        ${doi ? `<button class="pr-btn" onclick="window.open('https://doi.org/${encodeURIComponent(doi)}','_blank')"><i class="fa-solid fa-link"></i> DOI Link</button>` : ''}
        <button class="pr-btn" onclick="savePaperMeta(${i})"><i class="fa-solid fa-bookmark"></i> Save to Research</button>
      </div>
    </div>`;
  }).join('');
}

function openPaperPdf(idx) {
  const p = (paperFilter === 'open'  ? paperResults.filter(x=>x.isOpenAccess) :
             paperFilter === 'pdf'   ? paperResults.filter(x=>x.openAccessPdf?.url) :
             paperResults)[idx];
  if (!p?.openAccessPdf?.url) { toast('No PDF available','This paper has no open-access PDF link','ERROR'); return; }

  currentPaperPdf = {
    url:   p.openAccessPdf.url,
    title: p.title || 'Untitled',
    paper: p
  };

  cl('m-paper-search');
  showPdfPanel(p.openAccessPdf.url, p.title, p);
}

function savePaperMeta(idx) {
  const list = paperFilter === 'open'  ? paperResults.filter(x=>x.isOpenAccess)  :
               paperFilter === 'pdf'   ? paperResults.filter(x=>x.openAccessPdf?.url) :
               paperResults;
  const p = list[idx];
  if (!p) return;
  const authors = (p.authors||[]).map(a=>a.name).join(', ');
  const doi     = p.externalIds?.DOI || '';
  const content = [
    `Title: ${p.title}`,
    `Authors: ${authors}`,
    `Year: ${p.year||'Unknown'}`,
    doi ? `DOI: ${doi}` : '',
    p.url ? `Link: ${p.url}` : '',
    p.isOpenAccess ? 'Access: Open Access' : 'Access: Closed Access',
    p.openAccessPdf?.url ? `PDF: ${p.openAccessPdf.url}` : '',
    '',
    'Abstract:',
    p.abstract || 'No abstract available.',
    '',
    `Fields: ${(p.fieldsOfStudy||[]).join(', ')}`,
    `Citations: ${p.citationCount ?? 'Unknown'}`,
  ].filter(l=>l!==undefined).join('\n');

  popFolderSel('paper-save-folder-sel');
  // Ask which folder via a tiny inline prompt
  const fid = ge('paper-save-folder-sel') ? ge('paper-save-folder-sel').value : '__root__';
  resFiles.unshift({
    id: Date.now(), type: 'note',
    name: (p.title||'Paper').slice(0,80),
    folderId: fid,
    content, tags: (p.fieldsOfStudy||[]).join(', '),
    doi, authors, year: p.year,
    date: new Date().toISOString()
  });
  saveResData();
  toast((p.title||'Paper').slice(0,50)+'…', 'Saved metadata to Research','PAPER SAVED');
}

// ── DOC VIEWER (PDF, text, code, markdown, image — all with highlights) ────────

// Config
if (typeof pdfjsLib !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

// State
let pdfDoc      = null;
let pdfPage     = 1;
let pdfScale    = 1.6;
let hlMode      = false;
let highlights  = [];
let pdfMeta     = {};      // {title, paper, url, fileId, docType}
let isSelecting = false;
let selStart    = null;
let _selBox     = null;

// ── Entry point for ALL file types ────────────────────────────────────────────
function showDocViewer(fileId) {
  const f = resFiles.find(x => x.id === fileId);
  if (!f) return;

  // Determine document type
  const name = (f.name || '').toLowerCase();
  const ft   = (f.fileType || '').toLowerCase();
  let docType;

  if (f.type === 'paper' && f.pdfUrl) {
    docType = 'pdf-url';
  } else if (ft.startsWith('image/') || name.match(/\.(png|jpe?g|gif|webp|svg)$/)) {
    docType = 'image';
  } else if (ft === 'application/pdf' || name.endsWith('.pdf')) {
    docType = 'pdf-b64';
  } else {
    docType = 'text';
  }

  // Reset state
  pdfDoc  = null; pdfPage = 1; hlMode  = false;
  pdfMeta = { title: f.name, url: f.pdfUrl || '', fileId: f.id, docType, paper: f.paper || {} };

  // Restore saved highlights
  highlights = [];
  if (f.highlights && f.highlights.length) {
    highlights = f.highlights.map(h => ({
      id:    h.id    || (Date.now() + Math.random()),
      page:  h.page  || 1,
      x:     h.x,    y: h.y,
      w:     h.w,
      h:     h.h !== undefined ? h.h : (h.h2 || 20),
      color: h.color || '#FFE066',
      note:  h.note  || '',
      // text highlights (for text/code view)
      selStart: h.selStart,
      selEnd:   h.selEnd,
      lineIdx:  h.lineIdx
    }));
  }

  // Show panel
  const panel = ge('pdf-panel');
  panel.style.display = 'flex';
  ge('pdf-title-label').textContent = f.name;
  ge('hlbtn').style.cssText = '';
  ge('pdf-canvas-wrap').style.cursor = 'default';

  // Show/hide page nav (only for PDFs)
  const showPages = docType === 'pdf-url' || docType === 'pdf-b64';
  ['pdf-prev','pdf-next','pdf-page-info','pdf-page-sep'].forEach(id => {
    const el = ge(id); if (el) el.style.display = showPages ? '' : 'none';
  });

  popFolderSel('pdf-save-folder');
  if (f.folderId) { const sel = ge('pdf-save-folder'); if (sel) sel.value = f.folderId; }

  renderHlList();

  // Dispatch to type-specific renderer
  if (docType === 'pdf-url')  { loadPdfFromUrl(f.pdfUrl); }
  else if (docType === 'pdf-b64') { loadPdfFromBase64(f.content); }
  else if (docType === 'image')   { renderImageViewer(f); }
  else                             { renderTextViewer(f); }
}

// Alias for backward-compat (paper search still calls showPdfPanel)
function showPdfPanel(pdfUrl, title, paper, fileId) {
  // Build a minimal file object and delegate
  if (fileId) {
    showDocViewer(fileId);
    return;
  }
  // New paper not yet saved — open inline without fileId
  pdfMeta = { title, paper: paper||{}, url: pdfUrl, fileId: null, docType: 'pdf-url' };
  pdfDoc  = null; pdfPage = 1; hlMode  = false; highlights = [];
  const panel = ge('pdf-panel');
  panel.style.display = 'flex';
  ge('pdf-title-label').textContent = title || 'PDF';
  ge('hlbtn').style.cssText = '';
  ['pdf-prev','pdf-next','pdf-page-info','pdf-page-sep'].forEach(id=>{const el=ge(id);if(el)el.style.display='';});
  popFolderSel('pdf-save-folder');
  renderHlList();
  loadPdfFromUrl(pdfUrl);
}

// ── PDF loaders ───────────────────────────────────────────────────────────────
async function loadPdfFromUrl(url) {
  const wrap = ge('pdf-canvas-wrap');
  wrap.innerHTML = `<div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#666;padding:40px;text-align:center;"><i class="fa-solid fa-circle-notch fa-spin"></i>  Loading PDF…</div>`;
  if (typeof pdfjsLib === 'undefined') { wrap.innerHTML = '<div style="color:#c00;padding:40px;text-align:center;font-family:\'JetBrains Mono\',monospace;font-size:11px;">PDF.js not loaded.</div>'; return; }
  try {
    const proxied = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    pdfDoc = await pdfjsLib.getDocument({ url: proxied, cMapUrl:'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/', cMapPacked:true }).promise;
    await renderPdfPage(pdfPage);
  } catch(e) {
    wrap.innerHTML = `<div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#c00;padding:40px;text-align:center;max-width:480px;margin:0 auto;">
      <i class="fa-solid fa-triangle-exclamation" style="font-size:22px;display:block;margin-bottom:10px;"></i>
      <strong>Could not load PDF</strong><br><br>
      <span style="color:#666;line-height:1.7">CORS restrictions may block direct loading.<br>
      Try opening it in a new tab or uploading the file.</span><br><br>
      <a href="${url}" target="_blank" style="background:#111;color:#fff;padding:6px 12px;border-radius:3px;text-decoration:none;font-size:10px;display:inline-flex;align-items:center;gap:4px;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open in new tab</a>
      <br><br><span style="font-size:9px;color:#aaa;">${e.message}</span>
    </div>`;
  }
}

async function loadPdfFromBase64(b64content) {
  const wrap = ge('pdf-canvas-wrap');
  wrap.innerHTML = `<div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#666;padding:40px;text-align:center;"><i class="fa-solid fa-circle-notch fa-spin"></i>  Rendering PDF…</div>`;
  if (typeof pdfjsLib === 'undefined') { wrap.innerHTML = '<div style="color:#c00;padding:40px;text-align:center;font-family:\'JetBrains Mono\',monospace;font-size:11px;">PDF.js not loaded.</div>'; return; }
  try {
    let data;
    if (b64content && b64content.startsWith('data:')) {
      // File was read as dataURL (our new upload path)
      const base64 = b64content.split(',')[1];
      const bin = atob(base64);
      data = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) data[i] = bin.charCodeAt(i);
    } else if (b64content && b64content.startsWith('%PDF')) {
      // Raw PDF text (old upload path via readAsText — shouldn't happen for PDFs now)
      data = new TextEncoder().encode(b64content);
    } else {
      // Treat as raw base64 string
      try {
        const bin = atob(b64content);
        data = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) data[i] = bin.charCodeAt(i);
      } catch {
        data = new TextEncoder().encode(b64content);
      }
    }
    pdfDoc = await pdfjsLib.getDocument({
      data,
      cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
      cMapPacked: true
    }).promise;
    await renderPdfPage(pdfPage);
  } catch(e) {
    wrap.innerHTML = `<div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#c00;padding:40px;text-align:center;max-width:440px;margin:0 auto;">
      <i class="fa-solid fa-triangle-exclamation" style="font-size:22px;display:block;margin-bottom:10px;"></i>
      <strong>Could not render PDF</strong><br><br>
      <span style="color:#666;line-height:1.7">The file may be corrupted or in an unsupported format.</span>
      <br><br><span style="font-size:9px;color:#aaa;">${e.message}</span>
    </div>`;
  }
}

// ── PDF page renderer ─────────────────────────────────────────────────────────
async function renderPdfPage(num) {
  if (!pdfDoc) return;
  const wrap = ge('pdf-canvas-wrap');
  const page = await pdfDoc.getPage(num);
  const vp   = page.getViewport({ scale: pdfScale });
  wrap.innerHTML = '';

  const pageWrap = document.createElement('div');
  pageWrap.style.cssText = `position:relative;width:${vp.width}px;height:${vp.height}px;box-shadow:0 2px 16px rgba(0,0,0,.15);flex-shrink:0;`;

  // Single canvas — PDF renders here, highlights painted on top
  const canvas = document.createElement('canvas');
  canvas.id = 'pdf-canvas-main';
  canvas.width = vp.width; canvas.height = vp.height;
  canvas.style.cssText = `display:block;cursor:${hlMode?'crosshair':'default'};`;

  pageWrap.appendChild(canvas);
  wrap.appendChild(pageWrap);

  // 1. Render the PDF page
  const ctx = canvas.getContext('2d');
  await page.render({ canvasContext: ctx, viewport: vp }).promise;

  // 2. Paint any saved highlights directly onto the canvas
  drawHighlightsOnCanvas(ctx, num);

  ge('pdf-page-info').textContent = `Page ${num} / ${pdfDoc.numPages}`;

  // 3. Setup drag-to-highlight directly on the canvas
  setupCanvasDrag(canvas, ctx, vp, num);
}

function drawHighlightsOnCanvas(ctx, pageNum) {
  highlights.filter(h => h.page === pageNum && h.x !== undefined).forEach(h => {
    const hex = h.color.replace('#','');
    const r = parseInt(hex.slice(0,2),16);
    const g = parseInt(hex.slice(2,4),16);
    const b = parseInt(hex.slice(4,6),16);
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(h.x, h.y, h.w, h.h);
    ctx.globalAlpha = 0.8;
    ctx.strokeStyle = `rgb(${r},${g},${b})`;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(h.x, h.y, h.w, h.h);
    ctx.restore();
  });
}

function setupCanvasDrag(canvas, ctx, vp, pageNum) {
  let sx, sy, drawing = false;

  canvas.addEventListener('mousedown', e => {
    if (!hlMode) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    sx = (e.clientX - rect.left) * scaleX;
    sy = (e.clientY - rect.top) * scaleY;
    drawing = true;
    e.preventDefault();
  });

  canvas.addEventListener('mousemove', e => {
    if (!drawing || !hlMode) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const cx = (e.clientX - rect.left) * scaleX;
    const cy = (e.clientY - rect.top) * scaleY;

    // Redraw page + existing highlights + live selection box
    const page = pdfDoc.getPage(pageNum).then(pg => {
      pg.render({ canvasContext: ctx, viewport: vp }).promise.then(() => {
        drawHighlightsOnCanvas(ctx, pageNum);
        // Draw live selection rectangle
        ctx.save();
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = ge('hl-color').value;
        ctx.fillRect(Math.min(sx,cx), Math.min(sy,cy), Math.abs(cx-sx), Math.abs(cy-sy));
        ctx.globalAlpha = 1;
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5,3]);
        ctx.strokeRect(Math.min(sx,cx), Math.min(sy,cy), Math.abs(cx-sx), Math.abs(cy-sy));
        ctx.restore();
      });
    });
  });

  canvas.addEventListener('mouseup', e => {
    if (!drawing) return;
    drawing = false;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const cx = (e.clientX - rect.left) * scaleX;
    const cy = (e.clientY - rect.top) * scaleY;
    const x = Math.min(sx, cx), y = Math.min(sy, cy);
    const w = Math.abs(cx - sx), h = Math.abs(cy - sy);
    if (w < 8 || h < 8) return;

    const color = ge('hl-color').value;
    highlights.push({ id: Date.now() + Math.random(), page: pageNum, x, y, w, h, color, note:'', text:'' });

    // Redraw with new highlight
    pdfDoc.getPage(pageNum).then(pg => {
      pg.render({ canvasContext: ctx, viewport: vp }).promise.then(() => {
        drawHighlightsOnCanvas(ctx, pageNum);
      });
    });
    persistHighlights();
  });

  // Touch support
  canvas.addEventListener('touchstart', e => {
    if (!hlMode) return;
    const t = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    sx = (t.clientX - rect.left) * (canvas.width / rect.width);
    sy = (t.clientY - rect.top) * (canvas.height / rect.height);
    drawing = true; e.preventDefault();
  }, { passive: false });

  canvas.addEventListener('touchend', e => {
    if (!drawing) return;
    drawing = false;
    const t = e.changedTouches[0];
    const rect = canvas.getBoundingClientRect();
    const cx = (t.clientX - rect.left) * (canvas.width / rect.width);
    const cy = (t.clientY - rect.top) * (canvas.height / rect.height);
    const x = Math.min(sx,cx), y = Math.min(sy,cy);
    const w = Math.abs(cx-sx), h = Math.abs(cy-sy);
    if (w < 8 || h < 8) return;
    const color = ge('hl-color').value;
    highlights.push({ id: Date.now()+Math.random(), page: pageNum, x, y, w, h, color, note:'', text:'' });
    pdfDoc.getPage(pageNum).then(pg => {
      pg.render({ canvasContext: ctx, viewport: vp }).promise.then(() => {
        drawHighlightsOnCanvas(ctx, pageNum);
      });
    });
    persistHighlights();
  }, { passive: false });
}

// ── Image viewer ──────────────────────────────────────────────────────────────
function renderImageViewer(f) {
  const wrap = ge('pdf-canvas-wrap');
  wrap.innerHTML = '';

  const cont = document.createElement('div');
  cont.style.cssText = 'position:relative;display:inline-block;box-shadow:0 2px 16px rgba(0,0,0,.15);background:#fff;';

  const img = document.createElement('img');
  img.style.cssText = 'display:block;max-width:min(860px, calc(100vw - 340px));max-height:calc(100vh - 120px);object-fit:contain;';
  // content is a dataURL for uploaded images; url for linked images
  img.src = (f.content && f.content.startsWith('data:')) ? f.content : (f.url || f.content || '');
  img.alt = f.name;

  const hlLayer = document.createElement('div');
  hlLayer.id = 'hl-layer';
  hlLayer.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:20;';

  cont.append(img, hlLayer);
  wrap.appendChild(cont);

  ge('pdf-page-info').textContent = 'Image';

  const init = () => {
    renderPageHighlights(1, hlLayer);
    setupDragSelect(cont, hlLayer, 1, 'image');
  };
  img.onload = init;
  if (img.complete && img.naturalWidth) init();
}

// ── Text / code / markdown viewer ────────────────────────────────────────────
function renderTextViewer(f) {
  const wrap = ge('pdf-canvas-wrap');
  wrap.innerHTML = '';

  const content = f.content || '';
  const lines   = content.split('\n');
  const isCode  = (f.name||'').match(/\.(js|ts|py|java|c|cpp|cs|go|rs|php|rb|sh|json|xml|yaml|yml|md|html|css|txt|drawio)$/i);

  const outer = document.createElement('div');
  outer.style.cssText = 'width:100%;max-width:900px;background:#fff;box-shadow:0 2px 16px rgba(0,0,0,.12);border-radius:3px;overflow:hidden;';

  // Title bar
  const titlebar = document.createElement('div');
  titlebar.style.cssText = 'background:#f8f8f8;border-bottom:1px solid #e0e0e0;padding:8px 14px;font-family:\'JetBrains Mono\',monospace;font-size:10px;color:#aaa;display:flex;justify-content:space-between;';
  titlebar.innerHTML = `<span>${escX(f.name)}</span><span>${lines.length} lines</span>`;
  outer.appendChild(titlebar);

  // Lines container
  const linesWrap = document.createElement('div');
  linesWrap.id = 'text-lines';
  linesWrap.style.cssText = 'padding:16px 0;overflow:visible;';

  lines.forEach((line, i) => {
    const row = document.createElement('div');
    row.className = 'txt-line';
    row.dataset.lineIdx = i;
    row.style.cssText = 'display:flex;min-height:20px;font-family:\'JetBrains Mono\',monospace;font-size:12px;line-height:1.6;position:relative;';

    const num = document.createElement('span');
    num.style.cssText = 'width:44px;min-width:44px;text-align:right;padding-right:16px;color:#ccc;user-select:none;font-size:10px;padding-top:1px;';
    num.textContent = i + 1;

    const text = document.createElement('span');
    text.className = 'txt-content';
    text.dataset.lineIdx = i;
    text.style.cssText = 'flex:1;padding:0 16px;white-space:pre-wrap;word-break:break-all;color:#222;cursor:text;';
    text.textContent = line || ' ';

    row.append(num, text);
    linesWrap.appendChild(row);
  });

  outer.appendChild(linesWrap);
  wrap.appendChild(outer);

  ge('pdf-page-info').textContent = `${lines.length} lines`;

  // Apply saved highlights for text
  applyTextHighlights();

  // Setup line-click highlighting
  setupTextHighlight(linesWrap);
}

function setupTextHighlight(linesWrap) {
  let selecting = false;
  let startLine = -1;

  linesWrap.addEventListener('mousedown', e => {
    if (!hlMode) return;
    const lineEl = e.target.closest('.txt-line');
    if (!lineEl) return;
    selecting  = true;
    startLine  = parseInt(lineEl.dataset.lineIdx);
    e.preventDefault();
  });

  document.addEventListener('mouseup', e => {
    if (!selecting || !hlMode) { selecting = false; return; }
    selecting = false;
    const lineEl = e.target.closest ? e.target.closest('.txt-line') : null;
    const endLine = lineEl ? parseInt(lineEl.dataset.lineIdx) : startLine;
    const lo = Math.min(startLine, endLine);
    const hi = Math.max(startLine, endLine);
    if (lo < 0) return;

    const color = ge('hl-color').value;
    const lines = document.querySelectorAll('.txt-line');
    let text = '';
    for (let i = lo; i <= hi; i++) {
      const el = lines[i];
      if (el) text += (el.querySelector('.txt-content')?.textContent || '') + '\n';
    }
    const hl = { id: Date.now() + Math.random(), page: 1, lineStart: lo, lineEnd: hi, color, note: '', text: text.trim(), selStart: lo, selEnd: hi };
    highlights.push(hl);
    applyTextHighlights();
    renderHlList();
    persistHighlights();
  });
}

function applyTextHighlights() {
  // Clear all existing line highlights
  document.querySelectorAll('.txt-line').forEach(el => {
    el.style.background = '';
  });
  // Apply current highlights
  highlights.filter(h => h.lineStart !== undefined || h.selStart !== undefined).forEach(h => {
    const lo = h.lineStart !== undefined ? h.lineStart : h.selStart;
    const hi = h.lineEnd   !== undefined ? h.lineEnd   : h.selEnd;
    document.querySelectorAll('.txt-line').forEach(el => {
      const idx = parseInt(el.dataset.lineIdx);
      if (idx >= lo && idx <= hi) el.style.background = h.color + '66';
    });
  });
}

// ── Shared drag-select for PDF and image highlights ───────────────────────────
function setupDragSelect(pageWrap, hlLayer, pageNum, mode) {
  let sx, sy;

  pageWrap.addEventListener('mousedown', e => {
    if (!hlMode) return;
    const rect = pageWrap.getBoundingClientRect();
    sx = e.clientX - rect.left; sy = e.clientY - rect.top;
    isSelecting = true;
    if (_selBox) _selBox.remove();
    _selBox = document.createElement('div');
    _selBox.style.cssText = 'position:absolute;border:1.5px dashed #000;pointer-events:none;z-index:30;background:rgba(0,0,0,0.04);';
    pageWrap.appendChild(_selBox);
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!isSelecting || !_selBox) return;
    const rect = pageWrap.getBoundingClientRect();
    const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
    const x = Math.min(sx, cx), y = Math.min(sy, cy);
    Object.assign(_selBox.style, { left: x+'px', top: y+'px', width: Math.abs(cx-sx)+'px', height: Math.abs(cy-sy)+'px' });
  });

  document.addEventListener('mouseup', e => {
    if (!isSelecting) return;
    isSelecting = false;
    const rect = pageWrap.getBoundingClientRect();
    const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
    const x = Math.min(sx, cx), y = Math.min(sy, cy);
    const w = Math.abs(cx - sx), h = Math.abs(cy - sy);
    if (_selBox) { _selBox.remove(); _selBox = null; }
    if (w < 8 || h < 8) return;
    const color = ge('hl-color').value;
    highlights.push({ id: Date.now() + Math.random(), page: pageNum, x, y, w, h, color, note: '', text: '' });
    renderPageHighlights(pageNum, hlLayer);
    persistHighlights();
  });
}

// ── Render highlights as coloured rectangles on a layer ───────────────────────
function renderPageHighlights(pageNum, hlLayer) {
  // For PDF: repaint directly on canvas (works on GitHub Pages, no DOM layer issues)
  const canvas = ge('pdf-canvas-main');
  if (canvas && pdfDoc) {
    pdfDoc.getPage(pageNum).then(pg => {
      const vp = pg.getViewport({ scale: pdfScale });
      const ctx = canvas.getContext('2d');
      pg.render({ canvasContext: ctx, viewport: vp }).promise.then(() => {
        drawHighlightsOnCanvas(ctx, pageNum);
      });
    });
    return;
  }
  // Fallback DOM layer for images
  if (!hlLayer) hlLayer = ge('hl-layer');
  if (!hlLayer) return;
  hlLayer.innerHTML = '';
  highlights.filter(h => h.page === pageNum && h.x !== undefined).forEach(h => {
    const div = document.createElement('div');
    const hex = h.color.replace('#','');
    const r = parseInt(hex.slice(0,2),16), g = parseInt(hex.slice(2,4),16), b = parseInt(hex.slice(4,6),16);
    div.style.cssText = `position:absolute;left:${h.x}px;top:${h.y}px;width:${h.w}px;height:${h.h}px;background:rgba(${r},${g},${b},0.35);border:1.5px solid rgba(${r},${g},${b},0.8);border-radius:2px;box-sizing:border-box;pointer-events:none;`;
    hlLayer.appendChild(div);
  });
}

// ── Highlights sidebar ────────────────────────────────────────────────────────
function renderHlList(activeId) {
  const list = ge('hl-list');
  ge('hl-count').textContent = highlights.length;
  if (!highlights.length) {
    list.innerHTML = `<div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#aaa;text-align:center;padding:20px 10px;">No highlights.<br><br>Enable <strong>Highlight</strong> mode then drag to select an area, or click lines in text files.</div>`;
    return;
  }
  list.innerHTML = highlights.map(h => {
    const label = h.lineStart !== undefined
      ? `Lines ${h.lineStart+1}–${h.lineEnd+1}`
      : `Page ${h.page}`;
    return `<div style="border:1px solid ${activeId===h.id?'#111':'#e0e0e0'};border-left:3px solid ${h.color};border-radius:2px;padding:8px 10px;margin-bottom:5px;cursor:pointer;background:${activeId===h.id?'#f8f8f8':'#fff'};"
       onclick="jumpToHl(${h.id})">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">
        <span style="font-family:'JetBrains Mono',monospace;font-size:9px;color:#aaa;">${label}</span>
        <button onclick="event.stopPropagation();removeHighlight(${h.id})" style="background:none;border:none;color:#c00;cursor:pointer;font-size:11px;line-height:1;padding:0 2px;">✕</button>
      </div>
      <div style="width:100%;height:8px;background:${h.color};border-radius:1px;opacity:.7;margin-bottom:4px;"></div>
      ${h.text?`<div style="font-size:10px;color:#555;font-family:'JetBrains Mono',monospace;line-height:1.4;max-height:40px;overflow:hidden;">${escX(h.text.slice(0,80))}${h.text.length>80?'…':''}</div>`:''}
      ${h.note?`<div style="font-size:10px;color:#333;margin-top:3px;border-top:1px solid #eee;padding-top:3px;">${escX(h.note)}</div>`:''}
    </div>`;
  }).join('');
}

function jumpToHl(id) {
  const h = highlights.find(x => x.id === id);
  if (!h) return;
  // For PDFs: navigate to the right page
  if ((pdfMeta.docType==='pdf-url'||pdfMeta.docType==='pdf-b64') && h.page && h.page !== pdfPage) {
    pdfPage = h.page; renderPdfPage(pdfPage);
  }
  // For text: scroll the line into view
  if (h.lineStart !== undefined) {
    const el = document.querySelectorAll('.txt-line')[h.lineStart];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  ge('hl-note').value = h.note || '';
  ge('hl-note').oninput = () => { h.note = ge('hl-note').value; renderHlList(id); persistHighlights(); };
  renderHlList(id);
}

function removeHighlight(id) {
  highlights = highlights.filter(h => h.id !== id);
  applyTextHighlights();
  renderHlList();
  persistHighlights();
  if (pdfDoc) renderPdfPage(pdfPage);
}

function toggleHighlight() {
  hlMode = !hlMode;
  const btn = ge('hlbtn');
  if (hlMode) {
    btn.style.cssText = "background:#FFE066;border:1px solid #c8a800;border-radius:3px;padding:5px 10px;font-family:'JetBrains Mono',monospace;font-size:10px;cursor:pointer;display:inline-flex;align-items:center;gap:4px;color:#000;font-weight:600;";
  } else {
    btn.style.cssText = "background:none;border:1px solid #e0e0e0;border-radius:3px;padding:5px 10px;font-family:'JetBrains Mono',monospace;font-size:10px;cursor:pointer;display:inline-flex;align-items:center;gap:4px;";
  }
  // Update canvas cursor
  const canvas = ge('pdf-canvas-main');
  if (canvas) canvas.style.cursor = hlMode ? 'crosshair' : 'default';
  // Re-render PDF page to apply
  if (pdfDoc) renderPdfPage(pdfPage);
}

function clearHighlights() {
  if (!highlights.length) return;
  if (!confirm('Clear all highlights on this document?')) return;
  highlights = [];
  applyTextHighlights();
  renderHlList();
  persistHighlights();
  // Repaint PDF canvas without highlights
  if (pdfDoc) renderPdfPage(pdfPage);
}

function pdfPrevPage() { if (!pdfDoc || pdfPage <= 1) return; pdfPage--; renderPdfPage(pdfPage); }
function pdfNextPage() { if (!pdfDoc || pdfPage >= pdfDoc.numPages) return; pdfPage++; renderPdfPage(pdfPage); }

function closeDocViewer() {
  ge('pdf-panel').style.display = 'none';
  pdfDoc = null; pdfPage = 1; highlights = []; hlMode = false;
}
// Backward compat alias
function closePdfPanel() { closeDocViewer(); }

// ── Persist highlights to localStorage ───────────────────────────────────────
function persistHighlights() {
  if (!pdfMeta.fileId) return;
  const idx = resFiles.findIndex(f => f.id === pdfMeta.fileId);
  if (idx === -1) return;
  resFiles[idx].highlights = highlights.map(h => ({
    id: h.id, page: h.page, x: h.x, y: h.y, w: h.w, h: h.h,
    color: h.color, note: h.note, text: h.text || '',
    lineStart: h.lineStart, lineEnd: h.lineEnd,
    selStart: h.selStart, selEnd: h.selEnd
  }));
  localStorage.setItem('res_files', JSON.stringify(resFiles));
}

// ── Save / update research entry ─────────────────────────────────────────────
async function saveDocHighlights() {
  const fid = ge('pdf-save-folder').value || '__root__';
  const hlData = highlights.map(h => ({
    id: h.id, page: h.page, x: h.x, y: h.y, w: h.w, h: h.h,
    color: h.color, note: h.note, text: h.text || '',
    lineStart: h.lineStart, lineEnd: h.lineEnd,
    selStart: h.selStart, selEnd: h.selEnd
  }));

  if (pdfMeta.fileId) {
    // Update existing file — just update highlights + folder
    const idx = resFiles.findIndex(f => f.id === pdfMeta.fileId);
    if (idx !== -1) {
      resFiles[idx].highlights = hlData;
      resFiles[idx].folderId   = fid;
      saveResData();
      toast((pdfMeta.title||'').slice(0,48), `${hlData.length} highlight${hlData.length!==1?'s':''} saved`, 'HIGHLIGHTS SAVED');
      return;
    }
  }

  // New file (opened from paper search, not yet saved)
  const p = pdfMeta.paper || {};
  const newId = Date.now();
  resFiles.unshift({
    id: newId, type: 'paper',
    name: (pdfMeta.title || 'Document').slice(0, 80),
    folderId: fid,
    pdfUrl: pdfMeta.url,
    highlights: hlData,
    authors: (p.authors||[]).map(a=>a.name).join(', '),
    doi: p.externalIds?.DOI || '',
    year: p.year,
    tags: (p.fieldsOfStudy||[]).join(', '),
    date: new Date().toISOString()
  });
  pdfMeta.fileId = newId;
  saveResData();
  toast((pdfMeta.title||'').slice(0,48), `Saved with ${hlData.length} highlight${hlData.length!==1?'s':''}`, 'SAVED');
}

// Keep old name as alias
async function savePdfToResearch() { await saveDocHighlights(); }
