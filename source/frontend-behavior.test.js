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

test('city view has no accommodation CTA while the dedicated Stay tab remains', () => {
  assert.doesNotMatch(appSource, /gr-cta/);
  assert.match(appSource, /data-tab="hotel"/);
  assert.match(appSource, /t\('tabStay',state\.lang\)/);
});

test('bottom navigation and dialog close text are driven by exact translations', () => {
  assert.deepEqual(I18N.tabCity, { en: '01 CITY', zh: '01 城市' });
  assert.deepEqual(I18N.tabDay, { en: '02 DAYS', zh: '02 行程' });
  assert.deepEqual(I18N.tabMap, { en: '03 MAP', zh: '03 地图' });
  assert.deepEqual(I18N.tabStay, { en: '04 STAY', zh: '04 住宿' });
  assert.deepEqual(I18N.sectionsNav, { en: 'Sections', zh: '页面导航' });
  assert.deepEqual(I18N.close, { en: 'CLOSE', zh: '关闭' });
  assert.match(appSource, /aria-label="'\+esc\(t\('sectionsNav',state\.lang\)\)/);
  assert.match(appSource, /t\('tabCity',state\.lang\)/);
  assert.match(appSource, /t\('tabDay',state\.lang\)/);
  assert.match(appSource, /t\('tabMap',state\.lang\)/);
  assert.match(appSource, /t\('tabStay',state\.lang\)/);
  assert.match(appSource, /data-close[^>]*>\'\+esc\(t\('close',state\.lang\)\)/);
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

test('map UI has no scope controls and the five-day selector has a narrow-screen treatment', () => {
  assert.doesNotMatch(appSource, /mapScope|data-mapscope|\.gr-seg/);
  assert.match(appSource, /function viewMap\(city\)/);
  assert.match(appSource, /city\.days\.reduce\(function\(items, day\)/);
  assert.match(appSource, /@media \(max-width:360px\)\{[\s\S]*?\.gr-day\{[^}]*min-width:0/);
  assert.match(appSource, /@media \(max-width:360px\)\{[\s\S]*?\.gr-day-w\{[^}]*white-space:nowrap/);
  assert.match(appSource, /@media \(max-width:360px\)\{[\s\S]*?\.gr-day-d\{[^}]*white-space:nowrap/);
});
