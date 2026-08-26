# BRM · Red de fuentes España

## Principio

BRM amplía su observación desde el Camp de Tarragona hacia Catalunya, España y sus territorios, manteniendo como regla **fuente primaria antes que ruido**.

## Prioridad de integración

1. **Camp de Tarragona / Catalunya**
   - 112 Catalunya
   - Protecció Civil de la Generalitat
   - Meteocat
   - AEMET por Tarragona/Catalunya
2. **España**
   - Dirección General de Protección Civil y Emergencias
   - Red de Alerta Nacional / ES-Alert como referencia de alerta a población
   - AEMET
   - IGN / CNIG
   - MITECO y fuentes ambientales
3. **Europa**
   - Meteoalarm
   - Copernicus EMS
4. **Global**
   - USGS
   - GDACS
   - NASA FIRMS
   - otras fuentes de observación con feed reutilizable

## Regla de frescura

Cada integración debe conservar, cuando esté disponible:

- `source`
- `source_timestamp`
- `received_timestamp`
- `status`
- `severity`
- `location`
- `official_url`

La antigüedad del dato se muestra como contexto. Una fuente lenta no se descarta automáticamente.

## Alertas a población

BRM no genera ni sustituye ES-Alert. ES-Alert es un sistema oficial de Protección Civil integrado en la Red de Alerta Nacional y gestionado por las autoridades competentes. BRM debe enlazar y contextualizar, nunca presentarse como emisor oficial.

## Portal añadido

`public/espana.html` funciona como centro rápido de búsqueda de fuentes oficiales españolas y territoriales, con prioridad visual para Camp de Tarragona y Catalunya.

## Próximas integraciones técnicas

- Conectar AEMET mediante OpenData/API cuando se disponga de la credencial correspondiente.
- Aprovechar los canales RSS/Atom de AEMET para avisos meteorológicos cuando la arquitectura de ingestión los pueda consumir de forma estable.
- Integrar fuentes de Protección Civil que expongan datos reutilizables.
- Incorporar alertas territoriales al modelo común de eventos BRM.
- Mantener siempre separadas las categorías `OFICIAL`, `OBSERVACIÓN` y `PING BRM`.
