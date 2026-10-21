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
 const urlSearchClass=class{constructor(){}get(){return null}};
 let phase='boot';
 try{
  new Function('window','document','localStorage','location','navigator','setTimeout','setInterval','clearInterval','URLSearchParams',core)(
   window,document,localStorage,{search:''},{},()=>{},fn=>{intervalCallback=fn;return 1},()=>{intervalCallback=null},urlSearchClass
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
  phase='edit';selectors[1].value='6';selectors[1].onchange();
  phase='saved-bank';const prefix=machine?.storagePrefix||'groove-lab',text=storage.get(prefix+'-variation-objects-v1');
  if(!text)throw Error('Independent variation bank was not saved');
  const bank=engine.deserializeBanks(text);
  if(bank[0][5].bars[0].divisions[1]!==6)throw Error('Variation change was not stored');
  phase='playback';id('soundKit').value='synth';id('drumsEnabled').checked=true;id('loop').checked=true;id('bpm').value='80';id('swing').value='50';
  buttons[4].onclick(); // H5: regular subdivision, snare/kick remain at A
  id('play').onclick();
  if(!activeContext||oscillatorEvents.length===0)throw Error('Audio scheduler did not emit any events');
  const first=oscillatorEvents.slice(),quarter=.75;
  phase='queued H5-H6';buttons[5].onclick(); // H6: one beat edited to 6 subdivisions
  if(!intervalCallback)throw Error('Scheduler interval absent');
  activeContext.currentTime=103.01;intervalCallback();
  const second=oscillatorEvents.slice(first.length);
  if(!second.length)throw Error('No second-cycle audio events');
  const offsets=events=>events.filter(e=>e.frequency===145||e.frequency===170)
   .map(e=>({frequency:e.frequency,offset:Math.round(((e.time-100.05)%3+3)%3*1000)}))
   .sort((a,b)=>a.frequency-b.frequency||a.offset-b.offset);
  const a=offsets(first),b=offsets(second);
  if(JSON.stringify(a)!==JSON.stringify(b))throw Error('Snare/kick offsets changed during H5-H6 switch: '+JSON.stringify({a,b}));
  phase='return-to-legacy';id('independentSwitch').checked=false;id('independentSwitch').onchange();
  return {passed:true,steps:10,variationButtons:buttons.length,beatSelectors:selectors.length,storagePrefix:prefix,scheduledOscillators:first.length+second.length,preservedRhythmEvents:a.length};

 }catch(e){return {passed:false,phase,error:String(e),stack:String(e.stack||'').slice(0,420)}}
}
