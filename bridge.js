(() => {
  'use strict';
  const channel = 'altea-sidebar-v1';
  const sessions = new Map();
  let awaitingNew = null;
  let discoveryTimer=null;
  const popups=new Set();
  const endpoint=()=>{
    const q=new URLSearchParams(location.search);
    return location.origin+'/cryptic/apfplus/modules/cryptic/cryptic?'+new URLSearchParams({SITE:q.get('SITE')||'AVNPAIDL',LANGUAGE:q.get('LANGUAGE')||'GB',OCTX:q.get('MARKETS')||'ARDW_PROD_WBP'});
  };
  function register(data, url) {
    if (!data?.jSessionId || !data.contextId || !data.officeId || !data.userId) return;
    const fresh=!sessions.has(data.jSessionId);
    const safe={...sessions.get(data.jSessionId)?.data};
    for(const key of ['jSessionId','contextId','officeId','userId','organization','gds'])if(typeof data[key]==='string')safe[key]=data[key];
    sessions.set(data.jSessionId, {data:safe,url});
    if(fresh&&window.top&&window.top!==window)window.top.postMessage({channel,from:'bridge',type:'frame-context',payload:{data:safe,url}},location.origin);
    if(fresh)send('sessions', [...sessions.values()].map(({data}) => ({id:data.jSessionId,office:data.officeId,user:data.userId})));
    if (awaitingNew && !awaitingNew.has(data.jSessionId)) { awaitingNew=null;clearInterval(discoveryTimer);send('created',data.jSessionId); }
  }
  function visitData(root) {
    const seen=new WeakSet();let budget=12000;
    function visit(value,depth){
      if(!value||!['object','function'].includes(typeof value)||depth>10||budget--<=0||seen.has(value))return;
      seen.add(value);
      let props;try{props=Object.getOwnPropertyDescriptors(value);}catch{return;}
      const data={};
      for(const key of ['jSessionId','contextId','officeId','userId','organization','gds'])if(typeof props[key]?.value==='string')data[key]=props[key].value;
      if(data.jSessionId&&data.contextId&&data.officeId&&data.userId)register(data,endpoint());
      for(const descriptor of Object.values(props))if('value' in descriptor)visit(descriptor.value,depth+1);
    }
    visit(root,0);
  }
  function readObject(fragment){
    try{visitData(JSON.parse(fragment));return;}catch{}
    // APF also emits JavaScript literals (unquoted keys / single-quoted strings).
    // Extract only scalar context fields within one object; never evaluate page code.
    const data={};
    for(const key of ['jSessionId','contextId','officeId','userId','organization','gds']){
      const match=fragment.match(new RegExp('(?:^|[,{]\\s*)["\\\']?'+key+'["\\\']?\\s*:\\s*("(?:\\\\.|[^"\\\\])*"|\\\'(?:\\\\.|[^\\\'\\\\])*\\\')'));
      if(!match)continue;
      try{data[key]=match[1][0]==='"'?JSON.parse(match[1]):match[1].slice(1,-1).replace(/\\'/g,"'").replace(/\\\\/g,'\\');}catch{}
    }
    if(data.jSessionId&&data.contextId&&data.officeId&&data.userId)register(data,endpoint());
  }
  function inspect(url, text) {
    if(url!=='inline'){try{if(new URL(url,location.href).origin!==location.origin)return;}catch{return;}}
    if (typeof text !== 'string'||!text.includes('contextId')||!text.includes('jSessionId')) return;
    const visit=(v,depth=0)=>{
      if(!v || typeof v!=='object' || depth>15)return;
      if(v.jSessionId && v.contextId && v.userId && v.officeId) {
        const q=new URLSearchParams(location.search);
        const endpoint=new URL('/cryptic/apfplus/modules/cryptic/cryptic',location.origin);
        endpoint.search=new URLSearchParams({SITE:q.get('SITE')||'AVNPAIDL',LANGUAGE:q.get('LANGUAGE')||'GB',OCTX:q.get('MARKETS')||'ARDW_PROD_WBP'}).toString();
        register(v,endpoint.href);
      }
      for(const child of Object.values(v))visit(child,depth+1);
    };
    const stack=[];let quoted=null,escaped=false;
    for(let i=0;i<text.length;i++) {
      const c=text[i];
      if(quoted){if(escaped)escaped=false;else if(c==='\\')escaped=true;else if(c===quoted)quoted=null;continue;}
      if((c==='"'||c==="'") && stack.length)quoted=c;
      else if(c==='{')stack.push(i);
      else if(c==='}' && stack.length){const start=stack.pop();const fragment=text.slice(start,i+1);if(fragment.includes('jSessionId')&&fragment.includes('contextId')){try{visit(JSON.parse(fragment));}catch{if(!fragment.slice(1,-1).includes('{'))readObject(fragment);}}}
    }
  }
  function discover(){
    const visited=new Set();
    function scan(w,depth=0){
      if(depth>4||visited.has(w))return;visited.add(w);
      try{
        if(w.location.origin!==location.origin)return;
        for(const script of w.document.querySelectorAll('script'))inspect('inline',script.textContent);
        for(const name of Object.getOwnPropertyNames(w).filter(name=>/aria|cryptic|context|session|model|appdata|bootstrap/i.test(name))){
          const descriptor=Object.getOwnPropertyDescriptor(w,name);if(descriptor&&'value'in descriptor)visitData(descriptor.value);
        }
        for(let i=0;i<w.frames.length;i++)scan(w.frames[i],depth+1);
      }catch{}
    }
    scan(window);
    for(const popup of popups){try{if(popup.closed)popups.delete(popup);else scan(popup);}catch{}}
  }
  const originalOpen=window.open;
  window.open=function(){const popup=originalOpen.apply(this,arguments);if(popup)popups.add(popup);return popup;};
  const originalFetch = window.fetch;
  const send = (type, payload) => window.postMessage({ channel, from: 'bridge', type, payload }, location.origin);
  const isCryptic = url => { try { const u = new URL(url, location.href); return u.origin === location.origin && u.pathname === '/cryptic/apfplus/modules/cryptic/cryptic'; } catch { return false; } };
  function observe(url, body) {
    if (!isCryptic(url) || typeof body !== 'string') return;
    try {
      const data = JSON.parse(new URLSearchParams(body).get('data'));
      if (!data?.jSessionId || !data.contextId || !data.officeId || !data.userId) return;
      const endpoint = new URL(url, location.href);
      register(data, endpoint.href);
    } catch { /* Other application payloads are ignored. */ }
  }
  window.fetch = function(input, init) {
    const url = input instanceof Request ? input.url : String(input);
    if (isCryptic(url)) {
      if (init?.body != null) observe(url, String(init.body));
      else if (input instanceof Request) input.clone().text().then(body => observe(url, body)).catch(() => {});
    }
    const result=originalFetch.apply(this, arguments);
    try{if(new URL(url,location.href).origin===location.origin)result.then(r=>r.clone().text()).then(text=>inspect(url,text)).catch(()=>{});}catch{}
    return result;
  };
  const open = XMLHttpRequest.prototype.open;
  const xhrSend = XMLHttpRequest.prototype.send;
  const urls = new WeakMap();
  XMLHttpRequest.prototype.open = function(method, url) { urls.set(this, String(url)); return open.apply(this, arguments); };
  XMLHttpRequest.prototype.send = function(body) {
    observe(urls.get(this),body);
    this.addEventListener('load',()=>{try{if(!this.responseType||this.responseType==='text')inspect(urls.get(this),this.responseText);else if(this.responseType==='json')inspect(urls.get(this),JSON.stringify(this.response));}catch{}},{once:true});
    return xhrSend.apply(this,arguments);
  };

  async function request(url, options) {
    const response = await originalFetch.call(window, url, {...options, credentials:'include', mode:'same-origin'});
    const text = await response.text();
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${text.slice(0, 500)}`);
    if (response.redirected && /login/i.test(response.url)) throw new Error('Phiên đã chuyển về trang đăng nhập. Hãy đăng nhập lại.');
    return text;
  }
  window.addEventListener('message', async event => {
    const m = event.data;
    if(event.origin===location.origin&&m?.channel===channel&&m.from==='bridge'&&m.type==='frame-context'&&event.source!==window){
      const belongs=(w,depth=0)=>{if(depth>5)return false;try{for(let i=0;i<w.frames.length;i++)if(w.frames[i]===event.source||belongs(w.frames[i],depth+1))return true;}catch{}return false;};
      if(belongs(window)&&isCryptic(m.payload?.url))register(m.payload.data,m.payload.url);
      return;
    }
    if (event.source !== window || event.origin !== location.origin || m?.channel !== channel || m.from !== 'sidebar') return;
    const send=(type,payload)=>window.postMessage({channel,from:'bridge',type,payload,requestId:m.requestId},location.origin);
    try {
      if (m.type === 'sync') {
        discover();
        send('sessions', [...sessions.values()].map(({data}) => ({id:data.jSessionId, office:data.officeId, user:data.userId})));
        return;
      }
      if (m.type === 'create') {
        const button = document.querySelector('#e0newCrypticSessionLink');
        if (!button || typeof button.click !== 'function') throw new Error('Không tìm thấy nút Session của Altea (#e0newCrypticSessionLink).');
        discover();
        awaitingNew = new Set(sessions.keys());
        clearInterval(discoveryTimer);
        const deadline=Date.now()+55000;
        discoveryTimer=setInterval(()=>{if(!awaitingNew||Date.now()>deadline){clearInterval(discoveryTimer);awaitingNew=null;return;}discover();},700);
        button.click();
        send('creating', 'Đang chờ nhận diện session mới…');
        return;
      }
      const session = sessions.get(m.id);
      if (!session) throw new Error('Chưa nhận diện session. Hãy gửi một lệnh trong giao diện Altea trước.');
      if (m.type === 'command') {
        const command = String(m.command || '').trim();
        if (!command || command.length > 10000) throw new Error('Lệnh phải có từ 1 đến 10000 ký tự.');
        const data = {...session.data, tasks:[{type:'CRY',command:{command,prohibitedList:'SITE_JCPCRYPTIC_PROHIBITED_COMMANDS_LIST_1'}}]};
        const body = new URLSearchParams({data:JSON.stringify(data)});
        send('result', await request(session.url, {method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8','Accept':'*/*'}, body:body.toString()}));
      } else if (m.type === 'close') {
        const url = `/app_ard/apf/do/loginNewSession.taskmgr/UMCloseSessionKey;jsessionid=${encodeURIComponent(m.id)}?dispatch=close&flowId=apftaskmgr`;
        const result = await request(url, {method:'GET',headers:{'X-Requested-With':'XMLHttpRequest','Accept':'*/*'}});
        const xml=new DOMParser().parseFromString(result,'application/xml');
        if(xml.querySelector('send-event[event="HTTPSessionDestroyed"]')) {
          sessions.delete(m.id);
          send('sessions',[...sessions.values()].map(({data})=>({id:data.jSessionId,office:data.officeId,user:data.userId})));
          send('result','Đã đóng session thành công.');
          return;
        }
        send('result', `Phản hồi đóng session (kiểm tra nội dung bên dưới):\n${result}`);
      }
    } catch (error) { send('error', error.message); }
  });
})();
