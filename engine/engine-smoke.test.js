/* Lightweight DOM boot smoke for Groove Lab & One Drop.
 * Does not test audio hardware or VexFlow rendering; use browser for those.
 * Usage: smokeGrooveCore({core,engine,machine});
 */
function smokeGrooveCore({core,engine,machine}){
 const elements=new Map(),listeners={},storage=new Map();
 class Element{
  constructor(tag='div'){
   this.tag=tag;this.children=[];this.style={};this.dataset={};this.value='';
   this.checked=false;this.hidden=false;this.textContent='';this.className='';
   this.classList={add(){},remove(){},toggle(){return true},contains(){return false}};
   this.selectedOptions=[{textContent:'רבעים'}];
  }
  append(...nodes){this.children.push(...nodes)}
  appendChild(child){this.append(child);return child}
  insertBefore(child,other){const index=this.children.indexOf(other);if(index<0)this.children.push(child);else this.children.splice(index,0,child);return child}
  replaceChildren(...nodes){this.children=nodes}
  querySelector(){return new Element()}
  querySelectorAll(){return []}
  setAttribute(){}
  getAttribute(){return null}
  addEventListener(){}
  remove(){}
 }
 const id=name=>{if(!elements.has(name))elements.set(name,new Element(name));return elements.get(name)};
 const document={
  getElementById:id,
  createElement:tag=>new Element(tag),
  createElementNS:(ns,tag)=>new Element(tag),
  addEventListener:(name,fn)=>{listeners[name]=fn},
  querySelector:()=>new Element(),
  querySelectorAll:()=>[],
  body:new Element('body')
 };
 const localStorage={
  getItem:key=>storage.has(key)?storage.get(key):null,
  setItem:(key,value)=>storage.set(key,String(value)),
  removeItem:key=>storage.delete(key)
 };
 const oscillatorEvents=[];let activeContext=null,intervalCallback=null;
 class MockAudioContext{
  constructor(){this.currentTime=100;this.sampleRate=44100;this.destination={};activeContext=this}
  createGain(){return {gain:{value:1,setValueAtTime(){},setTargetAtTime(){},exponentialRampToValueAtTime(){},linearRampToValueAtTime(){},cancelScheduledValues(){}},connect(){},disconnect(){}}}
  createOscillator(){
   const osc={baseFrequency:0,type:'',frequency:{setValueAtTime(value){osc.baseFrequency=value},exponentialRampToValueAtTime(){}},
    connect(){},start(time){oscillatorEvents.push({frequency:osc.baseFrequency,time})},stop(){}};
   return osc;
  }
  createBuffer(channels,length){return {getChannelData(){return new Float32Array(length)},duration:length/44100}}
  createBufferSource(){return {connect(){},start(){},stop(){},buffer:null}}
  createBiquadFilter(){return {type:'',frequency:{value:0},connect(){}}}
  createConvolver(){return {buffer:null,connect(){}}}
  resume(){return Promise.resolve()}
  close(){return Promise.resolve()}
 }
 const window={GROOVE_MACHINE:machine||null,GrooveVariationEngine:engine,AudioContext:MockAudioContext,Vex:null,addEventListener:(name,fn)=>{listeners[name]=fn}};
 const loggedErrors=[];const logger={warn(...x){loggedErrors.push(x.map(String).join(' '))},error(...x){loggedErrors.push(x.map(String).join(' '))}};
 const urlSearchClass=class{constructor(){}get(){return null}};
 let phase='boot';
 try{
  new Function('window','document','localStorage','location','navigator','setTimeout','setInterval','clearInterval','URLSearchParams','console',core)(
   window,document,localStorage,{search:''},{},()=>{},fn=>{intervalCallback=fn;return 1},()=>{intervalCallback=null},urlSearchClass,logger
  );
  phase='load';if(listeners.load)listeners.load();
  phase='activate';id('independentSwitch').checked=true;id('independentSwitch').onchange();
  phase='variation';const buttons=[];
  const walk=n=>{
   if(!n||typeof n!=='object')return;
   if(typeof n.className==='string'&&n.className.startsWith('variation-btn'))buttons.push(n);
   for(const c of n.children||[])walk(c);
  };
  walk(id('variations'));
  if(buttons.length!==24)throw Error('Expected 24 instrument variation buttons, got '+buttons.length);
  buttons[5].onclick();
  phase='subdivision-controls';const selectors=[];
  const search=n=>{
   if(!n||typeof n!=='object')return;
   if(n.tag==='select')selectors.push(n);
   for(const c of n.children||[])search(c);
  };
  search(id('seq'));
  if(selectors.length!==12)throw Error('Expected 12 subdivision selectors, got '+selectors.length);
  phase='notation';let notationTuplets=0;
  const chain=()=>({addClef(){return this},setContext(){return this},draw(){return this},
   addTimeSignature(){return this},getContext(){return {}},resize(){return this},setConfig(){return this}});
  const Renderer=class{constructor(){this.core=chain()}resize(){}getContext(){return {}}};
  Renderer.Backends={SVG:1};
  const Stave=class{addClef(){return this}setContext(){return this}draw(){return this}};
  const StaveNote=class{constructor(options){this.options=options}getAbsoluteX(){return 80}getYs(){return [28]}};
  const Voice=class{addTickables(){return this}draw(){return this}};
  const Formatter=class{joinVoices(){return this}format(){return this}};
  const Tuplet=class{constructor(){notationTuplets++}setContext(){return this}draw(){return this}};
  const Beam=class{setContext(){return this}draw(){return this}};
  window.Vex={Flow:{Renderer,Stave,StaveNote,Voice,Formatter,Tuplet,Beam}};
  phase='edit';selectors[1].value='6';selectors[1].onchange();
  if(notationTuplets===0)throw Error('Independent 6-part notation did not create triplet groups');
  if(id('scoreMsg').textContent.includes('חלק מן התיווי'))throw Error('Independent notation failed');
  phase='saved-bank';const prefix=machine?.storagePrefix||'groove-lab',text=storage.get(prefix+'-variation-objects-v1');
  if(!text)throw Error('Independent variation bank was not saved');
  const bank=engine.deserializeBanks(text);
  if(bank[0][5].bars[0].divisions[1]!==6)throw Error('Variation change was not stored');
  const archived=JSON.parse(storage.get(prefix+'-legacy-grid-archive-v1')||'null');
  if(!archived||!['straight','triplet','triplet16','mixed'].every(mode=>archived.banks?.[mode]?.length===3))throw Error('All four legacy grid banks were not backed up');
  phase='playback';id('soundKit').value='synth';id('drumsEnabled').checked=true;id('loop').checked=true;id('bpm').value='80';id('swing').value='50';
  buttons[4].onclick(); // H5: current pattern; SN and KD remain at variation A
  id('play').onclick();
  if(!activeContext||!intervalCallback)throw Error('Web Audio scheduler was not initialized');
  // Advance one beat at a time to mirror the 90ms lookahead scheduler.
  function advance(time){activeContext.currentTime=time;intervalCallback()}
  for(const time of [100.81,101.56,102.31])advance(time);
  const first=oscillatorEvents.filter(e=>e.time>=100.05&&e.time<103.05);
  const beat=0.75;
  phase='queued H5-H6';buttons[5].onclick(); // change HH only at next phrase boundary
  advance(103.06); // now the next phrase begins; HH H6 is selected
  // A step can be added or removed during playback.
  phase='live-step-edit';
  const allNodes=(start,predicate)=>{
   const result=[];
   const walk=n=>{if(!n||typeof n!=='object')return;if(predicate(n))result.push(n);for(const c of n.children||[])walk(c)};
   walk(start);return result;
  };
  const snSteps=allNodes(id('seq'),n=>n.tag==='button'&&n.dataset.step==='36');
  if(snSteps.length<3)throw Error('Cannot find editable sequencer steps');
  const bankBefore=engine.deserializeBanks(storage.get((machine?.storagePrefix||'groove-lab')+'-variation-objects-v1'));
  const snBefore=bankBefore[1][0].bars[0].notes.length;
  snSteps[1].onclick();
  const bankAfter=engine.deserializeBanks(storage.get((machine?.storagePrefix||'groove-lab')+'-variation-objects-v1'));
  if(bankAfter[1][0].bars[0].notes.length===snBefore)throw Error('Live step edit did not persist');
  snSteps[1].onclick(); // the old button references same tick; restore original snare pattern
  phase='live-division-edit';
  const liveSelectors=allNodes(id('seq'),n=>n.tag==='select');
  if(liveSelectors.length!==12)throw Error('Missing live subdivision controls');
  liveSelectors[0].value='2';liveSelectors[0].onchange();
  const liveBank=engine.deserializeBanks(storage.get((machine?.storagePrefix||'groove-lab')+'-variation-objects-v1'));
  if(liveBank[0][5].bars[0].divisions[0]!==2)throw Error('Live subdivision edit was rejected');
  for(const time of [103.81,104.56,105.31])advance(time);
  const second=oscillatorEvents.filter(e=>e.time>=103.05&&e.time<106.05);
  const offsets=(events,origin)=>events.filter(e=>e.frequency===145||e.frequency===170)
   .map(e=>({frequency:e.frequency,offset:Math.round((e.time-origin)*1000)}))
   .sort((a,b)=>a.frequency-b.frequency||a.offset-b.offset);
  const a=offsets(first,100.05),b=offsets(second,103.05);
  if(a.length===0||JSON.stringify(a)!==JSON.stringify(b))
   throw Error('Snare/kick timing changed during H5→H6 + live editing: '+JSON.stringify({a,b}));
  phase='return-to-legacy';id('independentSwitch').checked=false;id('independentSwitch').onchange();
  return {passed:true,steps:10,variationButtons:buttons.length,beatSelectors:selectors.length,storagePrefix:prefix,scheduledOscillators:first.length+second.length,preservedRhythmEvents:a.length,liveEditing:true,notationTuplets};

 }catch(e){return {passed:false,phase,error:String(e),stack:String(e.stack||'').slice(0,420),loggedErrors}}
}
