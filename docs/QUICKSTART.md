# Inicio rÃ¡pido — Bubatronik Emergencias

Configura y prueba el sistema en 5 minutos.

## 1) Instalar dependencias

```bash
npm install
```

## 2) Ejecutar tests

```bash
npm test
npm run check
```

## 3) Probar la API localmente

```bash
# En una terminal
npx vercel dev

# En otra terminal, envÃ¬a un evento de prueba
curl -X POST http://localhost:3000/api/emergency-event \
  -H "Content-Type: application/json" \
  -d '{
    "event_id": "evt-test-001",
    "occurred_at": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
    "project": "emergencias",
    "location": { "zone_name": "Test", "lat": 41.0, "lon": 1.0 },
    "phenomenon": "lluvia",
    "severity": 1,
    "source": { "name": "Test" },
    "message": "Evento de prueba.",
    "status": "active"
  }'
```

## 4) Abrir el dashboard

Abre `public/index.html` en tu navegador o usa `npx serve public`.

## 5) Desplegar en Vercel

```bash
vercel --prod
```

## Siguientes pasos

- Configurar adaptadores (Telegram, Web Push, radio overlay).
- Conectar fuentes reales de datos (Meteocat, AEMET).
- Personalizar el dashboard para tu proyecto.

## Recursos

- `docs/INTEGRATION.md` — IntegraciÃ³n de adaptadores.
- `docs/DEPLOYMENT.md` — Despliegue en Vercel.
- `design/lovable-setup.md` — Tema de Lovable.
