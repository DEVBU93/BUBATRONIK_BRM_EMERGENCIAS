/**
 * Ejemplo de uso del adaptador de Web Push.
 * Ilustra cÃ³mo enviar una notificaciÃ³n a una lista de suscripciones.
 */

const { sendWebPush } = require('../webpush-adapter');

const demoEvent = {
  event_id: 'evt-demo-webpush-001',
  occurred_at: new Date().toISOString(),
  project: 'emergencias',
  location: { zone_name: 'Sant Salvador', lat: 41.045, lon: 1.21 },
  phenomenon: 'lluvia',
  severity: 2,
  intensity_mm_h: 18.5,
  source: { name: 'Meteocat', event_id: 'meteo-20260824-1832' },
  message: 'Lluvia detectada en Sant Salvador.',
  status: 'active'
};

const demoSubscriptions = [
  { endpoint: 'https://fcm.googleapis.com/...', keys: { p256dh: '...', auth: '...' } }
];

async function main() {
  try {
    const result = await sendWebPush(demoEvent, { subscriptions: demoSubscriptions });
    console.log('Web Push:', result);
  } catch (err) {
    console.error('Error enviando Web Push:', err.message);
  }
}

// main();
