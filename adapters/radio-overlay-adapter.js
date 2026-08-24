/**
 * Adaptador de Radio Overlay para Bubatronik Emergencias.
 * Genera un payload para mostrar un banner/overlay en la web de la radio.
 *
 * Variables de entorno (opcionales):
 * - RADIO_OVERLAY_WEBHOOK_URL
 */

const RADIO_OVERLAY_WEBHOOK_URL = process.env.RADIO_OVERLAY_WEBHOOK_URL;

function buildRadioOverlayPayload(event) {
  const severityColor = {
    0: '#5ee6a8',
    1: '#5ee6a8',
    2: '#ffd166',
    3: '#ff9f45',
    4: '#ff6b7a',
    5: '#ff3b30'
  }[event.severity] || '#ffd166';

  const severityLabel = ['Muy bajo', 'Bajo', 'Moderado', 'Alto', 'Muy alto', 'Extremo'][event.severity] || 'Desconocido';

  return {
    event_id: event.event_id,
    project: event.project,
    visible: event.status === 'active',
    banner: {
      text: `${event.phenomenon.toUpperCase()} â€” ${event.location.zone_name}`,
      subtext: `Nivel ${event.severity} (${severityLabel})${event.intensity_mm_h ? ` Â · ${event.intensity_mm_h} mm/h` : ''}`,
      color: severityColor,
      icon: event.phenomenon === 'lluvia' ? 'ð°£§' : event.phenomenon === 'tormenta' ? 'â°¡' : event.phenomenon === 'viento' ? 'ð°·¬' : 'ð°£·'
    },
    meta: {
      source: event.source.name,
      occurred_at: event.occurred_at,
      severity: event.severity
    }
  };
}

async function sendRadioOverlay(payload, { webhookUrl = RADIO_OVERLAY_WEBHOOK_URL } = {}) {
  if (!webhookUrl) {
    // En modo demo, solo devolvemos el payload
    return { ok: true, provider: 'radio-overlay', payload, sent: false, reason: 'no webhook configured' };
  }

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error(`Radio overlay webhook error: ${res.status}`);
  }

  return { ok: true, provider: 'radio-overlay', payload, sent: true };
}

module.exports = { buildRadioOverlayPayload, sendRadioOverlay };
