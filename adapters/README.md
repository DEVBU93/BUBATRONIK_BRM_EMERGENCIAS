# Adapters — Bubatronik Emergencias

Adaptadores para conectar el evento canÃ³nico a canales reales sin modificar el nÃºcleo validador.

## Principios

- El validador (`src/emergency-event.js`) es la ÃƒÂºnica fuente de verdad del evento.
- Los adaptadores solo leen el evento validado y lo envÃ¬an a un canal.
- Cada adaptador es intercambiable y puede activarse/desactivarse por proyecto.
- Las credenciales y URLs sensibles van en variables de entorno, nunca en el repo.

## Adaptadores incluidos

### Telegram (`telegram-adapter.js`)

EnvÃ¬a un mensaje a un chat o canal de Telegram usando un bot.

Variables de entorno:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

Uso tÃ¬pico:

```js
const { sendTelegramAlert } = require('./adapters/telegram-adapter');
await sendTelegramAlert(event);
```

### Web Push (`webpush-adapter.js`)

Interfaz genÃ©rica para Web Push (por integrar con un proveedor real: VAPID, Firebase, OneSignal, etc.).

Variables de entorno:

- `WEBPUSH_SERVICE_URL` (opcional, segÃºn proveedor)
- `WEBPUSH_AUTH` (opcional)

Uso tÃ¬pico:

```js
const { sendWebPush } = require('./adapters/webpush-adapter');
await sendWebPush(event, { subscriptions: [...] });
```

### Radio Overlay (`radio-overlay-adapter.js`)

Genera un payload para mostrar un banner o overlay en la web de la radio (ej. `brm.worldmos.world`, `brm.worldmos.info`).

Variables de entorno:

- `RADIO_OVERLAY_WEBHOOK_URL` (opcional, si se usa webhook)

Uso tÃ¬pico:

```js
const { buildRadioOverlayPayload, sendRadioOverlay } = require('./adapters/radio-overlay-adapter');
const payload = buildRadioOverlayPayload(event);
await sendRadioOverlay(payload);
```

## CÃ³mo usar en Vercel

En `api/emergency-event.js` o en un endpoint especÃ¬fico:

```js
const { validateAndNormalize } = require('../src/emergency-event');
const { sendTelegramAlert } = require('../adapters/telegram-adapter');
const { sendWebPush } = require('../adapters/webpush-adapter');

// despuÃ©s de validar el evento:
const event = validateAndNormalize(req.body);

// elegir adaptadores segÃºn proyecto o configuraciÃ³n
if (event.project === 'worldmos-radio') {
  await sendTelegramAlert(event);
}
if (event.project === 'emergencias') {
  await sendWebPush(event, { subscriptions: [...] });
}
```

## Seguridad

- No loguear tokens ni URLs completas con credenciales.
- Validar que el evento estÃ© en estado `active` antes de enviar.
- Implementar rate limiting y control de permisos por proyecto.
- Usar listas de suscriptores con consentimiento explÃ¬cito.
