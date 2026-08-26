/* BRM · Context Layer
 * Adds a human-first context panel to the existing World Incident Center.
 * It deliberately uses official/specialist services as context links rather
 * than pretending their APIs are connected when credentials or public feeds
 * are not yet configured.
 */
(() => {
  const services = [
    ['🇪🇸 Alertas España', 'Protección Civil / ES-Alert', 'https://www.proteccioncivil.es/'],
    ['🌦️ AEMET', 'Avisos meteorológicos oficiales', 'https://www.aemet.es/'],
    ['🏔️ Meteocat', 'Meteorología de Catalunya', 'https://www.meteocat.gencat.cat/'],
    ['✈️ Aviación', 'Consultar tráfico y estado aeronáutico', 'https://www.flightradar24.com/'],
    ['🚢 Marítimo', 'Consultar tráfico AIS y navegación', 'https://www.marinetraffic.com/'],
    ['🛰️ Satélites', 'Observación y seguimiento espacial', 'https://www.n2yo.com/'],
    ['☀️ Clima espacial', 'NOAA Space Weather', 'https://www.swpc.noaa.gov/'],
    ['🌍 Copernicus', 'Emergencias y observación europea', 'https://emergency.copernicus.eu/']
  ];

  const style = document.createElement('style');
  style.textContent = `
    .brm-context{margin-top:14px;background:#101016;border:1px solid #252536;padding:18px}
    .brm-context-head{display:flex;justify-content:space-between;gap:16px;align-items:end;border-bottom:1px solid #292929;padding-bottom:10px;margin-bottom:14px}
    .brm-context h3{margin:0;color:#f5c518;font:28px "Bebas Neue";letter-spacing:1px}
    .brm-context small{color:#777;font:8px "JetBrains Mono"}
    .brm-context-intro{color:#aaa;font:12px/1.5 "Barlow Condensed";margin-bottom:14px}
    .brm-context-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
    .brm-context-card{display:block;padding:12px;background:#0b0b10;border:1px solid #29293a;text-decoration:none}
    .brm-context-card:hover{border-color:#f5c518;transform:translateY(-1px)}
    .brm-context-card b{display:block;color:#eee;font:18px "Barlow Condensed"}
    .brm-context-card span{display:block;color:#777;font-size:7px;line-height:1.4;margin-top:4px}
    .brm-context-foot{margin-top:12px;color:#555;font-size:7px;line-height:1.5}
    @media(max-width:1050px){.brm-context-grid{grid-template-columns:repeat(2,1fr)}}
    @media(max-width:850px){.brm-context-grid{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  function esc(v){
    return String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function addPanel(){
    if(document.querySelector('.brm-context')) return;
    const map = document.getElementById('map');
    if(!map) return;
    const section = document.createElement('section');
    section.className = 'brm-context';
    section.innerHTML = `
      <div class="brm-context-head">
        <h3>CONTEXTO DE LA ZONA</h3>
        <small>ESPAÑA · CATALUNYA · CAMP DE TARRAGONA · AIRE · MAR · ESPACIO</small>
      </div>
      <div class="brm-context-intro">
        Selecciona un evento del mapa y utiliza estas capas para comprobar qué ocurre alrededor.
        BRM no sustituye a las plataformas especializadas ni a las autoridades: las conecta como contexto.
      </div>
      <div class="brm-context-grid">
        ${services.map(([title,desc,url]) => `
          <a class="brm-context-card" href="${esc(url)}" target="_blank" rel="noopener noreferrer">
            <b>${esc(title)}</b><span>${esc(desc)}</span>
          </a>`).join('')}
      </div>
      <div class="brm-context-foot">
        🟢 PING BRM · 🔴 OFICIAL · 🟡 OBSERVACIÓN. La disponibilidad y latencia dependen de cada fuente.
        Una fuente externa no se presenta como integrada hasta disponer de un feed/API verificable.
      </div>`;
    map.parentElement.appendChild(section);
  }

  function addSpainShortcut(){
    const nav = document.querySelector('.nav');
    if(!nav || nav.querySelector('[data-brm-spain]')) return;
    const a = document.createElement('a');
    a.href = '/espana.html';
    a.textContent = '🇪🇸 CENTRO ESPAÑA';
    a.dataset.brmSpain = '1';
    nav.insertBefore(a, nav.lastElementChild);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', () => { addPanel(); addSpainShortcut(); });
  } else {
    addPanel(); addSpainShortcut();
  }
})();
