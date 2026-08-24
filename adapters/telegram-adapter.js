/**
 * Adaptador de Telegram para Bubatronik Emergencias.
 * EnvÃ¬a alertas como mensajes a un chat o canal de Telegram.
 *
 * Variables de entorno:
 * - TELEGRAM_BOT_TOKEN
 * - TELEGRAM_CHAT_ID
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const BASE_URL = 'https://api.telegram.org/bot';

function buildMessage(event) {
  const severityLabel = ['Muy bajo', 'Bajo', 'Moderado', 'Alto', 'Muy alto', 'Extremo'][event.severity] || 'Desconocido';
  const lines = [
    `ð°£· *${event.phenomenon.toUpperCase()}* â€” ${event.location.zone_name}`,
    `Nivel: ${event.severity} (${severityLabel})`,
    event.intensity_mm_h ? `Intensidad: ${event.intensity_mm_h} mm/h` : null,
    `Fuente: ${event.source.name}${event.source.event_id ? ` (${event.source.event_id})` : ''}`,
    event.message ? `Detalle: ${event.message}` : null,
    `Estado: ${event.status}`,
    `Proyecto: ${event.project}`,
    `Hora: ${new Date(event.occurred_at).toLocaleString('es-ES')}`
  ].filter(Boolean);

  return {
    text: lines.join('\n'),
    parse_mode: 'Markdown'
  };
}

async function sendTelegramAlert(event, { chatId = TELEGRAM_CHAT_ID, botToken = TELEGRAM_BOT_TOKEN } = {}) {
  if (!botToken || !chatId) {
    throw new Error('TELEGRAM_BOT_TOKEN y TELEGRAM_CHAT_ID deben estar configurados');
  }

  const message = buildMessage(event);
  const url = `${BASE_URL}${botToken}/sendMessage`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      ...message,
      disable_notification: event.severity <= 1
    })
  });

  const data = await res.json();
  if (!res.ok || !data.ok) {
    throw new Error(`Telegram error: ${data.description || res.status}`);
  }

  return { ok: true, provider: 'telegram', message_id: data.result?.message_id };
}

module.exports = { buildMessage, sendTelegramAlert };
