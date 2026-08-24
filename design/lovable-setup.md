# Lovable Setup — brm.worldmos.es

GuÃ¬a para aplicar el sistema de diseño de Bubatronik Emergencias en Lovable.

## Paso 1 â€” Copiar tokens

1. Copia `design/tokens.css` al proyecto de Lovable.
   - Ejemplo: `styles/tokens.css` o `public/tokens.css`.
2. AsegÃºrate de que el archivo se carga en el CSS global o en el layout principal.

## Paso 2 â€” Configurar tema base

En la configuraciÃ³n de tema de Lovable (o en el archivo de tema global):

- Fuente base: `var(--font-sans)`
- Color de fondo: `var(--bg)`
- Color de texto: `var(--text)`
- Color de acento: `var(--cyan)`

Si Lovable usa Tailwind o un sistema similar, puedes mapear:

```js
// tailwind.config.js (ejemplo)
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-elevated': 'var(--bg-elevated)',
        panel: 'var(--panel)',
        line: 'var(--line)',
        text: 'var(--text)',
        'text-muted': 'var(--text-muted)',
        cyan: 'var(--cyan)',
        green: 'var(--green)',
        amber: 'var(--amber)',
        orange: 'var(--orange)',
        red: 'var(--red)',
        'red-bright': 'var(--red-bright)'
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)']
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)'
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)'
      }
    }
  }
};
```

## Paso 3 â€” Componentes clave

Para mantener el estilo de `brm.worldmos.info`:

- Tarjetas: fondo `var(--panel)`, borde `1px solid var(--line)`, radio `var(--radius-xl)`, sombra `var(--shadow-md)`.
- TÃ¬tulos: color `var(--cyan)`, peso 600â»°700.
- Texto secundario: color `var(--text-muted)`.
- Badges/pills: fondo semitransparente (`--green-dim`, `--amber-dim`, `--red-dim`) con texto en el color principal.
- Botones: fondo `var(--cyan)`, texto `var(--bg)`, radio `var(--radius-md)`.

## Paso 4 â€” PÃ¡gina de emergencias

Para la pÃ¡gina de emergencias en `brm.worldmos.es`:

- Usa el layout de `public/emergency-dashboard.html` como referencia visual.
- MantÃ©n la estructura: eyebrow â†’ tÃ¬tulo â†’ lead â†’ grid de cards â†’ footer.
- Reutiliza las mismas clases de color y espaciado.

## Paso 5 â€” Dominio y despliegue

- Dominio objetivo: `brm.worldmos.es`.
- Configura el dominio en Vercel (o el proveedor que uses para Lovable).
- AsegÃºrate de que el SSL estÃ¡ activo y que el dominio apunta correctamente.

## Paso 6 â€” ValidaciÃ³n visual

Compara `brm.worldmos.es` con `brm.worldmos.info`:

- Mismos colores de fondo y texto.
- Mismos radios y sombras en tarjetas y botones.
- Mismo uso de acentos (cyan, green, amber, red).
- TipografÃ¬a y tamaÃ±os de texto coherentes.

Si quieres, puedo ajustar los tokens para que coincidan exactamente con algÃºn detalle concreto de `brm.worldmos.info` (ej. un tono de azul o un radio especÃ¬fico).
