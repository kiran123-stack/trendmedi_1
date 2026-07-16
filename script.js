// ============================================================
// TRENDMEDI — PREMIUM B2B MEDICAL PLATFORM
// Complete JavaScript — Search, Modal, Animations
// ============================================================

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
  if(!cursor || !ring) return;
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

// ---------- Reduced Motion Detection ----------
var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


// ══════════════════════════════════════════════════════════════
// SPLIT-TEXT CHAR REVEAL (Cuberto-style stagger)
// ══════════════════════════════════════════════════════════════
(function(){
  document.querySelectorAll('[data-split]').forEach(function(el){
    var html = el.innerHTML;
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

    var chars = el.querySelectorAll('.char');
    chars.forEach(function(c,i){
      c.style.transitionDelay = (i * 0.018 + 0.25) + 's';
    });

    setTimeout(function(){ el.classList.add('in'); }, 300);
  });
})();


// ══════════════════════════════════════════════════════════════
// SCROLL PROGRESS BAR
// ══════════════════════════════════════════════════════════════
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


// ══════════════════════════════════════════════════════════════
// PARALLAX (scroll-scrubbed depth)
// ══════════════════════════════════════════════════════════════
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
      if(img) img.style.transform = 'translate3d(0,'+offset.toFixed(2)+'px,0) scale(1.08)';
    });
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if(!ticking){ requestAnimationFrame(update); ticking = true; }
  },{passive:true});
  update();
})();


// ══════════════════════════════════════════════════════════════
// ANIMATED COUNT-UP (fires once when scrolled into view)
// ══════════════════════════════════════════════════════════════
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


// ══════════════════════════════════════════════════════════════
// SUBTLE 3D TILT ON CARDS (hover interaction)
// ══════════════════════════════════════════════════════════════
(function(){
  if(matchMedia('(hover:none)').matches || REDUCED) return;
  document.querySelectorAll('.product-card, .quality-card, .test-card').forEach(function(card){
    var MAX = 4; // degrees (subtle)
    card.addEventListener('mousemove', function(e){
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width  - 0.5;
      var py = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform =
        'perspective(1200px) rotateY('+(px*MAX)+'deg) rotateX('+(-py*MAX)+'deg) translateY(-4px) scale(1.008)';
    });
    card.addEventListener('mouseleave', function(){
      card.style.transform = '';
    });
  });
})();


// ══════════════════════════════════════════════════════════════
// CLICK RIPPLE BURST
// ══════════════════════════════════════════════════════════════
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


// ══════════════════════════════════════════════════════════════
// HEADER HIDE-ON-SCROLL-DOWN
// ══════════════════════════════════════════════════════════════
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


// ══════════════════════════════════════════════════════════════
// HERO SLIDE ROTATOR
// ══════════════════════════════════════════════════════════════
(function(){
  const slides = document.querySelectorAll(".hero-slide");
  if(!slides.length) return;
  let current = 0;
  setInterval(()=>{
    slides[current].classList.remove("active");
    current = (current + 1) % slides.length;
    slides[current].classList.add("active");
  }, 5000);
})();


// ══════════════════════════════════════════════════════════════
// SEARCH FUNCTIONALITY
// ══════════════════════════════════════════════════════════════
(function(){
  var searchInput = document.getElementById('searchInput');
  var searchResults = document.getElementById('searchResults');
  if(!searchInput || !searchResults) return;

  // Searchable product/category data
  var catalog = [
    {
      category: 'Medical Apparel',
      items: [
        { name: 'Surgical Scrub Suits', desc: 'Cotton blend, V-neck, unisex', section: '#products' },
        { name: 'Doctor Lab Coats', desc: 'Full-sleeve, fluid-resistant', section: '#products' },
        { name: 'Patient Gowns', desc: 'Tie-back, soft cotton, washable', section: '#products' },
        { name: 'Nursing Uniforms', desc: 'Color-coded, comfortable fit', section: '#products' },
        { name: 'Surgical Caps & Masks', desc: 'Disposable & reusable options', section: '#products' }
      ]
    },
    {
      category: 'Hospital Furniture',
      items: [
        { name: 'Motorized Hospital Beds', desc: 'ICU and general ward', section: '#products' },
        { name: 'Examination Couches', desc: 'Adjustable backrest, powder-coated', section: '#products' },
        { name: 'Bedside Lockers', desc: 'SS top, powder-coated body', section: '#products' },
        { name: 'Overbed Tables', desc: 'Height adjustable, tilting top', section: '#products' },
        { name: 'Crash Carts', desc: 'Emergency trolley, multi-drawer', section: '#products' },
        { name: 'IV Stands', desc: 'Stainless steel, 4-hook', section: '#products' }
      ]
    },
    {
      category: 'Hospital Linen',
      items: [
        { name: 'Ward Bedsheets', desc: 'Cotton, industrial-wash grade', section: '#products' },
        { name: 'OT Drapes', desc: 'Sterile, disposable & reusable', section: '#products' },
        { name: 'Blankets', desc: 'Hypoallergenic, warm weave', section: '#products' },
        { name: 'Pillow Slips', desc: 'Soft cotton, standard sizing', section: '#products' }
      ]
    },
    {
      category: 'Surgical Dressings',
      items: [
        { name: 'Cotton Crepe Bandages', desc: 'Various widths, high elasticity', section: '#products' },
        { name: 'Absorbent Gauze Swabs', desc: 'Sterile, multi-pack', section: '#products' },
        { name: 'Orthopedic Cast Padding', desc: 'Soft, cushioning layer', section: '#products' },
        { name: 'Zig-Zag Cotton', desc: 'Medical-grade absorbent cotton', section: '#products' },
        { name: 'Surgical Cotton Rolls', desc: 'Bleached, high absorbency', section: '#products' }
      ]
    },
    {
      category: 'Healthcare Consumables',
      items: [
        { name: 'Disposable Gloves', desc: 'Nitrile & latex, powdered/unpowdered', section: '#products' },
        { name: 'Face Masks', desc: '3-ply surgical, N95 available', section: '#products' },
        { name: 'Syringes & Needles', desc: 'Single-use, sterile packed', section: '#products' },
        { name: 'Examination Paper Rolls', desc: 'Couch cover rolls', section: '#products' }
      ]
    }
  ];

  // Flatten for easy searching
  var allItems = [];
  catalog.forEach(function(cat){
    cat.items.forEach(function(item){
      allItems.push({
        name: item.name,
        desc: item.desc,
        category: cat.category,
        section: item.section
      });
    });
  });

  function renderResults(query){
    if(!query || query.length < 2){
      searchResults.classList.remove('active');
      return;
    }

    var q = query.toLowerCase();
    var matches = allItems.filter(function(item){
      return item.name.toLowerCase().includes(q) ||
             item.desc.toLowerCase().includes(q) ||
             item.category.toLowerCase().includes(q);
    });

    if(matches.length === 0){
      searchResults.innerHTML = '<div class="search-no-results">No products found for "' + query + '"</div>';
      searchResults.classList.add('active');
      return;
    }

    var html = matches.slice(0, 8).map(function(item){
      return '<div class="search-result-item" data-section="' + item.section + '">' +
        '<div class="result-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 12H4M12 4l8 8-8 8"/></svg></div>' +
        '<div class="result-text"><h4>' + item.name + '</h4><p>' + item.category + ' · ' + item.desc + '</p></div>' +
      '</div>';
    }).join('');

    searchResults.innerHTML = html;
    searchResults.classList.add('active');

    // Click to navigate
    searchResults.querySelectorAll('.search-result-item').forEach(function(el){
      el.addEventListener('click', function(){
        var section = el.dataset.section;
        if(section){
          document.querySelector(section).scrollIntoView({ behavior: 'smooth' });
        }
        searchResults.classList.remove('active');
        searchInput.value = '';
      });
    });
  }

  searchInput.addEventListener('input', function(){
    renderResults(this.value.trim());
  });

  // Close on outside click
  document.addEventListener('click', function(e){
    if(!searchResults.contains(e.target) && e.target !== searchInput){
      searchResults.classList.remove('active');
    }
  });

  // Close on Escape
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') searchResults.classList.remove('active');
  });
})();


// ══════════════════════════════════════════════════════════════
// PRODUCT CATEGORY MODAL (SKU Viewer)
// ══════════════════════════════════════════════════════════════
(function(){
  var modal = document.getElementById('productModal');
  var modalTitle = document.getElementById('modalTitle');
  var skuGrid = document.getElementById('skuGrid');
  var closeBtn = document.getElementById('modalClose');
  if(!modal || !modalTitle || !skuGrid || !closeBtn) return;

  // SKU Data per category
  var skuData = {
    'medical-apparel': {
      title: 'Medical Apparel — Product Range',
      items: [
        { name: 'V-Neck Scrub Suit', material: 'Cotton-polyester blend', sizes: 'XS – 3XL', badge: 'Best Seller' },
        { name: 'Full-Sleeve Lab Coat', material: '100% Cotton, fluid-resistant', sizes: 'S – 2XL', badge: 'Premium' },
        { name: 'Patient Gown (Tie-Back)', material: 'Soft cotton, reusable', sizes: 'Standard / XL', badge: '' },
        { name: 'Nursing Uniform Set', material: 'Cotton blend, color-coded', sizes: 'S – 2XL', badge: '' },
        { name: 'Surgical Cap', material: 'Disposable & reusable', sizes: 'Universal', badge: '' },
        { name: 'Shoe Covers', material: 'Non-woven fabric', sizes: 'Universal', badge: '' }
      ]
    },
    'hospital-furniture': {
      title: 'Hospital Furniture — Product Range',
      items: [
        { name: 'ICU Motorized Bed (5-Function)', material: 'CRCA steel, ABS panels', sizes: '2100×900mm', badge: 'Best Seller' },
        { name: 'Semi-Fowler Bed', material: 'Mild steel, powder-coated', sizes: '1980×900mm', badge: '' },
        { name: 'Examination Couch', material: 'SS top, adjustable backrest', sizes: '1830×600mm', badge: '' },
        { name: 'Bedside Locker', material: 'SS top, powder-coated body', sizes: '400×400×800mm', badge: '' },
        { name: 'Overbed Table', material: 'Laminated top, height-adjustable', sizes: '900×400mm', badge: '' },
        { name: 'Emergency Crash Cart', material: 'ABS drawers, SS frame', sizes: 'Standard', badge: 'Premium' }
      ]
    },
    'hospital-linen': {
      title: 'Hospital Linen — Product Range',
      items: [
        { name: 'Ward Bedsheet (White)', material: '100% Cotton, 300 TC', sizes: '150×225 cm', badge: 'Best Seller' },
        { name: 'OT Drape (Reusable)', material: 'Cotton, autoclavable', sizes: '150×200 cm', badge: '' },
        { name: 'OT Drape (Disposable)', material: 'Non-woven SMS', sizes: '150×200 cm', badge: '' },
        { name: 'Hospital Blanket', material: 'Polyester fleece', sizes: '150×225 cm', badge: '' },
        { name: 'Pillow Slip (Pair)', material: 'Cotton, 250 TC', sizes: 'Standard', badge: '' }
      ]
    },
    'surgical-dressings': {
      title: 'Surgical Dressings — Product Range',
      items: [
        { name: 'Cotton Crepe Bandage', material: 'High-elasticity cotton', sizes: '5cm / 10cm / 15cm × 4m', badge: '' },
        { name: 'Absorbent Gauze Swabs', material: 'Sterile, 8-ply', sizes: '7.5×7.5 cm', badge: 'Best Seller' },
        { name: 'Orthopedic Cast Padding', material: 'Soft polyester', sizes: '7.5cm / 10cm × 2.7m', badge: '' },
        { name: 'Zig-Zag Cotton', material: 'Medical-grade absorbent', sizes: '100g / 250g / 500g', badge: '' },
        { name: 'Surgical Cotton Roll', material: 'Bleached BP quality', sizes: '500g / 1kg', badge: '' }
      ]
    },
    'healthcare-consumables': {
      title: 'Healthcare Consumables — Product Range',
      items: [
        { name: 'Nitrile Examination Gloves', material: 'Powder-free nitrile', sizes: 'S / M / L / XL', badge: 'Best Seller' },
        { name: '3-Ply Surgical Mask', material: 'Non-woven, BFE ≥95%', sizes: 'Universal', badge: '' },
        { name: 'N95 Respirator Mask', material: 'Multi-layer filtration', sizes: 'Standard', badge: 'Premium' },
        { name: 'Disposable Syringe (Luer Lock)', material: 'Medical-grade PP', sizes: '2ml / 5ml / 10ml', badge: '' },
        { name: 'Examination Paper Roll', material: 'Perforated tissue', sizes: '50cm × 50m', badge: '' }
      ]
    }
  };

  // Open modal when clicking product cards
  document.querySelectorAll('.product-card[data-category]').forEach(function(card){
    card.addEventListener('click', function(e){
      e.preventDefault();
      var category = card.dataset.category;
      var data = skuData[category];
      if(!data) return;

      modalTitle.textContent = data.title;

      var html = data.items.map(function(sku){
        return '<div class="sku-card">' +
          '<h4>' + sku.name + '</h4>' +
          '<div class="sku-meta">' +
            '<span><b>Material:</b> ' + sku.material + '</span>' +
            '<span><b>Sizes:</b> ' + sku.sizes + '</span>' +
          '</div>' +
          (sku.badge ? '<span class="sku-badge">' + sku.badge + '</span>' : '') +
        '</div>';
      }).join('');

      skuGrid.innerHTML = html;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modal
  function closeModal(){
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function(e){
    if(e.target === modal) closeModal();
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeModal();
  });
})();