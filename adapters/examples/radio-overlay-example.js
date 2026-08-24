/**
 * Ejemplo de uso del adaptador de Radio Overlay.
 * Muestra cÃ³mo generar y enviar un payload para la web de la radio.
 */

const { buildRadioOverlayPayload, sendRadioOverlay } = require('../radio-overlay-adapter');

const demoEvent = {
  event_id: 'evt-demo-radio-001',
  occurred_at: new Date().toISOString(),
  project: 'worldmos-radio',
  location: { zone_name: 'Tarragona', lat: 41.12, lon: 1.24 },
  phenomenon: 'viento',
  severity: 2,
  intensity_mm_h: undefined,
  source: { name: 'Meteocat', event_id: 'meteo-20260824-2110' },
  message: 'Viento fuerte en Tarragona.',
  status: 'active'
};

async function main() {
  const payload = buildRadioOverlayPayload(demoEvent);
  console.log('Payload radio overlay:', JSON.stringify(payload, null, 2));

  try {
    const result = await sendRadioOverlay(payload);
    console.log('Radio Overlay:', result);
  } catch (err) {
    console.error('Error enviando radio overlay:', err.message);
  }
}

// main();
