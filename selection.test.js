const assert=require('node:assert/strict'),A=require('./availability.js'),B=require('./booking.js');
const queries=B.codes('anvn20novicnvii*23novhanicn');
const response=`ANVN20NOVICNVII*23NOVHANICN
** VIETNAM AIRLINES - AN ** VII VINH.VN                       17 FR 20NOV 0000
PASSPORT INFORMATION REQUIRED
 1   VN 417  JL Y9 B9 M9 S9 H9 K9 /ICN 1 HAN 2  1035    1325  E0/787
     VN1717  JL CL DL W9 Z9 U9 Y9 /HAN 1 VII    1650    1745  E0/321  EQT  9:10
             B9 M9 S9 H9 K9 LL QL NL RL G4
 2   VN 409  JL Y9 B5 M9 S9 H9 K9 /ICN 1 SGN 2  1035    1355  E0/787
     VN1268  JL CL DL W9 Z9 U9 Y9 /SGN 3 VII    1845    2035  E0/321  EQT 12:00
             B5 M9 S9 H9 K9 LL QL NL RL
** VIETNAM AIRLINES - AN ** ICN INCHEON INTERNA.KR            20 MO 23NOV 0000
PASSPORT INFORMATION REQUIRED
11   VN 414  J9 C9 D6 Y9 B9 M9 S9 /HAN 2 ICN 1  1035    1630  E0/359       3:55
             H9 L9 Q9 N9
12   VN 416  J9 C9 D9 Y9 B8 M7 S6 /HAN 2 ICN 1  2335    0530+1E0/787       3:55
             H4 L1
13KE:VN3412  JL CL DL Y9 B9 ML SL /HAN 2 ICN 2  1220    1825  E0/32Q       4:05
             HL KL LL QL NL RL TL
             OPERATED BY KOREAN AIR`;
const rows=A.parse(response,queries);
assert.deepEqual(rows.map(r=>r.flight),['VN417','VN1717','VN409','VN1268','VN414','VN416']);
assert.equal(rows[0].segmentCount,2);assert.equal(rows[1].segmentIndex,1);
assert.equal(rows[4].searchCommand,queries[1].command);assert.equal(rows[5].arrival,'05:30 (+1 ngày)');
assert.deepEqual(A.visibleClasses(rows[0]).map(c=>c.code),['J','K']);
assert.deepEqual(A.visibleClasses(rows[4]),[{code:'N',status:'available',seats:9}]);
assert.deepEqual(A.visibleClasses(rows[5]),[{code:'L',status:'available',seats:1}]);
assert.equal(A.visibleClasses(rows[1]).filter(c=>c.status==='available').length,1);
assert.deepEqual(A.visibleClasses(rows[1]).map(c=>c.code),['J','K']);
assert(!A.visibleClasses(rows[1]).some(c=>c.code==='G'||c.code==='C'));
assert.equal(A.visibleClasses(rows[0],'K Y').find(c=>c.status==='available').code,'Y');
assert.equal(A.selectionCheck(rows,[],queries).ok,false);
assert.equal(A.selectionCheck(rows,[rows[0]],queries).ok,false);
assert.equal(A.selectionCheck(rows,[rows[0],rows[4]],queries).ok,false);
assert.equal(A.selectionCheck(rows,[rows[0],rows[1]],queries).ok,false);
assert.equal(A.selectionCheck(rows,[rows[0],rows[1],rows[4]],queries).ok,true);
assert.equal(A.selectionCheck(rows,[rows[0],rows[3],rows[4]],queries).ok,false);
assert.equal(A.selectionCheck(rows,[rows[0],rows[1],rows[4],rows[5]],queries).ok,false);
const chosen=[rows[0],rows[1],rows[4]].map(row=>({...row,date:B.codes(row.searchCommand)[0].date,class:A.visibleClasses(row).at(-1).code}));
const plan=B.plan(B.defaults,chosen,[{id:'adult',surname:'TEST',givenName:'USER',type:'ADT',gender:'M'}]);
assert(plan[0].command.includes('SSVN417K20NOVICNHANPE1'));
assert(plan[0].command.includes('SSVN414N23NOVHANICNPE1'));
const noHeaders=A.parse('1 VN 417 JL /ICN 1 HAN 2 1035 1325 E0/787\n11 VN 414 DL /HAN 2 ICN 1 1035 1630 E0/359',B.codes('anvn20novicnhan*23novhanicn'));
assert.equal(noHeaders[1].searchCommand,'ANVN23NOVHANICN');
console.log('PASS: supplied connecting roundtrip, KE exclusion, lowest available, clickable-class booking, all directions/segments required, return numbering, compact +1E0');
const connection=(first,second)=>A.parse(`1 VN 417 ${first} /ICN 1 HAN 2 1035 1325 E0/787\n  VN1717 ${second} /HAN 1 VII 1650 1745 E0/321`);
const waitlist=connection('JL CL','JL');
assert.deepEqual(waitlist.map(row=>A.visibleClasses(row).map(c=>c.code)),[['J'],['J']]);
const seats=connection('Y9 B5 M4','Y8 B2 H9');
assert.deepEqual(seats.map(row=>A.visibleClasses(row).map(c=>[c.code,c.seats])),[[['B',5]],[['B',2]]]);
const mixed=connection('JL Y9 B4','J2 Y3 B1');
assert.deepEqual(mixed.map(row=>A.visibleClasses(row).map(c=>c.code)),[['J','B'],['J','B']]);
assert.equal(A.visibleClasses(mixed[0])[0].status,'waitlist');
assert.equal(A.visibleClasses(mixed[1])[0].status,'available');
const none=connection('JL','CL');assert(none.every(row=>A.visibleClasses(row).length===0));
const closed=connection('JL Y9','JC Y0');assert(closed.every(row=>A.visibleClasses(row).length===0));
assert.deepEqual(seats.map(row=>A.visibleClasses(row,'B Y').map(c=>c.code)),[['Y'],['Y']]);
console.log('PASS: common connecting classes, shared lowest available, per-leg seats/status, mixed status, no common classes, closed classes and custom ranking');
const keyed=rows.map((row,index)=>({...row,key:String(index),date:B.codes(row.searchCommand)[0].date}));
let automatic=A.selectClass(keyed,new Map(),keyed[0],'J');
assert.equal(automatic.size,2);assert.equal(automatic.get('0').class,'J');assert.equal(automatic.get('1').class,'J');
automatic=A.selectClass(keyed,automatic,keyed[1],'K');
assert.equal(automatic.get('0').class,'K');assert.equal(automatic.get('1').class,'K');
automatic=A.selectClass(keyed,automatic,keyed[4],'N');
assert.equal(A.selectionCheck(keyed,automatic.values(),queries).ok,true);
automatic=A.selectClass(keyed,automatic,keyed[2],'J');
assert(!automatic.has('0')&&!automatic.has('1'));assert(automatic.has('2')&&automatic.has('3')&&automatic.has('4'));
automatic=A.selectClass(keyed,automatic,keyed[3],'J');
assert.equal(automatic.size,1);assert(automatic.has('4'));
assert.throws(()=>A.selectClass(keyed,automatic,keyed[0],'C'));
assert.equal(automatic.size,1);
console.log('PASS: auto-select all connecting segments, change shared class, preserve return, replace itinerary, deselect group, reject unavailable class');
