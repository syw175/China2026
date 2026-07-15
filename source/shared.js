// Browser-side helpers shared (inlined) into every design.
// Exposed as a string so the build can embed it verbatim.

const SHARED_JS = `
const state = { lang: 'en', city: 0, detail: null };

function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function t(k){ const o = I18N[k]; return o ? o[state.lang] : k; }
// bilingual name — EN mode shows "English 中文", 中文 mode shows Chinese only
function nm(o){
  if(!o) return '';
  const en = esc(o.en||''), zh = esc(o.zh||'');
  if(state.lang === 'zh') return zh || en;
  if(zh && zh !== en) return en + '<span class="zh"> ' + zh + '</span>';
  return en;
}
function nmText(o){ if(!o) return ''; return state.lang === 'zh' ? (o.zh||o.en||'') : (o.en||o.zh||''); }
function tp(ty){ return t('type_'+ty); }
function cat(ty){ return t('cat_'+ty); }

const ICONS = {
  activity: '<path d="M12 3l1.9 4.4L18 9l-4.1 1.6L12 15l-1.9-4.4L6 9l4.1-1.6L12 3Z"/>',
  meal: '<path d="M6 3v5a2 2 0 0 0 4 0V3"/><path d="M8 8v13"/><path d="M17 3c-1.6 1-2.2 3-2.2 6s.2 4 2.2 4"/><path d="M17 3v18"/>',
  sight: '<path d="M4 21h16"/><path d="M5.5 21v-8.5M9.5 21v-8.5M14.5 21v-8.5M18.5 21v-8.5"/><path d="M4 12.5h16L12 6 4 12.5Z"/>',
  transit: '<rect x="6" y="3" width="12" height="13" rx="2.5"/><path d="M6 11h12"/><path d="M9.5 20l-2 2M14.5 20l2 2"/><circle cx="9" cy="13.5" r="1"/><circle cx="15" cy="13.5" r="1"/>',
  pin: '<path d="M12 21s-6.5-5.2-6.5-10.5A6.5 6.5 0 0 1 18.5 10.5C18.5 15.8 12 21 12 21Z"/><circle cx="12" cy="10.3" r="2.4"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.2v5l3.2 1.9"/>',
  cal: '<rect x="4" y="5.5" width="16" height="15" rx="2.5"/><path d="M4 10h16M8.5 3v4M15.5 3v4"/>',
  chev: '<path d="M9 5.5l6.5 6.5L9 18.5"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.6 2.4 2.6 14.6 0 17M12 3.5c-2.6 2.4-2.6 14.6 0 17"/>',
  walk: '<circle cx="13" cy="4.5" r="1.6"/><path d="M11 21l1.5-5-2-2 1-5 3 2 2 1M9 21l2-6"/>',
  phone: '<path d="M6.8 3.5c-1 0-1.9.8-1.9 1.9 0 8.1 6.6 14.7 14.7 14.7 1.1 0 1.9-.9 1.9-1.9v-2.5c0-.9-.7-1.7-1.6-1.8l-2.6-.3c-.5-.06-1.05.13-1.4.5l-1 1a12.5 12.5 0 0 1-5.1-5.1l1-1c.37-.36.56-.9.5-1.4l-.3-2.6c-.1-.9-.9-1.6-1.8-1.6Z"/>',
  wifi: '<path d="M2.6 8.6a15 15 0 0 1 18.8 0M5.6 12.1a10 10 0 0 1 12.8 0M8.6 15.5a5 5 0 0 1 6.8 0"/><circle cx="12" cy="19" r="1.1"/>',
  nav: '<path d="M20.5 3.5 3.8 10.4c-.7.3-.6 1.3.1 1.5l6.7 1.9 1.9 6.7c.2.7 1.2.8 1.5.1L20.5 3.5Z"/><path d="M20.5 3.5 11 13"/>',
};
function icon(name, cls){ return '<svg class="ic '+(cls||'')+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+(ICONS[name]||'')+'</svg>'; }

// A hyperlinked address that opens the maps URL in a new tab.
function addrLink(a, cls){
  if(!a) return '';
  return '<a class="addr '+(cls||'')+'" href="'+esc(a.mapUrl)+'" target="_blank" rel="noopener">'
    + icon('pin') + '<span>' + esc(a.text) + '</span></a>';
}

const city = () => TRIP.cities[state.city];
`;

module.exports = { SHARED_JS };
