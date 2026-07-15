// Build the single self-contained itinerary site: source/*  ->  ../index.html
// Run:  node source/build.js   (from the project root)  or  node build.js (from source/)
const fs = require('fs');
const path = require('path');
const { TRIP, I18N } = require('./data.js');
const { SHARED_JS } = require('./shared.js');
const { buildA } = require('./app.js');

const OUT = path.join(__dirname, '..', 'index.html');
const DATA_JSON = { TRIP: JSON.stringify(TRIP), I18N: JSON.stringify(I18N) };

function fullDoc(inner) {
  return '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
    + '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
    + inner + '\n</body>\n</html>\n';
}

fs.writeFileSync(OUT, fullDoc(buildA(DATA_JSON, SHARED_JS)));
console.log('wrote', OUT, (fs.statSync(OUT).size / 1024).toFixed(1) + 'kb');
