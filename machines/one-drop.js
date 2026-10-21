// One Drop: independent musical data; shared Groove Lab engine.
// Hi-hat entries are provisional educational patterns, not song transcriptions.
window.GROOVE_MACHINE={
  "storagePrefix": "one-drop-v1",
  "labels": [
    [
      "שמיניות",
      "Spang-a-lang ישר",
      "אוף־ביט",
      "Spang ישר",
      "קישוט 16",
      "קישוט בסוף",
      "שינוי קצר",
      "שמיניות בסיס"
    ],
    [
      "One Drop",
      "One Drop",
      "One Drop",
      "One Drop",
      "One Drop",
      "One Drop",
      "One Drop",
      "One Drop"
    ],
    [
      "One Drop",
      "One Drop",
      "One Drop",
      "One Drop",
      "One Drop",
      "One Drop",
      "One Drop",
      "One Drop"
    ]
  ],
  "presets": [
    [
      [
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false
      ],
      [
        true,
        false,
        false,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        false,
        false,
        true,
        false,
        true,
        false
      ],
      [
        false,
        false,
        true,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        true,
        false
      ],
      [
        true,
        false,
        false,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        false,
        false,
        true,
        false,
        true,
        false
      ],
      [
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        true,
        true,
        false
      ],
      [
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        true
      ],
      [
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        true,
        true,
        false,
        true,
        false,
        true,
        false
      ],
      [
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false
      ]
    ],
    [
      [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      ],
      [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      ],
      [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      ],
      [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      ],
      [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      ],
      [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      ],
      [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      ],
      [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      ]
    ],
    [
      [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      ],
      [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      ],
      [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      ],
      [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      ],
      [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      ],
      [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      ],
      [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      ],
      [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      ]
    ]
  ]
};

/* H2 replacement: preserve all other variations and their settings. */
try {
 const prefix=window.GROOVE_MACHINE.storagePrefix;
 const flag=prefix+'-lesson-h2-spang-v1';
 if(localStorage.getItem(flag)!=='done'){
  const patternKey=prefix+'-per-instrument-v3';
  const banks=JSON.parse(localStorage.getItem(patternKey));
  if(Array.isArray(banks)&&Array.isArray(banks[0])&&banks[0].length===8){
   banks[0][1]=window.GROOVE_MACHINE.presets[0][1].slice();
   localStorage.setItem(patternKey,JSON.stringify(banks));
  }
  const hatKey=prefix+'-hihat-articulations-v1';
  const hats=JSON.parse(localStorage.getItem(hatKey))||Array.from({length:8},()=>Array.from({length:16},()=>({type:'closed',level:'normal'})));
  if(Array.isArray(hats)&&hats.length===8&&Array.isArray(hats[1])&&hats[1].length===16){
   hats[1]=Array.from({length:16},()=>({type:'closed',level:'normal'}));
   localStorage.setItem(hatKey,JSON.stringify(hats));
  }
  localStorage.setItem(flag,'done');
 }
}catch(e){console.warn('One Drop H2 setup skipped',e)}


/* H5-H6 independent variation data v1 */
(function(){
 const machine=window.GROOVE_MACHINE;
 const E=window.GrooveVariationEngine;
 if(!machine||!E)return;
 const prefix=machine.storagePrefix;
 const storageKey=prefix+'-variation-objects-v1';
 const versionKey=prefix+'-h5-h6-independent-v1';
 const h5=E.normalizeVariation({
  id:'HH5',name:'Stir It Up · קישוט 16',
  bars:[{divisions:[4,4,4,4],notes:[0,6,12,18,24,27,30,36,42].map(tick=>({tick,velocity:'normal',articulation:'closed'}))}]
 },'HH');
 const h6=E.normalizeVariation({
  id:'HH6',name:'Waiting in Vain · טריולות',
  bars:[{divisions:[4,6,4,6],notes:[0,6,12,18,22,24,30,36,42,46].map(tick=>({tick,velocity:tick===22?'soft':'normal',articulation:tick===46?'open':'closed'}))}]
 },'HH');
 machine.labels[0][4]=h5.name;
 machine.labels[0][5]=h6.name;
 function patch(){
  if(localStorage.getItem(versionKey)==='done')return true;
  const original=localStorage.getItem(storageKey);
  if(!original)return false;
  const banks=E.deserializeBanks(original);
  banks[0][4]=h5;banks[0][5]=h6;
  localStorage.setItem(storageKey,E.serializeBanks(banks));
  localStorage.setItem(versionKey,'done');
  return true;
 }
 try {
  if(!patch()){
   window.addEventListener('load',()=>{
    try {if(patch())location.reload()}catch(e){console.warn('H5/H6 delayed migration',e)}
   },{once:true});
  }
 }catch(e){console.warn('H5/H6 migration',e)}
})();


/* Restore accepted H1-H4 independent patterns v2 */
(function(){
 const E=window.GrooveVariationEngine,machine=window.GROOVE_MACHINE;
 if(!E||!machine)return;
 const prefix=machine.storagePrefix,bankKey=prefix+'-variation-objects-v1',flag=prefix+'-restore-h1-h4-v2';
 const h=(tick,articulation='closed')=>({tick,velocity:'normal',articulation});
 const variation=(id,name,bars)=>E.normalizeVariation({id,name,bars:bars.map(({ticks,open=[]})=>({
  divisions:[4,4,4,4],notes:ticks.map(t=>h(t,open.includes(t)?'open':'closed'))
 }))},'HH');
 const presets=[
  variation('HH1','Stir It Up · שמיניות',[{ticks:[0,6,12,18,24,30,36,42]}]),
  variation('HH2','Spang-a-lang ישר',[{ticks:[0,12,18,24,36,42]}]),
  variation('HH3','Three Little Birds · קל',[{ticks:[0,12,24,30,36],open:[12]},{ticks:[0,12,24,30,36],open:[36]}]),
  variation('HH4','Three Little Birds · מלא',[{ticks:[0,6,12,24,30,36,42],open:[12]},{ticks:[0,12,24,30,36],open:[36]}])
 ];
 machine.labels[0].splice(0,4,...presets.map(v=>v.name));
 const restore=()=>{
  if(localStorage.getItem(flag)==='done')return true;
  const data=localStorage.getItem(bankKey);if(!data)return false;
  const banks=E.deserializeBanks(data);
  // Keep complete snapshot before correcting the first four hi-hat variations.
  const backupKey=prefix+'-before-h1-h4-restore-v2';
  if(!localStorage.getItem(backupKey))localStorage.setItem(backupKey,data);
  for(let i=0;i<4;i++)banks[0][i]=presets[i];
  localStorage.setItem(bankKey,E.serializeBanks(banks));
  localStorage.setItem(flag,'done');
  return true;
 };
 try {
  if(!restore())window.addEventListener('load',()=>{
   try{if(restore())location.reload()}catch(e){console.warn('Restore H1-H4',e)}
  },{once:true});
 }catch(e){console.warn('Restore H1-H4',e)}
})();


/* One Drop snare S1-S6 independent variations v1 */
(function(){
 const E=window.GrooveVariationEngine,m=window.GROOVE_MACHINE;
 if(!E||!m)return;
 const prefix=m.storagePrefix,bankKey=prefix+'-variation-objects-v1',flag=prefix+'-snare-s1-s6-v1';
 const n=(tick,velocity='normal',articulation='normal')=>({tick,velocity,articulation});
 const b=(notes,divisions=[4,4,4,4])=>({divisions,notes});
 const entries=[
  ['One Drop',[b([n(24,'accent')])]],
  ['Rockers · 2 ו־4',[b([n(12,'accent','rim'),n(36,'accent','rim')])]],
  ['Early One Drop',[b([n(18,'soft','cross-stick'),n(24,'accent')])]],
  ['Ghost Groove',[b([n(21,'ghost'),n(24,'accent'),n(33,'ghost')])]],
  ['Dub Space · שתי תיבות',[b([n(24,'accent')]),b([n(42,'soft','cross-stick')])]],
  ['Reggae Fill',[b([n(24,'accent'),n(42,'soft'),n(45,'normal')])]]
 ];
 const presets=entries.map(([name,bars],i)=>E.normalizeVariation({id:'SN'+(i+1),name,bars},'SN'));
 m.labels[1].splice(0,6,...presets.map(v=>v.name));
 function apply(){
  if(localStorage.getItem(flag)==='done')return true;
  const saved=localStorage.getItem(bankKey);if(!saved)return false;
  const banks=E.deserializeBanks(saved);
  const backup=prefix+'-before-snare-s1-s6-v1';
  if(!localStorage.getItem(backup))localStorage.setItem(backup,saved);
  for(let i=0;i<presets.length;i++)banks[1][i]=presets[i];
  localStorage.setItem(bankKey,E.serializeBanks(banks));
  localStorage.setItem(flag,'done');
  return true;
 }
 try{
  if(!apply())window.addEventListener('load',()=>{try{if(apply())location.reload()}catch(e){console.warn('Snare init',e)}},{once:true});
 }catch(e){console.warn('Snare init',e)}
})();
