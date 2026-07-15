// ---------- Preloader (guaranteed to dismiss) ----------
(function(){
  var pre = document.getElementById('preloader');
  var hidden = false;
  function hidePreloader(){
    if(hidden || !pre) return;
    hidden = true;
    pre.classList.add('done');
    setTimeout(function(){ if(pre && pre.parentNode) pre.parentNode.removeChild(pre); }, 900);
  }
  // 1. Normal path: everything finished loading
  window.addEventListener('load', function(){ setTimeout(hidePreloader, 300); });
  // 2. Fallback: DOM is ready, don't wait on remote images/fonts
  if(document.readyState === 'complete' || document.readyState === 'interactive'){
    setTimeout(hidePreloader, 900);
  } else {
    document.addEventListener('DOMContentLoaded', function(){ setTimeout(hidePreloader, 900); });
  }
  // 3. Hard safety net: never let the loader trap the page
  setTimeout(hidePreloader, 2500);
  // 4. If user interacts, get out of the way immediately
  ['click','scroll','keydown','touchstart'].forEach(function(ev){
    window.addEventListener(ev, hidePreloader, {once:true, passive:true});
  });
})();

// ---------- Custom cursor (Cuberto-style) ----------
(function(){
  const isTouch = matchMedia('(hover:none)').matches;
  if(isTouch) return;
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let mx=0,my=0,rx=0,ry=0;
  window.addEventListener('mousemove',e=>{
    mx=e.clientX;my=e.clientY;
    cursor.style.transform=`translate(${mx}px,${my}px) translate(-50%,-50%)`;
  });
  function loop(){
    rx += (mx-rx)*.15;
    ry += (my-ry)*.15;
    ring.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  }
  loop();
  const hoverSel = 'a, button, .magnet, .card, .faq-item summary, .industry-chip, .product-card, details summary, .test-card';
  document.querySelectorAll(hoverSel).forEach(el=>{
    el.addEventListener('mouseenter',()=>{cursor.classList.add('hover');ring.classList.add('hover');});
    el.addEventListener('mouseleave',()=>{cursor.classList.remove('hover');ring.classList.remove('hover');});
  });
  // Dark inversion when over dark sections
  const darkSel = '.trust-strip, .quality, .cta, .footer, .founder-block';
  document.querySelectorAll(darkSel).forEach(el=>{
    el.addEventListener('mouseenter',()=>cursor.classList.add('dark'));
    el.addEventListener('mouseleave',()=>cursor.classList.remove('dark'));
  });
})();

// ---------- Magnetic buttons ----------
document.querySelectorAll('.magnet').forEach(el=>{
  el.addEventListener('mousemove',e=>{
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width/2;
    const y = e.clientY - r.top - r.height/2;
    el.style.transform = `translate(${x*0.25}px, ${y*0.35}px)`;
  });
  el.addEventListener('mouseleave',()=>{ el.style.transform='translate(0,0)'; });
});

// ---------- Nav scroll state ----------
const nav = document.getElementById('nav');
window.addEventListener('scroll',()=>{
  nav.classList.toggle('scrolled', window.scrollY > 30);
});

// ---------- Scroll reveal (with fallback) ----------
(function(){
  var items = document.querySelectorAll('.reveal');
  function showAll(){ items.forEach(function(el){ el.classList.add('in'); }); }

  if(!('IntersectionObserver' in window)){ showAll(); return; }

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  },{threshold:.08, rootMargin:'0px 0px -50px 0px'});

  items.forEach(function(el){ io.observe(el); });

  // Anything above the fold reveals immediately
  requestAnimationFrame(function(){
    items.forEach(function(el){
      if(el.getBoundingClientRect().top < window.innerHeight) el.classList.add('in');
    });
  });
})();

// ---------- Close other FAQ items on open (accordion behaviour) ----------
document.querySelectorAll('.faq-item').forEach(item=>{
  item.addEventListener('toggle',()=>{
    if(item.open){
      document.querySelectorAll('.faq-item').forEach(o=>{ if(o!==item) o.open=false; });
    }
  });
});

/* ═══════════════════════════════════════════════════════════
   CINEMATIC ENGINE — everything below is generated in code.
   No video files, no libraries. Pure canvas + rAF.
   ═══════════════════════════════════════════════════════════ */

var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── 1. AURORA CANVAS ───────────────────────────────────────
   Layered metaballs drifting on sine paths, drawn with radial
   gradients + 'lighter' blending. Reads like a slow liquid
   gradient video, but it's ~40 lines of math.                */
(function(){
  var cv = document.getElementById('auroraCanvas');
  if(!cv || REDUCED) return;
  var ctx = cv.getContext('2d');
  var w, h, dpr, t = 0, running = true;

  var blobs = [
    {r:.42, hue:'26,143,90',  ax:.22, ay:.14, sx:.00021, sy:.00017, ox:.30, oy:.35, a:.30},
    {r:.36, hue:'10,37,64',   ax:.26, ay:.18, sx:.00016, sy:.00024, ox:.68, oy:.30, a:.22},
    {r:.30, hue:'77,214,147', ax:.30, ay:.20, sx:.00028, sy:.00013, ox:.50, oy:.62, a:.20},
    {r:.34, hue:'26,143,90',  ax:.18, ay:.24, sx:.00012, sy:.00029, ox:.85, oy:.70, a:.16}
  ];

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = cv.clientWidth; h = cv.clientHeight;
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  function draw(){
    if(!running) return;
    ctx.clearRect(0,0,w,h);
    ctx.globalCompositeOperation = 'lighter';
    var base = Math.min(w,h);

    for(var i=0;i<blobs.length;i++){
      var b = blobs[i];
      // Each blob rides two out-of-phase sine waves → organic, never-repeating drift
      var x = (b.ox + Math.sin(t*b.sx + i*1.7) * b.ax) * w;
      var y = (b.oy + Math.cos(t*b.sy + i*2.3) * b.ay) * h;
      var r = base * b.r * (1 + Math.sin(t*0.00019 + i)*0.10); // breathing radius

      var g = ctx.createRadialGradient(x,y,0,x,y,r);
      g.addColorStop(0,   'rgba('+b.hue+','+b.a+')');
      g.addColorStop(0.45,'rgba('+b.hue+','+(b.a*0.35)+')');
      g.addColorStop(1,   'rgba('+b.hue+',0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    t += 16;
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  // Pause when hero scrolls away — saves battery
  new IntersectionObserver(function(e){
    running = e[0].isIntersecting;
    if(running) draw();
  },{threshold:0}).observe(cv.parentElement);
  draw();
})();


/* ── 2. ECG HEARTBEAT LINE ──────────────────────────────────
   A real PQRST waveform, scrolling right-to-left with a glowing
   scan head and a fading trail. Fully procedural.            */
(function(){
  var cv = document.getElementById('ecgCanvas');
  if(!cv) return;
  var ctx = cv.getContext('2d');
  var w,h,dpr,x=0,running=true;

  function resize(){
    dpr = Math.min(window.devicePixelRatio||1,2);
    w = cv.clientWidth; h = cv.clientHeight;
    cv.width = w*dpr; cv.height = h*dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.fillStyle = '#0a2540'; ctx.fillRect(0,0,w,h);
  }

  // PQRST morphology as a function of phase (0..1)
  function ecg(p){
    var y = 0;
    y += 0.06 * Math.exp(-Math.pow((p-0.16)/0.022,2));  // P wave
    y -= 0.09 * Math.exp(-Math.pow((p-0.29)/0.008,2));  // Q dip
    y += 1.00 * Math.exp(-Math.pow((p-0.32)/0.010,2));  // R spike
    y -= 0.26 * Math.exp(-Math.pow((p-0.36)/0.013,2));  // S dip
    y += 0.20 * Math.exp(-Math.pow((p-0.55)/0.045,2));  // T wave
    return y;
  }

  var PERIOD = 260;   // px per full heartbeat
  var SPEED  = 2.4;   // px per frame

  function draw(){
    if(!running) return;
    if(REDUCED){ return; }

    // Trail fade: paint translucent navy over the whole band each frame
    ctx.fillStyle = 'rgba(10,37,64,0.055)';
    ctx.fillRect(0,0,w,h);

    var mid = h*0.55, amp = h*0.30;

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.strokeStyle = '#4dd693';
    ctx.shadowColor = 'rgba(77,214,147,0.9)';
    ctx.shadowBlur = 12;

    for(var i=0;i<=SPEED;i++){
      var px = x + i;
      var py = mid - ecg(((px % PERIOD) / PERIOD)) * amp;
      if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Glowing scan head
    var hx = x + SPEED;
    var hy = mid - ecg(((hx % PERIOD)/PERIOD)) * amp;
    var g = ctx.createRadialGradient(hx,hy,0,hx,hy,9);
    g.addColorStop(0,'rgba(255,255,255,0.95)');
    g.addColorStop(0.4,'rgba(77,214,147,0.7)');
    g.addColorStop(1,'rgba(77,214,147,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(hx,hy,9,0,Math.PI*2); ctx.fill();

    x += SPEED;
    if(x > w){ x = 0; ctx.fillStyle='#0a2540'; ctx.fillRect(0,0,w,h); }

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', function(){ resize(); x = 0; });
  new IntersectionObserver(function(e){
    running = e[0].isIntersecting;
    if(running) draw();
  },{threshold:0}).observe(cv);
  draw();
})();


/* ── 3. SPLIT-TEXT CHAR REVEAL ──────────────────────────────
   Wraps every character in a span, then staggers them up from
   behind a mask. The signature Cuberto headline entrance.    */
(function(){
  document.querySelectorAll('[data-split]').forEach(function(el){
    var html = el.innerHTML;
    // Preserve <em> tags by splitting on them
    var out = html.replace(/([^<>]+)(?=<|$)/g, function(txt){
      if(!txt.trim()) return txt;
      return txt.split(/(\s+)/).map(function(word){
        if(!word.trim()) return word;
        var chars = word.split('').map(function(c){
          return '<span class="char">'+c+'</span>';
        }).join('');
        return '<span class="word">'+chars+'</span>';
      }).join('');
    });
    el.innerHTML = out;

    // Stagger each char
    var chars = el.querySelectorAll('.char');
    chars.forEach(function(c,i){
      c.style.transitionDelay = (i * 0.018 + 0.25) + 's';
    });

    setTimeout(function(){ el.classList.add('in'); }, 300);
  });
})();


/* ── 4. SCROLL PROGRESS BAR ─────────────────────────────────*/
(function(){
  var bar = document.getElementById('progressBar');
  if(!bar) return;
  function update(){
    var st = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (st/max)*100 : 0) + '%';
  }
  window.addEventListener('scroll', update, {passive:true});
  update();
})();


/* ── 5. PARALLAX (scroll-scrubbed depth) ────────────────────*/
(function(){
  var els = document.querySelectorAll('[data-parallax]');
  if(!els.length || REDUCED) return;
  var ticking = false;
  function update(){
    var vh = window.innerHeight;
    els.forEach(function(el){
      var r = el.getBoundingClientRect();
      if(r.bottom < -200 || r.top > vh + 200) return;
      var speed = parseFloat(el.dataset.parallax) || 0.1;
      var offset = (r.top + r.height/2 - vh/2) * -speed;
      var img = el.querySelector('img');
      if(img) img.style.transform = 'translate3d(0,'+offset.toFixed(2)+'px,0) scale(1.12)';
    });
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if(!ticking){ requestAnimationFrame(update); ticking = true; }
  },{passive:true});
  update();
})();


/* ── 6. CLIP-PATH CURTAIN REVEALS ───────────────────────────*/
(function(){
  var els = document.querySelectorAll('.clip-reveal');
  if(!els.length) return;
  if(!('IntersectionObserver' in window)){
    els.forEach(function(e){ e.classList.add('in'); }); return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  },{threshold:.15});
  els.forEach(function(e){ io.observe(e); });
})();


/* ── 7. ANIMATED COUNT-UP ───────────────────────────────────
   Eased number roll, fires once when scrolled into view.     */
(function(){
  var counters = document.querySelectorAll('.count');
  if(!counters.length) return;

  function run(el){
    var target = parseInt(el.dataset.count, 10) || 0;
    var dur = 1600, start = performance.now();
    function tick(now){
      var p = Math.min((now - start)/dur, 1);
      var eased = 1 - Math.pow(1 - p, 4);          // easeOutQuart
      el.textContent = Math.round(target * eased);
      if(p < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }

  if(!('IntersectionObserver' in window)){
    counters.forEach(function(c){ c.textContent = c.dataset.count; }); return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ run(e.target); io.unobserve(e.target); }
    });
  },{threshold:.6});
  counters.forEach(function(c){ io.observe(c); });
})();


/* ── 8. 3D TILT ON PRODUCT CARDS ────────────────────────────
   Cursor position maps to rotateX/rotateY. Card lifts toward
   the pointer — expensive-feeling, costs nothing.            */
(function(){
  if(matchMedia('(hover:none)').matches || REDUCED) return;
  document.querySelectorAll('.product-card, .quality-card, .test-card').forEach(function(card){
    var MAX = 6; // degrees
    card.addEventListener('mousemove', function(e){
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width  - 0.5;
      var py = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform =
        'perspective(1200px) rotateY('+(px*MAX)+'deg) rotateX('+(-py*MAX)+'deg) translateY(-6px) scale(1.012)';
    });
    card.addEventListener('mouseleave', function(){
      card.style.transform = '';
    });
  });
})();


/* ── 9. CLICK RIPPLE BURST ──────────────────────────────────*/
(function(){
  if(REDUCED) return;
  document.addEventListener('click', function(e){
    var r = document.createElement('span');
    r.className = 'ripple';
    r.style.left = e.clientX + 'px';
    r.style.top  = e.clientY + 'px';
    document.body.appendChild(r);
    setTimeout(function(){ r.remove(); }, 750);
  });
})();


/* ── 10. TEXT SCRAMBLE ON NAV HOVER ─────────────────────────
   Decodes letters like a terminal. Small touch, big polish.  
(function(){
  if(matchMedia('(hover:none)').matches || REDUCED) return;
  var GLYPHS = '!<>-_\\/[]{}—=+*^?#';

  function scramble(el){
    var original = el.dataset.text || el.textContent;
    el.dataset.text = original;
    var frame = 0, queue = [];

    for(var i=0;i<original.length;i++){
      queue.push({
        from: original[i],
        to: original[i],
        start: Math.floor(Math.random()*12),
        end: Math.floor(Math.random()*12) + 12
      });
    }

    function update(){
      var output = '', done = 0;
      for(var i=0;i<queue.length;i++){
        var q = queue[i];
        if(frame >= q.end){ done++; output += q.to; }
        else if(frame >= q.start){
          if(!q.ch || Math.random() < 0.28){
            q.ch = GLYPHS[Math.floor(Math.random()*GLYPHS.length)];
          }
          output += '<span style="opacity:.55">'+q.ch+'</span>';
        } else { output += q.from; }
      }
      el.innerHTML = output;
      if(done < queue.length){ frame++; requestAnimationFrame(update); }
      else el.textContent = original;
    }
    update();
  }

  document.querySelectorAll('.nav-links a').forEach(function(a){
    a.addEventListener('mouseenter', function(){ scramble(a); });
  });
})();*/


/* ── 11. SEAMLESS MARQUEE (duplicate track) ─────────────────*/
(function(){
  var inner = document.querySelector('.hero-marquee-inner');
  if(!inner || REDUCED) return;
  inner.innerHTML = inner.innerHTML + inner.innerHTML; // 2 tracks → loop is seamless
})();


/* ── 12. HEADER HIDE-ON-SCROLL-DOWN ─────────────────────────*/
(function(){
  var nav = document.getElementById('nav');
  var last = 0;
  window.addEventListener('scroll', function(){
    var y = window.scrollY;
    if(y > 400 && y > last){ nav.style.transform = 'translateY(-110%)'; }
    else { nav.style.transform = 'translateY(0)'; }
    last = y;
  }, {passive:true});
  nav.style.transition = nav.style.transition + ', transform .45s cubic-bezier(.22,1,.36,1)';
})();

 (function(){
  const slides=document.querySelectorAll(".hero-slide");

let current=0;

setInterval(()=>{

slides[current].classList.remove("active");

current=(current+1)%slides.length;

slides[current].classList.add("active");

},5000);
 })();