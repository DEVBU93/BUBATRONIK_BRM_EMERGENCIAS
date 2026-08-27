/* BRM · Context Engine — contextual services, never a global clutter layer. */
(() => {
  const services = [
    ['aviation','✈️ Aviación','ENAIRE · información aeronáutica y espacio aéreo','https://www.enaire.es/'],
    ['rail','🚆 Ferrocarril','ADIF · infraestructura y red ferroviaria','https://www.adif.es/'],
    ['maritime','🚢 Marítimo','Puertos del Estado · contexto portuario','https://www.puertos.es/'],
    ['satellite','🛰️ Satélites','NASA FIRMS · observación de focos y satélites','https://firms.modaps.eosdis.nasa.gov/'],
    ['roads','🛣️ Transporte','DGT · tráfico e infraestructura viaria','https://www.dgt.es/'],
    ['energy','⚡ Energía','REE · sistema eléctrico','https://www.ree.es/'],
    ['weather','🌦️ Meteorología','AEMET · avisos oficiales','https://www.aemet.es/es/eltiempo/prediccion/avisos'],
    ['emergency','🚨 Emergencias','Protección Civil · información oficial','https://www.proteccioncivil.es/']
  ];
  const style=document.createElement('style');style.textContent=`.brm-context{margin-top:14px;background:#101016;border:1px solid #252536;padding:18px}.brm-context h3{margin:0;color:#f5c518;font:28px "Bebas Neue"}.brm-context-head{display:flex;justify-content:space-between;gap:12px;border-bottom:1px solid #292929;padding-bottom:10px;margin-bottom:14px}.brm-context-head small{color:#777;font-size:8px}.brm-context-intro{color:#aaa;font:12px/1.5 "Barlow Condensed";margin-bottom:14px}.brm-context-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.brm-context-card{display:block;padding:12px;background:#0b0b10;border:1px solid #29293a;text-decoration:none}.brm-context-card:hover{border-color:#f5c518}.brm-context-card b{display:block;color:#eee;font:18px "Barlow Condensed"}.brm-context-card span{display:block;color:#777;font-size:7px;line-height:1.4;margin-top:4px}.brm-context-foot{margin-top:12px;color:#555;font-size:7px;line-height:1.5}@media(max-width:1050px){.brm-context-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:850px){.brm-context-grid{grid-template-columns:1fr}}`;
  document.head.appendChild(style);
  const map=document.getElementById('map');if(!map||document.querySelector('.brm-context'))return;
  const section=document.createElement('section');section.className='brm-context';
  section.innerHTML=`<div class="brm-context-head"><h3>CONTEXTO DE LA ZONA</h3><small>ACTIVA SOLO LO QUE NECESITES</small></div><div class="brm-context-intro">BRM no dibuja todo el planeta. Primero seleccionas un incidente; después consultas qué medios, infraestructuras y servicios son relevantes alrededor de esa zona.</div><div class="brm-context-grid">${services.map(([key,title,desc,url])=>`<a class="brm-context-card" data-context="${key}" href="${url}" target="_blank" rel="noopener noreferrer"><b>${title}</b><span>${desc}</span></a>`).join('')}</div><div class="brm-context-foot">La presencia real, posición o estado operativo se muestra únicamente cuando existe una fuente verificable. Los enlaces externos abren la plataforma especializada de referencia.</div>`;
  map.parentElement.appendChild(section);
})();
