"""Part 8 checks in a crowded valley: hold to select (one tick, Arrange on), Flip and Size change only the chosen
item (grid footprint and every other item untouched), pan on empty ground keeps the selection, pinch zoom works
while arranging, the selected item can be dragged, tapping empty ground deselects, the hearth flips and resizes but
never moves. Real touch input through Chrome's touch events. Run with the app on :8811."""
import sys, os, json
sys.path.insert(0, os.path.dirname(__file__))
from harness import start
OUT=os.path.join(os.path.dirname(__file__),"out"); os.makedirs(OUT,exist_ok=True)
res=[]
def ok(n,c,info=""): res.append(bool(c)); print(("PASS " if c else "FAIL ")+n+(("  ["+str(info)+"]") if info and not c else ""))
p,b,ctx,pg,errs=start(seed={"ek-agreed":"2026-11-01"},wait=2400)
pg.add_init_script("navigator.vibrate=(x)=>{(window.__buzz=window.__buzz||[]).push(x);return true;}")
# grow everything, give coins, and place what's earned so the valley is crowded
pg.evaluate("""()=>{profile.ev={fire:4e5,water:4e5,air:4e5,earth:4e5,space:4e5};profile.med=4e5;profile.vIntro=1;saveProfile();try{EKECO.bonus(20000,'test seed','seed-1');}catch(e){}}""")
pg.reload(); pg.wait_for_timeout(2600)
pg.evaluate("()=>document.querySelector('.tabs button[data-view=vale]').click()"); pg.wait_for_timeout(1800)
pg.evaluate("()=>{document.querySelectorAll('.evintro').forEach(e=>e.remove());try{EV.cineMode(false)}catch(e){}}")
seed=pg.evaluate("""()=>{const V=EVW;let bought=0;for(const k of Object.keys(V.VILLAGE)){for(let n=0;n<2;n++){if(V.buy(k))bought++;}}
  let st=V.compute();const placed=[],N=st.N,cx=Math.floor(N/2),cy=Math.floor(N/2);
  for(const it of st.list){if(st.items.some(i=>i.id===it.id))continue;let done=false;
    for(let d=1;d<18&&!done;d++)for(let dc=-d;dc<=d&&!done;dc++)for(let dr=-d;dr<=d&&!done;dr++){if(Math.max(Math.abs(dc),Math.abs(dr))!==d)continue;const c=cx+dc,r=cy+dr;
      if(st.fits(c,r,it.w||1,it.h||1,it.id)){V.place(it.id,c,r);st=V.compute();done=true;placed.push(it.id);}}}
  EV.refresh();return {bought,placed:placed.length,items:EV.state.items.length,kinds:[...new Set(EV.state.items.map(i=>i.kind||String(i.id).split(':')[0]))].slice(0,40)}}""")
print("seed:",json.dumps(seed)[:600])
pg.wait_for_timeout(800)
foot=lambda: pg.evaluate("()=>JSON.stringify([EV.state.items.map(i=>[i.id,i.c,i.r,i.w,i.h]).sort(),Array.from(EV.state.occ).join(',')])")
looks=lambda: pg.evaluate("()=>JSON.stringify(profile.vlook||{})")
cdp=ctx.new_cdp_session(pg)
def touch(t,pts): cdp.send("Input.dispatchTouchEvent",{"type":t,"touchPoints":[{"x":x,"y":y,"id":i} for i,(x,y) in enumerate(pts)]})
def hold(x,y,ms=650): touch("touchStart",[(x,y)]); pg.wait_for_timeout(ms); touch("touchEnd",[]); pg.wait_for_timeout(350)
def drag(x0,y0,x1,y1,steps=10,first_wait=0):
    touch("touchStart",[(x0,y0)]); pg.wait_for_timeout(first_wait)
    for i in range(1,steps+1): touch("touchMove",[(x0+(x1-x0)*i/steps,y0+(y1-y0)*i/steps)]); pg.wait_for_timeout(18)
    touch("touchEnd",[]); pg.wait_for_timeout(400)
def tapxy(x,y): touch("touchStart",[(x,y)]); pg.wait_for_timeout(60); touch("touchEnd",[]); pg.wait_for_timeout(450)
def where(id): return pg.evaluate("id=>{const i=EV.state.items.find(x=>x.id===id);if(!i)return null;const c=document.querySelector('#valeCanvas').getBoundingClientRect(),s=EV.screenOf(i.c+(i.w||1)/2-.5,i.r+(i.h||1)/2-.5);return [c.left+s[0],c.top+s[1]]}",id)
def bar(): return pg.evaluate("()=>{const b=document.querySelector('#evLook');return b&&!b.hidden?b.querySelector('[data-lk=name]').textContent:null}")
def pick(pred):
    return pg.evaluate("src=>{const f=new Function('i','return '+src);const c=document.querySelector('#valeCanvas').getBoundingClientRect();return EV.state.items.filter(f).map(i=>{const s=EV.screenOf(i.c+(i.w||1)/2-.5,i.r+(i.h||1)/2-.5);return [i.id,c.left+s[0],c.top+s[1]]}).filter(v=>v[1]>40&&v[1]<370&&v[2]>140&&v[2]<560)}",pred)
ok("valley is crowded for the test", seed["items"]>=25, seed)
pond=pick("/pond|lake|spring/.test(String(i.kind||i.id))") 
if not pond:
    pg.evaluate("()=>{const it=EV.state.items.find(i=>/pond|lake|spring/.test(String(i.kind||i.id)));if(it)EV.cineSet(it.c,it.r,EV.zoom,0)}"); pg.wait_for_timeout(500); pond=pick("/pond|lake|spring/.test(String(i.kind||i.id))")
ok("a pond (or other water piece) is placed and on screen", bool(pond), pond)
if pond:
    pid,x,y=pond[0]; f0=foot(); l0=json.loads(looks())
    pg.evaluate("()=>{window.__buzz=[]}"); hold(x,y)
    ok("hold ~0.5 s: Arrange on, the pond selected, one short tick", pg.evaluate("()=>EV.arranging") and bar() is not None and len(pg.evaluate("()=>window.__buzz||[]"))==1, [pg.evaluate("()=>EV.arranging"),bar(),pg.evaluate("()=>window.__buzz")])
    pg.locator('#evLook [data-lk="flip"]').tap(); pg.wait_for_timeout(300)
    for i in range(8): pg.locator('#evLook [data-lk="s+"]').tap(); pg.wait_for_timeout(120)
    lk=json.loads(looks()).get(pid,{}); pct=pg.inner_text('#evLook [data-lv="sz"]')
    ok("flip and 140%: the pond's look changes, the bar says 140%, Flip lit", lk.get("f")==-1 and abs(lk.get("s",1)-1.4)<.001 and pct=="140%" and pg.evaluate("()=>document.querySelector('#evLook [data-lk=flip]').getAttribute('aria-pressed')")=="true", [lk,pct])
    ok("grid footprints and positions of every item unchanged", foot()==f0)
    others={k:v for k,v in json.loads(looks()).items() if k!=pid}; ok("no other item's look changed", others=={k:v for k,v in l0.items() if k!=pid}, [others,l0])
    pg.screenshot(path=os.path.join(OUT,"50_pond_140.png"))
    # pan on empty ground with the pond still selected
    empty=pg.evaluate("""()=>{const c=document.querySelector('#valeCanvas').getBoundingClientRect(),N=EV.N,st=EV.state;for(let r=0;r<N;r++)for(let q=0;q<N;q++){if(st.occ[r*N+q]||!st.seen[r*N+q])continue;const s=EV.screenOf(q,r),x=c.left+s[0],y=c.top+s[1];if(x>90&&x<300&&y>170&&y<480)return [x,y];}return null}""")
    before=where(pid); drag(empty[0],empty[1],empty[0]-90,empty[1]+40) if empty else None; after=where(pid)
    ok("swipe on empty ground pans the map and keeps the selection", empty and before and after and abs(after[0]-before[0])>40 and bar() is not None, [empty,before,after,bar()])
    # pinch zoom while arranging
    z0=pg.evaluate("()=>EV.zoom"); cx,cy=200,330
    touch("touchStart",[(cx-30,cy),(cx+30,cy)])
    for i in range(1,9): touch("touchMove",[(cx-30-i*12,cy),(cx+30+i*12,cy)]); pg.wait_for_timeout(20)
    touch("touchEnd",[]); pg.wait_for_timeout(400); z1=pg.evaluate("()=>EV.zoom")
    ok("pinch zoom works while arranging, selection kept", z1>z0*1.1 and bar() is not None and pg.evaluate("()=>EV.arranging"), [z0,z1,bar()])
    # drag the selected pond to a free spot
    f1=foot(); pos0=pg.evaluate("id=>{const i=EV.state.items.find(x=>x.id===id);return [i.c,i.r]}",pid)
    # grab the pond on its own anchor tile and drop it on a spot the valley says is free for its footprint
    plan=pg.evaluate("""id=>{const st=EV.state,i=st.items.find(x=>x.id===id),c=document.querySelector('#valeCanvas').getBoundingClientRect(),S=(q,r)=>{const s=EV.screenOf(q,r);return [c.left+s[0],c.top+s[1]]};
      for(let d=2;d<9;d++)for(let dc=-d;dc<=d;dc++)for(let dr=-d;dr<=d;dr++){const q=i.c+dc,r=i.r+dr;if(!st.fits(q,r,i.w||1,i.h||1,i.id))continue;const t=S(q,r);if(t[0]>40&&t[0]<370&&t[1]>140&&t[1]<560)return {from:S(i.c,i.r),to:t,target:[q,r]};}return null}""",pid)
    pg.evaluate("()=>{window.__said=[];const t0=window.toast;window.toast=function(m){window.__said.push(m);return t0&&t0.apply(this,arguments);}}")
    sx,sy=plan["from"]; drag(sx,sy,plan["to"][0],plan["to"][1],steps=14,first_wait=120)
    pos1=pg.evaluate("id=>{const i=EV.state.items.find(x=>x.id===id);return [i.c,i.r]}",pid)
    moved_others=pg.evaluate("([f,id])=>{const a=JSON.parse(f)[0].filter(x=>x[0]!==id),b=EV.state.items.filter(x=>x.id!==id).map(i=>[i.id,i.c,i.r,i.w,i.h]).sort();return JSON.stringify(a)!==JSON.stringify(b)}",[f1,pid])
    ok("the selected pond can be dragged to a free spot; nothing else moves", pos1==plan["target"] and not moved_others, [pos0,pos1,plan["target"],moved_others,pg.evaluate("()=>window.__said")])
    pg.screenshot(path=os.path.join(OUT,"51_pond_moved.png"))
    empty=pg.evaluate("""()=>{const c=document.querySelector('#valeCanvas').getBoundingClientRect(),N=EV.N,st=EV.state;for(let r=0;r<N;r++)for(let q=0;q<N;q++){if(st.occ[r*N+q]||!st.seen[r*N+q])continue;const s=EV.screenOf(q,r),x=c.left+s[0],y=c.top+s[1];if(x>90&&x<300&&y>170&&y<480)return [x,y];}return null}""")
    tapxy(*empty); ok("tapping empty ground deselects", bar() is None, bar())
# the hearth
h=pick("/hearth|fire/.test(String(i.kind||i.id))&&!/lantern/.test(String(i.id))")
if not h:
    pg.evaluate("()=>{const it=EV.state.items.find(i=>/hearth|fire/.test(String(i.kind||i.id)));if(it)EV.cineSet(it.c,it.r,EV.zoom,0)}"); pg.wait_for_timeout(500); h=pick("/hearth|fire/.test(String(i.kind||i.id))&&!/lantern/.test(String(i.id))")
ok("the hearth is on screen", bool(h), h)
if h:
    hid,x,y=h[0]; hold(x,y); pg.wait_for_timeout(200); hp0=pg.evaluate("id=>{const i=EV.state.items.find(x=>x.id===id);return [i.c,i.r]}",hid)
    sel=bar(); drag(x,y,x+80,y+40,steps=12,first_wait=120)
    hp1=pg.evaluate("id=>{const i=EV.state.items.find(x=>x.id===id);return [i.c,i.r]}",hid)
    ok("hearth: selectable, but dragging never moves it", sel is not None and hp0==hp1, [sel,hp0,hp1])
    if bar() is None: hold(*where(hid))
    pg.locator('#evLook [data-lk="flip"]').tap(); pg.wait_for_timeout(200); pg.locator('#evLook [data-lk="s+"]').tap(); pg.wait_for_timeout(200)
    hl=json.loads(looks()).get(hid,{}); ok("hearth flips and resizes", hl.get("f")==-1 and abs(hl.get("s",1)-1.05)<.001, hl)
    pg.locator('#evLook [data-lk="reset"]').tap(); pg.wait_for_timeout(200); ok("reset returns it to 100%", hid not in json.loads(looks()) and pg.inner_text('#evLook [data-lv="sz"]')=="100%")
# a building at the largest size in the crowd, for the eyes
bld=pick("String(i.id).startsWith('v:')")
if bld:
    bid,x,y=bld[0]; f2=foot(); hold(x,y)
    for i in range(12):
        if pg.evaluate("()=>document.querySelector('#evLook [data-lk=\"s+\"]').disabled"): break
        pg.locator('#evLook [data-lk="s+"]').tap(); pg.wait_for_timeout(80)
    ok("a building stops at 130%, + switches off there, footprint kept, nothing else moves", foot()==f2 and pg.inner_text('#evLook [data-lv="sz"]')=="130%" and pg.evaluate("()=>document.querySelector('#evLook [data-lk=\"s+\"]').disabled"), pg.inner_text('#evLook [data-lv="sz"]'))
    pg.screenshot(path=os.path.join(OUT,"52_building_130.png"))
    pg.evaluate("()=>{const b=document.querySelector('#evLook');const id=b.dataset.look;EVW.setLook(id,{s:1.6});}"); pg.locator('#evLook [data-lk="s-"]').tap(); pg.wait_for_timeout(200)
    ok("a building saved larger before 3.9.0 comes back within its limit", pg.inner_text('#evLook [data-lv="sz"]')=="125%", pg.inner_text('#evLook [data-lv="sz"]'))
small=pick("/flowers|sap|flags|decor|jac/.test(String(i.kind||i.id))")
if small:
    sid,x,y=small[0]; tapxy(*where(sid)) if pg.evaluate("()=>EV.arranging") else hold(x,y)
    for i in range(14):
        if pg.evaluate("()=>document.querySelector('#evLook [data-lk=\"s+\"]').disabled"): break
        pg.locator('#evLook [data-lk="s+"]').tap(); pg.wait_for_timeout(60)
    ok("a small piece can still reach 160%", pg.inner_text('#evLook [data-lv="sz"]')=="160%", pg.inner_text('#evLook [data-lv="sz"]'))
ok("companions in the valley are drawn with Classic art", pg.evaluate("()=>{const it=EV.state.items.find(i=>i.kind==='comp'||String(i.id).startsWith('comp'));return !!it}") and "CMP_CLASSIC[c]" in open(os.path.join(os.path.dirname(__file__),"..","js","vale.js")).read().split("function compImg")[1][:80])
ok("Part 8: no script errors", not [e for e in errs if "net::" not in e], [e for e in errs if "net::" not in e][:4])
b.close(); p.stop()
print("\n%d passed, %d failed"%(sum(res),len(res)-sum(res)))
