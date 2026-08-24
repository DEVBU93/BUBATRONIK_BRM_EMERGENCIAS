# BRM · WORLD INCIDENT CENTER

## Objetivo

Nueva capa de observación visual del proyecto BUBATRONIK BRM EMERGENCIAS. El centro permite navegar un mapamundi, filtrar fenómenos y distinguir entre señales PING propias, ejemplos DEMO y fuentes externas.

## Arquitectura prevista

```text
Fuentes oficiales / públicas
        ↓
Adapters / normalización
        ↓
Event Bus
        ↓
Validación + provenance
        ↓
PING
        ↓
BRM Radio / World Incident Center
        ↓
WORLD-MUNDO OS
```

## Fuentes iniciales

- GDACS — Global Disaster Alert and Coordination System
- Copernicus Emergency Management Service
- NASA FIRMS — incendios activos
- USGS — terremotos
- EMSC — actividad sísmica
- AEMET — meteorología España
- Protecció Civil Catalunya / 112

## Regla de procedencia

Todo evento debe conservar `source`, `observedAt`, `location`, `severity` y `provenance`. Nunca se debe presentar un dato DEMO como alerta real. Los datos de terceros deben enlazar a su fuente y mantener su atribución.

## Seguridad y responsabilidad

El sistema es de observación, contextualización y preparación ciudadana. No sustituye avisos, instrucciones ni sistemas oficiales de emergencia.

## Evolución recomendada

1. Sustituir los puntos DEMO por adaptadores reales sin mezclar credenciales en frontend.
2. Crear contratos de evento comunes para terremoto, incendio, inundación, tormenta, volcán y accidente industrial.
3. Añadir caché/normalización en backend y `lastUpdated` por fuente.
4. Añadir historial y timeline.
5. Añadir búsqueda por localidad y geocercas.
6. Conectar señales PING con el Event Bus existente.
7. Integrar el mapa como módulo de BRM INFO y posteriormente como módulo WORLD-MUNDO OS.
