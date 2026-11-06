"use strict";
/* ===== Photos and files in companion chats =====
   Share up to three photos or PDFs with a message. Photos are resized on the phone, and only a small preview is kept
   on this device with the chat. The files go with that one message, through Emberkind's server, to Claude (Anthropic)
   so your companion can see them, and are not stored on the server. */
(function(){
const form=document.getElementById("composer"),box=document.getElementById("box");if(!form||!box)return;
const MAX=3,PDF_MAX=4.5*1024*1024;let pend=[];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));const say=t=>{try{toast(t);}catch(e){}};
/* three ways in, like any good chat app: the camera, your photo gallery, or your files (Android shows the gallery
   only when a picker asks for images alone, so each has its own) */
const mk=(id,accept,multi,capture)=>{const i=document.createElement("input");i.type="file";i.id=id;i.accept=accept;i.multiple=!!multi;if(capture)i.setAttribute("capture",capture);i.hidden=true;i.setAttribute("aria-label",{attFiles:"Attach files",attPhotos:"Attach photos",attCam:"Take a photo"}[id]||"Attach");form.appendChild(i);return i;};
const fileIn=mk("attFiles","application/pdf,image/*",true),photoIn=mk("attPhotos","image/*",true),camIn=mk("attCam","image/*",false,"environment");
const btn=document.createElement("button");btn.type="button";btn.className="attbtn";btn.setAttribute("aria-label","Add a photo or file");
btn.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.5 12 20a5.3 5.3 0 0 1-7.5-7.5L13 4a3.6 3.6 0 0 1 5 5l-8.4 8.4a1.8 1.8 0 0 1-2.5-2.5L14.8 7.2"/></svg>';form.insertBefore(btn,box);
const tray=document.createElement("div");tray.className="atttray";tray.hidden=true;form.insertBefore(tray,form.firstChild);
function draw(){tray.hidden=!pend.length;tray.innerHTML=pend.map((a,i)=>`<span class="attchip">${a.kind==="pdf"?'<i class="attpdf">PDF</i>':`<img alt="" src="${a.thumb}">`}<em>${esc(a.name)}</em><button type="button" data-rm="${i}" aria-label="Remove ${esc(a.name)}">&times;</button></span>`).join("");}
tray.addEventListener("click",e=>{const b=e.target.closest("[data-rm]");if(b){pend.splice(+b.dataset.rm,1);draw();}});
const sh=document.createElement("div");sh.className="sheet attsheet";sh.id="attSheet";sh.setAttribute("role","dialog");sh.setAttribute("aria-modal","true");sh.setAttribute("aria-labelledby","attT");
sh.innerHTML='<div class="atthead"><button type="button" class="attx" data-close aria-label="Close">&times;</button><h3 id="attT">Add to chat</h3><span></span></div><div class="atttiles">'+
  '<button type="button" class="atttile" data-pick="cam"><i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg></i><span>Camera</span></button>'+
  '<button type="button" class="atttile" data-pick="photos"><i><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="15" cy="9" r="1.8"/><path d="M4 16l5-5 4 4 2-2 5 5"/></svg></i><span>Photos</span></button>'+
  '<button type="button" class="atttile" data-pick="files"><i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M13 17v-6M10 14l3-3 3 3"/></svg></i><span>Files</span></button></div>'+
  '<p class="attnote">Up to three photos or PDFs. Photos are made smaller on your phone, and only a small preview is kept here.</p>';
document.body.appendChild(sh);
const close=()=>{try{closeSheets();}catch(e){sh.classList.remove("on");}};
sh.addEventListener("click",e=>{if(e.target.closest("[data-close]"))return close();const t=e.target.closest("[data-pick]");if(!t)return;close();({cam:camIn,photos:photoIn,files:fileIn})[t.dataset.pick].click();});
btn.addEventListener("click",()=>{if(pend.length>=MAX)return say("You can share up to three at a time.");try{openSheet("#attSheet");}catch(e){sh.classList.add("on");}});
const readURL=f=>new Promise((ok,no)=>{const r=new FileReader();r.onload=()=>ok(r.result);r.onerror=()=>no(new Error("That file couldn't be read."));r.readAsDataURL(f);});
const loadImg=src=>new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=()=>no(new Error("That photo couldn't be opened."));i.src=src;});
function shrink(img,max,q){const s=Math.min(1,max/Math.max(img.naturalWidth,img.naturalHeight)),c=document.createElement("canvas");c.width=Math.max(1,Math.round(img.naturalWidth*s));c.height=Math.max(1,Math.round(img.naturalHeight*s));
  const x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,c.width,c.height);x.drawImage(img,0,0,c.width,c.height);return c.toDataURL("image/jpeg",q);}
async function prep(f){const name=String(f.name||"file").slice(0,60);
  if(f.type==="application/pdf"){if(f.size>PDF_MAX)throw new Error("That PDF is too large. Up to 4.5 MB works.");return {kind:"pdf",type:"application/pdf",name,data:(await readURL(f)).split(",")[1]};}
  if(!/^image\//.test(f.type))throw new Error("Photos and PDFs can be shared.");
  const img=await loadImg(await readURL(f));return {kind:"image",type:"image/jpeg",name,data:shrink(img,1568,.82).split(",")[1],thumb:shrink(img,360,.7)};}
const onPick=async inp=>{const files=[...inp.files];inp.value="";for(const f of files){if(pend.length>=MAX){say("You can share up to three at a time.");break;}
  try{pend.push(await prep(f));}catch(e){say(e.message||"That file couldn't be added.");}}draw();if(!matchMedia("(pointer:coarse)").matches)box.focus({preventScroll:true});};
[fileIn,photoIn,camIn].forEach(i=>i.addEventListener("change",()=>onPick(i)));
window.EK_hasAtt=()=>pend.length>0;
window.EK_takeAtt=()=>{if(!pend.length)return null;const a=pend;pend=[];draw();return a;};
window.EK_attHtml=att=>`<span class="attrow">${(att||[]).map(a=>a.kind==="pdf"?`<span class="attfile"><i class="attpdf">PDF</i>${esc(a.name||"File")}</span>`:(a.thumb?`<img class="attimg" alt="A photo you shared" src="${a.thumb}">`:"")).join("")}</span>`;
})();
