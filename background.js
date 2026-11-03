importScripts('notification.js');
const pending=new Map(),completed=new Map();
chrome.runtime.onMessage.addListener((message,sender,respond)=>{
  if(message?.type!=='booking-complete')return;
  if(sender.id!==chrome.runtime.id||!sender.tab||!sender.url?.startsWith('https://tc345.resdesktop.altea.amadeus.com/')){respond({error:'Nguồn gửi không hợp lệ.'});return;}
  let key;
  try{ToolHelperNotification.payloads(message.payload);key=message.payload.pnr;}catch(error){respond({error:error.message});return;}
  if(completed.has(key)){respond({results:completed.get(key)});return;}
  if(!pending.has(key))pending.set(key,ToolHelperNotification.notify(message.payload).then(results=>{completed.set(key,results);return results;}).finally(()=>pending.delete(key)));
  pending.get(key).then(results=>respond({results})).catch(error=>respond({error:error.message}));
  return true;
});
