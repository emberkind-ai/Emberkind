"""Leigh's decision (Nov 2026): every AI call uses Sonnet, never Haiku. A stand-in for the emberkind-api worker
records the model on every request while a real conversation, a conversation title and a Task buddy breakdown run.
Run with the app on :8811:  python3 tests/model_sonnet_only.py"""
import sys, os, json
sys.path.insert(0, os.path.dirname(__file__))
from harness import start
res=[]
def ok(n,c,info=""): res.append(bool(c)); print(("PASS " if c else "FAIL ")+n+(("  ["+str(info)+"]") if info and not c else ""))
p,b,ctx,pg,errs=start(seed={"ek-agreed":"2026-11-01","ek-consent":"1"},wait=2000)
seen=[]
def api(route):
    r=route.request
    if r.method!="POST": return route.fulfill(status=200,content_type="application/json",body='{"ok":true}')
    try: body=json.loads(r.post_data or "{}")
    except Exception: body={}
    q=json.dumps(body.get("messages",""))[-600:]; seen.append({"model":body.get("model"),"stream":bool(body.get("stream")),"kind":"title" if "title" in q else "steps" if "steps" in q else "spark" if "spark" in q else "chat"})
    if body.get("stream"):
        sse='data: {"type":"message_start"}\n\ndata: {"type":"content_block_delta","delta":{"type":"text_delta","text":"I\'m here. Take your time."}}\n\ndata: {"type":"message_stop"}\n\n'
        return route.fulfill(status=200,headers={"content-type":"text/event-stream"},body=sse)
    t='{"title":"A hard week"}' if "title" in q else '{"steps":["Open the form","Write one line","Save it"]}' if "steps" in q else '{"spark":"Breathe out slowly."}'
    return route.fulfill(status=200,content_type="application/json",body=json.dumps({"content":[{"type":"text","text":t}]}))
pg.route("https://emberkind-api.emberkindai.workers.dev/**",api)
pg.reload(); pg.wait_for_timeout(2600)
pg.evaluate("()=>document.querySelector('.tabs button[data-view=chats]').click()"); pg.wait_for_timeout(600)
pg.evaluate("()=>document.querySelector('.ck-mate[data-k=soma]').click()"); pg.wait_for_timeout(900)
for msg in ["I keep replaying a fight with my sister","It was about Mum's birthday plans"]:
    pg.fill("#box",msg); pg.evaluate("()=>document.querySelector('#sendBtn').click()"); pg.wait_for_timeout(1800)
pg.evaluate("()=>{show('fire')}"); pg.wait_for_timeout(500)
pg.evaluate("()=>document.querySelector('#focusCard').click()"); pg.wait_for_timeout(700)
pg.evaluate("()=>{document.querySelector('#fTask').value='Write the funding application';document.querySelector('#fBreak').click()}"); pg.wait_for_timeout(1500)
kinds=sorted(set(s["kind"] for s in seen)); models=sorted(set(s["model"] for s in seen))
print("requests:",len(seen),"kinds:",kinds,"models:",models)
ok("a real conversation reached the API", any(s["kind"]=="chat" and s["stream"] for s in seen), seen[:4])
ok("a background job reached the API (title or steps)", any(s["kind"] in ("title","steps") for s in seen), kinds)
ok("every request asked for Sonnet", models==["claude-sonnet-5-5"], models)
ok("no request asked for Haiku", not any("haiku" in str(s["model"]).lower() for s in seen))
ok("the reply arrived in the conversation", "Take your time" in pg.evaluate("()=>JSON.stringify(chats.soma||[])"))
ok("no script errors", not [e for e in errs if "net::" not in e], [e for e in errs if "net::" not in e][:3])
b.close(); p.stop()
print("\n%d passed, %d failed"%(sum(res),len(res)-sum(res)))
