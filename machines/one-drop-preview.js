
window.GROOVE_MACHINE={"storagePrefix":"one-drop-preview-v2","labels":[["שמיניות","Spang-a-lang ישר","Three Little Birds · קל","Three Little Birds · מקור","Stir It Up · 16יות","Waiting in Vain · טריולות","שינוי קצר","שמיניות בסיס"],["One Drop","One Drop","One Drop","One Drop","One Drop","One Drop","One Drop","One Drop"],["One Drop","One Drop","One Drop","One Drop","One Drop","One Drop","One Drop","One Drop"]],"presets":[[[true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false],[true,false,false,false,true,false,true,false,true,false,false,false,true,false,true,false],[true,false,false,false,true,false,false,false,true,false,false,false,true,false,false,false],[true,false,false,false,true,false,false,false,true,false,true,false,true,false,false,false],[true,false,true,false,true,false,true,false,true,true,true,false,true,false,true,false],[true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false],[true,false,true,false,true,false,true,false,true,true,true,false,true,false,true,false],[true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false]],[[false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false]],[[false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false]]]};

(()=>{
 const prefix=window.GROOVE_MACHINE.storagePrefix;
 const flag=prefix+'-three-little-birds-corrected-v2';
 if(localStorage.getItem(flag)==='done')return;
 try{
 const definitions=[[{"hits":[0,2,4,5,6],"open":[2]},{"hits":[0,2,4,5,6],"open":[6]}],[{"hits":[0,1,2,4,5,6,7],"open":[2]},{"hits":[0,2,4,5,6],"open":[6]}]];
 const toGrid=bar=>Array.from({length:16},(_,i)=>i%2===0&&bar.hits.includes(i/2));
 const toHats=bar=>Array.from({length:16},(_,i)=>({type:i%2===0&&bar.open.includes(i/2)?'open':'closed',level:'normal'}));
 const gridKey=prefix+'-per-instrument-v3';
 const banks=JSON.parse(localStorage.getItem(gridKey))||window.GROOVE_MACHINE.presets.map(bank=>bank.map(row=>row.slice()));
 for(let k=0;k<2;k++)banks[0][k+2]=toGrid(definitions[k][0]);
 localStorage.setItem(gridKey,JSON.stringify(banks));
 const hatKey=prefix+'-hihat-articulations-v1';
 const hats=JSON.parse(localStorage.getItem(hatKey))||Array.from({length:8},()=>Array.from({length:16},()=>({type:'closed',level:'normal'})));
 for(let k=0;k<2;k++)hats[k+2]=toHats(definitions[k][0]);
 localStorage.setItem(hatKey,JSON.stringify(hats));
 const lengthKey=prefix+'-variation-lengths-v1';
 const lengths=JSON.parse(localStorage.getItem(lengthKey))||Array.from({length:3},()=>Array(8).fill(1));
 lengths[0][2]=2;lengths[0][3]=2;localStorage.setItem(lengthKey,JSON.stringify(lengths));
 const secondKey=prefix+'-second-bar-data-v1';
 const secondData=JSON.parse(localStorage.getItem(secondKey))||{};
 const d=secondData.straight||{patterns:Array.from({length:3},()=>Array.from({length:8},()=>Array(16).fill(false))),snare:Array.from({length:8},()=>Array(16).fill('normal')),hats:Array.from({length:8},()=>Array.from({length:16},()=>({type:'closed',level:'normal'}))),initialized:Array.from({length:3},()=>Array(8).fill(false))};
 for(let k=0;k<2;k++){d.patterns[0][k+2]=toGrid(definitions[k][1]);d.hats[k+2]=toHats(definitions[k][1]);d.initialized[0][k+2]=true}
 secondData.straight=d;localStorage.setItem(secondKey,JSON.stringify(secondData));
 localStorage.setItem(flag,'done');
 }catch(e){console.warn('Three Little Birds migration',e)}
})();

/* H5 and H6: separate grooves, isolated to One Drop's storage. */
(()=>{
 const prefix=window.GROOVE_MACHINE.storagePrefix;
 const version=prefix+'-h5-h6-v1';
 if(localStorage.getItem(version)==='done')return;
 try {
  const straightKey=prefix+'-per-instrument-v3';
  const straight=JSON.parse(localStorage.getItem(straightKey))||window.GROOVE_MACHINE.presets.map(bank=>bank.map(row=>row.slice()));
  straight[0][4]=window.GROOVE_MACHINE.presets[0][4].slice();
  straight[0][5]=window.GROOVE_MACHINE.presets[0][5].slice();
  localStorage.setItem(straightKey,JSON.stringify(straight));
  const articulationKey=prefix+'-hihat-articulations-v1';
  const hats=JSON.parse(localStorage.getItem(articulationKey))||Array.from({length:8},()=>Array.from({length:16},()=>({type:'closed',level:'normal'})));
  hats[4]=Array.from({length:16},()=>({type:'closed',level:'normal'}));
  hats[5]=Array.from({length:16},()=>({type:'closed',level:'normal'}));
  localStorage.setItem(articulationKey,JSON.stringify(hats));
  // H6: eighth-note triplets across beats plus late-triplet ornament on beats 2 and 4.
  // Triplet16 mode: 6 equally spaced slots per quarter note (24 in the bar).
  const tripletKey=prefix+'-triplet16-patterns-v1';
  const tripletBanks=JSON.parse(localStorage.getItem(tripletKey))||Array.from({length:3},()=>Array.from({length:8},()=>Array(24).fill(false)));
  tripletBanks[0][5]=Array.from({length:24},(_,i)=>[0,3,6,9,11,12,15,18,21,23].includes(i));
  // Fixed One Drop kick/snare on beat 3 in triplet mode.
  for(let r=1;r<3;r++)tripletBanks[r][5]=Array.from({length:24},(_,i)=>i===12);
  localStorage.setItem(tripletKey,JSON.stringify(tripletBanks));
  const tripletHatKey=prefix+'-triplet16-hihat-articulations-v1';
  const tripletHats=JSON.parse(localStorage.getItem(tripletHatKey))||Array.from({length:8},()=>Array.from({length:24},()=>({type:'closed',level:'normal'})));
  tripletHats[5]=Array.from({length:24},(_,i)=>({type:i===23?'open':'closed',level:'normal'}));
  localStorage.setItem(tripletHatKey,JSON.stringify(tripletHats));
  localStorage.setItem(version,'done');
 }catch(e){console.warn('One Drop H5-H6 initialization failed',e)}
})();
