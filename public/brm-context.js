/* BRM · Context Engine
 * Contextual services around the selected incident.
 * Deliberately does not paint a global clutter layer: the user chooses the context.
 */
(() => {
  const services = [
    ['aviation','✈️ Aviación','ENAIRE · información aeronáutica y espacio aéreo','https://www.enaire.es/',['weather','emergency']],
    ['rail','🚆 Ferrocarril','ADIF · infraestructura y red ferroviaria','https://www.adif.es/',['roads','emergency']],
    ['maritime','🚢 Marítimo','Puertos del Estado · contexto portuario','https://www.puertos.es/',['weather','emergency']],
    ['satellite','🛰️ Satélite','NASA FIRMS · observación de focos y datos satelitales','https://firms.modaps.eosdis.nasa.gov/',['fire','weather']],
    ['roads','🛣️ Transporte','DGT · tráfico e infraestructura viaria','https://www.dgt.es/',['rail','emergency']],
    ['energy','⚡ Energía','REE · sistema eléctrico','https://www.ree.es/',['emergency','weather']],
    ['weather','🌦️ Meteorología','AEMET · avisos oficiales','https://www.aemet.es/es/eltiempo/prediccion/avisos',['fire','flood','storm','emergency']],
    ['emergency','🚨 Emergencias','Protección Civil · información oficial','https://www.proteccioncivil.es/',['fire','flood','storm','earthquake']]
  ];

  const style = document.createElement('style');
  style.textContent = `
    .brm-context{margin-top:14px;background:#101016;border:1px solid #252536;padding:18px}
    .brm-context h3{margin:0;color:#f5c518;font:28px "Bebas Neue",sans-serif;letter-spacing:1px}
    .brm-context-head{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;border-bottom:1px solid #292929;padding-bottom:10px;margin-bottom:12px}
    .brm-context-head small{color:#777;font-size:8px;letter-spacing:1.2px}
    .brm-context-intro{color:#aaa;font:12px/1.5 "Barlow Condensed",sans-serif;margin-bottom:14px;max-width:900px}
    .brm-context-modes{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:14px}
    .brm-context-mode{appearance:none;border:1px solid #303044;background:#0b0b10;color:#aaa;padding:8px 11px;border-radius:4px;font:700 10px "Barlow Condensed",sans-serif;letter-spacing:1px;cursor:pointer}
    .brm-context-mode:hover,.brm-context-mode.active{color:#0a0a0a;background:#f5c518;border-color:#f5c518}
    .brm-context-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
    .brm-context-card{display:block;padding:12px;background:#0b0b10;border:1px solid #29293a;text-decoration:none;transition:.18s ease;min-height:82px}
    .brm-context-card:hover{border-color:#f5c518;transform:translateY(-1px)}
    .brm-context-card.is-muted{opacity:.42}
    .brm-context-card b{display:block;color:#eee;font:18px "Barlow Condensed",sans-serif}
    .brm-context-card span{display:block;color:#777;font-size:7px;line-height:1.4;margin-top:4px}
    .brm-context-card em{display:inline-block;margin-top:7px;color:#10b981;font:700 7px "JetBrains Mono",monospace;font-style:normal;letter-spacing:.8px}
    .brm-context-foot{margin-top:12px;color:#555;font-size:7px;line-height:1.5}
    @media(max-width:1050px){.brm-context-grid{grid-template-columns:repeat(2,1fr)}}
    @media(max-width:650px){.brm-context{padding:14px;margin-top:10px}.brm-context h3{font-size:24px}.brm-context-head{align-items:flex-start;flex-direction:column;gap:4px}.brm-context-grid{grid-template-columns:1fr 1fr;gap:6px}.brm-context-card{padding:10px;min-height:76px}.brm-context-card b{font-size:16px}.brm-context-card span{font-size:8px}.brm-context-mode{flex:1 1 auto;text-align:center}}
    @media(max-width:390px){.brm-context-grid{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  const map = document.getElementById('map');
  if (!map || document.querySelector('.brm-context')) return;

  const section = document.createElement('section');
  section.className = 'brm-context';
  section.setAttribute('aria-label','Contexto de la zona');
  section.innerHTML = `
    <div class="brm-context-head">
      <h3>CONTEXTO DE LA ZONA</h3>
      <small>INCIDENTE → ZONA → INFORMACIÓN DISPONIBLE</small>
    </div>
    <div class="brm-context-intro">
      El mapa mantiene la vista limpia. Selecciona qué contexto quieres consultar alrededor de la zona afectada. “Todo” muestra el catálogo disponible; no implica que todos los servicios tengan posición o datos en tiempo real.
    </div>
    <div class="brm-context-modes" role="group" aria-label="Modo de contexto">
      <button class="brm-context-mode active" data-mode="relevant" type="button">SOLO RELEVANTE</button>
      <button class="brm-context-mode" data-mode="select" type="button">SELECCIONAR</button>
      <button class="brm-context-mode" data-mode="all" type="button">VER TODO</button>
    </div>
    <div class="brm-context-grid">
      ${services.map(([key,title,desc,url,related]) => `
        <a class="brm-context-card" data-context="${key}" data-related="${related.join(',')}" href="${url}" target="_blank" rel="noopener noreferrer">
          <b>${title}</b><span>${desc}</span><em>FUENTE EXTERNA · VERIFICABLE</em>
        </a>`).join('')}
    </div>
    <div class="brm-context-foot">
      BRM distingue entre contexto disponible y datos operativos en tiempo real. La posición, presencia o estado de un medio solo debe considerarse confirmado cuando exista un feed o fuente verificable para ese dato.
    </div>`;

  map.parentElement.appendChild(section);

  const cards = [...section.querySelectorAll('.brm-context-card')];
  const modes = [...section.querySelectorAll('.brm-context-mode')];

  const applyMode = (mode) => {
    modes.forEach(btn => btn.classList.toggle('active', btn.dataset.mode === mode));
    cards.forEach(card => {
      if (mode === 'all') card.classList.remove('is-muted');
      else if (mode === 'select') card.classList.remove('is-muted');
      else {
        // Conservative default: show the most generally useful contextual services.
        const key = card.dataset.context;
        card.classList.toggle('is-muted', !['weather','emergency','roads','satellite'].includes(key));
      }
    });
  };

  modes.forEach(btn => btn.addEventListener('click', () => applyMode(btn.dataset.mode)));
})();
