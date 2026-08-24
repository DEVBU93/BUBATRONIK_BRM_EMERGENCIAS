# Bubatronik Emergencias

Sistema unificado de alertas meteorolÃ³gicas para WorldMOS, T&O, Fluviaria y futuros proyectos.

## Estructura

```
bubatronik-emergencias/
â»°â»º adapters/          # Telegram, Web Push, Radio Overlay
â»°â»º api/               # Endpoint Vercel (/api/emergency-event)
â»°â»º design/            # Tokens CSS y guÃ¬a para Lovable
â»°â»º docs/              # DocumentaciÃ³n de integraciÃ³n
â»°â»º examples/          # Ejemplos de eventos
â»°â»º public/            # index.html (dashboard + Lovable)
â»°â»º src/               # NÃºcleo validador de eventos
```

## Uso rÃ¡pido

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

## Proyectos Bubatronik

| Proyecto | Dominio | Repo |
|----------|---------|------|
| Emergencias | `brm.worldmos.es` | [bubatronik-emergencias](https://github.com/DEVBU93/bubatronik-emergencias) |
| BRM World | `brm.worldmos.world` | [BUBATRONIK_BRM_WORLD](https://github.com/DEVBU93/BUBATRONIK_BRM_WORLD) |
| BRM Info | `brm.worldmos.info` | [BUBATRONIK_BRM_INFO](https://github.com/DEVBU93/BUBATRONIK_BRM_INFO) |

## Dominio

- ProducciÃ³n: `brm.worldmos.es`
- Ver `DEPLOY_GODADDY_GITHUB.md` para configurar DNS en GoDaddy.

## Tests

```bash
npm test
npm run check
```

## Licencia

CC0-1.0
