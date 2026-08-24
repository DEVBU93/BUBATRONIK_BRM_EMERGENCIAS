# BRM + Lovable · Integración

Lovable se utiliza como acelerador de prototipado y exploración de interfaz. La versión pública de `public/index.html` mantiene una implementación autónoma para evitar que el servicio dependa de un preview externo.

## Regla de arquitectura

- **BRM Emergencias** = runtime y capa operativa visual.
- **Lovable** = laboratorio/prototipo y fuente de ideas de UX.
- **API** = contrato de datos compartido.
- **World-Mundo OS** = integración de contexto a nivel ecosistema.

## Por qué

Esto permite iterar rápidamente en Lovable sin perder control sobre el repositorio, el despliegue ni la identidad BRM.

## Cuando el prototipo madure

Las piezas validadas en Lovable deben migrarse al HTML/CSS/JS propio o a una futura aplicación modular, manteniendo los contratos de API existentes.
