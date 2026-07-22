const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { TRIP } = require('./data.js');

const EXPECTED_CHOICES = {
  'gz-d1': 'gz-d1-d',
  'gz-d2': 'gz-d2-d',
  'gz-d3': 'gz-d3-e',
  'gz-d4': 'gz-d4-e',
  'sh-d1': 'sh-d1-a',
  'sh-d2': 'sh-d2-b',
  'sh-d3': 'sh-d3-a',
  'sh-d4': 'sh-d4-e',
  'sh-d5': 'sh-d5-c',
  'bj-d1': 'bj-d1-d',
  'bj-d2': 'bj-d2-a',
  'bj-d3': 'bj-d3-e',
  'bj-d4': 'bj-d4-a',
};

const EXPECTED_HASHES = {
  'bj-1.webp': '1ef8275859dbbb23ad987a5139f79d7c82c69c32e29753896c8add51af52e204',
  'bj-2.webp': '3eeb091976bf67e3d89577d14edad7645626ca6e608aab84dbc5d2959e5893a1',
  'bj-3.webp': '41ee7ced93d01c45f904576b669264761b08ba7096455859eb8eb3152b02ee53',
  'bj-4.webp': '1505b22e6a74a3db13170b43b3c689dc5727cbc6d84aa90aae3abc2f8e65c2de',
  'gz-1.webp': 'f38963f3a63e614e16a0890d64adee6b93db676336ae75368372e9f0e24e63f5',
  'gz-2.webp': '829fa6e1bb063be72439fd2d9548430302b64bd25560f77260a426e55d48e002',
  'gz-3.webp': '11dee72be4d38c93a4825458d94d688aa993f6d926fb73a7a94207390690c669',
  'gz-4.webp': '1888346ca97f69bd3c539cd9cae3534873a41842a1db03615f3fe76fec8c7f84',
  'sh-1.webp': 'e7dc619cecd0cb557537b67f37a362c9b26f4fa94c0f4add7c07681d8ef64a02',
  'sh-2.webp': '668b763c0898e1f0b9663a4404575bc64591ffb1e0ad41632b3fb94645dce4c9',
  'sh-3.webp': '120b66a8890f94a924f1daefa5571b08440065b735a2fd6ee1a641534a1d742a',
  'sh-4.webp': '21599443798ea17f2818249f9d20cfaa77e9f862342b34834ce01218913994a8',
  'sh-5.webp': '21e1beacaf71f6d46545704f2fc5ee2ad245eff23c8e0079c0fbf86c900efd62',
};

const manifestPath = path.join(__dirname, 'day-images.js');
const repoRoot = path.resolve(__dirname, '..');

function loadManifest() {
  assert.ok(fs.existsSync(manifestPath), 'source/day-images.js must exist');
  delete require.cache[require.resolve(manifestPath)];
  return require(manifestPath).DAY_IMAGES;
}

test('day heroes match all 13 approved selections and delivery assets', () => {
  const dayImages = loadManifest();
  assert.deepEqual(
    Object.fromEntries(Object.entries(dayImages).map(([id, image]) => [id, image.candidateId])),
    EXPECTED_CHOICES,
  );

  const itinerarySlots = new Set(TRIP.cities.flatMap((city) =>
    city.days.map((day, index) => `${city.id}-d${index + 1}`)));
  assert.equal(Object.keys(dayImages).length, 13);

  for (const [slotId, image] of Object.entries(dayImages)) {
    assert.ok(itinerarySlots.has(slotId), `${slotId} must exist in the itinerary`);
    const assetName = slotId.replace('-d', '-') + '.webp';
    assert.equal(image.src, `images/${assetName}`);
    assert.ok(image.alt?.trim(), `${slotId} needs descriptive alt text`);
    assert.ok(image.sourceUrl?.startsWith('https://'), `${slotId} needs a source URL`);
    assert.ok(image.owner?.trim(), `${slotId} needs owner metadata`);
    assert.ok(image.rightsStatus?.trim(), `${slotId} needs rights metadata`);

    const assetPath = path.join(repoRoot, image.src);
    assert.ok(fs.existsSync(assetPath), `${slotId} is missing ${image.src}`);
    const identified = execFileSync(
      'magick',
      ['identify', '-format', '%w %h %m', assetPath],
      { encoding: 'utf8' },
    );
    assert.equal(identified, '1280 720 WEBP', `${image.src} has the wrong delivery format`);
    const digest = crypto.createHash('sha256').update(fs.readFileSync(assetPath)).digest('hex');
    assert.equal(digest, EXPECTED_HASHES[assetName], `${image.src} is not the approved crop`);
  }
});

test('the legacy city-image processor cannot overwrite approved day heroes', () => {
  const processor = fs.readFileSync(path.join(__dirname, 'tools', 'process-images.sh'), 'utf8');
  assert.match(processor, /day-images\.js/);
  assert.doesNotMatch(processor, /crop(?:_at)?\s+[^\n]+\s+(?:gz|sh|bj)-\d+\.webp/);
});
