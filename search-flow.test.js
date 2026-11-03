const assert=require('node:assert/strict'),B=require('./booking.js');
(async()=>{
  const sent=[];
  const result=await B.prepareSearch(async command=>{sent.push(command);return{text:command==='IG'?'IGNORED':'availability'};},'anvn20novicnhan*23novhanicn');
  assert.deepEqual(sent,['IG','ANVN20NOVICNHAN*23NOVHANICN']);
  assert.equal(result.text,'availability');
  const failed=[];
  await assert.rejects(()=>B.prepareSearch(async command=>{failed.push(command);return{text:'INVALID FORMAT'};},'anvn20novicnhan'));
  assert.deepEqual(failed,['IG']);
  const timeout=[];
  await assert.rejects(()=>B.prepareSearch(async command=>{timeout.push(command);throw new Error('timeout');},'anvn20novicnhan'));
  assert.deepEqual(timeout,['IG']);
  const invalid=[];
  await assert.rejects(()=>B.prepareSearch(async command=>{invalid.push(command);return{text:'IGNORED'};},'ER'));
  assert.equal(invalid.length,0);
  console.log('PASS: IG precedes search, shorthand normalization, IG failure/timeout stops search, invalid input sends nothing');
})().catch(error=>{console.error(error);process.exitCode=1;});
