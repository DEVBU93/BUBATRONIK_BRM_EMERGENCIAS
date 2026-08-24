// emitter.js
// Genera y despacha un EmergencyWeatherEvent unificado (alarma + señal + ping)

function buildEvent({ lat, lon, zoneName, alertLevel, phenomenon, intensity, source }) {
  const now = new Date().toISOString();
  return {
    event_id: `evt-${Date.now()}-${zoneName.toLowerCase().replace(/\s+/g, '')}`,
    timestamp: now,
    location: { lat, lon, zone_name: zoneName },
    alert_level: alertLevel,
    phenomenon,
    intensity_mm_h: intensity,
    source,
    message: `PING: ${phenomenon} detectado ahora en ${zoneName} (${intensity} mm/h). Nivel ${alertLevel}.`,
    push: { sent: false, channel: 'web_push' },
    status: 'activo'
  };
}

async function dispatch(event, sendFn) {
  await sendFn(event);
  event.push.sent = true;
  event.push.sent_at = new Date().toISOString();
  return event;
}

module.exports = { buildEvent, dispatch };
