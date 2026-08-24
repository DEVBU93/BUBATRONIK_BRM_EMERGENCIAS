# Bubatronik BRM Emergencias · Arquitectura

## Objetivo

Convertir el repositorio en una pieza coherente del ecosistema Bubatronik / World-Mundo OS, manteniendo la solución ligera y desplegable como sitio estático + API serverless.

## Capas

1. **Fuentes** — Meteocat, sensores, entradas manuales y futuras integraciones.
2. **Event Bus / API** — `/api/emergency-event` recibe y valida eventos normalizados.
3. **PING** — una señal común que puede representarse en dashboard, radio overlay, Web Push y Telegram.
4. **World-Mundo OS** — capa de contexto y futura integración con otros módulos.
5. **Lovable** — prototipado visual / exploración rápida, sin convertirse en dependencia obligatoria del runtime principal.

## Principios

- No sustituir sistemas oficiales de emergencia.
- Separar datos de evento, visualización y distribución.
- Mantener contratos JSON estables.
- Evitar dependencias innecesarias para el dashboard público.
- Priorizar accesibilidad, responsive y degradación elegante.
- Mantener el estilo BRM: negro, amarillo, tipografía condensada/mono, ticker, scanlines y lenguaje de radio/señal.

## Flujo recomendado

`Fuente → API → validación → evento normalizado → distribución → visualización → trazabilidad`

## Siguiente evolución

- Persistencia de eventos.
- Feed real en tiempo real.
- Mapa de intensidad / zonas.
- Estado de conectores.
- Histórico y métricas.
- Web Push real.
- Overlay de radio BRM.
- Adaptador World-Mundo OS.
- Health endpoint y monitorización.
