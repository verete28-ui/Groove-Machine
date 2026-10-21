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
 const window={GROOVE_MACHINE:machine||null,GrooveVariationEngine:engine,Vex:null,addEventListener:(name,fn)=>{listeners[name]=fn}};
 const urlSearchClass=class{constructor(){}get(){return null}};
 let phase='boot';
 try{
  new Function('window','document','localStorage','location','navigator','setTimeout','setInterval','clearInterval','URLSearchParams',core)(
   window,document,localStorage,{search:''},{},()=>{},()=>{},()=>{},urlSearchClass
  );
  phase='load';if(listeners.load)listeners.load();
  phase='activate';id('independentSwitch').checked=true;id('independentSwitch').onchange();
  phase='variation';const buttons=[];
  const walk=n=>{
   if(!n||typeof n!=='object')return;
   if(n.className==='variation-btn')buttons.push(n);
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
  phase='return-to-legacy';id('independentSwitch').checked=false;id('independentSwitch').onchange();
  return {passed:true,steps:8,variationButtons:buttons.length,beatSelectors:selectors.length,storagePrefix:prefix};
 }catch(e){return {passed:false,phase,error:String(e),stack:String(e.stack||'').slice(0,420)}}
}
