"""Part 15 (companions consistent everywhere) and Part 16 (feedback that matches the moment).
15: each companion's name and role read the same on Home, the name tabs, their own screen, Chats, the chat header
and Task buddy; no realistic portrait appears outside the Milky Way scene; a chat opened from Chats, a companion's
screen or one of its suggestion chips reaches the right companion at the API (stand-in worker).
16: feedback phrases come only from the agreed sets and never repeat back to back; check-ins stay quiet; a Task
buddy finish uses a light phrase; no leftover "Well done" or "Beautiful." praise; no emoji used as feedback or icons.
Run with the app on :8811:  python3 tests/companions_copy_15_16.py"""
import sys, os, json, re, glob
sys.path.insert(0, os.path.dirname(__file__))
from harness import start
R=os.path.join(os.path.dirname(__file__),"..")
res=[]
def ok(n,c,info=""): res.append(bool(c)); print(("PASS " if c else "FAIL ")+n+(("  ["+str(info)[:400]+"]") if info and not c else ""))
p,b,ctx,pg,errs=start(seed={"ek-agreed":"2026-11-01","ek-consent":"1"},wait=2000)
asked=[]
def api(route):
    r=route.request
    if r.method!="POST": return route.fulfill(status=200,content_type="application/json",body='{"ok":true}')
    body=json.loads(r.post_data or "{}"); asked.append(body.get("companion"))
    if body.get("stream"): return route.fulfill(status=200,headers={"content-type":"text/event-stream"},body='data: {"type":"content_block_delta","delta":{"type":"text_delta","text":"I\'m here."}}\n\ndata: {"type":"message_stop"}\n\n')
    return route.fulfill(status=200,content_type="application/json",body=json.dumps({"content":[{"type":"text","text":'{"title":"A chat"}'}]}))
pg.route("https://emberkind-api.emberkindai.workers.dev/**",api); pg.reload(); pg.wait_for_timeout(2600)
C=pg.evaluate("()=>Object.fromEntries(['soma','siro','ava','orra'].map(k=>[k,{name:COMPANIONS[k].name,role:COMPANIONS[k].role}]))")
REAL=re.compile(r"img/home/(soma|siro|ava|orra)|CMP_ART|CMP_SIDE")
def realistic(): return pg.evaluate("""()=>{const bad=[];const real=new Set([...Object.values(window.CMP_ART||{}),...Object.values(window.CMP_SIDE||{})]);
  for(const i of document.querySelectorAll('img')){if(!i.getClientRects().length)continue;const s=i.getAttribute('src')||'';if(/img\\/home\\/(soma|siro|ava|orra)/.test(s)||real.has(s))bad.push((i.closest('[id]')||{}).id||i.className);}return bad}""")
# ---- 15: names and roles everywhere ----
home=pg.evaluate("()=>[...document.querySelectorAll('#ring .mate[data-c]')].map(m=>[m.dataset.c,m.innerText.replace(/\\s+/g,' ')])")
ok("Home: every companion's name and role match", all(C[k]["name"] in t and C[k]["role"].split(",")[0] in t for k,t in home) and len(home)==4, home)
tabs=pg.evaluate("()=>[...document.querySelectorAll('.ekct[data-k]')].map(t=>[t.dataset.k,t.innerText.replace(/\\s+/g,' ')])")
ok("name tabs under the fire: names and roles match", all(C[k]["name"] in t and C[k]["role"] in t for k,t in tabs) and len(tabs)==4, tabs)
ok("Home (Classic): no realistic portraits", not realistic(), realistic())
for k in C:
    pg.evaluate("k=>EKPAINT.open(k)",k); pg.wait_for_timeout(500)
    st=pg.evaluate("()=>document.querySelector('.ekstory').innerText.replace(/\\s+/g,' ').slice(0,200)")
    if not (C[k]["name"] in st and C[k]["role"] in st): ok(f"{k}'s own screen: name and role", False, st)
    if realistic(): ok(f"{k}'s own screen: Classic art", False, realistic())
    pg.evaluate("()=>EKPAINT.close()"); pg.wait_for_timeout(300)
ok("each companion's own screen shows the same name and role, Classic art", True)
pg.evaluate("()=>document.querySelector('.tabs button[data-view=chats]').click()"); pg.wait_for_timeout(600)
ck=pg.evaluate("()=>[...document.querySelectorAll('.ck-mate')].map(m=>[m.dataset.k,m.innerText.replace(/\\s+/g,' ')])")
ok("Chats: names and roles match", all(C[k]["name"] in t and C[k]["role"] in t for k,t in ck) and len(ck)==4, ck)
# ---- 15: each way into a conversation reaches the right companion ----
def say(msg): pg.fill("#box",msg); pg.evaluate("()=>document.querySelector('#sendBtn').click()"); pg.wait_for_timeout(1300)
route_ok=[]
for k in C:
    pg.evaluate("()=>show('chats')"); pg.wait_for_timeout(400); pg.evaluate("k=>document.querySelector('.ck-mate[data-k=\"'+k+'\"]').click()",k); pg.wait_for_timeout(700)
    hdr=pg.evaluate("()=>document.querySelector('#whoName').textContent"); n0=len(asked); say("Hello")
    route_ok.append((k,hdr==C[k]["name"],k in asked[n0:]))
    if realistic(): route_ok.append((k,"realistic in chat",realistic()))
ok("from Chats: header names the companion and the API gets that companion", all(x[1] and x[2] for x in route_ok if len(x)==3) and all(len(x)==3 for x in route_ok), route_ok)
pg.evaluate("()=>show('fire')"); pg.wait_for_timeout(500); pg.evaluate("()=>EKPAINT.open('ava')"); pg.wait_for_timeout(500)
chip=pg.evaluate("()=>{const b=document.querySelector('.ekstory .ekochips button');return b?b.textContent:null}")
n0=len(asked); pg.evaluate("()=>document.querySelector('.ekstory .ekochips button').click()"); pg.wait_for_timeout(1600)
ok("from a companion's screen, a suggestion chip opens their chat and reaches them", pg.evaluate("()=>[currentView,current]")==["chat","ava"] and "ava" in asked[n0:], [chip,pg.evaluate("()=>[currentView,current]"),asked[n0:]])
pg.evaluate("()=>show('fire')"); pg.wait_for_timeout(500); pg.evaluate("()=>EKPAINT.open('orra')"); pg.wait_for_timeout(500)
pg.evaluate("()=>{const g=document.querySelector('.ekstory .ekogo');if(g)g.click();}"); pg.wait_for_timeout(800)
ok("from a companion's screen, its talk button opens their chat", pg.evaluate("()=>[currentView,current]")==["chat","orra"], pg.evaluate("()=>[currentView,current]"))
# ---- 16: feedback ----
draws=pg.evaluate("()=>{const o={};for(const k of ['light','done','quiet','still']){o[k]=Array.from({length:300},()=>cheer(k));}o.none=cheer('nope');return o}")
ok("finished actions: That matters. Much needed. So it is. (no hype)", set(draws["light"])=={"That matters.","Much needed.","So it is."} and set(draws["done"])==set(draws["light"]))
ok("check-ins and journal: Received. So it is.", set(draws["quiet"])=={"Received.","So it is."})
ok("after meditation: Much needed. So it is.", set(draws["still"])=={"Much needed.","So it is."})
ok("never the same phrase twice in a row", all(a!=b for k in ("light","quiet","still") for a,b in zip(draws[k],draws[k][1:])))
ok("no suitable context: Received.", draws["none"]=="Received.")
pg.evaluate("()=>show('fire')"); pg.wait_for_timeout(400); pg.evaluate("()=>document.querySelector('#focusCard').click()"); pg.wait_for_timeout(700)
pg.evaluate("()=>{document.querySelector('#fTask').value='Fold the washing';document.querySelector('#fStart').click()}"); pg.wait_for_timeout(1500)
pg.evaluate("()=>document.querySelector('#fEnd').click()"); pg.wait_for_timeout(900)
after=pg.evaluate("()=>document.querySelector('#fAfterT').textContent")
ok("Task buddy finish: an acknowledgement, then 'You showed up for it.'", any(after.startswith(x) for x in ["That matters.","Much needed.","So it is."]) and "You showed up for it" in after, after)
src="".join(open(f,encoding="utf-8").read() for f in glob.glob(os.path.join(R,"js","*.js")))+open(os.path.join(R,"index.html"),encoding="utf-8").read()
ok("check-in finish is quiet: no 'Well done for checking in', low-mood line unchanged", "Well done for checking in" not in src and "Thank you for checking in${nm}. Go gently." in src and '${cheer("quiet")} Thanks for checking in${nm}.' in src)
ok("no leftover praise or hype ('Well done', 'Woohoo', 'Yay', 'Very cool', 'Nice!', 'Beautiful.')", not re.search(r"Well done|Nice work showing up|Woohoo|Yay!|Very cool|Nice!|Beautiful\. Keep|Every step done\. Beautiful",src))
emo=sorted(set(re.findall(r"[\U0001F300-\U0001FAFF\u2B50\u2728\u2764\u2705\u274C]",src)))
ok("no emoji used as feedback or interface icons", not emo, emo)
ok("Parts 15-16: no script errors", not [e for e in errs if "net::" not in e], [e for e in errs if "net::" not in e][:3])
b.close(); p.stop()
print("\n%d passed, %d failed"%(sum(res),len(res)-sum(res)))
