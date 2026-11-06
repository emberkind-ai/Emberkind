"""The privacy policy and terms exist twice: as web pages (privacy.html, terms.html, linked from the Play listing)
and inside the app (js/views-legal.js). This fails if their wording or dates ever differ. Also checks that the
privacy policy names everything that's sent to the AI. No browser needed:  python3 tests/legal_sync.py"""
import re, html, difflib, os, sys
R=os.path.join(os.path.dirname(__file__),"..")
def norm(h):
    h=re.sub(r'<script.*?</script>|<style.*?</style>','',h,flags=re.S); h=re.sub(r'</(p|li|h1|h2|h3|h4|div|summary)>','\n',h)
    t=html.unescape(re.sub(r'<[^>]+>','',h)); t=re.sub(r'[ \t]+',' ',t); return [l.strip() for l in t.split('\n') if l.strip()]
app=norm(re.findall(r'`(.*?)`',open(os.path.join(R,'js/views-legal.js')).read(),flags=re.S)[0])
def section(lines,start,stop=None):
    i=[k for k,l in enumerate(lines) if l.startswith(start)][0]; j=[k for k,l in enumerate(lines) if stop and l.startswith(stop) and k>i]
    return lines[i:j[0] if j else len(lines)]
res=[]
def ok(n,c,info=""): res.append(bool(c)); print(("PASS " if c else "FAIL ")+n+(("\n  "+"\n  ".join(info)) if info and not c else ""))
P=section(norm(open(os.path.join(R,'privacy.html')).read()),'Privacy policy. Last updated','Emberkind, Sydney NSW')
inP=section(app,'Privacy policy. Last updated','Terms of use')
d=[l[:160] for l in difflib.unified_diff(P,inP,lineterm='',n=0) if not l.startswith(('---','+++','@@'))]
ok("privacy policy: website and in-app copies match word for word", not d, d[:10])
T=section(norm(open(os.path.join(R,'terms.html')).read()),'Terms of use. Last updated','Contact')
inT=section(app,'Terms of use. Last updated','Contact')
d=[l[:160] for l in difflib.unified_diff(T,inT,lineterm='',n=0) if not l.startswith(('---','+++','@@'))]
ok("terms of use: website and in-app copies match word for word (up to Contact)", not d, d[:10])
p=" ".join(P)
ok("privacy policy names everything sent to the AI (replies, titles, Save as Ember, Task buddy steps)",
   all(x in p for x in ["to create a reply","short title for each one","Save as Ember","break a task down","current steps"]))
print("\n%d passed, %d failed"%(sum(res),len(res)-sum(res))); sys.exit(0 if all(res) else 1)
