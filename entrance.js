// Gate geometry adapted from Pawan’s original portfolio entrance.
// Two distinct scroll gestures: transform, settle at the torii, then enter.
(() => {
  const section = document.getElementById('gate-entrance');
  const scene = document.getElementById('gate-scene');
  const canvas = document.getElementById('gate-canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const replay = document.getElementById('replay-entrance');
  const main = document.getElementById('main');
  const header = document.querySelector('.header');
  const root = document.documentElement;
  const key = 'pawan-gate-seen-v4';
  let active = false, frame = 0, W = 0, H = 0, DPR = 1, travel = 1, G = {};
  let leaves = [], horizon = 0, mx = -1, my = -1, lastTime = 0;
  const cue = document.querySelector('#gate-scroll span');
  const CHECKPOINT = .66;
  let progress = 0, phase = 'india', transition = null, lastWheel = -Infinity;
  let settledAt = 0, touchStart = null, touchUsed = false, hiddenAt = 0;
  const TAU = Math.PI * 2;
  const artSlot = document.querySelector('.gate-art-slot');
  const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
  const lerp = (a,b,k) => a+(b-a)*k;
  const smooth = (a,b,x) => {const k=clamp((x-a)/(b-a),0,1);return k*k*(3-2*k);};
  function mix(a,b,k) {
    const p=parseInt(a.slice(1),16),q=parseInt(b.slice(1),16);
    return `rgb(${Math.round(lerp(p>>16,q>>16,k))},${Math.round(lerp((p>>8)&255,(q>>8)&255,k))},${Math.round(lerp(p&255,q&255,k))})`;
  }
function makeLeaf(atTop){return{x:Math.random()*W,y:atTop?-14-Math.random()*70:Math.random()*horizon,s:3.8+Math.random()*4.2,vy:14+Math.random()*26,sway:12+Math.random()*28,p:Math.random()*TAU,rot:Math.random()*TAU,vr:(Math.random()-0.5)*2.2,spin:Math.random()*TAU,spinV:1.1+Math.random()*2.0,c:(Math.random()*3)|0,a:0.26+Math.random()*0.3,ox:0,oy:0,ovx:0,ovy:0
};}
var PUSH_R=150,PUSH_F=21000,SPRING_K=150,SPRING_C=24;var LEAF_COL=["#A8813F","#8E6B3A","#B9955A"];var PETAL_COL=["#DA8C9A","#C66F83","#ECC0CA"];function leafPath(g,s){g.beginPath();g.moveTo(0,-s);g.bezierCurveTo(s*0.56,-s*0.34,s*0.50,s*0.42,0,s);g.bezierCurveTo(-s*0.50,s*0.42,-s*0.56,-s*0.34,0,-s);g.closePath();}
function petalPath(g,s){g.beginPath();g.moveTo(0,s*0.95);g.bezierCurveTo(s*0.74,s*0.34,s*0.64,-s*0.54,s*0.22,-s*0.80);g.quadraticCurveTo(0,-s*0.52,-s*0.22,-s*0.80);g.bezierCurveTo(-s*0.64,-s*0.54,-s*0.74,s*0.34,0,s*0.95);g.closePath();}
function drawFoliage(g,m,dt){if(!leaves.length)return;g.save();for(var i=0;i<leaves.length;i++){var L=leaves[i];L.y+=L.vy*lerp(1,0.40,m)*dt;L.p+=dt*lerp(0.9,1.5,m);L.rot+=L.vr*dt*lerp(1,0.45,m);L.spin+=dt*L.spinV*lerp(1,1.35,m);if(L.y>horizon+10){L.y=-12;L.x=Math.random()*W;L.ox=L.oy=L.ovx=L.ovy=0;}
var x=L.x+Math.sin(L.p)*L.sway*lerp(1,2.1,m)
+Math.sin(L.p*0.43)*L.sway*0.5*m;var px=x+L.ox,py=L.y+L.oy;var ax=-SPRING_K*L.ox-SPRING_C*L.ovx;var ay=-SPRING_K*L.oy-SPRING_C*L.ovy;if(mx>=0){var dx=px-mx,dy=py-my,d2=dx*dx+dy*dy;if(d2<PUSH_R*PUSH_R&&d2>0.5){var dd=Math.sqrt(d2),fp=1-dd/PUSH_R;fp*=fp;ax+=(dx/dd)*fp*PUSH_F;ay+=(dy/dd)*fp*PUSH_F;}
}
L.ovx+=ax*dt;L.ovy+=ay*dt;L.ox+=L.ovx*dt;L.oy+=L.ovy*dt;var face=0.20+Math.abs(Math.cos(L.spin))*0.80;g.save();g.translate(px,py);g.rotate(L.rot+Math.sin(L.p)*0.34*m);g.scale(face,1);if(m<0.98){g.globalAlpha=L.a*(1-m)*0.9;g.fillStyle=LEAF_COL[L.c];leafPath(g,L.s);g.fill();}
if(m>0.02){g.globalAlpha=L.a*m*1.6;g.fillStyle=PETAL_COL[L.c];petalPath(g,L.s*1.15);g.fill();}
g.restore();}
g.restore();}

function volute(g,cx,cy,r,dir,fill,a){if(a<=0.015||r<=0.5)return;g.save();g.globalAlpha*=a;g.fillStyle=fill;g.beginPath();g.arc(cx,cy,r,0,TAU);g.fill();g.strokeStyle="rgba(92,70,46,.42)";g.lineWidth=Math.max(1,r*0.17);g.lineCap="round";g.beginPath();for(var i=0;i<=48;i++){var f=i/48,ang=f*1.85*TAU*dir,rr=r*(0.80-f*0.60);var x=cx+Math.cos(ang)*rr,y=cy+Math.sin(ang)*rr;if(i===0)g.moveTo(x,y);else g.lineTo(x,y);}
g.stroke();g.restore();}
function hanging(g,m,h,cx,top){var span=h*0.50,sag=h*lerp(0.17,0.12,m),pts=46,i;function pt(f){return[cx-span+2*span*f,top+sag*4*f*(1-f)];}
if(m>0.02){g.save();g.globalAlpha*=m;g.strokeStyle="#DBCEB3";g.lineWidth=h*0.044;g.lineCap="round";g.beginPath();for(i=0;i<=pts;i++){var p=pt(i/pts);if(i===0)g.moveTo(p[0],p[1]);else g.lineTo(p[0],p[1]);}
g.stroke();g.strokeStyle="rgba(150,136,106,.45)";g.lineWidth=1.4;for(i=2;i<pts;i+=3){var q=pt(i/pts);g.beginPath();g.moveTo(q[0]-h*0.015,q[1]-h*0.017);g.lineTo(q[0]+h*0.015,q[1]+h*0.017);g.stroke();}
g.fillStyle="#FCFBF7";[0.18,0.38,0.58,0.78].forEach(function(fs){var s=pt(fs),wS=h*0.019,hS=h*0.072;g.beginPath();g.moveTo(s[0]-wS*0.55,s[1]);g.lineTo(s[0]+wS*0.80,s[1]);g.lineTo(s[0]+wS*0.08,s[1]+hS*0.40);g.lineTo(s[0]+wS*0.86,s[1]+hS*0.44);g.lineTo(s[0]-wS*0.50,s[1]+hS);g.lineTo(s[0]+wS*0.02,s[1]+hS*0.58);g.lineTo(s[0]-wS*0.78,s[1]+hS*0.54);g.closePath();g.fill();});g.restore();}
}
function member(g,cx,y,half,th,rise,fill,m){g.fillStyle=fill;g.beginPath();g.moveTo(cx-half,y);g.quadraticCurveTo(cx,y+rise*2,cx+half,y);g.lineTo(cx+half,y+th);g.quadraticCurveTo(cx,y+rise*2+th,cx-half,y+th);g.closePath();g.fill();g.save();g.globalAlpha*=lerp(.10,.18,m);g.strokeStyle="#F7E8CE";g.lineWidth=1.1;g.beginPath();g.moveTo(cx-half+1,y+1.5);g.quadraticCurveTo(cx,y+rise*2+1.5,cx+half-1,y+1.5);g.stroke();g.restore();}
function drawGate(g,m){var h=G.h,cx=G.cx,base=G.base;var stone=g.createLinearGradient(0,base-h,0,base);stone.addColorStop(0,mix("#C3A36E","#D14C30",m));stone.addColorStop(.48,mix("#B18E55","#C63D24",m));stone.addColorStop(1,mix("#A1814D","#AD3927",m));var stoneLo=mix("#967744","#A43A28",m);var crown=mix("#B89960","#193332",m);var carve="rgba(90,68,44,"+(0.30*(1-m))+")";var px=h*lerp(0.26,0.60,m);var pwB=lerp(h*0.115,h*0.120,m);var pwT=pwB*lerp(0.96,0.80,m);var pTop=base-h*lerp(0.555,0.855,m);[-1,1].forEach(function(s){var bx=cx+s*px;g.fillStyle=stone;g.beginPath();g.moveTo(bx-pwB/2,base);g.lineTo(bx+pwB/2,base);g.lineTo(bx+pwT/2,pTop);g.lineTo(bx-pwT/2,pTop);g.closePath();g.fill();if(m<0.985){g.fillStyle=carve;[0.14,0.86].forEach(function(f){var yy=base-(base-pTop)*f;g.fillRect(bx-pwB*0.54,yy,pwB*1.08,h*0.013);});g.save();g.globalAlpha*=1-m;g.fillStyle=stoneLo;g.fillRect(bx-pwB*0.80,pTop,pwB*1.60,h*0.042);g.fillRect(bx-pwB*0.64,pTop+h*0.042,pwB*1.28,h*0.022);g.fillRect(bx-pwB*0.86,base-h*0.028,pwB*1.72,h*0.028);g.fillRect(bx-pwB*0.70,base-h*0.050,pwB*1.40,h*0.022);g.restore();}
if(m>0.02){g.save();g.globalAlpha*=m;g.fillStyle=stone;[-1,1].forEach(function(o){var sx=bx+o*h*0.115;g.fillRect(sx-h*0.022,base-h*0.30,h*0.044,h*0.30);});g.fillStyle=crown;[-1,1].forEach(function(o){var sx=bx+o*h*0.115;g.fillRect(sx-h*0.045,base-h*0.312,h*0.090,h*0.014);});g.restore();}
});var mem=[
{y:base-h*lerp(0.905,0.925,m),half:h*lerp(0.44,1.00,m),th:h*lerp(0.060,0.075,m),rise:h*(0.016+0.069*m),fill:crown,sp:h*0.050*(1-m)},{y:base-h*lerp(0.762,0.860,m),half:h*lerp(0.41,0.93,m),th:h*lerp(0.058,0.040,m),rise:h*(0.013+0.057*m),fill:stoneLo,sp:h*0.048*(1-m)},{y:base-h*lerp(0.618,0.580,m),half:h*lerp(0.38,0.76,m),th:h*lerp(0.056,0.062,m),rise:h*0.010*(1-m),fill:stone,sp:h*0.046*(1-m)}
];mem.forEach(function(a){member(g,cx,a.y,a.half,a.th,a.rise,a.fill,m);volute(g,cx-a.half,a.y+a.th/2,a.sp,-1,a.fill,1-m);volute(g,cx+a.half,a.y+a.th/2,a.sp,1,a.fill,1-m);});var gapA=mem[0].y+mem[0].th,gapB=mem[1].y;var gapC=mem[1].y+mem[1].th,gapD=mem[2].y;[[-1,1-m],[0,1],[1,1-m]].forEach(function(u){var ux=cx+u[0]*h*lerp(0.21,0.34,m),a=u[1];if(a<=0.015)return;g.save();g.globalAlpha*=a;g.fillStyle=stoneLo;var wBlk=lerp(h*0.042,h*0.048,m);g.fillRect(ux-wBlk/2,gapA,wBlk,Math.max(0,gapB-gapA));g.fillRect(ux-wBlk/2,gapC,wBlk,Math.max(0,gapD-gapC));g.restore();});if(m>0.4){var a2=smooth(0.4,0.85,m);g.save();g.globalAlpha*=a2;g.fillStyle=crown;g.fillRect(cx-h*0.038,mem[2].y-h*0.076,h*0.076,h*0.076);g.fillStyle="rgba(201,150,47,.85)";g.fillRect(cx-h*0.038,mem[2].y-h*0.076,h*0.076,h*0.010);g.restore();}
hanging(g,m,h,cx,mem[2].y+mem[2].th);}

  function moveTo(destination, nextPhase, duration = 1150) {
    transition={from:progress,to:destination,start:performance.now(),duration,nextPhase};
    phase=destination===1?'entering':'morphing';
    schedule();
  }
  function advance(direction=1) {
    if (!active || transition) return;
    if (phase==='india' && direction>0) moveTo(CHECKPOINT,'japan');
    else if (phase==='japan' && direction>0) moveTo(1,'done',1050);
    else if (phase==='japan' && direction<0) moveTo(0,'india',950);
  }
  function markSeen() {try {sessionStorage.setItem(key,'1');} catch { /* Storage is optional. */ }}
  function setAvailable(available) {
    main.inert = !available; header.inert = !available;
    root.classList.toggle('gate-active',!available);
  }
  function finish(focus = false) {
    if (!active) return;
    active = false; transition=null; cancelAnimationFrame(frame); frame = 0;
    const remaining = Math.max(0,window.scrollY - travel);
    section.hidden = true; scene.hidden = true;
    setAvailable(true); markSeen();
    // Compensate for the removed runway in the same frame, retaining page position.
    window.scrollTo({top:remaining,behavior:'instant'});
    window.dispatchEvent(new Event('pawan:entrance-complete'));
    if (focus || section.contains(document.activeElement)) {
      const heading = main.querySelector('h1');
      heading.setAttribute('tabindex','-1'); heading.focus({preventScroll:true});
    }
  }
  function draw(now = 0) {
    frame = 0;
    if (!active) return;
    const dt = lastTime ? Math.min(.032,Math.max(0,(now-lastTime)/1000)) : .016;
    lastTime = now;
    if (transition) {
      const elapsed=clamp((now-transition.start)/transition.duration,0,1);
      const eased=elapsed*elapsed*(3-2*elapsed);
      progress=lerp(transition.from,transition.to,eased);
      window.scrollTo({top:progress*travel,behavior:'instant'});
      if (elapsed===1) {
        phase=transition.nextPhase;transition=null;settledAt=now;
        cue.textContent=phase==='japan'?'Scroll again to enter':'Scroll to transform';
      }
    }
    const p = progress;
    if (p >= .999) {finish(); return;}
    const m = smooth(.08,.64,p);
    const pass = smooth(.69,1,p);
    ctx.setTransform(DPR,0,0,DPR,0,0);ctx.clearRect(0,0,W,H);
    // The artwork fits its own grid row, independent of heading and caption size.
    // Use one camera for both gates so changing aspect ratio never clips the torii.
    const artworkWidth = G.h * lerp(.98,2.04,m);
    const fit = Math.min(G.slot.width * .96 / artworkWidth, G.slot.height * .98 / (G.h * .96));
    const z = Math.max(.01,fit) * Math.pow(9,pass);
    const ox=G.cx,oy=G.base-G.h*.4775;
    const centerY=G.slot.top+G.slot.height*.5;
    ctx.save();ctx.translate(W*.5,lerp(centerY,H*.5,pass));ctx.scale(z,z);ctx.translate(-ox,-oy);
    drawGate(ctx,m);
    ctx.restore();
    drawFoliage(ctx,m,dt);
    scene.style.setProperty('--gate-fade',1-smooth(.90,1,p));
    scene.style.setProperty('--gate-copy',1-smooth(.70,.87,p));
    scene.style.setProperty('--gate-india',1-smooth(.30,.53,p));
    scene.style.setProperty('--gate-japan',smooth(.42,.63,p));
    scene.style.setProperty('--gate-progress',p);
    scene.dataset.phase = p < .38 ? 'toran' : p < .7 ? 'torii' : 'enter';
    schedule();
  }
  function schedule() {if (active && !document.hidden && !frame) frame=requestAnimationFrame(draw);}
  function resize() {
    const oldW=W||window.innerWidth,oldH=H||window.innerHeight;
    travel=Math.max(1,section.offsetHeight);
    W=window.innerWidth;H=window.innerHeight;DPR=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.round(W*DPR);canvas.height=Math.round(H*DPR);
    G={cx:W*.5,base:0,h:500,slot:artSlot.getBoundingClientRect()};
    horizon=H;
    if (!leaves.length) leaves=Array.from({length:W<600?30:54},()=>makeLeaf(false));
    else leaves.forEach(leaf=>{leaf.x*=W/oldW;leaf.y*=H/oldH;});
    schedule();
  }
  function start() {
    if (reduced.matches || active) return;
    active=true;progress=0;phase='india';transition=null;lastWheel=-Infinity;
    cue.textContent='Scroll to transform';section.hidden=false;scene.hidden=false;
    scene.style.setProperty('--gate-fade',1);setAvailable(false);
    window.scrollTo({top:0,behavior:'instant'});lastTime=0;resize();
  }
  document.getElementById('skip-entrance').addEventListener('click',()=>finish(true));
  document.getElementById('gate-scroll').addEventListener('click',()=>advance());
  replay.addEventListener('click',()=>{start();if(active) document.getElementById('skip-entrance').focus({preventScroll:true});});
  scene.addEventListener('pointermove',event=>{if(event.pointerType==='mouse'){mx=event.clientX;my=event.clientY;}});
  scene.addEventListener('pointerleave',()=>{mx=-1;my=-1;});
  document.addEventListener('visibilitychange',()=>{
    const now=performance.now();lastTime=0;
    if(document.hidden){hiddenAt=now;cancelAnimationFrame(frame);frame=0;}
    else {if(transition)transition.start+=now-hiddenAt;schedule();}
  });
  // Consume momentum from the first gesture; only a fresh gesture leaves Japan.
  window.addEventListener('wheel',event=>{
    if (!active || event.ctrlKey) return;
    event.preventDefault();
    if (Math.abs(event.deltaY)<2 || Math.abs(event.deltaX)>Math.abs(event.deltaY)) return;
    const now=performance.now(),fresh=now-lastWheel>220;
    lastWheel=now;
    if (phase==='india' || (phase==='japan' && fresh && now-settledAt>300)) advance(Math.sign(event.deltaY));
  },{passive:false});
  scene.addEventListener('touchstart',event=>{
    touchStart=event.touches.length===1?event.touches[0].clientY:null;touchUsed=false;
  },{passive:true});
  scene.addEventListener('touchmove',event=>{
    if (!active || event.touches.length!==1 || touchStart===null) return;
    event.preventDefault();
    const distance=touchStart-event.touches[0].clientY;
    if (!touchUsed && Math.abs(distance)>28) {touchUsed=true;advance(Math.sign(distance));}
  },{passive:false});
  scene.addEventListener('touchend',()=>{touchStart=null;},{passive:true});
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',resize,{passive:true});
  if ('ResizeObserver' in window) {
    const layoutObserver = new ResizeObserver(() => { if (active) resize(); });
    layoutObserver.observe(artSlot);
  }
  document.fonts?.ready.then(() => { if(active) resize(); });
  window.addEventListener('keydown',event=>{
    if (!active) return;
    if (event.key==='Escape') {event.preventDefault();finish(true);return;}
    // Buttons keep their native Enter/Space activation.
    if (['Enter',' '].includes(event.key) && event.target.closest?.('button,a')) {if(event.repeat)event.preventDefault();return;}
    const forward=['ArrowDown','PageDown',' ','Enter','End'].includes(event.key);
    const backward=['ArrowUp','PageUp','Home'].includes(event.key);
    if (forward || backward) {event.preventDefault();if(!event.repeat)advance(forward?1:-1);}
  });
  window.addEventListener('hashchange',()=>{if(active) finish();});
  reduced.addEventListener('change',()=>{replay.hidden=reduced.matches;if(reduced.matches)finish();});
  replay.hidden=reduced.matches;
  let seen=false;try {seen=sessionStorage.getItem(key)==='1';} catch { /* Show once when storage permits. */ }
  // Respect deep links and browser-restored reading positions.
  if (!seen && !location.hash && window.scrollY < 10 && !reduced.matches) start();
})();
