"""Basic Display ("Minimise all visuals", .simple in code) and Low-stim mode ("Calmer visuals and softer sound", .calm). On every main screen:
Simple leaves no decorative loop running; Calm runs every loop at 45% speed (js/ek-motion.js). The breathing guide keeps its exact
timing in both. Switching a mode off restores full movement. Run with the app on :8811:  python3 tests/modes_census.py"""
import sys, os, json
sys.path.insert(0, os.path.dirname(__file__))
from harness import start
from colour_scan import SCREENS
res=[]
def ok(n,c,info=""): res.append(bool(c)); print(("PASS " if c else "FAIL ")+n+(("  ["+str(info)+"]") if info and not c else ""))
LOOPS="""()=>{const out=[];for(const a of document.getAnimations()){const t=a.effect&&a.effect.target;if(!t||!t.getClientRects().length)continue;let tm;try{tm=a.effect.getComputedTiming()}catch(e){continue}
  if(tm.iterations!==Infinity)continue;out.push({n:(a.animationName||'waapi')+' @ '+(t.id?'#'+t.id:(typeof t.className==='string'?'.'+t.className.trim().split(/\\s+/)[0]:t.tagName)),st:a.playState,r:a.playbackRate,keep:!!(t.closest&&t.closest('.dots,.thinking,[aria-busy="true"]'))});}return out}"""
def visit(mode):
    seed={"ek-agreed":"2026-11-01","ek-consent":"1"}
    if mode: seed["ek-"+mode]="on"
    p,b,ctx,pg,errs=start(seed=seed,wait=2600); per={}
    for name,js in SCREENS:
        try: pg.evaluate(js); pg.wait_for_timeout(1200); pg.evaluate("()=>document.querySelectorAll('.evintro').forEach(e=>e.remove())")
        except Exception: continue
        per[name]=pg.evaluate(LOOPS); pg.evaluate("()=>{try{closeSheets()}catch(e){}}")
    return p,b,pg,errs,per
p,b,pg,errs,per=visit("simple")
left={k:[x["n"] for x in v if x["st"]=="running" and not x["keep"]] for k,v in per.items()}; left={k:v for k,v in left.items() if v}
ok("Simple mode: no decorative loop left running on any of %d screens"%len(per), not left, left)
ok("Basic Display label: 'Minimise all visuals.'", pg.evaluate("()=>document.querySelector('#simpleToggle small').textContent")=="Minimise all visuals." and pg.evaluate("()=>document.querySelector('#simpleToggle b').textContent")=="Basic Display")
pg.evaluate("()=>show('fire')"); pg.wait_for_timeout(600); pg.evaluate("()=>setSimple(false)"); pg.wait_for_timeout(1200)
st=pg.evaluate("()=>[EKMOTION.held(),document.getAnimations().filter(a=>a.playState==='running').length]"); ok("switching Simple off brings movement back", st[0]==0 and st[1]>20, st)
ok("Simple mode: no script errors", not [e for e in errs if "net::" not in e], [e for e in errs if "net::" not in e][:3]); b.close(); p.stop()
p,b,pg,errs,per=visit("calm")
fast={k:[x["n"] for x in v if x["st"]=="running" and abs(x["r"]-.45)>.001] for k,v in per.items()}; fast={k:v for k,v in fast.items() if v}
moving=sum(1 for v in per.values() for x in v if x["st"]=="running")
ok("Calm mode: every loop on every screen runs at 45%% speed (%d checked)"%moving, not fast and moving>50, fast)
ok("Low-stim mode label: 'Calmer visuals and softer sound.'", pg.evaluate("()=>document.querySelector('#calmToggle small').textContent")=="Calmer visuals and softer sound." and pg.evaluate("()=>document.querySelector('#calmToggle b').textContent")=="Low-stim mode")
pg.evaluate("()=>show('fire')"); pg.wait_for_timeout(600); pg.evaluate("()=>document.querySelector('#calmToggle').click()"); pg.wait_for_timeout(900)
ok("switching Calm off returns full speed", all(abs(x["r"]-1)<.001 for x in pg.evaluate(LOOPS) if x["st"]=="running"))
ok("Calm mode: no script errors", not [e for e in errs if "net::" not in e], [e for e in errs if "net::" not in e][:3]); b.close(); p.stop()
# the breathing guide's timing is untouched in every mode
for mode in [None,"calm","simple"]:
    seed={"ek-agreed":"2026-11-01"}
    if mode: seed["ek-"+mode]="on"
    p,b,ctx,pg,errs=start(seed=seed,wait=2400)
    pg.evaluate("()=>document.querySelector('.tabs button[data-view=breathe]').click()"); pg.wait_for_timeout(900)
    pg.evaluate("()=>{const b=[...document.querySelectorAll('#view-breathe button')].find(x=>/^\\s*Begin/.test(x.textContent));if(b)b.click();}"); pg.wait_for_timeout(2500)
    g=pg.evaluate("()=>document.getAnimations().filter(a=>a.effect&&a.effect.target&&a.effect.target.id==='bHalo').map(a=>[Math.round(a.effect.getComputedTiming().duration),a.playbackRate])")
    ok(f"breathing guide keeps its timing ({mode or 'full'})", g and all(x[1]==1 and x[0]>=3000 for x in g), g)
    b.close(); p.stop()
print("\n%d passed, %d failed"%(sum(res),len(res)-sum(res)))
