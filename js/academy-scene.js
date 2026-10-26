import * as T from './vendor/three.module.js';
import {OrbitControls} from './vendor/OrbitControls.js';

const host=document.getElementById('scene'), status=document.getElementById('scene-status');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
try { initialize(); } catch(error) { status.hidden=false;status.textContent='3D 教室暫時無法開啟，請使用下方四個服務入口。';console.warn('Academy fallback:',error); }
function initialize(){
const renderer=new T.WebGLRenderer({antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.setClearColor(0x000000,0);host.append(renderer.domElement);status.hidden=true;
const scene=new T.Scene();const camera=new T.PerspectiveCamera(38,1,.1,100);const home=new T.Vector3(13,12,17);camera.position.copy(home);
const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,1,0);controls.enableDamping=true;controls.enablePan=false;controls.minDistance=9;controls.maxDistance=30;controls.minPolarAngle=.35;controls.maxPolarAngle=1.4;
scene.add(new T.HemisphereLight(0xfff9e8,0x9eae91,2.6));const sun=new T.DirectionalLight(0xffe7c2,3.4);sun.position.set(-3,12,8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-10,right:10,top:10,bottom:-10});sun.shadow.bias=-.001;scene.add(sun);
const colors={wood:0xc99d71,cream:0xf5edd9,green:0x8ba88a,dark:0x42594d,peach:0xe4ab8c};
const materials=new Map();function mat(c){if(!materials.has(c)) materials.set(c,new T.MeshStandardMaterial({color:c,roughness:.85}));return materials.get(c);}
function box(parent,w,h,d,x,y,z,c){const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat(c));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function ball(parent,r,x,y,z,c,s=[1,1,1]){const m=new T.Mesh(new T.SphereGeometry(r,20,14),mat(c));m.position.set(x,y,z);m.scale.set(...s);m.castShadow=true;parent.add(m);return m;}
function cyl(parent,r,h,x,y,z,c,r2=r){const m=new T.Mesh(new T.CylinderGeometry(r2,r,h,24),mat(c));m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;}
function group(x=0,y=0,z=0,parent=scene){const g=new T.Group();g.position.set(x,y,z);parent.add(g);return g;}
function plaque(parent,text,x,y,z,w=2,bg='#42594d',fg='#fff9e8'){const canvas=document.createElement('canvas');canvas.width=768;canvas.height=256;const ctx=canvas.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,768,256);ctx.strokeStyle=fg;ctx.globalAlpha=.35;ctx.strokeRect(16,16,736,224);ctx.globalAlpha=1;ctx.fillStyle=fg;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='500 44px sans-serif';text.split('\n').forEach((line,i,arr)=>ctx.fillText(line,384,128+(i-(arr.length-1)/2)*62));const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;const m=new T.Mesh(new T.PlaneGeometry(w,w/3),new T.MeshBasicMaterial({map:texture,side:T.DoubleSide}));m.position.set(x,y,z);parent.add(m);return {mesh:m,texture,ctx,canvas};}
const leaves=[];
function plant(parent,x,y,z,size=1){const g=group(x,y,z,parent);cyl(g,.18*size,.32*size,0,.16*size,0,0xd4aa85,.23*size);for(let i=0;i<5;i++){const a=i*2.4;const leaf=ball(g,.25*size,Math.cos(a)*.15*size,.5*size+i*.04*size,Math.sin(a)*.15*size,0x78976c,[.55,1.3,.7]);leaf.rotation.z=Math.cos(a)*.5;leaves.push(leaf);}return g;}
function table(parent,x,z,w=2,d=1.1){box(parent,w,.15,d,x,1.25,z,colors.wood);for(const a of [-1,1])for(const b of [-1,1])box(parent,.1,1.15,.1,x+a*(w/2-.15),.6,z+b*(d/2-.12),colors.wood);}
function chair(parent,x,z,c=colors.green){box(parent,.65,.18,.6,x,.65,z,c);box(parent,.65,.7,.14,x,1.02,z-.3,c);for(const a of [-1,1])for(const b of [-1,1])box(parent,.08,.6,.08,x+a*.23,.3,z+b*.2,colors.wood);}
function book(parent,x,y,z,c,w=.2){return box(parent,w,.55,.38,x,y,z,c);}
function monitor(parent,x,z,text){box(parent,.08,.36,.08,x,1.53,z,colors.dark);box(parent,.55,.04,.3,x,1.34,z,colors.dark);box(parent,1,.69,.1,x,1.97,z,colors.dark);return plaque(parent,text,x,1.97,z+.06,.91,'#294c46','#bad8b6');}
// A raised dollhouse with two open sides, wood planks and a tiny garden.
box(scene,11,.4,8,0,-.2,0,0xcab18a);box(scene,11.15,.12,8.15,0,-.43,0,0xb99670);
for(let i=0;i<22;i++)box(scene,.487,.055,7.9,-5.13+i*.49,.025,0,i%3===0?0xdfc59f:0xe6cfad);
box(scene,11,3.7,.16,0,1.85,-4,0xf5edd9);box(scene,.16,3.7,8,-5.5,1.85,0,0xe7e9d7);
box(scene,11,.16,.12,0,.2,-3.87,colors.wood);box(scene,.12,.16,8,-5.38,.2,0,colors.wood);
// Window and wall trim.
box(scene,2.1,1.7,.1,-.1,2.4,-3.88,0xc5d9cc);for(const x of [-1.2,1])box(scene,.12,1.9,.2,x,2.4,-3.77,0xe2c8a4);box(scene,2.3,.1,.22,-.1,2.4,-3.74,colors.cream);box(scene,.08,1.7,.2,-.1,2.4,-3.74,colors.cream);box(scene,2.5,.12,.4,-.1,1.52,-3.7,colors.wood);plant(scene,-.7,1.58,-3.65,.65);
plaque(scene,"Jacobs’ Little Academy\n小小教室 · 大大的可能",0,3.3,-3.87,3.5,'#f5edd9','#687c5d');
// Wall clock with moving hands.
const clock=cyl(scene,.31,.08,3.7,3.05,-3.85,colors.wood);clock.rotation.x=Math.PI/2;
const face=cyl(scene,.27,.09,3.7,3.05,-3.79,colors.cream);face.rotation.x=Math.PI/2;
const hands=group(3.7,3.05,-3.71);const hour=group(0,0,0,hands),minute=group(0,0,.01,hands);box(hour,.025,.16,.02,0,.07,0,colors.dark);box(minute,.02,.23,.02,0,.1,0,colors.dark);
// Clickable rooms. Every descendant inherits its room through ray traversal.
const ids=['service-rf','service-ai','service-transition','service-fresh'];const labels=['RF 技術諮詢','AI 專案與作品集輔導','跨領域轉職諮詢','新鮮人職涯諮詢'];
const coords=[[-3.6,-2.1],[3.3,-2.1],[-3.5,1.9],[3.5,1.9]];
const accents=[0xe5b69a,0xb9d1b9,0xe5d19d,0xc6d4a7];const rooms=[];const rugs=[];
ids.forEach((id,i)=>{const g=group(coords[i][0],0,coords[i][1]);g.userData.action=id;rooms.push(g);const rug=box(g,3.15,.025,2.8,0,.07,0,accents[i]);rugs.push(rug);plaque(g,['RF ENGINEERING','AI PORTFOLIO','CAREER CORNER','FRESH START'][i],0,.28,1.44,2.3,'#f8f2e2','#677a5c');});
const rf=rooms[0];table(rf,0,-.1,2.6,1.1);const scope=monitor(rf,-.6,-.23,'RF / MHz');box(rf,.7,.4,.5,.6,1.53,-.15,0xe9e7d6);plaque(rf,'∿ ∿ ∿',.6,1.55,.11,.6,'#324e49','#acd5a3');box(rf,.65,.04,.4,.4,1.36,.31,0x6e9b6d);for(let i=0;i<4;i++)box(rf,.09,.08,.09,.2+i*.12,1.42,.3,0xd1bc76);cyl(rf,.035,.9,1,1.8,-.25,colors.dark);ball(rf,.08,1,2.28,-.25,colors.peach);chair(rf,0,.9,colors.peach);plaque(rf,'RF LAB / 電路與無線',0,2.65,-1.79,2.5);
const ai=rooms[1];table(ai,0,0,2.6);const code=monitor(ai,-.58,-.2,'> build your idea\nconst future = you;');monitor(ai,.58,-.2,'GITHUB\nproject / roadmap');box(ai,1,.04,.3,0,1.35,.3,0xeee8d8);chair(ai,0,1);plaque(ai,'IDEA → BUILD → SHARE',0,2.65,-1.79,2.6);const robot=group(1.05,1.4,.2,ai);box(robot,.35,.35,.3,0,.15,0,0xe7eee1);ball(robot,.035,-.08,.18,.16,colors.dark);ball(robot,.035,.08,.18,.16,colors.dark);cyl(robot,.018,.2,0,.41,0,colors.dark);ball(robot,.05,0,.53,0,colors.peach);
const career=rooms[2];for(const x of [-.85,.85]){box(career,.95,.4,1.1,x,.45,0,0xd9c78e);box(career,.95,.7,.2,x,.91,-.5,0xd9c78e);for(const side of [-1,1])box(career,.12,.35,1.1,x+side*.45,.8,0,0xe4d4a9);}cyl(career,.45,.12,0,.7,.5,colors.wood);cyl(career,.07,.6,0,.35,.5,colors.wood);cyl(career,.09,.15,0,.83,.5,colors.cream);box(career,.35,.03,.3,.13,.78,.8,0x779d87);const board=plaque(career,'CAREER ROADMAP\n你的下一步，慢慢聊。',0,1.8,-1.2,2.2,'#fffae8','#70815c');box(career,.07,1.5,.08,-.9,.8,-1.25,colors.wood);box(career,.07,1.5,.08,.9,.8,-1.25,colors.wood);plant(career,-1.3,0,.9,1.1);
const fresh=rooms[3];table(fresh,0,0,1.8);chair(fresh,0,.95,0xa0b583);box(fresh,.55,.02,.4,0,1.35,.1,colors.cream);box(fresh,.5,.08,.4,.5,1.39,-.2,0x6d8968);const cap=box(fresh,.5,.04,.5,-.5,1.58,-.15,colors.dark);cap.rotation.y=.4;cyl(fresh,.17,.18,-.5,1.45,-.15,colors.dark);box(fresh,.4,.6,.22,.9,.4,.9,0xb78f65);plaque(fresh,'YOUR FIRST CHAPTER\n履歷 · 面試 · 勇敢出發',0,1.95,-1.2,2.4);
// Bookcase and small books.
const shelf=group(-4.95,0,-.2);box(shelf,.55,1.8,1.3,0,.9,0,colors.wood);for(const y of [.2,.85,1.5]){box(shelf,.7,.09,1.4,.08,y,0,colors.cream);for(let i=0;i<4;i++){const b=book(shelf,.18,y+.32,-.46+i*.28,[0x90a68c,0xd1a186,0xe0cb98,0x798e80][i]);b.rotation.y=Math.PI/2;}}
// Central reception desk: rounded front, work surface, ledger, lamp, brass bell.
const reception=group(0,0,.1);box(reception,2.65,1.25,1.2,0,.65,.5,0xd0bb91);ball(reception,.6,-1.3,.65,.5,0xd0bb91,[.32,1,1]);ball(reception,.6,1.3,.65,.5,0xd0bb91,[.32,1,1]);box(reception,3,.13,1.45,0,1.32,.5,colors.cream);box(reception,2.45,.77,.03,0,.69,1.11,0x91a68a);plaque(reception,"Jacobs’\nLITTLE ACADEMY",0,.74,1.135,1.75,'#91a68a','#fffae8');monitor(reception,-.55,.35,'hello, little world');box(reception,.47,.035,.42,.38,1.42,.55,0xd5b58d);plaque(reception,'WELCOME',.42,1.65,.52,.52,'#fff7df','#687b5d');plant(reception,-1.1,1.4,.73,.65);
const lamp=group(.98,1.4,-.02,reception);cyl(lamp,.15,.04,0,0,0,colors.dark);cyl(lamp,.025,.55,0,.29,0,colors.dark);cyl(lamp,.23,.22,0,.58,0,0xe0bd79,.08);
const bell=group(.92,1.4,.91,reception);bell.userData.action='bell';cyl(bell,.2,.05,0,.025,0,0xa67c39);ball(bell,.16,0,.08,0,0xd2ae61,[1,.65,1]);cyl(bell,.025,.09,0,.19,0,0xa67c39);ball(bell,.05,0,.25,0,0xd2ae61);
// Friendly engineer, seated behind the reception.
const teacher=group(0,0,-.7);teacher.userData.action='teacher';chair(teacher,0,0,colors.dark);ball(teacher,.36,0,1.05,0,0x9aaf9e,[1,1.3,.7]);const head=group(0,1.87,0,teacher);ball(head,.48,0,0,0,0xe4b899,[1,1.05,.9]);ball(head,.48,0,.2,-.08,0x59554b,[1,.72,.86]);ball(head,.11,-.45,-.02,0,0xe4b899);ball(head,.11,.45,-.02,0,0xe4b899);
const eyes=[];for(const x of [-.17,.17]){const ring=new T.Mesh(new T.TorusGeometry(.13,.018,8,24),mat(colors.dark));ring.position.set(x,.02,.41);head.add(ring);eyes.push(ball(head,.035,x,.01,.43,colors.dark));}box(head,.1,.02,.02,0,.02,.43,colors.dark);ball(head,.07,0,-.09,.45,0xd8a384);const smile=new T.Mesh(new T.TorusGeometry(.1,.012,8,16,Math.PI),mat(0x975f50));smile.rotation.z=Math.PI;smile.position.set(0,-.16,.405);head.add(smile);
const arm=group(.33,1.25,0,teacher);ball(arm,.13,.08,-.1,.13,0x9aaf9e,[1,1.8,1]);ball(arm,.12,.1,-.26,.2,0xe4b899);ball(teacher,.13,-.35,1.08,.25,0x9aaf9e,[1,1.7,1]);ball(teacher,.11,-.35,.95,.4,0xe4b899);
const coffee=group(-.34,.98,.43,teacher);cyl(coffee,.09,.16,0,0,0,colors.cream);const handle=new T.Mesh(new T.TorusGeometry(.065,.018,8,16),mat(colors.cream));handle.position.set(.1,0,0);coffee.add(handle);
plant(scene,4.85,0,-3.3,1.5);plant(scene,-4.9,0,3.25,1.3);
// Small office residents use lightweight geometry, with clear walking aisles.
function resident(parent,x,z,{shirt=0xa3b7a0,hair=0x5c5046,seated=false,skin=0xe7bd9e}={}){
  const root=group(x,0,z,parent), body=group(0,0,0,root);
  const hip=seated?.7:.78;
  ball(body,.27,0,hip+.31,0,shirt,[1,1.35,.8]);
  const face=group(0,hip+.93,0,body);
  ball(face,.33,0,0,0,skin,[1,1.08,.95]);
  ball(face,.34,0,.14,-.06,hair,[1,.75,.9]);
  for(const side of [-1,1]){
    ball(face,.055,side*.32,-.015,0,skin);
    ball(face,.024,side*.11,-.005,.31,0x3f4540);
  }
  const mouth=new T.Mesh(new T.TorusGeometry(.065,.009,6,12,Math.PI),mat(0xa76c59));
  mouth.rotation.z=Math.PI;mouth.position.set(0,-.12,.304);face.add(mouth);
  const arms=[],legs=[];
  for(const side of [-1,1]){
    const a=group(side*.27,hip+(seated?.78:.46),0,body);arms.push(a);
    if(seated){
      ball(a,.085,side*.025,-.17,.16,shirt,[1,1,2]);
      ball(a,.075,side*.025,-.18,.34,skin);
    }else{
      ball(a,.09,side*.025,-.18,0,shirt,[1,1.8,1]);
      ball(a,.075,side*.025,-.36,0,skin);
    }
    const leg=group(side*.12,hip-.03,0,body);legs.push(leg);
    if(seated){box(leg,.17,.17,.36,0,-.08,.14,0x66716b);box(leg,.15,.38,.15,0,-.3,.28,0x66716b);box(leg,.19,.12,.29,0,-.53,.36,0x53584e);}
    else {box(leg,.17,.57,.18,0,-.28,0,0x66716b);box(leg,.2,.13,.3,0,-.59,.06,0x53584e);}
  }
  return {root,body,face,arms,legs};
}
const employees=[resident(ai,0,.96,{shirt:0x89a998,seated:true}),resident(rf,0,.9,{shirt:0xc58f70,hair:0x464641,seated:true})];
employees.forEach(person=>person.root.rotation.y=Math.PI);
// A visitor chats over coffee; two more stroll and pause in the open front aisle.
const guest=resident(career,-.85,.05,{shirt:0xc7aa7c,hair:0x765445,seated:true});
const walkers=[resident(scene,-1.8,3.15,{shirt:0xc5a4a0,hair:0x67544b}),resident(scene,1.6,2.95,{shirt:0x9faec1,hair:0x4e4942})];
const routes=[
  [new T.Vector3(-2.1,0,3.25),new T.Vector3(1.75,0,3.25)],
  [new T.Vector3(1.7,0,2.85),new T.Vector3(-1.65,0,2.85)]
];
function animateResidents(t){
  employees.forEach((person,i)=>{
    person.arms.forEach((a,j)=>a.rotation.x=Math.sin(t*8+i*2+j*1.7)*.055);
    person.face.rotation.y=Math.sin(t*.7+i)*.09;
    person.body.position.y=Math.sin(t*1.6+i)*.009;
  });
  guest.face.rotation.y=Math.sin(t*.35)*.18;
  walkers.forEach((person,i)=>{
    // Fourteen seconds walking, three seconds looking around at either end.
    const phase=(t+i*8)%34,going=phase<17,part=phase%17;
    const progress=Math.min(part/14,1),from=routes[i][going?0:1],to=routes[i][going?1:0];
    person.root.position.lerpVectors(from,to,progress);
    person.root.rotation.y=Math.atan2(to.x-from.x,to.z-from.z);
    const moving=part<14,swing=moving?Math.sin(t*5+i)*.28:0;
    person.legs[0].rotation.x=swing;person.legs[1].rotation.x=-swing;
    person.arms[0].rotation.x=-swing*.6;person.arms[1].rotation.x=swing*.6;
    person.body.position.y=moving?Math.abs(Math.sin(t*5+i))*.025:0;
    person.face.rotation.y=moving?0:Math.sin(t)*.25;
  });
}
// Interaction and smooth focus transitions.
const raycaster=new T.Raycaster(),pointer=new T.Vector2();const tooltip=document.getElementById('scene-tooltip');const preview=document.getElementById('service-preview');let flight=null,selected=-1,waveUntil=0,bellUntil=0,low=innerWidth<700;
function reset(){preview.hidden=true;selected=-1;flight={from:camera.position.clone(),to:home.clone(),start:performance.now(),targetFrom:controls.target.clone(),targetTo:new T.Vector3(0,1,0)};}
window.academyExplore=id=>{const i=ids.indexOf(id);if(i<0)return;selected=i;document.getElementById('academy-stage').scrollIntoView({block:'center',behavior:reduced.matches?'instant':'smooth'});const section=document.getElementById(id);document.getElementById('preview-title').textContent=labels[i];document.getElementById('preview-number').textContent=`LITTLE CLASSROOM / 0${i+1}`;document.getElementById('preview-desc').textContent=section.querySelector('.section-heading > p:last-child').textContent;document.getElementById('preview-price').textContent=section.querySelector('.price').textContent;document.getElementById('preview-open').onclick=()=>switchView(id);preview.hidden=false;const target=new T.Vector3(coords[i][0]*.65,.9,coords[i][1]*.65);flight={from:camera.position.clone(),to:target.clone().add(new T.Vector3(7,7,10)),start:performance.now(),targetFrom:controls.target.clone(),targetTo:target};};
document.getElementById('close-preview').onclick=reset;document.getElementById('reset-camera').onclick=reset;window.addEventListener('academy-reset',reset);controls.addEventListener('start',()=>flight=null);
window.addEventListener('academy-wave',()=>waveUntil=performance.now()+2300);window.addEventListener('academy-bell',()=>bellUntil=performance.now()+900);
function pick(e){const rect=host.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(scene.children,true)[0];if(!hit)return null;let object=hit.object;while(object){if(object.userData.action)return object.userData.action;object=object.parent;}return null;}
let down=null;renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};});renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>7)return;const action=pick(e);if(action==='bell'){bellUntil=performance.now()+900;openBooking();}else if(action==='teacher'){waveUntil=performance.now()+2300;showToast('嗨～歡迎來到小小諮詢教室！','今天想了解哪一項服務呢？');}else if(ids.includes(action))window.academyExplore(action);down=null;});renderer.domElement.addEventListener('pointermove',e=>{const action=pick(e);renderer.domElement.style.cursor=action?'pointer':'grab';tooltip.hidden=!action;if(action){tooltip.textContent=action==='bell'?'叮～預約諮詢':action==='teacher'?'和 Jacobs 老師打招呼':labels[ids.indexOf(action)];const r=host.getBoundingClientRect();tooltip.style.left=`${Math.min(e.clientX-r.left+15,r.width-190)}px`;tooltip.style.top=`${Math.max(0,e.clientY-r.top-45)}px`;}});renderer.domElement.addEventListener('pointerleave',()=>tooltip.hidden=true);
function quality(){renderer.shadowMap.enabled=!low;renderer.setPixelRatio(Math.min(devicePixelRatio,low?1:1.7));document.getElementById('quality').setAttribute('aria-pressed',String(low));document.getElementById('quality').textContent=low?'省電模式：開':'省電模式';}document.getElementById('quality').onclick=()=>{low=!low;quality();};quality();
function resize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=w/h<.85?54:38;camera.updateProjectionMatrix();}new ResizeObserver(resize).observe(host);resize();
let last=0;function animate(now){requestAnimationFrame(animate);if(document.hidden||!document.getElementById('overview').classList.contains('active'))return;if(low&&now-last<32)return;last=now;const t=now/1000;
if(flight){const progress=reduced.matches?1:Math.min(1,(now-flight.start)/900);const ease=progress*progress*(3-2*progress);camera.position.lerpVectors(flight.from,flight.to,ease);controls.target.lerpVectors(flight.targetFrom,flight.targetTo,ease);if(progress===1)flight=null;}
if(!reduced.matches){animateResidents(t);coffee.position.y=.98+(t%18>15?Math.sin((t%18-15)/3*Math.PI)*.55:0);head.rotation.y=Math.sin(t*.5)*.12;head.rotation.z=Math.sin(t)*.025;eyes.forEach(eye=>eye.scale.y=t%5<.14?.1:1);arm.rotation.z=now<waveUntil?-.8+Math.sin(t*15)*.4:Math.sin(t*3)*.025;bell.position.y=1.4+(now<bellUntil?Math.abs(Math.sin((bellUntil-now)/90))*.19:0);if(!low)leaves.forEach((leaf,i)=>leaf.rotation.x=Math.sin(t+i)*.05);robot.position.y=1.4+Math.sin(t*2)*.03;}
const date=new Date();hour.rotation.z=-(date.getHours()%12+date.getMinutes()/60)*Math.PI/6;minute.rotation.z=-date.getMinutes()*Math.PI/30;
rugs.forEach((rug,i)=>{rug.material.emissive.setHex(i===selected?0x40391c:0);rug.material.emissiveIntensity=i===selected?.2:0;});
if(!reduced.matches&&Math.floor(t*8)!==scope.frame){scope.frame=Math.floor(t*8);const c=scope.ctx;c.fillStyle='#294c46';c.fillRect(0,0,768,256);c.strokeStyle='#a9dba1';c.lineWidth=5;c.beginPath();for(let x=0;x<768;x++){const y=128+Math.sin(x*.025+t*2)*65;x?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();scope.texture.needsUpdate=true;if(!low){code.ctx.fillStyle='#294c46';code.ctx.fillRect(0,0,768,256);code.ctx.fillStyle='#bad8b6';code.ctx.font='30px monospace';for(let i=0;i<7;i++)code.ctx.fillText(['> build your idea','const future = you;','  learn();','  create();','git commit -m grow'][i%5],35,((i*45+t*12)%310)-20);code.texture.needsUpdate=true;}}
controls.update();renderer.render(scene,camera);}
requestAnimationFrame(animate);renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();status.hidden=false;status.textContent='3D 顯示已暫停，請使用下方服務選單或重新整理頁面。';});
}
