# Instruccions per a desplegar a Vercel

1. Ves a https://vercel.com
2. Importa el repositori: https://github.com/DEVBU93/bubatronik-emergencias
3. Configura el projecte:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: (deixa buit)
   - Output Directory: ./
4. Desplega
5. Afegeix els dominis personalitzats:
   - emergencies.brm.worldmos.info
   - emergencies.brm.worldmos.world
6. Configura els DNS a GoDaddy (CNAME cap a Vercel)

## Afegir l'infobanner

1. Copia el contingut de `infobanner_emergencies.html`
2. Enganxa'l al principi del `<body>` de la teva web (abans de qualsevol altre contingut)
3. Canvia l'enllaç·´ `#` per la URL de Vercel
4. Desplega de nou

## Sincronització·´· .info / .world

Copia el mateix codi de l'infobanner a les dues webs (brm.worldmos.info i brm.worldmos.world).
