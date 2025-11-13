// Inject sections and wire up interactions
(async function init(){
  // Preloader
  const preloader = document.getElementById('preloader');
  const content = document.getElementById('content');
  const year = document.getElementById('year');
  if(year) year.textContent = new Date().getFullYear();

  // Load sections HTML
  const paths = ['sections/hero.html', 'sections/about.html', 'sections/effects.html', 'sections/contact.html'];
  const htmls = await Promise.all(paths.map(p => fetch(p).then(r=>r.text())));
  content.innerHTML = htmls.join('\n');

  // After content is in DOM, initialize effects
  if(window.PAPEffects){
    window.PAPEffects.setupScrollAnimations();
    window.PAPEffects.setupParallax();
    window.PAPEffects.setupTilt();
  }

  // Smooth scroll links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if(id.length > 1){
        e.preventDefault();
        const el = document.querySelector(id);
        if(el){
          const scroller = document.querySelector('#smooth-container');
          const y = el.getBoundingClientRect().top + window.scrollY - 20;
          if(window.LocomotiveScroll && scroller){
            const loco = scroller.locoscroll || null;
          }
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    });
  });

  // Typing headline
  const typingEl = document.querySelector('[data-typing]');
  const full = typingEl ? typingEl.dataset.typing : '';
  let i = 0;
  function type(){
    if(!typingEl) return;
    typingEl.textContent = full.slice(0, i);
    i = i < full.length ? i + 1 : full.length;
    setTimeout(type, i < full.length ? 55 : 0);
  }
  type();

  // Hide preloader with transition
  setTimeout(() => preloader.classList.add('hide'), 900);
  setTimeout(() => preloader.remove(), 1500);
})();
