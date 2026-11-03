const assert=require('node:assert/strict');
const B=require('./booking.js');
const settings={...B.defaults};
const route=B.routeCode({origin:'ICN',destination:'HAN',departure:'2026-11-20',returnDate:'2026-11-23'});
assert.equal(route.code,'anvn20novicnhan*23novhanicn');assert.equal(route.complete,true);
assert.equal(B.wireCode(route.code),'ANVN20NOVICNHAN*23NOVHANICN');
assert.equal(B.routeCode({origin:'ICN',destination:'HAN',departure:'2026-11-20'}).code,'anvn20novicnhan');
assert.equal(B.routeCode({origin:'ICN'}).code,'anvn[ngày đi]icn[nơi đến]');
assert.equal(B.routeCode({origin:'ICN'}).complete,false);
assert.equal(B.routeCode({origin:'HAN',destination:'HAN',departure:'2026-11-20'}).complete,false);
assert.equal(B.routeCode({origin:'ICN',destination:'HAN',departure:'2026-11-23',returnDate:'2026-11-20'}).complete,false);
assert.throws(()=>B.routeCode({origin:'ICN',destination:'HAN',departure:'2026-02-31'}));
const selected=[
  {flight:'VN415',class:'H',waitlist:['H','D'],date:'20NOV',origin:'ICN',destination:'HAN',number:'2',searchCommand:'ANVN20NOVICNHAN'},
  {flight:'VN415',class:'D',waitlist:['H','D'],date:'23NOV',origin:'HAN',destination:'ICN',number:'1',searchCommand:'ANVN23NOVHANICN'}
];
const people=[
  {id:'adult',surname:'TRINH',givenName:'SON',type:'ADT',gender:'M'},
  {id:'child',surname:'TRINH',givenName:'LONG',type:'CHD',gender:'M',birthDate:'2020-06-15'},
  {id:'infant',surname:'TRINH',givenName:'VU',type:'INF',gender:'M',birthDate:'2025-05-15',parentId:'adult'}
];
assert.equal(B.codes('anvn20novicnhan*anvn23novhansgn').length,2);
assert.equal(B.codes('anvn20novicnhan*23novhanicn')[1].command,'ANVN23NOVHANICN');
assert.equal(B.wireCode('anvn20novicnhan*anvn23novhanicn'),'ANVN20NOVICNHAN*23NOVHANICN');
assert.equal(B.wireCode('anvn20novicnhan*23novhanicn'),'ANVN20NOVICNHAN*23NOVHANICN');
for(const input of ['anvn00novicnhan','anvn31novicnhan','anvn20novicnhan;ER','ER','anvn20novicnhan*ER'])assert.throws(()=>B.codes(input));
const steps=B.plan(settings,selected,people);
assert.equal(steps[0].command,'SSVN415H20NOVICNHANPE2 *SSVN415D23NOVHANICNPE2');
assert.equal(steps[1].command,'NM1TRINH/SON MR(ADT)(INFTRINH/VU MSTR/15MAY25)');
assert.equal(steps[2].command,'NM1TRINH/LONG MSTR(CHD/15JUN20)');
assert.equal(steps.filter(step=>step.command.startsWith('NM1')).length,2);
assert.deepEqual(steps.slice(3).map(s=>s.command),[
 'APE-HANVIETAIR.SERVICE@GMAIL.COM','APE-HANVIETAIR247@gmail.com/p1',
 'APM-+82 1035463396','APM-+82 1035463396/p1','APM-+82 1021511790/p1',
 'APN-M+82 1035463396/KR/P1','TK OK','RF HVA','ER','IG'
]);
const female=people.map(p=>({...p,gender:'F'}));
assert.equal(B.plan(settings,selected,female)[1].command,'NM1TRINH/SON MRS(ADT)(INFTRINH/VU MISS/15MAY25)');
assert.equal(B.plan(settings,selected,female)[2].command,'NM1TRINH/LONG MISS(CHD/15JUN20)');
assert.equal(B.plan(settings,selected,[people[0]])[0].command,'SSVN415H20NOVICNHANPE1 *SSVN415D23NOVHANICNPE1');
assert.equal(B.plan(settings,selected,[people[0]])[1].command,'NM1TRINH/SON MR(ADT)');
assert.throws(()=>B.plan(settings,selected,[people[2]]));
assert.throws(()=>B.plan(settings,selected,[people[0],{...people[2],parentId:'missing'}]));
assert.throws(()=>B.plan(settings,selected,[...people,{...people[2],id:'inf2'}]));
assert.throws(()=>B.plan(settings,selected,[{...people[1],birthDate:''}]));
assert.throws(()=>B.plan(settings,selected,[{...people[1],birthDate:'2020-02-31'}]));
assert.throws(()=>B.plan(settings,selected,[{...people[0],givenName:'SON;ER'}]));
assert.throws(()=>B.plan(settings,[{...selected[0],class:'Y'}],people));
assert.throws(()=>B.plan(settings,[selected[0],{...selected[0],number:'3'}],people));
assert.equal(B.successful('INVALID FORMAT'),false);
assert.equal(B.successful('NEED RECEIVED FROM'),false);
assert.equal(B.successful(''),false);
assert.equal(B.successful('RP/SEL...\n1.TEST/NAME MR'),true);
assert.equal(B.successful('IGNORED'),true);
assert.equal(B.successful('SOMETHING','^OK$'),false);
assert.equal(B.locator('RP/SELVN28AA/SELVN28AA AA/SU 20NOV26/1000Z ABC123\n 1.TRINH/SON MR'),'ABC123');
assert.equal(B.locator('END OF TRANSACTION COMPLETE'),null);
console.log('PASS: supplied SS/NM1/contact sequence, PE seat count, gender titles, linked INF, DOB, validation, response checks and PNR locator');
