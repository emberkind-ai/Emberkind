"""Emberkind 3.9.0 checks: five-tab navigation, Chats, Classic as the default look.
Run:  python3 -m http.server 8811  (in the app folder), then  python3 tests/nav_classic.py
Needs Playwright with Chromium. Screenshots go to tests/out/. Prints PASS/FAIL per check."""
import sys, os, json, time
sys.path.insert(0, os.path.dirname(__file__))
from harness import start
OUT=os.path.join(os.path.dirname(__file__),"out"); os.makedirs(OUT,exist_ok=True)
TABS=["fire","chats","vale","breathe","you"]; LABELS=["Home","Chats","Embervale","Regulate","You"]
res=[]
def ok(name,cond,info=""): res.append((name,bool(cond),info)); print(("PASS " if cond else "FAIL ")+name+(("  ["+str(info)+"]") if info and not cond else ""))
def snap(pg,n): pg.screenshot(path=os.path.join(OUT,n+".png"))
def state(pg): return pg.evaluate("()=>({v:currentView,act:[...document.querySelectorAll('.view.active')].map(e=>e.id),cur:[...document.querySelectorAll('.tabs button[aria-current=page]')].map(b=>b.dataset.view)})")
def kill_intro(pg): pg.evaluate("()=>document.querySelectorAll('.evintro').forEach(e=>e.remove())")
def tab(pg,v,wait=450): pg.evaluate("v=>document.querySelector('.tabs button[data-view=\"'+v+'\"]').click()",v); pg.wait_for_timeout(wait); kill_intro(pg)

# ---------- fresh person: Classic, tabs, transitions ----------
p,b,ctx,pg,errs=start()
reqs=[]; pg.on("request",lambda r: reqs.append(r.url))
pg.reload(); pg.wait_for_timeout(2500)
pg.evaluate("()=>{const c=document.querySelector('#wAge');if(c&&!document.querySelector('#welcome').classList.contains('gone')){c.checked=true;c.dispatchEvent(new Event('change'));document.querySelector('#comeIn').click();}}"); pg.wait_for_timeout(1500)
cls=pg.evaluate("()=>document.querySelector('#app').className")
ok("fresh: Home opens in Classic","ekclassic" in cls and "ekpaint" not in cls, cls)
ok("fresh: no Milky Way painting downloaded", not any("bg-milkyway" in u or "img/home/soma.webp" in u for u in reqs), [u for u in reqs if "img/home" in u])
ok("fresh: ek-look stored as classic", pg.evaluate("()=>localStorage.getItem('ek-look')")=="classic")
labels=pg.evaluate("()=>[...document.querySelectorAll('.tabs button')].map(b=>[b.dataset.view,b.textContent.trim()])")
ok("tab bar order Home, Chats, Embervale, Regulate, You", labels==[list(x) for x in zip(TABS,LABELS)], labels)
ok("no Tools tab or Tools screen", pg.evaluate("()=>!document.querySelector('[data-view=tools]')&&!document.getElementById('view-tools')"))
snap(pg,"01_home_classic")
for v in TABS:
    tab(pg,v,700); s=state(pg)
    ok(f"tab {v}: right screen and only that tab lit", s["v"]==v and s["act"]==["view-"+v] and s["cur"]==[v], s)
    snap(pg,f"02_tab_{v}")
# every tab-to-tab move: the slide matches the tab bar, and no other screen shows on the way
JS="""async([a,t])=>{const seen=new Set();let run=true;const watch=()=>{document.querySelectorAll('.view.active').forEach(e=>seen.add(e.id));if(run)requestAnimationFrame(watch);};
 watch();document.querySelector('.tabs button[data-view="'+t+'"]').click();await new Promise(r=>setTimeout(r,40));const c=document.getElementById('view-'+t).className;
 await new Promise(r=>setTimeout(r,420));run=false;return {c,seen:[...seen]};}"""
bad=[]
for a in TABS:
    for t in TABS:
        if a==t: continue
        tab(pg,a,380); r=pg.evaluate(JS,[a,t]); want="ekslide-r" if TABS.index(t)>TABS.index(a) else "ekslide-l"
        other=[x for x in r["seen"] if x not in ("view-"+a,"view-"+t)]
        if want not in r["c"] or other: bad.append((a,t,r["c"],other))
        s=state(pg)
        if s["v"]!=t or s["cur"]!=[t]: bad.append((a,t,"state",s))
ok("all 20 tab-to-tab moves slide the right way, land right, never show a third screen", not bad, bad[:4])
# Embervale specifically, from each side
tab(pg,"you",400); r=pg.evaluate(JS,["you","vale"]); ok("You -> Embervale slides in from the left (not towards Home)", "ekslide-l" in r["c"] and "view-fire" not in r["seen"], r)
tab(pg,"fire",400); r=pg.evaluate(JS,["fire","vale"]); ok("Home -> Embervale slides in from the right", "ekslide-r" in r["c"], r)
# repeated and rapid taps
pg.evaluate("async()=>{for(const v of ['vale','chats','you','vale','vale','fire','breathe','vale']){document.querySelector('.tabs button[data-view=\"'+v+'\"]').click();await new Promise(r=>setTimeout(r,25));}}"); pg.wait_for_timeout(900)
s=state(pg); ok("rapid taps end on the last tab, in sync", s["v"]=="vale" and s["act"]==["view-vale"] and s["cur"]==["vale"], s)
tab(pg,"vale",300); tab(pg,"vale",300); s=state(pg); ok("tapping Embervale again keeps Embervale", s["v"]=="vale" and s["cur"]==["vale"], s)
ok("Embervale has no Back to Home button", pg.evaluate("()=>!document.getElementById('valeBack')&&!document.getElementById('evBack')"))
snap(pg,"03_vale_lit")
# swipes (touch), via the browser's touch input
cdp=ctx.new_cdp_session(pg)
def swipe(x0,x1,y=430):
    cdp.send("Input.dispatchTouchEvent",{"type":"touchStart","touchPoints":[{"x":x0,"y":y}]})
    for i in range(1,9): cdp.send("Input.dispatchTouchEvent",{"type":"touchMove","touchPoints":[{"x":x0+(x1-x0)*i/8,"y":y}]}); pg.wait_for_timeout(16)
    cdp.send("Input.dispatchTouchEvent",{"type":"touchEnd","touchPoints":[]}); pg.wait_for_timeout(700); kill_intro(pg)
tab(pg,"chats",500); swipe(330,60); s=state(pg); ok("swipe left on Chats goes to Embervale", s["v"]=="vale" and s["cur"]==["vale"], s)
swipe(330,60); s=state(pg); ok("swiping on Embervale moves the map, not the page", s["v"]=="vale", s)
tab(pg,"breathe",500); swipe(80,350); s=state(pg); ok("swipe right on Breathe goes back to Embervale", s["v"]=="vale" and s["cur"]==["vale"], s)
tab(pg,"chats",500); swipe(80,350); s=state(pg); ok("swipe right on Chats goes to Home", s["v"]=="fire" and s["cur"]==["fire"], s)

# ---------- Chats ----------
tab(pg,"chats",600)
ok("Chats empty state is calm and inviting", "No conversations yet" in pg.inner_text("#ckList"), pg.inner_text("#ckList"))
srcs=pg.evaluate("()=>[...document.querySelectorAll('#ckWho img')].map(i=>i.src===CMP_CLASSIC[i.closest('[data-k]').dataset.k])")
ok("Chats companions use Classic art", len(srcs)==4 and all(srcs), srcs)
snap(pg,"04_chats_empty")
pg.evaluate("""async()=>{try{localStorage.setItem('ek-consent','1');}catch(e){}await loadChat('soma');chats.soma.push({role:'user',content:'I keep replaying a fight with my sister'},{role:'assistant',content:'That sounds like it is still sitting heavy. Where do you notice it?'});saveChat('soma');await new Promise(r=>setTimeout(r,30));
  await loadChat('orra');chats.orra.push({role:'user',content:'Help me find words for a hard text'});saveChat('orra');await EKCHATS.render();}""")
pg.wait_for_timeout(500)
rows=pg.evaluate("()=>[...document.querySelectorAll('.ck-row')].map(r=>r.dataset.k)")
ok("Chats lists conversations, newest first", rows==["orra","soma"], rows)
snap(pg,"05_chats_list")
pg.evaluate("()=>document.querySelector('.ck-row[data-k=soma]').click()"); pg.wait_for_timeout(900)
if pg.evaluate("()=>!!document.querySelector('#consentSheet.on')"):
    pg.evaluate("()=>{const b=document.querySelector('#consentSheet .primary,#consentSheet button.gold,#consentOk,#consentSheet button:not([data-close])');if(b)b.click();}"); pg.wait_for_timeout(900)
s=state(pg); who=pg.evaluate("()=>document.querySelector('#whoName').textContent")
ok("tapping a conversation opens it with that companion", s["v"]=="chat" and who=="Soma", [s,who])
ok("its Back says Back to Chats", pg.evaluate("()=>document.querySelector('#backBtn').getAttribute('aria-label')")=="Back to Chats")
snap(pg,"06_chat_open")
pg.evaluate("()=>document.querySelector('#backBtn').click()"); pg.wait_for_timeout(700)
s=state(pg); ok("Back from a conversation returns to Chats, Chats tab lit", s["v"]=="chats" and s["cur"]==["chats"], s)

# ---------- Classic art elsewhere; scene choice ----------
tab(pg,"fire",600)
ok("companion name tabs use Classic art", pg.evaluate("()=>[...document.querySelectorAll('.ekct img')].every(i=>i.src===CMP_CLASSIC[i.parentNode.dataset.k])"))
pg.evaluate("()=>EKPAINT.open('soma')"); pg.wait_for_timeout(700)
ok("companion screen uses Classic art", pg.evaluate("()=>{const i=document.querySelector('.ekstory.ekcl .ekoart img');return !!i&&i.src===CMP_CLASSIC.soma}"))
snap(pg,"07_story_classic"); pg.evaluate("()=>EKPAINT.close()"); pg.wait_for_timeout(400)
pg.evaluate("()=>document.querySelector('#focusCard').click()"); pg.wait_for_timeout(800)
ok("Task buddy picker uses Classic art", pg.evaluate("()=>[...document.querySelectorAll('#fPick img')].every(i=>Object.values(CMP_CLASSIC).includes(i.getAttribute('src')))"))
snap(pg,"08_taskbuddy"); pg.evaluate("()=>document.querySelector('#focusBack').click()"); pg.wait_for_timeout(500)
opts=pg.evaluate("()=>{EKSCENE.open();return [...document.querySelectorAll('.ekscene [data-sm]')].map(b=>b.dataset.sm+':'+b.querySelector('b').textContent)}")
ok("Scene menu offers only Classic and Milky Way", opts==["classic:Classic","milkyway:Milky Way"], opts)
pg.evaluate("()=>EKSCENE.choose('milkyway')"); pg.wait_for_timeout(3000)
cls=pg.evaluate("()=>document.querySelector('#app').className")
ok("choosing Milky Way shows it", "ekpaint" in cls and "ekclassic" not in cls and pg.evaluate("()=>localStorage.getItem('ek-look')")=="milkyway", cls)
snap(pg,"09_milkyway")
pg.reload(); pg.wait_for_timeout(3500)
ok("Milky Way stays chosen after a refresh", "ekpaint" in pg.evaluate("()=>document.querySelector('#app').className"))
ok("Milky Way name tabs use its own portraits", pg.evaluate("()=>[...document.querySelectorAll('.ekct img')].every(i=>i.getAttribute('src').startsWith('img/home/'))"))
pg.evaluate("()=>{EKSCENE.open();EKSCENE.choose('classic')}"); pg.wait_for_timeout(1200); pg.reload(); pg.wait_for_timeout(2500)
ok("choosing Classic again sticks after a refresh", "ekclassic" in pg.evaluate("()=>document.querySelector('#app').className"))
errs_main=[e for e in errs if "ERR_FAILED" not in e and "net::" not in e]
ok("no script errors in this session", not errs_main, errs_main[:5])
b.close(); p.stop()

# ---------- people updating from 3.8.x get Classic ----------
for seed in [{"ek-homemode":"painted","ek-scene":"meadow"},{"ek-homemode":"painted","ek-scene":"milkyway"},{"ek-scene":"storybook"},{"ek-homemode":"classic"},{"ek-home3d":"1","ek-scene":"violet"}]:
    s2=dict(seed); s2["ek-agreed"]="2026-11-01"
    p,b,ctx,pg,errs=start(seed=s2,wait=2500)
    cls=pg.evaluate("()=>document.querySelector('#app').className"); left=pg.evaluate("()=>['ek-homemode','ek-scene','ek-home3d'].filter(k=>localStorage.getItem(k)!==null)")
    ok(f"update from {seed}: opens in Classic, old keys retired", "ekclassic" in cls and "ekpaint" not in cls and not left, [cls,left])
    b.close(); p.stop()

# ---------- smaller and larger phones: the tab bar fits ----------
for (w,h) in [(360,740),(412,860),(430,932)]:
    p,b,ctx,pg,errs=start(seed={"ek-agreed":"2026-11-01"},w=w,h=h,wait=2200)
    tab(pg,"vale",600)
    fit=pg.evaluate("()=>[...document.querySelectorAll('.tabs button')].map(b=>{const s=b.querySelector('span'),r=b.getBoundingClientRect();return {v:b.dataset.view,clip:s.scrollWidth>s.clientWidth+1,h:Math.round(r.height),w:Math.round(r.width)}})")
    ok(f"{w}x{h}: tab labels unclipped, targets at least 44px", all(not f["clip"] and f["h"]>=44 and f["w"]>=44 for f in fit), fit)
    ok(f"{w}x{h}: no sideways scrolling", pg.evaluate("()=>document.documentElement.scrollWidth<=innerWidth"))
    snap(pg,f"10_nav_{w}")
    b.close(); p.stop()
print("\n%d passed, %d failed"%(sum(1 for r in res if r[1]),sum(1 for r in res if not r[1])))
