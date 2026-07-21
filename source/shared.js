// Browser-side helpers shared (inlined) into the build.
// Ported from the Grid design bundle's framework-free itinerary-logic.js,
// adapted to read the in-scope `TRIP` / `I18N` consts (not window.*).
// Exposed as a string so the build can embed it verbatim.

const SHARED_JS = `
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

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
    mapUrl: n.address ? n.address.mapUrl : '',
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
    mapUrl: it.address ? it.address.mapUrl : '',
    booking: !!it.bookingRequired,
    bookingLabel: it.bookingRequired ? t('bookingRequired', lang) : t('noBooking', lang),
    nearby: (it.nearby || []).map(n => formatNear(n, lang)),
  };
}
function formatDay(day, idx, lang, todayIdx){
  return {
    index: idx,
    dayNum: idx + 1,
    dayLabel: day.dayLabel,
    date: day.date,
    isToday: idx === todayIdx,
    title: bilingual(day.title, lang),
    items: day.items.map(it => formatItem(it, lang)),
  };
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
    mapUrl: hotel.address.mapUrl,
    phone: hotel.phone,
    confirmation: hotel.confirmation,
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
