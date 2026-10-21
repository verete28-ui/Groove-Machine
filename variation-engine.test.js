/* Run with: node variation-engine.test.js (or paste into a JS runtime). */
const assert=require('assert');
const E=require('./variation-engine.js');
const bar=(divisions,notes)=>({divisions,notes:notes.map(t=>({tick:t}))});
const v=(id,bars)=>E.normalizeVariation({id,name:id,bars});
assert.deepStrictEqual(E.visibleTicks([2,3,4,6]),[0,6,12,16,20,24,27,30,33,36,38,40,42,44,46]);
assert.strictEqual(E.swingPosition(6,[4,4,4,4],.65),.65);
assert.strictEqual(E.swingPosition(6,[4,4,4,4],.5),.5);
assert.strictEqual(E.swingPosition(16,[2,3,4,6],.65),1+4/12);
const h5=v('H5',[bar([4,4,4,4],[0,3,6,9,12])]);
const h6=v('H6',[bar([4,6,4,6],[0,2,4,6,8,10,12])]);
const sn=v('S1',[bar([4,4,4,4],[12,36])]);
const kd=v('K1',[bar([2,2,2,2],[0,24])]);
const old=E.timeline([h5,sn,kd]);
const next=E.timeline([h6,sn,kd]);
assert.deepStrictEqual(old.filter(x=>x.lane===1).map(x=>x.quarter),next.filter(x=>x.lane===1).map(x=>x.quarter));
assert.deepStrictEqual(old.filter(x=>x.lane===2).map(x=>x.quarter),next.filter(x=>x.lane===2).map(x=>x.quarter));
assert.strictEqual(E.cycleBars([h5,sn,kd]),1);
const two=v('H2',[bar([4,4,4,4],[0,6]),bar([6,6,6,6],[0,2,4,6])]);
assert.strictEqual(E.cycleBars([two,sn,kd]),2);
const phrase=E.timeline([two,sn,kd]);
assert.deepStrictEqual(phrase.filter(x=>x.lane===1).map(x=>x.quarter),[1,3,5,7]);
assert.deepStrictEqual(phrase.filter(x=>x.lane===2).map(x=>x.quarter),[0,2,4,6]);
assert.deepStrictEqual(E.eventsForBar(two,1).map(x=>x.tick),[0,2,4,6]);
const source={mode:'mixed',firstDivisions:[4,6,4,6],secondDivisions:[3,3,3,3],
 banks:Array.from({length:3},()=>Array.from({length:8},()=>Array(48).fill(false))),
 snareDynamics:Array.from({length:8},()=>Array(48).fill('normal')),
 hatBanks:Array.from({length:8},()=>Array.from({length:48},()=>({type:'closed',level:'normal'}))),
 lengths:Array.from({length:3},()=>Array(8).fill(1)),
 second:{initialized:Array.from({length:3},()=>Array(8).fill(false)),
  patterns:Array.from({length:3},()=>Array.from({length:8},()=>Array(48).fill(false))),
  snare:Array.from({length:8},()=>Array(48).fill('normal')),
  hats:Array.from({length:8},()=>Array.from({length:48},()=>({type:'closed',level:'normal'})))}
};
source.banks[0][5][14]=true;source.hatBanks[5][14]={type:'open',level:'accent'};
source.banks[1][1][12]=true;source.snareDynamics[1][12]='ghost';
source.lengths[0][5]=2;source.second.initialized[0][5]=true;source.second.patterns[0][5][16]=true;
const snap=JSON.stringify(source);
const converted=E.migrateLegacy(source);
assert.strictEqual(JSON.stringify(source),snap,'migration must not modify original localStorage');
assert.deepStrictEqual(converted[0][5].bars[0].divisions,[4,6,4,6]);
assert.deepStrictEqual(converted[0][5].bars[1].divisions,[3,3,3,3]);
assert.deepStrictEqual(converted[0][5].bars[0].notes[0],{tick:14,velocity:'accent',articulation:'open'});
assert.strictEqual(converted[0][5].bars[1].notes[0].tick,16);
assert.strictEqual(converted[1][1].bars[0].notes[0].velocity,'ghost');
assert.strictEqual(converted[0][5].bars.length,2);
const encoded=E.serializeBanks(converted);
const recovered=E.deserializeBanks(encoded);
assert.deepStrictEqual(recovered,converted);
E.editDivision(recovered,0,5,0,1,3);
assert.deepStrictEqual(recovered[0][5].bars[0].divisions,[4,3,4,6]);
assert.strictEqual(recovered[0][5].bars[0].notes[0].tick,14,'off-grid edit remains intact');
assert.strictEqual(E.eventIsOnGrid(14,[4,3,4,6]),false);
assert.throws(()=>E.normalizeVariation({id:'no',bars:[bar([5,4,4,4],[0])]}));
console.log('Groove Variation Engine: all 20+ assertions passed');