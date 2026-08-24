/**
 * Adaptador genÃ©rico de Web Push para Bubatronik Emergencias.
 * DiseÃ±ado para integrarse con un proveedor real (VAPID, Firebase, OneSignal, etc.).
 *
 * Variables de entorno (opcionales segÃºn proveedor):
 * - WEBPUSH_SERVICE_URL
 * - WEBPUSH_AUTH
 */

const WEBPUSH_SERVICE_URL = process.env.WEBPUSH_SERVICE_URL;
const WEBPUSH_AUTH = process.env.WEBPUSH_AUTH;

function buildNotification(event) {
  const severityLabel = ['Muy bajo', 'Bajo', 'Moderado', 'Alto', 'Muy alto', 'Extremo'][event.severity] || 'Desconocido';
  return {
    title: `${event.phenomenon.toUpperCase()} â€” ${event.location.zone_name}`,
    body: `Nivel ${event.severity} (${severityLabel})${event.intensity_mm_h ? ` Â · ${event.intensity_mm_h} mm/h` : ''}`,
    data: {
      event_id: event.event_id,
      project: event.project,
      phenomenon: event.phenomenon,
      severity: event.severity,
      url: `/emergency?event=${event.event_id}`
    },
    tag: `bubatronik-${event.project}-${event.phenomenon}-${event.event_id}`,
    requireInteraction: event.severity >= 3,
    priority: event.severity >= 3 ? 'high' : 'normal'
  };
}

async function sendWebPush(event, { subscriptions = [], serviceUrl = WEBPUSH_SERVICE_URL, auth = WEBPUSH_AUTH } = {}) {
  if (!subscriptions || subscriptions.length === 0) {
    return { ok: true, provider: 'webpush', sent: 0, skipped: 0 };
  }

  const notification = buildNotification(event);
  let sent = 0;
  let skipped = 0;
  const errors = [];

  for (const sub of subscriptions) {
    try {
      // IntegraciÃ³n genÃ©rica: aquÃ¬ irÃ¬a la llamada al proveedor real
      if (serviceUrl) {
        await fetch(serviceUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(auth ? { Authorization: auth } : {})
          },
          body: JSON.stringify({ subscription: sub, notification })
        });
      }
      sent++;
    } catch (err) {
      skipped++;
      errors.push(err.message);
    }
  }

  return { ok: true, provider: 'webpush', sent, skipped, errors };
}

module.exports = { buildNotification, sendWebPush };
