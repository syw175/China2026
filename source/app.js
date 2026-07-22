// "Grid" redesign — mobile-first 4-tab app shell (City / Days / Map / Stay) + stop overlay.
// Re-implements the design-bundle prototype (Itinerary Grid.dc.html) in plain HTML/CSS/JS.
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
.gr-scroll::-webkit-scrollbar{display:none}
.gr-scroll{scrollbar-width:none}

.gr-frame{width:100vw;height:100vh;height:100dvh;background:var(--paper);display:flex;flex-direction:column;
  overflow:hidden;position:relative}
@media (min-width:640px){
  .gr-frame{max-width:460px;height:min(920px,94vh);margin:3vh auto;
    box-shadow:0 30px 80px -30px oklch(20% .01 80 / .55);border:1px solid var(--ink)}
}

/* header + city switcher */
.gr-header{flex:none;padding:18px 20px 0;padding-top:calc(18px + env(safe-area-inset-top, 0px));border-bottom:2px solid var(--ink)}
.gr-header-top{display:flex;align-items:flex-start;justify-content:space-between}
.gr-title{font:700 22px/1.05 var(--grotesk);letter-spacing:-.01em}
.gr-lang{font:600 10px/1 var(--mono);letter-spacing:.05em;background:var(--ink);color:var(--near2);
  border:none;padding:8px 10px}
.gr-dates{font:500 11px/1.4 var(--mono);color:var(--muted);margin:6px 0 14px;letter-spacing:.02em}
.gr-cities{display:grid;grid-template-columns:repeat(3,1fr)}
.gr-city{font:600 12px/1 var(--grotesk);letter-spacing:.01em;padding:10px 4px;border:none;
  border-top:3px solid transparent;background:transparent;color:var(--ink);text-align:center}
.gr-city.on{border-top-color:var(--accent);background:var(--accent);color:var(--near)}

/* scroll body */
.gr-scroll{flex:1 1 auto;overflow-y:auto;padding:20px}

/* photo placeholders */
.gr-photo{position:relative;width:100%;background:var(--stripe);border:2px solid var(--ink)}
.gr-photo--1610{aspect-ratio:16/10}
.gr-photo--169{aspect-ratio:16/9}
.gr-photo-cap{position:absolute;left:10px;bottom:10px;font:500 11px/1.4 var(--mono);color:var(--ink);
  background:oklch(96% .01 70 / .9);padding:5px 8px}
.gr-photo-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}

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
.gr-cta{margin-top:26px;width:100%;display:flex;align-items:center;justify-content:space-between;
  border:2px solid var(--ink);padding:14px 16px;background:var(--accent);color:oklch(98% .01 70);text-align:left}
.gr-cta-k{display:block;font:600 10px/1 var(--mono);letter-spacing:.05em}
.gr-cta-v{display:block;font:700 15px/1.3 var(--grotesk);margin-top:5px}
.gr-cta-arrow{font:700 18px/1 var(--grotesk)}

/* days tab */
.gr-days{display:grid;grid-template-columns:repeat(4,1fr);border:2px solid var(--ink)}
.gr-day{text-align:left;padding:9px 8px;border:none;background:transparent;color:var(--ink)}
.gr-day:not(:last-child){border-right:1px solid var(--hair2)}
.gr-day.on{background:var(--accent);color:oklch(98% .01 70)}
.gr-day-w{display:block;font:600 9px/1 var(--mono);letter-spacing:.04em;opacity:.75}
.gr-day-d{display:block;font:700 13px/1.3 var(--grotesk);margin-top:4px}
.gr-today{margin-top:10px;display:inline-block;font:600 10px/1 var(--mono);letter-spacing:.05em;
  background:var(--accent);color:oklch(98% .01 70);padding:5px 8px}
.gr-dayhero{margin-top:16px}
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
.gr-seg{display:grid;grid-template-columns:1fr 1fr;margin-top:14px;border:2px solid var(--ink)}
.gr-seg button{font:600 11px/1 var(--mono);letter-spacing:.03em;padding:10px 6px;border:none;
  background:transparent;color:var(--ink)}
.gr-seg button:first-child{border-right:1px solid var(--ink)}
.gr-seg button.on{background:var(--accent);color:oklch(98% .01 70)}
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
.gr-tab{padding:12px 0 14px;background:transparent;border:none;
  font:600 11px/1 var(--mono);letter-spacing:.03em;color:var(--ink)}
.gr-tab.on{background:var(--ink);color:oklch(98% .01 70)}

/* stop overlay */
.gr-overlay{position:absolute;inset:0;background:oklch(15% .01 90 / .6);
  display:flex;align-items:flex-end;z-index:10}
.gr-sheet{width:100%;max-height:82%;background:var(--sheet);border-top:3px solid var(--ink);
  overflow-y:auto;padding:22px 20px 30px}
.gr-close-row{display:flex;justify-content:flex-end}
.gr-close{background:var(--ink);color:var(--near2);border:none;font:700 13px/1 var(--mono);padding:7px 10px}
.gr-sheet .gr-photo{margin-top:14px}
.gr-stopmeta{font:600 10px/1 var(--mono);letter-spacing:.05em;text-transform:uppercase;
  color:var(--muted);margin-top:16px}
.gr-stopname{font:700 24px/1.2 var(--grotesk);margin-top:6px}
.gr-stopname-sub{font:400 15px/1.3 var(--sans);color:var(--muted);margin-top:4px}
.gr-sheet .gr-chip{margin-top:12px}
.gr-stopdesc{font:400 14px/1.65 var(--sans);color:var(--body2);margin-top:16px}
.gr-sheet .gr-addr{margin-top:16px}
.gr-sheet .gr-nearby-sec{margin-top:22px}
@media (prefers-reduced-motion:no-preference){
  .gr-overlay{animation:grFade .15s ease}
}
@keyframes grFade{from{opacity:0}to{opacity:1}}
`;

const JS = SHARED_JS + `
var ACCENTS = ['oklch(58% .16 35)','oklch(52% .13 150)','oklch(48% .13 260)'];
var state = { lang:'en', cityIdx:0, tab:'city', dayIdx:0, openStop:null, mapScope:'day' };
var root;

function up(s){ return String(s==null?'':s).toUpperCase(); }
function sub(o){ return o.sub ? '<div class="gr-sub">'+esc(o.sub)+'</div>' : ''; }
// Real photo when src is given (object-fit:cover fills the fixed aspect box on
// any device), else the striped placeholder + mono filename caption.
function photo(mod, cap, src){
  if(src) return '<div class="gr-photo '+mod+'"><img class="gr-photo-img" src="'+esc(src)+'" alt="" loading="lazy" decoding="async"></div>';
  return '<div class="gr-photo '+mod+'"><span class="gr-photo-cap">'+esc(cap)+'</span></div>';
}
function cityImg(id){ return 'images/' + id + '-city.webp'; }
function dayImg(id, idx){ return 'images/' + id + '-' + (idx + 1) + '.webp'; }
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

function viewCity(city){
  var h = '<div>';
  h += photo('gr-photo--1610', city.name.main + '_CITY.JPG', cityImg(city.id));
  h += '<div class="gr-cityname">'+esc(city.name.main)+'</div>' + sub(city.name);
  h += '<div class="gr-stats">'
     + '<div class="gr-stat"><div class="gr-stat-k">DATES</div><div class="gr-stat-v">'+esc(city.dateRange)+'</div></div>'
     + '<div class="gr-stat"><div class="gr-stat-k">DAYS</div><div class="gr-stat-v">'+city.dayCount+'</div></div>'
     + '<div class="gr-stat"><div class="gr-stat-k">STOPS</div><div class="gr-stat-v">'+city.stopCount+'</div></div>'
     + '</div>';
  h += '<div class="gr-sechead gr-taste">'+up(t('mustEatTitle',state.lang)+' '+city.name.main)+'</div>';
  h += '<div class="gr-eats">' + city.mustEats.map(function(m){
      return '<div class="gr-eat"><div class="gr-eat-n">'+esc(m.name.main)+'</div>'
        + '<div class="gr-eat-note">'+esc(m.note)+'</div></div>';
    }).join('') + '</div>';
  h += '<button class="gr-cta" data-tab="hotel"><span><span class="gr-cta-k">'+up(t('stay',state.lang))+'</span>'
     + '<span class="gr-cta-v">'+esc(city.hotel.name.main)+'</span></span>'
     + '<span class="gr-cta-arrow">&#8594;</span></button>';
  return h + '</div>';
}

function viewDay(city, day){
  var h = '<div>';
  h += '<div class="gr-days" style="grid-template-columns:repeat('+city.days.length+',1fr)">' + city.days.map(function(d){
      return '<button class="gr-day'+(d.index===state.dayIdx?' on':'')+'" data-day="'+d.index+'">'
        + '<span class="gr-day-w">'+esc(d.dayLabel)+'</span>'
        + '<span class="gr-day-d">'+esc(d.date)+'</span></button>';
    }).join('') + '</div>';
  if(day.isToday) h += '<div class="gr-today">TODAY</div>';
  h += '<div class="gr-dayhero">' + photo('gr-photo--169', 'DAY_'+day.dayNum+'.JPG', dayImg(city.id, day.index)) + '</div>';
  h += '<div class="gr-daytitle">'+esc(day.title.main)+'</div>' + sub(day.title);
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

function viewMap(city, day){
  var items = state.mapScope === 'day' ? day.items : city.days.reduce(function(a,d){ return a.concat(d.items); }, []);
  var h = '<div>';
  h += '<div class="gr-h1">MAP</div><div class="gr-maphint">EVERY STOP &#8212; TAP TO OPEN IN MAPS</div>';
  h += '<div class="gr-seg">'
     + '<button data-mapscope="day" class="'+(state.mapScope==='day'?'on':'')+'">'+esc(day.dayLabel+' '+day.date)+'</button>'
     + '<button data-mapscope="city" class="'+(state.mapScope==='city'?'on':'')+'">'+esc(city.name.main)+'</button>'
     + '</div>';
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
  h += '<div class="gr-hotelname">'+esc(ho.name.main)+'</div>' + sub(ho.name);
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
    h += '<div class="gr-sechead gr-goodtoknow">'+up(t('goodToKnow',state.lang))+'</div>'
       + '<ul class="gr-notes">' + ho.notes.map(function(n){ return '<li>'+esc(n)+'</li>'; }).join('') + '</ul>';
  }
  if(ho.nearby.length){
    h += '<div class="gr-sechead gr-nearby-sec">'+up(t('nearbyHotel',state.lang))+'</div>'
       + '<div class="gr-nearby">' + ho.nearby.map(function(n){ return nearRow(n, false); }).join('') + '</div>';
  }
  return h + '</div>';
}

function overlay(stop){
  if(!stop) return '';
  var h = '<div class="gr-overlay" data-backdrop><div class="gr-sheet">';
  h += '<div class="gr-close-row"><button class="gr-close" data-close>CLOSE</button></div>';
  h += photo('gr-photo--1610', 'STOP.JPG');
  h += '<div class="gr-stopmeta">'+esc(stop.time)+' / '+up(stop.typeLabel)+'</div>';
  h += '<div class="gr-stopname">'+esc(stop.name.main)+'</div>'
     + (stop.name.sub ? '<div class="gr-stopname-sub">'+esc(stop.name.sub)+'</div>' : '');
  if(stop.booking) h += '<div class="gr-chip">'+esc(stop.bookingLabel)+'</div>';
  if(stop.desc) h += '<div class="gr-stopdesc">'+esc(stop.desc)+'</div>';
  h += '<a class="gr-addr" '+mapAttrs(stop)+'><span>'+esc(stop.addrText)+'</span><span>&#8594;</span></a>';
  if(stop.nearby.length){
    h += '<div class="gr-sechead gr-nearby-sec">'+up(t('nearby',state.lang))+'</div>'
       + '<div class="gr-nearby">' + stop.nearby.map(function(n){ return nearRow(n, true); }).join('') + '</div>';
  }
  return h + '</div></div>';
}

function render(){
  var data = loadTrip(state.lang);
  if(state.cityIdx >= data.cities.length) state.cityIdx = 0;
  var city = data.cities[state.cityIdx];
  if(state.dayIdx >= city.days.length) state.dayIdx = 0;
  var day = city.days[state.dayIdx];
  root.style.setProperty('--accent', ACCENTS[state.cityIdx]);

  var stop = null;
  if(state.openStop){
    for(var i=0;i<day.items.length && !stop;i++){ if(day.items[i].id===state.openStop) stop = day.items[i]; }
    if(!stop) state.openStop = null;
  }

  var head = '<div class="gr-header"><div class="gr-header-top">'
    + '<div class="gr-title">'+esc(data.tripTitle)+'</div>'
    + '<button class="gr-lang" data-lang-toggle>'+(state.lang==='en'?'中文':'EN')+'</button></div>'
    + '<div class="gr-dates">'+esc(data.dates)+'</div>'
    + '<div class="gr-cities">' + data.cities.map(function(c,i){
        return '<button class="gr-city'+(i===state.cityIdx?' on':'')+'" data-city="'+i+'">'+esc(c.name.main)+'</button>';
      }).join('') + '</div></div>';

  var panel = state.tab==='city' ? viewCity(city)
            : state.tab==='day' ? viewDay(city, day)
            : state.tab==='map' ? viewMap(city, day)
            : viewHotel(city);
  var body = '<div class="gr-scroll">'+panel+'</div>';

  var tabs = '<div class="gr-tabs">'
    + '<button class="gr-tab'+(state.tab==='city'?' on':'')+'" data-tab="city">01 CITY</button>'
    + '<button class="gr-tab'+(state.tab==='day'?' on':'')+'" data-tab="day">02 DAYS</button>'
    + '<button class="gr-tab'+(state.tab==='map'?' on':'')+'" data-tab="map">03 MAP</button>'
    + '<button class="gr-tab'+(state.tab==='hotel'?' on':'')+'" data-tab="hotel">04 STAY</button>'
    + '</div>';

  root.innerHTML = head + body + tabs + overlay(stop);
}

document.addEventListener('click', function(e){
  var el;
  if(e.target.closest('[data-lang-toggle]')){ state.lang = state.lang==='en'?'zh':'en'; document.documentElement.lang = state.lang; render(); return; }
  if((el=e.target.closest('[data-city]'))){ state.cityIdx = +el.dataset.city; state.dayIdx = 0; state.openStop = null; render(); return; }
  if((el=e.target.closest('[data-tab]'))){ state.tab = el.dataset.tab; state.openStop = null; render(); return; }
  if((el=e.target.closest('[data-day]'))){ state.dayIdx = +el.dataset.day; state.openStop = null; render(); return; }
  if((el=e.target.closest('[data-mapscope]'))){ state.mapScope = el.dataset.mapscope; render(); return; }
  if((el=e.target.closest('[data-open]'))){ state.openStop = el.dataset.open; render(); return; }
  if(e.target.closest('[data-close]')){ state.openStop = null; render(); return; }
  if(e.target.hasAttribute('data-backdrop')){ state.openStop = null; render(); return; }
});
// Amap address links (modern, cross-browser, graceful degradation):
//  - iOS: a tap opens the native app directly to the exact pin via iosamap://
//    viewMap (coordinates) — same tab, itinerary preserved. This is the user's
//    chosen iOS behaviour; a new-tab fallback can't coexist with in-place
//    auto-open on WebKit. Missing coords → name-search scheme.
//  - Android / desktop / other: open the exact-pin Amap H5 map (href) in a NEW
//    tab. callnative=1 auto-launches the app on Android; otherwise the web map
//    shows. Itinerary tab always preserved.
function ua(){ return navigator.userAgent || ''; }
function isIOS(){ return /iPhone|iPad|iPod/i.test(ua()) || (/Macintosh/.test(ua()) && navigator.maxTouchPoints > 1); }
function isAndroid(){ return /Android/i.test(ua()); }
function amapNativeUrl(a){
  var scheme = isAndroid() ? 'androidamap' : 'iosamap';
  var lat = a.getAttribute('data-lat'), lon = a.getAttribute('data-lon'), name = a.getAttribute('data-name');
  if(lat && lon) return scheme + '://viewMap?sourceApplication=ChinaTrip&poiname=' + encodeURIComponent(name || '') + '&lat=' + lat + '&lon=' + lon + '&dev=0';
  return scheme + '://poi?sourceApplication=ChinaTrip&name=' + encodeURIComponent(a.getAttribute('data-key') || name || '') + '&dev=0';
}
document.addEventListener('click', function(e){
  var a = e.target.closest('a[data-lat], a[data-key]');
  if(!a) return;
  e.preventDefault();
  if(isIOS()){
    window.location.href = amapNativeUrl(a); // open the app in place; itinerary tab stays put
  } else {
    window.open(a.getAttribute('href'), '_blank', 'noopener'); // Android auto-launches app from H5; desktop shows map
  }
});
document.addEventListener('keydown', function(e){ if(e.key==='Escape' && state.openStop){ state.openStop = null; render(); } });

root = document.getElementById('gr-root');
document.documentElement.lang = state.lang;
render();
`;

return `<title>Family China Trip · 家庭中国之旅</title>
<meta name="theme-color" content="#e9e3d6">
<style>${CSS}</style>
<div class="gr-frame" id="gr-root"></div>
<script>const TRIP=${DATA_JSON.TRIP};const I18N=${DATA_JSON.I18N};const GEO=${DATA_JSON.GEO};\n${JS}</script>`;
}

module.exports = { buildA };
