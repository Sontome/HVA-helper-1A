(() => {
  'use strict';
  function responseText(payload) {
    try {
      const value=typeof payload==='string'?JSON.parse(payload):payload;
      return value?.model?.output?.crypticResponse?.response ?? null;
    } catch { return null; }
  }
  function parse(text,queries=[]) {
    const itineraries=[];
    let itinerary=null,segment=null,searchCommand=null;
    const addClasses=line=>{
      if(!segment)return;
      for(const match of line.matchAll(/\b([A-Z])(L|C|\d)\b/g)){
        const [,code,value]=match;
        const status=value==='L'?'waitlist':value==='C'||value==='0'?'closed':'available';
        if(!segment.classes.some(item=>item.code===code))segment.classes.push({code,status,seats:/\d/.test(value)?Number(value):null});
        if(status==='waitlist'&&!segment.waitlist.includes(code))segment.waitlist.push(code);
      }
    };
    for(const line of text.split(/\r?\n/)) {
      if(/^ANVN\d{2}[A-Z]{9}\s*$/i.test(line.trim()))searchCommand=line.trim().toUpperCase();
      // A compound AN response has one header per display, without repeating ANVN.
      const header=line.match(/\*\*\s+[A-Z]{3}\s+(.+?)\s+\d{1,2}\s+[A-Z]{2}\s+(\d{2}[A-Z]{3})\s+\d{4}\s*$/);
      if(header){
        const destination=line.match(/-\s*AN\s*\*\*\s+([A-Z]{3})\b/)?.[1];
        const matches=queries.filter(q=>q.date===header[2]&&q.destination===destination);
        if(matches.length===1)searchCommand=matches[0].command;
        else if(queries.length>1)searchCommand=null;
        itinerary=null;segment=null;
      }
      const flight=line.match(/^\s*(?:(\d+)\s*)?([A-Z]{2})(?::([A-Z]{2}))?\s*(\d{1,4})\s+(.+?)\s*\/([A-Z]{3})(?:\s+[A-Z0-9])?\s+([A-Z]{3})(?:\s+[A-Z0-9])?\s+(\d{4})([+-]\d+)?\s+(\d{4})([+-]\d+)?(?=\s|E\d\/|$)/);
      if(flight) {
        const [,number,carrier,marketing,flightNumber,classes,origin,destination,departure,departureOffset,arrival,arrivalOffset]=flight;
        if(number){
          const fallback=queries.length===2?queries[Number(number)>=11?1:0]:queries.length===1?queries[0]:null;
          itinerary={number,searchCommand:queries.length===2&&Number(number)>=11?queries[1].command:searchCommand||fallback?.command,excluded:false,segments:[]};itineraries.push(itinerary);
        }
        if(!itinerary){segment=null;continue;}
        if(carrier==='KE'||marketing==='KE')itinerary.excluded=true;
        const time=(value,offset)=>`${value.slice(0,2)}:${value.slice(2)}${offset?` (${offset} ngày)`:''}`;
        segment={flight:`${marketing||carrier}${flightNumber}`,displayFlight:`${carrier}${marketing?':'+marketing:''}${flightNumber}`,origin,destination,departure:time(departure,departureOffset),arrival:time(arrival,arrivalOffset),waitlist:[],classes:[]};
        itinerary.segments.push(segment);addClasses(classes);
      }else if(/^\s*OPERATED BY KOREAN AIR\s*$/.test(line)) {
        if(itinerary)itinerary.excluded=true;
        if(segment)segment.operatedBy='KOREAN AIR';
      }else if(/^\s*(?:[A-Z](?:\d|L|C)\s*)+\s*$/.test(line))addClasses(line);
      else segment=null;
    }
    return itineraries.filter(item=>!item.excluded).flatMap(item=>{
      const shared=item.segments.length>1?item.segments[0].classes.filter(c=>c.status!=='closed'&&item.segments.every(segment=>segment.classes.some(other=>other.code===c.code&&other.status!=='closed'))):null;
      const sharedWaitlist=shared?.filter(c=>item.segments.some(segment=>segment.classes.some(other=>other.code===c.code&&other.status==='waitlist'))).map(c=>c.code);
      const sharedAvailable=shared?.filter(c=>item.segments.every(segment=>segment.classes.some(other=>other.code===c.code&&other.status==='available'))).map(c=>c.code);
      return item.segments.map((segment,index)=>({number:item.number,segmentIndex:index,segmentCount:item.segments.length,searchCommand:item.searchCommand,...segment,...(shared?{sharedWaitlist,sharedAvailable}:{})}));
    });
  }
  function visibleClasses(row,order=''){
    const connected=Array.isArray(row.sharedAvailable);
    const available=connected?row.sharedAvailable.map(code=>row.classes.find(c=>c.code===code)):row.classes.filter(c=>c.status==='available');
    const ranks=order.toUpperCase().replace(/[^A-Z]/g,'');
    const lowest=ranks?available.reduce((best,item)=>!best||ranks.indexOf(item.code)>ranks.indexOf(best.code)?item:best,null):available.at(-1);
    return row.classes.filter(c=>(connected?row.sharedWaitlist.includes(c.code):c.status==='waitlist')||c===lowest);
  }
  function selectClass(rows,selected,row,code,order=''){
    const group=rows.filter(item=>item.searchCommand===row.searchCommand&&item.number===row.number);
    if(!group.length||group.some(item=>!item.date||!visibleClasses(item,order).some(c=>c.code===code)))throw new Error('Hạng này không khả dụng cho toàn bộ các chặng con.');
    const next=new Map(selected);
    if(group.every(item=>next.get(item.key)?.class===code)){
      for(const item of group)next.delete(item.key);
    }else{
      for(const [key,item]of next)if(item.searchCommand===row.searchCommand)next.delete(key);
      for(const item of group)next.set(item.key,{...item,class:code});
    }
    return next;
  }
  function selectionCheck(rows,selected,queries){
    if(!queries.length)return {ok:false,message:'Chưa có kết quả tìm chuyến.'};
    const choices=Array.from(selected);
    for(const [index,query]of queries.entries()){
      const matches=choices.filter(row=>row.searchCommand===query.command);
      const label=queries.length===2?(index===0?'chiều đi':'chiều về'):`lượt ${index+1}`;
      if(!matches.length)return {ok:false,message:`Chọn đủ ${label}.`};
      if(new Set(matches.map(row=>row.number)).size!==1)return {ok:false,message:`Chỉ chọn một phương án cho ${label}.`};
      const expected=rows.filter(row=>row.searchCommand===query.command&&row.number===matches[0].number);
      if(!expected.length||expected.some(row=>!matches.some(chosen=>chosen.segmentIndex===row.segmentIndex)))return {ok:false,message:`Chọn đủ ${expected.length} chặng con của ${label}.`};
      const sorted=[...expected].sort((a,b)=>a.segmentIndex-b.segmentIndex);
      if(sorted[0].origin!==query.origin||sorted.at(-1).destination!==query.destination||sorted.some((row,i)=>i&&sorted[i-1].destination!==row.origin))return {ok:false,message:`Dữ liệu ${label} thiếu hoặc không nối đủ chặng.`};
    }
    if(choices.some(row=>!queries.some(query=>query.command===row.searchCommand)))return {ok:false,message:'Có chặng không thuộc code hiện tại.'};
    return {ok:true,message:'Đã chọn đủ các lượt bay và chặng con.'};
  }
  const api={responseText,parse,visibleClasses,selectClass,selectionCheck};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else globalThis.ToolHelperAvailability=api;
})();
