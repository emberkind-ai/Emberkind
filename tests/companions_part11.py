"""Part 11: companion screens. Thin gold chevrons that can be tapped (no background), swiping and tapping move
through Soma, Siro, Ava, Orra in order, the ends have no outward arrow, and moving between companions never fades
the screen or shifts it vertically. Run with the app on :8811."""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from harness import start
OUT=os.path.join(os.path.dirname(__file__),"out"); os.makedirs(OUT,exist_ok=True)
res=[]
def ok(n,c,info=""): res.append(bool(c)); print(("PASS " if c else "FAIL ")+n+(("  ["+str(info)+"]") if info and not c else ""))
p,b,ctx,pg,errs=start(seed={"ek-agreed":"2026-11-01"},wait=2500)
cur=lambda: pg.evaluate("()=>EKMATE.current()")
pg.locator('#ring .mate[data-c="soma"]').first.tap(); pg.wait_for_timeout(700)
ok("tapping Soma opens her screen", cur()=="soma", cur())
st=pg.evaluate("()=>[...document.querySelectorAll('.ekstory .ekmnav')].map(b=>{const r=b.getBoundingClientRect(),cs=getComputedStyle(b);return {c:b.className,w:r.width,h:r.height,bg:cs.backgroundColor,img:cs.backgroundImage,label:b.getAttribute('aria-label')}})")
ok("first companion: only a next chevron, a real button, 44x72, no background", len(st)==1 and "r" in st[0]["c"] and st[0]["w"]>=44 and st[0]["h"]>=64 and st[0]["bg"] in ("rgba(0, 0, 0, 0)","transparent") and st[0]["img"]=="none" and st[0]["label"]=="Next companion", st)
pg.screenshot(path=os.path.join(OUT,"60_story_soma.png"))
seen=["soma"]; samples=[]
for i in range(3):
    y0=pg.evaluate("()=>document.querySelector('.ekstory .ekotx h2').getBoundingClientRect().top")
    pg.evaluate("""()=>{window.__ops=[];const t0=performance.now();const tick=()=>{const s=document.querySelector('.ekstory');if(s){const h=s.querySelector('.ekotx h2');window.__ops.push([+getComputedStyle(s).opacity,h?h.getBoundingClientRect().top:null]);}if(performance.now()-t0<450)requestAnimationFrame(tick);};requestAnimationFrame(tick);}""")
    pg.locator(".ekstory .ekmnav.r").tap(); pg.wait_for_timeout(600); seen.append(cur())
    ops=pg.evaluate("()=>window.__ops"); samples.append((y0,ops))
ok("next chevron goes Soma, Siro, Ava, Orra", seen==["soma","siro","ava","orra"], seen)
ok("moving between companions never fades the screen", all(min(o[0] for o in ops)>=.99 for _,ops in samples), [min(o[0] for o in ops) for _,ops in samples])
ok("and never shifts the title vertically", all(max(abs((o[1] or y0)-y0) for o in ops)<1.5 for y0,ops in samples), [max(abs((o[1] or y0)-y0) for o in ops) for y0,ops in samples])
ok("last companion: only a previous chevron", pg.evaluate("()=>[...document.querySelectorAll('.ekstory .ekmnav')].map(b=>b.className)")==["ekmnav l"])
pg.locator(".ekstory .ekmnav.l").tap(); pg.wait_for_timeout(600); ok("previous chevron goes back to Ava", cur()=="ava", cur())
cdp=ctx.new_cdp_session(pg)
def swipe(x0,x1,y=520):
    cdp.send("Input.dispatchTouchEvent",{"type":"touchStart","touchPoints":[{"x":x0,"y":y}]})
    for i in range(1,5): cdp.send("Input.dispatchTouchEvent",{"type":"touchMove","touchPoints":[{"x":x0+(x1-x0)*i/4,"y":y}]})
    cdp.send("Input.dispatchTouchEvent",{"type":"touchEnd","touchPoints":[]}); pg.wait_for_timeout(650)
swipe(320,90); ok("swipe left goes to the next companion", cur()=="orra", cur())
swipe(90,320); swipe(90,320); ok("swipe right twice goes back two", cur()=="siro", cur())
pg.evaluate("async()=>{for(let i=0;i<6;i++){const b=document.querySelector('.ekstory .ekmnav.r');if(b)b.click();await new Promise(r=>setTimeout(r,40));}}"); pg.wait_for_timeout(700)
ok("rapid taps stop at the last companion with one screen open", cur()=="orra" and pg.evaluate("()=>document.querySelectorAll('.ekstory').length")==1, [cur(),pg.evaluate("()=>document.querySelectorAll('.ekstory').length")])
pg.screenshot(path=os.path.join(OUT,"61_story_orra.png"))
pg.locator(".ekstory .ekox").tap(); pg.wait_for_timeout(500); ok("close returns to Home", cur() is None and pg.evaluate("()=>currentView")=="fire")
ok("Part 11: no script errors", not [e for e in errs if "net::" not in e], [e for e in errs if "net::" not in e][:3])
b.close(); p.stop()
print("\n%d passed, %d failed"%(sum(res),len(res)-sum(res)))
