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
