"""3.9.1 (Leigh's answers, 7 Nov): acknowledgement without evaluation (the six phrases, where each may appear), the
two approved trims, the month card without a countdown, and the waterfall at the lake from Water practice level 5.
Run with the app on :8811:  python3 tests/release_391.py"""
import sys, os, re, glob, json
sys.path.insert(0, os.path.dirname(__file__))
from harness import start
R=os.path.join(os.path.dirname(__file__),"..")
res=[]
def ok(n,c,info=""): res.append(bool(c)); print(("PASS " if c else "FAIL ")+n+(("  ["+str(info)[:300]+"]") if info and not c else ""))
src={f:open(f,encoding="utf-8").read() for f in glob.glob(os.path.join(R,"js","*.js"))+[os.path.join(R,"index.html")]}
allsrc="".join(src.values())
ok("a new badge: the button says 'I honour this.'", '<button class="sitBtn" data-close>I honour this.</button>' in allsrc)
ok("a streak milestone: 'I honour this.'", 'id="ekCeleOk">I honour this.</button>' in allsrc)
ok("a new field guide find: 'Received.'", 'id="fgOk">Received.</button>' in allsrc)
ok("all three weekly intentions done: 'I take this with me.'", 'id="wkOk">I take this with me.</button>' in allsrc)
ok("'I honour this.' and 'I take this with me.' never come from the app's own voice", "I honour this" not in allsrc.split("const CHEER=")[1].split(";")[0] and "I take this with me" not in allsrc.split("const CHEER=")[1].split(";")[0])
ok("after Breathe, 'Calmer' is met with 'Much needed.', not 'Lovely.'", '"Much needed. Your body has just practised settling' in allsrc and '"Lovely. Your body' not in allsrc)
ok("the chat no longer repeats the companion's description and 'For when...' line", 'class="cintro"' not in src[os.path.join(R,"js","app-02.js")])
ok("the 'works offline' line is gone everywhere", "works offline" not in allsrc)
ok("the month card: a goal and a timeframe, no countdown", "any time this ${new Date().toLocaleDateString" in allsrc and "day${dl===1" not in allsrc)
ok("the principle is in the design rules", "Acknowledgement without evaluation. Continuation without expectation." in open(os.path.join(R,"DESIGN_PRINCIPLES.md")).read())
ok("Water practice level 5 still promises 'A waterfall'", '"A wooden bridge","A waterfall","A wide, still lake"' in allsrc)
# the waterfall is drawn only from Water level 5, and in the valley's depth order
p,b,ctx,pg,errs=start(seed={"ek-agreed":"2026-11-01"},wait=2300)
pg.evaluate("()=>{window.__falls=0;const f=EVA.falls;EVA.falls=function(){window.__falls++;return f.apply(this,arguments);};}")
pg.evaluate("()=>document.querySelector('.tabs button[data-view=vale]').click()"); pg.wait_for_timeout(1500); pg.evaluate("()=>{document.querySelectorAll('.evintro').forEach(e=>e.remove());try{EV.cineMode(false)}catch(e){}}")
lk=pg.evaluate("()=>EV.state.lake"); pg.evaluate("([c,r])=>EV.cineSet(c,r,3,0)",[lk["c"]-1.3,lk["r"]+.4]); pg.wait_for_timeout(1200)
fresh=pg.evaluate("()=>[window.__falls,EV.state.lv.water]")
ok("a new valley (Water below level 5): no waterfall yet", fresh[0]==0 and fresh[1]<5, fresh)
pg.evaluate("()=>document.getElementById('evComplete').click()"); pg.wait_for_timeout(600); pg.evaluate("([c,r])=>EV.cineSet(c,r,3,0)",[lk["c"]-1.3,lk["r"]+.4]); pg.evaluate("()=>{window.__falls=0}"); pg.wait_for_timeout(1500)
ok("Water at level 5 or more: the waterfall is drawn, and keeps moving", pg.evaluate("()=>window.__falls")>3, pg.evaluate("()=>window.__falls"))
ok("no script errors", not [e for e in errs if "net::" not in e], [e for e in errs if "net::" not in e][:3])
b.close(); p.stop()
print("\n%d passed, %d failed"%(sum(res),len(res)-sum(res)))
