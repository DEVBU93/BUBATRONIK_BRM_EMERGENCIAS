const { validateAndNormalize, createMemoryDeduper } = require('../src/emergency-event');

const deduper = createMemoryDeduper(3600); // 1 hour TTL by default

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  // Content-Type enforcement: only application/json accepted
  const contentType = (req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
  if (contentType !== 'application/json') {
    return res.status(415).json({ ok: false, error: 'unsupported_media_type' });
  }

  // Basic payload size guard (if Content-Length provided)
  const len = parseInt(req.headers['content-length'] || '0', 10) || 0;
  const MAX_LEN = 100 * 1024; // 100 KB
  if (len > 0 && len > MAX_LEN) {
    return res.status(413).json({ ok: false, error: 'payload_too_large' });
  }

  try {
    const event = validateAndNormalize(req.body);
    // dedupe key present in normalized event
    const duplicate = deduper.has(event.dedupe_key);
    if (!duplicate) deduper.add(event.dedupe_key);
    // 202 = accepted (new), 200 = duplicate
    return res.status(duplicate ? 200 : 202).json({ ok: true, duplicate, event });
  } catch (error) {
    return res.status(400).json({ ok: false, error: 'invalid_event', message: error.message });
  }
};
