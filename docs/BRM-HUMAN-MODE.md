# BRM · MODO HUMANO

## Propósito

BRM Emergencias observa, contextualiza y ayuda a comprender señales públicas o propias. No sustituye a los servicios oficiales de emergencias ni emite alertas oficiales.

## Regla central

> No queremos controlar la señal. Queremos hacerla comprensible, trazable y útil para las personas.

## Las cuatro preguntas

Toda incidencia presentada a una persona debería intentar responder, en este orden:

1. **¿QUÉ PASA?** — hecho observado y fenómeno.
2. **¿DÓNDE?** — ubicación y ámbito afectado.
3. **¿QUÉ SABEMOS REALMENTE?** — fuente, hora, procedencia y nivel de confianza.
4. **¿QUÉ PUEDE HACER UNA PERSONA AHORA?** — recomendación prudente y enlace a la autoridad competente cuando exista.

## Separación de información

Cada evento debe distinguir claramente:

- **OFICIAL** — información procedente de una autoridad o fuente institucional reconocida.
- **EXTERNA** — fuente pública de observación o monitorización.
- **PING** — señal generada por el ecosistema BRM/WorldMOS.
- **DEMO** — ejemplo o simulación; nunca debe confundirse con un evento real.

## Principios de seguridad

- No inventar eventos, magnitudes, ubicaciones, víctimas ni instrucciones.
- Mostrar siempre fuente y timestamp cuando estén disponibles.
- No presentar estimaciones como hechos confirmados.
- No convertir un indicador visual en una declaración de emergencia.
- Ante discrepancias, priorizar la fuente oficial competente.
- Mantener enlaces de referencia navegables.
- Evitar lenguaje alarmista o sensacionalista.
- Diseñar para móvil, accesibilidad y lectura bajo estrés.
- No almacenar secretos ni claves privadas en frontend.
- No enviar automáticamente comunicaciones públicas de emergencia sin una capa explícita de validación y autorización.

## Flujo de referencia

```text
FUENTE
  ↓
ADAPTER / INGESTA
  ↓
NORMALIZACIÓN
  ↓
VALIDACIÓN + PROCEDENCIA
  ↓
EVENT BUS
  ↓
PING / BRM
  ↓
PERSONA / COMUNIDAD
  ↓
WORLD-MUNDO OS
```

## Modo ciudadano

Cuando exista información suficiente, una tarjeta de evento debe favorecer una lectura rápida:

**Qué ocurre → dónde → cuándo → fuente → qué significa → qué hacer → fuente oficial**

## Escala

El sistema puede comenzar en Camp de Tarragona y crecer hacia Catalunya, España, Mediterráneo y mundo sin cambiar el principio fundamental: **personas primero, datos trazables y autoridad oficial siempre respetada**.
