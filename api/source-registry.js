const NATIONAL = [
  {id:'aemet',name:'AEMET',scope:'España',type:'meteorología',url:'https://www.aemet.es/es/eltiempo/prediccion/avisos'},
  {id:'proteccion-civil',name:'Protección Civil',scope:'España',type:'emergencias',url:'https://www.proteccioncivil.es/'},
  {id:'dgt',name:'DGT',scope:'España',type:'carreteras',url:'https://www.dgt.es/'},
  {id:'ign',name:'IGN',scope:'España',type:'geofísica',url:'https://www.ign.es/'},
  {id:'enaire',name:'ENAIRE',scope:'España',type:'aviación',url:'https://www.enaire.es/'},
  {id:'adif',name:'ADIF',scope:'España',type:'ferrocarril',url:'https://www.adif.es/'},
  {id:'puertos',name:'Puertos del Estado',scope:'España',type:'marítimo',url:'https://www.puertos.es/'},
  {id:'salvamento',name:'Salvamento Marítimo',scope:'España',type:'marítimo',url:'https://www.salvamentomaritimo.es/'},
  {id:'ree',name:'Red Eléctrica',scope:'España',type:'energía',url:'https://www.ree.es/'},
  {id:'usgs',name:'USGS',scope:'global',type:'terremotos',url:'https://earthquake.usgs.gov/earthquakes/feed/'},
  {id:'gdacs',name:'GDACS',scope:'global',type:'multiamenaza',url:'https://www.gdacs.org/'},
  {id:'effis',name:'EFFIS / Copernicus',scope:'Europa',type:'incendios',url:'https://forest-fire.emergency.copernicus.eu/'}
];
const CATALUNYA = [
  {id:'112-cat',name:'112 Catalunya',scope:'Catalunya',type:'emergencias',url:'https://112.gencat.cat/es/inici'},
  {id:'proteccio-cat',name:'Protecció Civil Catalunya',scope:'Catalunya',type:'emergencias',url:'https://interior.gencat.cat/ca/arees_dactuacio/proteccio_civil/'},
  {id:'meteocat',name:'Meteocat',scope:'Catalunya',type:'meteorología',url:'https://www.meteocat.gencat.cat/'},
  {id:'sct',name:'Servei Català de Trànsit',scope:'Catalunya',type:'carreteras',url:'https://cit.transit.gencat.cat/'},
  {id:'rodalies',name:'Rodalies Catalunya',scope:'Catalunya',type:'ferrocarril',url:'https://rodalies.gencat.cat/'},
  {id:'consum',name:'Agència Catalana del Consum',scope:'Catalunya',type:'suministros y reclamaciones',url:'https://consum.gencat.cat/'}
];
const TARRAGONA = [
  {id:'112-reus',name:'CAT112 · Reus',scope:'Camp de Tarragona',type:'emergencias',url:'https://112.gencat.cat/es/contacte/adreces-i-telefons/'},
  {id:'port-tarragona',name:'Port Tarragona',scope:'Tarragona',type:'marítimo',url:'https://www.porttarragona.cat/'},
  {id:'diputacio-tgn',name:'Diputació de Tarragona',scope:'Tarragona',type:'territorio y servicios',url:'https://www.dipta.cat/'},
  {id:'aj-tarragona',name:'Ajuntament de Tarragona',scope:'Tarragona',type:'municipal',url:'https://www.tarragona.cat/'},
  {id:'meteocat-tgn',name:'Meteocat · Tarragona',scope:'Tarragona',type:'meteorología',url:'https://www.meteocat.gencat.cat/'}
];
export default async function handler(req,res){
  const region=String(req.query?.region||'').toLowerCase();
  const municipality=String(req.query?.municipality||'').toLowerCase();
  let sources=[...NATIONAL];
  if(region==='catalunya'||region==='cataluña'||municipality.includes('tarragona')) sources=[...sources,...CATALUNYA];
  if(municipality.includes('tarragona')) sources=[...sources,...TARRAGONA];
  const unique=[...new Map(sources.map(x=>[x.id,x])).values()];
  res.setHeader('Cache-Control','s-maxage=3600, stale-while-revalidate=86400');
  res.status(200).json({generated:new Date().toISOString(),region:region||'España',municipality:municipality||null,count:unique.length,sources:unique});
}
