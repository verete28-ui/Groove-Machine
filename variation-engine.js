/* Groove Lab shared variation engine v1
 * One quarter = 12 integer ticks; one 4/4 bar = 48 ticks.
 * Portable pure-JS module (browser global + CommonJS) with no DOM/audio dependency.
 */
(function(root,factory){
 const engine=factory();
 if(typeof module==='object'&&module.exports)module.exports=engine;
 root.GrooveVariationEngine=engine;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const TICKS_PER_BEAT=12,BAR_TICKS=48,DIVISIONS=[2,3,4,6],LANES=['HH','SN','KD'];
 function checkedDivisions(input){
  if(!Array.isArray(input)||input.length!==4||input.some(n=>!DIVISIONS.includes(n)))throw Error('Expected four beat divisions from 2, 3, 4 or 6');
  return input.slice();
 }
 const finite=(n,fallback)=>Number.isFinite(Number(n))?Number(n):fallback;
 function normalizeNote(note){
  const tick=Math.floor(finite(note&&note.tick,-1));
  if(tick<0||tick>=BAR_TICKS)throw Error('Event tick outside 4/4 bar');
  const velocity=['ghost','soft','normal','accent'].includes(note.velocity)?note.velocity:'normal';
  const articulation=['closed','half','open','pedal','normal','rim','cross-stick'].includes(note.articulation)?note.articulation:'normal';
  return {tick,velocity,articulation};
 }
 function normalizeBar(bar){
  const divisions=checkedDivisions(bar&&bar.divisions);
  const seen=new Set();
  const notes=(bar.notes||[]).map(normalizeNote).filter(note=>{
   if(seen.has(note.tick))return false;
   seen.add(note.tick);return true;
  }).sort((a,b)=>a.tick-b.tick);
  return {divisions,notes};
 }
 function normalizeVariation(value,instrument){
  if(!value||typeof value.id!=='string'||!Array.isArray(value.bars)||![1,2].includes(value.bars.length))throw Error('Variation requires id and one or two bars');
  return {id:value.id,name:String(value.name||value.id),instrument:instrument||value.instrument||null,bars:value.bars.map(normalizeBar)};
 }
 function visibleTicks(divisions){
  return checkedDivisions(divisions).flatMap((div,beat)=>Array.from({length:div},(_,n)=>beat*TICKS_PER_BEAT+n*TICKS_PER_BEAT/div));
 }
 function eventIsOnGrid(tick,divisions){return visibleTicks(divisions).includes(tick)}
 function quantizeTick(tick,divisions){
  const ticks=visibleTicks(divisions);
  return ticks.reduce((best,n)=>Math.abs(n-tick)<Math.abs(best-tick)?n:best,ticks[0]);
 }
 function swingPosition(tick,divisions,amount){
  const beat=Math.floor(tick/12),div=divisions[beat],position=tick-beat*12;
  const swing=Math.min(.75,Math.max(.5,finite(amount,.5)));
  if(div!==2&&div!==4)return beat+position/12;
  const first=swing*12,scaled=position<=6?position*first/6:first+(position-6)*(12-first)/6;
  return beat+scaled/12;
 }
 function activeBar(variation,cycleBar){return variation.bars[cycleBar%variation.bars.length]}
 function eventsForBar(variation,cycleBar,swing=.5){
  const b=activeBar(variation,cycleBar);
  return b.notes.map(note=>({...note,beatTime:swingPosition(note.tick,b.divisions,swing),bar:cycleBar}));
 }
 function cycleBars(variations){return variations.some(v=>v.bars.length===2)?2:1}
 function timeline(variations,swing=.5){
  const bars=cycleBars(variations),out=[];
  for(let bar=0;bar<bars;bar++)for(let lane=0;lane<variations.length;lane++){
   for(const event of eventsForBar(variations[lane],bar,swing)){
    out.push({...event,lane,quarter:bar*4+event.beatTime});
   }
  }
  return out.sort((a,b)=>a.quarter-b.quarter||a.lane-b.lane||a.tick-b.tick);
 }
 function legacyTick(index,mode){
  if(mode==='mixed')return index;
  const div=mode==='triplet'?3:mode==='triplet16'?6:4;
  return Math.floor(index/div)*12+(index%div)*12/div;
 }
 function divisionsForMode(mode,mixed){
  return mode==='mixed'?checkedDivisions(mixed||[4,3,4,6]):Array(4).fill(mode==='triplet'?3:mode==='triplet16'?6:4);
 }
 function convertLegacyBar(row,mode,beatDivisions,dynamics,articulations,instrument){
  const notes=[];
  (row||[]).forEach((hit,index)=>{
   if(!hit)return;
   const tick=legacyTick(index,mode);
   const d=dynamics&&dynamics[index];
   const a=articulations&&articulations[index];
   notes.push({tick,
    velocity:instrument==='SN'?(d||'normal'):instrument==='HH'?(a&&a.level||'normal'):'normal',
    articulation:instrument==='HH'?(a&&a.type||'closed'):'normal'});
  });
  return normalizeBar({divisions:divisionsForMode(mode,beatDivisions),notes});
 }
 function migrateLegacy(input){
  // The caller supplies a snapshot of the old localStorage banks. Do not modify it.
  const mode=input.mode||'straight',labels=input.labels||[[],[],[]];
  const result=[[],[],[]];
  for(let r=0;r<3;r++)for(let i=0;i<8;i++){
   const first=convertLegacyBar(input.banks[r][i],mode,input.firstDivisions,
    r===1?input.snareDynamics&&input.snareDynamics[i]:null,
    r===0?input.hatBanks&&input.hatBanks[i]:null,LANES[r]);
   const bars=[first],hasSecond=input.lengths&&input.lengths[r]&&input.lengths[r][i]===2;
   if(hasSecond){
    const second=(input.second&&input.second.initialized&&input.second.initialized[r]&&input.second.initialized[r][i])?
     convertLegacyBar(input.second.patterns[r][i],mode,input.secondDivisions||input.firstDivisions,
      r===1&&input.second.snare?input.second.snare[i]:null,
      r===0&&input.second.hats?input.second.hats[i]:null,LANES[r]):
     normalizeBar({divisions:input.secondDivisions||first.divisions,notes:first.notes});
    bars.push(second);
   }
   result[r].push(normalizeVariation({id:LANES[r]+(i+1),name:labels[r]&&labels[r][i]||LANES[r]+' '+(i+1),bars},LANES[r]));
  }
  return result;
 }
 function serializeBanks(banks){return JSON.stringify({version:1,ticksPerBeat:12,banks})}
 function deserializeBanks(text){
  const parsed=JSON.parse(text);
  if(parsed.version!==1||!Array.isArray(parsed.banks)||parsed.banks.length!==3)throw Error('Unsupported variation data');
  return parsed.banks.map((bank,r)=>{
   if(!Array.isArray(bank)||bank.length!==8)throw Error('Expected eight variations per instrument');
   return bank.map(v=>normalizeVariation(v,LANES[r]));
  });
 }
 function compose(banks,selection){return selection.map((idx,r)=>banks[r][idx])}
 function editDivision(banks,lane,index,bar,beat,division){
  if(!DIVISIONS.includes(division)||beat<0||beat>3)throw Error('Invalid beat division');
  const v=banks[lane][index];if(!v||!v.bars[bar])throw Error('Missing variation bar');
  v.bars[bar].divisions[beat]=division;
  // Existing off-grid notes intentionally preserved; editors can mark them.
  return v;
 }
 return Object.freeze({TICKS_PER_BEAT,BAR_TICKS,DIVISIONS,LANES,normalizeVariation,normalizeBar,visibleTicks,eventIsOnGrid,quantizeTick,swingPosition,eventsForBar,activeBar,cycleBars,timeline,migrateLegacy,serializeBanks,deserializeBanks,compose,editDivision});
});