"""Part 17 sweep: six screen sizes x the main screens. Flags sideways scrolling, clipped or overflowing text,
elements past the screen edge, touch targets under 44 px (under 32 px counted separately as clearly too small),
overlapping buttons, text under 11 px, and a tab bar pushed off screen. Prints a summary per size and the worst
offenders. Run with the app on :8811:  python3 tests/responsive_part17.py [--strict]"""
import sys, os, json
sys.path.insert(0, os.path.dirname(__file__))
from harness import start
SIZES=[(320,568),(360,740),(412,915),(430,932),(768,1024),(1280,800)]
SCREENS=[("Home","()=>show('fire')"),("Home lower","()=>{show('fire');setTimeout(()=>document.querySelector('#view-fire').scrollTo(0,900),200)}"),
 ("Chats","()=>document.querySelector('.tabs button[data-view=chats]').click()"),("Embervale","()=>document.querySelector('.tabs button[data-view=vale]').click()"),
 ("Breathe","()=>document.querySelector('.tabs button[data-view=breathe]').click()"),("Meditate","()=>openMeditate()"),
 ("You","()=>document.querySelector('.tabs button[data-view=you]').click()"),("Task buddy","()=>{show('fire');setTimeout(()=>document.querySelector('#focusCard').click(),250)}"),
 ("Journal","()=>{show('fire');setTimeout(()=>document.querySelector('#journalCard').click(),250)}"),("Check-in","()=>{show('fire');setTimeout(()=>document.querySelector('#checkCard').click(),250)}"),
 ("Chat","()=>{show('chats');setTimeout(()=>document.querySelector('.ck-mate').click(),250)}"),("Companion","()=>{show('fire');setTimeout(()=>EKPAINT.open('soma'),250)}")]
JS=r"""()=>{const W=innerWidth,H=innerHeight,out={hscroll:document.documentElement.scrollWidth>W+1,edge:[],clip:[],small:[],tiny:[],overlap:[],font:[],tabs:null};
 const vis=e=>{const r=e.getBoundingClientRect();if(r.width<1||r.height<1||r.bottom<0||r.top>H)return null;const cs=getComputedStyle(e);if(cs.visibility==='hidden'||+cs.opacity<.05)return null;return r};
 const name=e=>(e.id?'#'+e.id:'')+(typeof e.className==='string'&&e.className?'.'+e.className.trim().split(/\s+/).slice(0,2).join('.'):'')||e.tagName.toLowerCase();
 const scrollerX=e=>{for(let p=e.parentElement;p;p=p.parentElement){const o=getComputedStyle(p).overflowX;if(o==='auto'||o==='scroll'||o==='hidden'||o==='clip')return true;}return false};
 for(const e of document.querySelectorAll('body *')){if(/^(SCRIPT|STYLE|svg|path|g|circle|rect|ellipse|line|polyline|polygon|defs|stop|linearGradient|radialGradient|use|text|tspan|mask|clipPath|filter|feGaussianBlur|BR)$/i.test(e.tagName))continue;
  const r=vis(e);if(!r)continue;const cs=getComputedStyle(e);
  if((r.right>W+1||r.left<-1)&&!scrollerX(e)&&cs.position!=='fixed')out.edge.push(name(e));
  const hasText=[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim().length>1);
  if(hasText){const fs=parseFloat(cs.fontSize);if(fs<11&&fs>0)out.font.push(name(e)+' '+fs+'px');/* 0 px is a label hidden on purpose (the compact help dot) */
    const clipX=e.scrollWidth>e.clientWidth+2&&/(hidden|clip)/.test(cs.overflowX)&&cs.textOverflow!=='ellipsis';
    const clipY=e.scrollHeight>e.clientHeight+2&&/(hidden|clip)/.test(cs.overflowY)&&(cs.webkitLineClamp==='none'||!cs.webkitLineClamp);
    if(clipX||clipY)out.clip.push(name(e)+': '+e.textContent.trim().slice(0,30));}
  if(e.matches('button,a[href],[role=button],input:not([type=hidden]),select,textarea,summary,label.yset')&&!e.closest('[aria-hidden=true]')){
    if(e.matches('a')&&e.closest('p,li')&&getComputedStyle(e).display==='inline')continue;/* links inside a sentence follow the text */
    let w=r.width,h=r.height;const af=getComputedStyle(e,'::after');if(af.content!=='none'&&af.position==='absolute'){const px=v=>-Math.min(0,parseFloat(v)||0);w+=px(af.left)+px(af.right);h+=px(af.top)+px(af.bottom);}/* invisible touch area */
    if(e.classList.contains('gl'))continue;/* a glossary word inside a sentence follows the text */
    const m=Math.min(w,h);if(m<32)out.tiny.push(name(e)+' '+Math.round(r.width)+'x'+Math.round(r.height));else if(m<44)out.small.push(name(e)+' '+Math.round(r.width)+'x'+Math.round(r.height));}}
 const clipR=e=>{let r=e.getBoundingClientRect(),L=r.left,T=r.top,Rr=r.right,B=r.bottom;for(let p=e.parentElement;p;p=p.parentElement){const cs=getComputedStyle(p);if(cs.overflowX!=='visible'||cs.overflowY!=='visible'){const q=p.getBoundingClientRect();L=Math.max(L,q.left);T=Math.max(T,q.top);Rr=Math.min(Rr,q.right);B=Math.min(B,q.bottom);}}return Rr-L<1||B-T<1?null:{left:L,top:T,right:Rr,bottom:B,width:Rr-L,height:B-T}};
 const hittable=(e,r)=>{const c=document.elementFromPoint((r.left+r.right)/2,(r.top+r.bottom)/2);return !!c&&(e===c||e.contains(c))};
 const FLOAT=new Set(['helpBtn','ekGear','ekLantern']);const STACKED=[['mate','ekcabin']];/* the cabin's spot sits on top of the back-row companions on narrow phones, on purpose *//* floating corner controls: content scrolls beneath them by design */
 const bs=[...document.querySelectorAll('button,a[href],[role=button]')].map(e=>[e,clipR(e)]).filter(x=>x[1]&&!x[0].closest('[aria-hidden=true]')&&hittable(x[0],x[1]));
 for(let i=0;i<bs.length;i++)for(let j=i+1;j<bs.length;j++){const [a,ra]=bs[i],[b,rb]=bs[j];if(a.contains(b)||b.contains(a))continue;const ix=Math.max(0,Math.min(ra.right,rb.right)-Math.max(ra.left,rb.left)),iy=Math.max(0,Math.min(ra.bottom,rb.bottom)-Math.max(ra.top,rb.top));
  if(FLOAT.has(a.id)||FLOAT.has(b.id))continue;if(STACKED.some(([x,y])=>(a.classList.contains(x)&&b.classList.contains(y))||(a.classList.contains(y)&&b.classList.contains(x))))continue;const inside=(x,y)=>x.left>=y.left-1&&x.top>=y.top-1&&x.right<=y.right+1&&x.bottom<=y.bottom+1;if(inside(ra,rb)||inside(rb,ra))continue;/* a corner action on a card is deliberate */
  const sm=Math.min(ra.width*ra.height,rb.width*rb.height);if(ix*iy>sm*.3){const c=document.elementFromPoint(Math.max(ra.left,rb.left)+ix/2,Math.max(ra.top,rb.top)+iy/2);if(c&&(a.contains(c)||b.contains(c)))out.overlap.push(name(a)+' x '+name(b));}}
 const ti=document.querySelector('.scenewrap .hero .title');if(ti&&ti.getClientRects().length){const rg=document.createRange();rg.selectNodeContents(ti);const g=rg.getBoundingClientRect();
   for(const s of ['#ekGear','#ekLantern','#helpBtn']){const e=document.querySelector(s);if(!e||!vis(e))continue;const r=e.getBoundingClientRect();if(!(r.right<=g.left||g.right<=r.left||r.bottom<=g.top||g.bottom<=r.top))out.overlap.push('TITLE x '+s);}}
 const t=document.querySelector('.tabs');if(t&&getComputedStyle(t).display!=='none'){const r=t.getBoundingClientRect();out.tabs=r.bottom<=H+1&&r.top<H;}
 for(const k of ['edge','clip','small','tiny','overlap','font'])out[k]=[...new Set(out[k])];return out}"""
if __name__=="__main__":
    total={};strict="--strict" in sys.argv;fails=0
    for (w,h) in SIZES:
        p,b,ctx,pg,errs=start(seed={"ek-agreed":"2026-11-01","ek-consent":"1"},w=w,h=h,wait=2300); summary={}
        for name,js in SCREENS:
            try: pg.evaluate(js); pg.wait_for_timeout(1100); pg.evaluate("()=>document.querySelectorAll('.evintro').forEach(e=>e.remove())")
            except Exception as e: summary[name]={"error":str(e)[:80]}; continue
            r=pg.evaluate(JS); summary[name]=r
            try: pg.evaluate("()=>{try{EKPAINT.close()}catch(e){};try{closeSheets()}catch(e){}}")
            except Exception: pass
        b.close(); p.stop(); total[f"{w}x{h}"]=summary
        agg={k:sum(len(v.get(k,[])) for v in summary.values() if isinstance(v.get(k,[]),list)) for k in ['edge','clip','tiny','small','overlap','font']}
        hs=[n for n,v in summary.items() if v.get("hscroll")]; tb=[n for n,v in summary.items() if v.get("tabs") is False]
        fails+=len(hs)+len(tb)+agg["edge"]+agg["clip"]+agg["tiny"]+agg["small"]+agg["overlap"]+agg["font"]
        print(f"{w}x{h}: hscroll {hs or 'none'} | tabs off-screen {tb or 'none'} | "+" ".join(f"{k}:{v}" for k,v in agg.items()))
    json.dump(total,open("/tmp/part17.json","w"),indent=1)
    print("\nproblems (every touch target must be 44 px or more):",fails); sys.exit(1 if strict and fails else 0)
