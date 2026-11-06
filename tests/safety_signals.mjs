// Fails if any psychological safety signal listed in tests/safety-signals.json has disappeared from the app.
// Run from the app folder:  node tests/safety_signals.mjs
import {readFileSync,readdirSync} from "node:fs";
const norm=t=>t.replaceAll("\\'","'").replaceAll("\u2019","'").replaceAll("&#39;","'").replaceAll("&nbsp;"," ");
const src=norm(readFileSync("index.html","utf8")+readdirSync("js").filter(f=>f.endsWith(".js")).map(f=>readFileSync("js/"+f,"utf8")).join("\n"));
const {signals}=JSON.parse(readFileSync("tests/safety-signals.json","utf8"));
const gone=signals.filter(s=>!src.includes(s));
for(const s of signals)console.log((gone.includes(s)?"MISSING ":"ok      ")+s);
console.log(`\n${signals.length-gone.length}/${signals.length} safety signals present`);process.exit(gone.length?1:0);
