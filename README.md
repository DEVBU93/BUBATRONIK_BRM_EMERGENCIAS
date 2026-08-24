# Bubatronik Emergencias

Sistema unificado de alertas meteorológicas para WorldMOS, T&O, Fluviaria y futuros proyectos.

## Estructura

```
bubatronik-emergencias/
├── adapters/          # Telegram, Web Push, Radio Overlay
├── api/               # Endpoint Vercel (/api/emergency-event)
├── design/            # Tokens CSS y guía para Lovable
├── docs/              # Documentación de integración
├── examples/          # Ejemplos de eventos
├── public/            # index.html (dashboard + Lovable)
├── src/               # Núcleo validador de eventos
└── DEPLOY_GODADDY_GITHUB.md
```

## Uso rápido

### 1) Dashboard

Abre `public/index.html` localmente o despliega en Vercel:

- Framework: `Other`
- Output directory: `public`

### 2) API

```bash
POST https://bubatronik-emergencias.vercel.app/api/emergency-event
Content-Type: application/json

{
  "event_id": "evt-demo-001",
  "occurred_at": "2026-08-24T16:32:00Z",
  "project": "emergencias",
  "location": { "zone_name": "Sant Salvador", "lat": 41.045, "lon": 1.21 },
  "phenomenon": "lluvia",
  "severity": 2,
  "intensity_mm_h": 18.5,
  "source": { "name": "Meteocat", "event_id": "meteo-20260824-1832" },
  "message": "Lluvia detectada en Sant Salvador.",
  "status": "active"
}
```

### 3) Adaptadores

```js
const { sendTelegramAlert } = require('./adapters/telegram-adapter');
const { sendWebPush } = require('./adapters/webpush-adapter');
const { buildRadioOverlayPayload, sendRadioOverlay } = require('./adapters/radio-overlay-adapter');
```

## Dominio

- Producción: `brm.worldmos.es`
- Ver `DEPLOY_GODADDY_GITHUB.md` para configurar DNS en GoDaddy.

## Tests

```bash
npm test
npm run check
```

## Licencia

CC0-1.0
