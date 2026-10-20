
window.GROOVE_MACHINE={"storagePrefix":"one-drop-preview-v2","labels":[["שמיניות","Spang-a-lang ישר","Three Little Birds · קל","Three Little Birds · מקור","קישוט 16","קישוט בסוף","שינוי קצר","שמיניות בסיס"],["One Drop","One Drop","One Drop","One Drop","One Drop","One Drop","One Drop","One Drop"],["One Drop","One Drop","One Drop","One Drop","One Drop","One Drop","One Drop","One Drop"]],"presets":[[[true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false],[true,false,false,false,true,false,true,false,true,false,false,false,true,false,true,false],[true,false,false,false,true,false,false,false,true,false,false,false,true,false,false,false],[true,false,false,false,true,false,false,false,true,false,true,false,true,false,false,false],[true,false,true,false,true,false,true,false,true,false,true,false,true,true,true,false],[true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,true],[true,false,true,false,true,false,true,false,true,true,true,false,true,false,true,false],[true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false]],[[false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false]],[[false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false]]]};

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
