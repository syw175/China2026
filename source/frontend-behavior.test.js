const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { I18N } = require('./data.js');

const sourceDir = __dirname;
const repoRoot = path.resolve(sourceDir, '..');
const appSource = fs.readFileSync(path.join(sourceDir, 'app.js'), 'utf8');

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
