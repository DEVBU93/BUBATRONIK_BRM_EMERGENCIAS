// BRM Spain alert adapter: resilient public-feed integration.
export default async function handler(req,res){
 const feeds=[
  {name:'METEOALARM-ES',url:'https://feeds.meteoalarm.org/feeds/meteoalarm-legacy-atom-spain'}
 ];
 const clean=v=>(v||'').replace(/<!\[CDATA\[|\]\]>/g,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
 const tag=(b,n)=>clean(b.match(new RegExp('<(?:(?:[\\w.-]+):)?'+n+'\\b[^>]*>([\\s\\S]*?)<\\/(?:(?:[\\w.-]+):)?'+n+'>','i'))?.[1]);
 const coords=b=>{
  const point=b.match(/<(?:(?:[\w.-]+):)?(?:point|pos)\b[^>]*>([^<]+)</i)?.[1];
  const box=b.match(/<(?:(?:[\w.-]+):)?box\b[^>]*>([^<]+)</i)?.[1];
  const polygon=b.match(/<(?:(?:[\w.-]+):)?polygon\b[^>]*>([^<]+)</i)?.[1];
  const nums=(point||box||polygon||'').trim().split(/\s+/).map(Number).filter(Number.isFinite);
  if(nums.length===2)return{lat:nums[0],lon:nums[1]};
  if(box&&nums.length>=4)return{lat:(nums[0]+nums[2])/2,lon:(nums[1]+nums[3])/2};
  if(polygon&&nums.length>=4){let pairs=[];for(let i=0;i+1<nums.length;i+=2)pairs.push([nums[i],nums[i+1]]);return{lat:pairs.reduce((a,p)=>a+p[0],0)/pairs.length,lon:pairs.reduce((a,p)=>a+p[1],0)/pairs.length}}
  return{lat:null,lon:null};
 };
 let xml='',source='',usedUrl='';
 for(const f of feeds){try{const r=await fetch(f.url,{headers:{Accept:'application/atom+xml,application/xml,text/xml'},signal:AbortSignal.timeout(9000)});if(!r.ok)continue;const t=await r.text();if(/<entry\b/i.test(t)){xml=t;source=f.name;usedUrl=f.url;break}}catch{}}
 if(!xml){res.setHeader('Cache-Control','s-maxage=30');return res.status(502).json({source:'SPAIN-ALERTS',error:'Spain public alert feed temporarily unavailable',events:[]})}
 const blocks=[...xml.matchAll(/<entry\b[\s\S]*?<\/entry>/gi)].map(x=>x[0]);
 const events=blocks.map((b,i)=>{const c=coords(b),title=tag(b,'title')||tag(b,'event')||'Aviso meteorológico';const area=tag(b,'areaDesc')||tag(b,'featurename')||tag(b,'area')||'';const time=tag(b,'updated')||tag(b,'published')||null;const detail=tag(b,'summary')||tag(b,'description')||tag(b,'content')||'';const url=b.match(/<link\b[^>]*href=["']([^"']+)/i)?.[1]||usedUrl;return{id:'spain-'+Buffer.from(title+'|'+area+'|'+time+'|'+i).toString('base64').replace(/[^a-z0-9]/gi,'').slice(0,28),name:title,type:'weather',lat:c.lat,lon:c.lon,area,time,source,scope:'spain',kind:'official',url,detail:clean(detail).slice(0,700)}}).filter(e=>e.name);
 res.setHeader('Cache-Control','s-maxage=120, stale-while-revalidate=300');
 res.status(200).json({source,generated:Date.now(),count:events.length,events});
}