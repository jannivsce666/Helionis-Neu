(function(){
  const track = document.getElementById('slides');
  if(!track) return;
  const slides = Array.from(track.children);
  const prev = document.querySelector('.nav-btn.left');
  const next = document.querySelector('.nav-btn.right');
  const dotsWrap = document.getElementById('dots');

  let index = 0;
  let lock = false;

  function updateDots(){
    dotsWrap.innerHTML = '';
    slides.forEach((_, i)=>{
      const b = document.createElement('button');
      if(i === index) b.classList.add('active');
      b.addEventListener('click', ()=>go(i));
      dotsWrap.appendChild(b);
    });
  }

  function go(i){
    if(lock) return;
    lock = true;
    index = (i + slides.length) % slides.length;
    const offset = -index * 100;
    track.style.transform = `translateX(${offset}%)`;
    track.style.transition = 'transform 380ms ease-in-out';
    setTimeout(()=>{ track.style.transition = ''; lock = false; updateDots(); }, 420);
  }

  function nudge(dir){ go(index + dir); }

  // Layout: make track a row of 100%-width slides
  function layout(){
    track.style.display = 'flex';
    track.style.willChange = 'transform';
    slides.forEach(s => s.style.minWidth = '100%');
  }

  layout();
  updateDots();
  prev.addEventListener('click', ()=>nudge(-1));
  next.addEventListener('click', ()=>nudge(1));

  // Keyboard support
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowLeft') nudge(-1);
    if(e.key === 'ArrowRight') nudge(1);
  });

  // Optional autoplay
  let t = setInterval(()=>nudge(1), 6000);
  ['visibilitychange','pointerdown','keydown'].forEach(evt=>{
    document.addEventListener(evt, ()=>{ clearInterval(t); }, { once:true });
  });
})();
