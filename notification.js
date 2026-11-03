(() => {
  'use strict';
  function payloads({pnr,type,name}){
    if(!/^[A-Z0-9]{6}$/.test(pnr||''))throw new Error('PNR không hợp lệ.');
    if(!['ADT','VFR','STU'].includes(type))throw new Error('Type không hợp lệ.');
    if(typeof name!=='string'||!name.trim()||name.length>150||/[\r\n]/.test(name))throw new Error('Tên khách không hợp lệ.');
    return [
      {path:'/add-reprice',body:{pnrs:pnr,type}},
      {path:'/send',body:{message:`Đã vào hàng chờ thành công PNR ${pnr}  ${name.trim()}`}}
    ];
  }
  async function notify(input,fetcher=fetch){
    const jobs=payloads(input),results=[];
    for(const job of jobs){
      const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
      try{
        const response=await fetcher('https://apilive.hanvietair.com'+job.path,{method:'POST',headers:{accept:job.path==='/add-reprice'?'application/json':'*/*','content-type':'application/json'},credentials:'omit',body:JSON.stringify(job.body),signal:controller.signal});
        if(!response.ok)throw new Error(`HTTP ${response.status}`);
        const text=await response.text();
        try{const data=JSON.parse(text);if(data?.success===false||data?.ok===false)throw new Error('API trả về kết quả thất bại.');}catch(error){if(error instanceof SyntaxError){}else throw error;}
        results.push({path:job.path,ok:true});
      }catch(error){results.push({path:job.path,ok:false,error:error.name==='AbortError'?'Hết thời gian chờ; không tự gửi lại.':error.message});}
      finally{clearTimeout(timer);}
    }
    return results;
  }
  const api={payloads,notify};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else globalThis.ToolHelperNotification=api;
})();
