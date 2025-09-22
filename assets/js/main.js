// Main JavaScript for Helionis

document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add mystical particles effect
    createMysticalParticles();

  // Versuche den Rauch-Hintergrund zu initialisieren
  initSmokeBackground();
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                alert('Vielen Dank für Ihre Anmeldung! Sie erhalten bald mystische Einblicke.');
                this.reset();
            }
        });
    }
});

// Create mystical particles effect
function createMysticalParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 215, 0, 0.8);
            border-radius: 50%;
            pointer-events: none;
            animation: float ${Math.random() * 3 + 2}s infinite ease-in-out;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 2}s;
        `;
        particlesContainer.appendChild(particle);
    }
    
    // Add CSS animation for particles
    if (!document.getElementById('particle-styles')) {
        const style = document.createElement('style');
        style.id = 'particle-styles';
        style.textContent = `
            .mystical-particles {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
            }
            
            @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Utility functions
window.showNotification = function(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1001;
        animation: slideIn 0.3s ease;
        ${type === 'success' ? 'background: var(--primary); color: var(--dark);' : 'background: #ff6b6b;'}
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);

    // Add slide animations
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}
gl.shaderSource(sh, src); gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(sh));
      return null;
    }
    return sh;

  const vs = compile(gl.VERTEX_SHADER, vertSrc);
  const fs = compile(gl.FRAGMENT_SHADER, fragSrc);

  const prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(prog));
    return;
  }
  gl.useProgram(prog);

  // Fullscreen quad
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,  1, -1,  -1, 1,
     1, -1,  1,  1,  -1, 1
  ]), gl.STATIC_DRAW);

  const loc = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, 'uRes');
  const uTime = gl.getUniformLocation(prog, 'uTime');

  function onResize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Qualität vs. Performance
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  onResize();
  window.addEventListener('resize', onResize);

  let start = performance.now();
  function render() {
    const t = (performance.now() - start) / 1000;
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, t);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
  }
  render();

/* ============== NAVIGATION ============== */
function initializeNavigation() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navbar = document.getElementById('navbar');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
    navMenu.addEventListener('click', e => {
      if (e.target.classList.contains('nav-link')) {
        hamburger.classList.remove('active'); navMenu.classList.remove('active');
      }
    });
    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active'); navMenu.classList.remove('active');
      }
    });
  }
  if (navbar) {
    let last = 0, threshold = 100;
    window.addEventListener('scroll', () => {
      const y = window.pageYOffset || document.documentElement.scrollTop;
      if (y > threshold) {
        navbar.classList.add('scrolled');
        navbar.style.transform = y > last ? 'translateY(-100%)' : 'translateY(0)';
      } else {
        navbar.classList.remove('scrolled'); navbar.style.transform = 'translateY(0)';
      }
      last = y;
    });
  }
}

/* ============== SEARCH ============== */
function initializeSearch() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;

  const data = [
    { name: 'Schutz-Amulett Aegis', category: 'amulette', url: 'product-detail.html?id=1' },
    { name: 'Kristallpyramide Lumina', category: 'pyramiden', url: 'product-detail.html?id=2' },
    { name: 'Weisheitswürfel Sophia', category: 'wuerfel', url: 'product-detail.html?id=3' },
    { name: 'Liebes-Amulett Venus', category: 'amulette', url: 'product-detail.html?id=4' },
    { name: 'Jahreshoroskop', category: 'horoskope', url: 'horoskop.html' },
    { name: 'Tarot-Lesung', category: 'orakel', url: 'horoskop.html' }
  ];

  const sugId = 'search-suggestions';
  const containerCss = `
    position:absolute; top:100%; left:0; right:0; background:var(--glass-bg);
    backdrop-filter: blur(10px); border:1px solid var(--glass-border); border-radius:12px;
    padding:.5rem; z-index:1000; max-height:300px; overflow-y:auto;
  `;

  function show(matches){
    let box = document.getElementById(sugId);
    if(!box){
      box = document.createElement('div');
      box.id = sugId;
      searchInput.parentNode.style.position = 'relative';
      searchInput.parentNode.appendChild(box);
    }
    box.style.cssText = containerCss;
    box.innerHTML = matches.length ? matches.map(i => `
      <a href="${i.url}" class="search-suggestion-item" style="
        display:block;padding:.75rem;color:var(--silver-light);text-decoration:none;border-radius:8px;transition:.3s;border-bottom:1px solid var(--glass-border);
      ">
        <div style="font-weight:500;">${i.name}</div>
        <div style="font-size:.8rem;color:var(--silver);text-transform:capitalize;">${i.category}</div>
      </a>
    `).join('') : `<div style="padding:1rem;color:var(--silver);text-align:center;">Keine Ergebnisse gefunden</div>`;

    box.querySelectorAll('.search-suggestion-item').forEach(el=>{
      el.addEventListener('mouseenter',()=>{ el.style.background='var(--smoke-1)'; el.style.color='#fff'; });
      el.addEventListener('mouseleave',()=>{ el.style.background='transparent'; el.style.color='var(--silver-light)'; });
    });
    box.style.display='block';
  }
  function hide(){ const box = document.getElementById(sugId); if(box) box.style.display='none'; }

  searchInput.addEventListener('input', function(){
    const q = this.value.toLowerCase().trim();
    if(q.length<2) return hide();
    const m = data.filter(x => x.name.toLowerCase().includes(q) || x.category.toLowerCase().includes(q));
    show(m);
  });
  searchInput.addEventListener('keydown', e => {
    if(e.key === 'Enter'){
      const q = searchInput.value.trim();
      if(q) window.location.href = `shop.html?search=${encodeURIComponent(q)}`;
    }
  });
  document.addEventListener('click', e => { if(!searchInput.contains(e.target)) hide(); });
}

/* ============== ANIMATIONS / TOOLTIP / AUTH / CART ============== */
function initializeAnimations(){
  const opts = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  const io = new IntersectionObserver(entries=>{
    entries.forEach(en => { if(en.isIntersecting) en.target.classList.add('animated'); });
  }, opts);
  document.querySelectorAll('.card, .product-card, .hero-content, .section-title').forEach(el=>{
    el.classList.add('animate-on-scroll'); io.observe(el);
  });

  // dezenter Parallax (Content; nicht den Canvas verschieben)
  const heroes = document.querySelectorAll('.hero');
  if(heroes.length){
    window.addEventListener('scroll', ()=>{
      const s = window.pageYOffset, rate = s * -0.25;
      heroes.forEach(h => h.style.transform = `translateY(${rate}px)`);
    });
  }
}

function initializeTooltips(){
  const els = document.querySelectorAll('[data-tooltip]');
  els.forEach(el=>{
    el.addEventListener('mouseenter', showTooltip);
    el.addEventListener('mouseleave', hideTooltip);
  });
}
function showTooltip(e){
  const text = e.target.getAttribute('data-tooltip'); if(!text) return;
  const tip = document.createElement('div');
  tip.className = 'tooltip'; tip.textContent = text;
  tip.style.cssText = `
    position:absolute;background:var(--glass-bg);backdrop-filter:blur(10px);color:var(--silver-light);
    padding:.5rem 1rem;border-radius:8px;border:1px solid var(--glass-border);font-size:.9rem;z-index:1000;pointer-events:none;opacity:0;transition:.2s;
  `;
  document.body.appendChild(tip);
  const r = e.target.getBoundingClientRect();
  tip.style.left = (r.left + r.width/2 - tip.offsetWidth/2) + 'px';
  tip.style.top  = (r.top - tip.offsetHeight - 10) + 'px';
  requestAnimationFrame(()=> tip.style.opacity = '1');
  e.target._tooltip = tip;
}
function hideTooltip(e){ if(e.target._tooltip){ e.target._tooltip.remove(); delete e.target._tooltip; } }

function checkUserAuth(){
  if (typeof isUserLoggedIn === 'function' && isUserLoggedIn()) updateUIForLoggedInUser();
  else updateUIForGuestUser();
}
function updateUIForLoggedInUser(){
  const el = document.getElementById('nav-username');
  if(el && typeof getCurrentUser === 'function'){ const u = getCurrentUser(); el.textContent = u?.firstName || 'Profil'; }
}
function updateUIForGuestUser(){
  const el = document.getElementById('nav-username');
  if(el){ el.textContent = 'Anmelden'; const a = el.closest('a'); if(a) a.href = 'login.html'; }
}

/* CART/WISHLIST (wie gehabt) */
function addToCart(id, qty=1){
  if (typeof window.addToCart === 'function') window.addToCart(id, qty);
  else { showNotification('Produkt wurde zum Warenkorb hinzugefügt!', 'success'); updateCartCount(); }
}
function addToWishlist(id){
  let w = JSON.parse(localStorage.getItem('helionis_wishlist')||'[]');
  if(!w.includes(id)){ w.push(id); localStorage.setItem('helionis_wishlist', JSON.stringify(w));
    showNotification('Produkt zur Wunschliste hinzugefügt!', 'success'); updateWishlistButton(id, true);
  } else showNotification('Produkt ist bereits in Ihrer Wunschliste!', 'info');
}
function removeFromWishlist(id){
  let w = JSON.parse(localStorage.getItem('helionis_wishlist')||'[]').filter(x=>x!==id);
  localStorage.setItem('helionis_wishlist', JSON.stringify(w));
  showNotification('Produkt aus Wunschliste entfernt!', 'info'); updateWishlistButton(id, false);
}
function updateWishlistButton(id, on){
  document.querySelectorAll(`[onclick*="addToWishlist(${id})"]`).forEach(btn=>{
    if(on){ 
      btn.innerHTML = '<svg class="mystical-sprite heart-wishlist"><use href="#heart-filled"></use></svg> In Wunschliste'; 
      btn.style.background='var(--smoke-1)'; 
      btn.onclick=()=>removeFromWishlist(id); 
    } else { 
      btn.innerHTML = '<svg class="mystical-sprite heart-wishlist"><use href="#heart-outline"></use></svg> Zur Wunschliste'; 
      btn.style.background='var(--glass-bg)'; 
      btn.onclick=()=>addToWishlist(id); 
    }
  });
}
function updateCartCount(){
  const el = document.getElementById('cart-count'); if(!el) return;
  let items = JSON.parse(localStorage.getItem('helionis_cart')||'[]');
  const total = items.reduce((s,i)=> s + (i.quantity||1), 0);
  el.textContent = total; el.style.display = total>0 ? 'inline' : 'none';
}

/* NOTIFICATIONS / NEWSLETTER / UTILS (wie gehabt) */
function showNotification(msg, type='info'){
  const n = document.createElement('div');
  const colors = { success:'var(--smoke-1)', error:'#e74c3c', warning:'#f39c12', info:'var(--silver)' };
  n.textContent = msg;
  n.style.cssText = `
    position:fixed; top:20px; right:20px; background:var(--glass-bg); backdrop-filter: blur(10px);
    color:var(--silver-light); padding:1rem 1.5rem; border-radius:12px; border:1px solid var(--glass-border);
    border-left:4px solid ${colors[type]}; z-index:10000; opacity:0; transform:translateX(100%); transition:.3s; max-width:300px;
    box-shadow:0 8px 32px rgba(0,0,0,.3);
  `;
  document.body.appendChild(n);
  requestAnimationFrame(()=>{ n.style.opacity='1'; n.style.transform='translateX(0)'; });
  setTimeout(()=>{ n.style.opacity='0'; n.style.transform='translateX(100%)'; setTimeout(()=>n.remove(), 300); }, 4000);
}
function subscribeNewsletter(){
  const input = document.getElementById('newsletter-email'); if(!input) return;
  const email = input.value.trim();
  if(!email) return showNotification('Bitte geben Sie Ihre E-Mail-Adresse ein.', 'warning');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showNotification('Bitte geben Sie eine gültige E-Mail-Adresse ein.', 'error');
  showNotification('Erfolgreich für den Newsletter angemeldet! <svg class="mystical-sprite sparkle-accent small"><use href="#starburst"></use></svg>', 'success'); input.value = '';
}
function formatPrice(p){ return new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'}).format(p); }
function debounce(fn, wait){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), wait); }; }

/* Smooth scrolling */
document.addEventListener('click', e=>{
  if (e.target.matches('a[href^="#"]')) {
    e.preventDefault();
    const id = e.target.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior:'smooth', block:'start' });
  }
});

/* Global error log */
window.addEventListener('error', e => console.error('Global error:', e.error));

/* Export */
window.HelionisMain = {
  addToCart, addToWishlist, removeFromWishlist, updateCartCount,
  showNotification, subscribeNewsletter, formatPrice
};

/* =============================================
   Rauch / WebGL Hintergrund Re-Initialisierung
   ============================================= */
function initSmokeBackground(){
  const canvas = document.getElementById('smoke-canvas');
  if(!canvas) return; // Seite ohne Canvas
  let gl = canvas.getContext('webgl',{premultipliedAlpha:false, alpha:true});
  if(!gl){ console.warn('WebGL nicht verfügbar – nur Fallback aktiv.'); return; }

  const vertSrc = `attribute vec2 aPos;void main(){gl_Position=vec4(aPos,0.0,1.0);}`;
  // Fragment-Shader: restaurierter grün/türkiser Nebel
  // Hinweis: Wenn du wieder Blau testen willst, unten einfach "#define PALETTE_GREEN" auskommentieren
  const fragSrc = `precision mediump float;uniform vec2 uRes;uniform float uTime; 
    // ======= Noise Basis =======
    float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3,289.1)))*43758.5453); }
    float noise(vec2 p){ vec2 i=floor(p); vec2 f=fract(p); f=f*f*(3.0-2.0*f); 
      return mix(mix(hash(i+vec2(0.,0.)),hash(i+vec2(1.,0.)),f.x), mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x), f.y); }
    
    // ======= Palette Switch =======
    #define PALETTE_GREEN 1
    
    vec3 palette(float n){
      #ifdef PALETTE_GREEN
        // Dunkelgrün -> Türkis -> sanftes Glühen
        vec3 a = vec3(0.007, 0.055, 0.050);   // sehr dunkel (nahe Schwarz mit Grün)
        vec3 b = vec3(0.050, 0.320, 0.250);   // sattes Grün/Türkis
        vec3 c = vec3(0.180, 0.820, 0.650);   // leuchtender Akzent
      #else
        // Alternative Blaupalette (falls später benötigt)
        vec3 a = vec3(0.010, 0.020, 0.070);
        vec3 b = vec3(0.050, 0.200, 0.550);
        vec3 c = vec3(0.150, 0.650, 0.950);
      #endif
      vec3 col = mix(a, b, n);
      // Sichtbarkeit verstärken: Übergang zum Akzent früher einsetzen
      col = mix(col, c, smoothstep(0.55, 0.95, n));
      return col;
    }
    
    void main(){ 
      vec2 uv = gl_FragCoord.xy / uRes.xy; 
      vec2 p = (uv - 0.5); p.x *= uRes.x / uRes.y; 
      float t = uTime * 0.035; 
      float n = 0.0; float amp=0.65; vec2 pp=p*1.35; 
      for(int i=0;i<5;i++){ n += noise(pp + t)*amp; pp*=1.85; amp*=0.55; }
      n /= 1.0; // Normierung (locker)
      // Leichter Zentrumsglow reduziert, damit Ränder nicht zu dunkel werden
      float vign = smoothstep(0.8, 0.05, length(p));
      vec3 col = palette(n);
      // Feinhelligkeit – macht Nebel sichtbarer ohne alles auszuwaschen
      col += (1.0 - vign) * 0.08;
      // Leichte Nebelschleier-Körnung
      col += (hash(p + t) - 0.5) * 0.015;
      gl_FragColor = vec4(col, 1.0); 
    }`;

  function compile(type, src){
    const sh = gl.createShader(type); gl.shaderSource(sh, src); gl.compileShader(sh);
    if(!gl.getShaderParameter(sh, gl.COMPILE_STATUS)){ console.error(gl.getShaderInfoLog(sh)); return null; }
    return sh;
  }
  const vs = compile(gl.VERTEX_SHADER, vertSrc); const fs = compile(gl.FRAGMENT_SHADER, fragSrc);
  if(!vs || !fs) return;
  const prog = gl.createProgram(); gl.attachShader(prog,vs); gl.attachShader(prog,fs); gl.linkProgram(prog);
  if(!gl.getProgramParameter(prog, gl.LINK_STATUS)){ console.error(gl.getProgramInfoLog(prog)); return; }
  gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1, 1,-1,1,1,-1,1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog,'aPos'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  const uRes = gl.getUniformLocation(prog,'uRes'); const uTime = gl.getUniformLocation(prog,'uTime');
  function resize(){ const dpr=Math.min(window.devicePixelRatio||1,2); canvas.width=innerWidth*dpr; canvas.height=innerHeight*dpr; gl.viewport(0,0,canvas.width,canvas.height);} resize();
  window.addEventListener('resize', resize);
  let start=performance.now();
  (function render(){ const t=(performance.now()-start)/1000; gl.uniform2f(uRes, canvas.width, canvas.height); gl.uniform1f(uTime,t); gl.drawArrays(gl.TRIANGLES,0,6); requestAnimationFrame(render); })();
}
