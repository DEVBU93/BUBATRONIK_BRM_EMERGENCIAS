export default async function handler(req,res){
  const feedUrl='https://feeds.meteoalarm.org/feeds/meteoalarm-legacy-atom-europe';
  try{
    const r=await fetch(feedUrl,{headers:{Accept:'application/atom+xml, application/xml, text/xml'}});
    if(!r.ok) throw new Error('MeteoAlarm '+r.status);
    const xml=await r.text();
    const clean=v=>(v||'').replace(/<!\[CDATA\[|\]\]>/g,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
    const tag=(b,n)=>clean(b.match(new RegExp('<(?:(?:[\\w.-]+):)?'+n+'\\b[^>]*>([\\s\\S]*?)<\\/(?:(?:[\\w.-]+):)?'+n+'>','i'))?.[1]);
    const coords=b=>{const p=b.match(/<(?:(?:[\w.-]+):)?point\b[^>]*>([^<]+)<\//i)?.[1]?.trim().split(/\s+/).map(Number);if(p?.length>=2&&p.slice(0,2).every(Number.isFinite))return{lat:p[0],lon:p[1]};const box=b.match(/<(?:(?:[\w.-]+):)?box\b[^>]*>([^<]+)<\//i)?.[1]?.trim().split(/\s+/).map(Number);if(box?.length>=4&&box.slice(0,4).every(Number.isFinite))return{lat:(box[0]+box[2])/2,lon:(box[1]+box[3])/2};return{lat:null,lon:null}};
    const events=[...xml.matchAll(/<entry\b[\s\S]*?<\/entry>/gi)].map((m,i)=>{const b=m[0],c=coords(b),title=tag(b,'title')||'Aviso meteorológico europeo',area=tag(b,'areaDesc')||tag(b,'featureName')||tag(b,'area')||'';return{id:'meteoalarm-eu-'+i+'-'+Date.now(),name:title,type:'weather',lat:c.lat,lon:c.lon,area,event:tag(b,'event')||title,severity:tag(b,'severity')||'',urgency:tag(b,'urgency')||'',time:tag(b,'updated')||tag(b,'published')||null,source:'METEOALARM-EU',kind:'official',scope:'europe',detail:clean(tag(b,'summary')||tag(b,'content')).slice(0,600)}}).filter(e=>e.name);
    res.setHeader('Cache-Control','s-maxage=180, stale-while-revalidate=600');res.status(200).json({source:'METEOALARM-EU',generated:Date.now(),count:events.length,events});
  }catch(e){res.setHeader('Cache-Control','s-maxage=30');res.status(502).json({source:'METEOALARM-EU',error:'European alert feed temporarily unavailable',events:[]});}
}