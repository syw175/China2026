// Browser-side helpers shared (inlined) into the build.
// Ported from the Grid design bundle's framework-free itinerary-logic.js,
// adapted to read the in-scope `TRIP` / `I18N` consts (not window.*).
// Exposed as a string so the build can embed it verbatim.

const SHARED_JS = `
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

// The key identifying an amap.com URL in the GEO map: "place/<POIID>" or
// "search/<decoded query>" — matches the keys written by tools/fetch-geo.js.
function geoKey(u){
  if(!u) return null;
  var m = u.match(/\\/place\\/([A-Za-z0-9]+)/);
  if(m) return 'place/' + m[1];
  m = u.match(/search\\?query=([^&]*)/);
  if(m) return 'search/' + decodeURIComponent(m[1]);
  return null;
}

// Build the Amap H5 fallback link (opens the app on Android via callnative=1,
// shows the exact-pin web map otherwise). Uses geocoded coordinates when we
// have them, else the raw poiid/keyword.
function toAppLink(u){
  if(!u) return u;
  var g = (typeof GEO !== 'undefined') ? GEO[geoKey(u)] : null;
  if(g) return 'https://uri.amap.com/marker?position=' + g.lon + ',' + g.lat
    + '&name=' + encodeURIComponent(g.name || '') + '&src=ChinaTrip&callnative=1';
  var m = u.match(/^https?:\\/\\/www\\.amap\\.com\\/place\\/([A-Za-z0-9]+)/);
  if(m) return 'https://uri.amap.com/marker?poiid=' + m[1] + '&src=ChinaTrip&callnative=1';
  m = u.match(/^https?:\\/\\/www\\.amap\\.com\\/search\\?query=([^&]*)/);
  if(m) return 'https://uri.amap.com/search?keyword=' + m[1] + '&src=ChinaTrip&callnative=1';
  return u;
}

// Geocoded {lat, lon, name} for a location, used to build the exact-pin native
// iOS scheme at tap time. Null when the location wasn't resolved.
function geoOf(u){
  var g = (typeof GEO !== 'undefined') ? GEO[geoKey(u)] : null;
  return g ? { lat: g.lat, lon: g.lon, name: g.name || '' } : null;
}

// Keyword for opening the Amap app via a place search — used only when a
// location has no geocoded coordinates. Prefer Chinese name + full address.
function searchKeyOf(nameObj, addr){
  var n = nameObj ? (nameObj.zh || nameObj.en || '') : '';
  var a = addr ? (addr.text || '') : '';
  return (n + ' ' + a).trim().replace(/\\s+/g, ' ');
}

const MONTHS = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 };
function parseTripDate(str, year){
  const m = String(str).trim().match(/^([A-Za-z]{3})\\s+(\\d{1,2})/);
  if(!m) return null;
  const mo = MONTHS[m[1]];
  if(mo == null) return null;
  return new Date(year, mo, parseInt(m[2], 10));
}

// bilingual — EN mode returns {main:english, sub:chinese}; ZH mode returns {main:chinese, sub:''}
function bilingual(obj, lang){
  if(!obj) return { main:'', sub:'' };
  if(lang === 'zh') return { main: obj.zh || obj.en || '', sub:'' };
  const sub = obj.zh && obj.zh !== obj.en ? obj.zh : '';
  return { main: obj.en || obj.zh || '', sub };
}
function t(key, lang){ const o = I18N[key]; return o ? (o[lang] || o.en) : key; }

function formatNear(n, lang){
  return {
    typeLabel: t('cat_' + n.type, lang) || n.type,
    name: bilingual(n.name, lang),
    note: bilingual(n.note, lang).main,
    addrText: n.address ? n.address.text : '',
    mapUrl: n.address ? toAppLink(n.address.mapUrl) : '',
    geo: n.address ? geoOf(n.address.mapUrl) : null,
    searchKey: searchKeyOf(n.name, n.address),
  };
}
function formatItem(it, lang){
  return {
    id: it.id,
    time: it.time,
    typeLabel: t('type_' + it.type, lang) || it.type,
    type: it.type,
    name: bilingual(it.name, lang),
    hood: bilingual(it.neighborhood, lang),
    desc: bilingual(it.desc, lang).main,
    addrText: it.address ? it.address.text : '',
    mapUrl: it.address ? toAppLink(it.address.mapUrl) : '',
    geo: it.address ? geoOf(it.address.mapUrl) : null,
    searchKey: searchKeyOf(it.name, it.address),
    booking: !!it.bookingRequired,
    bookingLabel: it.bookingRequired ? t('bookingRequired', lang) : t('noBooking', lang),
    photo: STOP_IMAGES[it.id] || null,
    nearby: (it.nearby || []).map(n => formatNear(n, lang)),
  };
}
const WEEKDAY_ZH = { Sun:'周日', Mon:'周一', Tue:'周二', Wed:'周三', Thu:'周四', Fri:'周五', Sat:'周六' };
function formatDayLabel(label, lang){
  return lang === 'zh' ? (WEEKDAY_ZH[label] || label) : label;
}
function formatDayDate(date, lang){
  if(lang !== 'zh') return date;
  const match = /^(Jul|Aug)\\s+(\\d{1,2})$/.exec(date);
  if(!match) return date;
  return (match[1] === 'Jul' ? '7' : '8') + '月' + parseInt(match[2], 10) + '日';
}
function compactTripDates(dates, lang){
  if(lang === 'zh'){
    const match = String(dates).match(/(\\d+)\\s*月\\s*(\\d+)\\s*日\\s*[–—-]\\s*(\\d+)\\s*月\\s*(\\d+)\\s*日/);
    return match ? match[1] + '月' + parseInt(match[2], 10) + '日—' + match[3] + '月' + parseInt(match[4], 10) + '日' : dates;
  }
  const match = String(dates).match(/([A-Za-z]{3})\\s+(\\d+)\\s*[–—-]\\s*([A-Za-z]{3})\\s+(\\d+)/);
  return match ? parseInt(match[2], 10) + ' ' + match[1] + ' — ' + parseInt(match[4], 10) + ' ' + match[3] : dates;
}
function compactDayLabel(day, lang){
  const match = String(day.date || '').match(/(\\d{1,2})(?:日)?$/);
  const weekday = lang === 'zh' ? day.dayLabel : String(day.dayLabel || '').toUpperCase();
  return match ? weekday + ' ' + parseInt(match[1], 10) : weekday;
}
function formatDay(day, idx, lang, todayIdx){
  return {
    index: idx,
    dayNum: idx + 1,
    dayLabel: formatDayLabel(day.dayLabel, lang),
    date: formatDayDate(day.date, lang),
    isToday: idx === todayIdx,
    title: bilingual(day.title, lang),
    items: day.items.map(it => formatItem(it, lang)),
  };
}
function mapDestinationKey(item){
  if(item.mapUrl) return item.mapUrl;
  if(item.geo) return item.geo.lat + ',' + item.geo.lon;
  return item.searchKey || item.name.main || item.id;
}
function dedupeMapItems(items){
  const seen = new Set();
  return items.filter(item => {
    const key = mapDestinationKey(item);
    if(seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function activeIndexAtOffset(offsets, marker){
  let active = 0;
  for(let i = 0; i < offsets.length; i++){
    if(offsets[i] <= marker) active = i;
    else break;
  }
  return active;
}
function findStopById(days, stopId){
  for(let i = 0; i < days.length; i++){
    for(let j = 0; j < days[i].items.length; j++){
      if(days[i].items[j].id === stopId) return days[i].items[j];
    }
  }
  return null;
}
function computeTodayIndex(days, year){
  const now = new Date();
  const todayKey = now.getFullYear() * 372 + now.getMonth() * 31 + now.getDate();
  for(let i = 0; i < days.length; i++){
    const d = parseTripDate(days[i].date, year);
    if(!d) continue;
    const key = d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate();
    if(key === todayKey) return i;
  }
  return -1;
}
function formatHotel(hotel, lang){
  return {
    name: bilingual(hotel.name, lang),
    addrText: hotel.address.text,
    mapUrl: toAppLink(hotel.address.mapUrl),
    geo: geoOf(hotel.address.mapUrl),
    searchKey: searchKeyOf(hotel.name, hotel.address),
    phone: hotel.phone,
    confirmation: hotel.confirmation,
    confirmationUrl: hotel.confirmationUrl || '',
    checkInTime: hotel.checkIn.time,
    checkInNote: bilingual(hotel.checkIn.note, lang).main,
    checkOutTime: hotel.checkOut.time,
    checkOutNote: bilingual(hotel.checkOut.note, lang).main,
    wifi: bilingual(hotel.wifi, lang).main,
    notes: (hotel.notes || []).map(n => bilingual(n, lang).main),
    nearby: (hotel.nearby || []).map(n => formatNear(n, lang)),
  };
}
function formatCity(city, lang){
  const todayIdx = computeTodayIndex(city.days, 2026);
  const days = city.days.map((d, i) => formatDay(d, i, lang, todayIdx));
  return {
    id: city.id,
    name: bilingual(city.name, lang),
    dateRange: city.dateRange,
    todayIdx,
    days,
    dayCount: days.length,
    stopCount: days.reduce((n, d) => n + d.items.length, 0),
    mustEats: city.mustEats.map(m => ({ name: bilingual(m.name, lang), note: bilingual(m.note, lang).main })),
    hotel: formatHotel(city.hotel, lang),
  };
}
function loadTrip(lang){
  return {
    tripTitle: bilingual(TRIP.title, lang).main,
    dates: TRIP.dates[lang] || TRIP.dates.en,
    cities: TRIP.cities.map(c => formatCity(c, lang)),
  };
}
`;

module.exports = { SHARED_JS };
