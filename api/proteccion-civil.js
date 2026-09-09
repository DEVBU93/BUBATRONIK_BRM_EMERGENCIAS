// Protección Civil / RAN: official Spanish emergency context.
// This adapter deliberately does not invent incident points. The official RAN viewer is the authoritative live map.
export default async function handler(req,res){
 const ran='https://ran-vmap.proteccioncivil.es/';
 const civil='https://www.proteccioncivil.es/';
 try{
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),8000);
  const r=await fetch(ran,{headers:{accept:'text/html,application/xhtml+xml,*/*'},signal:controller.signal}).finally(()=>clearTimeout(timer));
  const html=await r.text();
  const ok=r.ok;
  return res.status(200).json({source:'PROTECCION CIVIL',status:ok?'external-live':'unavailable',official:true,liveMap:ran,homepage:civil,updatedPolicy:'RAN publica avisos de España y se actualiza cada cinco minutos.',canProvideMobileAlerts:'ES-Alert',events:[],context:{name:'Red de Alerta Nacional',description:'Visor oficial de avisos meteorológicos, sismos y riesgo meteorológico de incendios en España. BRM enlaza el visor oficial en lugar de duplicar o reinterpretar sus alertas.',url:ran}})
 }catch(e){return res.status(200).json({source:'PROTECCION CIVIL',status:'external-unavailable',official:true,liveMap:ran,homepage:civil,events:[],error:String(e.message||e)})}
}