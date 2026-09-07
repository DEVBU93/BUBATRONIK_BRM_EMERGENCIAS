const LIST_URL='https://rapidmapping.emergency.copernicus.eu/backend/dashboard-api/public-activations-info/?limit=100';

function point(wkt){
  const m=String(wkt||'').match(/POINT\s*\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/i);
  return m?{lon:Number(m[1]),lat:Number(m[2])}:null;
}
function typeOf(category){
  const c=String(category||'').toLowerCase();
  if(c.includes('wildfire')||c.includes('fire')) return 'fire';
  if(c.includes('flood')) return 'flood';
  if(c.includes('earthquake')) return 'earthquake';
  if(c.includes('storm')) return 'storm';
  if(c.includes('volcan')) return 'volcano';
  if(c.includes('landslide')) return 'landslide';
  return 'other';
}

export default async function handler(req,res){
  try{
    const r=await fetch(LIST_URL,{headers:{Accept:'application/json','User-Agent':'BRM-Emergencias/1.0'}});
    if(!r.ok) throw new Error('CEMS HTTP '+r.status);
    const payload=await r.json();
    const events=(payload.results||[]).map(x=>{
      const p=point(x.centroid); if(!p) return null;
      const countries=(x.countries||[]).map(c=>typeof c==='string'?c:(c.short_name||c.name||'')).filter(Boolean);
      return {
        id:'cems-'+x.code, activationCode:x.code, name:x.name||('Copernicus EMS '+x.code),
        type:typeOf(x.category), category:x.category||'Emergency',
        lat:p.lat, lon:p.lon, countries,
        source:'COPERNICUS EMS', kind:'context', precision:'area',
        eventTime:x.eventTime||null, activationTime:x.activationTime||null,
        closed:Boolean(x.closed), products:Number(x.n_products||0), aois:Number(x.n_aois||0),
        detail:'Copernicus EMS Rapid Mapping · '+(x.category||'Emergency')+' · '+(x.closed?'activación cerrada':'activación en curso')+' · '+(x.n_products||0)+' productos cartográficos',
        url:'https://mapping.emergency.copernicus.eu/activations/'+encodeURIComponent(x.code)+'/'
      };
    }).filter(Boolean);
    res.setHeader('Cache-Control','s-maxage=900, stale-while-revalidate=3600');
    res.status(200).json({source:'COPERNICUS EMS',generated:Date.now(),count:events.length,events});
  }catch(error){
    res.setHeader('Cache-Control','s-maxage=60');
    res.status(502).json({source:'COPERNICUS EMS',error:'Live source temporarily unavailable',events:[]});
  }
}