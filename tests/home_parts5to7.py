"""Emberkind 3.9.0 checks for Parts 5-7: Embervale category arrows, Home hierarchy and invitation, Classic scene
controls (Sound beside Day/Now, no Controls button, Scene reachable by tapping), day/night timing, no overlaps.
Run with the app served on :8811:  python3 tests/home_parts5to7.py   (screenshots in tests/out/)"""
import sys, os, json
sys.path.insert(0, os.path.dirname(__file__))
from harness import start
OUT=os.path.join(os.path.dirname(__file__),"out"); os.makedirs(OUT,exist_ok=True)
res=[]
def ok(n,c,info=""): res.append(bool(c)); print(("PASS " if c else "FAIL ")+n+(("  ["+str(info)+"]") if info and not c else ""))
def tapsel(pg,sel):  # a real touch tap at the element's centre (not a scripted click)
    pg.locator(sel).first.scroll_into_view_if_needed(); pg.locator(sel).first.tap(); pg.wait_for_timeout(450)
RECT="s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return [r.left,r.top,r.right,r.bottom]}"
def hit(a,b): return a and b and not (a[2]<=b[0] or b[2]<=a[0] or a[3]<=b[1] or b[3]<=a[1])

# ---------- Part 5: Embervale category arrows ----------
p,b,ctx,pg,errs=start(seed={"ek-agreed":"2026-11-01"},wait=2400)
pg.evaluate("()=>document.querySelector('.tabs button[data-view=vale]').click()"); pg.wait_for_timeout(1400); pg.evaluate("()=>document.querySelectorAll('.evintro').forEach(e=>e.remove())")
cat=lambda: pg.evaluate("()=>{const o=document.querySelector('#evTabs .on');return o&&o.dataset.tab}")
dis=lambda: pg.evaluate("()=>[document.querySelector('.ekcat-a.l').disabled,document.querySelector('.ekcat-a.r').disabled]")
order=pg.evaluate("()=>[...document.querySelectorAll('#evTabs [data-tab]')].map(b=>b.dataset.tab)")
ok("categories keep their order", order[:5]==["all","paths","village","practice","nature"], order)
ok("at the first category: back arrow off, next arrow on", cat()=="all" and dis()==[True,False], [cat(),dis()])
seen=[cat()]
for i in range(len(order)-1): tapsel(pg,".ekcat-a.r"); seen.append(cat())
ok("next arrow visits every category in order", seen==order, seen)
ok("at the last category: next arrow off", dis()[1] is True, dis())
inview=pg.evaluate("()=>{const r=document.querySelector('#evTabs').getBoundingClientRect(),q=document.querySelector('#evTabs .on').getBoundingClientRect();return q.left>=r.left-1&&q.right<=r.right+1}")
ok("the chosen category chip is scrolled into view", inview)
pg.evaluate("async()=>{for(let i=0;i<12;i++){document.querySelector('.ekcat-a.l').click();await new Promise(r=>setTimeout(r,20));}}"); pg.wait_for_timeout(500)
ok("rapid back taps stop at the first category", cat()=="all" and dis()[0] is True, cat())
tapsel(pg,".ekcat-a.r"); cards=pg.evaluate("()=>[...document.querySelectorAll('#evCards .evcard')].map(c=>c.querySelector('b,.evcn,strong')?.textContent||c.innerText.split('\\n')[0])")
ok("Paths shows the whole paths collection", cat()=="paths" and len(cards)==5, cards)
tapsel(pg,'#evTabs [data-tab="nature"]'); tapsel(pg,".ekcat-a.l"); ok("arrows follow a chip tapped directly", cat()=="practice", cat())
pg.screenshot(path=os.path.join(OUT,"20_vale_arrows.png"))
ok("Part 5: no script errors", not [e for e in errs if "net::" not in e], errs[:3])
b.close(); p.stop()

# ---------- Parts 6 and 7, at three phone sizes ----------
for (w,h) in [(360,740),(412,860),(430,932)]:
    p,b,ctx,pg,errs=start(seed={"ek-agreed":"2026-11-01"},w=w,h=h,wait=2600)
    t=pg.evaluate("()=>{const h=document.querySelector('.scenewrap .hero'),k=[...h.children].map(e=>e.className);return {k,title:parseFloat(getComputedStyle(h.querySelector('.title')).fontSize),greet:document.querySelector('#greet').textContent}}")
    ok(f"{w}: Emberkind first and larger, then Welcome home, then the invitation", t["k"][:3]==["title","greet","sub"] and t["title"]>=36 and t["greet"]=="Welcome home", t)
    fire=pg.inner_text("#view-fire")
    ok(f"{w}: no 'Who's by the fire', no 'Welcome back', one welcome", "Who's by the fire" not in fire and "Welcome back" not in fire and fire.lower().count("welcome home")==1, fire.lower().count("welcome home"))
    inv=pg.evaluate(RECT,".ekinvite"); wrap=pg.evaluate(RECT,"#scenewrap"); ctl=pg.evaluate(RECT,".homectl"); tip=pg.evaluate(RECT,".hcTip")
    labels=pg.evaluate("()=>[...document.querySelectorAll('#ring .lbl2')].map(e=>{const r=e.getBoundingClientRect();return [r.left,r.top,r.right,r.bottom]})")
    feet=max(l[3] for l in labels)
    ok(f"{w}: invitation inside the scene, below the companions, above the controls, centred",
       inv and inv[1]>=feet-2 and inv[3]<=ctl[1]+1 and inv[3]<=wrap[3] and abs((inv[0]+inv[2])/2-(wrap[0]+wrap[2])/2)<2, [inv,feet,ctl])
    ok(f"{w}: invitation, labels, controls and tip never overlap", not any(hit(inv,l) for l in labels) and not hit(inv,ctl) and not hit(ctl,tip), [inv,ctl,tip])
    hc=pg.evaluate("()=>[...document.querySelector('.homectl').children].filter(e=>!e.hidden).map(e=>e.id)")
    ok(f"{w}: Sound sits beside Day/Now in the scene", hc[:2]==["hcSound","hcTime"], hc)
    row=pg.evaluate("()=>[...document.querySelectorAll('.ekctrl>button')].filter(b=>b.offsetParent).map(b=>b.dataset.go||b.id)")
    ok(f"{w}: no Controls button; Settings and Scene visible in Classic", "controls" not in row and row==["settings","scene"], row)
    b.close(); p.stop()

p,b,ctx,pg,errs=start(seed={"ek-agreed":"2026-11-01"},wait=2600)
ok("AI note kept beside the companions", "never instead of them" in pg.inner_text("#view-fire .under"))
# sound toggle
s0=pg.evaluate("()=>[document.querySelector('#hcSound').getAttribute('aria-pressed'),document.querySelector('#hcSoundT').textContent]")
tapsel(pg,"#hcSound"); s1=pg.evaluate("()=>[document.querySelector('#hcSound').getAttribute('aria-pressed'),document.querySelector('#hcSoundT').textContent,localStorage.getItem('ek-sound')]")
ok("Sound toggles and shows its state", s0[0]!=s1[0] and s0[1]!=s1[1], [s0,s1])
pg.reload(); pg.wait_for_timeout(2600); s2=pg.evaluate("()=>[document.querySelector('#hcSound').getAttribute('aria-pressed'),document.querySelector('#hcSoundT').textContent]")
ok("Sound choice is kept after a refresh", s2==s1[:2], [s1,s2])
# day and time
ph0=pg.evaluate("()=>document.querySelector('#app').dataset.phase"); tapsel(pg,"#hcTime"); ph1=pg.evaluate("()=>[document.querySelector('#app').dataset.phase,document.querySelector('#hcNow').hidden]")
ok("Day/Now: tapping the time changes the scene and offers Now", ph1[0]!=ph0 and ph1[1] is False, [ph0,ph1])
pg.screenshot(path=os.path.join(OUT,"21_home_three_controls.png"))
tapsel(pg,"#hcNow"); ok("Now returns to real time", pg.evaluate("()=>[document.querySelector('#app').dataset.phase,document.querySelector('#hcNow').hidden]")==[ph0,True])
dur=pg.evaluate("()=>['.sk','.soil','#scenewrap .nighthug','#scenewrap .ground','#scenewrap .mist','#scenewrap .firelight'].map(s=>{const e=document.querySelector(s);return e?getComputedStyle(e).transitionDuration.split(',')[0]:null})")
ok("day/night: sky, ground, glow and mist all change together in 0.7 s", all(d=="0.7s" for d in dur if d), dur)
pg.evaluate("()=>{const h=document.querySelector('.scenewrap .ekhint');h.textContent='Tap the fire to breathe';h.classList.add('on')}"); pg.wait_for_timeout(400)
ok("a first-visit whisper never sits on top of the sun-and-moon tip", pg.evaluate("()=>getComputedStyle(document.querySelector('.hcTip')).opacity")=="0")
pg.evaluate("()=>document.querySelector('.scenewrap .ekhint').classList.remove('on')")
# Scene by real taps, both ways
tapsel(pg,'.ekctrl [data-go="scene"]'); ok("Scene opens from its button in Classic", pg.evaluate("()=>!!document.querySelector('.ekscene.on')"))
tapsel(pg,'.ekscene [data-sm="milkyway"]'); pg.wait_for_timeout(3000)
mw=pg.evaluate("()=>({cls:document.querySelector('#app').className,snd:document.querySelector('#hcSound').parentNode.className,lantern:getComputedStyle(document.querySelector('#ekLantern')).display})")
ok("Milky Way by tap: scene shows, Sound moves under the scene, About (i) visible", "ekpaint" in mw["cls"] and "ekctrl" in mw["snd"] and mw["lantern"]!="none", mw)
pg.screenshot(path=os.path.join(OUT,"22_milkyway.png"))
tapsel(pg,'.ekctrl [data-go="scene"]'); tapsel(pg,'.ekscene [data-sm="classic"]'); pg.wait_for_timeout(800)
cl=pg.evaluate("()=>({cls:document.querySelector('#app').className,snd:document.querySelector('#hcSound').parentNode.className})")
ok("Classic by tap: Sound returns beside Day/Now", "ekclassic" in cl["cls"] and "homectl" in cl["snd"], cl)
# Continue conversation: only when there is one
ok("no Continue conversation without a conversation", pg.evaluate("()=>{const e=document.querySelector('.ekcv');return !e||e.hidden}"))
pg.evaluate("async()=>{await loadChat('siro');chats.siro.push({role:'user',content:'Help me with a morning routine'});saveChat('siro');await EK_sessions.homeRow();}"); pg.wait_for_timeout(500)
ok("Continue conversation appears once there is one", pg.evaluate("()=>{const e=document.querySelector('.ekcv');return !!e&&!e.hidden&&e.querySelectorAll('.ekcv-c').length===1}"))
pg.evaluate("()=>setName('Leigh')"); pg.wait_for_timeout(300)
ok("greeting uses the name: Welcome home, Leigh", pg.evaluate("()=>document.querySelector('#greet').textContent")=="Welcome home, Leigh")
pg.evaluate("()=>document.querySelector('#view-fire').scrollTo(0,0)"); pg.wait_for_timeout(400); pg.screenshot(path=os.path.join(OUT,"23_home_named.png"))
ok("Parts 6-7: no script errors", not [e for e in errs if "net::" not in e], [e for e in errs if "net::" not in e][:3])
b.close(); p.stop()
print("\n%d passed, %d failed"%(sum(res),len(res)-sum(res)))
