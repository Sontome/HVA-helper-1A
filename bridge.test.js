const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const code=fs.readFileSync('bridge.js','utf8');
function setup(){
  const events=[],ticks=new Map();let handler,next=0,response='';
  const location={origin:'https://tc345.resdesktop.altea.amadeus.com',href:'https://tc345.resdesktop.altea.amadeus.com/',search:''};
  const context=id=>({jSessionId:id,contextId:'context-'+id,officeId:'office',userId:'user',organization:'VN-DC',gds:'AMADEUS'});
  const scripts=[];
  const document={querySelectorAll:()=>scripts,querySelector:()=>({click(){}})};
  const window={location,document,frames:[],open:()=>null,postMessage:m=>events.push(m),addEventListener:(type,fn)=>handler=fn,fetch:async()=>({ok:true,text:async()=>response,clone(){return this;}})};
  class XHR{open(){}send(){}addEventListener(){}}
  vm.runInNewContext(code,{window,document,location,URL,URLSearchParams,Request,Date,XMLHttpRequest:XHR,setInterval:fn=>{ticks.set(++next,fn);return next;},clearInterval:id=>ticks.delete(id),DOMParser:class{}});
  const emit=(type,extra={})=>handler({source:window,origin:location.origin,data:{channel:'altea-sidebar-v1',from:'sidebar',type,requestId:'request',...extra}});
  return{window,document,events,ticks,context,emit,message:handler,scripts,setResponse:text=>response=text};
}
(async()=>{
  const s=setup();
  s.window.aria={modules:{old:s.context('old')}};
  await s.emit('create');
  assert(!s.events.some(e=>e.type==='created'));
  s.window.aria.modules.new=s.context('new');
  for(const fn of s.ticks.values())fn();
  assert(s.events.some(e=>e.type==='created'&&e.payload==='new'));
  assert.equal(s.ticks.size,0);
  const r=setup();await r.emit('create');
  r.setResponse("aria.init({jSessionId:'literal',contextId:'ctx',officeId:'office',userId:'user',organization:'VN-DC',gds:'AMADEUS'});");
  await r.window.fetch('/cryptic/init');await new Promise(resolve=>setImmediate(resolve));
  assert(r.events.some(e=>e.type==='created'&&e.payload==='literal'));
  const f=setup();await f.emit('create');
  f.window.frames.push({location:f.window.location,document:{querySelectorAll:()=>[]},frames:[],crypticContext:f.context('frame')});
  for(const fn of f.ticks.values())fn();
  assert(f.events.some(e=>e.type==='created'&&e.payload==='frame'));
  const j=setup();await j.emit('create');
  j.scripts.push({textContent:JSON.stringify({nested:j.context('inline')})});
  for(const fn of j.ticks.values())fn();
  assert(j.events.some(e=>e.type==='created'&&e.payload==='inline'));
  await j.emit('sync');assert(j.events.some(e=>e.type==='sessions'&&e.requestId==='request'));
  const initial=setup();initial.window.crypticContext=initial.context('initial');await initial.emit('sync');
  assert.equal(initial.events.filter(e=>e.type==='sessions').at(-1).payload[0].id,'initial');
  assert(!initial.events.some(e=>e.type==='created'));
  const child={frames:[]};initial.window.frames.push(child);
  await initial.message({source:child,origin:initial.window.location.origin,data:{channel:'altea-sidebar-v1',from:'bridge',type:'frame-context',payload:{data:initial.context('iframe'),url:initial.window.location.origin+'/cryptic/apfplus/modules/cryptic/cryptic'}}});
  await initial.emit('sync');assert(initial.events.filter(e=>e.type==='sessions').at(-1).payload.some(s=>s.id==='iframe'));
  console.log('PASS: automatic new context from globals, non-JSON init response, frame, inline script; baseline excluded; request correlation');
})().catch(error=>{console.error(error);process.exitCode=1;});
