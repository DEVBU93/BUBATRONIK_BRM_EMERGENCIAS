const PHENOMENA = new Set([
  'lluvia',
  'tormenta',
  'viento',
  'nieve',
  'calor',
  'inundacion',
  'otro'
]);

const STATUSES = new Set(['active', 'resolved', 'expired', 'rejected']);
const PROJECTS = new Set(['emergencias', 'to', 'fluviaria', 'worldmos-radio', 'other']);

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function asTrimmedString(value, field, { required = true, max = 200 } = {}) {
  if (value === undefined || value === null || value === '') {
    if (required) throw new Error(`${field} is required`);
    return undefined;
  }
  if (typeof value !== 'string') throw new Error(`${field} must be a string`);
  const result = value.trim();
  if (!result && required) throw new Error(`${field} is required`);
  if (result.length > max) throw new Error(`${field} exceeds ${max} characters`);
  return result || undefined;
}

function numberInRange(value, field, min, max) {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error(`${field} must be a finite number`);
  if (value < min || value > max) throw new Error(`${field} must be between ${min} and ${max}`);
  return value;
}

function isoDate(value, field) {
  const parsed = new Date(value);
  if (!value || Number.isNaN(parsed.getTime())) throw new Error(`${field} must be a valid ISO date`);
  return parsed.toISOString();
}

function validateAndNormalize(input, { now = new Date() } = {}) {
  if (!isObject(input)) throw new Error('event must be an object');

  const eventId = asTrimmedString(input.event_id, 'event_id', { max: 120 });
  const project = asTrimmedString(input.project, 'project', { max = 40 });
  if (!PROJECTS.has(project)) throw new Error(`project must be one of: ${[...PROJECTS].join(', ')}`);

  const location = input.location;
  if (!isObject(location)) throw new Error('location is required');
  const zoneName = asTrimmedString(location.zone_name, 'location.zone_name', { max: 160 });
  const lat = numberInRange(location.lat, 'location.lat', -90, 90);
  const lon = numberInRange(location.lon, 'location.lon', -180, 180);

  const phenomenon = asTrimmedString(input.phenomenon, 'phenomenon', { max = 30 });
  if (!PHENOMENA.has(phenomenon)) throw new Error(`phenomenon must be one of: ${[...PHENOMENA].join(', ')}`);

  const severity = numberInRange(input.severity, 'severity', 0, 5);
  if (!Number.isInteger(severity)) throw new Error('severity must be an integer');
  const occurredAt = isoDate(input.occurred_at, 'occurred_at');
  const status = input.status || 'active';
  if (!STATUSES.has(status)) throw new Error(`status must be one of: ${[...STATUSES].join(', ')}`);

  const source = isObject(input.source) ? input.source : {};
  const sourceName = asTrimmedString(source.name, 'source.name', { max = 80 });
  const sourceEventId = asTrimmedString(source.event_id, 'source.event_id', { required: false, max: 120 });
  const message = asTrimmedString(input.message, 'message', { max: 500 });
  const intensity = input.intensity_mm_h === undefined ? undefined : numberInRange(input.intensity_mm_h, 'intensity_mm_h', 0, 1000);
  const dedupeKey = asTrimmedString(input.dedupe_key || `${project}:${phenomenon}:${zoneName}:${sourceEventId || occurredAt}`, 'dedupe_key', { max: 240 });

  return {
    schema_version: '1.0.0',
    event_id: eventId,
    dedupe_key: dedupeKey,
    occurred_at: occurredAt,
    received_at: new Date(now).toISOString(),
    project,
    location: { zone_name: zoneName, lat, lon },
    phenomenon,
    severity,
    ...(intensity === undefined ? {} : { intensity_mm_h: intensity }),
    source: { name: sourceName, ...(sourceEventId ? { event_id: sourceEventId } : {}) },
    message,
    delivery: {
      channel: input.delivery?.channel || 'none',
      status: input.delivery?.status || 'pending'
    },
    status
  };
}

function createMemoryDeduper() {
  const seen = new Set();
  return {
    has(key) { return seen.has(key); },
    add(key) { seen.add(key); }
  };
}

module.exports = { PHENOMENA, STATUSES, validateAndNormalize, createMemoryDeduper };