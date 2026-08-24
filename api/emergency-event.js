const { validateAndNormalize, createMemoryDeduper } = require('../src/emergency-event');

const deduper = createMemoryDeduper();

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  try {
    const event = validateAndNormalize(req.body);
    const duplicate = deduper.has(event.dedupe_key);
    if (!duplicate) deduper.add(event.dedupe_key);
    return res.status(duplicate ? 200 : 202).json({ ok: true, duplicate, event });
  } catch (error) {
    return res.status(400).json({ ok: false, error: 'invalid_event', message: error.message });
  }
};