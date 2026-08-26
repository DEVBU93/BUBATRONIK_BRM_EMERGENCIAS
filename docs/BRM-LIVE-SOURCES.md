# BRM · LIVE SOURCES

## Objetivo

World Incident Center reúne señales propias y fuentes públicas sin mezclar su nivel de autoridad ni su latencia.

## Estados

- **LIVE** — BRM consulta automáticamente la fuente y puede mostrar eventos.
- **PREPARADA** — fuente identificada y lista para una integración que requiere API key, adaptación o configuración adicional.
- **EXTERNA** — fuente oficial disponible mediante enlace directo, pero no se presenta como integrada.
- **OFICIAL LOCAL** — referencia institucional local; no se convierte en señal BRM salvo integración explícita.

## Fuentes actuales

| Fuente | Dominio | Estado | Uso |
|---|---|---|---|
| USGS | Earthquakes | LIVE | Terremotos |
| GDACS | Multiamenaza | LIVE | Terremotos, ciclones, inundaciones, volcanes y otros eventos |
| NASA FIRMS | Observación satelital | PREPARADA | Incendios / hotspots |
| Copernicus EMS | Emergencias UE | EXTERNA | Cartografía y respuesta |
| AEMET | España | PREPARADA | Meteorología y avisos |
| Meteocat | Catalunya | PREPARADA | Meteorología y avisos locales |
| EMSC | Europa | EXTERNA | Sismología / contraste |
| 112 Catalunya | Catalunya | OFICIAL LOCAL | Emergencias y contexto |

## Regla de frescura

La interfaz no debe presentar todas las fuentes como si fueran instantáneas. Cada integración debe conservar, cuando exista:

- timestamp del evento;
- timestamp de recepción por BRM;
- fuente original;
- enlace original;
- estado de frescura;
- y cualquier limitación conocida.

Un dato antiguo puede seguir siendo útil. Su antigüedad debe ser visible, no ocultada.

## Principio BRM

> La velocidad del dato determina su contexto; no necesariamente su valor.

BRM no sustituye a las autoridades ni emite alertas oficiales por el mero hecho de observar un evento.
