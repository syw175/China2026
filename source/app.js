// Design A — Warm editorial / travel magazine (mobile-first, sticky nav + scroll-spy).
function buildA(DATA_JSON, SHARED_JS){
const CSS = `
:root{
  --paper:#f6f0e4; --paper2:#efe7d6; --card:#fdfaf3; --ink:#2b2722;
  --muted:#8c8375; --rule:#d8cdb7; --terra:#b1462c; --jade:#3d6b5a; --gold:#a8792f;
  --serif:"Iowan Old Style","Palatino Linotype",Palatino,Georgia,"Songti SC","STSong",serif;
  --sans:-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,"PingFang SC","Microsoft YaHei",sans-serif;
  --nav-h:96px;
}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html{scroll-behavior:smooth}
html,body{margin:0;padding:0}
body{background:var(--paper);color:var(--ink);font-family:var(--serif);font-size:17px;line-height:1.55;
  -webkit-font-smoothing:antialiased;
  background-image:radial-gradient(rgba(120,100,60,.045) 1px,transparent 1px);background-size:4px 4px}
button{font-family:inherit;cursor:pointer;color:inherit}
a{color:var(--terra);text-decoration:none}
.zh{color:var(--muted);font-weight:400}
.eyebrow{font-family:var(--sans);font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--terra)}
.ic{width:1em;height:1em;vertical-align:-.13em}
.wrap{max-width:760px;margin:0 auto;padding:0 22px}

/* masthead (compact, scrolls away) */
.masthead{background:linear-gradient(180deg,var(--paper2),var(--paper));text-align:center;padding:11px 22px 12px}
.mast-kicker{font-family:var(--sans);font-size:9.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--muted)}
.mast-mid{max-width:760px;margin:0 auto}
.mast-mid h1{margin:5px 0 0;font-size:clamp(22px,5.4vw,36px);font-weight:700;letter-spacing:-.4px;line-height:1.06}
.mast-mid h1 .zh{font-size:.5em;letter-spacing:.12em;color:var(--ink);opacity:.5;margin-left:.35em;font-weight:400}
.mast-sub{font-family:var(--sans);font-size:9.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);margin-top:7px}
.mast-sub .dot{color:var(--terra);margin:0 6px}
/* language toggle (lives in the sticky bar) */
.lang-t{display:inline-flex;gap:1px;align-items:center;flex:none}
.lang-t button{border:0;background:transparent;font-family:var(--sans);font-size:10.5px;letter-spacing:.07em;
  text-transform:uppercase;color:var(--muted);padding:7px 8px;border-radius:4px;min-height:34px}
.lang-t button.on{color:var(--terra);font-weight:800;text-decoration:underline;text-underline-offset:3px}

/* sticky sub-nav: city tabs + lang + day pills */
.subnav{position:sticky;top:0;z-index:40;background:rgba(244,238,225,.9);
  backdrop-filter:saturate(180%) blur(14px);-webkit-backdrop-filter:saturate(180%) blur(14px);
  border-top:2px solid var(--ink);border-bottom:1px solid var(--rule);transition:box-shadow .2s}
.subnav.scrolled{box-shadow:0 10px 24px -16px rgba(43,39,34,.5)}
.subnav-in{max-width:760px;margin:0 auto}
.tabs-row{position:relative;display:flex;align-items:center;justify-content:space-between;gap:6px;
  padding:0 6px 0 10px;border-bottom:1px solid var(--rule)}
.city-tabs{display:flex;gap:2px;min-width:0;overflow-x:auto;scrollbar-width:none}
.city-tabs::-webkit-scrollbar{display:none}
.city-tabs button{flex:0 0 auto;border:0;background:transparent;font-family:var(--serif);font-size:16px;
  font-weight:600;color:var(--muted);padding:11px 12px;position:relative;line-height:1.1;min-height:44px}
.city-tabs button.on{color:var(--ink)}
.city-tabs button.on::after{content:"";position:absolute;left:10px;right:10px;bottom:-1px;height:2.5px;
  background:var(--terra);border-radius:2px}
.day-pills{display:flex;gap:8px;overflow-x:auto;padding:9px 14px;-webkit-overflow-scrolling:touch;scrollbar-width:none}
.day-pills::-webkit-scrollbar{display:none}
.pill-day{flex:0 0 auto;border:1px solid var(--rule);border-radius:24px;background:var(--card);
  padding:5px 14px 5px 11px;display:flex;align-items:center;gap:9px;min-height:42px;transition:.15s}
.pill-day .pd-n{font-family:var(--serif);font-size:19px;font-weight:700;line-height:1;font-style:italic}
.pill-day .pd-meta{display:flex;flex-direction:column;line-height:1.1;text-align:left}
.pill-day .pd-w{font-family:var(--sans);font-size:8.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);font-weight:700}
.pill-day .pd-d{font-family:var(--sans);font-size:12px;font-weight:600;color:var(--ink);letter-spacing:.01em}
.pill-day.on{background:var(--terra);border-color:var(--terra)}
.pill-day.on .pd-n,.pill-day.on .pd-d{color:#fff}
.pill-day.on .pd-w{color:rgba(255,255,255,.8)}

/* city cover */
.cover{text-align:center;padding:30px 22px 10px}
.cover .c-en{font-size:clamp(38px,10.5vw,64px);font-weight:700;line-height:.98;letter-spacing:-1px;margin:0;overflow-wrap:break-word}
.cover .c-zh{font-size:clamp(20px,5.4vw,30px);letter-spacing:.4em;color:var(--terra);margin:8px 0 0}
.cover .c-meta{font-family:var(--sans);font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);margin-top:14px}
.hotel-card{display:block;width:100%;text-align:left;max-width:520px;margin:18px auto 0;border:1px solid var(--rule);
  background:var(--card);border-radius:9px;padding:13px 15px;cursor:pointer;font-family:inherit;
  transition:border-color .15s,background .15s,box-shadow .15s}
.hotel-card:active{background:#faf4e8}
.hotel-card:hover{border-color:var(--terra);box-shadow:0 8px 22px -16px rgba(43,39,34,.5)}
.hc-label{font-family:var(--sans);font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:7px}
.hc-row{display:flex;align-items:center;justify-content:space-between;gap:12px}
.hc-name{font-size:18px;font-weight:600;line-height:1.2}
.hc-sub{font-family:var(--sans);font-size:12px;color:var(--muted);margin-top:5px;display:flex;align-items:center;gap:6px}
.hc-sub .ic{font-size:13px;color:var(--terra)}
.hc-go{flex:none;color:var(--terra);opacity:.6;display:flex;transition:transform .15s,opacity .15s}
.hc-go .ic{font-size:22px}
.hotel-card:hover .hc-go{opacity:1;transform:translateX(3px)}
.addr{font-family:var(--sans);font-size:13px;color:var(--terra);display:inline-flex;gap:5px;align-items:center}
.addr .ic{font-size:14px;flex:none;color:var(--terra)}

/* taste spread */
.taste{margin:32px 0 8px;padding:24px 0;border-top:2px solid var(--ink);border-bottom:1px solid var(--rule);
  background:linear-gradient(180deg,rgba(177,70,44,.05),transparent)}
.taste .t-head{text-align:center;margin-bottom:20px}
.taste .t-head h2{font-size:clamp(24px,6vw,32px);font-weight:700;margin:6px 0 0;font-style:italic}
.taste-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:2px 24px}
.dish{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid var(--rule)}
.dish .d-ic{flex:0 0 38px;height:38px;border-radius:50%;display:grid;place-items:center;color:#fff;
  background:radial-gradient(circle at 35% 30%,#c96a3f,#a8401f);font-size:18px}
.dish .d-n{font-size:16px;font-weight:600;line-height:1.2}
.dish .d-note{font-family:var(--sans);font-size:11.5px;color:var(--muted);margin-top:2px}

/* day sections */
.day{padding:28px 0 6px;border-top:1px solid var(--rule);scroll-margin-top:var(--nav-h)}
.day:first-of-type{border-top:0;padding-top:22px}
.day-head{margin:0 0 14px}
.dh-row{display:flex;align-items:center;gap:10px}
.dh-tag{font-family:var(--sans);font-weight:800;font-size:11px;letter-spacing:.06em;color:#fff;background:var(--ink);
  padding:3px 9px;border-radius:3px}
.day-head h3{font-size:24px;font-weight:700;margin:9px 0 0;font-style:italic;line-height:1.12}
.entry{display:grid;grid-template-columns:52px 1fr 22px;gap:14px;align-items:start;padding:15px 4px;
  border-top:1px solid var(--rule);cursor:pointer;position:relative;transition:background .15s;border-radius:6px}
.entry:first-of-type{border-top:0}
.entry:active{background:rgba(177,70,44,.06)}
.entry .e-time{font-family:var(--sans);font-size:13px;font-weight:700;color:var(--terra);letter-spacing:.02em;
  padding-top:3px;font-variant-numeric:tabular-nums}
.entry .e-time .e-type{display:block;font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);font-weight:700;margin-top:5px}
.entry .e-name{font-size:20px;font-weight:600;line-height:1.25;transition:color .15s}
.entry .e-hood{font-family:var(--sans);font-size:12px;letter-spacing:.04em;color:var(--muted);text-transform:uppercase;margin-top:3px}
.entry .e-foot{display:flex;align-items:center;gap:10px;margin-top:10px;flex-wrap:wrap}
.entry .e-go{align-self:center;color:var(--terra);opacity:.5;display:flex;justify-content:flex-end;
  transition:transform .15s,opacity .15s}
.entry .e-go .ic{font-size:19px}
.entry:hover .e-name{color:var(--terra)}
.entry:hover .e-go{opacity:1;transform:translateX(3px)}
.tag{font-family:var(--sans);font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;
  display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:2px}
.tag.book{color:#fff;background:var(--terra)}
.tag.book .ic{font-size:12px}
.day-end{text-align:center;padding:22px 0 8px;color:var(--muted);font-family:var(--sans);font-size:11px;
  letter-spacing:.2em;text-transform:uppercase}
.day-end::before{content:"";display:block;width:34px;height:1px;background:var(--rule);margin:0 auto 12px}

/* reader overlay */
.reader{position:fixed;inset:0;z-index:60;background:var(--paper);overflow-y:auto;
  transform:translateX(100%);transition:transform .36s cubic-bezier(.32,.72,0,1);
  background-image:radial-gradient(rgba(120,100,60,.045) 1px,transparent 1px);background-size:4px 4px}
.reader.open{transform:translateX(0)}
.rd-bar{position:sticky;top:0;background:rgba(246,240,228,.92);backdrop-filter:blur(10px);border-bottom:1px solid var(--rule);z-index:2}
.rd-bar-in{max-width:760px;margin:0 auto;padding:12px 22px;display:flex;align-items:center;justify-content:space-between}
.rd-close{border:0;background:transparent;font-family:var(--sans);font-size:12px;font-weight:700;letter-spacing:.09em;
  text-transform:uppercase;color:var(--ink);display:inline-flex;align-items:center;gap:6px;min-height:40px}
.rd-close .ic{font-size:15px;transform:rotate(180deg)}
.rd-hero{height:220px;display:flex;align-items:flex-end;color:#fff;position:relative;overflow:hidden}
.rd-hero .rh-mono{position:absolute;right:18px;top:14px;font-size:92px;opacity:.28}
.rd-hero .rh-in{max-width:760px;margin:0 auto;padding:20px 22px;width:100%;position:relative}
.rd-hero .rh-eye{font-family:var(--sans);font-size:11px;letter-spacing:.18em;text-transform:uppercase;opacity:.92}
.rd-hero h1{font-size:clamp(28px,7vw,42px);font-weight:700;margin:8px 0 0;line-height:1.06;text-shadow:0 2px 16px rgba(0,0,0,.28)}
.rd-hero h1 .zh{color:rgba(255,255,255,.85)}
.rd-body{max-width:640px;margin:0 auto;padding:24px 22px 80px}
.rd-meta{display:flex;gap:10px;flex-wrap:wrap;align-items:center;padding-bottom:18px;margin-bottom:8px;border-bottom:1px solid var(--rule)}
.rd-meta .m-item{font-family:var(--sans);font-size:12px;font-weight:600;letter-spacing:.03em;color:var(--muted);display:inline-flex;align-items:center;gap:5px}
.rd-body p.lead{font-size:19px;line-height:1.6}
.rd-body p.lead::first-letter{font-size:3.1em;float:left;line-height:.72;padding:6px 10px 0 0;font-weight:700;color:var(--terra)}
.rd-addr{margin:20px 0;padding:14px 16px;background:var(--card);border:1px solid var(--rule);border-radius:4px}
.rd-addr .ra-label{font-family:var(--sans);font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:6px}
.rd-addr .addr{font-size:15px}
.around{margin-top:32px;padding-top:12px;border-top:2px solid var(--ink)}
.around h2{font-size:23px;font-weight:700;font-style:italic;margin:14px 0 2px}
.around .a-hint{font-family:var(--sans);font-size:13px;color:var(--muted);margin:0 0 14px}
.a-item{display:flex;gap:13px;padding:13px 2px;border-bottom:1px solid var(--rule);align-items:center;
  text-decoration:none;color:inherit;cursor:pointer;border-radius:6px;transition:background .15s}
.a-item:last-child{border-bottom:0}
.a-item:active{background:rgba(177,70,44,.06)}
.a-item .a-ic{flex:0 0 24px;color:var(--jade);font-size:18px;line-height:1;align-self:flex-start;padding-top:2px}
.a-item .a-main{flex:1;min-width:0}
.a-item .a-n{display:block;font-size:17px;font-weight:600;color:var(--ink)}
.a-item .a-note{display:block;font-family:var(--sans);font-size:12px;color:var(--muted);margin-top:2px}
.a-nav{flex:none;display:inline-flex;align-items:center;gap:6px;font-family:var(--sans);font-size:11px;
  font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--terra);
  border:1px solid var(--terra);border-radius:22px;padding:7px 12px;white-space:nowrap;transition:.15s}
.a-nav .ic{font-size:14px}
.a-item:hover .a-nav,.a-item:active .a-nav{background:var(--terra);color:#fff}

/* hotel drill-in */
.hot-actions{display:flex;flex-direction:column;gap:10px;margin:2px 0 8px}
.hot-btn{display:flex;align-items:center;gap:13px;padding:13px 15px;border:1px solid var(--rule);border-radius:7px;
  background:var(--card);font-family:var(--sans);font-size:15px;color:var(--ink);transition:border-color .15s,background .15s}
.hot-btn:hover{border-color:var(--terra)} .hot-btn:active{background:#faf4e8}
.hot-btn .ic{font-size:20px;color:var(--terra);flex:none}
.hot-btn .hb-k{display:block;font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);margin-bottom:2px;font-weight:700}
.hot-btn .hb-v{font-weight:600}
.hot-block{padding:16px 0;border-top:1px solid var(--rule)}
.hot-block:first-of-type{border-top:0}
.hot-block .hb-h{font-family:var(--sans);font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;
  color:var(--ink);display:flex;align-items:center;gap:8px}
.hot-block .hb-h .ic{font-size:16px;color:var(--terra)}
.hot-block p{font-size:16px;margin:9px 0 0;line-height:1.55}
.hot-notes{margin-top:10px;padding-top:14px;border-top:2px solid var(--ink)}
.hot-notes .hn-list{margin-top:10px}
.hot-note{display:flex;gap:10px;align-items:baseline;font-family:var(--sans);font-size:14px;padding:9px 0;color:var(--ink);border-bottom:1px solid var(--rule)}
.hot-note:last-child{border-bottom:0}
.hot-note::before{content:"◆";color:var(--terra);font-size:8px;flex:none;position:relative;top:-1px}

@media (max-width:560px){ .taste-grid{grid-template-columns:1fr} .entry{grid-template-columns:48px 1fr 20px;gap:12px} }
@media (prefers-reduced-motion:reduce){ html{scroll-behavior:auto} .reader{transition:none} }
`;

const JS = SHARED_JS + `
let itemMap={};
let daySections=[], dayPills=[], lastActive=-1, spyLock=0;
const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
function heroGrad(ty){
  return {activity:'linear-gradient(135deg,#7a5a86,#4a3358)',meal:'linear-gradient(135deg,#c96a3f,#8f2f1c)',
    sight:'linear-gradient(135deg,#3f6b57,#274a3b)',transit:'linear-gradient(135deg,#5b6b7a,#33414d)',
    admin:'linear-gradient(135deg,#6b6257,#433c33)',shopping:'linear-gradient(135deg,#a8792f,#6f4c1a)',
    wellness:'linear-gradient(135deg,#4f7d78,#2e504c)',show:'linear-gradient(135deg,#8a4a5e,#57293a)',
    craft:'linear-gradient(135deg,#5a6b9a,#333f63)',rest:'linear-gradient(135deg,#7d7461,#4e4738)'}[ty];
}
function nearbyHTML(list){
  return (list||[]).map(n=>'<a class="a-item" href="'+esc(n.address.mapUrl)+'" target="_blank" rel="noopener">'
    +'<span class="a-ic">'+icon(n.type==='restaurant'?'meal':n.type)+'</span>'
    +'<span class="a-main"><span class="a-n">'+nm(n.name)+'</span>'
    +'<span class="a-note">'+cat(n.type)+' · '+nm(n.note)+'</span></span>'
    +'<span class="a-nav">'+icon('nav')+'<span class="a-nav-t">'+t('directions')+'</span></span></a>').join('');
}
const subnav = ()=>document.getElementById('subnav');

function renderMasthead(){
  const h1=document.querySelector('.mast-mid h1');
  h1.innerHTML = state.lang==='zh' ? esc(TRIP.title.zh) : (esc(TRIP.title.en)+'<span class="zh">'+esc(TRIP.title.zh)+'</span>');
  document.querySelector('.mast-sub').innerHTML = esc(TRIP.dates[state.lang]) + '<span class="dot">◆</span>' + t('subtitle');
  document.querySelectorAll('.lang-t button').forEach(b=>b.classList.toggle('on',b.dataset.lang===state.lang));
}
function renderNav(){
  const c=city();
  document.getElementById('city-tabs').innerHTML = TRIP.cities.map((ct,i)=>
    '<button data-city="'+i+'" class="'+(i===state.city?'on':'')+'">'+nmText(ct.name)+'</button>').join('');
  document.getElementById('day-pills').innerHTML = c.days.map((d,i)=>
    '<button class="pill-day" data-day="'+i+'"><span class="pd-n">'+(i+1)+'</span>'
    +'<span class="pd-meta"><span class="pd-w">'+esc(d.dayLabel)+'</span><span class="pd-d">'+esc(d.date)+'</span></span></button>').join('');
  dayPills=[...document.querySelectorAll('.pill-day')];
}
function renderBody(){
  const c=city(); itemMap={};
  let h='<section class="cover">'
    +'<h1 class="c-en">'+esc(state.lang==='zh'?c.name.zh:c.name.en)+'</h1>'
    +(state.lang==='zh'?'':'<div class="c-zh">'+esc(c.name.zh)+'</div>')
    +'<div class="c-meta">'+esc(c.dateRange)+'</div>'
    +'<button class="hotel-card" data-hotel><span class="hc-label">'+t('hotel')+'</span>'
      +'<div class="hc-row"><div><div class="hc-name">'+nm(c.hotel.name)+'</div>'
      +'<div class="hc-sub">'+icon('cal')+t('checkIn')+' '+esc(c.hotel.checkIn.time)+' · '+t('checkOut')+' '+esc(c.hotel.checkOut.time)+'</div></div>'
      +'<span class="hc-go">'+icon('chev')+'</span></div></button></section>';
  h+='<section class="taste"><div class="wrap"><div class="t-head"><div class="eyebrow">'+t('mustEat')+'</div>'
    +'<h2>'+t('mustEatTitle')+' '+nmText(c.name)+'</h2></div><div class="taste-grid">'
    +c.mustEats.map(m=>'<div class="dish"><div class="d-ic">'+icon('meal')+'</div><div><div class="d-n">'+nm(m.name)+'</div><div class="d-note">'+nm(m.note)+'</div></div></div>').join('')
    +'</div></div></section>';
  h+='<div class="wrap">';
  c.days.forEach((d,di)=>{
    const dayTag = state.lang==='zh' ? ('第'+(di+1)+'天') : ('Day '+(di+1));
    h+='<section class="day" data-dayidx="'+di+'"><div class="day-head"><div class="dh-row"><span class="dh-tag">'
      +dayTag+'</span><span class="eyebrow">'+esc(d.date)+' · '+esc(d.dayLabel)+'</span></div>'
      +'<h3>'+nm(d.title)+'</h3></div>';
    h+=d.items.map(it=>{ itemMap[it.id]=it;
      const book=it.bookingRequired?'<span class="tag book">'+icon('cal')+t('booking')+'</span>':'';
      return '<article class="entry" data-item="'+it.id+'"><div class="e-time">'+esc(it.time).replace(/–/g,'–<wbr>')+'<span class="e-type">'+tp(it.type)+'</span></div>'
        +'<div class="e-main"><div class="e-name">'+nm(it.name)+'</div><div class="e-hood">'+nmText(it.neighborhood)+'</div>'
        +(book?'<div class="e-foot">'+book+'</div>':'')+'</div>'
        +'<span class="e-go">'+icon('chev')+'</span></article>';
    }).join('');
    h+='</section>';
  });
  const endTxt = state.lang==='zh' ? (nmText(c.name)+' · 行程圆满') : ('End of '+nmText(c.name));
  h+='<div class="day-end">'+endTxt+'</div></div>';
  document.getElementById('main').innerHTML=h;
  daySections=[...document.querySelectorAll('.day')];
}
function measureNav(){ document.documentElement.style.setProperty('--nav-h', (subnav().offsetHeight+4)+'px'); }

function setActivePill(i){
  if(i===lastActive) return; lastActive=i;
  dayPills.forEach((p,k)=>p.classList.toggle('on',k===i));
  const p=dayPills[i], sc=document.getElementById('day-pills');
  if(p&&sc){ sc.scrollTo({left:Math.max(0,p.offsetLeft-(sc.clientWidth-p.offsetWidth)/2), behavior:reduce?'auto':'smooth'}); }
}
function updateSpy(){
  if(!daySections.length) return;
  const navH=subnav().offsetHeight, threshold=navH+40;
  let active=0;
  for(let i=0;i<daySections.length;i++){ if(daySections[i].getBoundingClientRect().top<=threshold) active=i; }
  // near page bottom: the last (often short) day can't reach the top, so pin it active
  if(window.innerHeight+window.scrollY >= document.documentElement.scrollHeight-2){ active=daySections.length-1; }
  setActivePill(active);
}
let ticking=false;
function onScroll(){
  subnav().classList.toggle('scrolled', window.scrollY>6);
  if(spyLock && Date.now()<spyLock) return;
  if(!ticking){ requestAnimationFrame(()=>{ updateSpy(); ticking=false; }); ticking=true; }
}
function scrollToDay(i){
  const s=daySections[i]; if(!s) return;
  setActivePill(i); spyLock=Date.now()+ (reduce?0:520);
  const y=s.getBoundingClientRect().top+window.scrollY - subnav().offsetHeight - 6;
  window.scrollTo({top:Math.max(0,y), behavior:reduce?'auto':'smooth'});
}

function openHotel(){
  const c=city(), ho=c.hotel; state.hotel=true; state.detail=null;
  const tel='tel:'+ho.phone.replace(/[^+0-9]/g,'');
  const notes=(ho.notes||[]).map(n=>'<div class="hot-note">'+nm(n)+'</div>').join('');
  document.getElementById('reader-body').innerHTML=
    '<div class="rd-hero" style="background:linear-gradient(135deg,#c88a3c,#93571f)"><span class="rh-mono">'+icon('pin')+'</span>'
      +'<div class="rh-in"><div class="rh-eye">'+nmText(c.name)+' · '+t('stay')+'</div><h1>'+nm(ho.name)+'</h1></div></div>'
    +'<div class="rd-body">'
      +'<div class="rd-meta"><span class="m-item">'+icon('cal')+t('checkIn')+' '+esc(ho.checkIn.time)+'</span>'
        +'<span class="m-item">'+icon('clock')+t('checkOut')+' '+esc(ho.checkOut.time)+'</span>'
        +'<span class="m-item">'+t('confirmation')+' '+esc(ho.confirmation)+'</span></div>'
      +'<div class="hot-actions">'
        +'<a class="hot-btn" href="'+esc(tel)+'">'+icon('phone')+'<span><span class="hb-k">'+t('phone')+'</span><span class="hb-v">'+esc(ho.phone)+'</span></span></a>'
        +'<a class="hot-btn" href="'+esc(ho.address.mapUrl)+'" target="_blank" rel="noopener">'+icon('pin')+'<span><span class="hb-k">'+t('address')+'</span><span class="hb-v">'+esc(ho.address.text)+'</span></span></a>'
      +'</div>'
      +'<div class="hot-block"><div class="hb-h">'+icon('cal')+t('checkIn')+' · '+esc(ho.checkIn.time)+'</div><p>'+nm(ho.checkIn.note)+'</p></div>'
      +'<div class="hot-block"><div class="hb-h">'+icon('clock')+t('checkOut')+' · '+esc(ho.checkOut.time)+'</div><p>'+nm(ho.checkOut.note)+'</p></div>'
      +'<div class="hot-block"><div class="hb-h">'+icon('wifi')+t('wifi')+'</div><p>'+nm(ho.wifi)+'</p></div>'
      +'<div class="hot-notes"><div class="eyebrow">'+t('goodToKnow')+'</div><div class="hn-list">'+notes+'</div></div>'
      +(ho.nearby&&ho.nearby.length?'<div class="around"><div class="eyebrow">'+t('nearby')+'</div><h2>'+t('nearbyHotel')+'</h2>'+nearbyHTML(ho.nearby)+'</div>':'')
    +'</div>';
  const r=document.getElementById('reader'); r.classList.add('open'); r.scrollTop=0; document.body.style.overflow='hidden';
}
function openDetail(id){
  const it=itemMap[id]; if(!it) return; state.detail=id; state.hotel=false;
  const book=it.bookingRequired?'<span class="m-item" style="color:var(--terra)">'+icon('cal')+t('bookingRequired')+'</span>'
    :'<span class="m-item">'+t('noBooking')+'</span>';
  const near=nearbyHTML(it.nearby);
  document.getElementById('reader-body').innerHTML=
    '<div class="rd-hero" style="background:'+heroGrad(it.type)+'"><span class="rh-mono">'+icon(it.type)+'</span>'
      +'<div class="rh-in"><div class="rh-eye">'+nmText(city().name)+' · '+tp(it.type)+'</div><h1>'+nm(it.name)+'</h1></div></div>'
    +'<div class="rd-body"><div class="rd-meta"><span class="m-item">'+icon('clock')+esc(it.time)+'</span>'
      +'<span class="m-item">'+icon('pin')+nmText(it.neighborhood)+'</span>'+book+'</div>'
      +'<p class="lead">'+nm(it.desc)+'</p>'
      +'<div class="rd-addr"><span class="ra-label">'+t('address')+'</span>'+addrLink(it.address)+'</div>'
      +(near?'<div class="around"><div class="eyebrow">'+t('nearby')+'</div><h2>'+t('nearbyHint')+'</h2>'+near+'</div>':'')+'</div>';
  const r=document.getElementById('reader'); r.classList.add('open'); r.scrollTop=0;
  document.body.style.overflow='hidden';
}
function closeDetail(){ state.detail=null; state.hotel=false; document.getElementById('reader').classList.remove('open'); document.body.style.overflow=''; }

function render(){ renderMasthead(); renderNav(); renderBody(); requestAnimationFrame(()=>{ measureNav(); lastActive=-1; updateSpy(); }); }
function switchCity(i){
  state.city=i; render();
  requestAnimationFrame(()=>{
    const body=document.getElementById('main');
    const y=body.getBoundingClientRect().top+window.scrollY - subnav().offsetHeight - 6;
    window.scrollTo({top:Math.max(0,y), behavior:'auto'});
    spyLock=0; lastActive=-1; updateSpy();
  });
}

document.addEventListener('click',e=>{
  const l=e.target.closest('[data-lang]'); if(l){ state.lang=l.dataset.lang; document.documentElement.lang=state.lang; const y=window.scrollY; const wasHotel=state.hotel, wasItem=state.detail; render(); requestAnimationFrame(()=>window.scrollTo({top:y,behavior:'auto'})); if(wasHotel) openHotel(); else if(wasItem) openDetail(wasItem); return; }
  const c=e.target.closest('[data-city]'); if(c){ switchCity(+c.dataset.city); return; }
  const d=e.target.closest('[data-day]'); if(d){ scrollToDay(+d.dataset.day); return; }
  const hc=e.target.closest('[data-hotel]'); if(hc){ openHotel(); return; }
  const it=e.target.closest('[data-item]'); if(it){ openDetail(it.dataset.item); return; }
  if(e.target.closest('#reader-close')){ closeDetail(); return; }
});
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&state.detail) closeDetail(); });
window.addEventListener('scroll',onScroll,{passive:true});
window.addEventListener('resize',()=>{ measureNav(); });
render();
`;

return `<title>Family China Trip · 家庭中国之旅</title>
<meta name="theme-color" content="#efe7d6">
<style>${CSS}</style>
<div id="app">
  <header class="masthead">
    <div class="mast-mid">
      <div class="mast-kicker">The Travel Companion · 旅行手册</div>
      <h1></h1>
      <div class="mast-sub"></div>
    </div>
  </header>
  <nav class="subnav" id="subnav"><div class="subnav-in">
    <div class="tabs-row">
      <div class="city-tabs" id="city-tabs"></div>
      <span class="lang-t"><button data-lang="en">EN</button><button data-lang="zh">中文</button></span>
    </div>
    <div class="day-pills" id="day-pills"></div>
  </div></nav>
  <main id="main"></main>
</div>
<div class="reader" id="reader" role="dialog" aria-modal="true">
  <div class="rd-bar"><div class="rd-bar-in">
    <button class="rd-close" id="reader-close"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5.5l6.5 6.5L9 18.5"/></svg><span>Close · 关闭</span></button>
    <span class="eyebrow">Field Notes · 手记</span>
  </div></div>
  <div id="reader-body"></div>
</div>
<script>const TRIP=${DATA_JSON.TRIP};const I18N=${DATA_JSON.I18N};\n${JS}</script>`;
}
module.exports = { buildA };
