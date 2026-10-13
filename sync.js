(()=>{'use strict';
const $=id=>document.getElementById(id),msg=t=>{if($('syncMessage'))$('syncMessage').textContent=t};
let client=null,user=null,busy=false,timer=null,channel=null;
const stateKey='jobpilot-v2',settingsKey='jobpilot-cloud-settings';
const parse=(s,d)=>{try{return JSON.parse(s)||d}catch{return d}};
const getLocal=()=>parse(localStorage.getItem(stateKey),{jobs:[],profile:{}});
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const baseKey=id=>'jobpilot-sync-base-v4-'+id;
const valid=o=>o&&Array.isArray(o.jobs)&&o.profile&&typeof o.profile==='object';
function indicator(t){const el=$('cloudIndicator');if(el)el.textContent=t}
function init(){const url=$('syncUrl').value.trim().replace(/\/$/,''),key=$('syncKey').value.trim();if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url))throw Error('La URL debe terminar en .supabase.co, sin /rest ni otras rutas');if(!key)throw Error('Falta la clave pública');if(!window.supabase)throw Error('No se ha cargado Supabase. Comprueba la conexión a internet');if(client&&client.supabaseUrl===url)return client;
if(channel){client.removeChannel(channel);channel=null}
client=window.supabase.createClient(url,key,{auth:{persistSession:true,autoRefreshToken:true,storageKey:'jobpilot-auth-'+new URL(url).hostname}});localStorage.setItem(settingsKey,JSON.stringify({url,key}));return client}
async function getUser(){init();const {data,error}=await client.auth.getUser();if(error||!data?.user)throw Error('Inicia sesión primero');user=data.user;indicator('● Conectado · '+user.email);return user}
async function auth(mode){try{init();const email=$('syncEmail').value.trim(),password=$('syncPassword').value;if(!email||password.length<6)throw Error('Escribe tu correo y contraseña (mínimo 6 caracteres)');const {data,error}=mode==='up'?await client.auth.signUp({email,password,options:{emailRedirectTo:location.origin+location.pathname}}):await client.auth.signInWithPassword({email,password});if(error)throw error;if(mode==='up'){msg('Cuenta creada. Confirma tu correo si recibes el enlace y luego inicia sesión.');return}user=data.user;indicator('● Conectado · '+user.email);msg('Sesión iniciada. Sincronizando…');await sync()}catch(e){msg('Error: '+e.message)}}
// Merge only changes that are unambiguous. Never silently overwrite divergent edits to the same record.
function merge(base,local,remote){if(!valid(base)||!valid(local)||!valid(remote))return null;
const byId=a=>new Map(a.map(j=>[j.id,j]));const B=byId(base.jobs),L=byId(local.jobs),R=byId(remote.jobs);const result=[];
for(const id of new Set([...B.keys(),...L.keys(),...R.keys()])){
 const b=B.get(id),l=L.get(id),r=R.get(id),lc=!same(l,b),rc=!same(r,b);
 if(lc&&rc&&!same(l,r))return null;
 const item=lc?l:rc?r:b;if(item)result.push(item)
}
const lb=!same(local.profile,base.profile),rb=!same(remote.profile,base.profile);
if(lb&&rb&&!same(local.profile,remote.profile))return null;
return {jobs:result,profile:lb?local.profile:rb?remote.profile:base.profile};}
function applyRemote(remote,version,id){localStorage.setItem(stateKey,JSON.stringify(remote));localStorage.setItem(baseKey(id),JSON.stringify({version,data:remote}));msg('Datos descargados. Actualizando la pantalla…');location.reload()}
async function sync(){if(busy)return;busy=true;try{const u=await getUser(),local=getLocal();if(!valid(local))throw Error('Los datos locales no tienen el formato esperado. Exporta una copia antes de continuar.');const {data:record,error}=await client.from('jobpilot_state').select('data,version').eq('user_id',u.id).maybeSingle();if(error)throw error;
const saved=parse(localStorage.getItem(baseKey(u.id)),null);
if(!record){const {data:inserted,error:e}=await client.from('jobpilot_state').insert({user_id:u.id,data:local}).select('version').single();if(e)throw e;localStorage.setItem(baseKey(u.id),JSON.stringify({version:inserted.version,data:local}));msg('Primera copia guardada de forma segura en Supabase.');return}
const remote=record.data;if(!valid(remote))throw Error('La nube contiene un formato inesperado. No se han modificado tus datos.');
let next;
if(!saved){if(!local.jobs.length&&!local.profile?.bio){applyRemote(remote,record.version,u.id);return}if(!remote.jobs.length&&!remote.profile?.bio){next=local}else if(same(local,remote)){localStorage.setItem(baseKey(u.id),JSON.stringify({version:record.version,data:remote}));msg('Los datos coinciden en ambos dispositivos.');return}else{msg('Primera conexión: existen datos diferentes en este dispositivo y en la nube. Exporta una copia JSON de ambos antes de fusionarlos. No se ha sobrescrito nada.');return}}
else{next=merge(saved.data,local,remote);if(!next){msg('Conflicto: se ha modificado el mismo registro en ambos dispositivos. No se sobrescribió nada. Exporta copias para resolverlo.');return}}
if(same(next,remote)){if(!same(local,remote)){applyRemote(remote,record.version,u.id);return}localStorage.setItem(baseKey(u.id),JSON.stringify({version:record.version,data:remote}));msg('Todo sincronizado.');return}
const {data:updated,error:e}=await client.from('jobpilot_state').update({data:next,version:record.version+1,updated_at:new Date().toISOString()}).eq('user_id',u.id).eq('version',record.version).select('version').maybeSingle();if(e)throw e;if(!updated){msg('Hubo cambios simultáneos. Vuelve a sincronizar para reconciliarlos.');return}
localStorage.setItem(baseKey(u.id),JSON.stringify({version:updated.version,data:next}));if(!same(local,next)){localStorage.setItem(stateKey,JSON.stringify(next));location.reload();return}msg('Cambios sincronizados correctamente.');
}catch(e){msg('Error de sincronización: '+e.message)}finally{busy=false}}
function schedule(){clearTimeout(timer);timer=setTimeout(()=>{if(client)sync()},1200)}
$('syncRegister').onclick=()=>auth('up');$('syncLogin').onclick=()=>auth('in');$('syncNow').onclick=sync;
$('syncLogout').onclick=async()=>{if(client)await client.auth.signOut();user=null;indicator('● Sesión cerrada');msg('Sesión cerrada.')};
try{const saved=parse(localStorage.getItem(settingsKey),null);if(saved){$('syncUrl').value=saved.url||'';$('syncKey').value=saved.key||'';init();client.auth.getUser().then(({data})=>{if(data?.user){user=data.user;indicator('● Conectado · '+user.email);sync();subscribe()}})}}catch(e){msg('Configuración: '+e.message)}
function subscribe(){if(!client||!user||channel)return;channel=client.channel('jobpilot-'+user.id).on('postgres_changes',{event:'*',schema:'public',table:'jobpilot_state',filter:'user_id=eq.'+user.id},()=>schedule()).subscribe()}
const oldLogin=$('syncLogin').onclick;$('syncLogin').onclick=async()=>{await oldLogin();if(user)subscribe()};
window.addEventListener('focus',schedule);document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});
// Changes to existing form/board actions trigger synchronization, while keeping local data first.
document.getElementById('addForm')?.addEventListener('submit',()=>setTimeout(schedule,100));
document.getElementById('board')?.addEventListener('change',schedule);
document.getElementById('board')?.addEventListener('click',()=>setTimeout(schedule,500));
document.getElementById('saveProfile')?.addEventListener('click',()=>setTimeout(schedule,100));
setInterval(()=>{if(user&&!document.hidden)schedule()},60000);
})();
