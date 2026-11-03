const assert=require('node:assert/strict');
const {parse,responseText}=require('./availability.js');
const sample=`ANVN19NOVICNHAN
** VIETNAM AIRLINES - AN ** HAN HANOI.VN
PASSPORT INFORMATION REQUIRED
 1   VN 417  JL Y9 B9 M9 S9 H8 LL /ICN 1 HAN 2  1035    1325  E0/787       4:50
 2   VN 415  J9 C1 DL Y9 B9 M9 S5 /ICN 1 HAN 2  1805    2055  E0/350       4:50
             HL LL
 3KE:VN3415  JL CL DL YL BL ML SL /ICN 2 HAN 2  0800    1110  E0/32Q       5:10
             HL KL LL QL NL RL TL
             OPERATED BY KOREAN AIR
 4KE:VN3411  JL CL DL YL BL ML SL /ICN 2 HAN 2  1845    2145  E0/781       5:00
             HL KL LL QL NL RL TL
             OPERATED BY KOREAN AIR
 5   VN 431  J3 C3 D3 Y9 B9 M9 S9 /ICN 1 DAD 2  1010    1315  E0/321
             HL
     VN 172  J3 C3 D3 W9 Z9 U9 Y9 /DAD 1 HAN 1  1445    1610  E0/321  EQT  8:00
             B9 M9 S9 HL KL LL QL NL RL TL G4
 6   VN 409  JL Y9 BL M9 S9 H9 K9 /ICN 1 SGN 2  1035    1355  E0/787
     VN 216  JL CL DL W9 Z9 U9 Y9 /SGN 3 HAN 1  1600    1810  E0/787       9:35
             BL M9 S9 H9 K9 LL QL
>`;
const payload=JSON.stringify({model:{output:{crypticResponse:{response:sample}}}});
assert.equal(responseText(payload),sample);
const rows=parse(responseText(payload));
assert.deepEqual(rows.map(r=>r.flight),['VN417','VN415','VN431','VN172','VN409','VN216']);
assert.deepEqual(rows.filter(r=>!r.displayFlight.startsWith('KE:')).map(r=>r.waitlist),[['J','L'],['D','H','L'],['H'],['H','K','L','Q','N','R','T'],['J','B'],['J','C','D','B','L','Q']]);
assert(!rows.some(row=>row.displayFlight.startsWith('KE')));
assert.deepEqual(rows[0].classes.find(c=>c.code==='Y'),{code:'Y',status:'available',seats:9});
assert.deepEqual(rows[0].classes.find(c=>c.code==='L'),{code:'L',status:'waitlist',seats:null});
assert.equal(rows[0].departure,'10:35');assert.equal(rows[0].arrival,'13:25');
assert.equal(rows[3].origin,'DAD');assert.equal(rows[3].destination,'HAN');assert.equal(rows[3].number,'5');
assert.equal(parse(' 1 VN 417 Y9 B9 /ICN 1 HAN 2 1035 1325 E0/787').length,1);
assert.equal(parse(' 1 VN 417 HL /ICN 1 HAN 2 1035 1325 E0/787\n OPERATED BY KOREAN AIR').length,0);
assert.equal(parse(' 1 KE 417 HL /ICN 1 HAN 2 1035 1325 E0/787').length,0);
assert.deepEqual(parse(' 1 VN 417 Y0 BC /ICN 1 HAN 2 1035 1325 E0/787')[0].classes,[{code:'Y',status:'closed',seats:0},{code:'B',status:'closed',seats:null}]);
assert.equal(parse(' 1 VN 417 HL /ICN 1 HAN 2 2335 0125+1 E0/787')[0].arrival,'01:25 (+1 ngày)');
assert.equal(responseText('<error>unavailable</error>'),null);
assert.deepEqual(parse('NO FLIGHTS AVAILABLE'),[]);
const queries=require('./booking.js').codes('anvn20novicnhan*23novhanicn');
const dual=`ANVN20NOVICNHAN*23NOVHANICN
** VIETNAM AIRLINES - AN ** HAN HANOI.VN                      17 FR 20NOV 0000
 1 VN 417 HL /ICN 1 HAN 2 1035 1325 E0/787
** VIETNAM AIRLINES - AN ** ICN INCHEON INTERNA.KR            20 MO 23NOV 0000
 5 VN 414 DL /HAN 2 ICN 1 1035 1630 E0/359
 6 VN 416 LL /HAN 2 ICN 1 2335 0530+1 E0/787`;
const dualRows=parse(dual,queries);
assert.equal(dualRows.length,3);
assert.equal(dualRows[0].searchCommand,'ANVN20NOVICNHAN');
assert.equal(dualRows[1].searchCommand,'ANVN23NOVHANICN');
assert.equal(dualRows[2].searchCommand,'ANVN23NOVHANICN');
console.log('PASS: KE exclusion, available seat counts, waitlists, closed-class parsing, connections, compound displays, overnight times');
