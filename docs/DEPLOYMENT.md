# Despliegue — Bubatronik Emergencias

GuÃ¬a final para desplegar en Vercel con el dominio `brm.worldmos.es`.

## Requisitos

- Cuenta de Vercel conectada a GitHub.
- Dominio `brm.worldmos.es` configurado en GoDaddy.
- Repo `bubatronik-emergencias` en GitHub.

## Pasos

### 1) Crear proyecto en Vercel

1. Ve a https://vercel.com/new
2. Importa el repo `DEVBU93/bubatronik-emergencias`.
3. ConfiguraciÃ³n:
   - **Framework preset**: `Other`
   - **Root directory**: `.`
   - **Build command**: (vacÃ¬o)
   - **Output directory**: `public`
   - **Install command**: (vacÃ¬o)

### 2) AÃ±adir dominio

1. En el proyecto, ve a **Settings > Domains**.
2. AÃ±ade `brm.worldmos.es`.
3. Vercel te mostrarÃ¡ los registros DNS necesarios.

### 3) Configurar DNS en GoDaddy

1. Inicia sesiÃ³n en GoDaddy.
2. Ve a **Mis dominios > brm.worldmos.es > DNS**.
3. AÃ±ade los registros que indique Vercel:
   - **Tipo A** → Host `@` → IP de Vercel.
   - **Tipo CNAME** → Host `www` → `cname.vercel-dns.com` (o el que indique Vercel).

### 4) Verificar

1. En Vercel, el dominio debe aparecer como **Configured**.
2. Abre `https://brm.worldmos.es` y comprueba que carga el dashboard.

## Checklist final

- [ ] Proyecto creado en Vercel.
- [ ] Dominio aÃ±adido en Vercel.
- [ ] DNS configurados en GoDaddy.
- [ ] SSL activo (automÃ¡tico en Vercel).
- [ ] `https://brm.worldmos.es` carga correctamente.
- [ ] API `/api/emergency-event` responde a POST.
- [ ] Adaptadores configurados (si aplica).

## Notas

- La API estÃ¡ en `api/emergency-event.js` y se despliega automÃ¡ticamente.
- Los adaptadores (Telegram, Web Push, radio overlay) estÃ¡n en `adapters/` y requieren variables de entorno.
- El dashboard estÃ¡ en `public/index.html` y es estÃ¡tico (sin build).

## Soporte

- Ver `docs/INTEGRATION.md` para detalles de la API y adaptadores.
- Ver `design/lovable-setup.md` para el tema de Lovable.
