// Utility: clamp and map
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const map = (num, in_min, in_max, out_min, out_max) => (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;

// Custom cursor
(function cursorSetup(){
  const cursor = document.getElementById('cursor');
  if(!cursor) return;
  window.addEventListener('mousemove', (e) => {
    cursor.style.top = e.clientY + 'px';
    cursor.style.left = e.clientX + 'px';
  });
  document.addEventListener('mousedown', ()=> cursor.classList.add('active'));
  document.addEventListener('mouseup', ()=> cursor.classList.remove('active'));
  document.querySelectorAll('a, button, .card, .btn').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });
})();

// Particles background
(function particles(){
  const canvas = document.getElementById('particles');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles;
  const count = 60;
  function resize(){ w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
  function init(){
    particles = Array.from({length: count}).map(()=>({
      x: Math.random()*w,
      y: Math.random()*h,
      r: Math.random()*2+0.5,
      a: Math.random()*Math.PI*2,
      s: Math.random()*0.5+0.2
    }));
  }
  function tick(){
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    particles.forEach(p=>{
      p.a += 0.01 * p.s;
      p.x += Math.cos(p.a) * p.s;
      p.y += Math.sin(p.a) * p.s;
      if(p.x < 0) p.x = w; if(p.x > w) p.x = 0; if(p.y < 0) p.y = h; if(p.y > h) p.y = 0;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
    });
    requestAnimationFrame(tick);
  }
  resize(); init(); tick();
  window.addEventListener('resize', ()=>{ resize(); init(); });
})();

// Smooth Scroll with Locomotive + GSAP ScrollTrigger proxy
window.addEventListener('load', () => {
  if(window.LocomotiveScroll && window.gsap && window.ScrollTrigger){
    const loco = new LocomotiveScroll({
      el: document.querySelector('#smooth-container'),
      smooth: true,
      lerp: 0.08,
      multiplier: 1
    });
    // expose for other scripts
    window.__loco = loco;
    const sc = document.querySelector('#smooth-container');
    if(sc) sc.locoscroll = loco;

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.scrollerProxy('#smooth-container', {
      scrollTop(value){ return arguments.length ? loco.scrollTo(value, {duration:0, disableLerp:true}) : loco.scroll.instance.scroll.y; },
      getBoundingClientRect(){ return {top:0, left:0, width: window.innerWidth, height: window.innerHeight}; },
      pinType: document.querySelector('#smooth-container').style.transform ? 'transform' : 'fixed'
    });

    loco.on('scroll', ScrollTrigger.update);
    ScrollTrigger.addEventListener('refresh', () => loco.update());
    setTimeout(()=>ScrollTrigger.refresh(), 100);
  }
});

// GSAP: reveal on scroll
function setupScrollAnimations(){
  if(!window.gsap || !window.ScrollTrigger) return;
  gsap.utils.toArray('[data-reveal]').forEach((el, i) => {
    const y = el.getAttribute('data-y') || 40;
    gsap.from(el, {
      opacity: 0,
      y: Number(y),
      duration: 1,
      ease: 'power3.out',
      delay: i * 0.05,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        end: 'bottom 40%',
        scrub: false,
        scroller: '#smooth-container'
      }
    });
  });
}

// Parallax backgrounds
function setupParallax(){
  if(!window.gsap || !window.ScrollTrigger) return;
  gsap.utils.toArray('[data-parallax]').forEach((el) => {
    const depth = Number(el.getAttribute('data-parallax')) || 0.3;
    gsap.to(el, {
      yPercent: depth * -30,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        scroller: '#smooth-container'
      }
    });
  });
}

// Hover tilt with VanillaTilt
function setupTilt(){
  if(window.VanillaTilt){
    document.querySelectorAll('[data-tilt]').forEach(el => {
      VanillaTilt.init(el, { max: 10, speed: 350, glare: true, 'max-glare': .2, scale: 1.02 });
    });
  }
}

// Export init functions to be used after HTML injection
window.PAPEffects = {
  setupScrollAnimations,
  setupParallax,
  setupTilt
};
