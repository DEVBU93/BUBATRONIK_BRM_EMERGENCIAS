export default async function handler(req,res){
  const feedUrl='https://feeds.meteoalarm.org/feeds/meteoalarm-legacy-atom-europe';
  try{
    const r=await fetch(feedUrl,{headers:{Accept:'application/atom+xml, application/xml, text/xml'}});
    if(!r.ok) throw new Error('MeteoAlarm '+r.status);
    const xml=await r.text();
    const clean=v=>(v||'').replace(/<!\[CDATA\[|\]\]>/g,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
    const tag=(b,n)=>clean(b.match(new RegExp('<(?:(?:[\\w.-]+):)?'+n+'\\b[^>]*>([\\s\\S]*?)<\\/(?:(?:[\\w.-]+):)?'+n+'>','i'))?.[1]);
    const coords=b=>{
      const read=n=>b.match(new RegExp('<(?:(?:[\\w.-]+):)?'+n+'\\b[^>]*>([^<]+)<\\/','i'))?.[1]?.trim();
      const point=read('point')||read('pos'), box=read('box'), polygon=read('polygon');
      const nums=v=>(v||'').split(/\\s+/).map(Number).filter(Number.isFinite);
      let n=nums(point); if(n.length>=2)return{lat:n[0],lon:n[1]};
      n=nums(box); if(n.length>=4)return{lat:(n[0]+n[2])/2,lon:(n[1]+n[3])/2};
      n=nums(polygon); if(n.length>=4){let lat=0,lon=0,c=0;for(let i=0;i+1<n.length;i+=2){lat+=n[i];lon+=n[i+1];c++}return{lat:lat/c,lon:lon/c}}
      return{lat:null,lon:null};
    };
    const events=[...xml.matchAll(/<entry\b[\s\S]*?<\/entry>/gi)].map((m,i)=>{const b=m[0],c=coords(b),title=tag(b,'title')||'Aviso meteorológico europeo',area=tag(b,'areaDesc')||tag(b,'featureName')||tag(b,'area')||'';return{id:'meteoalarm-eu-'+Buffer.from((tag(b,'id')||title+'|'+area+'|'+(tag(b,'updated')||'')).toString()).toString('base64').replace(/[^a-z0-9]/gi,'').slice(0,32),name:title,type:'weather',lat:c.lat,lon:c.lon,area,event:tag(b,'event')||title,severity:tag(b,'severity')||'',urgency:tag(b,'urgency')||'',time:tag(b,'updated')||tag(b,'published')||null,source:'METEOALARM-EU',kind:'official',scope:'europe',url:b.match(/<link\\b[^>]*href=[\"']([^\"']+)/i)?.[1]||'https://www.meteoalarm.org/',detail:clean(tag(b,'summary')||tag(b,'content')).slice(0,600)}}).filter(e=>e.name);
    res.setHeader('Cache-Control','s-maxage=180, stale-while-revalidate=600');res.status(200).json({source:'METEOALARM-EU',generated:Date.now(),count:events.length,events});
  }catch(e){res.setHeader('Cache-Control','s-maxage=30');res.status(502).json({source:'METEOALARM-EU',error:'European alert feed temporarily unavailable',events:[]});}
}