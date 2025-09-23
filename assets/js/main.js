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
  // Deaktiviert – Partikel entfernt laut Benutzerwunsch
  return;
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

/* CART/WISHLIST */
// Lokale addToCart-Hülle entfernt – zentrale Implementierung in cart.js verwenden.
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
  // Smoke wurde global deaktiviert
  return;
  const canvas = document.getElementById('smoke-canvas');
  if(!canvas) return; // Seite ohne Canvas
  if(canvas.getAttribute('data-disable-smoke') === 'true') { console.warn('[Smoke] Disabled via attribute'); return; }
  let gl = canvas.getContext('webgl',{premultipliedAlpha:false, alpha:true});
  if(!gl){ console.warn('WebGL nicht verfügbar – nur Fallback aktiv.'); return; }

  const vertSrc = `attribute vec2 aPos;void main(){gl_Position=vec4(aPos,0.0,1.0);}`;
  // Neuer Fragment-Shader: Aufsteigender blauer Rauch / Nebel
  // Features:
  //  * Vertikaler Drift (Rauch steigt langsam nach oben)
  //  * Mehrschichtige Fractal Noise (fBM)
  //  * Sanfte Wirbel durch rotierende Offsets
  //  * Leichte Körnung + weiche Alpha-Ausblendung oben/unten
  //  * Halbtransparenz + Blending (unten im JS aktiviert)
  const fragSrc = `precision highp float;uniform vec2 uRes;uniform float uTime;uniform float uIntensity;uniform vec3 uColA;uniform vec3 uColB;uniform float uQuality;
    // =============================================
    // VOL. SMOKE v2  (Option 1 + Option 2)
    //  * Sichtbarkeits-Boost (höhere Dichte & Alpha)
    //  * Dual-Layer (ferner & naher Rauch) für Tiefe
    //  * Leicht aufgehellte Palette für mehr Kontrast
    // =============================================
    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453123); }
    float noise(vec2 p){ vec2 i=floor(p); vec2 f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
    float fbm(vec2 p){ float a=.55; float r=0.; for(int i=0;i<5;i++){ r+=noise(p)*a; p*=2.07; a*=0.53;} return r; }
    vec2 curl(vec2 p){ const float e=.01; float n1=fbm(p+vec2(0,e)); float n2=fbm(p-vec2(0,e)); float n3=fbm(p+vec2(e,0)); float n4=fbm(p-vec2(e,0)); return vec2(n1-n2, n4-n3); }
    vec3 palette(float x){
      x = clamp(x,0.0,1.0);
      vec3 base=vec3(0.020,0.028,0.050);
      vec3 mid=mix(uColA,uColB, smoothstep(0.05,0.95,x));
      vec3 hi=vec3(0.90,0.92,1.0);
      vec3 c=mix(base, mid, smoothstep(0.04,0.85,x));
      c=mix(c, hi, smoothstep(0.75,1.0,x)*0.18);
      // leichte Entsättigung bei sehr hoher Dichte für Nebel-Look
      float desat = smoothstep(0.6,1.0,x)*0.25;
      float g = dot(c, vec3(0.299,0.587,0.114));
      c = mix(c, vec3(g), desat);
      return c;
    }
    float densitySample(vec2 basePos, float height, float t, float layerScale, float rise, float swirl, float warp){
      vec2 p = basePos * layerScale + vec2(0.0, t*rise) + vec2(0.0, height*0.40*layerScale);
      vec2 w = p + curl(p*warp + t*swirl)*0.65;
      float d = fbm(w*1.15) * 0.7 + fbm(w*2.8)*0.35;
      d = smoothstep(0.22,0.93,d);
      return d;
    }
    void main(){
      vec2 uv = gl_FragCoord.xy / uRes.xy;
      vec2 p = (uv - 0.5); p.x *= uRes.x/uRes.y; float t=uTime;
      // sanfter globaler Drift nach oben (etwas schneller für bessere Wahrnehmung)
      p.y += t*0.028;
      // adaptive Schrittanzahl – leicht reduziert wegen zweiter Ebene
      int STEPS = int( mix(14.0, 30.0, clamp(uQuality,0.0,1.0)) );
      float stepH = 1.0/float(STEPS);
      float h = 0.0;
      // Akkumulatoren: fern & nah
      float accumF=0.0; float alphaF=0.0; // far layer (breiter, weicher)
      float accumN=0.0; float alphaN=0.0; // near layer (detailreicher)
      for(int i=0;i<40;i++){
        if(i>=STEPS) break;
        // Basis-Gewichtung (unten dichter)
        float depthWeight = mix(1.95, 0.45, h);
        // Ferne Ebene (ruhiger, größer skaliert)
        float dF = densitySample(p*0.85, h, t*0.85, 1.05, 0.045, 0.035, 0.75) * depthWeight;
        // Nahe Ebene (feinere Wirbel, etwas schnellerer Rise)
        float dN = densitySample(p*1.25 + vec2(0.07*sin(t*0.07),0.0), h, t*1.10, 1.35, 0.060, 0.055, 0.95) * depthWeight;
        // vertikaler Fade (oben fast aus)
        float topFade = smoothstep(1.08, 0.20, h + uv.y*0.42);
        dF *= topFade; dN *= topFade;
        // Intensitäts-Boost (Option 1) – erhöht Basis + reagiert stärker auf uIntensity
        float boost = (0.75 + uIntensity*0.55);
        dF *= boost * 0.72; // ferne Ebene etwas schwächer
        dN *= boost * 1.05;
        // Alpha / Beer-Lambert
        float aF = 1.0 - exp(-dF * 1.25 * stepH);
        float aN = 1.0 - exp(-dN * 1.35 * stepH);
        accumF += (1.0 - alphaF) * dF * stepH;
        accumN += (1.0 - alphaN) * dN * stepH;
        alphaF += (1.0 - alphaF) * aF;
        alphaN += (1.0 - alphaN) * aN;
        h += stepH;
        if(alphaN > 0.985 && alphaF > 0.985) break;
      }
      accumF = clamp(accumF,0.0,1.0); accumN = clamp(accumN,0.0,1.0);
      alphaF = clamp(alphaF,0.0,1.0); alphaN = clamp(alphaN,0.0,1.0);
      // Farben je Ebene
      vec3 colF = palette(accumF * 0.90);
      vec3 colN = palette(accumN * 1.10);
      // leichtes inneres Glühen in der Nah-Ebene
      colN += 0.14 * pow(accumN,2.0);
      // Noise Dithering (einmal berechnen)
      float grain = (hash(p*vec2(323.2,173.1)+t)-0.5);
      colF += grain*0.010; colN += grain*0.016;
      // Mischung der Ebenen (Near stärker, aber Far trägt Tiefe)
      float mixFac = 0.58; // Anteil der Nah-Ebene
      vec3 col = mix(colF, colN, mixFac);
      // Vignette / leichte Bündelung
      float vign = smoothstep(1.40,0.05,length(p));
      col *= mix(0.88,1.02,vign);
      // Kombiniertes Alpha (Option 1: etwas aggressiver & weniger Gamma)
  float alpha = 1.0 - (1.0 - alphaF)*(1.0 - alphaN);
  alpha = pow(alpha, 0.88) * 1.05; // stärker & weniger ausgewaschen
  alpha = clamp(alpha, 0.0, 0.92);
  // Mindest-Sichtbarkeit falls extrem niedrige Intensität
  alpha = max(alpha, 0.06);
      // Sehr leichte Aufhellung bei hoher alpha für milchigen Rauch
      col += 0.06 * smoothstep(0.25,0.95,alpha);
      gl_FragColor = vec4(col, alpha);
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
  // Blending für halbtransparenten Rauch aktivieren
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1, 1,-1,1,1,-1,1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog,'aPos'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  const uRes = gl.getUniformLocation(prog,'uRes');
  const uTime = gl.getUniformLocation(prog,'uTime');
  const uIntensity = gl.getUniformLocation(prog,'uIntensity');
  const uColA = gl.getUniformLocation(prog,'uColA');
  const uColB = gl.getUniformLocation(prog,'uColB');
  const uQuality = gl.getUniformLocation(prog,'uQuality');
  const intensity = parseFloat(canvas.getAttribute('data-intensity')||'1.3');
  const baseQuality = Math.min(1, Math.max(0, parseFloat(canvas.getAttribute('data-quality')||'0.55')));
  const minQualityAttr = Math.min(1, Math.max(0, parseFloat(canvas.getAttribute('data-min-quality')||'0.30')));
  let dynamicQuality = baseQuality; // wird adaptiv angepasst
  // Performance Skalierung (reduziert interne Auflösung)
  let perfScale = (()=>{
    const v = parseFloat(canvas.getAttribute('data-scale')||'1');
    return isNaN(v)?1:Math.min(1, Math.max(0.5, v));
  })();
  let needResize = true;
  const col1 = canvas.getAttribute('data-color1') || '#3a7bd5';
  const col2 = canvas.getAttribute('data-color2') || '#6a11cb';
  function hexToRgbNorm(h){ const m=h.replace('#',''); const v=parseInt(m.length===3?m.split('').map(c=>c+c).join(''):m,16); return [(v>>16 & 255)/255,(v>>8 & 255)/255,(v & 255)/255]; }
  const c1 = hexToRgbNorm(col1); const c2 = hexToRgbNorm(col2);
  function resize(){
    const dpr=Math.min(window.devicePixelRatio||1,2);
    const w = innerWidth, h = innerHeight;
    canvas.width = Math.floor(w * dpr * perfScale);
    canvas.height = Math.floor(h * dpr * perfScale);
    gl.viewport(0,0,canvas.width,canvas.height);
    needResize = false;
  }
  resize();
  window.addEventListener('resize', resize);
  let start=performance.now(); let last=0; const interval=1000/30; // Ziel: 30 FPS
  let lastDrawAt = start;
  let smoothCounter = 0;
  // Sichtbarer Debug-Wert optional
  let adaptTick = 0;
  // Performance Überwachung
  let slowFrames = 0; // akkumulierte "Problemframes" (wird jetzt konservativer gezählt)
  let hardDisabled = false;
  const hardDisableLimit = parseInt(canvas.getAttribute('data-disable-threshold')||'180'); // vorher 90, jetzt konfigurierbar
  const noHardDisable = canvas.hasAttribute('data-no-hard-disable'); // Wenn gesetzt: niemals komplett entfernen
  (function render(){
    const now=performance.now();
    if(hardDisabled){ return; }
    if(now-last>=interval){
      const t=(now-start)/1000;
      const frameGap = now - lastDrawAt; // Zeit seit letztem tatsächlichem Draw
      lastDrawAt = now;
      // Adaptives Downgrade wenn wir deutlich unter der Ziel-Frequenz liegen
  if(frameGap > interval * 1.75){
        // Sehr langsam -> aggressiv degradieren
  dynamicQuality = Math.max(minQualityAttr, dynamicQuality - 0.08);
        perfScale = Math.max(0.58, perfScale - 0.06);
        needResize = true;
        smoothCounter = 0;
        slowFrames += 3; // stark zählen
      } else if(frameGap > interval * 1.35){
        // Mäßig langsam -> leichte Degradation
  dynamicQuality = Math.max(minQualityAttr, dynamicQuality - 0.04);
        perfScale = Math.max(0.60, perfScale - 0.03);
        needResize = true;
        smoothCounter = 0;
        slowFrames += 2;
      } else if(frameGap < interval * 1.05){
        // Gut -> evtl. hochskalieren
        smoothCounter++;
        if(smoothCounter > 14){
          dynamicQuality = Math.min(baseQuality, dynamicQuality + 0.025);
          perfScale = Math.min(1.0, perfScale + 0.03);
          needResize = true;
          smoothCounter = 0;
        }
        slowFrames = Math.max(0, slowFrames - 2); // schneller abbauen
      } else {
        // Neutraler Bereich: nicht bestrafen, nicht belohnen
        smoothCounter = 0;
        slowFrames = Math.max(0, slowFrames - 1);
      }

      // Hard Disable (oder Soft Freeze) wenn Schwelle überschritten
      if(slowFrames >= hardDisableLimit){
        if(!hardDisabled){
          if(noHardDisable){
            console.warn('[Smoke] Performance sehr niedrig – Effekt wird eingefroren (no-hard-disable aktiv).');
            hardDisabled = true; // stoppt Loop, Canvas bleibt
            return;
          } else {
            console.warn('[Smoke] Performance sehr niedrig – Effekt wird weich ausgeblendet statt gelöscht.');
            hardDisabled = true;
            // Weiches Ausblenden: opacity animieren
            canvas.style.transition = 'opacity 1.2s ease';
            canvas.style.opacity = '0';
            setTimeout(()=>{
              if(canvas.parentNode){
                canvas.parentNode.removeChild(canvas);
              }
            },1300);
            // Optional Restart-Handle setzen
            window.__SmokeRestartReady = true;
            return;
          }
        }
      }
      if(needResize){ resize(); }
      gl.clearColor(0,0,0,0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime,t);
      gl.uniform1f(uIntensity, intensity);
  gl.uniform3f(uColA, c1[0], c1[1], c1[2]);
  gl.uniform3f(uColB, c2[0], c2[1], c2[2]);
  gl.uniform1f(uQuality, dynamicQuality);
      gl.drawArrays(gl.TRIANGLES,0,6);
      last = now;
    }
    requestAnimationFrame(render);
  })();

  // Exponiere einen Restart, falls entfernt oder eingefroren
  window.restartSmoke = function(force){
    if(!hardDisabled && !force){
      console.warn('[Smoke] Restart ignoriert – läuft noch. Nutze restartSmoke(true) für forcieren.');
      return;
    }
    if(!canvas.isConnected){
      document.body.appendChild(canvas);
    }
    // Reset State
    slowFrames = 0; hardDisabled = false; dynamicQuality = Math.max(minQualityAttr, baseQuality*0.85); perfScale = 0.85; needResize = true; canvas.style.opacity = '1';
    // Loop erneut starten
    (function rerender(){ if(hardDisabled) return; requestAnimationFrame(rerender); const evt=new Event('smokeRestart'); })();
    // (Vereinfachung: Kein erneutes Neuaufbauen von Program/Shadern – Canvas + GL Context bleibt erhalten)
    console.info('[Smoke] Restart ausgeführt.');
  };
}
