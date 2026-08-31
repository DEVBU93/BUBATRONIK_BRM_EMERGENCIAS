// BRM EUROPE alert adapter — official MeteoAlarm Atom feed.
export default async function handler(req,res){
 const feedUrl="https://feeds.meteoalarm.org/feeds/meteoalarm-legacy-atom-europe";
 const clean=v=>decode(String(v||'').replace(/<!\[CDATA\[|\]\]>/g,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim());
 const decode=s=>s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&amp;/g,'&');
 const field=(block,name)=>{
   const re=new RegExp('<(?:[\\w.-]+:)?'+name+'\\b[^>]*>([\\s\\S]*?)<\\/(?:[\\w.-]+:)?'+name+'>','i');
   return clean(block.match(re)?.[1]);
 };
 const geometry=block=>{
   const read=names=>{
     for(const n of names){const v=block.match(new RegExp('<(?:[\\w.-]+:)?'+n+'\\b[^>]*>([^<]+)<\\/(?:[\\w.-]+:)?'+n+'>','i'))?.[1];if(v)return decode(v).trim()}
     return '';
   };
   const pairs=read(['point','pos']).trim().split(/\s+/).map(Number).filter(Number.isFinite);
   if(pairs.length>=2)return{lat:pairs[0],lon:pairs[1]};
   const box=read(['box']).split(/\s+/).map(Number).filter(Number.isFinite);
   if(box.length>=4)return{lat:(box[0]+box[2])/2,lon:(box[1]+box[3])/2};
   const poly=read(['polygon']).split(/\s+/).map(Number).filter(Number.isFinite);
   if(poly.length>=4){let lat=0,lon=0,n=0;for(let i=0;i+1<poly.length;i+=2){lat+=poly[i];lon+=poly[i+1];n++}return n?{lat:lat/n,lon:lon/n}:{lat:null,lon:null}}
   return{lat:null,lon:null};
 };
 try{
   const r=await fetch(feedUrl,{headers:{Accept:'application/atom+xml, application/xml, text/xml, */*'},signal:AbortSignal.timeout(12000)});
   if(!r.ok)throw new Error('HTTP '+r.status);
   const xml=await r.text();
   const blocks=[...xml.matchAll(/<entry\\b[\\s\\S]*?<\\/entry>/gi)].map(m=>m[0]);
   const events=blocks.map((b,i)=>{
     const g=geometry(b);
     const title=field(b,'title')||field(b,'event')||'Aviso meteorológico';
     const area=field(b,'areaDesc')||field(b,'area')||field(b,'featureName')||field(b,'featurename')||'';
     const time=field(b,'updated')||field(b,'published')||field(b,'effective')||null;
     const detail=field(b,'summary')||field(b,'description')||field(b,'content')||'';
     const link=b.match(/<link\\b[^>]*\\bhref=["']([^"']+)["']/i)?.[1]||feedUrl;
     const severity=field(b,'severity')||field(b,'awareness_level')||'';
     return {id:'europe-'+Buffer.from(title+'|'+area+'|'+time+'|'+i).toString('base64url').slice(0,40),name:title,type:'weather',lat:g.lat,lon:g.lon,area,time,severity,source:"METEOALARM-EU",scope:"europe",kind:'official',url:decode(link),detail:clean(detail).slice(0,900)};
   }).filter(e=>e.name);
   res.setHeader('Cache-Control','s-maxage=90, stale-while-revalidate=300');
   return res.status(200).json({source:"METEOALARM-EU",generated:Date.now(),count:events.length,events});
 }catch(e){
   res.setHeader('Cache-Control','no-store');
   return res.status(502).json({source:"METEOALARM-EU",error:String(e.message||e),events:[]});
 }
}