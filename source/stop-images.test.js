const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { TRIP } = require('./data.js');

const EXPECTED_CHOICES = {
  x2: 'x2-c', x3: 'x3-a', x4: 'x4-c', x6: 'x6-b',
  x7: 'x7-a', x8: 'x8-b', x9: 'x9-a', x10: 'x10-a', x12: 'x12-a',
  x16: 'x16-a', x20: 'x20-a', x21: 'x21-b',
  x27: 'x27-a', x28: 'x28-b', x29: 'x29-d', x30: 'x30-a', x31: 'x31-a',
  x32: 'x32-a', x33: 'x33-d', x34: 'x34-d', x35: 'x35-a', x36: 'x36-a',
  x37: 'x37-c', x38: 'x38-a', x40: 'x40-b', x41: 'x41-b', x44: 'x44-a',
  x48: 'x48-c', x49: 'x49-a', x53: 'x53-d', x54: 'x54-a', x55: 'x55-a',
  x56: 'x56-b', x57: 'x57-d', x58: 'x58-b', x62: 'x62-a', x63: 'x63-a',
  x64: 'x64-d', x65: 'x65-a', x67: 'x67-c', x68: 'x68-b', x71: 'x71-a',
};

const manifestPath = path.join(__dirname, 'stop-images.js');
const repoRoot = path.resolve(__dirname, '..');

function loadManifest() {
  assert.ok(fs.existsSync(manifestPath), 'source/stop-images.js must exist');
  delete require.cache[require.resolve(manifestPath)];
  return require(manifestPath).STOP_IMAGES;
}

test('stop-photo manifest matches all 42 approved candidate choices', () => {
  const stopImages = loadManifest();
  assert.deepEqual(
    Object.fromEntries(Object.entries(stopImages).map(([id, image]) => [id, image.candidateId])),
    EXPECTED_CHOICES,
  );

  const itineraryItems = TRIP.cities.flatMap((city) => city.days.flatMap((day) => day.items));
  const itineraryById = new Map(itineraryItems.map((item) => [item.id, item]));
  assert.equal(Object.keys(stopImages).length, 42);

  for (const [id, image] of Object.entries(stopImages)) {
    assert.ok(itineraryById.has(id), `${id} must exist in the itinerary`);
    assert.notEqual(itineraryById.get(id).type, 'transit', `${id} must not be transit`);
    assert.equal(image.smallSrc, `images/stops/${id}-640.webp`);
    assert.equal(image.largeSrc, `images/stops/${id}-1280.webp`);
    assert.ok(image.alt?.trim(), `${id} needs descriptive alt text`);
    assert.ok(image.sourceUrl?.startsWith('https://'), `${id} needs a source URL`);
    assert.ok(image.owner?.trim(), `${id} needs owner metadata`);
    assert.ok(image.rightsStatus?.trim(), `${id} needs rights metadata`);
  }
});

test('every approved stop has readable 640px and 1280px WebP assets', () => {
  const stopImages = loadManifest();
  const expectedDimensions = new Map([
    ['smallSrc', '640 400 WEBP'],
    ['largeSrc', '1280 800 WEBP'],
  ]);
  const assetPaths = [];
  let totalBytes = 0;

  for (const [id, image] of Object.entries(stopImages)) {
    for (const [property, dimensions] of expectedDimensions) {
      const assetPath = path.join(repoRoot, image[property]);
      assert.ok(fs.existsSync(assetPath), `${id} is missing ${image[property]}`);
      const identified = execFileSync(
        'magick',
        ['identify', '-format', '%w %h %m', assetPath],
        { encoding: 'utf8' },
      );
      assert.equal(identified, dimensions, `${image[property]} has the wrong delivery format`);
      totalBytes += fs.statSync(assetPath).size;
      assetPaths.push(image[property]);
    }
  }

  assert.equal(assetPaths.length, 84);
  assert.equal(new Set(assetPaths).size, 84, 'responsive asset paths must be unique');
  assert.ok(totalBytes < 8 * 1024 * 1024, `responsive assets exceed 8 MiB: ${totalBytes}`);
});

test('the stop overlay uses responsive mapped media without a placeholder fallback', () => {
  const appSource = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
  const buildSource = fs.readFileSync(path.join(__dirname, 'build.js'), 'utf8');
  const sharedSource = fs.readFileSync(path.join(__dirname, 'shared.js'), 'utf8');

  assert.doesNotMatch(appSource, /STOP\.JPG/);
  assert.match(appSource, /srcset=/);
  assert.match(appSource, /calc\(100vw - 40px\)/);
  assert.match(appSource, /loading="lazy"/);
  assert.match(appSource, /onerror=/);
  assert.match(appSource, /max-height:600px/);
  assert.match(buildSource, /STOP_IMAGES/);
  assert.match(sharedSource, /photo:\s*STOP_IMAGES\[it\.id\]\s*\|\|\s*null/);
});
