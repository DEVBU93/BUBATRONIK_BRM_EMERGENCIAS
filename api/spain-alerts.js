// BRM official Spain alerts adapter.
// Uses AEMET CAP/Atom geographical warning channels as primary source and
// MeteoAlarm Spain as compatibility fallback. Output remains normalized.
export default async function handler(req,res){
 const feeds=[
  {name:'AEMET-ES',url:'https://www.aemet.es/es/rss_info/avisos/esp'},
  {name:'METEOALARM-ES',url:'https://feeds.meteoalarm.org/feeds/meteoalarm-legacy-atom-spain'}
 ];
 const clean=v=>(v||'').replace(/<!\[CDATA\[|\]\]>/g,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
 const tag=(b,n)=>clean(b.match(new RegExp('<(?:(?:[\\w.-]+):)?'+n+'\\b[^>]*>([\\s\\S]*?)<\\/(?:(?:[\\w.-]+):)?'+n+'>','i'))?.[1]);
 const coord=b=>{const x=b.match(/<(?:[\w.-]+:)?(?:point|pos)\b[^>]*>([^<]+)</i)?.[1]?.trim().split(/\s+/).map(Number);return x?.length>=2&&x.slice(0,2).every(Number.isFinite)?{lat:x[0],lon:x[1]}:{lat:null,lon:null}};
 let xml='',source='',usedUrl='';
 for(const f of feeds){try{const r=await fetch(f.url,{headers:{Accept:'application/atom+xml,application/xml,text/xml'}});if(!r.ok)continue;const t=await r.text();if(/<entry\b/i.test(t)){xml=t;source=f.name;usedUrl=f.url;break}}catch{}}
 if(!xml)return res.status(502).json({source:'SPAIN-OFFICIAL',error:'Official Spain alert feeds temporarily unavailable',events:[]});
 const entries=[...xml.matchAll(/<entry\b[\s\S]*?<\/entry>/gi)].map(x=>x[0]);
 const events=entries.map((b,i)=>{const c=coord(b),title=tag(b,'title')||tag(b,'event')||'Aviso oficial';const area=tag(b,'areaDesc')||tag(b,'featurename')||'';const time=tag(b,'updated')||tag(b,'published')||null;const detail=tag(b,'summary')||tag(b,'description')||tag(b,'content')||'';const url=b.match(/<link\b[^>]*href=["']([^"']+)/i)?.[1]||usedUrl;return{id:'spain-'+Buffer.from(title+'|'+area+'|'+time+'|'+i).toString('base64').replace(/[^a-z0-9]/gi,'').slice(0,28),name:title,type:'weather',lat:c.lat,lon:c.lon,area,time,source,scope:'spain',kind:'official',url,detail:clean(detail).slice(0,700)}}).filter(e=>e.name);
 res.setHeader('Cache-Control','s-maxage=180, stale-while-revalidate=600');
 res.status(200).json({source,generated:Date.now(),count:events.length,events});
}