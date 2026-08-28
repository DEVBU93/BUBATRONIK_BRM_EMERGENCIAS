const assert = require('node:assert');
const { validateAndNormalize, createMemoryDeduper } = require('../src/emergency-event');

// Simple synchronous tests suitable for `node --test` or `npm test` (if configured)

// test 1: validateAndNormalize accepts a valid event
(function testValidate() {
  const ev = {
    event_id: 'evt-demo-001',
    occurred_at: '2026-08-24T16:32:00Z',
    project: 'emergencias',
    location: { zone_name: 'Sant Salvador', lat: 41.045, lon: 1.21 },
    phenomenon: 'lluvia',
    severity: 2,
    source: { name: 'Meteocat', event_id: 'meteo-20260824-1832' },
    message: 'Lluvia detectada en Sant Salvador.',
    status: 'active'
  };
  const out = validateAndNormalize(ev);
  assert.strictEqual(out.project, 'emergencias');
  assert.ok(out.dedupe_key && out.dedupe_key.includes('emergencias'));
  console.log('OK: validateAndNormalize valid event');
})();

// test 2: deduper TTL behaviour
(async function testDeduperTTL() {
  const d = createMemoryDeduper(1); // 1 second TTL
  d.add('k1');
  assert.strictEqual(d.has('k1'), true);
  // wait slightly more than 1s
  await new Promise(r => setTimeout(r, 1100));
  assert.strictEqual(d.has('k1'), false);
  console.log('OK: createMemoryDeduper TTL expiry');
})();
