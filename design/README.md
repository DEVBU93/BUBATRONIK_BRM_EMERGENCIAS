# Design — Bubatronik Emergencias

Tokens de diseño y guía de integración para Lovable (`brm.worldmos.es`).

## Archivos

- `tokens.css` — Variables CSS con colores, tipografias, radios, sombras y espaciados.
- `lovable-setup.md` — Instrucciones paso a paso para aplicar el tema en Lovable.

## Principios

- Un solo sistema de diseño para `brm.worldmos.info`, `brm.worldmos.es` y futuros dominios.
- Tokens simples y legibles, sin dependencias externas.
- Fácil de copiar/pegar en Lovable o en cualquier proyecto frontend.

## Uso en Lovable

1. Copia `tokens.css` al proyecto de Lovable (ej. `styles/tokens.css`).
2. Importa el archivo en el CSS global o en el layout principal.
3. Usa las variables `var(--...)` en componentes y páginas.
4. Sigue `lovable-setup.md` para ajustar el tema base y los componentes.

## ExtensiÃ³n

Para aÃ±adir nuevos tokens (ej. colores de estado, iconos), edite `tokens.css` y mantenga la misma estructura de nombres.
