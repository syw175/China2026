// A1 redesign — one continuous city document with compact stacked navigation rails.
// Consumes TRIP / I18N from source/data.js as-is; helpers come from SHARED_JS (source/shared.js).
function buildA(DATA_JSON, SHARED_JS){
const CSS = `
@font-face{font-family:'Space Grotesk';src:url('fonts/SpaceGrotesk.woff2') format('woff2');font-weight:300 700;font-style:normal;font-display:swap}
@font-face{font-family:'IBM Plex Sans';src:url('fonts/IBMPlexSans.woff2') format('woff2');font-weight:100 700;font-style:normal;font-display:swap}
@font-face{font-family:'IBM Plex Mono';src:url('fonts/IBMPlexMono.woff2') format('woff2');font-weight:500;font-style:normal;font-display:swap}

:root{
  --ink:oklch(18% .01 90);
  --page:oklch(90% .01 70);
  --paper:oklch(96% .012 70);
  --sheet:oklch(96% .01 70);
  --near:oklch(98% .01 70);
  --near2:oklch(96% .01 70);
  --muted:oklch(45% .01 70);
  --muted2:oklch(48% .01 70);
  --muted3:oklch(50% .01 70);
  --hair:oklch(80% .01 70);
  --hair2:oklch(75% .01 70);
  --body:oklch(30% .01 70);
  --body2:oklch(25% .01 70);
  --accent:oklch(58% .16 35);
  --stripe:repeating-linear-gradient(90deg, oklch(84% .04 40), oklch(84% .04 40) 3px, oklch(89% .03 40) 3px, oklch(89% .03 40) 6px);
  --grotesk:'Space Grotesk',system-ui,sans-serif;
  --sans:'IBM Plex Sans',system-ui,-apple-system,"PingFang SC","Microsoft YaHei",sans-serif;
  --mono:'IBM Plex Mono',ui-monospace,"SFMono-Regular",Menlo,monospace;
}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{margin:0;padding:0}
body{background:var(--page);font-family:var(--sans);color:var(--ink)}
a{color:inherit;text-decoration:none}
button{font-family:inherit;cursor:pointer;color:inherit}
h1,h2,h3,h4{margin:0;font:inherit} /* headings are semantic; classes control appearance */
.gr-scroll::-webkit-scrollbar{display:none}
.gr-scroll{scrollbar-width:none}

/* visible keyboard focus (ink stays legible on paper and on accent fills) */
:focus-visible{outline:2px solid var(--ink);outline-offset:2px}
/* press feedback (tap-highlight is disabled, so restore a "tap registered" cue) */
.gr-city,.gr-day,.gr-tab,.gr-stop,.gr-maprow,.gr-nearrow,.gr-addr,.gr-doc,.gr-tel,.gr-lang,.gr-close{transition:background .12s ease,opacity .12s ease,color .12s ease}
.gr-city:active,.gr-day:active,.gr-tab:active,.gr-stop:active,.gr-maprow:active,.gr-nearrow:active,.gr-addr:active,.gr-doc:active,.gr-tel:active,.gr-lang:active,.gr-close:active{opacity:.6}
/* hover feedback, real-hover devices only (avoids sticky hover on touch) */
@media (hover:hover){
  .gr-city:not(.on):hover,.gr-tab:not(.on):hover{background:oklch(92% .012 70)}
  .gr-day:not(.on):hover{background:oklch(93% .012 70)}
  .gr-stop:hover,.gr-maprow:hover,.gr-nearrow:hover{background:oklch(95% .012 70)}
  .gr-addr:hover,.gr-doc:hover,.gr-tel:hover{text-decoration:underline}
}
/* hero photos fade in as they decode */
.gr-photo-img{opacity:0;transition:opacity .35s ease}
@media (prefers-reduced-motion:reduce){ *{animation:none!important;transition:none!important} .gr-photo-img{opacity:1} }

.gr-frame{width:100vw;height:100vh;height:100dvh;background:var(--paper);display:flex;flex-direction:column;
  overflow:hidden;position:relative}
@media (min-width:640px){
  .gr-frame{max-width:460px;height:min(920px,94vh);margin:3vh auto;
    box-shadow:0 30px 80px -30px oklch(20% .01 80 / .55);border:1px solid var(--ink)}
}

/* A1 header: the trip line scrolls away; the city line stays in reach. */
.gr-tripbar{display:flex;align-items:center;justify-content:space-between;gap:10px;
  min-height:calc(34px + env(safe-area-inset-top, 0px));padding:env(safe-area-inset-top, 0px) 10px 0;
  border-bottom:1px solid var(--hair2);background:var(--paper)}
.gr-title{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
  font:600 13px/1 var(--grotesk);letter-spacing:-.01em}
.gr-dates{flex:none;font:500 10px/1 var(--mono);color:var(--muted);white-space:nowrap;letter-spacing:.01em}
.gr-cityrail{position:sticky;top:0;height:44px;z-index:8;display:grid;
  grid-template-columns:repeat(3,minmax(0,1fr)) 44px;align-items:stretch;
  border-bottom:1px solid var(--hair2);background:color-mix(in oklch,var(--paper) 94%,transparent);
  -webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px)}
.gr-city{min-width:0;padding:0 3px;border:0;border-bottom:3px solid transparent;background:transparent;
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:center;
  font:600 12px/1 var(--grotesk);letter-spacing:-.01em}
.gr-city.on{border-bottom-color:var(--accent);color:var(--ink)}
.gr-lang{width:44px;height:44px;padding:0;border:0;border-left:1px solid var(--hair2);
  background:transparent;color:var(--muted);font:600 10px/1 var(--mono);letter-spacing:.04em}

/* One continuous current-city document. */
.gr-scroll{flex:1 1 auto;min-height:0;overflow-y:auto;overscroll-behavior:contain;position:relative;padding:0}
.gr-section{position:relative;padding:20px;scroll-margin-top:44px}
.gr-section--days{padding:0 20px 34px;border-top:2px solid var(--ink)}
.gr-section--map,.gr-section--hotel{min-height:calc(100% - 44px);padding-top:28px;border-top:2px solid var(--ink)}

/* photo frames */
.gr-photo{position:relative;width:100%;background:var(--stripe);border:2px solid var(--ink)}
.gr-photo--1610{aspect-ratio:16/10}
.gr-photo--169{aspect-ratio:16/9}
.gr-photo--stop{background:var(--near2)}
.gr-photo-cap{position:absolute;left:10px;bottom:10px;font:500 11px/1.4 var(--mono);color:var(--ink);
  background:oklch(96% .01 70 / .9);padding:5px 8px}
.gr-photo-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;display:block}

/* generic section header */
.gr-sechead{font:700 13px/1 var(--grotesk);letter-spacing:.02em;text-transform:uppercase;
  border-bottom:2px solid var(--ink);padding-bottom:10px}

/* city tab */
.gr-cityname{font:700 40px/1 var(--grotesk);letter-spacing:-.02em;margin-top:18px}
.gr-sub{font:400 15px/1.3 var(--sans);color:var(--muted);margin-top:4px}
.gr-stats{margin-top:18px;display:grid;grid-template-columns:1fr 1fr 1fr;border-top:2px solid var(--ink)}
.gr-stat{padding:12px 10px}
.gr-stat:first-child{padding-left:0}
.gr-stat:last-child{padding-right:0}
.gr-stat:not(:last-child){border-right:1px solid var(--hair2)}
.gr-stat-k{font:600 9px/1 var(--mono);letter-spacing:.06em;color:var(--muted)}
.gr-stat-v{font:600 15px/1.3 var(--grotesk);margin-top:6px}
.gr-eats{display:grid;grid-template-columns:1fr 1fr}
.gr-eat{padding:12px 10px 12px 0;border-bottom:1px solid var(--hair)}
.gr-eat-n{font:600 13px/1.3 var(--grotesk)}
.gr-eat-note{font:400 11px/1.4 var(--sans);color:var(--muted2);margin-top:3px}
.gr-taste{margin-top:28px}

/* contextual day rail + vertically stacked days */
.gr-dayrail{position:sticky;top:44px;height:32px;z-index:7;display:grid;grid-template-columns:repeat(4,1fr);
  margin:0 -20px;background:color-mix(in oklch,var(--paper) 88%,var(--hair));
  border-bottom:1px solid var(--hair2);box-shadow:0 5px 12px -12px var(--ink)}
.gr-day{min-width:0;height:32px;padding:0 1px;border:0;border-bottom:2px solid transparent;
  background:transparent;color:var(--muted);white-space:nowrap;text-align:center;
  font:600 10px/1 var(--mono);letter-spacing:-.02em}
.gr-day.on{border-bottom-color:var(--accent);color:var(--ink)}
@media (max-width:360px){.gr-day{font-size:9px;letter-spacing:-.04em}}
.gr-dayblock{padding-top:22px;scroll-margin-top:76px}
.gr-dayblock + .gr-dayblock{margin-top:34px;padding-top:32px;border-top:1px solid var(--hair2)}
.gr-day-kicker{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;
  color:var(--muted);font:600 10px/1 var(--mono);letter-spacing:.05em;text-transform:uppercase}
.gr-day-index{color:var(--accent)}
.gr-today{display:inline-block;font:600 9px/1 var(--mono);letter-spacing:.05em;
  background:var(--accent);color:oklch(98% .01 70);padding:5px 8px}
.gr-dayhero{margin-top:0}
.gr-today + .gr-dayhero{margin-top:10px}
.gr-daytitle{font:700 24px/1.2 var(--grotesk);margin-top:14px;letter-spacing:-.01em}
.gr-stops{margin-top:20px;display:flex;flex-direction:column}
.gr-stop{display:grid;grid-template-columns:50px 1fr;text-align:left;background:none;border:none;
  border-top:1px solid var(--hair);padding:14px 0}
.gr-stop-time{font:600 11px/1.4 var(--mono);color:var(--accent);padding-top:2px}
.gr-stop-main{min-width:0}
.gr-stop-type{font:600 9px/1 var(--mono);letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.gr-stop-name{font:700 15px/1.3 var(--grotesk);margin-top:5px}
.gr-stop-sub{font:400 12px/1.3 var(--sans);color:var(--muted);margin-top:2px}
.gr-stop-hood{font:500 11px/1.4 var(--mono);color:var(--muted3);margin-top:6px}
.gr-chip{display:inline-block;font:600 9px/1 var(--mono);letter-spacing:.03em;
  background:var(--ink);color:var(--near2);padding:4px 7px}
.gr-stop .gr-chip{margin-top:8px}

/* map tab */
.gr-h1{font:700 24px/1.2 var(--grotesk)}
.gr-maphint{font:500 11px/1.5 var(--mono);color:var(--muted);margin-top:4px}
.gr-maplist{margin-top:6px;display:flex;flex-direction:column}
.gr-maprow{display:grid;grid-template-columns:1fr auto;align-items:center;gap:10px;padding:12px 0;
  border-bottom:1px solid var(--hair)}
.gr-maprow-n{font:600 13px/1.3 var(--grotesk)}
.gr-maprow-a{font:500 11px/1.4 var(--mono);color:var(--muted3);margin-top:2px;
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.gr-maprow-arrow{font:700 15px/1 var(--grotesk);color:var(--accent)}

/* stay tab */
.gr-hotelname{font:700 26px/1.2 var(--grotesk);margin-top:16px}
.gr-addr{display:flex;gap:8px;align-items:center;margin-top:12px;font:500 12px/1.4 var(--mono);color:var(--accent)}
.gr-doc{color:var(--accent);font-weight:600;white-space:nowrap}
.gr-facts{margin-top:20px;display:grid;grid-template-columns:1fr 1fr;
  border-top:2px solid var(--ink);border-left:2px solid var(--ink)}
.gr-fact{padding:12px;border-right:2px solid var(--ink)}
.gr-fact.row1{border-bottom:1px solid var(--hair)}
.gr-fact-k{font:600 9px/1 var(--mono);letter-spacing:.05em;color:var(--muted)}
.gr-fact-v{font:700 16px/1.3 var(--grotesk);margin-top:6px}
.gr-fact-v.sm{font:600 12px/1.3 var(--sans)}
.gr-conf{margin-top:16px;font:500 11px/1.5 var(--mono);color:var(--muted)}
.gr-note{margin-top:8px;font:400 13px/1.5 var(--sans);color:var(--body)}
.gr-goodtoknow,.gr-nearby-sec{margin-top:24px}
.gr-notes{margin:10px 0 0;padding-left:16px;font:400 13px/1.6 var(--sans);color:var(--body)}
.gr-nearby{display:flex;flex-direction:column}
.gr-nearrow{display:block;padding:12px 0;border-bottom:1px solid var(--hair)}
.gr-nearrow-t{font:600 9px/1 var(--mono);letter-spacing:.04em;text-transform:uppercase;color:var(--muted3)}
.gr-nearrow-n{font:600 13px/1.3 var(--grotesk)}
.gr-nearrow-n.lg{font-size:14px;margin-top:4px}
.gr-nearrow-note{font:400 11px/1.4 var(--sans);color:var(--muted2);margin-top:3px}

/* bottom tab bar */
.gr-tabs{flex:none;display:grid;grid-template-columns:repeat(4,1fr);
  border-top:2px solid var(--ink);background:var(--paper);padding-bottom:env(safe-area-inset-bottom, 0px)}
.gr-tab{display:flex;align-items:center;justify-content:center;min-height:44px;padding:0 2px;background:transparent;border:none;
  font:600 11px/1 var(--mono);letter-spacing:.03em;color:var(--ink);white-space:nowrap}
.gr-tab.on{background:var(--ink);color:oklch(98% .01 70)}

/* stop overlay */
.gr-overlay{position:absolute;inset:0;background:oklch(15% .01 90 / .6);
  display:flex;align-items:flex-end;z-index:10}
.gr-sheet{width:100%;height:82%;background:var(--sheet);border-top:3px solid var(--ink);
  display:flex;flex-direction:column;overflow:hidden}
.gr-close-row{flex:none;display:flex;justify-content:flex-end;
  padding:calc(12px + env(safe-area-inset-top, 0px)) calc(12px + env(safe-area-inset-right, 0px)) 12px 20px}
.gr-close{min-width:44px;min-height:44px;background:var(--ink);color:var(--near2);border:none;font:700 13px/1 var(--mono);padding:12px 14px}
.gr-sheet-body{flex:1 1 auto;min-height:0;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;
  padding:0 20px calc(30px + env(safe-area-inset-bottom, 0px))}
.gr-sheet-body .gr-photo{margin-top:14px}
.gr-stopmeta{font:600 10px/1 var(--mono);letter-spacing:.05em;text-transform:uppercase;
  color:var(--muted);margin-top:16px}
.gr-stopname{font:700 24px/1.2 var(--grotesk);margin-top:6px}
.gr-stopname-sub{font:400 15px/1.3 var(--sans);color:var(--muted);margin-top:4px}
.gr-sheet .gr-chip{margin-top:12px}
.gr-stopdesc{font:400 14px/1.65 var(--sans);color:var(--body2);margin-top:16px}
.gr-sheet .gr-addr{margin-top:16px}
.gr-sheet .gr-nearby-sec{margin-top:22px}
@media (max-height:600px){
  .gr-sheet .gr-photo--stop{width:min(100%,320px);margin-left:auto;margin-right:auto}
}
@media (prefers-reduced-motion:no-preference){
  .gr-overlay{animation:grFade .15s ease}
}
@keyframes grFade{from{opacity:0}to{opacity:1}}
`;

const JS = SHARED_JS + `
var ACCENTS = ['oklch(58% .16 35)','oklch(52% .13 150)','oklch(48% .13 260)'];
var LANGUAGE_STORAGE_KEY = 'china2026.language';
function loadLanguage(){
  try{
    var stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return stored==='en' || stored==='zh' ? stored : 'en';
  }catch(e){ return 'en'; }
}
function saveLanguage(lang){
  try{ window.localStorage.setItem(LANGUAGE_STORAGE_KEY,lang); }catch(e){}
}
var state = { lang:loadLanguage(), cityIdx:0, activeSection:'overview', activeDay:0, openStop:null };
var root;
var lastTrigger = null; // stop-row id that opened the dialog, for focus restore
var scrollFrame = 0;

function up(s){ return String(s==null?'':s).toUpperCase(); }
function sub(o){ return o.sub ? '<div class="gr-sub">'+esc(o.sub)+'</div>' : ''; }
// Real photo when src is given (object-fit:cover fills the fixed aspect box on
// any device), else the striped placeholder + mono filename caption.
function photo(mod, cap, src, alt, eager){
  if(src){
    var load = eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"';
    return '<div class="gr-photo '+mod+'"><img class="gr-photo-img" src="'+esc(src)+'" alt="'+esc(alt||'')+'" '+load+' decoding="async" onload="this.style.opacity=1"></div>';
  }
  return '<div class="gr-photo '+mod+'"><span class="gr-photo-cap">'+esc(cap)+'</span></div>';
}
function cityImg(id){ return 'images/' + id + '-city.webp'; }
function dayImg(id, idx){ return 'images/' + id + '-' + (idx + 1) + '.webp'; }
function stopPhoto(stop){
  if(!stop.photo) return '';
  var alt = stop.photo.alt || stop.name.main;
  var srcset = stop.photo.smallSrc + ' 640w, ' + stop.photo.largeSrc + ' 1280w';
  return '<div class="gr-photo gr-photo--1610 gr-photo--stop">'
    + '<img class="gr-photo-img" src="'+esc(stop.photo.smallSrc)+'" srcset="'+esc(srcset)+'" '
    + 'sizes="(min-width: 640px) 420px, calc(100vw - 40px)" width="1280" height="800" '
    + 'alt="'+esc(alt)+'" loading="lazy" decoding="async" '
    + 'onload="this.style.opacity=1" onerror="this.parentNode.remove()"></div>';
}
// Turn a phone string (one or "/"-separated numbers) into tappable tel: links,
// keeping the display formatting; href strips to leading + and digits.
function telLinks(str){
  return String(str||'').split('/').map(function(p){
    var disp = p.trim();
    if(!disp) return '';
    return '<a class="gr-tel" href="tel:' + esc(disp.replace(/[^+\\d]/g, '')) + '">' + esc(disp) + '</a>';
  }).filter(Boolean).join(' / ');
}
// href = Amap H5 fallback (new tab on Android/desktop). data-lat/lon/name drive
// the exact-pin native iOS scheme at tap time; data-key is the no-coords fallback.
function mapAttrs(x){
  var a = 'href="'+esc(x.mapUrl)+'"';
  if(x.geo) a += ' data-lat="'+esc(x.geo.lat)+'" data-lon="'+esc(x.geo.lon)+'" data-name="'+esc(x.geo.name)+'"';
  else a += ' data-key="'+esc(x.searchKey)+'"';
  return a;
}

function nearRow(n, withType){
  return '<a class="gr-nearrow" '+mapAttrs(n)+'>'
    + (withType ? '<div class="gr-nearrow-t">'+esc(n.typeLabel)+'</div>' : '')
    + '<div class="gr-nearrow-n'+(withType?' lg':'')+'">'+esc(n.name.main)+'</div>'
    + (n.note ? '<div class="gr-nearrow-note">'+esc(n.note)+'</div>' : '')
    + '</a>';
}

function viewOverview(city){
  var h = '<div>';
  h += photo('gr-photo--1610', city.name.main + '_CITY.JPG', cityImg(city.id), city.name.main, true);
  h += '<h2 class="gr-cityname">'+esc(city.name.main)+'</h2>' + sub(city.name);
  h += '<div class="gr-stats">'
     + '<div class="gr-stat"><div class="gr-stat-k">DATES</div><div class="gr-stat-v">'+esc(city.dateRange)+'</div></div>'
     + '<div class="gr-stat"><div class="gr-stat-k">DAYS</div><div class="gr-stat-v">'+city.dayCount+'</div></div>'
     + '<div class="gr-stat"><div class="gr-stat-k">STOPS</div><div class="gr-stat-v">'+city.stopCount+'</div></div>'
     + '</div>';
  h += '<h3 class="gr-sechead gr-taste">'+up(t('mustEatTitle',state.lang)+' '+city.name.main)+'</h3>';
  h += '<div class="gr-eats">' + city.mustEats.map(function(m){
      return '<div class="gr-eat"><div class="gr-eat-n">'+esc(m.name.main)+'</div>'
        + '<div class="gr-eat-note">'+esc(m.note)+'</div></div>';
    }).join('') + '</div>';
  return h + '</div>';
}

function viewDay(city, day){
  var h = '<div>';
  h += '<div class="gr-day-kicker"><span class="gr-day-index">'+(state.lang==='zh'?'第':'DAY ')+String(day.dayNum).padStart(2,'0')+(state.lang==='zh'?'天':'')+'</span>'
    + '<span>'+esc(day.dayLabel)+' · '+esc(day.date)+'</span></div>';
  if(day.isToday) h += '<div class="gr-today">'+esc(t('today',state.lang))+'</div>';
  h += '<div class="gr-dayhero">' + photo('gr-photo--169', 'DAY_'+day.dayNum+'.JPG', dayImg(city.id, day.index), day.title.main) + '</div>';
  h += '<h2 class="gr-daytitle">'+esc(day.title.main)+'</h2>' + sub(day.title);
  h += '<div class="gr-stops">' + day.items.map(function(it){
      return '<button class="gr-stop" data-open="'+esc(it.id)+'">'
        + '<div class="gr-stop-time">'+esc(it.time)+'</div>'
        + '<div class="gr-stop-main">'
        + '<div class="gr-stop-type">'+esc(it.typeLabel)+'</div>'
        + '<div class="gr-stop-name">'+esc(it.name.main)+'</div>'
        + (it.name.sub ? '<div class="gr-stop-sub">'+esc(it.name.sub)+'</div>' : '')
        + '<div class="gr-stop-hood">'+esc(it.hood.main)+'</div>'
        + (it.booking ? '<div class="gr-chip">'+esc(it.bookingLabel)+'</div>' : '')
        + '</div></button>';
    }).join('') + '</div>';
  return h + '</div>';
}

function viewDays(city){
  var rail = '<nav class="gr-dayrail" aria-label="'+esc(t('daysNav',state.lang))+'" style="grid-template-columns:repeat('+city.days.length+',1fr)">'
    + city.days.map(function(day){
      var fullLabel = day.dayLabel + ', ' + day.date;
      return '<button class="gr-day'+(day.index===state.activeDay?' on':'')+'" data-day="'+day.index+'" aria-label="'+esc(fullLabel)+'"'
        +(day.index===state.activeDay?' aria-current="date"':'')+'>'+esc(compactDayLabel(day,state.lang))+'</button>';
    }).join('') + '</nav>';
  var days = city.days.map(function(day){
    return '<article class="gr-dayblock" data-day-view="'+day.index+'" id="day-'+city.id+'-'+day.index+'">'+viewDay(city,day)+'</article>';
  }).join('');
  return rail + days;
}

function viewMap(city){
  var items = dedupeMapItems(city.days.reduce(function(items, day){ return items.concat(day.items); }, []));
  var h = '<div>';
  h += '<h2 class="gr-h1">'+esc(t('mapTitle',state.lang))+'</h2><div class="gr-maphint">'+esc(t('mapHint',state.lang))+'</div>';
  h += '<div class="gr-maplist">' + items.map(function(mi){
      return '<a class="gr-maprow" '+mapAttrs(mi)+'>'
        + '<div style="min-width:0"><div class="gr-maprow-n">'+esc(mi.name.main)+'</div>'
        + '<div class="gr-maprow-a">'+esc(mi.addrText)+'</div></div>'
        + '<div class="gr-maprow-arrow">&#8594;</div></a>';
    }).join('') + '</div>';
  return h + '</div>';
}

function viewHotel(city){
  var ho = city.hotel, h = '<div>';
  h += '<h2 class="gr-hotelname">'+esc(ho.name.main)+'</h2>' + sub(ho.name);
  h += '<a class="gr-addr" '+mapAttrs(ho)+'><span>'+esc(ho.addrText)+'</span><span>&#8594;</span></a>';
  h += '<div class="gr-facts">'
     + '<div class="gr-fact row1"><div class="gr-fact-k">'+up(t('checkIn',state.lang))+'</div><div class="gr-fact-v">'+esc(ho.checkInTime)+'</div></div>'
     + '<div class="gr-fact row1"><div class="gr-fact-k">'+up(t('checkOut',state.lang))+'</div><div class="gr-fact-v">'+esc(ho.checkOutTime)+'</div></div>'
     + '<div class="gr-fact"><div class="gr-fact-k">'+up(t('phone',state.lang))+'</div><div class="gr-fact-v sm">'+telLinks(ho.phone)+'</div></div>'
     + '<div class="gr-fact"><div class="gr-fact-k">'+up(t('checkinDoc',state.lang))+'</div><div class="gr-fact-v sm">'
       + (ho.confirmationUrl ? '<a class="gr-doc" href="'+esc(ho.confirmationUrl)+'" target="_blank" rel="noopener">'+esc(t('openDoc',state.lang))+' &#8594;</a>' : '—')
       + '</div></div>'
     + '</div>';
  h += '<div class="gr-conf">CONF# '+esc(ho.confirmation)+'</div>';
  if(ho.checkInNote) h += '<div class="gr-note">'+esc(ho.checkInNote)+'</div>';
  if(ho.notes.length){
    h += '<h3 class="gr-sechead gr-goodtoknow">'+up(t('goodToKnow',state.lang))+'</h3>'
       + '<ul class="gr-notes">' + ho.notes.map(function(n){ return '<li>'+esc(n)+'</li>'; }).join('') + '</ul>';
  }
  if(ho.nearby.length){
    h += '<h3 class="gr-sechead gr-nearby-sec">'+up(t('nearbyHotel',state.lang))+'</h3>'
       + '<div class="gr-nearby">' + ho.nearby.map(function(n){ return nearRow(n, false); }).join('') + '</div>';
  }
  return h + '</div>';
}

function viewCityDocument(city){
  return '<main class="gr-city-document">'
    + '<section class="gr-section gr-section--overview" data-section-view="overview" id="overview-'+city.id+'">'+viewOverview(city)+'</section>'
    + '<section class="gr-section gr-section--days" data-section-view="days" id="days-'+city.id+'">'+viewDays(city)+'</section>'
    + '<section class="gr-section gr-section--map" data-section-view="map" id="map-'+city.id+'">'+viewMap(city)+'</section>'
    + '<section class="gr-section gr-section--hotel" data-section-view="hotel" id="hotel-'+city.id+'">'+viewHotel(city)+'</section>'
    + '</main>';
}

function overlay(stop){
  if(!stop) return '';
  var h = '<div class="gr-overlay" data-backdrop><div class="gr-sheet" role="dialog" aria-modal="true" aria-labelledby="gr-stop-title">';
  h += '<div class="gr-close-row"><button class="gr-close" data-close aria-label="'+esc(t('close',state.lang))+'">'+esc(t('close',state.lang))+'</button></div>';
  h += '<div class="gr-sheet-body">';
  h += stopPhoto(stop);
  h += '<div class="gr-stopmeta">'+esc(stop.time)+' / '+up(stop.typeLabel)+'</div>';
  h += '<h2 class="gr-stopname" id="gr-stop-title">'+esc(stop.name.main)+'</h2>'
     + (stop.name.sub ? '<div class="gr-stopname-sub">'+esc(stop.name.sub)+'</div>' : '');
  if(stop.booking) h += '<div class="gr-chip">'+esc(stop.bookingLabel)+'</div>';
  if(stop.desc) h += '<div class="gr-stopdesc">'+esc(stop.desc)+'</div>';
  h += '<a class="gr-addr" '+mapAttrs(stop)+'><span>'+esc(stop.addrText)+'</span><span>&#8594;</span></a>';
  if(stop.nearby.length){
    h += '<h3 class="gr-sechead gr-nearby-sec">'+up(t('nearby',state.lang))+'</h3>'
       + '<div class="gr-nearby">' + stop.nearby.map(function(n){ return nearRow(n, true); }).join('') + '</div>';
  }
  return h + '</div></div></div>';
}

function currentScroller(){ return root ? root.querySelector('.gr-scroll') : null; }
function currentScrollTop(){ var scroller = currentScroller(); return scroller ? scroller.scrollTop : 0; }
function elementScrollOffset(element,scroller){
  return element.getBoundingClientRect().top-scroller.getBoundingClientRect().top+scroller.scrollTop;
}
function motionBehavior(){
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}
function captureScrollContext(){
  var scroller = currentScroller();
  if(!scroller) return null;
  updateScrollState();
  var selector = state.activeSection==='days'
    ? '[data-day-view="'+state.activeDay+'"]'
    : '[data-section-view="'+state.activeSection+'"]';
  var anchor = scroller.querySelector(selector);
  return anchor ? { section:state.activeSection, day:state.activeDay, delta:scroller.scrollTop-elementScrollOffset(anchor,scroller) } : null;
}
function updateNavigation(){
  var sectionButtons = root.querySelectorAll('[data-section]');
  for(var i=0;i<sectionButtons.length;i++){
    var sectionOn = sectionButtons[i].dataset.section===state.activeSection;
    sectionButtons[i].classList.toggle('on',sectionOn);
    if(sectionOn) sectionButtons[i].setAttribute('aria-current','location');
    else sectionButtons[i].removeAttribute('aria-current');
  }
  var dayButtons = root.querySelectorAll('[data-day]');
  for(var j=0;j<dayButtons.length;j++){
    var dayOn = +dayButtons[j].dataset.day===state.activeDay;
    dayButtons[j].classList.toggle('on',dayOn);
    if(dayOn) dayButtons[j].setAttribute('aria-current','date');
    else dayButtons[j].removeAttribute('aria-current');
  }
}
function updateScrollState(){
  var scroller = currentScroller();
  if(!scroller) return;
  var sections = Array.prototype.slice.call(scroller.querySelectorAll('[data-section-view]'));
  if(!sections.length) return;
  var sectionOffsets = sections.map(function(section){ return elementScrollOffset(section,scroller); });
  var sectionIdx = activeIndexAtOffset(sectionOffsets,scroller.scrollTop+45);
  if(scroller.scrollTop+scroller.clientHeight>=scroller.scrollHeight-2) sectionIdx=sections.length-1;
  state.activeSection = sections[sectionIdx].dataset.sectionView;
  if(state.activeSection==='days'){
    var days = Array.prototype.slice.call(scroller.querySelectorAll('[data-day-view]'));
    if(days.length){
      state.activeDay = activeIndexAtOffset(days.map(function(day){ return elementScrollOffset(day,scroller); }),scroller.scrollTop+77);
    }
  }
  updateNavigation();
}
function scheduleScrollState(){
  if(scrollFrame) return;
  scrollFrame=requestAnimationFrame(function(){
    scrollFrame=0;
    updateScrollState();
  });
}
function scrollToDay(dayIdx,behavior){
  var scroller = currentScroller();
  var day = scroller && scroller.querySelector('[data-day-view="'+dayIdx+'"]');
  if(!scroller || !day) return;
  state.activeSection='days';
  state.activeDay=dayIdx;
  updateNavigation();
  scroller.scrollTo({top:Math.max(0,elementScrollOffset(day,scroller)-76),behavior:behavior||motionBehavior()});
}
function scrollToSection(section,behavior){
  var scroller = currentScroller();
  if(!scroller) return;
  state.activeSection=section;
  if(section==='overview'){
    updateNavigation();
    scroller.scrollTo({top:0,behavior:behavior||motionBehavior()});
    return;
  }
  if(section==='days'){
    scrollToDay(0,behavior);
    return;
  }
  var target = scroller.querySelector('[data-section-view="'+section+'"]');
  if(!target) return;
  updateNavigation();
  scroller.scrollTo({top:Math.max(0,elementScrollOffset(target,scroller)-44),behavior:behavior||motionBehavior()});
}
function restoreScroll(options){
  var scroller = currentScroller();
  if(!scroller) return;
  if(options && typeof options.scrollTop==='number'){
    scroller.scrollTop=options.scrollTop;
  }else if(options && options.context){
    var context = options.context;
    var selector = context.section==='days'
      ? '[data-day-view="'+context.day+'"]'
      : '[data-section-view="'+context.section+'"]';
    var anchor = scroller.querySelector(selector);
    if(anchor) scroller.scrollTop=Math.max(0,elementScrollOffset(anchor,scroller)+context.delta);
  }else if(options && options.section){
    if(options.section==='overview') scroller.scrollTop=0;
    else if(options.section==='days'){
      var firstDay = scroller.querySelector('[data-day-view="0"]');
      if(firstDay) scroller.scrollTop=Math.max(0,elementScrollOffset(firstDay,scroller)-76);
    }else{
      var section = scroller.querySelector('[data-section-view="'+options.section+'"]');
      if(section) scroller.scrollTop=Math.max(0,elementScrollOffset(section,scroller)-44);
    }
  }
}

function render(options){
  var data = loadTrip(state.lang);
  if(state.cityIdx >= data.cities.length) state.cityIdx = 0;
  var city = data.cities[state.cityIdx];
  if(state.activeDay >= city.days.length) state.activeDay = 0;
  root.style.setProperty('--accent', ACCENTS[state.cityIdx]);

  var stop = null;
  if(state.openStop){
    stop = findStopById(city.days,state.openStop);
    if(!stop) state.openStop = null;
  }

  var langLabel = state.lang==='en' ? 'Switch to Chinese' : '切换到英文';
  var head = '<header class="gr-tripbar"><h1 class="gr-title">'+esc(data.tripTitle)+'</h1>'
    + '<div class="gr-dates">'+esc(compactTripDates(data.dates,state.lang))+'</div></header>'
    + '<nav class="gr-cityrail" aria-label="'+esc(t('citiesNav',state.lang))+'">' + data.cities.map(function(c,i){
        return '<button class="gr-city'+(i===state.cityIdx?' on':'')+'" data-city="'+i+'"'+(i===state.cityIdx?' aria-current="true"':'')+'>'+esc(c.name.main)+'</button>';
      }).join('') + '<button class="gr-lang" data-lang-toggle aria-label="'+esc(langLabel)+'">'+(state.lang==='en'?'中':'EN')+'</button></nav>';
  var body = '<div class="gr-scroll">'+head+viewCityDocument(city)+'</div>';

  var tabs = '<nav class="gr-tabs" aria-label="'+esc(t('sectionsNav',state.lang))+'">'
    + '<button class="gr-tab" data-section="overview">'+esc(t('tabCity',state.lang))+'</button>'
    + '<button class="gr-tab" data-section="days">'+esc(t('tabDay',state.lang))+'</button>'
    + '<button class="gr-tab" data-section="map">'+esc(t('tabMap',state.lang))+'</button>'
    + '<button class="gr-tab" data-section="hotel">'+esc(t('tabStay',state.lang))+'</button>'
    + '</nav>';

  root.innerHTML = body + tabs + overlay(stop);
  var scroller = currentScroller();
  if(scroller) scroller.addEventListener('scroll',scheduleScrollState,{passive:true});
  restoreScroll(options||null);
  updateScrollState();
  // reveal any already-cached hero images immediately (onload won't refire)
  var imgs = root.querySelectorAll('.gr-photo-img');
  for(var k=0;k<imgs.length;k++){ if(imgs[k].complete) imgs[k].style.opacity=1; }
  // dialog focus management: move focus into the sheet on open
  if(stop){ var cl = root.querySelector('[data-close]'); if(cl) cl.focus(); }
  else if(lastTrigger){ var tr = root.querySelector('[data-open="'+lastTrigger+'"]'); if(tr) tr.focus(); lastTrigger=null; }
}

document.addEventListener('click', function(e){
  var el;
  if(e.target.closest('[data-lang-toggle]')){
    var context = captureScrollContext();
    state.lang = state.lang==='en'?'zh':'en'; saveLanguage(state.lang); document.documentElement.lang = state.lang;
    render({context:context}); return;
  }
  if((el=e.target.closest('[data-city]'))){
    if(+el.dataset.city===state.cityIdx) return;
    var section = state.activeSection;
    state.cityIdx = +el.dataset.city; state.activeDay = 0; state.openStop = null;
    render({section:section}); return;
  }
  if((el=e.target.closest('[data-section]'))){ state.openStop = null; scrollToSection(el.dataset.section); return; }
  if((el=e.target.closest('[data-day]'))){ state.openStop = null; scrollToDay(+el.dataset.day); return; }
  if((el=e.target.closest('[data-open]'))){
    var openScroll = currentScrollTop();
    state.openStop = el.dataset.open; lastTrigger = el.dataset.open; render({scrollTop:openScroll}); return;
  }
  if(e.target.closest('[data-close]')){
    var closeScroll = currentScrollTop();
    state.openStop = null; render({scrollTop:closeScroll}); return;
  }
  if(e.target.hasAttribute('data-backdrop')){
    var backdropScroll = currentScrollTop();
    state.openStop = null; render({scrollTop:backdropScroll}); return;
  }
});
// Amap address links (modern, cross-browser, graceful degradation):
//  - iPhone/iPod ONLY: tap opens the native app in place via iosamap://viewMap
//    (exact pin). These devices belong to the Amap-equipped family that wants
//    the one-tap open. A failed custom-scheme navigation errors on iOS
//    ("address is invalid"), so we only do this where the app is expected.
//  - iPad / Android / desktop / everything else: open the exact-pin uri.amap.com
//    H5 map (href) in a NEW tab. It's a valid https URL, so it NEVER triggers the
//    "address is invalid" error when Amap isn't installed; callnative=1 also
//    auto-launches the app on Android. (Modern iPadOS Safari reports its UA as
//    "Macintosh", and iPadOS can't be reliably detected as having Amap, so iPad
//    must not use the custom scheme — that was the cause of the reported error.)
function ua(){ return navigator.userAgent || ''; }
function isIPhone(){ return /iPhone|iPod/i.test(ua()); }
function amapNativeUrl(a){
  var lat = a.getAttribute('data-lat'), lon = a.getAttribute('data-lon'), name = a.getAttribute('data-name');
  if(lat && lon) return 'iosamap://viewMap?sourceApplication=ChinaTrip&poiname=' + encodeURIComponent(name || '') + '&lat=' + lat + '&lon=' + lon + '&dev=0';
  return 'iosamap://poi?sourceApplication=ChinaTrip&name=' + encodeURIComponent(a.getAttribute('data-key') || name || '') + '&dev=0';
}
document.addEventListener('click', function(e){
  var a = e.target.closest('a[data-lat], a[data-key]');
  if(!a) return;
  e.preventDefault();
  if(isIPhone()){
    window.location.href = amapNativeUrl(a); // iPhone: open the app in place
  } else {
    window.open(a.getAttribute('href'), '_blank', 'noopener'); // iPad/Android/desktop: valid H5 URL, no scheme error
  }
});
document.addEventListener('keydown', function(e){
  if(!state.openStop) return;
  if(e.key==='Escape'){
    var escapeScroll = currentScrollTop();
    state.openStop = null; render({scrollTop:escapeScroll}); return;
  }
  if(e.key==='Tab'){ // keep focus inside the dialog
    var sheet = root.querySelector('.gr-sheet'); if(!sheet) return;
    var f = sheet.querySelectorAll('button:not([disabled]), a[href]');
    if(!f.length) return;
    var first = f[0], last = f[f.length-1];
    if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  }
});

root = document.getElementById('gr-root');
document.documentElement.lang = state.lang;
render();
`;

return `<title>Family China Trip · 家庭中国之旅</title>
<meta name="theme-color" content="#e9e3d6">
<style>${CSS}</style>
<div class="gr-frame" id="gr-root"></div>
<script>const TRIP=${DATA_JSON.TRIP};const I18N=${DATA_JSON.I18N};const GEO=${DATA_JSON.GEO};const STOP_IMAGES=${DATA_JSON.STOP_IMAGES};\n${JS}</script>`;
}

module.exports = { buildA };
