# Emergency Weather Event - Integración

Módulo para unificar alarma + señal geolocalizada + ping push en un único evento de emergencia meteorológica.

## Archivos
- `emergency_weather_event.schema.json` — Esquema JSON del evento (validación).
- `emergency_weather_event.example.json` — Ejemplo real basado en aviso de lluvia en Sant Salvador (Tarragona), 24 agosto 2026.
- `emitter.js` — Función de ejemplo en Node.js para generar y disparar el evento (útil como base para Zapier/Vercel).

## Flujo propuesto
1. Un webhook (AEMET/Meteocat o sensor propio) detecta un cambio de nivel de aviso en una zona.
2. Se genera un `EmergencyWeatherEvent` siguiendo el esquema.
3. Se dispara un único push (`push.sent = true`) combinando alarma + señal + PING, en vez de tres notificaciones separadas.
4. El evento se marca `activo` hasta que el aviso se resuelve o expira.

## Integración sugerida
- Zapier: trigger por webhook -> formatear a este esquema -> enviar push/Telegram.
- Vercel: endpoint `/api/weather-alert` que recibe datos crudos y devuelve el JSON unificado.
