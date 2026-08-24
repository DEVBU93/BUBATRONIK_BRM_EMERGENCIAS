# BRM · PROCEDENCIA Y CONFIANZA DE DATOS

## Objetivo

Toda señal visible en BRM debe poder responder de dónde procede y qué grado de certeza tiene. La interfaz no debe crear una falsa sensación de autoridad.

## Taxonomía

| Tipo | Significado | Presentación |
|---|---|---|
| `OFFICIAL` | Autoridad o institución competente | Prioridad máxima |
| `EXTERNAL` | Fuente pública de observación | Contexto / monitorización |
| `PING` | Evento propio de BRM/WorldMOS | Señal interna |
| `DEMO` | Ejemplo o simulación | Siempre marcado |

## Campos recomendados

```json
{
  "id": "string",
  "sourceType": "OFFICIAL | EXTERNAL | PING | DEMO",
  "sourceName": "string",
  "sourceUrl": "https://...",
  "observedAt": "ISO-8601",
  "receivedAt": "ISO-8601",
  "location": { "lat": 0, "lon": 0 },
  "phenomenon": "string",
  "severity": "info | watch | warning | critical",
  "confidence": "unknown | low | medium | high",
  "status": "observed | active | resolved | unknown",
  "summary": "string"
}
```

## Reglas

1. `DEMO` no puede aparecer como evento real.
2. Si falta fuente, debe indicarse `unknown` o equivalente.
3. Si falta hora, no inventarla.
4. Si dos fuentes discrepan, conservar ambas y priorizar la autoridad competente para instrucciones.
5. La severidad interna de BRM no equivale automáticamente a un nivel oficial de alerta.
6. Los enlaces externos deben abrir la fuente de origen siempre que sea posible.
7. Los adaptadores futuros deben normalizar a un modelo común sin borrar la procedencia original.

## Fuentes objetivo

- GDACS
- Copernicus Emergency Management Service
- NASA FIRMS
- USGS Earthquake Hazards Program
- EMSC
- AEMET
- Meteocat
- Protecció Civil de Catalunya / 112

Estas fuentes son conectores objetivo; la presencia en esta lista no implica que BRM esté conectado en tiempo real a todas ellas.
