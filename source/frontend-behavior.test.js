const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const { TRIP, I18N } = require('./data.js');
const { SHARED_JS } = require('./shared.js');
const { STOP_IMAGES } = require('./stop-images.js');
const GEO = require('./amap-geo.json');

const sourceDir = __dirname;
const repoRoot = path.resolve(sourceDir, '..');
const appSource = fs.readFileSync(path.join(sourceDir, 'app.js'), 'utf8');

function sharedExports(names) {
  const context = { TRIP, I18N, STOP_IMAGES, GEO };
  context.globalThis = context;
  vm.runInNewContext(`${SHARED_JS}\nglobalThis.exportsForTest = { ${names.join(', ')} };`, context);
  return context.exportsForTest;
}

test('city overview has no accommodation CTA while the dedicated Hotel section remains', () => {
  assert.doesNotMatch(appSource, /gr-cta/);
  assert.match(appSource, /data-section="hotel"/);
  assert.match(appSource, /t\('tabStay',state\.lang\)/);
});

test('bottom navigation and dialog close text are driven by exact translations', () => {
  assert.deepEqual(I18N.tabCity, { en: '01 OVERVIEW', zh: '01 概览' });
  assert.deepEqual(I18N.tabDay, { en: '02 DAYS', zh: '02 行程' });
  assert.deepEqual(I18N.tabMap, { en: '03 MAP', zh: '03 地图' });
  assert.deepEqual(I18N.tabStay, { en: '04 HOTEL', zh: '04 酒店' });
  assert.deepEqual(I18N.sectionsNav, { en: 'Sections', zh: '页面导航' });
  assert.deepEqual(I18N.citiesNav, { en: 'Cities', zh: '城市' });
  assert.deepEqual(I18N.daysNav, { en: 'Days in this city', zh: '本城市行程日期' });
  assert.deepEqual(I18N.close, { en: 'CLOSE', zh: '关闭' });
  assert.match(appSource, /aria-label="'\+esc\(t\('sectionsNav',state\.lang\)\)/);
  assert.match(appSource, /t\('tabCity',state\.lang\)/);
  assert.match(appSource, /t\('tabDay',state\.lang\)/);
  assert.match(appSource, /t\('tabMap',state\.lang\)/);
  assert.match(appSource, /t\('tabStay',state\.lang\)/);
  assert.match(appSource, /data-close[^>]*>\'\+esc\(t\('close',state\.lang\)\)/);
});

test('A1 renders one continuous city document with four ordered sections and stacked days', () => {
  assert.match(appSource, /function viewCityDocument\(city\)/);
  assert.match(appSource, /data-section-view="overview"[\s\S]*data-section-view="days"[\s\S]*data-section-view="map"[\s\S]*data-section-view="hotel"/);
  assert.match(appSource, /function viewDays\(city\)[\s\S]*city\.days\.map\(function\(day\)/);
  assert.match(appSource, /data-day-view="'\+day\.index\+'"/);
  assert.doesNotMatch(appSource, /state\.tab|data-tab=/);
});

test('A1 compact rails use the approved 34, 44, and 32 pixel geometry', () => {
  assert.match(appSource, /\.gr-tripbar\{[^}]*min-height:calc\(34px \+ env\(safe-area-inset-top, 0px\)\)/);
  assert.match(appSource, /\.gr-cityrail\{[^}]*position:sticky[^}]*top:0[^}]*height:44px/);
  assert.match(appSource, /\.gr-dayrail\{[^}]*position:absolute[^}]*top:44px[^}]*height:32px/);
  assert.match(appSource, /grid-template-columns:repeat\(3,minmax\(0,1fr\)\) 44px/);
  assert.match(appSource, /scroll-margin-top:44px/);
  assert.match(appSource, /scroll-margin-top:76px/);
  assert.match(appSource, /\.gr-tab\{[^}]*min-height:44px/);
});

test('compact trip and day labels remain bilingual and fit the slim rails', () => {
  const { compactTripDates, compactDayLabel } = sharedExports(['compactTripDates', 'compactDayLabel']);
  assert.equal(compactTripDates('Jul 26 – Aug 6, 2026', 'en'), '26 Jul — 6 Aug');
  assert.equal(compactTripDates('2026 年 7 月 26 日 – 8 月 6 日', 'zh'), '7月26日—8月6日');
  assert.equal(compactDayLabel({ dayLabel: 'Sun', date: 'Jul 26' }, 'en'), 'SUN 26');
  assert.equal(compactDayLabel({ dayLabel: '周日', date: '7月26日' }, 'zh'), '周日 26');
});

test('editorial day heading parts localize the date lockup', () => {
  const context = { TRIP, I18N, STOP_IMAGES, GEO };
  context.globalThis = context;
  vm.runInNewContext(`${SHARED_JS}\nglobalThis.dayHeadingPartsForTest = typeof dayHeadingParts === 'function' ? dayHeadingParts : null;`, context);
  assert.equal(typeof context.dayHeadingPartsForTest, 'function');
  assert.deepEqual(
    { ...context.dayHeadingPartsForTest({ dayLabel: 'Sun', date: 'Jul 26' }, 'en') },
    { number: '26', meta: 'SUN · JUL', accessible: 'Sun, Jul 26' },
  );
  assert.deepEqual(
    { ...context.dayHeadingPartsForTest({ dayLabel: '周日', date: '7月26日' }, 'zh') },
    { number: '26', meta: '周日 · 7月', accessible: '周日，7月26日' },
  );
});

test('scrollspy selection is deterministic at section and day boundaries', () => {
  const { activeIndexAtOffset } = sharedExports(['activeIndexAtOffset']);
  const offsets = [78, 720, 2800, 3600];
  assert.equal(activeIndexAtOffset(offsets, 0), 0);
  assert.equal(activeIndexAtOffset(offsets, 719), 0);
  assert.equal(activeIndexAtOffset(offsets, 720), 1);
  assert.equal(activeIndexAtOffset(offsets, 3599), 2);
  assert.equal(activeIndexAtOffset(offsets, 9999), 3);
});

test('section scrollspy accounts for contextual day chrome at both Days boundaries', () => {
  const { sectionIndexAtScroll } = sharedExports(['sectionIndexAtScroll']);
  const offsets = [78, 702, 4971, 6288];
  assert.equal(sectionIndexAtScroll(offsets, 624, 1), 0);
  assert.equal(sectionIndexAtScroll(offsets, 625, 1), 1);
  assert.equal(sectionIndexAtScroll(offsets, 4893, 1), 1);
  assert.equal(sectionIndexAtScroll(offsets, 4894, 1), 2);
  assert.equal(sectionIndexAtScroll(offsets, 6242, 1), 2);
  assert.equal(sectionIndexAtScroll(offsets, 6243, 1), 3);
});

test('stop lookup searches every stacked day rather than only the active day', () => {
  const { loadTrip, findStopById } = sharedExports(['loadTrip', 'findStopById']);
  const city = loadTrip('en').cities[0];
  const lastStop = city.days.at(-1).items.at(-1);
  assert.equal(findStopById(city.days, lastStop.id).id, lastStop.id);
  assert.equal(findStopById(city.days, 'missing-stop'), null);
});

test('Guangzhou overview removes only Char Siu from its food list', () => {
  const guangzhou = TRIP.cities.find((city) => city.id === 'gz');
  assert.equal(guangzhou.mustEats.length, 6);
  assert.equal(guangzhou.mustEats.some((food) => food.name.en === 'Char Siu' || food.name.zh === '叉烧'), false);
});

test('A1 navigation scrolls within the city document without rerendering on scroll', () => {
  assert.match(appSource, /function updateScrollState\(\)/);
  assert.match(appSource, /requestAnimationFrame\(function\(\)[\s\S]*updateScrollState\(\)/);
  assert.match(appSource, /function scrollToSection\(section/);
  assert.match(appSource, /function scrollToDay\(dayIdx/);
  assert.match(appSource, /prefers-reduced-motion: reduce/);
  assert.match(appSource, /data-section="overview"/);
  assert.match(appSource, /data-day=/);
});

test('day rail is frame-level contextual chrome controlled by the active section', () => {
  assert.match(appSource, /function viewDayRail\(city\)/);
  assert.match(appSource, /root\.classList\.toggle\('gr-days-active',daysActive\)/);
  assert.match(appSource, /dayRail\.setAttribute\('aria-hidden',daysActive\?'false':'true'\)/);
  assert.match(appSource, /root\.innerHTML = body \+ viewDayRail\(city\) \+ tabs \+ overlay\(stop\)/);
  assert.match(appSource, /\.gr-dayrail\{[^}]*position:absolute[^}]*top:44px[^}]*visibility:hidden[^}]*pointer-events:none/);
  assert.match(appSource, /\.gr-days-active \.gr-dayrail\{[^}]*visibility:visible[^}]*pointer-events:auto/);
  assert.doesNotMatch(appSource, /function viewDays\(city\)\{[\s\S]*?return rail \+ days;/);
});

test('each day uses one editorial heading before its hero without duplicate kickers', () => {
  assert.match(appSource, /function viewDay\(city, day\)[\s\S]*dayHeadingParts\(day,state\.lang\)/);
  assert.match(appSource, /gr-day-heading[\s\S]*gr-day-number[\s\S]*gr-day-meta[\s\S]*gr-day-heading-title[\s\S]*gr-dayhero/);
  assert.doesNotMatch(appSource, /gr-day-kicker|gr-day-index|gr-daytitle/);
});

test('navigation uses a city-accent underline and a high-contrast language utility', () => {
  assert.match(appSource, /\.gr-tab\.on\{[^}]*background:var\(--paper\)[^}]*color:var\(--ink\)[^}]*font-weight:700[^}]*box-shadow:inset 0 -3px 0 var\(--accent\)/);
  assert.doesNotMatch(appSource, /\.gr-tab\.on\{[^}]*background:var\(--ink\)/);
  assert.match(appSource, /\.gr-lang\{[^}]*background:var\(--ink\)[^}]*color:var\(--near2\)[^}]*font:700/);
  assert.match(appSource, /state\.lang==='en'\?'中文':'EN'/);
});

test('city and language switches preserve the scroll-derived itinerary context', () => {
  assert.match(appSource, /var section = state\.activeSection;[\s\S]*state\.cityIdx = \+el\.dataset\.city; state\.activeDay = 0;[\s\S]*render\(\{section:section\}\)/);
  assert.match(appSource, /var context = captureScrollContext\(\);[\s\S]*state\.lang = state\.lang==='en'\?'zh':'en';[\s\S]*render\(\{context:context\}\)/);
  assert.match(appSource, /options\.section==='days'[\s\S]*querySelector\('\[data-day-view="0"\]'\)/);
});

test('Today badge is integrated into the editorial day metadata', () => {
  assert.match(appSource, /gr-day-meta-row[\s\S]*day\.isToday \? '<span class="gr-today">[\s\S]*gr-day-heading-title/);
  assert.doesNotMatch(appSource, /\.gr-today \+ \.gr-dayhero/);
});

test('nested day anchors are measured in scroll-container coordinates', () => {
  assert.match(appSource, /function elementScrollOffset\(element,scroller\)\{[\s\S]*getBoundingClientRect\(\)\.top[\s\S]*scroller\.scrollTop/);
  assert.match(appSource, /days\.map\(function\(day\)\{ return elementScrollOffset\(day,scroller\); \}\)/);
  assert.match(appSource, /top:Math\.max\(0,elementScrollOffset\(day,scroller\)-76\)/);
});

test('stop dialog uses a fixed-height sheet with a fixed close row and scrolling body', () => {
  assert.match(appSource, /\.gr-sheet\{[^}]*height:82%[^}]*display:flex[^}]*flex-direction:column[^}]*overflow:hidden/);
  assert.match(appSource, /\.gr-close-row\{[^}]*flex:none[^}]*padding:calc\([^}]*safe-area-inset-top[^}]*safe-area-inset-right/);
  assert.match(appSource, /\.gr-sheet-body\{[^}]*flex:1 1 auto[^}]*min-height:0[^}]*overflow-y:auto[^}]*overscroll-behavior:contain[^}]*-webkit-overflow-scrolling:touch/);
  assert.match(appSource, /<div class="gr-close-row">[\s\S]*?<div class="gr-sheet-body">/);
  assert.match(appSource, /return h \+ '<\/div><\/div><\/div>';?/);
  assert.match(appSource, /max-height:600px/);
});

test('language initialization and toggles safely persist only supported languages', () => {
  assert.match(appSource, /var LANGUAGE_STORAGE_KEY = 'china2026\.language';/);
  assert.match(appSource, /function loadLanguage\(\)\{[\s\S]*?try\{[\s\S]*?localStorage\.getItem\(LANGUAGE_STORAGE_KEY\)[\s\S]*?stored==='en' \|\| stored==='zh'[\s\S]*?: 'en';[\s\S]*?catch\(e\)\{ return 'en'; \}/);
  assert.match(appSource, /function saveLanguage\(lang\)\{[\s\S]*?try\{[\s\S]*?localStorage\.setItem\(LANGUAGE_STORAGE_KEY,lang\)[\s\S]*?catch\(e\)\{\}/);
  assert.match(appSource, /var state = \{ lang:loadLanguage\(\)/);
  assert.match(appSource, /state\.lang = state\.lang==='en'\?'zh':'en'; saveLanguage\(state\.lang\); document\.documentElement\.lang = state\.lang;/);
});

test('generated index is the current build output', () => {
  const indexPath = path.join(repoRoot, 'index.html');
  const before = fs.readFileSync(indexPath, 'utf8');
  execFileSync(process.execPath, [path.join(sourceDir, 'build.js')], { cwd: repoRoot });
  assert.equal(fs.readFileSync(indexPath, 'utf8'), before);
});

test('day formatting preserves English and localizes all weekdays and July/August dates in Chinese', () => {
  const { formatDay } = sharedExports(['formatDay']);
  const weekdays = {
    Sun: '周日', Mon: '周一', Tue: '周二', Wed: '周三',
    Thu: '周四', Fri: '周五', Sat: '周六',
  };

  for (const [english, chinese] of Object.entries(weekdays)) {
    const sourceDay = { dayLabel: english, date: 'Jul 26', title: { en: 'Test', zh: '测试' }, items: [] };
    assert.equal(formatDay(sourceDay, 0, 'en', -1).dayLabel, english);
    assert.equal(formatDay(sourceDay, 0, 'zh', -1).dayLabel, chinese);
  }

  const july = { dayLabel: 'Sun', date: 'Jul 26', title: { en: 'Test', zh: '测试' }, items: [] };
  const august = { dayLabel: 'Sun', date: 'Aug 2', title: { en: 'Test', zh: '测试' }, items: [] };
  assert.equal(formatDay(july, 0, 'en', -1).date, 'Jul 26');
  assert.equal(formatDay(july, 0, 'zh', -1).date, '7月26日');
  assert.equal(formatDay(august, 0, 'en', -1).date, 'Aug 2');
  assert.equal(formatDay(august, 0, 'zh', -1).date, '8月2日');

  for (const city of TRIP.cities) {
    for (const sourceDay of city.days) {
      const [, month, day] = /^(Jul|Aug)\s+(\d{1,2})$/.exec(sourceDay.date);
      assert.equal(formatDay(sourceDay, 0, 'en', -1).date, sourceDay.date);
      assert.equal(formatDay(sourceDay, 0, 'zh', -1).date, `${month === 'Jul' ? '7' : '8'}月${Number(day)}日`);
      assert.match(sourceDay.date, /^(Jul|Aug)\s+\d{1,2}$/);
    }
  }
});

test('Today and city-map copy come from exact bilingual I18N strings', () => {
  assert.deepEqual(I18N.today, { en: 'TODAY', zh: '今天' });
  assert.deepEqual(I18N.mapTitle, { en: 'MAP', zh: '地图' });
  assert.deepEqual(I18N.mapHint, {
    en: 'CITY PLACES — TAP TO OPEN IN MAPS',
    zh: '全城地点 · 点击后在地图中打开',
  });
  assert.match(appSource, /t\('today',state\.lang\)/);
  assert.match(appSource, /t\('mapTitle',state\.lang\)/);
  assert.match(appSource, /t\('mapHint',state\.lang\)/);
});

test('city map directory deduplicates destinations in first-occurrence order', () => {
  const { loadTrip, dedupeMapItems } = sharedExports(['loadTrip', 'dedupeMapItems']);
  const expectedCounts = { gz: 19, sh: 20, bj: 21 };

  for (const city of loadTrip('en').cities) {
    const allItems = city.days.flatMap((day) => day.items);
    const expectedFirstOccurrences = [];
    const seenDestinations = new Set();
    for (const item of allItems) {
      const destination = item.mapUrl || `${item.geo ? `${item.geo.lat},${item.geo.lon}` : ''}|${item.searchKey || item.name.main}`;
      if (!seenDestinations.has(destination)) {
        seenDestinations.add(destination);
        expectedFirstOccurrences.push(item.id);
      }
    }

    const directory = dedupeMapItems(allItems);
    assert.equal(directory.length, expectedCounts[city.id]);
    assert.deepEqual(directory.map((item) => item.id), expectedFirstOccurrences);
  }
});

test('map UI has no scope controls and the five-day rail remains single-line on narrow screens', () => {
  assert.doesNotMatch(appSource, /mapScope|data-mapscope|\.gr-seg/);
  assert.match(appSource, /function viewMap\(city\)/);
  assert.match(appSource, /city\.days\.reduce\(function\(items, day\)/);
  assert.match(appSource, /\.gr-dayrail\{[^}]*grid-template-columns/);
  assert.match(appSource, /\.gr-day\{[^}]*min-width:0[^}]*white-space:nowrap/);
  assert.match(appSource, /@media \(max-width:360px\)\{[\s\S]*?\.gr-day\{[^}]*font-size:9px/);
});
