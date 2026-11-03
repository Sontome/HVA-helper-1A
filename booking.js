(() => {
  'use strict';
  function codes(input) {
    const value=input.trim().toUpperCase();
    if(!/^ANVN\d{2}(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[A-Z]{6}(\*(?:ANVN)?\d{2}(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[A-Z]{6})*$/.test(value))throw new Error('Code phải có dạng anvn20novicnhan*23novhanicn.');
    return value.split('*').map(part=>{
      const command=part.startsWith('ANVN')?part:'ANVN'+part;
      const day=Number(command.slice(4,6)),month=command.slice(6,9);
      const max={JAN:31,FEB:29,MAR:31,APR:30,MAY:31,JUN:30,JUL:31,AUG:31,SEP:30,OCT:31,NOV:30,DEC:31};
      if(day<1||day>max[month])throw new Error('Ngày trong code không hợp lệ.');
      return {command,date:command.slice(4,9),origin:command.slice(9,12),destination:command.slice(12,15)};
    });
  }
  function wireCode(input){return codes(input).map((item,index)=>index?item.command.slice(4):item.command).join('*');}
  function routeCode({origin='',destination='',departure='',returnDate=''}){
    const months=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
    const dateCode=value=>{
      if(!value)return '[ngày đi]';
      const parsed=new Date(value+'T00:00:00Z');
      if(!/^\d{4}-\d{2}-\d{2}$/.test(value)||!Number.isFinite(parsed.getTime())||parsed.toISOString().slice(0,10)!==value)throw new Error('Ngày bay không hợp lệ.');
      return value.slice(8,10)+months[parsed.getUTCMonth()];
    };
    for(const value of [origin,destination])if(value&&!/^[A-Z]{3}$/i.test(value))throw new Error('Mã sân bay phải có 3 chữ cái.');
    const from=origin.toLowerCase()||'[nơi đi]',to=destination.toLowerCase()||'[nơi đến]';
    const code=`anvn${dateCode(departure)}${from}${to}${returnDate?'*'+dateCode(returnDate)+to+from:''}`;
    let error='';
    if(!origin||!destination||!departure)error='Chọn đủ nơi đi, nơi đến và ngày đi để chạy code.';
    else if(origin.toUpperCase()===destination.toUpperCase())error='Nơi đi và nơi đến phải khác nhau.';
    else if(returnDate&&returnDate<departure)error='Ngày về không được trước ngày đi.';
    return {code,complete:!error,error};
  }
  async function prepareSearch(send,input){
    const code=wireCode(input);
    const ignored=await send('IG');
    if(!successful(ignored.text))throw new Error('Lệnh IG chưa thành công. Đã dừng trước khi gửi code tìm chuyến.');
    return send(code);
  }
  function expand(template,values) {
    if(!template?.trim())throw new Error('Thiếu mẫu lệnh. Mở cài đặt để cấu hình.');
    const result=template.replace(/\{(\w+)\}/g,(_,key)=>{
      if(values[key]===undefined||values[key]==='')throw new Error(`Thiếu giá trị {${key}}.`);
      return String(values[key]);
    }).trim();
    if(/[\r\n*]/.test(result))throw new Error('Mỗi bước chỉ được có một lệnh; không dùng xuống dòng hoặc dấu *.');
    return result;
  }
  const defaults={
    sell:'SS{flight}{class}{date}{origin}{destination}PE{count}',
    nameADT:'NM1{surname}/{givenName} {title}(ADT){infantSuffix}',
    nameCHD:'NM1{surname}/{givenName} {title}(CHD/{dob})',
    nameINF:'(INF{surname}/{givenName} {title}/{dob})',
    contacts:'APE-HANVIETAIR.SERVICE@GMAIL.COM\nAPE-HANVIETAIR247@gmail.com/p1\nAPM-+82 1035463396\nAPM-+82 1035463396/p1\nAPM-+82 1021511790/p1\nAPN-M+82 1035463396/KR/P1',
    extra:'TK OK\nRF HVA',commit:'ER',afterCommit:'IG',successPattern:'',classOrder:''
  };
  function normalizePassenger(passenger) {
    const normalize=value=>String(value||'').trim().toUpperCase();
    const p={...passenger,surname:normalize(passenger.surname),givenName:normalize(passenger.givenName)};
    for(const key of ['surname','givenName'])if(!/^[A-Z]+(?: [A-Z]+)*$/.test(p[key]))throw new Error('Họ tên phải là chữ Latin không dấu.');
    if(!['ADT','CHD','INF'].includes(p.type)||!['M','F'].includes(p.gender))throw new Error('Loại khách / giới tính không hợp lệ.');
    p.title=p.type==='ADT'?(p.gender==='M'?'MR':'MRS'):(p.gender==='M'?'MSTR':'MISS');
    if(p.type!=='ADT') {
      if(!/^\d{4}-\d{2}-\d{2}$/.test(p.birthDate||''))throw new Error('CHD/INF bắt buộc có ngày tháng năm sinh.');
      const d=new Date(p.birthDate+'T00:00:00Z');
      if(!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==p.birthDate||d>new Date())throw new Error('Ngày sinh không hợp lệ.');
      p.dob=p.birthDate.slice(8,10)+['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][d.getUTCMonth()]+p.birthDate.slice(2,4);
    }
    return p;
  }
  function plan(settings,selected,passengers) {
    if(!selected.length)throw new Error('Chọn ít nhất một hạng waitlist.');
    const options=new Map();
    for(const row of selected){
      if(!row.date)throw new Error('Chưa xác định được ngày bay cho chặng đã chọn.');
      if(!/^[A-Z]$/.test(row.class)||!(row.classes?row.classes.some(item=>item.code===row.class&&['available','waitlist'].includes(item.status)):row.waitlist.includes(row.class)))throw new Error('Hạng đã chọn không nằm trong danh sách hạng khả dụng.');
      const key=row.searchCommand||`${row.date}:${row.origin}:${row.destination}`;
      if(options.has(key)&&options.get(key)!==row.number)throw new Error('Mỗi lượt tra chỉ chọn một phương án chuyến bay; có thể chọn các chặng nối trong cùng phương án.');
      options.set(key,row.number);
    }
    if(options.size>1&&!['{flight}','{date}','{origin}','{destination}'].every(token=>settings.sell?.includes(token)))throw new Error('Nhiều lượt bay cần mẫu chọn chuyến theo số hiệu, ngày và chặng; không dùng số dòng availability từ màn hình cũ.');
    if(!Array.isArray(passengers)||!passengers.length)throw new Error('Thêm ít nhất một hành khách.');
    const people=passengers.map(normalizePassenger),ids=new Set(people.map(p=>p.id));
    if(ids.size!==people.length||people.some(p=>!p.id))throw new Error('Mã hành khách bị trùng hoặc thiếu.');
    const seated=people.filter(p=>p.type!=='INF'),infants=people.filter(p=>p.type==='INF');
    if(!seated.length)throw new Error('INF phải đi cùng người lớn ADT.');
    const attached=new Map();
    for(const infant of infants){const adult=people.find(p=>p.id===infant.parentId&&p.type==='ADT');if(!adult)throw new Error('Mỗi INF phải chọn một người lớn ADT đi kèm.');if(attached.has(adult.id))throw new Error('Mỗi người lớn chỉ kèm một INF.');attached.set(adult.id,infant);}
    const values={count:seated.length};
    if(settings.successPattern?.trim())new RegExp(settings.successPattern,'i');
    const sellCommands=selected.map(row=>expand(settings.sell,{...values,...row}));
    const steps=[{label:`Giữ ${selected.length} chặng cho ${seated.length} khách có ghế`,command:sellCommands.join(' *')}];
    for(const p of seated){const infant=attached.get(p.id);const infantSuffix=infant?expand(settings.nameINF,infant):'';const template=settings['name'+p.type];if(infant&&!template.includes('{infantSuffix}'))throw new Error('Mẫu tên ADT phải có {infantSuffix} để gắn INF.');steps.push({label:`Thêm tên ${p.surname}/${p.givenName}`,command:expand(template,{...values,...p,infantSuffix:infantSuffix||' '})});}
    const contacts=(settings.contacts||'').split(/\r?\n/).filter(line=>line.trim());
    if(!contacts.length)throw new Error('Chưa cấu hình các lệnh email / SĐT.');
    for(const line of contacts)steps.push({label:'Thêm liên hệ',command:expand(line,values)});
    for(const line of (settings.extra||'').split(/\r?\n/).filter(line=>line.trim()))steps.push({label:'Lệnh bổ sung',command:expand(line,values)});
    steps.push({label:'Lưu PNR',kind:'commit',command:expand(settings.commit,values)});
    for(const line of (settings.afterCommit||'').split(/\r?\n/).filter(line=>line.trim()))steps.push({label:'Sau khi lưu PNR',kind:'afterCommit',command:expand(line,values)});
    return steps;
  }
  function locator(text){return text?.match(/^RP\/[^\r\n]*\s([A-Z0-9]{6})\s*$/m)?.[1]||null;}
  function ignoredLocator(text){return text?.match(/(?:^|\n)\s*IGNORED\s*-\s*([A-Z0-9]{6})\s*(?:\n|$)/i)?.[1].toUpperCase()||null;}
  async function runBooking(send,steps,pattern='',onStep=()=>{}){
    let committed=false,committedPnr=null,ignoredPnr=null;
    for(const step of steps){
      if(step.kind==='afterCommit'&&!committed)throw new Error('Chưa lưu PNR nên không chạy lệnh sau lưu.');
      onStep(step);
      const {text}=await send(step.command);
      const isIgnore=step.kind==='afterCommit'&&step.command.trim().toUpperCase()==='IG';
      if(!successful(text,isIgnore?'':pattern))throw new Error(`Dừng tại ${step.label}: phản hồi có lỗi hoặc chưa khớp điều kiện thành công. Kiểm tra PNR trên Altea trước khi thao tác lại.`);
      if(step.kind==='commit'){committed=true;committedPnr=locator(text);}
      if(isIgnore){ignoredPnr=ignoredLocator(text);if(!ignoredPnr)throw new Error('Chưa nhận được IG dạng IGNORED - PNR. Không gọi API thông báo.');if(committedPnr&&committedPnr!==ignoredPnr)throw new Error('PNR trong ER và IG không khớp. Không gọi API thông báo.');}
    }
    if(!committed||!ignoredPnr)throw new Error('Chưa xác nhận được PNR từ IG sau lưu. Kiểm tra lệnh sau lưu trong cài đặt.');
    return ignoredPnr;
  }
  function successful(text,pattern=''){
    if(typeof text!=='string'||!text.trim()||/\b(INVALID|ERROR|NOT AUTHORI[ZS]ED|UNABLE|REJECTED|CHECK FORMAT|CHECK NAME|NEED NAME|NEED RECEIVED|NEED TICKETING|SIMULTANEOUS CHANGES)\b/i.test(text))return false;
    return !pattern.trim()||new RegExp(pattern,'i').test(text);
  }
  const api={codes,wireCode,routeCode,prepareSearch,expand,plan,defaults,normalizePassenger,locator,ignoredLocator,runBooking,successful};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else globalThis.ToolHelperBooking=api;
})();
