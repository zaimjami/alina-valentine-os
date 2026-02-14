
/* Valentine OS — pure HTML/CSS/JS (no build tools).
   Works on GitHub Pages because all paths are relative.
*/
function returnToLock() {
  localStorage.removeItem("unlocked"); // force passcode screen again
  location.reload();
}

const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
const sleep = (ms) => new Promise(r=>setTimeout(r,ms));

// ---------- Background stars ----------
function initStars(){
  const c = $("#stars");
  const ctx = c.getContext("2d");
  const dpr = Math.min(2, window.devicePixelRatio || 1);

  function resize(){
    c.width = Math.floor(window.innerWidth * dpr);
    c.height = Math.floor(window.innerHeight * dpr);
    c.style.width = "100%";
    c.style.height = "100%";
  }
  resize();

  let stars = [];
  const count = Math.floor((window.innerWidth * window.innerHeight) / 12000);

  function makeStars(){
    stars = [];
    for(let i=0;i<count;i++){
      stars.push({
        x: Math.random() * c.width,
        y: Math.random() * c.height,
        r: (Math.random()*1.6 + .2) * dpr,
        a: Math.random()*0.8 + 0.1,
        s: Math.random()*0.35 + 0.08,
      });
    }
  }
  makeStars();

  let t=0;
  function tick(){
    t += 0.01;
    ctx.clearRect(0,0,c.width,c.height);
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    for(const st of stars){
      st.y += st.s * dpr;
      if(st.y > c.height + 10) st.y = -10;
      const tw = st.a + Math.sin(t + st.x*0.002) * 0.12;
      ctx.globalAlpha = Math.max(0.05, Math.min(1, tw));
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.r, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }
  tick();
  window.addEventListener("resize", ()=>{resize(); makeStars();});
}

// ---------- Lock screen clock ----------
function initClock(){
  const clock = $("#clock");
  const dateLine = $("#dateLine");
  function render(){
    const now = new Date();
    const hh = String(now.getHours()).padStart(2,"0");
    const mm = String(now.getMinutes()).padStart(2,"0");
    clock.textContent = `${hh}:${mm}`;
    const opts = { weekday:"long", month:"long", day:"numeric" };
    dateLine.textContent = now.toLocaleDateString(undefined, opts);
  }
  render();
  setInterval(render, 15_000);
}

// ---------- Toast ----------
function toast(msg){
  const el = $("#lockMsg");
  el.textContent = msg;
  el.classList.remove("hidden");
  clearTimeout(el._t);
  el._t = setTimeout(()=>el.classList.add("hidden"), 3200);
}

// ---------- Local storage helpers ----------
const store = {
  get(k, def){ try{ return JSON.parse(localStorage.getItem(k)) ?? def } catch { return def } },
  set(k,v){ localStorage.setItem(k, JSON.stringify(v)); }
};

// ---------- Unlock ----------
function initUnlock(){
  const input = $("#passInput");
  const btn = $("#unlockBtn");
  const hintBtn = $("#hintBtn");
  const resetBtn = $("#resetBtn");

  const pass = (VAL?.passcode?.value || "").toLowerCase().trim();

  $("#passDisplay").textContent = pass;

  function unlock(){
    const v = (input.value || "").toLowerCase().replace(/\s+/g,"");
    if(v === pass){
      store.set("unlocked", true);
      $("#lock").classList.add("hidden");
      $("#home").classList.remove("hidden");
      $("#home").setAttribute("aria-hidden","false");
      initHome(); // build apps once
      toast("Unlocked 🤍");
    } else {
      toast("hmm… try again princess 😌");
      input.select();
    }
  }

  btn.addEventListener("click", unlock);
  input.addEventListener("keydown", (e)=>{ if(e.key==="Enter") unlock(); });

  hintBtn.addEventListener("click", ()=>{
    toast(VAL.passcode.hintLong);
  });

  resetBtn.addEventListener("click", ()=>{
    localStorage.clear();
    location.reload();
  });

  // if already unlocked
  if(store.get("unlocked", false)){
    $("#lock").classList.add("hidden");
    $("#home").classList.remove("hidden");
    $("#home").setAttribute("aria-hidden","false");
    initHome();
  }
}

// ---------- Windows (modals) ----------
function openWindow({id, title, icon, contentHTML, onMount}){
  // close existing with same id
  const existing = $(`.window[data-id="${id}"]`);
  if(existing){ existing.remove(); }

  const win = document.createElement("div");
  win.className = "window";
  win.dataset.id = id;

  win.innerHTML = `
    <div class="winTop">
      <div class="winTitle">
        <img src="${icon}" alt="" />
        <b>${title}</b>
      </div>
      <div class="winBtns">
        <button class="winBtn" data-act="min" title="Minimize"><img src="assets/min.svg" alt=""></button>
        <button class="winBtn" data-act="close" title="Close"><img src="assets/close.svg" alt=""></button>
      </div>
    </div>
    <div class="winBody">${contentHTML}</div>
  `;

  $("#windows").appendChild(win);

  const close = ()=> win.remove();
  win.addEventListener("click", (e)=>{
    const b = e.target.closest(".winBtn");
    if(!b) return;
    const act = b.dataset.act;
    if(act==="close" || act==="min") close();
  });

  // mount hooks
  if(onMount){
    try{ onMount(win); } catch(err){ console.error(err); }
  }
}

// ---------- Lightbox ----------
function initLightbox(){
  $("#lbClose").addEventListener("click", ()=> hideLightbox());
  $("#lightbox").addEventListener("click", (e)=>{
    if(e.target.id === "lightbox") hideLightbox();
  });
}
function showLightbox({src, title, text}){
  $("#lbImg").src = src;
  $("#lbTitle").textContent = title || "";
  $("#lbText").textContent = text || "";
  $("#lightbox").classList.remove("hidden");
  $("#lightbox").setAttribute("aria-hidden","false");
}
function hideLightbox(){
  $("#lightbox").classList.add("hidden");
  $("#lightbox").setAttribute("aria-hidden","true");
}

// ---------- Home apps ----------
let homeBuilt = false;

function initHome(){
  if(homeBuilt) return;
  homeBuilt = true;

  const grid = $("#appGrid");
  grid.innerHTML = "";
  for(const app of VAL.apps){
    const card = document.createElement("article");
    card.className = "appCard";
    card.dataset.id = app.id;
    card.innerHTML = `
      <div class="left">
        <div class="icon"><img src="${app.icon}" alt=""></div>
        <div>
          <h3>${app.title}</h3>
          <div class="meta">${app.meta}</div>
        </div>
      </div>
      <div class="tag">${app.tag}</div>
    `;
    card.addEventListener("click", ()=> launchApp(app.id));
    grid.appendChild(card);
  }

  $("#openNowBtn").addEventListener("click", ()=> launchApp("openwhen"));
  $("#panicBtn").addEventListener("click", ()=> emergencyCuteness());

  // Easter egg: type booty
  let buffer = "";
  window.addEventListener("keydown", (e)=>{
    if($("#home").classList.contains("hidden")) return;
    if(e.key.length !== 1) return;
    buffer = (buffer + e.key.toLowerCase()).slice(-8);
    if(buffer.includes("booty")){
      emergencyCuteness("BOOTY VERSE UNLOCKED 😭\n\nthat one Qur’an moment where we both just… lost it.");
      buffer = "";
    }
  });
}

function launchApp(id){
  const iconMap = Object.fromEntries(VAL.apps.map(a=>[a.id,a.icon]));
  const titleMap = Object.fromEntries(VAL.apps.map(a=>[a.id,a.title]));

  if(id === "timeline") return openTimeline(iconMap[id], titleMap[id]);
  if(id === "scrapbook") return openScrapbook(iconMap[id], titleMap[id]);
  if(id === "letter") return openLetter(iconMap[id], titleMap[id]);
  if(id === "reasons") return openReasons(iconMap[id], titleMap[id]);
  if(id === "promises") return openPromises(iconMap[id], titleMap[id]);
  if(id === "future") return openFuture(iconMap[id], titleMap[id]);
  if(id === "openwhen") return openOpenWhen(iconMap[id], titleMap[id]);
  if(id === "games") return openGames(iconMap[id], titleMap[id]);
  if(id === "nikkah") return openNikkah(iconMap[id], titleMap[id]);
}

function emergencyCuteness(customText){
  const lines = [
    "hi princess 🤍",
    "if you're reading this: you are loved.",
    "main tumse bohot zyada pyaar karta hoon.",
    "you are my forever.",
    "also… you're fat and ugly.",
  ];
  const msg = customText || lines.join("\n");
  fireConfetti();
  alert(msg);
}

// ---------- Timeline ----------
function openTimeline(icon, title){
  const content = `
    <div class="section">
      <h2>Slide through our little history</h2>
      <div class="row">
        <div class="col">
          <div class="sliderWrap">
            <input id="tlRange" type="range" min="0" max="${VAL.timeline.length-1}" value="0" step="1" />
            <span class="badge" id="tlBadge">1 / ${VAL.timeline.length}</span>
          </div>
          <div class="btnRow">
            <button class="btn sage" id="tlPrev">←</button>
            <button class="btn sage" id="tlNext">→</button>
            <button class="btn pink" id="tlRandom">random memory</button>
          </div>
        </div>
        <div class="col">
          <div class="receipt" id="tlReceipt"></div>
        </div>
      </div>
    </div>
    <div class="section">
      <h2>Memory card</h2>
      <div class="polaroids" id="tlCard"></div>
    </div>
  `;

  openWindow({
    id:"timeline",
    title,
    icon,
    contentHTML: content,
    onMount: (win)=>{
      const body = $(".winBody", win);
      const range = $("#tlRange", body);
      const badge = $("#tlBadge", body);
      const rec = $("#tlReceipt", body);
      const card = $("#tlCard", body);

      function render(i){
        const ev = VAL.timeline[i];
        badge.textContent = `${i+1} / ${VAL.timeline.length}`;

        rec.innerHTML = `
          <div class="line"><span>Event</span><span>${ev.when}</span></div>
          <hr class="sep">
          <div class="line"><span class="small">Title</span><span class="small">${ev.title}</span></div>
          <div class="line"><span class="small">Note</span><span class="small">${ev.text.replaceAll("\n"," ")}</span></div>
          <hr class="sep">
          <div class="line tot"><span>Total love</span><span>infinite</span></div>
          <div class="small">signed: ${VAL.people.yourName} (certified simp)</div>
        `;

        card.innerHTML = "";
        const item = document.createElement("div");
        item.className = "polaroid";
        item.innerHTML = `
          <img src="${ev.media.src}" alt="${ev.media.alt}">
          <div class="cap"><b>${ev.title}</b><br>${ev.text}</div>
        `;
        item.addEventListener("click", ()=> showLightbox({src: ev.media.src, title: ev.title, text: ev.text}));
        card.appendChild(item);
      }

      render(0);
      range.addEventListener("input", ()=> render(parseInt(range.value,10)));
      $("#tlPrev", body).addEventListener("click", ()=>{ range.value = Math.max(0, parseInt(range.value)-1); range.dispatchEvent(new Event("input")); });
      $("#tlNext", body).addEventListener("click", ()=>{ range.value = Math.min(VAL.timeline.length-1, parseInt(range.value)+1); range.dispatchEvent(new Event("input")); });
      $("#tlRandom", body).addEventListener("click", ()=>{ range.value = Math.floor(Math.random()*VAL.timeline.length); range.dispatchEvent(new Event("input")); });
    }
  });
}

// ---------- Scrapbook ----------
function openScrapbook(icon, title){
  const items = VAL.scrapbook.map((it, idx)=>`
    <div class="polaroid" data-i="${idx}">
      <img src="${it.src}" alt="photo">
      <div class="cap"><b>${it.title}</b><br>${it.text}</div>
    </div>
  `).join("");

  const content = `
    <div class="section">
      <h2>Scrapbook</h2>
      <p class="muted">Tap a photo to zoom. Replace placeholders with your real pics in <b>/media/photos</b> and update <b>data.js</b>.</p>
    </div>
    <div class="polaroids" id="sbGrid">${items}</div>
  `;

  openWindow({
    id:"scrapbook",
    title,
    icon,
    contentHTML: content,
    onMount: (win)=>{
      const body = $(".winBody", win);
      $$(".polaroid", body).forEach(el=>{
        el.addEventListener("click", ()=>{
          const i = parseInt(el.dataset.i,10);
          const it = VAL.scrapbook[i];
          showLightbox({src: it.src, title: it.title, text: it.text});
        });
      });
    }
  });
}

// ---------- Letter ----------
function openLetter(icon, title){
  const content = `
    <div class="section">
      <h2>Read slowly</h2>
      <div class="btnRow">
        <button class="btn sage" id="softBtn">soft</button>
        <button class="btn pink" id="goofyBtn">goofy</button>
        <button class="btn blue" id="typeBtn">re-type</button>
      </div>
    </div>
    <div class="section">
      <div id="typeBox" class="typeBox"></div>
    </div>
  `;

  openWindow({
    id:"letter",
    title,
    icon,
    contentHTML: content,
    onMount: async (win)=>{
      const body = $(".winBody", win);
      const box = $("#typeBox", body);
      let mode = "soft";

      // increment this to cancel any in-progress typing
      let typeJob = 0;

      async function type(text){
        const job = ++typeJob;          // cancel previous, start new job id
        box.textContent = "";
        for(const ch of text){
          if(job !== typeJob) return;   // cancelled -> stop immediately
          box.textContent += ch;
          await sleep(ch === "\n" ? 8 : 14);
          box.scrollTop = box.scrollHeight;
        }
      }

      await type(VAL.letter.soft);

      $("#softBtn", body).addEventListener("click", ()=>{
        mode="soft";
        type(VAL.letter.soft);
      });

      $("#goofyBtn", body).addEventListener("click", ()=>{
        mode="goofy";
        type(VAL.letter.goofy);
      });

      $("#typeBtn", body).addEventListener("click", ()=>{
        type(mode==="soft" ? VAL.letter.soft : VAL.letter.goofy);
      });
    }
  });
}


// ---------- Reasons ----------
function openReasons(icon, title){
  const content = `
    <div class="section">
      <h2>Reasons I love you (infinite edition)</h2>
      <div class="row">
        <div class="col">
          <div class="receipt" id="reasonReceipt"></div>
          <div class="btnRow">
            <button class="btn pink" id="genReason">generate another</button>
            <button class="btn sage" id="saveReason">save to favorites</button>
            <button class="btn blue" id="showFav">show favorites</button>
          </div>
        </div>
        <div class="col">
          <h2>I love you more meter</h2>
          <div class="sliderWrap">
            <input id="loveMeter" type="range" min="0" max="100" value="100" />
            <span class="badge" id="meterBadge">Zaim: 100%</span>
          </div>
          <p class="muted">scientifically accurate</p>
        </div>
      </div>
    </div>
  `;

  openWindow({
    id:"reasons",
    title,
    icon,
    contentHTML: content,
    onMount: (win)=>{
      const body = $(".winBody", win);
      const rec = $("#reasonReceipt", body);
      const meter = $("#loveMeter", body);
      const badge = $("#meterBadge", body);

      const favKey = "favReasons";
      let fav = store.get(favKey, []);

      function pick(){
        return VAL.reasons[Math.floor(Math.random()*VAL.reasons.length)];
      }

      let current = pick();

      function renderReceipt(reason){
        const now = new Date();
        rec.innerHTML = `
          <div class="line"><span>Receipt #</span><span>${Math.floor(Math.random()*9000)+1000}</span></div>
          <div class="line"><span>Date</span><span>${now.toLocaleDateString()}</span></div>
          <hr class="sep">
          <div class="line"><span>Item</span><span>Alina love</span></div>
          <div class="line"><span>Reason</span><span style="max-width:340px; text-align:right">${reason}</span></div>
          <hr class="sep">
          <div class="line tot"><span>Total</span><span>∞</span></div>
          <div class="small">paid in: forehead kisses + “aaja meri jaan”</div>
        `;
      }

      renderReceipt(current);

      $("#genReason", body).addEventListener("click", ()=>{
        current = pick();
        renderReceipt(current);
      });

      $("#saveReason", body).addEventListener("click", ()=>{
        if(!fav.includes(current)) fav.push(current);
        store.set(favKey, fav);
        fireConfetti(120);
        alert("Saved 🤍");
      });

      $("#showFav", body).addEventListener("click", ()=>{
        const text = fav.length ? fav.map((r,i)=>`${i+1}. ${r}`).join("\n") : "No favorites yet. Save some 🫶";
        alert(text);
      });

      meter.addEventListener("input", ()=>{
        badge.textContent = `Zaim: ${meter.value}%`;
        if(parseInt(meter.value,10) < 85){
          badge.textContent += " (Alina is still winning though)";
        }
      });
    }
  });
}

// ---------- Promises ----------
function openPromises(icon, title){
  const key = "promiseChecks";
  const saved = store.get(key, {});

  const list = VAL.promises.map((p, idx)=>{
    const checked = saved[idx] ? "checked" : "";
    return `<label><input type="checkbox" data-i="${idx}" ${checked} /> <span>${p}</span></label>`;
  }).join("");

  const content = `
    <div class="section">
      <h2>Promises (amanah energy)</h2>
      <p class="muted">Check them. They save automatically.</p>
      <div class="checklist" id="promiseList">${list}</div>
      <div class="btnRow">
        <button class="btn sage" id="allPromises">check all</button>
        <button class="btn pink" id="confettiPromises">seal with confetti</button>
      </div>
    </div>
  `;

  openWindow({
    id:"promises",
    title,
    icon,
    contentHTML: content,
    onMount:(win)=>{
      const body = $(".winBody", win);
      const box = $("#promiseList", body);

      box.addEventListener("change", (e)=>{
        const cb = e.target.closest("input[type=checkbox]");
        if(!cb) return;
        const i = cb.dataset.i;
        const next = store.get(key, {});
        next[i] = cb.checked;
        store.set(key, next);
      });

      $("#allPromises", body).addEventListener("click", ()=>{
        const next = {};
        $$("input[type=checkbox]", box).forEach((cb)=>{ cb.checked = true; next[cb.dataset.i] = true; });
        store.set(key, next);
        fireConfetti(180);
      });

      $("#confettiPromises", body).addEventListener("click", ()=> fireConfetti(260));
    }
  });
}

// ---------- Future ----------
function openFuture(icon, title){
  const items = VAL.future.map(f=>`<div class="line"><span>•</span><span style="text-align:right; flex:1">${f}</span></div>`).join("");
  const content = `
    <div class="section">
      <h2>InshaAllah list</h2>
      <div class="receipt">
        ${items}
        <hr class="sep">
        <div class="line tot"><span>Ending</span><span>Nikkah someday 🤍</span></div>
      </div>
    </div>
    <div class="section">
      <h2>What I learned from you</h2>
      <div class="typeBox">${VAL.learned}</div>
      <div class="btnRow">
        <button class="btn sage" id="futureConfetti">manifest</button>
        <button class="btn pink" id="futureText">send me this</button>
      </div>
    </div>
  `;

  openWindow({
    id:"future",
    title,
    icon,
    contentHTML: content,
    onMount:(win)=>{
      const body = $(".winBody", win);
      $("#futureConfetti", body).addEventListener("click", ()=> fireConfetti(260));
      $("#futureText", body).addEventListener("click", ()=>{
        const msg = "Copy/paste to Zaim:\n\n" + VAL.future.map(f=>`- ${f}`).join("\n");
        navigator.clipboard?.writeText(msg).then(()=>alert("Copied 🤍")).catch(()=>alert(msg));
      });
    }
  });
}

// ---------- Open When ----------
function openOpenWhen(icon, title){
  const cards = VAL.openWhen.map((o, idx)=>`
    <div class="env" data-i="${idx}">
      <h3>${o.title}</h3>
      <p>${o.prompt}</p>
    </div>
  `).join("");

  const content = `
    <div class="section">
      <h2>Open When…</h2>
      <p class="muted">Each envelope needs a tiny password. (because you love drama.)</p>
    </div>
    <div class="envelopes" id="envGrid">${cards}</div>
  `;

  openWindow({
    id:"openwhen",
    title,
    icon,
    contentHTML: content,
    onMount:(win)=>{
      const body = $(".winBody", win);
      const grid = $("#envGrid", body);

      grid.addEventListener("click", (e)=>{
        const card = e.target.closest(".env");
        if(!card) return;
        const i = parseInt(card.dataset.i,10);
        const item = VAL.openWhen[i];
        const ans = prompt(item.prompt);
        if(!ans) return;
        if(ans.toLowerCase().trim() === item.answer.toLowerCase().trim()){
          fireConfetti(160);
          alert(item.letter);
        } else {
          alert("Nope 😭 try again princess");
        }
      });
    }
  });
}

// ---------- Games ----------
function openGames(icon, title){
  const content = `
    <div class="section">
      <h2>Games (goofy + cute)</h2>
      <div class="btnRow">
        <button class="btn sage" id="tabMemory">Memory Match</button>
        <button class="btn blue" id="tabQuiz">Quiz</button>
        <button class="btn pink" id="tabCatch">Heart Catcher</button>
      </div>
    </div>

    <div class="section" id="paneMemory"></div>
    <div class="section hidden" id="paneQuiz"></div>
    <div class="section hidden" id="paneCatch"></div>
  `;

  openWindow({
    id:"games",
    title,
    icon,
    contentHTML: content,
    onMount:(win)=>{
      const body = $(".winBody", win);

      const panes = {
        memory: $("#paneMemory", body),
        quiz: $("#paneQuiz", body),
        catch: $("#paneCatch", body),
      };

      const show = (name)=>{
        Object.entries(panes).forEach(([k, el])=> el.classList.toggle("hidden", k!==name));
      };

      $("#tabMemory", body).addEventListener("click", ()=> show("memory"));
      $("#tabQuiz", body).addEventListener("click", ()=> show("quiz"));
      $("#tabCatch", body).addEventListener("click", ()=> show("catch"));

      mountMemory(panes.memory);
      mountQuiz(panes.quiz);
      mountCatch(panes.catch);
    }
  });
}

function mountMemory(root){
  const deck = [...VAL.memory].sort(()=>Math.random()-0.5);
  let revealed = [];
  let matched = new Set();

  root.innerHTML = `
    <h2>Memory Match</h2>
    <p class="muted">Match the pairs. If you win: you get 1 (one) forehead kiss voucher.</p>
    <div class="gameGrid" id="memGrid"></div>
    <div class="btnRow">
      <button class="btn sage" id="memReset">shuffle</button>
    </div>
  `;
  const grid = $("#memGrid", root);

  function render(){
    grid.innerHTML = "";
    deck.forEach((val, i)=>{
      const tile = document.createElement("div");
      tile.className = "cardTile";
      if(revealed.includes(i)) tile.classList.add("revealed");
      if(matched.has(i)) tile.classList.add("matched");
      tile.textContent = (revealed.includes(i) || matched.has(i)) ? val : "❔";
      tile.addEventListener("click", ()=> flip(i));
      grid.appendChild(tile);
    });
  }

  function flip(i){
    if(matched.has(i)) return;
    if(revealed.includes(i)) return;
    if(revealed.length === 2) return;

    revealed.push(i);
    render();

    if(revealed.length === 2){
      const [a,b] = revealed;
      if(deck[a] === deck[b]){
        matched.add(a); matched.add(b);
        revealed = [];
        render();
        if(matched.size === deck.length){
          fireConfetti(320);
          alert("You won 😭\nRedeem your forehead kiss with Zaim.");
        }
      } else {
        setTimeout(()=>{ revealed = []; render(); }, 650);
      }
    }
  }

  $("#memReset", root).addEventListener("click", ()=> location.reload()); // simplest stable shuffle
  render();
}

function mountQuiz(root){
  let idx = 0;
  let score = 0;

  root.innerHTML = `
    <h2>Quiz</h2>
    <p class="muted">Answer like you know your boyfriend 😌</p>
    <div class="receipt" id="qBox"></div>
    <div class="btnRow" id="qBtns"></div>
  `;

  const box = $("#qBox", root);
  const btns = $("#qBtns", root);

  function render(){
    const q = VAL.quiz[idx];
    box.innerHTML = `
      <div class="line"><span>Question</span><span>${idx+1} / ${VAL.quiz.length}</span></div>
      <hr class="sep">
      <div class="line"><span class="small">Q</span><span class="small" style="max-width:420px;text-align:right">${q.q}</span></div>
      <hr class="sep">
      <div class="line tot"><span>Score</span><span>${score}</span></div>
    `;
    btns.innerHTML = "";
    q.a.forEach((label, i)=>{
      const b = document.createElement("button");
      b.className = "btn";
      b.textContent = label;
      b.addEventListener("click", ()=>{
        if(i === q.correct){ score++; fireConfetti(80); }
        idx++;
        if(idx >= VAL.quiz.length){
          fireConfetti(300);
          alert(`Final score: ${score}/${VAL.quiz.length}\nPrize: one (1) chipotle date voucher 🤍`);
          idx = 0; score = 0;
        }
        render();
      });
      btns.appendChild(b);
    });
  }

  render();
}

function mountCatch(root){
  root.innerHTML = `
    <h2>Heart Catcher</h2>
    <p class="muted">Move the basket. Catch hearts. Missed hearts = emotional damage.</p>
    <div class="canvasWrap"><canvas id="catchCanvas"></canvas></div>
    <div class="btnRow">
      <button class="btn sage" id="catchStart">start</button>
      <span class="badge" id="catchScore">Score: 0</span>
    </div>
  `;

  const canvas = $("#catchCanvas", root);
  const scoreEl = $("#catchScore", root);
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(2, window.devicePixelRatio || 1);

  let running = false;
  let basketX = 0.5;
  let hearts = [];
  let score = 0;
  let last = performance.now();

  function resize(){
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
  }
  resize();
  window.addEventListener("resize", resize);

  function spawn(){
    hearts.push({ x: Math.random(), y: -0.05, v: 0.16 + Math.random()*0.18 });
  }

  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // basket
    const bw = canvas.width * 0.14;
    const bh = canvas.height * 0.08;
    const bx = basketX * (canvas.width - bw);
    const by = canvas.height - bh - 12*dpr;

    ctx.globalAlpha = 1;
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    roundRect(ctx, bx, by, bw, bh, 14*dpr);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.stroke();

    // hearts
    for(const h of hearts){
      const x = h.x * canvas.width;
      const y = h.y * canvas.height;
      drawHeart(ctx, x, y, 18*dpr);
    }

    scoreEl.textContent = `Score: ${score}`;
  }

  function step(now){
    if(!running) return;
    const dt = Math.min(0.03, (now-last)/1000);
    last = now;

    if(Math.random() < 0.06) spawn();

    // update hearts
    const bw = canvas.width * 0.14;
    const bh = canvas.height * 0.08;
    const bx = basketX * (canvas.width - bw);
    const by = canvas.height - bh - 12*dpr;

    hearts.forEach(h=> h.y += h.v * dt);
    const keep = [];
    for(const h of hearts){
      const x = h.x * canvas.width;
      const y = h.y * canvas.height;
      const caught = (x > bx && x < bx+bw && y > by && y < by+bh);
      if(caught){
        score += 1;
        fireConfetti(10);
      } else if(y < canvas.height + 40*dpr){
        keep.push(h);
      }
    }
    hearts = keep;

    draw();
    requestAnimationFrame(step);
  }

  function start(){
    running = true;
    hearts = [];
    score = 0;
    last = performance.now();
    draw();
    requestAnimationFrame(step);
  }

  $("#catchStart", root).addEventListener("click", start);

  // controls
  const setX = (clientX)=>{
    const rect = canvas.getBoundingClientRect();
    basketX = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  };
  canvas.addEventListener("mousemove", (e)=> setX(e.clientX));
  canvas.addEventListener("touchmove", (e)=>{ e.preventDefault(); setX(e.touches[0].clientX); }, {passive:false});
}

function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r);
  ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);
  ctx.arcTo(x,y,x+w,y,r);
  ctx.closePath();
}
function drawHeart(ctx, x, y, s){
  ctx.save();
  ctx.translate(x,y);
  ctx.fillStyle = "rgba(255,90,122,0.9)";
  ctx.beginPath();
  ctx.moveTo(0, s*0.25);
  ctx.bezierCurveTo(0, -s*0.45, -s*0.9, -s*0.35, -s*0.9, s*0.2);
  ctx.bezierCurveTo(-s*0.9, s*0.7, -s*0.2, s*0.95, 0, s*1.15);
  ctx.bezierCurveTo(s*0.2, s*0.95, s*0.9, s*0.7, s*0.9, s*0.2);
  ctx.bezierCurveTo(s*0.9, -s*0.35, 0, -s*0.45, 0, s*0.25);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// ---------- Nikkah finale ----------
function openNikkah(icon, title){
  const content = `
    <div class="section">
      <h2>Final reveal</h2>
      <p class="muted">You clicked it. So now you have to read it 😭</p>
      <div class="receipt">
        <div class="line"><span>Question</span><span>Will you be my Valentine?</span></div>
        <div class="line"><span>Answer</span><span>Yes obviously</span></div>
        <hr class="sep">
        <div class="line tot"><span>Next</span><span>Nikkah someday 🤍</span></div>
        <div class="small">InshaAllah. With amanah. With patience. With love.</div>
      </div>
      <div class="btnRow">
        <button class="btn pink" id="yesBtn">YES</button>
        <button class="btn" id="noBtn">no (cap)</button>
      </div>
    </div>

    <div class="section">
      <h2>Extras</h2>
      <p class="muted">Drop your video clips in <b>/media/videos</b> and link them in data.js if you want.</p>
      <div class="btnRow">
        <button class="btn sage" id="confettiBtn">confetti</button>
        <button class="btn blue" id="copyLine">copy a message</button>
      </div>
    </div>
  `;

  openWindow({
    id:"nikkah",
    title,
    icon,
    contentHTML: content,
    onMount:(win)=>{
      const body = $(".winBody", win);
      const noBtn = $("#noBtn", body);

      $("#yesBtn", body).addEventListener("click", ()=>{
        fireConfetti(520);
        alert("YAY 🤍\n\nInshaAllah someday.\n\n— Zaim (who loves you more)");
      });

      // playful moving no button
      noBtn.addEventListener("mouseenter", ()=>{
        const dx = (Math.random()*180 - 90);
        const dy = (Math.random()*90 - 45);
        noBtn.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      noBtn.addEventListener("click", ()=>{
        fireConfetti(120);
        alert("nice try princess 😭\nthere is no universe where I’m not choosing you.");
      });

      $("#confettiBtn", body).addEventListener("click", ()=> fireConfetti(420));

      $("#copyLine", body).addEventListener("click", ()=>{
        const msg = "Alina, you are my peace and my favorite chaos. Main tumse bohot zyada pyaar karta hoon. — Zaim";
        navigator.clipboard?.writeText(msg).then(()=>alert("Copied 🤍")).catch(()=>alert(msg));
      });
    }
  });
}

// ---------- Confetti ----------
function fireConfetti(count=220){
  const canvas = $("#confetti");
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(2, window.devicePixelRatio || 1);

  function resize(){
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = "100%";
    canvas.style.height = "100%";
  }
  resize();

  const colors = ["#ff5a7a","#ffb3c1","#90b0a4","#9eb0da","#ffffff"];
  const parts = [];
  for(let i=0;i<count;i++){
    parts.push({
      x: Math.random()*canvas.width,
      y: -20*dpr - Math.random()*canvas.height*0.2,
      vx: (Math.random()*2-1)*2.4*dpr,
      vy: (Math.random()*2+2.2)*2.8*dpr,
      r: (Math.random()*6+3)*dpr,
      rot: Math.random()*Math.PI,
      vr: (Math.random()*0.2-0.1),
      c: colors[Math.floor(Math.random()*colors.length)],
      life: 220 + Math.random()*80
    });
  }

  let frame = 0;
  function tick(){
    frame++;
    ctx.clearRect(0,0,canvas.width,canvas.height);

    for(const p of parts){
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04*dpr;
      p.rot += p.vr;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.c;
      ctx.globalAlpha = Math.max(0, Math.min(1, (p.life-frame)/120));
      ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r*0.65);
      ctx.restore();
    }

    if(frame < 240){
      requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0,0,canvas.width,canvas.height);
    }
  }
  tick();
  window.addEventListener("resize", resize, {once:true});
}

// ---------- Sound toggle (optional) ----------
function initSound(){
  const btn = $("#soundToggle");
  let on = store.get("soundOn", false);
  btn.style.opacity = on ? "1" : "0.7";

  btn.addEventListener("click", ()=>{
    on = !on;
    store.set("soundOn", on);
    btn.style.opacity = on ? "1" : "0.7";
    if(on){
      // Attempt to play optional audio track
      tryPlayMusic();
      toast("sound: on (optional)");
    } else {
      stopMusic();
      toast("sound: off");
    }
  });
}

let _audio = null;
function tryPlayMusic(){
  if(_audio) return;
  const track = VAL.music.tracks[0];
  _audio = new Audio(track.file);
  _audio.loop = true;
  _audio.volume = 0.25;
  _audio.play().catch(()=>{
    // ignore autoplay blocks; user can toggle again or interact
  });
}
function stopMusic(){
  try{
    if(_audio){ _audio.pause(); _audio = null; }
  } catch {}
}

// ---------- Boot ----------
function boot(){
  initStars();
  initClock();
  initLightbox();
  initSound();
  initUnlock();
}
boot();

document.addEventListener("DOMContentLoaded", () => {
  const b = document.getElementById("returnLockBtn");
  if (b) b.addEventListener("click", returnToLock);
});
