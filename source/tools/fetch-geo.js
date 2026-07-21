// One-off geocoder: resolves every Amap location in source/data.js to exact
// coordinates (GCJ-02 / "gaode") + canonical name via the Amap web-service API,
// and writes source/amap-geo.json for the build to consume.
//
//   AMAP_KEY=<your web-service key> node source/tools/fetch-geo.js
//
// The key is read ONLY from the environment and is never written to disk.
// Coordinates are not secret and are committed in amap-geo.json.
const fs = require('fs');
const path = require('path');
const https = require('https');
const { TRIP } = require('../data.js');

const KEY = process.env.AMAP_KEY;
if (!KEY) { console.error('Set AMAP_KEY in the environment (not committed).'); process.exit(1); }

const OUT = path.join(__dirname, '..', 'amap-geo.json');

// --- collect every unique mapUrl reachable from TRIP, with its name + city ---
// name/city drive a text-search fallback when the POI-detail dataset lacks an id.
const byUrl = new Map();
const add = (o, city) => {
  if (!o || !o.address || !o.address.mapUrl) return;
  if (!byUrl.has(o.address.mapUrl)) {
    const nm = o.name ? (o.name.zh || o.name.en || '') : '';
    // region hint: use the neighborhood only when it's a real Amap region
    // (city/district/county, e.g. 肇庆市 — precise for cross-city day trips),
    // otherwise the itinerary city. Road/area names aren't valid regions.
    const hood = o.neighborhood ? (o.neighborhood.zh || o.neighborhood.en || '') : '';
    const region = /[市区县省]$/.test(hood) ? hood : city;
    const addr = (o.address.text || '').trim();
    byUrl.set(o.address.mapUrl, { name: nm, addr, region });
  }
};
TRIP.cities.forEach((c) => {
  const city = (c.name && c.name.zh) || '';
  add(c.hotel, city);
  (c.hotel.nearby || []).forEach((n) => add(n, city));
  c.days.forEach((d) => d.items.forEach((it) => { add(it, city); (it.nearby || []).forEach((n) => add(n, city)); }));
});
const urls = byUrl.keys();

// key each entry by its identifying part: "place/<POIID>" or "search/<decoded query>"
function keyOf(url) {
  const meta = byUrl.get(url) || {};
  let m = url.match(/\/place\/([A-Za-z0-9]+)/);
  if (m) return { key: 'place/' + m[1], kind: 'place', id: m[1], name: meta.name, addr: meta.addr, region: meta.region };
  m = url.match(/search\?query=([^&]*)/);
  if (m) return { key: 'search/' + decodeURIComponent(m[1]), kind: 'search', q: decodeURIComponent(m[1]), name: meta.name, addr: meta.addr, region: meta.region };
  return null;
}

// region + city_limit constrains ambiguous keywords to the right city (e.g.
// "北京路 按摩" must stay in Guangzhou, not Beijing). Callers retry region-less
// if this returns nothing (covers malformed regions / cross-city day trips).
const textSearch = (kw, region) =>
  'https://restapi.amap.com/v5/place/text?keywords=' + encodeURIComponent(kw) +
  (region ? '&region=' + encodeURIComponent(region) + '&city_limit=true' : '') +
  '&page_size=1&key=' + KEY;

function getJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => { try { resolve(JSON.parse(body)); } catch (e) { reject(e); } });
    }).on('error', reject);
  });
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function parsePoi(data) {
  if (!data || data.status !== '1' || !data.pois || !data.pois.length) return null;
  const p = data.pois[0];
  if (!p.location) return null;
  const [lon, lat] = String(p.location).split(',').map(Number);
  if (!isFinite(lon) || !isFinite(lat)) return null;
  return { name: p.name || '', lon, lat };
}

async function main() {
  const geo = {};
  let ok = 0, fail = 0;
  const items = [...urls].map(keyOf).filter(Boolean);
  // de-dup by key
  const seen = new Set();
  for (const it of items) {
    if (seen.has(it.key)) continue;
    seen.add(it.key);
    let poi = null;
    try {
      if (it.kind === 'place') {
        poi = parsePoi(await getJSON('https://restapi.amap.com/v5/place/detail?id=' + encodeURIComponent(it.id) + '&key=' + KEY));
        // POI-detail dataset sometimes lacks an id → fall back to a text search.
        // The address text is a cleaner place string than the itinerary name,
        // which can be an action phrase ("前往…"/"go to…"). Try, in order:
        // addr+region, name+region, then region-less by name.
        const tries = [ [it.addr, it.region], [it.name, it.region], [it.name, null] ];
        for (const [kw, rg] of tries) {
          if (poi || !kw) continue;
          await sleep(350);
          poi = parsePoi(await getJSON(textSearch(kw, rg)));
        }
      } else {
        poi = parsePoi(await getJSON(textSearch(it.q, it.region)));
        if (!poi) { await sleep(350); poi = parsePoi(await getJSON(textSearch(it.q))); } // retry region-less
      }
    } catch (e) {
      console.warn('\n  error:', it.key, e.message);
    }
    if (poi) { geo[it.key] = poi; ok++; process.stdout.write('.'); }
    else { fail++; console.warn('\n  unresolved:', it.key, '(' + (it.name || it.q || '') + ')'); }
    await sleep(350); // stay under per-key QPS
  }
  fs.writeFileSync(OUT, JSON.stringify(geo, null, 2) + '\n');
  console.log('\nwrote', OUT, '—', ok, 'resolved,', fail, 'unresolved of', seen.size);
}
main();
