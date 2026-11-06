import json, sys, time
from playwright.sync_api import sync_playwright

W,H=412,860
def start(port=8811, seed=None, w=W, h=H, dpr=1, enter=True, wait=2500):
    p=sync_playwright().start()
    b=p.chromium.launch(args=["--enable-unsafe-swiftshader","--use-gl=swiftshader","--ignore-gpu-blocklist"])
    ctx=b.new_context(viewport={"width":w,"height":h},device_scale_factor=dpr,is_mobile=True,has_touch=True,
        user_agent="Mozilla/5.0 (Linux; Android 15; Pixel 9 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Mobile Safari/537.36")
    def rt(route):
        u=route.request.url
        if u.startswith(f"http://localhost:{port}"): return route.continue_()
        return route.abort()
    ctx.route("**/*", rt)
    pg=ctx.new_page()
    errs=[]
    pg.on("pageerror", lambda e: errs.append("PAGEERROR "+str(e)))
    pg.on("console", lambda m: errs.append("CONSOLE "+m.type+": "+m.text) if m.type in ("error",) else None)
    if seed is not None:
        pg.add_init_script("(()=>{const s=%s;for(const k in s){try{if(localStorage.getItem('__seeded'))continue;localStorage.setItem(k,typeof s[k]==='string'?s[k]:JSON.stringify(s[k]));}catch(e){}}try{localStorage.setItem('__seeded','1')}catch(e){}})();" % json.dumps(seed))
    pg.goto(f"http://localhost:{port}/index.html", wait_until="domcontentloaded")
    pg.wait_for_timeout(wait)
    if enter:
        try:
            if pg.is_visible("#welcome") and pg.eval_on_selector("#app","a=>a.classList.contains('app-welcome')"):
                pg.evaluate("()=>{const c=document.querySelector('#wAge');c.checked=true;c.dispatchEvent(new Event('change'));document.querySelector('#comeIn').click();}")
                pg.wait_for_timeout(1500)
        except Exception as e: errs.append("ENTER "+str(e))
    return p,b,ctx,pg,errs

def shot(pg,name,full=False):
    path=f"/home/claude/qa/{name}.png"; pg.screenshot(path=path, full_page=full); return path

def tap(pg,sel):
    el=pg.query_selector(sel)
    if not el: raise Exception("no "+sel)
    el.tap()
