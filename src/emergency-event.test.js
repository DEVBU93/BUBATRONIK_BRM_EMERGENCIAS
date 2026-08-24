const assert = require('node:assert/strict');
const test = require('node:test');
const { validateAndNormalize, createMemoryDeduper } = require('./emergency-event');

const baseEvent = {
  event_id: 'evt-sant-salvador-20260824-1832',
  occurred_at: '2026-08-24T16:32:00Z',
  project: 'emergencias',
  location: { zone_name: 'Sant Salvador, Camp de Tarragona', lat: 41.045, lon: 1.21 },
  phenomenon: 'lluvia',
  severity: 2,
  intensity_mm_h: 18.5,
  source: { name: 'Meteocat', event_id: 'meteo-20260824-1832' },
  message: 'Lluvia detectada en Sant Salvador.'
};

test('normalizes a valid event', () => {
  const result = validateAndNormalize(baseEvent, { now: new Date('2026-08-24T16:33:00Z') });
  assert.equal(result.schema_version, '1.0.0');
  assert.equal(result.received_at, '2026-08-24T16:33:00.000Z');
  assert.equal(result.location.zone_name, 'Sant Salvador, Camp de Tarragona');
});

test('rejects invalid coordinates', () => {
  assert.throws(() => validateAndNormalize({ ...baseEvent, location: { ...baseEvent.location, lat: 95 } }), /location.lat/);
});

test('rejects unsupported severity', () => {
  assert.throws(() => validateAndNormalize({ ...baseEvent, severity: 6 }), /severity/);
});

test('deduper identifies repeated keys', () => {
  const deduper = createMemoryDeduper();
  assert.equal(deduper.has('x'), false);
  deduper.add('x');
  assert.equal(deduper.has('x'), true);
});