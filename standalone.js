/* Emberkind standalone runtime: replaces the Claude artifact runtime with local storage + the Claude API. */
(function(){
  "use strict";
  window.EK_STANDALONE = true;
  const C = window.EK_CONFIG || {liveAI:false};
  const ls = {
    get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } },
    set(k,v){ try{ localStorage.setItem(k,v); return true; }catch(e){ return false; } },
    del(k){ try{ localStorage.removeItem(k); }catch(e){} },
    keys(){ try{ return Object.keys(localStorage); }catch(e){ return []; } }
  };

  /* ---------- local database (this device only) ---------- */
  const listeners = {};
  function notify(col){ (listeners[col]||[]).forEach(fn=>{ try{ fn(); }catch(e){} }); }
  function snapDoc(col,id){ const raw=ls.get("ekdb:"+col+"/"+id); let d=null; try{ d=raw?JSON.parse(raw):null; }catch(e){}
    return { id, exists: !!d, data: () => d }; }
  function listDocs(col){ const pre="ekdb:"+col+"/"; return ls.keys().filter(k=>k.startsWith(pre)&&!k.slice(pre.length).includes("/")).map(k=>snapDoc(col,k.slice(pre.length))).filter(s=>s.exists); }
  function query(col,orderField,dir,lim){
    return {
      orderBy(f,d){ return query(col,f,d||"asc",lim); },
      limit(n){ return query(col,orderField,dir,n); },
      async get(){ return run(); },
      onSnapshot(next){ const fn=()=>next(run()); (listeners[col]=listeners[col]||[]).push(fn); setTimeout(fn,0); return ()=>{ listeners[col]=(listeners[col]||[]).filter(x=>x!==fn); }; }
    };
    function run(){ let docs=listDocs(col);
      if(orderField){ docs.sort((a,b)=>{ const x=a.data()[orderField],y=b.data()[orderField]; return (x>y?1:x<y?-1:0)*(dir==="desc"?-1:1); }); }
      if(lim) docs=docs.slice(0,lim);
      return { docs, size: docs.length, empty: !docs.length }; }
  }
  const db = {
    collection(col){
      const q = query(col,null,"asc",0);
      return Object.assign(q,{
        doc(id){ return {
          async get(){ return snapDoc(col,id); },
          async set(data){ if(!ls.set("ekdb:"+col+"/"+id, JSON.stringify(data))){ const e=new Error("Storage full"); e.code="quota_exceeded"; throw e; } notify(col); },
          async update(data){ const cur=snapDoc(col,id).data()||{}; await this.set(Object.assign(cur,data)); },
          async delete(){ ls.del("ekdb:"+col+"/"+id); notify(col); }
        }; },
        async add(data){ const id=Date.now().toString(36)+Math.random().toString(36).slice(2,8); await this.doc(id).set(data); return {id}; }
      });
    }
  };

  /* ---------- user (this device) ---------- */
  let uid = ls.get("ek-uid"); if(!uid){ uid="u"+Date.now().toString(36)+Math.random().toString(36).slice(2,10); ls.set("ek-uid",uid); }
  const user = { async id(){ return uid; }, async isOwner(){ return true; } };

  /* ---------- AI: Claude, only ever through Emberkind's own server (no keys in the browser) ---------- */
  function err(code,text){ const e=new Error(code); e.code=code; if(text)e.text=text; return e; }
  function cleanTurns(turns){ const out=[]; for(const t of turns){ const role=t.role==="assistant"?"assistant":"user"; const content=String(t.content||"");
      if(out.length&&out[out.length-1].role===role) out[out.length-1].content+="\n\n"+content; else out.push({role,content}); }
    if(out.length&&out[0].role!=="user") out.unshift({role:"user",content:"(conversation start)"});
    return out; }
  const base=()=>String(C.apiBase||"").replace(/\/$/,"");
  async function call(body,signal){
    let res; try{ res=await fetch(base()+"/v1/messages",{method:"POST",headers:{"content-type":"application/json","anthropic-version":"2023-06-01","x-ek-client":uid},body:JSON.stringify(body),signal}); }
    catch(e){ if(e&&e.name==="AbortError") throw err("cancelled"); throw err("network"); }
    if(!res.ok){ const s=res.status; throw err(s===429||s===529?"rate_limited":s===401||s===403||s===503?"unavailable":"network"); }
    return res;
  }
  async function sample(turns,opts){
    opts=opts||{}; let acc="";
    try{
      const res=await call(Object.assign({model:C.claudeModel,messages:cleanTurns(turns),stream:!!opts.onText,max_tokens:1600},opts.companion?{companion:opts.companion}:{},opts.attachments&&opts.attachments.length?{attachments:opts.attachments}:{}),opts.signal);
      if(!opts.onText){ const j=await res.json(); return {text:(j.content||[]).map(b=>b.text||"").join("")}; }
      const reader=res.body.getReader(),dec=new TextDecoder();let buf="";
      for(;;){ const {value,done}=await reader.read(); if(done)break; buf+=dec.decode(value,{stream:true});
        let i; while((i=buf.indexOf("\n"))>=0){ const line=buf.slice(0,i).trim(); buf=buf.slice(i+1);
          if(!line.startsWith("data:"))continue; let ev; try{ ev=JSON.parse(line.slice(5).trim()); }catch(e){ continue; }
          if(ev.type==="error") throw err("network",acc);
          const piece=ev.type==="content_block_delta"&&ev.delta&&ev.delta.text||"";
          if(piece){ acc+=piece; opts.onText({text:acc}); } } }
      return {text:acc};
    }catch(e){ if(e&&e.name==="AbortError") throw err("cancelled",acc); if(e&&e.code){ if(acc&&!e.text)e.text=acc; throw e; } throw err("network",acc); }
  }
  sample.json = async function(prompt,opts){
    opts=opts||{}; const model=C.claudeModel;/* one model for everything: Sonnet (see config.js) */
    const res=await call({model,messages:[{role:"user",content:prompt}],stream:false,max_tokens:600},opts.signal);
    const j=await res.json(); const t=(j.content||[]).map(b=>b.text||"").join("").replace(/```json|```/g,"").trim();
    const m=t.match(/\{[\s\S]*\}/); return JSON.parse(m?m[0]:t);
  };
  /* Companions are live whenever live AI is switched on in config.js. There's no start-up check to race
     against: if a message can't get through, that one message shows a clear "try again" note instead. */
  window.EK_SERVER_COMPANIONS=["soma","siro","orra","ava"];   /* the v2 server holds every companion's pack */
  function live(){ return Promise.resolve(!!(C.liveAI&&base())); }

  window.claude = { use: async (name) => name==="sample" ? ((await live())?sample:null) : name==="db" ? db : name==="user" ? user : null };
  window.EK_AI = { live };
})();
