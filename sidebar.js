(() => {
'use strict';
if(window!==window.top)return;
const host=document.createElement('div');host.style.cssText='all:initial;position:fixed;inset:0;margin:0;padding:0;border:0;z-index:2147483647;pointer-events:none;';
const root=host.attachShadow({mode:'closed'});
root.innerHTML=`<style>
*{box-sizing:border-box}[hidden]{display:none!important}section{width:370px;max-height:calc(100vh - 75px);overflow:auto;padding:15px;background:#fff;color:#24364b;border:1px solid #9eb3c8;border-radius:0 12px 12px 0;box-shadow:0 4px 16px #18355326;font:13px/1.5 system-ui}header{display:flex;gap:8px;align-items:center}h3{margin:0;flex:1;font-size:16px}button,input,select,textarea{font:inherit;border-radius:6px;border:1px solid #58708b;padding:8px;width:100%;margin-top:8px}button{background:#2368ac;color:white;cursor:pointer}button:disabled{opacity:.5;cursor:default}header button{width:auto;margin:0}input,select,textarea{background:#f8fafc;color:#142338}label{display:block;margin-top:8px}small{display:block;color:#566b80;margin-top:8px}pre{white-space:pre-wrap;overflow-wrap:anywhere;max-height:220px;overflow:auto;background:#f3f6fa;border:1px solid #c9d5e2;padding:8px}fieldset{border:0;padding:0;margin:0}.row{display:flex;gap:8px}.row>*{flex:1;min-width:0}.danger{background:#8c3341}#expand{margin:0;width:28px;height:52px;border-radius:0 9px 9px 0;background:#fff;color:#1765a9;border:1px solid #9eb3c8}table{width:100%;border-collapse:collapse;margin-top:10px;font-size:12px}th,td{text-align:left;vertical-align:top;padding:6px 4px;border-bottom:1px solid #d4dfeb}.class{display:inline-block;width:auto;margin:3px;padding:5px 8px;background:#f0f6fc;color:#14598f;border-color:#adc5dc}.class[aria-pressed=true]{background:#e0f2e7;color:#115b32;border-color:#268352}.box{border-top:1px solid #c9d5e2;margin-top:12px;padding-top:10px}summary{cursor:pointer}
section{width:min(370px,calc(100vw - 12px));max-width:calc(100vw - 12px)}section.wide{width:calc(100vw - 12px)}header{flex-wrap:wrap}fieldset{min-width:0}input,select,textarea{max-width:100%;min-width:0}.row{flex-wrap:wrap}.row>*{flex:1 1 120px;min-width:0}#settings{max-width:760px}#hold{display:flex;flex-wrap:wrap;gap:12px;min-width:0}#hold>b,#step{flex:1 0 100%}#route{flex:1 1 260px;min-width:0}#availability{flex:3 1 680px;min-width:0}#passenger{flex:1 1 100%;min-width:0}#passenger-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:14px}table{table-layout:fixed}th,td{overflow-wrap:anywhere}th:first-child{width:26%}th:nth-child(2){width:22%}.class-list{display:flex;flex-wrap:wrap;gap:5px}.class{margin:0;white-space:nowrap;line-height:1.4;border:1px solid #b9c0c8;border-radius:6px;font:inherit;padding:6px 9px}.class.waitlist{background:#e5e7eb;color:#4b5563}.class.available{background:#e3f5e9;color:#166534;border-color:#83c99b;display:inline-flex;align-items:center;gap:5px}.class.closed{background:#fafafa;color:#8c939c;border-style:dashed}.class.waitlist[aria-pressed=true]{background:#d0d5dc;color:#202b39;outline:2px solid #1765a9;outline-offset:1px}.class:disabled{opacity:.7}.wide #controls{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;align-items:end}.wide #hold{grid-column:1/-1}.wide #close{grid-column:1/-1;max-width:360px}#controls>label{min-width:0}.legend{display:flex;flex-wrap:wrap;gap:10px;margin:8px 0}.legend span{padding:3px 7px;border-radius:4px}.legend .gray{background:#e5e7eb;color:#4b5563}.legend .green{background:#e3f5e9;color:#166534}@media(max-width:760px){.wide #controls{display:block}#hold{gap:8px}#route,#availability{flex:1 1 100%}th:first-child{width:27%}th:nth-child(2){width:25%}section{padding:10px}.class{padding:5px 6px}}button:focus-visible{outline:2px solid #1765a9;outline-offset:2px}
section,section.wide{width:100%;max-width:none;height:100%;max-height:none;border-radius:0;pointer-events:auto;overscroll-behavior:contain;overflow:auto}#expand{pointer-events:auto;position:absolute;left:0;top:60px}section.wide #controls{grid-template-columns:repeat(3,minmax(0,1fr))}tr.option-start td{border-top:2px solid #aabdd0}tr.connection td{border-top:1px dashed #e0e7ee}tr[data-connected=true] td{border-bottom:0;background:#f8fafc}tr.connection td:first-child{padding-left:18px}.class.available[aria-pressed=true]{background:#b9e7ca;outline:2px solid #1765a9;outline-offset:1px}dialog#passenger{border:1px solid #9eb3c8;border-radius:12px;width:min(900px,calc(100vw - 24px));max-width:calc(100vw - 24px);max-height:calc(100dvh - 32px);margin:auto;padding:20px;overflow:auto;background:#fff;color:#24364b;box-shadow:0 16px 60px #10213855;pointer-events:auto;font:13px/1.5 system-ui}dialog::backdrop{background:#10213866}#passenger-list{grid-template-columns:repeat(auto-fit,minmax(min(100%,330px),1fr))}.passenger-card{border:1px solid #cad7e4;border-radius:8px;padding:12px;margin-top:12px}.infant-card{border-left:3px solid #89b8e2;background:#f3f8fc;padding:10px;margin-top:12px}.icon-button{width:auto;min-width:36px;padding:6px 10px;font-size:18px}.card-header{display:flex;align-items:center;gap:8px}.card-header b{flex:1}.card-header button{margin:0}.direction-start td{border-top:4px solid #326a9e!important}#passenger-error{color:#a52735}#toast{pointer-events:auto;position:fixed;right:16px;bottom:16px;max-width:min(520px,calc(100vw - 32px));padding:16px;background:#e4f5eb;color:#14532d;border:1px solid #69ae81;border-radius:10px;box-shadow:0 4px 24px #10213833;font:14px/1.6 system-ui;display:flex;align-items:start;gap:12px}#toast.warning{background:#fff4dc;color:#76530b;border-color:#d4b36b}#toast button{width:auto;margin:0;padding:2px 7px}#passenger form{margin:0}</style><button id="expand" aria-label="Mở Tool Helper 1A">❯</button><section id="panel" hidden><header><h3>Tool Helper 1A</h3><button id="gear" title="Cài đặt" aria-label="Cài đặt">⚙</button><button id="minimize" aria-label="Ẩn thanh công cụ">❮</button></header>
<div id="panel-content"><div id="settings" class="box" hidden><b>Cài đặt giữ vé</b><small>Lưu trong Chrome của bạn. Mẫu lệnh cần đúng cấu hình Altea đang dùng.</small><div id="setting-fields"></div><button id="save">Lưu cài đặt</button><small id="saved"></small></div>
<fieldset id="controls"><label id="module-label">Module<select id="modules"><option value="">Chọn module</option><option value="hold" selected>Giữ vé chờ</option></select></label>
<div id="hold" class="box"><b>Giữ vé chờ</b><small id="step"></small><fieldset id="route" disabled><div class="row"><label>Nơi đi<select id="origin"><option value="">Chọn nơi đi</option></select></label><label>Nơi đến<select id="destination"><option value="">Chọn nơi đến</option></select></label></div><div class="row"><label>Ngày đi<input id="departure" type="date"></label><label>Ngày về (tùy chọn)<input id="return-date" type="date"></label></div><small id="route-note">Chọn chặng/ngày để tạo code, hoặc nhập code trực tiếp bên dưới. Bỏ trống ngày về để tìm một chiều.</small><label>Code giữ vé<textarea id="code" rows="3" placeholder="anvn20novicnhan hoặc anvn20novicnhan*23novhanicn"></textarea></label><button id="search">Chạy code</button></fieldset>
<div id="availability" hidden><small id="caption"></small><div class="legend"><span class="gray">Waitlist · bấm chọn</span><span class="green">Hạng thấp nhất còn chỗ · bấm chọn</span></div><table><thead><tr><th>Chuyến / chặng</th><th>Giờ đi → đến</th><th>Hạng / số ghế</th></tr></thead><tbody id="flights"></tbody></table><small id="empty" hidden>Không có chuyến bay trong phản hồi.</small><small id="selection-status"></small><button id="hold-button" disabled>Giữ</button></div>
</div></fieldset>
</div><footer id="panel-footer"><small id="status">Sẵn sàng.</small><fieldset id="session-controls"><label>Session đang dùng<select id="sessions"><option value="">Chưa có session</option></select></label><button id="refresh">↻ Nhận diện lại session hiện tại</button></fieldset><details><summary>Phản hồi máy chủ / nhật ký lệnh</summary><pre id="result"></pre></details></footer></section>
<dialog id="passenger" aria-labelledby="passenger-title"><form id="passenger-form"><header><h3 id="passenger-title">Thông tin hành khách</h3><button id="close-passenger" type="button" aria-label="Đóng form">✕</button></header><fieldset id="passenger-fields"><label>Type<select id="booking-type"><option>ADT</option><option selected>VFR</option><option>STU</option></select></label><div id="passenger-list"></div><button id="add-passenger" type="button" class="icon-button" title="Thêm hành khách" aria-label="Thêm hành khách">＋</button><small id="passenger-count"></small><small id="passenger-error" role="alert"></small><small id="passenger-progress" role="status" aria-live="polite"></small><button id="confirm" type="submit">Giữ vé</button></fieldset></form></dialog>
<div id="toast" hidden role="status" aria-live="polite"><span id="toast-text"></span><button id="close-toast" type="button" aria-label="Đóng thông báo">✕</button></div>`;
const motionStyle=document.createElement('style');
motionStyle.textContent=`
  #panel{display:flex;flex-direction:column;gap:12px;overflow:hidden}
  #panel>header{flex:0 0 auto}
  #panel-content{flex:1 1 auto;min-height:0;overflow:auto;overscroll-behavior:contain;scroll-behavior:smooth;padding-right:3px}
  #panel #controls{display:block}
  #module-label{max-width:360px;margin-top:0}
  #panel-footer{flex:0 0 auto;max-height:38%;overflow:auto;border-top:1px solid #c9d5e2;padding-top:10px;background:#fff}
  #panel-footer #status{margin-top:0}
  #session-controls{display:flex;flex-wrap:wrap;align-items:end;gap:10px;width:min(100%,680px)}
  #session-controls>label{flex:1 1 260px;min-width:0}
  #session-controls>button{flex:0 1 auto;width:auto;max-width:100%}
  #panel{transform-origin:0 86px;position:relative;z-index:1;backface-visibility:hidden}
  #expand{z-index:2}
  dialog#passenger[open]{animation:helper-form-in 200ms cubic-bezier(.16,1,.3,1)}
  dialog[open]::backdrop{animation:helper-fade-in 180ms ease-out}
  dialog.is-closing::backdrop{animation:helper-fade-out 160ms ease-in forwards}
  #toast:not([hidden]){animation:helper-toast-in 240ms cubic-bezier(.16,1,.3,1)}
  #settings:not([hidden]),#hold:not([hidden]),#availability:not([hidden]),.passenger-card,.infant-card,details[open] #result{animation:helper-content-in 180ms ease-out}
  button{transition:background-color 140ms ease,border-color 140ms ease,color 140ms ease,box-shadow 140ms ease,opacity 140ms ease,transform 120ms ease}
  button:not(:disabled):hover{filter:brightness(1.04);box-shadow:0 2px 7px #18355320}
  button:not(:disabled):active{transform:translateY(1px)}
  input,select,textarea{transition:border-color 140ms ease,box-shadow 140ms ease}
  input:focus,select:focus,textarea:focus{border-color:#397db7;box-shadow:0 0 0 3px #397db71a;outline:none}
  #toast,.class{transition:background-color 160ms ease,border-color 160ms ease,color 160ms ease}
  .is-closing{pointer-events:none!important}
  @keyframes helper-form-in{from{opacity:0;transform:translateY(12px) scale(.985)}to{opacity:1;transform:translateY(0) scale(1)}}
  @keyframes helper-toast-in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes helper-content-in{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
  @keyframes helper-fade-in{from{opacity:0}to{opacity:1}}
  @keyframes helper-fade-out{from{opacity:1}to{opacity:0}}
  @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
  @media(max-width:600px){#panel-footer{max-height:44%}#session-controls{gap:4px}#session-controls>button{width:100%}}
`;
root.appendChild(motionStyle);
document.documentElement.appendChild(host);
const scrollStyles=[document.documentElement,document.body].filter(Boolean).map(element=>({element,value:element.style.getPropertyValue('overflow'),priority:element.style.getPropertyPriority('overflow')}));
function lockPageScroll(locked){for(const {element,value,priority}of scrollStyles){if(locked)element.style.setProperty('overflow','hidden','important');else if(value)element.style.setProperty('overflow',value,priority);else element.style.removeProperty('overflow');}}
lockPageScroll(false);
const $=id=>root.getElementById(id),B=ToolHelperBooking,A=ToolHelperAvailability;
const leaving=new WeakMap();
const reducedMotion=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let panelAnimation=null,panelTargetOpen=false;
function setPanelOpen(open){
  const panel=$('panel');
  if(panelAnimation&&panelTargetOpen===open)return;
  if(!panelAnimation&&panel.hidden===!open)return;
  panelTargetOpen=open;
  const closedTransform='translate3d(0,0,0) scale(.018,.065)';
  if(panel.hidden&&open){panel.style.transform=closedTransform;panel.style.opacity='0';panel.hidden=false;}
  // Read the current visual frame before cancelling, so reversing never jumps.
  const current=window.getComputedStyle(panel);
  const from={transform:current.transform,opacity:current.opacity};
  panel.style.transform=from.transform;panel.style.opacity=from.opacity;
  if(panelAnimation){panelAnimation.cancel();panelAnimation=null;}
  panel.inert=!open;
  $('expand').hidden=open;
  if(open)lockPageScroll(true);
  const target={transform:open?'none':closedTransform,opacity:open?'1':'0'};
  const finish=()=>{
    panel.style.transform=target.transform;panel.style.opacity=target.opacity;
    panel.style.willChange='auto';panel.hidden=!open;
    panel.inert=!open;
    if(!open)lockPageScroll(false);
  };
  if(reducedMotion()||!panel.animate){finish();return;}
  panel.style.willChange='transform, opacity';
  const animation=panel.animate([from,target],{duration:open?340:280,easing:open?'cubic-bezier(.22,1,.36,1)':'cubic-bezier(.4,0,.2,1)',fill:'both'});
  panelAnimation=animation;
  animation.finished.then(()=>{
    if(panelAnimation!==animation)return;
    finish();panelAnimation=null;animation.cancel();
  }).catch(()=>{});
}
function reveal(element){const animation=leaving.get(element);if(animation){leaving.delete(element);animation.cancel();}element.classList.remove('is-closing');element.inert=false;element.hidden=false;}
function dismiss(element,done=()=>{element.hidden=true;}){
  if(element.hidden||leaving.has(element))return;
  if(reducedMotion()||!element.animate){done();return;}
  element.inert=true;element.classList.add('is-closing');
  const animation=element.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:element.id==='panel'?'translateX(-18px)':'translateY(8px)'}],{duration:160,easing:'cubic-bezier(.4,0,1,1)'});
  leaving.set(element,animation);
  animation.finished.then(()=>{if(leaving.get(element)!==animation)return;leaving.delete(element);done();element.classList.remove('is-closing');element.inert=false;}).catch(()=>{});
}
function closePassenger(){if($('passenger').open)dismiss($('passenger'),()=>{$('passenger').close();});}
const fields=[['sell','Mẫu lệnh chọn chuyến / waitlist'],['nameADT','Mẫu tên ADT'],['nameCHD','Mẫu tên CHD'],['nameINF','Phần INF gắn vào tên ADT'],['contacts','Lệnh email / SĐT (mỗi dòng một lệnh)'],['extra','Lệnh bổ sung trước lưu'],['commit','Lệnh lưu PNR'],['afterCommit','Lệnh sau khi lưu PNR thành công'],['classOrder','Thứ tự hạng từ cao đến thấp (trống: thứ tự Altea)'],['successPattern','Regex thành công bổ sung (có thể để trống)']];
let settings={},session=null,searches=[],rows=[],selected=new Map(),busy=false,bookingState='idle';
const requests=new Map();
for(const [key,label]of fields){const l=document.createElement('label');l.textContent=label;const input=document.createElement(['contacts','extra','afterCommit'].includes(key)?'textarea':'input');input.id='setting-'+key;if(input.tagName==='TEXTAREA')input.rows=5;l.appendChild(input);$('setting-fields').appendChild(l);}
const help=document.createElement('small');help.textContent='Biến: {flight}, {class}, {date}, {origin}, {destination}, {count}, {number}, {surname}, {givenName}, {title}, {dob}, {type}, {infantSuffix}. PE đếm ADT + CHD, không đếm INF. Mẫu INF là phần ngoặc gắn vào NM1 người lớn. Sau ER, IG phải trả IGNORED - PNR để xác nhận và gọi API.';$('setting-fields').appendChild(help);
const storageReady=chrome.storage.local.get('bookingSettings').then(value=>{const saved=value.bookingSettings||{};settings={...B.defaults};for(const [key]of fields)if(typeof saved[key]==='string'&&(saved.schemaVersion===2||saved[key].trim()))settings[key]=saved[key];if(!saved.contacts&&saved.email&&saved.phone)settings.contacts=`APE-${saved.email}\nAPM-${saved.phone}`;for(const [key]of fields)$('setting-'+key).value=settings[key]||'';}).catch(e=>{$('status').textContent='Không đọc được cài đặt: '+e.message;});
$('save').onclick=async()=>{try{const next={schemaVersion:2};for(const [key]of fields)next[key]=$('setting-'+key).value.trim();if(next.successPattern)new RegExp(next.successPattern,'i');await chrome.storage.local.set({bookingSettings:next});settings=next;$('saved').textContent='Đã lưu.';}catch(e){$('saved').textContent=e.message;}};
$('gear').onclick=()=>{if($('settings').hidden||leaving.has($('settings')))reveal($('settings'));else dismiss($('settings'));};
$('expand').onclick=()=>{setPanelOpen(true);};
function lock(value){busy=value;$('controls').disabled=value;$('session-controls').disabled=value;$('save').disabled=value;$('passenger-fields').disabled=value;$('close-passenger').disabled=value;}
function status(text){$('status').textContent=text;}
function log(text){$('result').textContent+=text+'\n';}
function rpc(type,extra={}){return new Promise((resolve,reject)=>{const requestId=crypto.randomUUID();const timer=setTimeout(()=>{requests.delete(requestId);reject(new Error('Quá 60 giây chưa có phản hồi. Không thử lại tự động; kiểm tra session trên Altea.'));},60000);requests.set(requestId,{resolve,reject,timer});window.postMessage({channel:'altea-sidebar-v1',from:'sidebar',type,requestId,...extra},location.origin);});}
function clear(){selected.clear();rows=[];$('panel').classList.remove('wide');$('availability').hidden=true;if($('passenger').open)$('passenger').close();$('hold-button').disabled=true;$('flights').replaceChildren();}
async function action(fn){if(busy)return;lock(true);try{await fn();}catch(e){status(e.message);log('DỪNG: '+e.message);if($('passenger').open){$('passenger-error').textContent=e.message;$('passenger-progress').textContent='';}}finally{lock(false);}}
function sync(){window.postMessage({channel:'altea-sidebar-v1',from:'sidebar',type:'sync'},location.origin);}
$('refresh').onclick=sync;
$('modules').onchange=()=>{$('hold').hidden=$('modules').value!=='hold';$('route').disabled=!session;if(!session)sync();};
$('sessions').onchange=()=>{clear();session=$('sessions').value||null;bookingState='idle';$('route').disabled=!session;};
const airports={
  'Hàn Quốc':[['ICN','Seoul Incheon'],['GMP','Seoul Gimpo'],['PUS','Busan'],['CJU','Jeju']],
  'Việt Nam':[['HAN','Hà Nội'],['SGN','TP. Hồ Chí Minh'],['DAD','Đà Nẵng'],['CXR','Cam Ranh'],['PQC','Phú Quốc'],['HPH','Hải Phòng'],['HUI','Huế'],['VII','Vinh'],['DLI','Đà Lạt'],['VCA','Cần Thơ']]
};
for(const id of ['origin','destination'])for(const [country,list]of Object.entries(airports)){
  const group=document.createElement('optgroup');group.label=country;
  for(const [code,name]of list){const option=document.createElement('option');option.value=code;option.textContent=`${code} — ${name}`;group.appendChild(option);}
  $(id).appendChild(group);
}
let routeSource='code',routeError='';
function updateRouteCode(){
  routeSource='form';clear();$('return-date').min=$('departure').value;
  try{
    const result=B.routeCode({origin:$('origin').value,destination:$('destination').value,departure:$('departure').value,returnDate:$('return-date').value});
    $('code').value=result.code;routeError=result.error;
    $('route-note').textContent=result.error||'Code đã cập nhật theo lựa chọn. Bạn vẫn có thể sửa code trực tiếp bên dưới.';
  }catch(error){routeError=error.message;$('route-note').textContent=error.message;}
}
for(const id of ['origin','destination','departure','return-date'])$(id).addEventListener('input',updateRouteCode);
$('code').oninput=()=>{routeSource='code';routeError='';clear();$('route-note').textContent='Đang dùng code nhập trực tiếp. Chạy code sẽ dùng nguyên nội dung bên dưới; thay đổi chặng/ngày sẽ tạo code mới.';};
async function command(value){const payload=await rpc('command',{id:session,command:value});const text=A.responseText(payload);log('> '+value+'\n'+(text||payload));return {payload,text};}
function updateSelection(){
  for(const button of $('flights').querySelectorAll('button[data-key]'))button.setAttribute('aria-pressed',String(selected.get(button.dataset.key)?.class===button.dataset.class));
  const check=A.selectionCheck(rows,selected.values(),searches);$('hold-button').disabled=!check.ok;$('selection-status').textContent=check.message;
}
function render(text){
const parsed=A.parse(text,searches);rows=parsed.map((r,index)=>{const query=searches.find(q=>q.command===r.searchCommand)||(searches.length===1?searches[0]:null);return {...r,key:String(index),searchCommand:query?.command,date:query?.date};});
$('panel').classList.add('wide');$('availability').hidden=false;$('caption').textContent=`${rows.length} chặng (đã bỏ KE). Chọn đủ các lượt bay; phương án nối chuyến phải chọn đủ chặng con.`;$('empty').hidden=rows.length>0;
for(const row of rows){const direction=searches.findIndex(q=>q.command===row.searchCommand);const label=searches.length===2?(direction===0?'Chiều đi':'Chiều về'):`Lượt ${direction+1}`;const tr=document.createElement('tr');for(const value of [`${label} · ${row.number} · ${row.segmentIndex+1}/${row.segmentCount}\n${row.displayFlight||row.flight}\n${row.origin} → ${row.destination}\n${row.date||'Chưa xác định ngày'}`,`${row.departure} → ${row.arrival}`]){const td=document.createElement('td');td.textContent=value;td.style.whiteSpace='pre-line';tr.appendChild(td);}const td=document.createElement('td'),list=document.createElement('div');list.className='class-list';td.appendChild(list);
for(const item of A.visibleClasses(row,settings.classOrder)){
  const cls=item.code,isWaitlist=item.status==='waitlist';
  const selectable=isWaitlist||item.status==='available';const badge=document.createElement(selectable?'button':'span');badge.className='class '+item.status;
  badge.textContent=isWaitlist?cls:item.status==='available'?`${cls} · ${item.seats}`:`${cls} · đóng`;
  badge.title=isWaitlist?'Waitlist hạng '+cls:item.status==='available'?`Hạng ${cls}: ${item.seats} ghế theo phản hồi`:`Hạng ${cls} không mở bán`;
  if(selectable){badge.type='button';badge.setAttribute('aria-pressed','false');badge.disabled=!row.date;if(!row.date)badge.title='Chưa xác định được ngày của chặng.';badge.dataset.key=row.key;badge.dataset.class=cls;badge.onclick=()=>{try{selected=A.selectClass(rows,selected,row,cls,settings.classOrder);updateSelection();if($('passenger').open)$('passenger').close();}catch(error){status(error.message);}};}
  list.appendChild(badge);
}if(!list.children.length){const empty=document.createElement('small');empty.textContent=row.segmentCount>1?'Không có hạng chung khả dụng cho các chặng con.':'Không có hạng khả dụng.';list.appendChild(empty);}tr.appendChild(td);tr.className=row.segmentIndex===0?'option-start':'connection';if(row.segmentIndex===0&&!rows.some(other=>other.searchCommand===row.searchCommand&&Number(other.number)<Number(row.number)))tr.classList.add('direction-start');tr.dataset.connected=String(row.segmentCount>1);$('flights').appendChild(tr);}updateSelection();}
$('search').onclick=()=>action(async()=>{if(!session||$('sessions').value!==session)throw new Error('Chưa nhận diện được session hiện tại.');if(routeSource==='form'&&routeError)throw new Error(routeError);const code=B.wireCode($('code').value);searches=B.codes(code);clear();$('result').textContent='';bookingState='resetting';status('Đang gửi IG rồi tra chuyến trên session hiện tại…');const {text}=await B.prepareSearch(command,code);if(!text)throw new Error('Phản hồi không có crypticResponse.response.');bookingState='idle';render(text);status('Đã nhận kết quả. Chọn đủ các chặng cần giữ.');});
function collapse(){closePassenger();setPanelOpen(false);}
function toast(message,warning=false){$('toast-text').textContent=message;$('toast').classList.toggle('warning',warning);reveal($('toast'));}
$('close-toast').onclick=()=>{dismiss($('toast'));};
$('minimize').onclick=collapse;
$('hold-button').onclick=()=>{
  const check=A.selectionCheck(rows,selected.values(),searches);if(!check.ok)return;
  $('passenger-error').textContent='';$('passenger-progress').textContent='';
  reveal($('passenger'));if(!$('passenger').open)$('passenger').showModal();$('passenger').querySelector('input')?.focus();
};
$('close-passenger').onclick=()=>{if(!busy)closePassenger();};
$('passenger').addEventListener('cancel',event=>{event.preventDefault();if(!busy)closePassenger();});
const readFields=element=>Object.fromEntries([...element.querySelectorAll('[data-field]')].map(input=>[input.dataset.field,input.value]));
function passenger(){
  const people=[];
  for(const card of $('passenger-list').children){
    const adult={id:card.dataset.id,...readFields(card.querySelector('[data-main]'))};people.push(adult);
    const infant=card.querySelector('[data-infant]');
    if(infant)people.push({id:infant.dataset.id,type:'INF',parentId:adult.id,...readFields(infant)});
  }
  return people;
}
function refreshPassengers(){
  for(const card of $('passenger-list').children){
    const type=card.querySelector('[data-field="type"]').value,isChild=type==='CHD';
    const dob=card.querySelector('[data-dob]');dob.hidden=!isChild;
    dob.querySelector('input').required=isChild;dob.querySelector('input').disabled=!isChild;
    if(isChild)card.querySelector('[data-infant]')?.remove();
    card.querySelector('[data-add-infant]').hidden=isChild;
    card.querySelector('[data-add-infant]').disabled=Boolean(card.querySelector('[data-infant]'));
  }
  const people=passenger();
  $('passenger-count').textContent=`${people.filter(p=>p.type==='ADT').length} ADT + ${people.filter(p=>p.type==='CHD').length} CHD + ${people.filter(p=>p.type==='INF').length} INF → PE${people.filter(p=>p.type!=='INF').length}`;
}
function addInfant(card){
  if(card.querySelector('[data-infant]')||card.querySelector('[data-field="type"]').value!=='ADT')return;
  const infant=document.createElement('div');infant.className='infant-card';infant.setAttribute('data-infant','');infant.dataset.id=crypto.randomUUID();
  infant.innerHTML=`<div class="card-header"><b>INF đi kèm người lớn phía trên</b><button type="button" class="icon-button" data-remove-infant title="Xóa INF" aria-label="Xóa INF">🗑</button></div><div class="row"><label>Họ INF<input data-field="surname" required autocomplete="off"></label><label>Tên INF<input data-field="givenName" required autocomplete="off"></label></div><div class="row"><label>Giới tính<select data-field="gender"><option value="M">Nam</option><option value="F">Nữ</option></select></label><label>Ngày sinh INF<input data-field="birthDate" type="date" required></label></div>`;
  infant.querySelector('[data-remove-infant]').onclick=()=>{infant.remove();refreshPassengers();};card.appendChild(infant);refreshPassengers();infant.querySelector('input').focus();
}
function addPassenger(){
  const card=document.createElement('div');card.className='passenger-card';card.dataset.id=crypto.randomUUID();
  card.innerHTML=`<div class="card-header"><b>Hành khách</b><button type="button" class="icon-button" data-remove title="Xóa hành khách" aria-label="Xóa hành khách">🗑</button></div><div data-main><div class="row"><label>Họ<input data-field="surname" required autocomplete="off"></label><label>Tên / tên đệm<input data-field="givenName" required autocomplete="off"></label></div><div class="row"><label>Giới tính<select data-field="gender"><option value="M">Nam</option><option value="F">Nữ</option></select></label><label>Loại khách<select data-field="type"><option>ADT</option><option>CHD</option></select></label></div><label data-dob hidden>Ngày sinh CHD<input data-field="birthDate" type="date"></label></div><button data-add-infant type="button">＋ INF đi kèm</button>`;
  card.querySelector('[data-remove]').onclick=()=>{card.remove();refreshPassengers();};
  card.querySelector('[data-add-infant]').onclick=()=>addInfant(card);
  card.addEventListener('input',refreshPassengers);card.addEventListener('change',refreshPassengers);
  $('passenger-list').appendChild(card);refreshPassengers();
}
$('add-passenger').onclick=addPassenger;addPassenger();
$('passenger-form').addEventListener('submit',event=>{
  event.preventDefault();
  action(async()=>{
    $('passenger-error').textContent='';await storageReady;
    if(bookingState!=='idle')throw new Error('Lượt giữ này đã chạy. Chạy code tìm chuyến mới trước khi giữ lượt khác.');
    if(!session||$('sessions').value!==session)throw new Error('Session đã thay đổi. Tìm chuyến lại trước khi giữ.');
    const check=A.selectionCheck(rows,selected.values(),searches);if(!check.ok)throw new Error(check.message);
    const people=passenger(),type=$('booking-type').value;
    if(!['ADT','VFR','STU'].includes(type))throw new Error('Type không hợp lệ.');
    const ordered=[...selected.values()].sort((a,b)=>searches.findIndex(q=>q.command===a.searchCommand)-searches.findIndex(q=>q.command===b.searchCommand)||a.segmentIndex-b.segmentIndex);
    const steps=B.plan(settings,ordered,people),first=B.normalizePassenger(people[0]);
    bookingState='running';
    let pnr;
    try{pnr=await B.runBooking(command,steps,settings.successPattern,step=>{status(step.label+'…');$('passenger-progress').textContent=step.label+'…';});}
    catch(error){bookingState='stopped';throw error;}
    bookingState='done';
    const success=`Vào hàng chờ thành công PNR ${pnr}`;
    status(success);$('passenger-progress').textContent=success+' · Đang gửi thông báo…';
    collapse();toast(success+' · Đang gửi thông báo…');
    let warning='';
    try{
      const result=await chrome.runtime.sendMessage({type:'booking-complete',payload:{pnr,type,name:`${first.surname}/${first.givenName} ${first.title}`}});
      if(result?.error)throw new Error(result.error);
      if(!Array.isArray(result?.results)||result.results.length!==2)throw new Error('Không nhận đủ phản hồi API.');
      for(const item of result.results){log(`API ${item.path}: ${item.ok?'OK':item.error}`);}
      const failures=result.results.filter(item=>!item.ok);if(failures.length)warning='Chưa gửi thành công API: '+failures.map(item=>item.path+' ('+item.error+')').join('; ');
    }catch(error){warning='PNR đã tạo; lỗi gửi API: '+error.message;log(warning);}
    collapse();toast(success+(warning?' · '+warning:''),Boolean(warning));
  });
});
collapse();
window.addEventListener('message',event=>{const m=event.data;if(event.source!==window||event.origin!==location.origin||m?.channel!=='altea-sidebar-v1'||m.from!=='bridge')return;
if(m.type==='sessions'){
  const previousSession=session;
  const chosen=session&&m.payload.some(item=>item.id===session)?session:m.payload[0]?.id||null;
  $('sessions').replaceChildren();
  for(const [i,item] of m.payload.entries()){
    const option=document.createElement('option');option.value=item.id;option.textContent=`${i+1}. ${item.office} · ${item.user} · ...${item.id.slice(-6)}`;$('sessions').appendChild(option);
  }
  session=chosen;
  if(session)$('sessions').value=session;
  $('route').disabled=!session;
  if(previousSession&&previousSession!==session){clear();bookingState='idle';}
}
const pending=requests.get(m.requestId);if(pending&&['result','error','creating'].includes(m.type)){clearTimeout(pending.timer);requests.delete(m.requestId);if(m.type==='error')pending.reject(new Error(m.payload));else pending.resolve(m.payload);}
});
sync();
const initialDeadline=Date.now()+60000;
const initialDiscovery=setInterval(()=>{if(session||Date.now()>initialDeadline){clearInterval(initialDiscovery);return;}sync();},1000);
})();
