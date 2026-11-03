
function aperture(size, spin, color){
  color = color || 'var(--orange)';
  const blades=8, r1=size*0.46; let paths='';
  for(let i=0;i<blades;i++){
    const a=(i*360/blades)*Math.PI/180, a2=((i+1)*360/blades)*Math.PI/180;
    paths += `<path d="M${size/2} ${size/2} L${size/2+r1*Math.cos(a)} ${size/2+r1*Math.sin(a)} A${r1} ${r1} 0 0 1 ${size/2+r1*Math.cos(a2)} ${size/2+r1*Math.sin(a2)} Z" fill="${color}" opacity="${i%2?0.55:0.9}"/>`;
  }
  return `<svg class="${spin?'spin':''}" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true"><circle cx="${size/2}" cy="${size/2}" r="${size*0.48}" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.3"/>${paths}<circle cx="${size/2}" cy="${size/2}" r="${size*0.16}" fill="#3B3B3D"/></svg>`;
}
function logoMark(size){
  size=size||34;
  return `<svg width="${size}" height="${size*0.6}" viewBox="0 0 100 60" aria-hidden="true"><path d="M5 32 C25 5 55 2 90 28" stroke="#2E3192" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M8 34 C30 55 60 56 92 30" stroke="#3B3B3D" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="52" cy="30" r="15" fill="#E08A2E"/><circle cx="52" cy="30" r="7" fill="#3B3B3D"/></svg>`;
}

const DEFAULTS = {
  directory:{ users:[], courses:[
    {code:'PHT201',title:'Portrait Lighting Fundamentals',dept:'Photography',level:'200',semester:'1',lecturerId:null},
    {code:'PHT305',title:'Advanced Studio Techniques',dept:'Photography',level:'300',semester:'1',lecturerId:null},
    {code:'FLM210',title:'Cinematic Color Grading',dept:'Film & Video',level:'200',semester:'1',lecturerId:null},
    {code:'DES150',title:'Visual Identity Design',dept:'Design',level:'100',semester:'1',lecturerId:null},
    {code:'BUS220',title:'Creative Business & Branding',dept:'General Studies',level:'200',semester:'2',lecturerId:null}
  ]},
  academics:{ registrations:{}, results:[], timetables:[] },
  community:{ posts:[{id:'seed1',authorName:'Eikon Team',type:'opportunity',title:'Campus Photo Walk this Saturday',body:'Join fellow students for a guided photo walk around the city centre. Bring your own gear or borrow from the vault desk.',ts:Date.now()-86400000}] },
  vault:{ resources:[{"id": "r1", "category": "Templates", "title": "Portfolio Website Template (Figma)", "description": "Clean minimal portfolio layout, editable in Figma."}, {"id": "r2", "category": "Templates", "title": "Client Invoice Template", "description": "Simple invoice for your first freelance jobs."}, {"id": "r3", "category": "Templates", "title": "Social Media Post Pack", "description": "12 editable post layouts for promoting your work."}, {"id": "r4", "category": "Presets", "title": "Cinematic Teal & Orange LUT Pack", "description": "10 presets for moody cinematic grading."}, {"id": "r5", "category": "Presets", "title": "Portrait Lightroom Presets", "description": "Soft skin tones and clean contrast for portraits."}, {"id": "r6", "category": "Presets", "title": "Street Photography Presets", "description": "Gritty, high-contrast looks for city shoots."}, {"id": "r7", "category": "Fonts", "title": "Display Type Pack", "description": "5 curated display fonts for student branding projects."}, {"id": "r8", "category": "Fonts", "title": "Clean Sans Pairings", "description": "Heading and body font pairs that work together."}, {"id": "r9", "category": "Fonts", "title": "Script & Signature Fonts", "description": "Handwritten styles for logos and watermarks."}, {"id": "r10", "category": "Stock", "title": "Studio Backdrop Stock Pack", "description": "40 seamless backdrop images for compositing practice."}, {"id": "r11", "category": "Stock", "title": "Texture Stock Pack", "description": "Paper, concrete and fabric textures."}, {"id": "r12", "category": "Stock", "title": "Sound Effects Starter Pack", "description": "Short sound effects for video projects."}, {"id": "r13", "category": "Editing Assets", "title": "Overlay & Texture Bundle", "description": "Film grain, light leaks and dust overlays for photo and video edits."}, {"id": "r14", "category": "Editing Assets", "title": "Transitions Pack", "description": "Ready-made video transitions for Premiere and DaVinci."}, {"id": "r15", "category": "Editing Assets", "title": "Brush & Action Set", "description": "Photoshop brushes and actions for retouching."}, {"id": "r16", "category": "Checklists", "title": "Pre-Shoot Gear Checklist", "description": "Printable checklist for studio and location shoots."}, {"id": "r17", "category": "Checklists", "title": "Client Brief Checklist", "description": "Questions to ask before starting any job."}, {"id": "r18", "category": "Checklists", "title": "Portfolio Review Checklist", "description": "Check your portfolio before you send it out."}, {"id": "r19", "category": "E-books", "title": "Understanding Light: A Primer", "description": "Natural and artificial lighting basics."}, {"id": "r20", "category": "E-books", "title": "Colour Theory for Creatives", "description": "How colour shapes mood and meaning."}, {"id": "r21", "category": "E-books", "title": "Pricing Your Creative Work", "description": "A short guide to quoting and invoicing."}, {"id": "r22", "category": "Tutorials", "title": "Colour Grading in 20 Minutes", "description": "Step-by-step video tutorial for beginners."}, {"id": "r23", "category": "Tutorials", "title": "Studio Lighting Setups", "description": "Three classic portrait lighting setups, explained."}, {"id": "r24", "category": "Tutorials", "title": "Building a Brand Identity", "description": "From logo sketch to finished style guide."}, {"id": "r25", "category": "Recommended Tools", "title": "Student Software List", "description": "Editing tools with student discount links."}, {"id": "r26", "category": "Recommended Tools", "title": "Free Design Tools", "description": "No-cost apps for design, photo and video."}, {"id": "r27", "category": "Recommended Tools", "title": "Gear Rental Guide", "description": "Where to rent cameras and lights affordably."}] },
  support:{ issues:[] },
  newsletter:{ emails:[] },
  keys:{ keys:[] }
};
let cache={}, loaded=false;
async function api(path,opts){
  const r=await fetch(path,opts); let j={};
  try{ j=await r.json(); }catch(e){}
  if(!r.ok) throw new Error(j.error||('Request failed ('+r.status+')'));
  return j;
}
async function loadAll(){
  let remote={};
  try{ remote=await api('/api/data'); }catch(e){ console.error('load failed',e); }
  for(const key of Object.keys(DEFAULTS)) cache[key]=remote[key]||JSON.parse(JSON.stringify(DEFAULTS[key]));
  loaded=true;
}
async function save(key){
  try{ await api('/api/data',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key,value:cache[key]})}); }
  catch(e){ console.error('save failed',key,e); flash={type:'err',text:'That change was not saved. Check your connection and try again.'}; }
}

let session=null, flash=null;
const PORTAL=window.PORTAL||'student';
const SKEY='eikon-uid-'+PORTAL;
function uid(){return Math.random().toString(36).slice(2,10);}
function initials(n){return (n||'?').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();}
function fmtDate(ts){return new Date(ts).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});}
function esc(s){const d=document.createElement('div');d.textContent=s==null?'':String(s);return d.innerHTML;}
function go(h){location.hash=h;}
async function sha(s){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');}
function genReg(){
  const used=new Set(cache.directory.users.map(u=>u.regNo)); const L='ABCDEFGHIJKLMNOPQRSTUVWXYZ'; let r;
  do{ let d=''; for(let i=0;i<9;i++) d+=Math.floor(Math.random()*10); r='CRE/'+d+L[Math.floor(Math.random()*26)]+L[Math.floor(Math.random()*26)]; }while(used.has(r));
  return r;
}
const EMAIL_RE=/^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
const TYPOS={'gmial.com':'gmail.com','gmai.com':'gmail.com','gmail.co':'gmail.com','gmail.con':'gmail.com','gamil.com':'gmail.com','gmil.com':'gmail.com','gmail.cm':'gmail.com','yahho.com':'yahoo.com','yaho.com':'yahoo.com','yahoo.con':'yahoo.com','hotmial.com':'hotmail.com','hotmail.con':'hotmail.com','outlook.con':'outlook.com'};
const DISPOSABLE=['mailinator.com','10minutemail.com','guerrillamail.com','tempmail.com','temp-mail.org','yopmail.com','trashmail.com','sharklasers.com'];
function checkEmail(raw){
  const e=(raw||'').trim().toLowerCase();
  if(!EMAIL_RE.test(e)||e.includes('..')) return 'That email address is not written correctly.';
  const [local,domain]=e.split('@');
  if(TYPOS[domain]) return `Did you mean ${local}@${TYPOS[domain]}? Please correct the email.`;
  if(DISPOSABLE.includes(domain)) return 'Temporary email addresses are not accepted. Use your personal email.';
  if(domain==='gmail.com'){
    const l=local.replace(/\./g,'');
    if(!/^[a-z0-9.]+$/.test(local)||local.startsWith('.')||local.endsWith('.')||l.length<6||l.length>30) return 'That is not a valid Gmail address. Gmail names are 6–30 letters or numbers.';
  }
  return null;
}
function checkPhone(p){ const d=(p||'').replace(/[\s-]/g,''); return /^\+?\d{7,15}$/.test(d)?null:'Enter a valid phone number, digits only (you can start with +).'; }
function homeFor(){return session?'#/dashboard':'#/';}
function requireStudent(){ if(!session||session.role!=='student'){go(session?'#/admin/dashboard':'#/login');return false;} return true; }
function requireLogin(){ if(!session){go('#/login');return false;} return true; }
function setSession(u){ session=u; try{sessionStorage.setItem(SKEY,u.id);}catch(e){} }
function avatarHtml(u,size){
  size=size||44;
  if(u&&typeof u.photo==='string'&&u.photo.startsWith('data:image/jpeg;base64,')) return `<img src="${u.photo}" alt="" width="${size}" height="${size}" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;flex-shrink:0;">`;
  return `<div class="avatar" style="width:${size}px;height:${size}px;font-size:${Math.round(size/3)}px;">${initials(u&&u.name)}</div>`;
}
function readAsDataURL(file){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=()=>rej(new Error('read'));r.readAsDataURL(file);});}
async function resizePhoto(file){
  const src=await readAsDataURL(file);
  return new Promise((res,rej)=>{const img=new Image();img.onload=()=>{const s=220,c=document.createElement('canvas');c.width=c.height=s;const m=Math.min(img.width,img.height);c.getContext('2d').drawImage(img,(img.width-m)/2,(img.height-m)/2,m,m,0,0,s,s);res(c.toDataURL('image/jpeg',0.8));};img.onerror=()=>rej(new Error('image'));img.src=src;});
}

/* ================= STAFF BACK END (#/admin) ================= */
const TT_DAYS=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const DEPTS=['Photography','Film & Video','Design','General Studies'];
const ROLE_LABEL={hod:'Head of Department',lecturer:'Lecturer',desk_officer:'Desk officer'};
let needKey=false;
function hourLabel(h){return (h%12||12)+':00 '+(h<12?'AM':'PM');}
function hourShort(h){return (h%12||12)+(h<12?'am':'pm');}
function nav(h){ if(location.hash===h) render(); else go(h); }
function hashParams(){ return new URLSearchParams((location.hash.split('?')[1])||''); }
function deptOptions(sel){ return DEPTS.map(d=>`<option value="${esc(d)}" ${d===sel?'selected':''}>${esc(d)}</option>`).join(''); }
function requireStaff(roles){
  if(!session||session.role==='student'){go('#/admin');return false;}
  if(roles&&!roles.includes(session.role)){go('#/admin/dashboard');return false;}
  return true;
}
async function refreshAll(){
  try{ const remote=await api('/api/data'); for(const k of Object.keys(remote)) if(remote[k]) cache[k]=remote[k]; }catch(e){}
  if(session){ const u=cache.directory.users.find(u=>u.id===session.id); if(u) session=u; }
}
function genKey(){
  const A='ABCDEFGHJKMNPQRSTUVWXYZ23456789', used=new Set(cache.keys.keys.map(k=>k.code)); let c;
  do{ c='EK-'; for(let i=0;i<8;i++) c+=A[Math.floor(Math.random()*A.length)]; }while(used.has(c));
  return c;
}
function gradeFor(score){return score>=70?'A':score>=60?'B':score>=50?'C':score>=45?'D':'F';}

function timetableGrid(entries){
  const hours=[]; for(let h=9;h<18;h++) hours.push(h);
  const days=TT_DAYS.filter(d=>d!=='Saturday'||entries.some(e=>e.day==='Saturday'));
  const head='<th>Day</th>'+hours.map(h=>`<th>${hourShort(h)}–${hourShort(h+1)}</th>`).join('');
  const rows=days.map(d=>{
    const list=entries.filter(e=>e.day===d).sort((a,b)=>a.start-b.start);
    let cells='', h=9;
    while(h<18){
      const e=list.find(x=>x.start===h);
      if(e){ const c=cache.directory.courses.find(c=>c.code===e.course);
        cells+=`<td class="ttcell" colspan="${e.end-e.start}"><strong>${esc(e.course)}</strong>${c?`<span>${esc(c.title)}</span>`:''}${e.venue?`<span>${esc(e.venue)}</span>`:''}</td>`; h=e.end; }
      else { cells+='<td class="ttempty"></td>'; h++; }
    }
    return `<tr><th class="ttday">${d}</th>${cells}</tr>`;
  }).join('');
  return `<div class="tablewrap"><table class="ttgrid"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

function pageAdminLogin(){
  return `<div class="eyebrow">Staff only</div><h1 class="pagetitle">Staff login</h1><p class="sub">For heads of department, lecturers and desk officers.</p>
  <div class="card" style="max-width:440px;"><form id="staffLogin"><label for="se">Email</label><input id="se" name="email" type="email" required autocomplete="username"><label for="sp">Password</label><input id="sp" name="password" type="password" required autocomplete="current-password"><label for="sk">Access key</label><input id="sk" name="key" placeholder="EK-XXXXXXXX" autocapitalize="characters" autocomplete="off"><p style="font-size:12px;color:var(--muted);margin:6px 0 0;">Get your key from the desk officer. The first desk officer can leave it empty.</p><button class="btn navy" style="width:100%;margin-top:22px;" type="submit">Log in</button></form>
  <p style="text-align:center;font-size:13px;margin-top:16px;"><a href="#/admin/forgot" style="color:var(--orange);font-weight:700;">Forgot password?</a></p><p style="text-align:center;font-size:13px;color:var(--muted);margin-top:8px;">New staff? <a href="#/admin/register" style="color:var(--orange);font-weight:700;">Register with an access key</a></p></div>`;
}
function pageAdminRegister(){
  const first=!cache.directory.users.some(u=>u.role==='desk_officer');
  return `<div class="eyebrow">Staff only</div><h1 class="pagetitle">Staff registration</h1><p class="sub">${first?'No desk officer exists yet. Leave the access key empty to create the first desk officer account.':'Collect an access key from the desk officer. It decides your role and department.'}</p>
  <div class="card" style="max-width:480px;"><form id="staffReg" novalidate><label for="gn">Full name</label><input id="gn" name="name" required autocomplete="name"><label for="ge">Email</label><input id="ge" name="email" type="email" required autocomplete="email"><label for="gp">Password</label><input id="gp" name="password" type="password" required minlength="6" autocomplete="new-password"><label for="gk">Access key${first?' (leave empty for first setup)':''}</label><input id="gk" name="key" ${first?'':'required'} placeholder="EK-XXXXXXXX" autocapitalize="characters"><button class="btn" style="width:100%;margin-top:22px;" type="submit">Create staff account</button></form>
  <p style="text-align:center;font-size:13px;color:var(--muted);margin-top:16px;">Already registered? <a href="#/admin" style="color:var(--orange);font-weight:700;">Log in</a></p></div>`;
}
function pageAdminDashboard(){
  const r=session.role, students=cache.directory.users.filter(u=>u.role==='student').length;
  let stats='', cards='';
  if(r==='hod'){
    const n=cache.academics.timetables.filter(t=>t.department===session.department&&Array.isArray(t.entries)).length;
    stats=`<div class="stat"><div class="n">${n}</div><div class="l">Timetables</div></div><div class="stat"><div class="n">${students}</div><div class="l">Students</div></div>`;
    cards=dashCard('#/admin/timetable','Build timetable','Set the days, courses and times for each level.');
  } else if(r==='lecturer'){
    const n=cache.academics.results.length;
    stats=`<div class="stat"><div class="n">${n}</div><div class="l">Results published</div></div><div class="stat"><div class="n">${students}</div><div class="l">Students</div></div>`;
    cards=dashCard('#/admin/results','Enter results','Find a student by their registration number ending.');
  } else {
    const open=cache.support.issues.filter(i=>i.status==='open').length, keys=cache.keys.keys.filter(k=>k.status==='active').length;
    stats=`<div class="stat"><div class="n">${cache.directory.courses.length}</div><div class="l">Courses</div></div><div class="stat"><div class="n">${students}</div><div class="l">Students</div></div><div class="stat"><div class="n">${open}</div><div class="l">Open issues</div></div><div class="stat"><div class="n">${keys}</div><div class="l">Active keys</div></div>`;
    cards=dashCard('#/admin/results','Enter results','Find a student by their registration number ending.')+dashCard('#/admin/courses','Manage courses','Add courses to the catalogue.')+dashCard('#/admin/issues','Student issues','Reply to problems students report.')+dashCard('#/admin/keys','Access keys','Generate and disable staff access keys.');
  }
  return `<div class="eyebrow">${esc(ROLE_LABEL[r])}</div><h1 class="pagetitle">Welcome, ${esc(session.name)}</h1><p class="sub">${esc(session.department)}</p><div class="grid grid-4" style="margin-bottom:32px;">${stats}</div><div class="grid grid-2">${cards}</div>`;
}

function pageAdminTimetable(){
  const p=hashParams(), level=p.get('level')||'100', sem=p.get('sem')||'1', open=p.get('open')||'';
  const dept=session.department;
  const tt=cache.academics.timetables.find(t=>t.department===dept&&t.level===level&&t.semester===sem&&Array.isArray(t.entries));
  const entries=tt?tt.entries:[];
  let courses=cache.directory.courses.filter(c=>c.dept===dept&&c.level===level);
  if(!courses.length) courses=cache.directory.courses.filter(c=>c.dept===dept);
  const cOpts=courses.map(c=>`<option value="${esc(c.code)}">${esc(c.code)} · ${esc(c.title)}</option>`).join('');
  const sOpts=[9,10,11,12,13,14,15,16,17].map(h=>`<option value="${h}">${hourLabel(h)}</option>`).join('');
  const eOpts=[10,11,12,13,14,15,16,17,18].map(h=>`<option value="${h}">${hourLabel(h)}</option>`).join('');
  const days=TT_DAYS.map((d,i)=>{
    const list=entries.filter(e=>e.day===d).sort((a,b)=>a.start-b.start);
    const isOpen=open===d;
    const items=list.map(e=>{const c=cache.directory.courses.find(c=>c.code===e.course);return `<div class="ttitem"><div><strong>${esc(e.course)}</strong> ${c?'· '+esc(c.title):''}<div style="font-size:12px;color:var(--muted);">${hourLabel(e.start)} to ${hourLabel(e.end)}${e.venue?' · '+esc(e.venue):''}</div></div><button class="btn small danger ttDel" data-id="${esc(e.id)}">Remove</button></div>`;}).join('');
    return `<div class="acc"><button class="acc-head" aria-expanded="${isOpen}" aria-controls="day${i}"><span>${d} <span class="acc-count">${list.length}</span></span><span class="acc-chev" aria-hidden="true">▾</span></button><div class="acc-body" id="day${i}" ${isOpen?'':'hidden'}><div style="padding:6px 18px 0;">${items||'<p style="color:var(--muted);font-size:13px;">No courses on this day yet.</p>'}</div>
    <form class="ttAdd" data-day="${d}" style="padding:4px 18px 18px;"><label for="c${i}">Course</label><select id="c${i}" name="course" required>${cOpts||'<option value="">No courses in your department yet</option>'}</select><div class="grid grid-2" style="gap:12px;"><div><label for="s${i}">Starts</label><select id="s${i}" name="start">${sOpts}</select></div><div><label for="e${i}">Ends</label><select id="e${i}" name="end">${eOpts}</select></div></div><label for="v${i}">Venue (optional)</label><input id="v${i}" name="venue"><button class="btn small" style="margin-top:14px;" type="submit">Add course</button></form></div></div>`;
  }).join('');
  return `<div class="eyebrow">HOD · ${esc(dept)}</div><h1 class="pagetitle">Build timetable</h1><p class="sub">Pick the level and semester, open a day, then choose each course and its time. Students see changes straight away.</p>
  <div class="grid grid-2" style="max-width:520px;margin-bottom:24px;"><div><label for="ttLevel" style="margin-top:0;">Level</label><select id="ttLevel">${['100','200','300','400'].map(l=>`<option ${l===level?'selected':''}>${l}</option>`).join('')}</select></div><div><label for="ttSem" style="margin-top:0;">Semester</label><select id="ttSem">${['1','2'].map(s=>`<option ${s===sem?'selected':''}>${s}</option>`).join('')}</select></div></div>
  <div style="max-width:720px;">${days}</div>
  <h3 style="color:var(--navy);margin:36px 0 12px;">Preview · Level ${esc(level)}, Semester ${esc(sem)}</h3><div class="card">${entries.length?timetableGrid(entries):'<div class="empty">Nothing added yet.</div>'}</div>`;
}

function pageAdminResults(){
  const q=(hashParams().get('q')||'').trim();
  let body='';
  if(q){
    if(!/^\d{2}[A-Za-z]{2}$/.test(q)) body=`<div class="msg err">Enter the last two digits and the two letters, for example 89AB.</div>`;
    else{
      const m=cache.directory.users.filter(u=>u.role==='student'&&(u.regNo||'').toUpperCase().endsWith(q.toUpperCase()));
      body=m.length?`<div class="acc" style="max-width:520px;">${m.map(s=>`<a class="acc-item" href="#/admin/results/student?id=${encodeURIComponent(s.id)}&q=${encodeURIComponent(q)}"><span>${esc(s.regNo)}</span><span aria-hidden="true">›</span></a>`).join('')}</div>`:`<div class="empty">${aperture(40)}<h3>No student found</h3><p>Check the digits and letters and try again.</p></div>`;
    }
  }
  return `<div class="eyebrow">Results</div><h1 class="pagetitle">Find a student</h1><p class="sub">Type the last two digits and two letters of the student’s registration number, for example 89AB for CRE/123456789AB.</p>
  <div class="card" style="max-width:520px;margin-bottom:24px;"><form id="findForm"><label for="fq" style="margin-top:0;">Registration number ending</label><input id="fq" name="q" required maxlength="4" value="${esc(q)}" placeholder="89AB" autocapitalize="characters" autocomplete="off"><button class="btn" style="width:100%;margin-top:18px;" type="submit">Search</button></form></div>${body}`;
}
function pageAdminStudent(){
  const p=hashParams(), s=cache.directory.users.find(u=>u.id===p.get('id')&&u.role==='student');
  if(!s) return `<div class="empty">${aperture(40)}<h3>Student not found</h3></div>`;
  const reg=cache.academics.registrations[s.id]||[];
  const courses=reg.map(code=>cache.directory.courses.find(c=>c.code===code)).filter(Boolean).filter(c=>session.role==='desk_officer'||!c.lecturerId||c.lecturerId===session.id);
  const res=cache.academics.results.filter(r=>r.studentId===s.id);
  const rows=res.map(r=>`<tr><td><strong>${esc(r.courseId)}</strong></td><td>${esc(r.semester)}</td><td>${esc(r.score)}</td><td><span class="pill ${r.grade==='F'?'danger':'good'}">${esc(r.grade)}</span></td></tr>`).join('');
  return `<div class="eyebrow">Student details</div><h1 class="pagetitle">${esc(s.name)}</h1><p class="sub">${esc(s.regNo)} · ${esc(s.department)} · Level ${esc(s.level)}</p>
  <div class="grid grid-2"><div class="card"><h4 style="margin-top:0;color:var(--navy);">Enter a result</h4>${courses.length?`<form id="resultForm"><input type="hidden" name="studentId" value="${esc(s.id)}"><label for="rc">Course</label><select id="rc" name="course" required>${courses.map(c=>`<option value="${esc(c.code)}">${esc(c.code)} · ${esc(c.title)}</option>`).join('')}</select><label for="rsem">Semester</label><input id="rsem" name="semester" required value="1"><label for="rsc">Score (0–100)</label><input id="rsc" name="score" type="number" min="0" max="100" required><button class="btn" style="width:100%;margin-top:22px;" type="submit">Publish result</button></form>`:`<p style="color:var(--muted);font-size:14px;">This student has no registered course you can enter results for.</p>`}</div>
  <div class="card tablewrap"><h4 style="margin-top:0;color:var(--navy);">Results so far</h4><table><thead><tr><th>Course</th><th>Sem</th><th>Score</th><th>Grade</th></tr></thead><tbody>${rows||'<tr><td colspan="4" class="empty">None yet.</td></tr>'}</tbody></table></div></div>`;
}
function pageAdminCourses(){
  const rows=cache.directory.courses.map(c=>`<tr><td><strong>${esc(c.code)}</strong></td><td>${esc(c.title)}</td><td>${esc(c.dept)}</td><td>Lvl ${esc(c.level)} · Sem ${esc(c.semester)}</td></tr>`).join('');
  return `<div class="eyebrow">Desk officer</div><h1 class="pagetitle">Manage courses</h1><p class="sub">New courses are open for student registration immediately.</p><div class="grid grid-2"><div class="card"><form id="courseForm"><label for="cc">Course code</label><input id="cc" name="code" required><label for="ct">Course title</label><input id="ct" name="title" required><label for="cd">Department</label><select id="cd" name="dept">${deptOptions()}</select><label for="cl">Level</label><select id="cl" name="level"><option>100</option><option>200</option><option>300</option><option>400</option></select><label for="cs">Semester</label><select id="cs" name="semester"><option>1</option><option>2</option></select><button class="btn" style="width:100%;margin-top:22px;" type="submit">Add course</button></form></div><div class="card tablewrap"><h4 style="margin-top:0;color:var(--navy);">Current catalogue</h4><table><thead><tr><th>Code</th><th>Title</th><th>Dept</th><th>Level/Sem</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
}
function pageAdminIssues(){
  const list=cache.support.issues.slice().sort((a,b)=>b.ts-a.ts).map(i=>`<div class="postcard"><div class="meta"><div class="avatar" style="width:32px;height:32px;font-size:12px;">${initials(i.studentName)}</div><strong>${esc(i.studentName)}</strong><span class="pill ${i.status==='open'?'danger':'good'}">${esc(i.status)}</span><span class="date">${fmtDate(i.ts)}</span></div><h4 style="margin:0 0 6px;color:var(--navy);">${esc(i.subject)}</h4><p style="margin:0 0 12px;font-size:14px;">${esc(i.message)}</p>${i.reply?`<div style="background:var(--ghost);padding:12px 14px;border-radius:10px;"><strong style="font-size:12px;color:var(--navy);">Reply</strong><p style="margin:4px 0 0;font-size:13px;">${esc(i.reply)}</p></div>`:`<form class="replyForm" data-id="${esc(i.id)}"><textarea name="reply" placeholder="Write a reply" required></textarea><button class="btn small" style="margin-top:8px;" type="submit">Send reply and resolve</button></form>`}</div>`).join('');
  return `<div class="eyebrow">Desk officer</div><h1 class="pagetitle">Student issues</h1><p class="sub">Replying to an issue marks it resolved.</p>${list||`<div class="empty">${aperture(40)}<h3>No issues reported</h3></div>`}`;
}
function keyTable(list){
  if(!list.length) return '<p style="color:var(--muted);font-size:13px;margin:0;">No keys yet.</p>';
  return `<div class="tablewrap"><table><thead><tr><th>Key</th><th>Used by</th><th>Status</th><th></th></tr></thead><tbody>${list.map(k=>{const u=k.usedBy?cache.directory.users.find(x=>x.id===k.usedBy):null,on=k.status==='active';return `<tr><td><code>${esc(k.code)}</code></td><td>${u?esc(u.name):'<span style="color:var(--muted);">Not used yet</span>'}</td><td><span class="pill ${on?'good':'danger'}">${on?'Active':'Disabled'}</span></td><td><button class="btn small ${on?'danger':'outline'} keyToggle" data-id="${esc(k.id)}">${on?'Disable':'Enable'}</button></td></tr>`;}).join('')}</tbody></table></div>`;
}
function pageAdminKeys(){
  const ks=cache.keys.keys.slice().sort((a,b)=>b.createdAt-a.createdAt);
  const groups=[['hod','Heads of department'],['lecturer','Lecturers']].map(([role,label])=>`<h3 style="color:var(--navy);margin:28px 0 12px;">${label}</h3>`+DEPTS.map(d=>{const l=ks.filter(k=>k.role===role&&k.department===d);return l.length?`<div class="card" style="margin-bottom:14px;"><h4 style="margin:0 0 12px;">${esc(d)}</h4>${keyTable(l)}</div>`:'';}).join('')||'').join('');
  const desk=ks.filter(k=>k.role==='desk_officer');
  return `<div class="eyebrow">Desk officer</div><h1 class="pagetitle">Access keys</h1><p class="sub">Staff need a key to register and to keep logging in. Disable a key and its owner is locked out. Give each key to one person only.</p>
  <div class="card" style="max-width:480px;"><form id="keyForm"><label for="kr" style="margin-top:0;">Key for</label><select id="kr" name="role"><option value="hod">Head of department</option><option value="lecturer">Lecturer</option><option value="desk_officer">Desk officer</option></select><label for="kd">Department</label><select id="kd" name="department">${deptOptions()}</select><button class="btn" style="width:100%;margin-top:20px;" type="submit">Generate key</button></form></div>
  ${groups}${desk.length?`<h3 style="color:var(--navy);margin:28px 0 12px;">Desk officers</h3><div class="card">${keyTable(desk)}</div>`:''}`;
}

function attachAdmin(path){
  const form=(id,fn)=>{const f=document.getElementById(id); if(f) f.onsubmit=async e=>{e.preventDefault(); try{await fn(new FormData(f));}catch(err){console.error(err);flash={type:'err',text:'Something went wrong. Please try again.'};render();}};};
  const fail=t=>{flash={type:'err',text:t};render();};
  const ok=(t,h)=>{flash={type:'ok',text:t};nav(h);};

  form('staffLogin',async f=>{
    const email=f.get('email').trim().toLowerCase(), h=await sha(f.get('password'));
    const u=cache.directory.users.find(u=>(u.email||'').toLowerCase()===email&&u.role!=='student');
    if(!u||(u.pwHash&&u.pwHash!==h)) return fail('Incorrect email or password.');
    if(u.keyId){
      const k=cache.keys.keys.find(k=>k.id===u.keyId);
      if(!k||k.status!=='active') return fail('Your access has been disabled. See the desk officer.');
      if((f.get('key')||'').trim().toUpperCase()!==k.code) return fail('Incorrect access key.');
    } else if(u.role!=='desk_officer'){
      const code=(f.get('key')||'').trim().toUpperCase();
      if(!code) return fail('Enter your access key. Get one from the desk officer.');
      const k=cache.keys.keys.find(k=>k.code===code);
      if(!k||k.status!=='active'||k.usedBy||k.role!==u.role||k.department!==u.department) return fail('That access key is not valid for your account.');
      k.usedBy=u.id; u.keyId=k.id; await save('keys');
    }
    if(!u.pwHash) u.pwHash=h;
    await save('directory'); needKey=false; setSession(u); ok(`Welcome, ${u.name}.`,'#/admin/dashboard');
  });
  form('staffReg',async f=>{
    const email=f.get('email').trim().toLowerCase(), err=checkEmail(email);
    if(err) return fail(err);
    if(f.get('password').length<6) return fail('Password must be at least 6 characters.');
    if(cache.directory.users.some(u=>(u.email||'').toLowerCase()===email)) return fail('An account with that email already exists. Log in instead.');
    const first=!cache.directory.users.some(u=>u.role==='desk_officer'), code=(f.get('key')||'').trim().toUpperCase();
    let role,dept,key=null;
    if(first&&!code){role='desk_officer';dept='Administration';}
    else{
      key=cache.keys.keys.find(k=>k.code===code);
      if(!key||key.status!=='active'||key.usedBy) return fail('That access key is not valid. Ask the desk officer for a new one.');
      role=key.role; dept=key.department;
    }
    const u={id:uid(),name:f.get('name').trim(),email,role,department:dept,level:null,pwHash:await sha(f.get('password')),keyId:key?key.id:null,createdAt:Date.now()};
    cache.directory.users.push(u); if(key) key.usedBy=u.id;
    await save('directory'); if(key) await save('keys');
    setSession(u); ok(`Account created. You are registered as ${ROLE_LABEL[role]}.`,'#/admin/dashboard');
  });
  form('keyForm',async f=>{
    const role=f.get('role'), dept=role==='desk_officer'?'Administration':f.get('department');
    const k={id:uid(),code:genKey(),role,department:dept,status:'active',usedBy:null,createdAt:Date.now()};
    cache.keys.keys.push(k); await save('keys'); ok(`New key generated: ${k.code}`,'#/admin/keys');
  });
  document.querySelectorAll('.keyToggle').forEach(b=>b.onclick=async()=>{
    const k=cache.keys.keys.find(k=>k.id===b.dataset.id); if(!k) return;
    k.status=k.status==='active'?'disabled':'active'; await save('keys'); ok(k.status==='active'?'Key enabled.':'Key disabled. Its owner can no longer log in.','#/admin/keys');
  });
  form('findForm',async f=>{ nav('#/admin/results?q='+encodeURIComponent(f.get('q').trim())); });
  form('resultForm',async f=>{
    const score=Number(f.get('score')); if(!(score>=0&&score<=100)) return fail('Score must be between 0 and 100.');
    const courseId=f.get('course'), studentId=f.get('studentId');
    const rec={id:uid(),studentId,courseId,score,grade:gradeFor(score),semester:f.get('semester').trim()};
    const i=cache.academics.results.findIndex(r=>r.courseId===courseId&&r.studentId===studentId);
    if(i>-1) cache.academics.results[i]=rec; else cache.academics.results.push(rec);
    const c=cache.directory.courses.find(c=>c.code===courseId); if(c&&!c.lecturerId&&session.role==='lecturer') c.lecturerId=session.id;
    await save('academics'); await save('directory'); ok('Result published to the student.',location.hash);
  });
  form('courseForm',async f=>{
    const code=f.get('code').trim().toUpperCase();
    if(cache.directory.courses.some(c=>c.code===code)) return fail('A course with that code already exists.');
    cache.directory.courses.push({code,title:f.get('title').trim(),dept:f.get('dept'),level:f.get('level'),semester:f.get('semester'),lecturerId:null});
    await save('directory'); ok(`${code} added to the catalogue.`,'#/admin/courses');
  });
  document.querySelectorAll('.replyForm').forEach(rf=>rf.onsubmit=async e=>{
    e.preventDefault();
    const i=cache.support.issues.find(i=>i.id===rf.dataset.id); i.reply=new FormData(rf).get('reply'); i.status='resolved';
    await save('support'); ok('Reply sent and issue resolved.','#/admin/issues');
  });
  if(path==='/admin/timetable'){
    const p=hashParams(), level=p.get('level')||'100', sem=p.get('sem')||'1', dept=session.department;
    const go2=(l,s,o)=>nav(`#/admin/timetable?level=${l}&sem=${s}${o?'&open='+encodeURIComponent(o):''}`);
    document.getElementById('ttLevel').onchange=e=>go2(e.target.value,sem,'');
    document.getElementById('ttSem').onchange=e=>go2(level,e.target.value,'');
    document.querySelectorAll('.ttAdd').forEach(fm=>fm.onsubmit=async e=>{
      e.preventDefault();
      const f=new FormData(fm), day=fm.dataset.day, course=f.get('course'), start=Number(f.get('start')), end=Number(f.get('end'));
      if(!course) return fail('Add courses for your department first (desk officer).');
      if(end<=start) return fail('The end time must be after the start time.');
      let tt=cache.academics.timetables.find(t=>t.department===dept&&t.level===level&&t.semester===sem&&Array.isArray(t.entries));
      if(!tt){tt={id:uid(),department:dept,level,semester:sem,entries:[],ts:Date.now(),uploadedBy:session.name};cache.academics.timetables.push(tt);}
      if(tt.entries.some(x=>x.day===day&&x.start<end&&start<x.end)) return fail(`That time overlaps another class on ${day}.`);
      tt.entries.push({id:uid(),day,course,start,end,venue:(f.get('venue')||'').trim()}); tt.ts=Date.now();
      await save('academics'); ok(`${course} added to ${day}.`,`#/admin/timetable?level=${level}&sem=${sem}&open=${encodeURIComponent(day)}`);
    });
    document.querySelectorAll('.ttDel').forEach(b=>b.onclick=async()=>{
      const tt=cache.academics.timetables.find(t=>t.department===dept&&t.level===level&&t.semester===sem&&Array.isArray(t.entries)); if(!tt) return;
      const en=tt.entries.find(x=>x.id===b.dataset.id); tt.entries=tt.entries.filter(x=>x.id!==b.dataset.id); tt.ts=Date.now();
      await save('academics'); ok('Class removed.',`#/admin/timetable?level=${level}&sem=${sem}&open=${encodeURIComponent(en?en.day:'')}`);
    });
  }
}


function pageForgot(staff){
  return `<div class="eyebrow">${staff?'Staff':'Account'} help</div><h1 class="pagetitle">Forgot password</h1><p class="sub">Enter the email you registered with. We will send a 6-digit code to it.</p><div class="card" style="max-width:440px;"><form id="forgotForm" data-staff="${staff?1:0}" novalidate><label for="fe">Email</label><input id="fe" name="email" type="email" required autocomplete="email"><button class="btn" style="width:100%;margin-top:22px;" type="submit">Send code</button></form></div>`;
}
function pageReset(staff){
  const email=hashParams().get('email')||'';
  return `<div class="eyebrow">${staff?'Staff':'Account'} help</div><h1 class="pagetitle">Reset password</h1><p class="sub">Open the email we sent to ${esc(email||'your inbox')}, copy the 6-digit code and choose a new password. The code lasts 10 minutes.</p><div class="card" style="max-width:440px;"><form id="resetForm" data-staff="${staff?1:0}" novalidate><label for="rm">Email</label><input id="rm" name="email" type="email" required value="${esc(email)}"><label for="rcd">6-digit code</label><input id="rcd" name="code" required inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="123456"><label for="rn1">New password</label><input id="rn1" name="password" type="password" required minlength="6" autocomplete="new-password"><label for="rn2">Confirm new password</label><input id="rn2" name="confirm" type="password" required autocomplete="new-password"><button class="btn" style="width:100%;margin-top:22px;" type="submit">Reset password</button></form><p style="text-align:center;font-size:13px;margin-top:16px;"><a href="#/${staff?'admin/':''}forgot" style="color:var(--orange);font-weight:700;">Send a new code</a></p></div>`;
}
function attachReset(){
  const form=(id,fn)=>{const f=document.getElementById(id); if(f) f.onsubmit=async e=>{e.preventDefault(); const btn=f.querySelector('button[type=submit]'); if(btn) btn.disabled=true; try{await fn(new FormData(f),f.dataset.staff==='1');}catch(err){flash={type:'err',text:err.message||'Something went wrong. Please try again.'};render();}};};
  const post=(path,body)=>api(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  form('forgotForm',async(f,staff)=>{
    const email=f.get('email').trim().toLowerCase(), err=checkEmail(email); if(err) throw new Error(err);
    await post('/api/forgot',{email,portal:staff?'staff':'student'});
    flash={type:'ok',text:'If that email is registered, a 6-digit code has been sent to it.'};
    go(`#/${staff?'admin/':''}reset?email=${encodeURIComponent(email)}`);
  });
  form('resetForm',async(f,staff)=>{
    const email=f.get('email').trim().toLowerCase(), code=f.get('code').trim(), pw=f.get('password');
    if(!/^\d{6}$/.test(code)) throw new Error('Enter the 6-digit code from your email.');
    if(pw.length<6) throw new Error('Password must be at least 6 characters.');
    if(pw!==f.get('confirm')) throw new Error('The two passwords do not match.');
    await post('/api/reset',{email,code,password:pw,portal:staff?'staff':'student'});
    flash={type:'ok',text:'Password changed. You can log in now.'}; go(staff?'#/admin':'#/login');
  });
}
async function render(){
  const app=document.getElementById('app');
  let rawHash=location.hash||'#/'; if(/^#admin\/?$/i.test(rawHash)) rawHash='#/admin';
  const [path,qs]=rawHash.slice(1).split('?');
  const params=new URLSearchParams(qs||'');
  if(PORTAL==='student'&&path.startsWith('/admin')){ go('#/'); return; }
  if(!loaded){ await loadAll(); } else { await refreshAll(); }
  if(!session){ try{const id=sessionStorage.getItem(SKEY); if(id) session=cache.directory.users.find(u=>u.id===id)||null;}catch(e){} }
  if(session&&session.role!=='student'&&session.keyId){
    const k=cache.keys.keys.find(k=>k.id===session.keyId);
    if(!k||k.status!=='active'){ session=null; try{sessionStorage.removeItem(SKEY);}catch(e){} flash={type:'err',text:'Your access has been disabled. See the desk officer.'}; if(location.hash!=='#/admin'){go('#/admin');return;} }
  }
  if(PORTAL==='staff'&&!path.startsWith('/admin')){
    if(!session||session.role==='student'){ go('#/admin'); return; }
    if(!['/community','/community/new','/vault','/vault/item'].includes(path)){ go('#/admin/dashboard'); return; }
  }
  let body='', back=null;
  switch(path){
    case '/': body=pageHome(); break;
    case '/login': body=pageLogin(); break;
    case '/register': body=pageRegister(); break;
    case '/newsletter': body=pageNewsletter(); break;
    case '/forgot': body=pageForgot(false); back='#/login'; break;
    case '/reset': body=pageReset(false); back='#/forgot'; break;
    case '/admin/forgot': body=pageForgot(true); back='#/admin'; break;
    case '/admin/reset': body=pageReset(true); back='#/admin/forgot'; break;
    case '/admin': if(session&&session.role!=='student'){go('#/admin/dashboard');return;} body=pageAdminLogin(); break;
    case '/admin/register': body=pageAdminRegister(); back='#/admin'; break;
    case '/admin/dashboard': if(!requireStaff()) return; body=pageAdminDashboard(); break;
    case '/admin/timetable': if(!requireStaff(['hod'])) return; body=pageAdminTimetable(); break;
    case '/admin/results': if(!requireStaff(['lecturer','desk_officer'])) return; body=pageAdminResults(); break;
    case '/admin/results/student': if(!requireStaff(['lecturer','desk_officer'])) return; body=pageAdminStudent(); back='#/admin/results?q='+encodeURIComponent(params.get('q')||''); break;
    case '/admin/courses': if(!requireStaff(['desk_officer'])) return; body=pageAdminCourses(); break;
    case '/admin/issues': if(!requireStaff(['desk_officer'])) return; body=pageAdminIssues(); break;
    case '/admin/keys': if(!requireStaff(['desk_officer'])) return; body=pageAdminKeys(); break;
    case '/dashboard': if(!requireStudent()) return; body=pageDashboard(); break;
    case '/profile': if(!requireStudent()) return; body=pageProfile(); break;
    case '/profile/edit': if(!requireStudent()) return; body=pageProfileEdit(); back='#/profile'; break;
    case '/courses': if(!requireStudent()) return; body=pageCourses(); break;
    case '/results': if(!requireStudent()) return; body=pageResults(); break;
    case '/timetable': if(!requireStudent()) return; body=pageTimetable(); break;
    case '/reminders': if(!requireStudent()) return; body=pageReminders(); break;
    case '/reminders/new': if(!requireStudent()) return; body=pageReminderNew(); back='#/reminders'; break;
    case '/community': body=pageCommunity(params.get('type')); break;
    case '/community/new': if(!requireLogin()) return; body=pageCommunityNew(); back='#/community'; break;
    case '/vault': body=pageVault(params.get('open')); break;
    case '/vault/item': { const it=cache.vault.resources.find(r=>r.id===params.get('id')); body=pageVaultItem(it); back=it?'#/vault?open='+encodeURIComponent(it.category):'#/vault'; break; }
    case '/support/new': if(!requireStudent()) return; body=pageSupportNew(); back='#/dashboard'; break;
    default: body=`<div class="empty">${aperture(48)}<h3>Page not found</h3><a class="btn" href="#/">Go home</a></div>`;
  }
  app.innerHTML=layout(body,path,back);
  attachHandlers(path);
  window.scrollTo(0,0);
}
window.addEventListener('hashchange',render);
render();

function navFor(){
  if(!session) return PORTAL==='staff'?[]:[['#/','Home'],['#/community','Community'],['#/vault','Resource Vault']];
  const common=[['#/community','Community'],['#/vault','Vault']];
  if(session.role==='hod') return [['#/admin/dashboard','Dashboard'],['#/admin/timetable','Timetable'],...common];
  if(session.role==='lecturer') return [['#/admin/dashboard','Dashboard'],['#/admin/results','Results'],...common];
  if(session.role==='desk_officer') return [['#/admin/dashboard','Dashboard'],['#/admin/results','Results'],['#/admin/courses','Courses'],['#/admin/issues','Issues'],['#/admin/keys','Access keys'],...common];
  return [['#/dashboard','Dashboard'],['#/courses','Courses'],['#/results','Results'],['#/timetable','Timetable'],['#/reminders','Reminders'],['#/community','Community'],['#/vault','Vault']];
}
function layout(body,path,back){
  const staff=session&&session.role!=='student';
  const nav=navFor().map(([h,l])=>`<a href="${h}" class="${('#'+path)===h?'active':''}">${l}</a>`).join('');
  const right=!session?(PORTAL==='staff'?`<a href="#/admin" class="navbtn ghost">Log In</a><a href="#/admin/register" class="navbtn">Register</a>`:`<a href="#/login" class="navbtn ghost">Log In</a><a href="#/register" class="navbtn">Register</a>`)
    :staff?`<div class="userchip">${avatarHtml(session,28)}${esc(session.name)} · ${esc(ROLE_LABEL[session.role]||session.role)}</div><button class="navbtn" id="logoutBtn">Log Out</button>`
    :`<div class="userchip">${avatarHtml(session,28)}${esc(session.name)}</div><a href="#/profile" class="navbtn ghost">Profile</a><button class="navbtn" id="logoutBtn">Log Out</button>`;
  const fl=flash?`<div class="msg ${flash.type==='err'?'err':'ok'}" style="max-width:1132px;margin:16px auto 0;" role="status">${esc(flash.text)}</div>`:'';
  flash=null;
  const showBack=!['/','/dashboard','/admin','/admin/dashboard'].includes(path);
  const backBtn=showBack?`<button class="backbtn" id="backBtn" data-back="${esc(back||'')}">← Back</button>`:'';
  return `<header class="top"><div class="top-inner"><a href="${staff?'#/admin/dashboard':(PORTAL==='staff'?'#/admin':'#/')}" class="brand-wrap">${logoMark(30)}<div><div class="brand">EIKON<span>.</span></div><div class="tagline">Becoming What You See</div></div></a><nav class="mainnav">${nav}</nav><div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">${right}</div></div></header>
  ${fl}<main class="page-enter">${backBtn}${body}</main><div class="footerbar">Eikon Academy · ${PORTAL==='staff'?'Staff Portal':'Student Portal'}</div>`;
}
function dashCard(href,title,text){return `<a href="${href}" class="card" style="display:block;">${aperture(28)}<h4 style="color:var(--navy);margin:10px 0 4px;">${title}</h4><p style="color:var(--muted);font-size:13px;margin:0;">${text}</p></a>`;}

function pageHome(){
  return `<div class="hero"><div class="eyebrow" style="color:#F2A93C">Eikon Academy · Student Portal</div><h1>Becoming what you see, together.</h1><p>Register your courses, check your results, follow your timetable and join the Eikon community, all in one place.</p><div class="hero-actions"><a href="#/register" class="btn">Register</a><a href="#/login" class="btn outline" style="border-color:#fff;color:#fff;">Log in</a></div></div>
  <div class="card" style="margin-bottom:20px;"><div class="eyebrow">About the academy</div><h2 style="color:var(--navy);margin:0 0 10px;">Eikon Academy</h2><p style="margin:0;line-height:1.7;color:var(--text);max-width:760px;">Eikon Academy trains creatives in photography, film and video, and design. Students learn by doing: in the studio, on location and together as a community. [Replace with the academy’s official description.]</p></div>
  <div class="grid grid-2" style="margin-bottom:20px;"><div class="card"><div class="eyebrow">Our vision</div><p style="margin:0;line-height:1.7;">To be a leading creative academy that helps people see the world clearly and turn what they see into lasting work. [Replace with the official vision.]</p></div><div class="card"><div class="eyebrow">Our mission</div><p style="margin:0;line-height:1.7;">To give every student practical skills, strong mentorship and a creative community that supports them from first class to first client. [Replace with the official mission.]</p></div></div>
  <div class="card" style="display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;"><div><div class="eyebrow">Newsletter</div><h3 style="margin:0 0 6px;color:var(--navy);">Stay in the loop</h3><p style="margin:0;color:var(--muted);font-size:14px;">Academy news, events and opportunities, sent to your email.</p></div><a href="#/newsletter" class="btn">Subscribe</a></div>`;
}
function pageNewsletter(){
  return `<div class="eyebrow">Newsletter</div><h1 class="pagetitle">Subscribe</h1><p class="sub">Enter a real email address you check. Newsletters and academy reports are sent here.</p><div class="card" style="max-width:440px;"><form id="newsForm" novalidate><label for="ne">Email</label><input id="ne" name="email" type="email" required value="${esc(session?session.email:'')}"><button class="btn" style="width:100%;margin-top:22px;" type="submit">Subscribe</button></form></div>`;
}
function pageLogin(){
  return `<div class="eyebrow">Access your account</div><h1 class="pagetitle">Log in</h1><p class="sub">Use your email or your registration number.</p>
  <div class="card" style="max-width:440px;"><form id="loginForm"><label for="li">Email or registration number</label><input id="li" name="id" required placeholder="you@gmail.com or CRE/123456789AB" autocomplete="username"><label for="lp">Password</label><input id="lp" type="password" name="password" required autocomplete="current-password"><button class="btn navy" style="width:100%;margin-top:22px;" type="submit">Log in</button></form>
  <p style="text-align:center;font-size:13px;margin-top:16px;"><a href="#/forgot" style="color:var(--orange);font-weight:700;">Forgot password?</a></p><p style="text-align:center;font-size:13px;color:var(--muted);margin-top:8px;">No account yet? <a href="#/register" style="color:var(--orange);font-weight:700;">Register</a></p></div>`;
}
function pageRegister(){
  return `<div class="eyebrow">Join Eikon Academy</div><h1 class="pagetitle">Student registration</h1><p class="sub">Your registration number is generated automatically once you register.</p>
  <div class="card" style="max-width:520px;"><form id="regForm" novalidate>
    <label for="rn">Full name</label><input id="rn" name="name" required autocomplete="name">
    <label for="re">Email</label><input id="re" name="email" type="email" required autocomplete="email" placeholder="you@gmail.com">
    <label for="rp">Password</label><input id="rp" name="password" type="password" required minlength="6" autocomplete="new-password">
    <label for="rd">Department</label><select id="rd" name="department"><option>Photography</option><option>Film &amp; Video</option><option>Design</option><option>General Studies</option></select>
    <label for="rl">Level</label><select id="rl" name="level"><option>100</option><option>200</option><option>300</option><option>400</option></select>
    <button class="btn" style="width:100%;margin-top:22px;" type="submit">Register</button></form>
  <p style="text-align:center;font-size:13px;color:var(--muted);margin-top:16px;">Already registered? <a href="#/login" style="color:var(--orange);font-weight:700;">Log in</a></p></div>`;
}
function missingProfile(u){ const m=[]; if(!u.photo)m.push('picture'); if(!u.dob)m.push('date of birth'); if(!u.state)m.push('state of origin'); if(!u.country)m.push('country'); if(!u.phone)m.push('phone number'); return m; }
function pageDashboard(){
  const reg=cache.academics.registrations[session.id]||[];
  const res=cache.academics.results.filter(r=>r.studentId===session.id);
  const miss=missingProfile(session);
  return `<div class="eyebrow">Welcome back</div><h1 class="pagetitle">${esc(session.name)}</h1><p class="sub">${esc(session.regNo||'')} · ${esc(session.department)} · Level ${esc(session.level||'—')}</p>
  ${miss.length?`<a href="#/profile/edit" class="card" style="display:block;margin-bottom:24px;border-color:var(--orange);"><strong style="color:var(--navy);">Complete your profile</strong><p style="margin:4px 0 0;color:var(--muted);font-size:13px;">Still missing: ${miss.join(', ')}.</p></a>`:''}
  <div class="grid grid-4" style="margin-bottom:32px;"><div class="stat"><div class="n">${reg.length}</div><div class="l">Courses registered</div></div><div class="stat"><div class="n">${res.length}</div><div class="l">Results published</div></div><div class="stat"><div class="n">${(session.reminders||[]).length}</div><div class="l">Class reminders</div></div><div class="stat"><div class="n">${cache.community.posts.length}</div><div class="l">Community posts</div></div></div>
  <div class="grid grid-3">${dashCard('#/courses','Register courses','Sign up for this semester’s courses.')}${dashCard('#/results','View results','Check grades as they are published.')}${dashCard('#/timetable','Class timetable','See your department’s schedule.')}${dashCard('#/reminders','Class reminders','Get a phone alert 10 minutes before class.')}${dashCard('#/community','Community','Share work, find collaborators, see opportunities.')}${dashCard('#/vault','Resource vault','Templates, presets, fonts, tutorials and more.')}${dashCard('#/support/new','Raise an issue','Get help from the academy desk.')}</div>`;
}
function row(l,v){return `<div style="display:flex;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid var(--line);font-size:14px;"><span style="color:var(--muted);">${l}</span><strong style="text-align:right;">${v?esc(v):'<span style="color:var(--muted);font-weight:500;">Not added</span>'}</strong></div>`;}
function pageProfile(){
  const u=session;
  return `<div class="eyebrow">Account</div><div class="toprow"><h1 class="pagetitle">My profile</h1><a href="#/profile/edit" class="btn small">Edit profile</a></div>
  <div class="card" style="max-width:560px;margin-top:16px;"><div style="display:flex;align-items:center;gap:16px;margin-bottom:12px;">${avatarHtml(u,72)}<div><div style="font-weight:800;font-size:18px;color:var(--navy);">${esc(u.name)}</div><span class="pill navy">${esc(u.regNo||'')}</span></div></div>
  ${row('Registration number',u.regNo)}${row('Email',u.email)}${row('Email status',u.emailVerified?'Verified':'Not yet verified')}${row('Department',u.department)}${row('Level',u.level)}${row('Date of birth',u.dob?new Date(u.dob).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}):'')}${row('State of origin',u.state)}${row('Country',u.country)}${row('Phone number',u.phone)}</div>`;
}
function pageProfileEdit(){
  const u=session;
  return `<div class="eyebrow">Account</div><h1 class="pagetitle">Edit profile</h1><p class="sub">Your name, email and registration number can’t be changed here. Contact the academy desk if one is wrong.</p>
  <div class="card" style="max-width:520px;"><form id="profileForm" novalidate>
    <div style="display:flex;align-items:center;gap:14px;">${avatarHtml(u,64)}<div style="flex:1;"><label for="pp" style="margin-top:0;">Picture</label><input id="pp" name="photo" type="file" accept="image/*"></div></div>
    <label for="pd">Date of birth</label><input id="pd" name="dob" type="date" required value="${esc(u.dob||'')}" max="${new Date().toISOString().slice(0,10)}">
    <label for="ps">State of origin</label><input id="ps" name="state" required value="${esc(u.state||'')}">
    <label for="pc">Country</label><input id="pc" name="country" required value="${esc(u.country||'')}">
    <label for="ph">Phone number</label><input id="ph" name="phone" type="tel" required value="${esc(u.phone||'')}" placeholder="+234 801 234 5678">
    <label>Email</label><input value="${esc(u.email)}" disabled>
    <label>Registration number</label><input value="${esc(u.regNo||'')}" disabled>
    <button class="btn" style="width:100%;margin-top:22px;" type="submit">Save profile</button></form></div>`;
}
function pageCourses(){
  const reg=cache.academics.registrations[session.id]||[];
  const rows=cache.directory.courses.map(c=>`<tr><td><strong>${esc(c.code)}</strong></td><td>${esc(c.title)}</td><td>${esc(c.dept)}</td><td>Lvl ${esc(c.level)} · Sem ${esc(c.semester)}</td><td>${reg.includes(c.code)?'<span class="pill good">Registered</span>':`<button class="btn small regBtn" data-code="${esc(c.code)}">Register</button>`}</td></tr>`).join('');
  return `<div class="eyebrow">Academics</div><h1 class="pagetitle">Course registration</h1><p class="sub">Register for the courses you are taking this semester.</p><div class="card tablewrap"><table><thead><tr><th>Code</th><th>Title</th><th>Dept</th><th>Level/Sem</th><th></th></tr></thead><tbody>${rows||'<tr><td colspan="5" class="empty">No courses added yet.</td></tr>'}</tbody></table></div>`;
}
function pageResults(){
  const rows=cache.academics.results.filter(r=>r.studentId===session.id).map(r=>{const c=cache.directory.courses.find(c=>c.code===r.courseId);return `<tr><td><strong>${esc(r.courseId)}</strong></td><td>${esc(c?c.title:'')}</td><td>${esc(r.semester)}</td><td>${esc(r.score)}</td><td><span class="pill ${r.grade==='F'?'danger':'good'}">${esc(r.grade)}</span></td></tr>`;}).join('');
  return `<div class="eyebrow">Academics</div><h1 class="pagetitle">My results</h1><p class="sub">Results appear here once the academy publishes them.</p><div class="card tablewrap"><table><thead><tr><th>Course</th><th>Title</th><th>Semester</th><th>Score</th><th>Grade</th></tr></thead><tbody>${rows||'<tr><td colspan="5" class="empty">No results published yet.</td></tr>'}</tbody></table></div>`;
}
function myTimetable(){return cache.academics.timetables.filter(t=>t.department===session.department&&t.level===session.level&&Array.isArray(t.entries)&&t.entries.length).sort((a,b)=>b.ts-a.ts)[0];}
function pageTimetable(){
  const t=myTimetable();
  return `<div class="eyebrow">Academics</div><h1 class="pagetitle">Class timetable · ${esc(session.department)}</h1><p class="sub">Level ${esc(session.level)}. Published by your head of department each semester.</p>`+
  (t?`<div class="card"><div style="display:flex;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:8px;"><span class="pill orange">Level ${esc(t.level)} · Semester ${esc(t.semester)}</span><span style="font-size:12px;color:var(--muted);">Updated ${fmtDate(t.ts)}</span></div>${timetableGrid(t.entries)}<div style="margin-top:18px;"><button class="btn navy" id="ttRem">Set phone reminders for these classes</button></div></div>`:`<div class="empty">${aperture(40)}<h3>No timetable yet</h3><p>Check back once your department publishes this semester’s schedule.</p></div>`);
}

const DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const BYDAY=['SU','MO','TU','WE','TH','FR','SA'];
function fmt12(t){const [h,m]=t.split(':').map(Number);return ((h%12)||12)+':'+String(m).padStart(2,'0')+' '+(h<12?'AM':'PM');}
function icsEsc(s){return String(s).replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\n/g,'\\n');}
function icsFor(list){
  const pad=n=>String(n).padStart(2,'0');
  const stamp=new Date().toISOString().replace(/[-:]/g,'').slice(0,15)+'Z';
  const fmt=x=>x.getFullYear()+pad(x.getMonth()+1)+pad(x.getDate())+'T'+pad(x.getHours())+pad(x.getMinutes())+'00';
  const out=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Eikon Academy//Class Reminders//EN','CALSCALE:GREGORIAN'];
  list.forEach(r=>{
    const di=DAYS.indexOf(r.day), [h,m]=r.time.split(':').map(Number);
    const d=new Date(); d.setHours(h,m,0,0);
    let diff=(di-d.getDay()+7)%7; if(diff===0&&d<new Date()) diff=7; d.setDate(d.getDate()+diff);
    const end=new Date(d.getTime()+60*60000);
    out.push('BEGIN:VEVENT','UID:'+r.id+'@eikon-academy','DTSTAMP:'+stamp,'SUMMARY:'+icsEsc(r.code+' class'),'DTSTART:'+fmt(d),'DTEND:'+fmt(end),'RRULE:FREQ=WEEKLY;BYDAY='+BYDAY[di]);
    if(r.venue) out.push('LOCATION:'+icsEsc(r.venue));
    out.push('BEGIN:VALARM','TRIGGER:-PT10M','ACTION:DISPLAY','DESCRIPTION:'+icsEsc(r.code+' holds in 10 minutes, starts by '+fmt12(r.time)),'END:VALARM','END:VEVENT');
  });
  out.push('END:VCALENDAR');
  return out.join('\r\n');
}
function pageReminders(){
  const list=session.reminders||[];
  const rows=list.map(r=>`<tr><td><strong>${esc(r.code)}</strong></td><td>${esc(r.day)} ${esc(fmt12(r.time))}</td><td>${esc(r.venue||'')}</td><td style="white-space:nowrap;"><button class="btn small icsBtn" data-id="${esc(r.id)}">Add to phone</button> <button class="btn small outline delRem" data-id="${esc(r.id)}">Remove</button></td></tr>`).join('');
  return `<div class="eyebrow">Class reminders</div><div class="toprow"><div><h1 class="pagetitle">Reminders</h1><p class="sub">Add your classes, then save them to your phone’s calendar. Your phone alerts you 10 minutes before each class, with or without data.</p></div><a href="#/reminders/new" class="btn small">Add a class</a></div>
  <div class="card tablewrap">${list.length?`<table><thead><tr><th>Class</th><th>When</th><th>Venue</th><th></th></tr></thead><tbody>${rows}</tbody></table><div style="margin-top:18px;"><button class="btn navy" id="icsAll">Add all to phone calendar</button></div>`:`<div class="empty">${aperture(40)}<h3>No classes added yet</h3><p>Add a class to set up its reminder.</p></div>`}</div>
  <p class="sub" style="margin-top:18px;font-size:13px;">The alert style (sound, banner colour) is set by your phone’s calendar app, so it can’t be forced to the academy’s navy blue. A fully custom alarm that rings like a clock needs a dedicated Eikon phone app.</p>`;
}
function pageReminderNew(){
  const codes=(cache.academics.registrations[session.id]||[]);
  return `<div class="eyebrow">Class reminders</div><h1 class="pagetitle">Add a class</h1><p class="sub">The reminder will say, for example, “GST 101 holds in 10 minutes, starts by 9:00 AM”.</p><div class="card" style="max-width:480px;"><form id="remForm"><label for="rc">Course code</label><input id="rc" name="code" required list="regCodes" placeholder="GST 101"><datalist id="regCodes">${codes.map(c=>`<option value="${esc(c)}">`).join('')}</datalist><label for="rday">Day</label><select id="rday" name="day">${DAYS.slice(1).concat(DAYS[0]).map(d=>`<option>${d}</option>`).join('')}</select><label for="rt">Start time</label><input id="rt" name="time" type="time" required><label for="rv">Venue (optional)</label><input id="rv" name="venue"><button class="btn" style="width:100%;margin-top:22px;" type="submit">Save class</button></form></div>`;
}

function pageCommunity(f){
  const posts=cache.community.posts.filter(p=>!f||p.type===f).sort((a,b)=>b.ts-a.ts);
  const tabs=[['','All'],['work','Shared work'],['collab','Find collaborators'],['opportunity','Opportunities']].map(([v,l])=>`<a href="#/community${v?'?type='+v:''}" class="${(f||'')===v?'active':''}">${l}</a>`).join('');
  const list=posts.map(p=>`<div class="postcard"><div class="meta"><div class="avatar" style="width:32px;height:32px;font-size:12px;">${initials(p.authorName)}</div><strong>${esc(p.authorName)}</strong><span class="pill ${p.type==='opportunity'?'orange':p.type==='collab'?'navy':'good'}">${p.type==='collab'?'Collaborator':p.type==='opportunity'?'Opportunity':'Work'}</span><span class="date">${fmtDate(p.ts)}</span></div><h4 style="margin:0 0 6px;color:var(--navy);">${esc(p.title)}</h4><p style="margin:0;font-size:14px;line-height:1.6;">${esc(p.body)}</p></div>`).join('');
  return `<div class="eyebrow">Eikon Community</div><div class="toprow"><div><h1 class="pagetitle">Community board</h1><p class="sub">Share your work, find collaborators, and post or find opportunities.</p></div><a href="#/community/new" class="btn small">New post</a></div><div class="tabbar">${tabs}</div>${list||`<div class="empty">${aperture(40)}<h3>Nothing here yet</h3><p>Be the first to post.</p></div>`}`;
}
function pageCommunityNew(){
  return `<div class="eyebrow">Eikon Community</div><h1 class="pagetitle">Create a post</h1><p class="sub">Posts appear on the community board for everyone at the academy.</p><div class="card" style="max-width:560px;"><form id="postForm"><label for="pt">Post type</label><select id="pt" name="type"><option value="work">Share work</option><option value="collab">Find a collaborator</option><option value="opportunity">Announce an opportunity</option></select><label for="ptt">Title</label><input id="ptt" name="title" required><label for="pb">Details</label><textarea id="pb" name="body" required></textarea><button class="btn" style="width:100%;margin-top:22px;" type="submit">Publish post</button></form></div>`;
}
function pageVault(open){
  const cats=[...new Set(cache.vault.resources.map(r=>r.category))];
  const acc=cats.map((c,i)=>{
    const items=cache.vault.resources.filter(r=>r.category===c);
    const isOpen=open===c;
    return `<div class="acc"><button class="acc-head" aria-expanded="${isOpen}" aria-controls="acc${i}"><span>${esc(c)} <span class="acc-count">${items.length}</span></span><span class="acc-chev" aria-hidden="true">▾</span></button><div class="acc-body" id="acc${i}" ${isOpen?'':'hidden'}>${items.map(r=>`<a class="acc-item" href="#/vault/item?id=${encodeURIComponent(r.id)}"><span>${esc(r.title)}</span><span aria-hidden="true">›</span></a>`).join('')}</div></div>`;
  }).join('');
  return `<div class="eyebrow">Resources</div><h1 class="pagetitle">Resource vault</h1><p class="sub">Tap a category to see what’s inside, then tap an item to open it.</p><div style="max-width:720px;">${acc}</div>`;
}
function pageVaultItem(it){
  if(!it) return `<div class="empty">${aperture(40)}<h3>Resource not found</h3></div>`;
  return `<div class="eyebrow">${esc(it.category)}</div><h1 class="pagetitle">${esc(it.title)}</h1><p class="sub">${esc(it.description)}</p><div class="card" style="max-width:560px;"><span class="pill orange">${esc(it.category)}</span><p style="color:var(--muted);font-size:14px;line-height:1.6;margin:14px 0;">The file for this resource will be added by the academy. Downloads are not switched on yet.</p><button class="btn outline" disabled>Download (coming soon)</button></div>`;
}
function pageSupportNew(){
  return `<div class="eyebrow">Help</div><h1 class="pagetitle">Raise an issue</h1><p class="sub">Registration problems, wrong results, timetable clashes, anything else. The academy desk will reply.</p><div class="card" style="max-width:520px;"><form id="issueForm"><label for="is">Subject</label><input id="is" name="subject" required><label for="im">Message</label><textarea id="im" name="message" required></textarea><button class="btn" style="width:100%;margin-top:22px;" type="submit">Send</button></form></div>`;
}

function attachHandlers(path){
  attachAdmin(path);
  attachReset();
  const lo=document.getElementById('logoutBtn'); if(lo) lo.onclick=()=>{const wasStaff=session&&session.role!=='student';session=null;try{sessionStorage.removeItem(SKEY);}catch(e){} go(wasStaff?'#/admin':'#/');};
  const tr=document.getElementById('ttRem'); if(tr) tr.onclick=async()=>{
    const t=myTimetable(); if(!t) return;
    const list=session.reminders||(session.reminders=[]); let n=0;
    t.entries.forEach(e=>{const time=String(e.start).padStart(2,'0')+':00'; if(!list.some(r=>r.code===e.course&&r.day===e.day&&r.time===time)){list.push({id:uid(),code:e.course,day:e.day,time,venue:e.venue||''});n++;}});
    await save('directory'); flash={type:'ok',text:`${n} class reminder${n===1?'':'s'} added. Now save them to your phone calendar.`}; go('#/reminders');
  };
  const bb=document.getElementById('backBtn');
  if(bb) bb.onclick=()=>{ const t=bb.dataset.back; if(t) go(t); else if(history.length>1) history.back(); else go(homeFor()); };
  const form=(id,fn)=>{const f=document.getElementById(id); if(f) f.onsubmit=async e=>{e.preventDefault(); try{await fn(new FormData(f));}catch(err){console.error(err);flash={type:'err',text:'Something went wrong. Please try again.'};render();}};};
  const fail=t=>{flash={type:'err',text:t};render();};

  form('loginForm',async f=>{
    const id=f.get('id').trim().toLowerCase(), pw=f.get('password');
    const u=cache.directory.users.find(u=>(u.email||'').toLowerCase()===id||(u.regNo||'').toLowerCase()===id);
    if(!u) return fail('No account found. Check your email or registration number, or register.');
    if(u.role!=='student') return fail('This is the student login. Staff use the staff link.');
    const h=await sha(pw);
    if(u.pwHash&&u.pwHash!==h) return fail('Incorrect password.');
    let changed=false;
    if(!u.pwHash){u.pwHash=h;changed=true;}
    if(!u.regNo){u.regNo=genReg();changed=true;}
    if(changed) await save('directory');
    setSession(u); flash=flash||{type:'ok',text:`Welcome back, ${u.name}.`}; go('#/dashboard');
  });
  form('regForm',async f=>{
    const email=f.get('email').trim().toLowerCase(), err=checkEmail(email);
    if(err) return fail(err);
    if(f.get('password').length<6) return fail('Password must be at least 6 characters.');
    if(cache.directory.users.some(u=>(u.email||'').toLowerCase()===email)) return fail('An account with that email already exists. Log in instead.');
    const u={id:uid(),name:f.get('name').trim(),email,role:'student',department:f.get('department'),level:f.get('level'),regNo:genReg(),pwHash:await sha(f.get('password')),emailVerified:false,createdAt:Date.now()};
    cache.directory.users.push(u); await save('directory');
    setSession(u); flash=flash||{type:'ok',text:`You’re registered. Your registration number is ${u.regNo}. Please complete your profile.`}; go('#/profile/edit');
  });
  form('newsForm',async f=>{
    const email=f.get('email').trim().toLowerCase(), err=checkEmail(email);
    if(err) return fail(err);
    if(cache.newsletter.emails.some(x=>x.email===email)) return fail('That email is already subscribed.');
    cache.newsletter.emails.push({email,ts:Date.now()}); await save('newsletter');
    flash=flash||{type:'ok',text:'Subscribed. You will get academy news at '+email+'.'}; go('#/');
  });
  form('profileForm',async f=>{
    const ph=checkPhone(f.get('phone')); if(ph) return fail(ph);
    const dob=f.get('dob'); if(!dob||new Date(dob)>new Date()) return fail('Enter a valid date of birth.');
    const file=f.get('photo');
    if(file&&file.size){
      if(!file.type.startsWith('image/')) return fail('Choose an image file for your picture.');
      try{ session.photo=await resizePhoto(file); }catch(e){ return fail('That picture could not be read. Try another image.'); }
    }
    session.dob=dob; session.state=f.get('state').trim(); session.country=f.get('country').trim(); session.phone=f.get('phone').trim();
    await save('directory'); flash=flash||{type:'ok',text:'Profile saved.'}; go('#/profile');
  });
  document.querySelectorAll('.regBtn').forEach(b=>b.onclick=async()=>{
    const code=b.dataset.code, l=cache.academics.registrations[session.id]||[];
    if(!l.includes(code)){l.push(code);cache.academics.registrations[session.id]=l;await save('academics');}
    flash=flash||{type:'ok',text:`Registered for ${code}.`}; render();
  });
  form('remForm',async f=>{
    const list=session.reminders||(session.reminders=[]);
    list.push({id:uid(),code:f.get('code').trim().toUpperCase(),day:f.get('day'),time:f.get('time'),venue:f.get('venue').trim()});
    await save('directory'); flash=flash||{type:'ok',text:'Class added. Now add it to your phone calendar.'}; go('#/reminders');
  });
  const saveIcs=async list=>{
    const blob=new Blob([icsFor(list)],{type:'text/calendar'}), url=URL.createObjectURL(blob), a=document.createElement('a');
    a.href=url; a.download='eikon-class-reminders.ics'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),2000);
  };
  document.querySelectorAll('.icsBtn').forEach(b=>b.onclick=()=>saveIcs((session.reminders||[]).filter(r=>r.id===b.dataset.id)));
  const all=document.getElementById('icsAll'); if(all) all.onclick=()=>saveIcs(session.reminders||[]);
  document.querySelectorAll('.delRem').forEach(b=>b.onclick=async()=>{ session.reminders=(session.reminders||[]).filter(r=>r.id!==b.dataset.id); await save('directory'); render(); });
  form('postForm',async f=>{
    cache.community.posts.push({id:uid(),authorId:session.id,authorName:session.name,type:f.get('type'),title:f.get('title').trim(),body:f.get('body').trim(),ts:Date.now()});
    await save('community'); flash=flash||{type:'ok',text:'Post published to the community board.'}; go('#/community');
  });
  form('issueForm',async f=>{
    cache.support.issues.push({id:uid(),studentId:session.id,studentName:session.name,subject:f.get('subject').trim(),message:f.get('message').trim(),status:'open',reply:null,ts:Date.now()});
    await save('support'); flash=flash||{type:'ok',text:'Issue sent. The academy desk will reply.'}; go('#/dashboard');
  });
  document.querySelectorAll('.acc-head').forEach(h=>h.onclick=()=>{
    const body=document.getElementById(h.getAttribute('aria-controls')); const open=h.getAttribute('aria-expanded')==='true';
    h.setAttribute('aria-expanded',String(!open)); body.hidden=open;
  });
}
