"""Finds blue or purple interface surfaces (backgrounds of panels, cards, buttons, pages) on each main screen.
Illustrated scenes are skipped: canvases, images, SVG art, and the scene containers listed in SCENES.
Run with the app on :8811:  python3 tests/colour_scan.py [--strict]  (strict exits 1 if any are found)"""
import sys, os, json
sys.path.insert(0, os.path.dirname(__file__))
from harness import start
# Illustrations keep their own colours (Owner Decision 7): the check-in sky card and the You page's Check-in (day sky)
# and Journal (ruled paper) tiles. #view-meditate is Meditate's night-sky scene (kept, Leigh 7 Nov). #forYou takes
# the colours of the practice it suggests (fire, river, sky, earth, space), like Breathe's scene tiles: flagged to Leigh.
SCENES=[".ekskycard","#youCheck","#youJournal","#view-meditate","#forYou","#scenewrap",".skyx",".bscene","#view-breathe .bsky","#valeWrap",".ekroom2",".fhero",".axbg",".croom",".chero",".ekoart",".jsky",".mstage","#mStage",".stars",".hxa",".tsky",".ekpaintcv"]
JS="""(scenes)=>{const out=[];const skip=e=>scenes.some(s=>{try{return e.closest(s)}catch(x){return false}});
 const hsl=(r,g,b)=>{r/=255;g/=255;b/=255;const M=Math.max(r,g,b),m=Math.min(r,g,b),l=(M+m)/2;let h=0,s=0;if(M!==m){const d=M-m;s=l>.5?d/(2-M-m):d/(M+m);h=M===r?(g-b)/d+(g<b?6:0):M===g?(b-r)/d+2:(r-g)/d+4;h*=60;}return [h,s,l]};
 const cols=t=>[...t.matchAll(/rgba?\\(([^)]+)\\)/g)].map(m=>m[1].split(',').map(Number));
 const bad=c=>{const [r,g,b,a=1]=c;if(a<.12)return false;const [h,s,l]=hsl(r,g,b);return h>=200&&h<=320&&s>.22&&l>.06&&l<.92};
 for(const e of document.querySelectorAll('body *')){if(/^(CANVAS|IMG|svg|path|circle|g|rect|VIDEO|SOURCE|SCRIPT|STYLE|I)$/.test(e.tagName))continue;
  const r=e.getBoundingClientRect();if(r.width*r.height<1800||r.bottom<0||r.top>innerHeight||r.right<0||r.left>innerWidth)continue;const cs=getComputedStyle(e);if(cs.visibility==='hidden'||+cs.opacity<.05)continue;
  if(skip(e))continue;const t=(cs.backgroundImage||'')+' '+cs.backgroundColor;const cc=cols(t).filter(bad);if(!cc.length)continue;
  const sel=e.tagName.toLowerCase()+(e.id?'#'+e.id:'')+(typeof e.className==='string'&&e.className?'.'+e.className.trim().split(/\\s+/).slice(0,3).join('.'):'');
  const par=e.parentElement?(e.parentElement.id?'#'+e.parentElement.id:(e.parentElement.className&&typeof e.parentElement.className==='string'?'.'+e.parentElement.className.trim().split(/\\s+/)[0]:'')):'';
  out.push({sel,par,area:Math.round(r.width*r.height),c:cc.slice(0,2).map(x=>x.join(','))});}
 return out}"""
def go(pg,js): pg.evaluate(js); pg.wait_for_timeout(900); pg.evaluate("()=>document.querySelectorAll('.evintro').forEach(e=>e.remove())")
SCREENS=[("Home top","()=>document.querySelector('.tabs button[data-view=fire]').click()"),
 ("Home lower","()=>document.querySelector('#view-fire').scrollTo(0,900)"),("Home bottom","()=>document.querySelector('#view-fire').scrollTo(0,99999)"),
 ("Chats","()=>document.querySelector('.tabs button[data-view=chats]').click()"),("Embervale","()=>document.querySelector('.tabs button[data-view=vale]').click()"),
 ("Breathe","()=>document.querySelector('.tabs button[data-view=breathe]').click()"),("Breathe lower","()=>{const s=document.querySelector('#view-breathe .bscene')||document.querySelector('#view-breathe');s.scrollTo(0,99999)}"),
 ("Meditate","()=>openMeditate()"),("You","()=>document.querySelector('.tabs button[data-view=you]').click()"),("You lower","()=>document.querySelector('#view-you').scrollTo(0,1200)"),
 ("You bottom","()=>document.querySelector('#view-you').scrollTo(0,99999)"),
 ("Task buddy","()=>{document.querySelector('.tabs button[data-view=fire]').click();setTimeout(()=>document.querySelector('#focusCard').click(),300)}"),
 ("Task buddy lower","()=>document.querySelector('#view-focus').scrollTo(0,99999)"),
 ("Journal","()=>{show('fire');setTimeout(()=>document.querySelector('#journalCard').click(),300)}"),("Journal lower","()=>document.querySelector('#view-track').scrollTo(0,99999)"),
 ("Check-in","()=>{show('fire');setTimeout(()=>document.querySelector('#checkCard').click(),300)}"),
 ("Chat","()=>{show('chats');setTimeout(()=>document.querySelector('.ck-mate').click(),300)}"),
 ("Feel sheet","()=>{show('fire');setTimeout(()=>document.querySelector('#feelBtn').click(),300)}")]
if __name__=="__main__":
    p,b,ctx,pg,errs=start(seed={"ek-agreed":"2026-11-01","ek-consent":"1"},wait=2500)
    total={}
    for name,js in SCREENS:
        try: go(pg,js); pg.wait_for_timeout(500)
        except Exception as e: print("skip",name,e); continue
        found=pg.evaluate(JS,SCENES)
        if "--shots" in sys.argv: pg.screenshot(path=f"/home/claude/qa/cs_{name.replace(' ','_')}.png")
        for f in found: total.setdefault(f["sel"],{"screens":set(),"area":0,"par":f["par"],"c":f["c"]}); total[f["sel"]]["screens"].add(name); total[f["sel"]]["area"]=max(total[f["sel"]]["area"],f["area"])
        pg.evaluate("()=>{try{closeSheets()}catch(e){}}")
    for k,v in sorted(total.items(),key=lambda x:-x[1]["area"]): print(f'{v["area"]:>7} {k[:70]:<70} in {v["par"][:22]:<22} {sorted(v["screens"])} {v["c"]}')
    print("\n%d blue/purple surfaces"%len(total)); b.close(); p.stop()
    sys.exit(1 if total and "--strict" in sys.argv else 0)
