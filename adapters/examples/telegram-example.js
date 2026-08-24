/**
 * Ejemplo de uso del adaptador de Telegram.
 * Este archivo es solo ilustrativo y no debe ejecutarse directamente en producciÃ³n sin configurar las variables de entorno.
 */

const { sendTelegramAlert } = require('../telegram-adapter');

const demoEvent = {
  event_id: 'evt-demo-telegram-001',
  occurred_at: new Date().toISOString(),
  project: 'worldmos-radio',
  location: { zone_name: 'Camp de Tarragona', lat: 41.1, lon: 1.2 },
  phenomenon: 'tormenta',
  severity: 3,
  intensity_mm_h: 32,
  source: { name: 'AEMET', event_id: 'aemet-20260824-1745' },
  message: 'Tormenta fuerte detectada en la zona.',
  status: 'active'
};

async function main() {
  try {
    const result = await sendTelegramAlert(demoEvent);
    console.log('Telegram:', result);
  } catch (err) {
    console.error('Error enviando a Telegram:', err.message);
  }
}

// main();
