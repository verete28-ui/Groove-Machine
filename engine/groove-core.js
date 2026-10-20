(()=>{
const $=id=>document.getElementById(id);
const machineConfig=window.GROOVE_MACHINE||null;
const storagePrefix=machineConfig?.storagePrefix||'groove-lab';
const base=()=>[Array.from({length:16},(_,i)=>i%2===0),Array.from({length:16},(_,i)=>i===4||i===12),Array.from({length:16},(_,i)=>i===0||i===8)];
const clone=p=>p.map(row=>row.slice());
const defaults=[base(),
 [Array.from({length:16},(_,i)=>i%2===0),Array.from({length:16},(_,i)=>i===4||i===12),Array.from({length:16},(_,i)=>[0,7,10].includes(i))],
 [Array.from({length:16},(_,i)=>true),Array.from({length:16},(_,i)=>i===4||i===12),Array.from({length:16},(_,i)=>i===0||i===8)],
 [Array.from({length:16},(_,i)=>i%2===0),Array.from({length:16},(_,i)=>[4,12,14,15].includes(i)),Array.from({length:16},(_,i)=>i===0||i===8)]];
// Each instrument has four deliberately distinct teaching patterns.
const make=indices=>Array.from({length:16},(_,i)=>indices.includes(i));
const baseInstrumentLabels=[
 ['שמיניות','רבעים','16יות','אוף־ביט','דליל','דילוגים','שלשות','הדגשות'],
 ['2 ו־4','חצי־זמן','סינקופה','פיל','בלי 4','אוף־ביט','רולים','מענה'],
 ['1 ו־3','סינקופה','ארבע פעימות','שבירות','1 בלבד','דאבלים','אוף־ביט','דחיפות']
];
const instrumentLabels=machineConfig?.labels||baseInstrumentLabels;
const newDefaults=[
 [make([0,2,4,6,8,10,12,14]),make([0,4,8,12]),make([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]),make([2,6,10,14])],
 [make([4,12]),make([8]),make([4,11,12,15]),make([4,12,14,15])],
 [make([0,8]),make([0,6,10]),make([0,4,8,12]),make([0,7,11,14])]
];
const baseExtendedDefaults=[
 [...newDefaults[0],make([0,4,8,14]),make([0,3,6,8,11,14]),make([0,2,5,8,10,13]),make([0,1,4,6,8,9,12,14])],
 [...newDefaults[1],make([4]),make([2,6,10,14]),make([4,7,12,13,14,15]),make([4,10,12])],
 [...newDefaults[2],make([0]),make([0,1,8,9]),make([2,6,10,14]),make([0,3,8,11,15])]
];
const extendedDefaults=machineConfig?.presets||baseExtendedDefaults;
const gridKey=(storagePrefix+'-rhythm-grid-v1');
let rhythmGrid='straight';
try{const saved=localStorage.getItem(gridKey);if(saved==='triplet'||saved==='triplet16'||saved==='mixed')rhythmGrid=saved}catch(e){}
$('rhythmGrid').value=rhythmGrid;
const mixedBeatKey=(storagePrefix+'-mixed-beats-v1');
let mixedBeats=[4,3,4,6];
try{const saved=JSON.parse(localStorage.getItem(mixedBeatKey));if(Array.isArray(saved)&&saved.length===4&&saved.every(n=>[3,4,6].includes(n)))mixedBeats=saved}catch(e){}
const stepCount=()=>rhythmGrid==='mixed'?48:rhythmGrid==='triplet16'?24:rhythmGrid==='triplet'?12:16;
const beatStarts=()=>[0,12,24,36];
function getStepBeat(i){return rhythmGrid==='mixed'?Math.floor(i/12):Math.floor(i/subdivisions())};
const subdivisions=()=>rhythmGrid==='triplet16'?6:rhythmGrid==='triplet'?3:4;
const tripletKey=(storagePrefix+'-triplet-patterns-v1');
// Triplet presets are stored separately: the original 16-step banks remain untouched.
const toTripletRow=row=>Array.from({length:12},(_,i)=>Boolean(row[Math.floor(i/3)*4+Math.round(i%3*1.5)]));
const tripletDefaults=extendedDefaults.map(bank=>bank.map(toTripletRow));
let tripletBanks=tripletDefaults.map(bank=>bank.map(row=>row.slice()));
try{const saved=JSON.parse(localStorage.getItem(tripletKey));if(Array.isArray(saved)&&saved.length===3&&saved.every(bank=>Array.isArray(bank)&&bank.length===8&&bank.every(row=>Array.isArray(row)&&row.length===12)))tripletBanks=saved.map(bank=>bank.map(row=>row.map(Boolean)))}catch(e){}
const triplet16Key=(storagePrefix+'-triplet16-patterns-v1');
const triplet16Defaults=tripletDefaults.map(bank=>bank.map(row=>Array.from({length:24},(_,i)=>i%2===0?row[i/2]:false)));
let triplet16Banks=triplet16Defaults.map(bank=>bank.map(row=>row.slice()));
try{const saved=JSON.parse(localStorage.getItem(triplet16Key));if(Array.isArray(saved)&&saved.length===3&&saved.every(bank=>Array.isArray(bank)&&bank.length===8&&bank.every(row=>Array.isArray(row)&&row.length===24)))triplet16Banks=saved.map(bank=>bank.map(row=>row.map(Boolean)))}catch(e){}
const mixedKey=(storagePrefix+'-mixed-patterns-v2');
const offsets=n=>Array.from({length:n},(_,i)=>i*12/n);
const stepCountForMixed=()=>48;
const expandMixed=(row,divisions,convert,defaultValue)=>{const out=Array.from({length:48},()=>defaultValue());let p=0;
 for(let beat=0;beat<4;beat++){offsets(divisions[beat]).forEach((t,i)=>out[beat*12+t]=convert(row[p+i]));p+=divisions[beat]}return out};
const makeMixedDefaults=()=>extendedDefaults.map(bank=>bank.map(row=>Array.from({length:48},(_,i)=>i%3===0?Boolean(row[Math.floor(i/12)*4+(i%12)/3]):false)));
let mixedDefaults=makeMixedDefaults(),mixedBanks=mixedDefaults.map(bank=>bank.map(row=>row.slice()));
try{const saved=JSON.parse(localStorage.getItem(mixedKey));
 if(saved?.banks?.length===3&&saved.banks.every(bank=>bank.length===8&&bank.every(row=>row.length===48)))mixedBanks=saved.banks;
 else{const old=JSON.parse(localStorage.getItem((storagePrefix+'-mixed-patterns-v1')));
  if(old?.divisions?.length===4&&old?.banks?.length===3)mixedBanks=old.banks.map(bank=>bank.map(row=>expandMixed(row,old.divisions,Boolean,()=>false)))}
}catch(e){}
const storageKey=(storagePrefix+'-per-instrument-v3');
const priorV2Key=(storagePrefix+'-per-instrument-v2');
const previousKey=(storagePrefix+'-per-instrument-v1');
const oldStorageKey=(storagePrefix+'-variations-v1');
// Existing custom edits survive; unedited former presets receive the new patterns.
const previousDefaults=Array.from({length:3},(_,r)=>defaults.map(v=>v[r]));
let instrumentBanks=extendedDefaults.map(bank=>bank.map(row=>row.slice()));
try{
 const isBank=(x,n)=>Array.isArray(x)&&x.length===3&&x.every(bank=>Array.isArray(bank)&&bank.length===n&&bank.every(row=>Array.isArray(row)&&row.length===16));
 const stored=JSON.parse(localStorage.getItem(storageKey));
 if(isBank(stored,8))instrumentBanks=stored.map(bank=>bank.map(row=>row.map(Boolean)));
 else{
  const v2=JSON.parse(localStorage.getItem(priorV2Key));
  if(isBank(v2,4)){
   for(let r=0;r<3;r++)for(let v=0;v<4;v++)instrumentBanks[r][v]=v2[r][v].map(Boolean);
  }else{
   let prior=JSON.parse(localStorage.getItem(previousKey));
   if(!isBank(prior,4)){
   const old=JSON.parse(localStorage.getItem(oldStorageKey));
   if(Array.isArray(old)&&old.length===4&&old.every(v=>Array.isArray(v)&&v.length===3&&v.every(row=>Array.isArray(row)&&row.length===16))){
    prior=Array.from({length:3},(_,r)=>old.map(v=>v[r]));
   }
  }
  if(isBank(prior,4)){
   for(let r=0;r<3;r++)for(let v=0;v<4;v++){
    const priorRow=prior[r][v].map(Boolean);
    if(priorRow.some((hit,i)=>hit!==previousDefaults[r][v][i]))instrumentBanks[r][v]=priorRow;
   }
  }
  }
 }
}catch(e){}
let straightBanks=instrumentBanks;
if(rhythmGrid==='triplet')instrumentBanks=tripletBanks;
if(rhythmGrid==='triplet16')instrumentBanks=triplet16Banks;
if(rhythmGrid==='mixed')instrumentBanks=mixedBanks;
let selected=[0,0,0],pending=[null,null,null];
let patterns=instrumentBanks.map((bank,r)=>bank[selected[r]]);
function saveVariations(){try{if(rhythmGrid==='mixed')localStorage.setItem(mixedKey,JSON.stringify({banks:mixedBanks}));else localStorage.setItem(rhythmGrid==='triplet16'?triplet16Key:rhythmGrid==='triplet'?tripletKey:storageKey,JSON.stringify(instrumentBanks))}catch(e){}}
function refreshPatterns(){patterns=instrumentBanks.map((bank,r)=>bank[selected[r]])}
function paintVariations(){
 const host=$('variations');host.replaceChildren();
 ['HH','SN','KD'].forEach((name,r)=>{
  const line=document.createElement('div');line.className='variation-row';
  const label=document.createElement('span');label.textContent=name;line.append(label);
  for(let i=0;i<8;i++){
   const btn=document.createElement('button');btn.textContent='ABCDEFGH'[i];const detail=document.createElement('span');detail.className='vlabel';detail.textContent=instrumentLabels[r][i];btn.append(detail);
   btn.className=(i===selected[r]?'active ':'')+(i===pending[r]?'pending':'');
   btn.setAttribute('aria-label',name+' וריאציה '+'ABCDEFGH'[i]);
   btn.onclick=()=>selectVariation(r,i);line.append(btn);
  }
  host.append(line);
 });
 const active=['HH','SN','KD'].map((n,r)=>n+' '+ 'ABCDEFGH'[selected[r]]).join(' · ');
 const queued=['HH','SN','KD'].filter((n,r)=>pending[r]!==null).map(n=>{
  const r=['HH','SN','KD'].indexOf(n);return n+' → '+ 'ABCDEFGH'[pending[r]];
 }).join(', ');
 $('variationStatus').textContent=queued?active+' | בהמתנה: '+queued:active;
}
function applySelections(){
 refreshPatterns();paintVariations();seq();score();
}
function selectVariation(r,i){
 if(running){pending[r]=i===selected[r]?null:i;paintVariations()}
 else {selected[r]=i;pending[r]=null;applySelections()}
}
function randomizeCombination(){
 // Choose independently from 8 presets per instrument, avoiding an unchanged combination.
 const effective=selected.map((value,r)=>pending[r]===null?value:pending[r]);
 let chosen;
 do {chosen=selected.map(()=>Math.floor(Math.random()*8))}
 while(chosen.every((value,r)=>value===effective[r]));
 if(running){
  pending=chosen;
  paintVariations();
 }else{
  selected=chosen;
  pending=[null,null,null];
  applySelections();
 }
}
function applyPendingVariations(){
 let changed=false;
 for(let r=0;r<3;r++)if(pending[r]!==null){selected[r]=pending[r];pending[r]=null;changed=true}
 if(changed)applySelections();
}

const names=['HH','SN','KD'];
const muteStorageKey=(storagePrefix+'-track-mutes-v1');
let trackMuted=[false,false,false];
try{const saved=JSON.parse(localStorage.getItem(muteStorageKey));if(Array.isArray(saved)&&saved.length===3)trackMuted=saved.map(Boolean)}catch(e){}
function setTrackMute(r){trackMuted[r]=!trackMuted[r];try{localStorage.setItem(muteStorageKey,JSON.stringify(trackMuted))}catch(e){};seq()}
const dynamicsKey=(storagePrefix+'-snare-dynamics-v1');
let snareDynamics=Array.from({length:8},()=>Array(16).fill('normal'));
try{const saved=JSON.parse(localStorage.getItem(dynamicsKey));if(Array.isArray(saved)&&saved.length===8&&saved.every(row=>Array.isArray(row)&&row.length===16)){snareDynamics=saved.map(row=>row.map(v=>['ghost','normal','accent'].includes(v)?v:'normal'))}}catch(e){}
const tripletDynamicsKey=(storagePrefix+'-triplet-snare-dynamics-v1');
let tripletSnareDynamics=Array.from({length:8},()=>Array(12).fill('normal'));
try{const saved=JSON.parse(localStorage.getItem(tripletDynamicsKey));if(Array.isArray(saved)&&saved.length===8&&saved.every(row=>Array.isArray(row)&&row.length===12))tripletSnareDynamics=saved.map(row=>row.map(v=>['ghost','normal','accent'].includes(v)?v:'normal'))}catch(e){}
let straightSnareDynamics=snareDynamics;
const triplet16DynamicsKey=(storagePrefix+'-triplet16-snare-dynamics-v1');
let triplet16SnareDynamics=Array.from({length:8},()=>Array(24).fill('normal'));
try{const saved=JSON.parse(localStorage.getItem(triplet16DynamicsKey));if(Array.isArray(saved)&&saved.length===8&&saved.every(row=>Array.isArray(row)&&row.length===24))triplet16SnareDynamics=saved.map(row=>row.map(v=>['ghost','normal','accent'].includes(v)?v:'normal'))}catch(e){}
if(rhythmGrid==='triplet')snareDynamics=tripletSnareDynamics;
if(rhythmGrid==='triplet16')snareDynamics=triplet16SnareDynamics;
const mixedDynamicsKey=(storagePrefix+'-mixed-snare-v2');
let mixedSnareDynamics=Array.from({length:8},()=>Array(48).fill('normal'));
try{const saved=JSON.parse(localStorage.getItem(mixedDynamicsKey));if(saved?.length===8&&saved.every(row=>row.length===48))mixedSnareDynamics=saved;
 else{const old=JSON.parse(localStorage.getItem((storagePrefix+'-mixed-snare-v1')));
 if(old?.divisions?.length===4&&old?.banks?.length===8)mixedSnareDynamics=old.banks.map(row=>expandMixed(row,old.divisions,v=>v||'normal',()=> 'normal'))}
}catch(e){}
if(rhythmGrid==='mixed')snareDynamics=mixedSnareDynamics;
function saveSnareDynamics(){try{if(rhythmGrid==='mixed')localStorage.setItem(mixedDynamicsKey,JSON.stringify(mixedSnareDynamics));else localStorage.setItem(rhythmGrid==='triplet16'?triplet16DynamicsKey:rhythmGrid==='triplet'?tripletDynamicsKey:dynamicsKey,JSON.stringify(snareDynamics))}catch(e){}}
function snareLevel(step){return snareDynamics[selected[1]][step]}
function snareGain(step){return ({ghost:.24,normal:1,accent:1.38})[snareLevel(step)]||1}
let editedSnareStep=null;
function openSnareEditor(step){editedSnareStep=step;$('snareEditorTitle').textContent='סנר · צעד '+(step+1);$('snareEditor').hidden=false}
function closeSnareEditor(){editedSnareStep=null;$('snareEditor').hidden=true}
function assignSnareLevel(level){
 if(editedSnareStep===null)return;
 const step=editedSnareStep;
 if(level==='off')patterns[1][step]=false;
 else{patterns[1][step]=true;snareDynamics[selected[1]][step]=level}
 saveVariations();saveSnareDynamics();closeSnareEditor();seq();score();
}
const hatKey=(storagePrefix+'-hihat-articulations-v1');
const defaultHatStep=()=>({type:'closed',level:'normal'});
let hatBanks=Array.from({length:8},()=>Array.from({length:16},defaultHatStep));
try{const saved=JSON.parse(localStorage.getItem(hatKey));if(Array.isArray(saved)&&saved.length===8&&saved.every(row=>Array.isArray(row)&&row.length===16))hatBanks=saved.map(row=>row.map(v=>({type:['closed','half','open','pedal'].includes(v?.type)?v.type:'closed',level:['soft','normal','accent'].includes(v?.level)?v.level:'normal'})))}catch(e){}
const tripletHatKey=(storagePrefix+'-triplet-hihat-articulations-v1');
let tripletHatBanks=Array.from({length:8},()=>Array.from({length:12},defaultHatStep));
try{const saved=JSON.parse(localStorage.getItem(tripletHatKey));if(Array.isArray(saved)&&saved.length===8&&saved.every(row=>Array.isArray(row)&&row.length===12))tripletHatBanks=saved.map(row=>row.map(v=>({type:['closed','half','open','pedal'].includes(v?.type)?v.type:'closed',level:['soft','normal','accent'].includes(v?.level)?v.level:'normal'})))}catch(e){}
let straightHatBanks=hatBanks;
const triplet16HatKey=(storagePrefix+'-triplet16-hihat-articulations-v1');
let triplet16HatBanks=Array.from({length:8},()=>Array.from({length:24},defaultHatStep));
try{const saved=JSON.parse(localStorage.getItem(triplet16HatKey));if(Array.isArray(saved)&&saved.length===8&&saved.every(row=>Array.isArray(row)&&row.length===24))triplet16HatBanks=saved.map(row=>row.map(v=>({type:['closed','half','open','pedal'].includes(v?.type)?v.type:'closed',level:['soft','normal','accent'].includes(v?.level)?v.level:'normal'})))}catch(e){}
if(rhythmGrid==='triplet')hatBanks=tripletHatBanks;
if(rhythmGrid==='triplet16')hatBanks=triplet16HatBanks;
const mixedHatKey=(storagePrefix+'-mixed-hats-v2');
let mixedHatBanks=Array.from({length:8},()=>Array.from({length:48},defaultHatStep));
try{const saved=JSON.parse(localStorage.getItem(mixedHatKey));if(saved?.length===8&&saved.every(row=>row.length===48))mixedHatBanks=saved;
 else{const old=JSON.parse(localStorage.getItem((storagePrefix+'-mixed-hats-v1')));
 if(old?.divisions?.length===4&&old?.banks?.length===8)mixedHatBanks=old.banks.map(row=>expandMixed(row,old.divisions,v=>({...v}),defaultHatStep))}
}catch(e){}
if(rhythmGrid==='mixed')hatBanks=mixedHatBanks;
function saveHats(){try{if(rhythmGrid==='mixed')localStorage.setItem(mixedHatKey,JSON.stringify(mixedHatBanks));else localStorage.setItem(rhythmGrid==='triplet16'?triplet16HatKey:rhythmGrid==='triplet'?tripletHatKey:hatKey,JSON.stringify(hatBanks))}catch(e){}}
const currentHat=step=>hatBanks[selected[0]][step];
const hatVelocity=step=>({soft:.38,normal:1,accent:1.35})[currentHat(step).level]||1;
let editedHatStep=null;
function paintHatEditor(){if(editedHatStep===null)return;
 const hit=currentHat(editedHatStep);
 $('hatEditor').querySelectorAll('[data-hat-type]').forEach(b=>b.classList.toggle('chosen',b.dataset.hatType===hit.type));
 $('hatEditor').querySelectorAll('[data-hat-level]').forEach(b=>b.classList.toggle('chosen',b.dataset.hatLevel===hit.level));
}
function openHatEditor(step){editedHatStep=step;$('hatEditorTitle').textContent='היי־האט · צעד '+(step+1);paintHatEditor();$('hatEditor').hidden=false}
function closeHatEditor(){editedHatStep=null;$('hatEditor').hidden=true}
function changeHat(kind,value){
 if(editedHatStep===null)return;
 const step=editedHatStep;
 currentHat(step)[kind]=value;patterns[0][step]=true;
 saveHats();saveVariations();paintHatEditor();seq();score();
}
let ctx,bus,running=false,timer=null,position=0,next=0,rev=0,shownStep=-1,scorePositions=[],scoreCursor=null;
function seq(){
 const host=$('seq');host.replaceChildren();
 patterns.forEach((a,r)=>{
  const row=document.createElement('div');row.className='track'+(trackMuted[r]?' is-muted':'');
  row.style.gridTemplateColumns='34px 34px repeat(4,minmax(0,1fr))';
  row.classList.toggle('dense',rhythmGrid==='triplet16'||rhythmGrid==='mixed');
  const label=document.createElement('span');label.textContent=names[r];row.append(label);
  const mute=document.createElement('button');mute.className='mute'+(trackMuted[r]?' is-muted':'');
  mute.textContent=trackMuted[r]?'🔇':'🔊';
  mute.title=(trackMuted[r]?'בטל השתקה: ':'השתק: ')+names[r];
  mute.setAttribute('aria-label',mute.title);
  mute.setAttribute('aria-pressed',String(trackMuted[r]));
  mute.onclick=()=>setTrackMute(r);
  row.append(mute);
  const counts=rhythmGrid==='mixed'?mixedBeats:Array(4).fill(subdivisions());
  for(let beat=0;beat<4;beat++){
   const group=document.createElement('div');group.className='beat-slice';
   group.style.gridTemplateColumns='repeat('+counts[beat]+',minmax(0,1fr))';row.append(group);
   const visible=rhythmGrid==='mixed'?offsets(counts[beat]).map(t=>beat*12+t):Array.from({length:counts[beat]},(_,j)=>beat*counts[beat]+j);
   visible.forEach(i=>{const hit=a[i];
   const b=document.createElement('button');b.dataset.step=String(i);
   const level=r===1&&hit?snareLevel(i):'normal';
   const hat=r===0&&hit?currentHat(i):null;
   b.className='step'+(hit?' hit':'')+(i===shownStep?' current':'')+(r===1&&hit?' '+level:'');
   if(r===1&&hit&&level!=='normal')b.textContent=level==='ghost'?'g':'>';
   if(hat){
    if(hat.type!=='closed'){b.classList.add('hat-'+hat.type);b.textContent=({half:'◐',open:'○',pedal:'×'})[hat.type]}
    if(hat.level!=='normal')b.classList.add('hat-'+hat.level);
    if(hat.level==='accent'&&hat.type==='closed')b.textContent='>';
   }
   b.setAttribute('aria-label',names[r]+' step '+(i+1));
   if(r===1||r===0){
    let longTimer=null,suppressClick=false;
    const openEditor=()=>r===0?openHatEditor(i):openSnareEditor(i);
    b.addEventListener('pointerdown',e=>{
     if(e.button!==0)return;
     suppressClick=false;
     longTimer=setTimeout(()=>{longTimer=null;suppressClick=true;openEditor()},520);
    });
    const cancelLong=()=>{if(longTimer!==null){clearTimeout(longTimer);longTimer=null}};
    b.addEventListener('pointerup',cancelLong);
    b.addEventListener('pointercancel',cancelLong);
    b.addEventListener('pointerleave',cancelLong);
    b.addEventListener('contextmenu',e=>{e.preventDefault();cancelLong();suppressClick=true;openEditor()});
    b.onclick=()=>{if(suppressClick){suppressClick=false;return}a[i]=!a[i];saveVariations();seq();score()};
   }else b.onclick=()=>{a[i]=!a[i];saveVariations();seq();score()};
    group.append(b);
   });
   if(rhythmGrid==='mixed'){
    const hidden=Array.from({length:12},(_,j)=>beat*12+j).filter(i=>a[i]&&!visible.includes(i));
    if(hidden.length){const note=document.createElement('button');note.className='off-grid';note.textContent='+'+hidden.length;
     note.title='מכות מחוץ לרשת; לחצו להצגת מיקום';
     note.onclick=()=>alert(names[r]+' · פעמה '+(beat+1)+'\nמכות מחוץ לרשת ב־'+hidden.map(i=>(i%12+1)+'/12').join(', ')+'\nהחלוקה אינה משנה אותן.');group.append(note)}
   }
  }
  host.append(row);
 });
 const header=$('beatSelectors');header.replaceChildren();
 const currentDivisions=rhythmGrid==='mixed'?mixedBeats:Array(4).fill(subdivisions());
 currentDivisions.forEach((n,i)=>{
  const label=document.createElement('label');
  label.textContent='פעמה '+(i+1);
  const select=document.createElement('select');
  [4,3,6].forEach(v=>{const option=document.createElement('option');option.value=String(v);option.textContent=v===4?'4 · רגיל':v===3?'3 · טריולה':'6 · טריולה';select.append(option)});
  select.value=String(queuedBeatDivisions[i]??n);
  if(queuedBeatDivisions[i]!==undefined){select.style.borderColor='#efc14b';select.title='ממתין לתיבה הבאה'}
  select.setAttribute('aria-label','חלוקה לפעמה '+(i+1));
  select.onchange=()=>changeBeatDivision(i,Number(select.value));
  label.append(select);header.append(label);
 });

}
function mixedScore(){
 const host=$('score');host.replaceChildren();
 const VF=window.Vex?.Flow;
 if(!VF){$('scoreMsg').textContent='ספריית התווים אינה זמינה';return}
 try{
  // Every beat has exactly one quarter-note duration, regardless of its subdivision.
  // When an off-grid event exists, use a faithful 12-slot (32nd-triplet) transcription
  // for that beat rather than rounding the attack onto the selected editing grid.
  const offGridBeats=Array.from({length:4},(_,beat)=>
   Array.from({length:12},(_,tick)=>beat*12+tick).some(i=>
    patterns.some(row=>row[i])&&!offsets(mixedBeats[beat]).includes(i%12)));
  const detailed=offGridBeats.some(Boolean);
  const width=detailed?1320:900,height=190;
  const renderer=new VF.Renderer(host,VF.Renderer.Backends.SVG);
  renderer.resize(width,height);
  const context=renderer.getContext();
  const stave=new VF.Stave(40,24,width-75);
  stave.addClef('percussion').addTimeSignature('4/4');
  stave.setContext(context).draw();
  const notes=[],positions=[],tuplets=[],beams=[],snareMarks=[],hatMarks=[];
  const anyHit=i=>patterns.some(row=>row[i]);
  function addNote(tick,duration){
   const hit=anyHit(tick),keys=[];
   if(hit){
    if(patterns[2][tick])keys.push('f/4');
    if(patterns[1][tick])keys.push('c/5');
    if(patterns[0][tick])keys.push('g/5/x');
   }
   const note=new VF.StaveNote({
    clef:'percussion',keys:hit?keys:['b/4'],
    duration:duration+(hit?'':'r'),stem_direction:1
   });
   notes.push(note);positions.push(tick);
   if(hit&&patterns[1][tick]&&snareLevel(tick)!=='normal')snareMarks.push({note,level:snareLevel(tick)});
   if(hit&&patterns[0][tick]){
    const hat=currentHat(tick);
    if(hat.type!=='closed'||hat.level!=='normal')hatMarks.push({note,hat});
   }
   return note;
  }
  for(let beat=0;beat<4;beat++){
   const first=beat*12,count=offGridBeats[beat]?12:mixedBeats[beat];
   const ticks=offsets(count).map(offset=>first+offset);
   const unitDuration=count===3?'8':count===4?'16':count===6?'16':'32';
   const group=ticks.map(tick=>addNote(tick,unitDuration));
   // A standard quarter with four sixteenths needs no tuplet.
   if(count===3)tuplets.push(new VF.Tuplet(group,{num_notes:3,notes_occupied:2,bracketed:true,ratioed:false}));
   else if(count===6||count===12){
    for(let j=0;j<count;j+=3)tuplets.push(new VF.Tuplet(group.slice(j,j+3),{num_notes:3,notes_occupied:2,bracketed:true,ratioed:false}));
   }
   // Beam only adjacent struck notes, never across written rests.
   const beamChunk=count===3?3:count===4?2:3;
   for(let j=0;j<count;j+=beamChunk){
    let contiguous=[];
    const flush=()=>{if(contiguous.length>=2)beams.push(contiguous);contiguous=[]};
    for(let k=j;k<Math.min(j+beamChunk,count);k++){
     if(anyHit(ticks[k]))contiguous.push(group[k]);else flush();
    }
    flush();
   }
  }
  const voice=new VF.Voice({num_beats:4,beat_value:4});
  voice.addTickables(notes);
  const formatter=new VF.Formatter();
  formatter.joinVoices([voice]).format([voice],width-185);
  voice.draw(context,stave);
  beams.forEach(group=>new VF.Beam(group).setContext(context).draw());
  tuplets.forEach(tuple=>tuple.setContext(context).draw());
  const svg=host.querySelector('svg');
  if(svg){
   svg.setAttribute('viewBox','0 0 '+width+' '+height);
   svg.setAttribute('width','100%');svg.setAttribute('height','auto');svg.style.width='100%';svg.style.height='auto';
   const pairs=notes.map((note,i)=>({tick:positions[i],x:note.getAbsoluteX()}));
   scorePositions=Array.from({length:48},(_,tick)=>{
    const left=[...pairs].reverse().find(p=>p.tick<=tick)||pairs[0];
    const right=pairs.find(p=>p.tick>tick)||{tick:48,x:width-30};
    return left.x+(right.x-left.x)*(tick-left.tick)/(right.tick-left.tick);
   });
   const ns='http://www.w3.org/2000/svg';
   const markText=(x,y,label,color='#394954')=>{
    const el=document.createElementNS(ns,'text');
    el.setAttribute('x',x);el.setAttribute('y',y);el.setAttribute('text-anchor','middle');
    el.setAttribute('font-size','12');el.setAttribute('fill',color);el.textContent=label;svg.append(el);
   };
   hatMarks.forEach(({note,hat})=>{
    if(hat.type==='open'){
     const keyIndex=note.getKeys().findIndex(k=>k==='g/5/x');
     const y=note.getYs()[keyIndex];
     if(Number.isFinite(y)){
      const circle=document.createElementNS(ns,'circle');
      circle.setAttribute('cx',(typeof note.getNoteHeadBeginX==='function'?note.getNoteHeadBeginX():note.getAbsoluteX()-5)+5);
      circle.setAttribute('cy',y);circle.setAttribute('r','8.5');
      circle.setAttribute('stroke','#294450');circle.setAttribute('fill','none');svg.append(circle);
     }
    }else markText(note.getAbsoluteX(),16,hat.type==='half'?'◐':hat.type==='pedal'?'×':hat.level==='accent'?'>':'·');
   });
   snareMarks.forEach(({note,level})=>markText(note.getAbsoluteX(),174,level==='ghost'?'g':'>'));
   offGridBeats.forEach((hasOffGrid,beat)=>{
    if(hasOffGrid){
     const x=pairs.find(p=>p.tick===beat*12)?.x;
     if(Number.isFinite(x))markText(x+20,187,'*','#aa6729');
    }
   });
   scoreCursor=document.createElementNS(ns,'line');
   scoreCursor.setAttribute('y1','18');scoreCursor.setAttribute('y2','139');
   scoreCursor.setAttribute('stroke','#e65142');scoreCursor.setAttribute('stroke-width','2.5');
   scoreCursor.setAttribute('opacity','0');scoreCursor.setAttribute('pointer-events','none');svg.append(scoreCursor);
   markScore(shownStep);
  }
  $('scoreMsg').textContent=detailed
   ?'תיווי ריתמי מלא: בפעימות עם מכות מחוץ לרשת מוצגת חלוקת 12 לשמירת התזמון (מסומנות ב־*).'
   :'תיווי ריתמי: טריולות של שמיניות ושש־עשריות עם סימון 3.';
 }catch(e){console.error('Mixed notation:',e);$('scoreMsg').textContent='שגיאה בתיווי: '+e.message}
}
function score(){
 const host=$('score');host.replaceChildren();
 if(rhythmGrid==='mixed'){mixedScore();return}
 const VF=window.Vex?.Flow;
 if(!VF){$('scoreMsg').textContent='ספריית התווים אינה זמינה. בדוק חיבור לאינטרנט.';return}
 try{
  const renderer=new VF.Renderer(host,VF.Renderer.Backends.SVG);
  const width=(rhythmGrid==='triplet16'||rhythmGrid==='mixed')?900:620;
  renderer.resize(width,160);
  const c=renderer.getContext(),stave=new VF.Stave(40,18,width-70);
  stave.addClef('percussion').addTimeSignature('4/4');
  stave.setContext(c).draw();
  // A single complete rhythmic voice: every attack in the sequencer is represented.
  // Rests describe silence of the entire kit, never silence of an individual drum.
  const notes=[],beamGroups=[],stepsOfNotes=[],snareMarks=[],hatMarks=[];
  const durations={1:'16',2:'8',4:'q'};
  const anyHit=i=>patterns.some(row=>row[i]);
  const tuplets=[];
  if(rhythmGrid==='mixed'){
   let step=0;
   for(let beat=0;beat<4;beat++){
    const count=mixedBeats[beat],start=step;
    const parts=[],makeNote=(step,duration)=>{
     const rest=!anyHit(step),keys=[];
     if(!rest){if(patterns[2][step])keys.push('f/4');if(patterns[1][step])keys.push('c/5');if(patterns[0][step])keys.push('g/5/x')}
     const note=new VF.StaveNote({clef:'percussion',keys:rest?['b/4']:keys,duration:duration+(rest?'r':''),stem_direction:1});
     notes.push(note);stepsOfNotes.push(step);
     if(!rest&&patterns[1][step]&&snareLevel(step)!=='normal')snareMarks.push({note,level:snareLevel(step)});
     if(!rest&&patterns[0][step]){const hat=currentHat(step);if(hat.type!=='closed'||hat.level!=='normal')hatMarks.push({note,hat})}
     return note;
    };
    for(let i=0;i<count;i++)parts.push(makeNote(step++,count===3?'8':'16'));
    if(count===3)tuplets.push(new VF.Tuplet(parts,{num_notes:3,notes_occupied:2,bracketed:true,ratioed:false}));
    if(count===6)for(let half=0;half<2;half++)tuplets.push(new VF.Tuplet(parts.slice(half*3,half*3+3),{num_notes:3,notes_occupied:2,bracketed:true,ratioed:false}));
    if(count===4){for(let half=0;half<2;half++){const grp=parts.slice(half*2,half*2+2).filter((_,j)=>anyHit(start+half*2+j));if(grp.length===2)beamGroups.push(grp)}}
    else if(count===3){const grp=parts.filter((_,j)=>anyHit(start+j));if(grp.length>1)beamGroups.push(grp)}
    else for(let half=0;half<2;half++){const grp=parts.slice(half*3,half*3+3).filter((_,j)=>anyHit(start+half*3+j));if(grp.length>1)beamGroups.push(grp)}
   }
  }else if(rhythmGrid==='triplet16'){
   // Six sixteenth triplets per beat: two triplet groups, three notes in the time of two.
   for(let beat=0;beat<4;beat++){
    for(let half=0;half<2;half++){
     const tripletNotes=[];
     for(let part=0;part<3;part++){
      const step=beat*6+half*3+part,rest=!anyHit(step),keys=[];
      if(!rest){
       if(patterns[2][step])keys.push('f/4');
       if(patterns[1][step])keys.push('c/5');
       if(patterns[0][step])keys.push('g/5/x');
      }
      const note=new VF.StaveNote({clef:'percussion',keys:rest?['b/4']:keys,duration:'16'+(rest?'r':''),stem_direction:1});
      notes.push(note);stepsOfNotes.push(step);tripletNotes.push(note);
      if(!rest&&patterns[1][step]&&snareLevel(step)!=='normal')snareMarks.push({note,level:snareLevel(step)});
      if(!rest&&patterns[0][step]){const hat=currentHat(step);if(hat.type!=='closed'||hat.level!=='normal')hatMarks.push({note,hat})}
     }
     const audible=tripletNotes.filter((note,i)=>anyHit(beat*6+half*3+i));
     if(audible.length>=2)beamGroups.push(audible);
     tuplets.push(new VF.Tuplet(tripletNotes,{num_notes:3,notes_occupied:2,bracketed:true,ratioed:false}));
    }
   }
  }else if(rhythmGrid==='triplet'){
   for(let beat=0;beat<4;beat++){
    const beatNotes=[];
   const append=(at,length,rest)=>{
    const keys=[];
    if(!rest){
     if(patterns[2][at])keys.push('f/4');
     if(patterns[1][at])keys.push('c/5');
     if(patterns[0][at])keys.push('g/5/x');
    }
    const n=new VF.StaveNote({
     clef:'percussion',keys:rest?['b/4']:keys,
     duration:(rhythmGrid==='triplet'?'8':durations[length])+(rest?'r':''),
     stem_direction:1
    });
    notes.push(n);stepsOfNotes.push(at);beatNotes.push({note:n,rest,length});
    if(!rest&&patterns[1][at]&&snareLevel(at)!=='normal')snareMarks.push({note:n,level:snareLevel(at)});
    if(!rest&&patterns[0][at]){const hat=currentHat(at);if(hat.type!=='closed'||hat.level!=='normal')hatMarks.push({note:n,hat})}
   };
    for(let part=0;part<3;part++){
     const step=beat*3+part;
     append(step,2,!anyHit(step));
    }
    const group=beatNotes.filter(item=>!item.rest).map(item=>item.note);
    if(group.length>=2)beamGroups.push(group);
    tuplets.push(new VF.Tuplet(beatNotes.map(item=>item.note),{num_notes:3,notes_occupied:2,bracketed:true,ratioed:false}));
   }
  }else{
  for(let beat=0;beat<4;beat++){
   const beatNotes=[];
   const append=(at,length,rest)=>{
    const keys=[];
    if(!rest){
     if(patterns[2][at])keys.push('f/4');
     if(patterns[1][at])keys.push('c/5');
     if(patterns[0][at])keys.push('g/5/x');
    }
    const n=new VF.StaveNote({
     clef:'percussion',keys:rest?['b/4']:keys,
     duration:durations[length]+(rest?'r':''),
     stem_direction:1
    });
    notes.push(n);stepsOfNotes.push(at);beatNotes.push({note:n,rest,length});
    if(!rest&&patterns[1][at]&&snareLevel(at)!=='normal')snareMarks.push({note:n,level:snareLevel(at)});
    if(!rest&&patterns[0][at]){const hat=currentHat(at);if(hat.type!=='closed'||hat.level!=='normal')hatMarks.push({note:n,hat})}
   };
   const start=beat*4;
   // Align to both eighth-note subdivisions in EVERY beat, including beat four.
   // A missing offbeat becomes an eighth rest instead of extending the previous note.
   if(![0,1,2,3].some(i=>anyHit(start+i))){
    append(start,4,true);
   }else{
    for(let half=0;half<2;half++){
     const s=start+half*2,first=anyHit(s),second=anyHit(s+1);
     if(second){
      append(s,1,!first);
      append(s+1,1,false);
     }else{
      append(s,2,!first);
     }
    }
   }
   let group=[];
   const flush=()=>{if(group.length>=2)beamGroups.push(group);group=[]};
   for(const item of beatNotes){
    if(item.rest||item.length>=4)flush();
    else group.push(item.note);
   }
   flush();
  }
  }
  const voice=new VF.Voice({num_beats:4,beat_value:4});
  voice.addTickables(notes);
  new VF.Formatter().joinVoices([voice]).format([voice],width-165);
  // IMPORTANT: attach beams BEFORE drawing notes, or VexFlow draws redundant flags.
  const beams=beamGroups.map(group=>new VF.Beam(group));
  voice.draw(c,stave);
  beams.forEach(beam=>beam.setContext(c).draw());
  tuplets.forEach(tuple=>tuple.setContext(c).draw());
  const svg=host.querySelector('svg');
  if(svg){
   svg.setAttribute('viewBox','0 0 '+width+' 160');
   svg.setAttribute('width','100%');
   svg.setAttribute('height','auto');
   svg.style.width='100%';svg.style.height='auto';svg.style.display='block';
   const pairs=notes.map((note,i)=>({step:stepsOfNotes[i],x:note.getAbsoluteX()}));
   scorePositions=Array.from({length:stepCount()},(_,step)=>{
    const left=[...pairs].reverse().find(p=>p.step<=step)||pairs[0];
    const right=pairs.find(p=>p.step>step)||{step:stepCount(),x:width-35};
    const t=(step-left.step)/(right.step-left.step);
    return left.x+(right.x-left.x)*t;
   });
   scoreCursor=document.createElementNS('http://www.w3.org/2000/svg','line');
   scoreCursor.setAttribute('y1','13');scoreCursor.setAttribute('y2','118');
   scoreCursor.setAttribute('stroke','#e65142');scoreCursor.setAttribute('stroke-width','2.5');
   scoreCursor.setAttribute('opacity','0');scoreCursor.setAttribute('pointer-events','none');
   svg.appendChild(scoreCursor);
   // Small dynamic cues in the score, kept outside the time-signature and staff notes.
   hatMarks.forEach(({note,hat})=>{
    if(hat.type==='open'){
     // Circle the actual X-shaped hi-hat notehead rather than placing a marker above it.
     const headIndex=note.getKeys().findIndex(k=>k==='g/5/x');
     const ys=note.getYs();
     if(headIndex>=0&&Number.isFinite(ys[headIndex])){
      const circle=document.createElementNS('http://www.w3.org/2000/svg','circle');
      const beginX=typeof note.getNoteHeadBeginX==='function'?note.getNoteHeadBeginX():note.getAbsoluteX()-5;
      circle.setAttribute('cx',beginX+5);
      circle.setAttribute('cy',ys[headIndex]);
      circle.setAttribute('r','8.5');
      circle.setAttribute('stroke','#294450');
      circle.setAttribute('stroke-width','1.4');
      circle.setAttribute('fill','none');
      circle.setAttribute('pointer-events','none');
      svg.appendChild(circle);
     }
     return;
    }
    const mark=document.createElementNS('http://www.w3.org/2000/svg','text');
    mark.setAttribute('x',note.getAbsoluteX());
    mark.setAttribute('y','15');
    mark.setAttribute('font-size','12');
    mark.setAttribute('text-anchor','middle');
    mark.setAttribute('fill','#294450');
    mark.textContent=hat.type==='half'?'◐':hat.type==='pedal'?'×':hat.level==='accent'?'>':'·';
    svg.appendChild(mark);
   });
   snareMarks.forEach(({note,level})=>{
    const mark=document.createElementNS('http://www.w3.org/2000/svg','text');
    mark.setAttribute('x',note.getAbsoluteX());
    mark.setAttribute('y','143');
    mark.setAttribute('font-size','13');
    mark.setAttribute('font-weight','bold');
    mark.setAttribute('text-anchor','middle');
    mark.setAttribute('fill','#242b33');
    mark.textContent=level==='ghost'?'g':'>';
    svg.appendChild(mark);
   });
   markScore(shownStep);
  }
  $('scoreMsg').textContent='תיווי בסנכרון עם הנגן · הפסקות מדויקות גם בפעמה 4';
 }catch(e){$('scoreMsg').textContent='שגיאה בתיווי: '+e.message}
}
const sampleSets={
 acoustic:{
  root:'https://cdn.jsdelivr.net/gh/studiorack/salamander-drumkit@master/Samples/',
  files:{
   hh:['hihatClosed_OH_F_1.flac','hihatClosed_OH_F_2.flac','hihatClosed_OH_F_3.flac'],
   hhHalf:['hihatSemiOpen3_OH_F_1.flac','hihatSemiOpen3_OH_F_2.flac'],
   hhOpen:['hihatOpen_OH_F_1.flac','hihatOpen_OH_F_2.flac'],
   hhPedal:['hihatFoot_OH_MP_1.flac','hihatFoot_OH_MP_2.flac'],
   sn:['snare2_OH_F_1.flac','snare2_OH_F_2.flac','snare2_OH_F_3.flac'],
   kd:['kick_OH_F_1.flac','kick_OH_F_2.flac','kick_OH_F_3.flac']
  }
 },
 studio:{
  root:'https://cdn.jsdelivr.net/gh/teropa/drumkit@master/src/assets/',
  files:{hh:['hatClosed.mp3'],sn:['snare.mp3'],kd:['kick.mp3']}
 }
};
const sampleBuffers={};
const samplePromises={};
const sampleKey=(storagePrefix+'-sound-kit-v1');
try{const stored=localStorage.getItem(sampleKey);if(['studio','dub','synth','acoustic'].includes(stored))$('soundKit').value=stored;else $('soundKit').value='acoustic'}catch(e){$('soundKit').value='acoustic'}
function chosenSet(kit){return kit==='acoustic'?'acoustic':'studio'}
function isReady(kit){const buffers=sampleBuffers[chosenSet(kit)];return buffers&&['hh','sn','kd'].every(k=>buffers[k]?.length)}
function ensureSamples(kit=$('soundKit').value){
 if(kit==='synth'||!ctx)return Promise.resolve(false);
 const set=chosenSet(kit);
 if(isReady(kit)){updateSampleStatus();return Promise.resolve(true)}
 if(samplePromises[set])return samplePromises[set];
 const config=sampleSets[set];
 updateSampleStatus('טוען '+(set==='acoustic'?'סמפלים אקוסטיים…':'סמפלים…'));
 const loadOne=async name=>{
  const response=await fetch(config.root+name);
  if(!response.ok)throw new Error(name+': HTTP '+response.status);
  return await ctx.decodeAudioData(await response.arrayBuffer());
 };
 samplePromises[set]=Promise.all(Object.entries(config.files).map(async ([key,files])=>[key,await Promise.all(files.map(loadOne))]))
  .then(pairs=>{sampleBuffers[set]=Object.fromEntries(pairs);updateSampleStatus();return true})
  .catch(e=>{console.warn('Unable to load sample set',set,e);samplePromises[set]=null;updateSampleStatus('טעינת '+set+' נכשלה — משתמש בסינתזה');return false});
 return samplePromises[set];
}
function updateSampleStatus(message){
 $('sampleStatus').textContent=message||($('soundKit').value==='synth'?'צלילים סינתטיים':isReady($('soundKit').value)?'✓ סמפלים מוקלטים פעילים':'סמפלים עדיין לא נטענו');
}
function sampleHit(key,time,kit,velocity=1,registerHat=false){
 const set=chosenSet(kit),buffers=sampleBuffers[set]?.[key];
 if(!buffers?.length)return false;
 const src=ctx.createBufferSource(),gain=ctx.createGain();
 // Round-robin is reserved for Acoustic HD; Studio and Dub play the same sample every hit.
 const buffer=kit==='acoustic'?buffers[Math.floor(Math.random()*buffers.length)]:buffers[0];
 src.buffer=buffer;
 const isDub=kit==='dub',isAcoustic=kit==='acoustic';
 const level=isAcoustic?({hh:.34,hhHalf:.32,hhOpen:.28,hhPedal:.40,sn:.58,kd:.78}[key]):isDub?({hh:.32,sn:.52,kd:.75}[key]):({hh:.43,sn:.66,kd:.85}[key]);
 gain.gain.setValueAtTime(level*velocity,time);
 let end=buffer.duration,output=gain;
 if(isDub){
  const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=key==='hh'?4200:key==='sn'?3500:1900;
  src.connect(filter);filter.connect(gain);
  end=Math.min(buffer.duration,key==='hh'?.25:key==='sn'?.38:.70);
  gain.gain.setValueAtTime(level*velocity,time+Math.max(.001,end-.045));
  gain.gain.exponentialRampToValueAtTime(.001,time+end);
 }else {
  // Keep the original recorded transient and full natural decay.
  src.connect(gain);
 }
 gain.connect(bus);
 if(registerHat)activeOpenHats.push({gain:gain.gain,time});
 src.start(time);
 if(isDub)src.stop(time+end+.005);
 return true;
}
let activeOpenHats=[];
function chokeHats(time){
 activeOpenHats=activeOpenHats.filter(h=>{
  if(h.time>time)return true;
  h.gain.setTargetAtTime(.0001,time,.009);
  return false;
 });
}
function syntheticHat(t,type,velocity){
 const duration=type==='open'?.9:type==='half'?.4:type==='pedal'?.085:.052;
 const filter=type==='pedal'?4300:type==='open'?4600:6400;
 const env=noise(t,duration,filter,.24*velocity);
 if(type==='open'||type==='half')activeOpenHats.push({gain:env.gain,time:t});
}
function init(){if(!ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return false;ctx=new C();bus=ctx.createGain();bus.gain.value=.45;bus.connect(ctx.destination)}ctx.resume();if($('soundKit').value!=='synth')ensureSamples();return true}
function tone(t,hz,d,v,end){const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.setValueAtTime(hz,t);if(end)o.frequency.exponentialRampToValueAtTime(end,t+d*.8);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(bus);o.start(t);o.stop(t+d)}
function noise(t,d,hz,v){const buf=ctx.createBuffer(1,Math.ceil(d*ctx.sampleRate),ctx.sampleRate),a=buf.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1;const s=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();s.buffer=buf;f.type='highpass';f.frequency.value=hz;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(f);f.connect(g);g.connect(bus);s.start(t);s.stop(t+d);return {gain:g.gain}}
// A separate, sharp metronome voice stays audible above the snare on beats 2 and 4.
function metronomeClick(t,accent,volume){
 if(volume<=0)return;
 const osc=ctx.createOscillator(),gain=ctx.createGain();
 osc.type='square';
 osc.frequency.setValueAtTime(accent?1900:1450,t);
 gain.gain.setValueAtTime(0,t);
 gain.gain.linearRampToValueAtTime((accent?.36:.28)*volume,t+.002);
 gain.gain.exponentialRampToValueAtTime(.001,t+.055);
 osc.connect(gain);gain.connect(bus);
 osc.start(t);osc.stop(t+.06);
}
function sound(i,t){
 if($('drumsEnabled').checked){
  const kit=$('soundKit').value;
  const sample=kit!=='synth';
  if(!trackMuted[0]&&patterns[0][i]){
   const hh=currentHat(i),open=hh.type==='open'||hh.type==='half',velocity=hatVelocity(i);
   // Closed stick and pedal shut an earlier ringing open-hat.
   if(!open)chokeHats(t);
   const key=kit==='acoustic'?({closed:'hh',half:'hhHalf',open:'hhOpen',pedal:'hhPedal'})[hh.type]:'hh';
   const played=sample&&sampleHit(key,t,kit,velocity,open);
   if(!played)syntheticHat(t,hh.type,velocity);
  }
  if(!trackMuted[1]&&patterns[1][i]){
   const velocity=snareGain(i);
   if(!sample||!sampleHit('sn',t,kit,velocity)){noise(t,.13,1100,.48*velocity);tone(t,170,.07,.15*velocity)}
  }
  if(!trackMuted[2]&&patterns[2][i]&&(!sample||!sampleHit('kd',t,kit)))tone(t,145,.24,.85,43);
 }
 if($('metro').checked){
  const div=Number($('clickDivision').value);
  const clickEvery=rhythmGrid==='mixed'?1:rhythmGrid==='triplet16'?(div===4?6:div===2?3:1):rhythmGrid==='triplet'?(div===4?3:1):div;
  if(rhythmGrid==='mixed'?(div===4?i%12===0:div===2?i%6===0:offsets(mixedBeats[getStepBeat(i)]).includes(i%12)):i%clickEvery===0){
   const accent=$('clickAccent').checked&&i===0;
   const volume=Number($('clickVolume').value)/100;
   metronomeClick(t,accent,volume);
  }
 }
}
function markScore(s){if(!scoreCursor)return;if(s<0||!Number.isFinite(scorePositions[s])){scoreCursor.setAttribute('opacity','0');return}const x=scorePositions[s];scoreCursor.setAttribute('x1',x);scoreCursor.setAttribute('x2',x);scoreCursor.setAttribute('opacity','0.85')}
function mark(s){shownStep=s;$('seq').querySelectorAll('.track').forEach(row=>row.querySelectorAll('.step').forEach(b=>b.classList.toggle('current',Number(b.dataset.step)===s)));markScore(s)}
function stop(){running=false;applyQueuedBeatDivisions();activeOpenHats=[];pending=[null,null,null];paintVariations();rev++;clearInterval(timer);timer=null;position=0;mark(-1);$('play').textContent='▶ נגן';$('status').textContent='מוכן';if(ctx){bus.gain.setTargetAtTime(0,ctx.currentTime,.008);bus=ctx.createGain();bus.gain.value=.45;bus.connect(ctx.destination)}}
function tick(){if(!running)return;const n=rev;while(next<ctx.currentTime+.09&&running){const i=position,t=next;
  if(i===0){applyQueuedBeatDivisions();applyPendingVariations();}
  sound(i,t);setTimeout(()=>{if(running&&rev===n){mark(i);$('status').textContent='פעמה '+(getStepBeat(i)+1)}},Math.max(0,(t-ctx.currentTime)*1000));const quarter=60/Number($('bpm').value);
 const ratio=Number($('swing').value)/100;
 // Eighth swing: two eighths per beat split by ratio, with the two sixteenths within each half evenly spaced.
 next+=rhythmGrid==='mixed'?quarter/12:rhythmGrid==='triplet16'?quarter/6:rhythmGrid==='triplet'?quarter/3:quarter*((i%4)<2?ratio/2:(1-ratio)/2);
 position++;if(position===stepCount()){position=0;if(!$('loop').checked){clearInterval(timer);timer=null;setTimeout(()=>{if(rev===n)stop()},Math.max(0,(next-ctx.currentTime)*1000));break}}}}
$('play').onclick=()=>{if(running){stop();return}if(!init())return;running=true;rev++;position=0;next=ctx.currentTime+.05;$('play').textContent='Ⅱ השהה';tick();timer=setInterval(tick,20)};
$('stop').onclick=stop;
$('bpm').oninput=()=>{$('bpmOut').textContent=$('bpm').value};
$('soundKit').onchange=()=>{
 try{localStorage.setItem(sampleKey,$('soundKit').value)}catch(e){}
 if($('soundKit').value!=='synth'&&ctx)ensureSamples();
 updateSampleStatus();
};
function syncRhythmSettings(){
 $('swingSetting').style.display=rhythmGrid==='straight'?'flex':'none';
 $('clickDivision').querySelector('option[value="2"]').textContent='שמיניות';
 $('clickDivision').querySelector('option[value="1"]').textContent=rhythmGrid==='straight'?'שש־עשריות':'כל טריולה';
 $('clickDivision').value=rhythmGrid==='triplet'?'4':$('clickDivision').value;
 updateClickSummary();
}
$('rhythmGrid').onchange=()=>{
 if(running)stop();
 rhythmGrid=$('rhythmGrid').value;
 instrumentBanks=rhythmGrid==='mixed'?mixedBanks:rhythmGrid==='triplet16'?triplet16Banks:rhythmGrid==='triplet'?tripletBanks:straightBanks;
 snareDynamics=rhythmGrid==='mixed'?mixedSnareDynamics:rhythmGrid==='triplet16'?triplet16SnareDynamics:rhythmGrid==='triplet'?tripletSnareDynamics:straightSnareDynamics;
 hatBanks=rhythmGrid==='mixed'?mixedHatBanks:rhythmGrid==='triplet16'?triplet16HatBanks:rhythmGrid==='triplet'?tripletHatBanks:straightHatBanks;
 refreshPatterns();shownStep=-1;
 try{localStorage.setItem(gridKey,rhythmGrid)}catch(e){}
 syncRhythmSettings();seq();score();
};
let queuedBeatDivisions={};
function applyQueuedBeatDivisions(){
 const changes=Object.entries(queuedBeatDivisions);
 if(!changes.length)return;
 queuedBeatDivisions={};
 changes.forEach(([beat,division])=>applyBeatDivision(Number(beat),division));
}
function changeBeatDivision(beat,division){
 if(![3,4,6].includes(division)||beat<0||beat>3)return;
 if(running){
  queuedBeatDivisions[beat]=division;
  $('status').textContent='שינוי החלוקה ייכנס בתחילת התיבה הבאה';
  seq();
  return;
 }
 applyBeatDivision(beat,division);
}
function applyBeatDivision(beat,division){
 if(![3,4,6].includes(division)||beat<0||beat>3)return;
 if(rhythmGrid==='mixed'&&mixedBeats[beat]===division)return;
 if(rhythmGrid!=='mixed'){
  // Preserve every other beat exactly as it appears in the current uniform grid.
  // Transfer ALL instrument variations, snare dynamics and hat articulations
  // into absolute 48-tick positions before changing the requested beat.
  const formerDivision=subdivisions();
  const sourceBanks=instrumentBanks,sourceSnare=snareDynamics,sourceHats=hatBanks;
  const ticksForSource=Array.from({length:4},(_,b)=>offsets(formerDivision).map(t=>b*12+t)).flat();
  const expand=row=>Array.from({length:48},(_,tick)=>{
   const sourceIndex=ticksForSource.indexOf(tick);
   return sourceIndex>=0?Boolean(row[sourceIndex]):false;
  });
  const expandLevel=row=>Array.from({length:48},(_,tick)=>{
   const sourceIndex=ticksForSource.indexOf(tick);
   return sourceIndex>=0?(row[sourceIndex]||'normal'):'normal';
  });
  const expandHat=row=>Array.from({length:48},(_,tick)=>{
   const sourceIndex=ticksForSource.indexOf(tick);
   return sourceIndex>=0?{...(row[sourceIndex]||defaultHatStep())}:defaultHatStep();
  });
  // Keep a backup of the previous mixed work when entering it from another mode.
  try{
   const prior=localStorage.getItem(mixedKey);
   if(prior)localStorage.setItem((storagePrefix+'-mixed-patterns-backup-v1'),prior);
   const priorSnare=localStorage.getItem(mixedDynamicsKey);
   if(priorSnare)localStorage.setItem((storagePrefix+'-mixed-snare-backup-v1'),priorSnare);
   const priorHat=localStorage.getItem(mixedHatKey);
   if(priorHat)localStorage.setItem((storagePrefix+'-mixed-hats-backup-v1'),priorHat);
  }catch(e){}
  mixedBanks=sourceBanks.map(bank=>bank.map(expand));
  mixedSnareDynamics=sourceSnare.map(expandLevel);
  mixedHatBanks=sourceHats.map(expandHat);
  mixedBeats=Array(4).fill(formerDivision);
  rhythmGrid='mixed';$('rhythmGrid').value='mixed';
  instrumentBanks=mixedBanks;snareDynamics=mixedSnareDynamics;hatBanks=mixedHatBanks;
  try{localStorage.setItem(gridKey,'mixed')}catch(e){}
 }
 mixedBeats[beat]=division;
 try{localStorage.setItem(mixedBeatKey,JSON.stringify(mixedBeats))}catch(e){}
 saveVariations();saveSnareDynamics();saveHats();
 refreshPatterns();syncRhythmSettings();seq();score();
}
$('swing').oninput=()=>{$('swingOut').textContent=$('swing').value+'%'};
function updateClickSummary(){
 $('clickSummary').textContent=$('metro').checked?('פעיל · '+$('clickDivision').selectedOptions[0].textContent):'כבוי';
}
$('metro').onchange=updateClickSummary;
$('clickDivision').onchange=updateClickSummary;
$('clickVolume').oninput=()=>{$('clickVolumeOut').textContent=$('clickVolume').value+'%'};
const drumsKey=(storagePrefix+'-drums-enabled-v1');
try {const setting=localStorage.getItem(drumsKey);if(setting!==null)$('drumsEnabled').checked=setting==='true'}catch(e){}
$('drumsEnabled').onchange=()=>{try{localStorage.setItem(drumsKey,String($('drumsEnabled').checked))}catch(e){}};
const foldKey=(storagePrefix+'-panel-state-v1');
const folds=['settingsFold','clickFold','variationsFold','practiceFold'];
try{const states=JSON.parse(localStorage.getItem(foldKey));if(states&&typeof states==='object')folds.forEach(id=>{if(typeof states[id]==='boolean')$(id).open=states[id]})}catch(e){}
folds.forEach(id=>$(id).addEventListener('toggle',()=>{try{localStorage.setItem(foldKey,JSON.stringify(Object.fromEntries(folds.map(k=>[k,$(k).open]))))}catch(e){}}));
syncRhythmSettings();
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-view]').forEach(x=>x.classList.toggle('active',x===b));$('seq').classList.toggle('hide',b.dataset.view!=='seq');$('scoreWrap').classList.toggle('hide',b.dataset.view!=='score');if(b.dataset.view==='score')score()});
$('reset').onclick=()=>{
 for(let r=0;r<3;r++)instrumentBanks[r][selected[r]]=(rhythmGrid==='mixed'?mixedDefaults:rhythmGrid==='triplet16'?triplet16Defaults:rhythmGrid==='triplet'?tripletDefaults:extendedDefaults)[r][selected[r]].slice();
 hatBanks[selected[0]]=Array.from({length:stepCount()},defaultHatStep);saveHats();
 snareDynamics[selected[1]]=Array(stepCount()).fill('normal');saveSnareDynamics();
 refreshPatterns();saveVariations();seq();score();
};
$('randomize').onclick=randomizeCombination;
$('copyVar').onclick=()=>{
 const inst=prompt('איזה כלי להעתיק? HH, SN או KD');
 if(!inst)return;
 const r=['HH','SN','KD'].indexOf(inst.trim().toUpperCase());
 if(r<0){alert('בחר HH, SN או KD');return}
 const name=prompt('לאיזו וריאציה של '+ ['HH','SN','KD'][r] +' להעתיק? A עד H');
 if(!name)return;
 const dest='ABCDEFGH'.indexOf(name.trim().toUpperCase());
 if(dest<0){alert('בחר A עד H');return}
 if(dest===selected[r])return;
 instrumentBanks[r][dest]=instrumentBanks[r][selected[r]].slice();
 if(r===0){hatBanks[dest]=hatBanks[selected[0]].map(v=>({...v}));saveHats()}
 if(r===1){snareDynamics[dest]=snareDynamics[selected[1]].slice();saveSnareDynamics()}
 saveVariations();
 $('variationStatus').textContent='הועתק '+['HH','SN','KD'][r]+' אל '+ 'ABCDEFGH'[dest];
};
$('hatEditor').querySelectorAll('[data-hat-type]').forEach(b=>b.onclick=()=>changeHat('type',b.dataset.hatType));
$('hatEditor').querySelectorAll('[data-hat-level]').forEach(b=>b.onclick=()=>changeHat('level',b.dataset.hatLevel));
$('hatRemove').onclick=()=>{if(editedHatStep!==null){patterns[0][editedHatStep]=false;saveVariations();closeHatEditor();seq();score()}};
$('closeHatEditor').onclick=closeHatEditor;
$('hatEditor').onclick=e=>{if(e.target===$('hatEditor'))closeHatEditor()};
$('snareEditor').querySelectorAll('[data-snare-level]').forEach(b=>b.onclick=()=>assignSnareLevel(b.dataset.snareLevel));
$('closeSnareEditor').onclick=closeSnareEditor;
$('snareEditor').onclick=e=>{if(e.target===$('snareEditor'))closeSnareEditor()};
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('snareEditor').hidden)closeSnareEditor();if(!$('hatEditor').hidden)closeHatEditor()}});
paintVariations();seq();window.addEventListener('load',score);
})();
