// CBIT site mockup — shared interactions (no external deps, no storage APIs)
(function(){
  var body = document.body;

  // Language toggle (in-memory only, defaults to TR each load)
  var langBtns = document.querySelectorAll('[data-lang-btn]');
  langBtns.forEach(function(btn){
    btn.addEventListener('click', function(){
      var lang = btn.getAttribute('data-lang-btn');
      body.setAttribute('data-lang', lang);
      langBtns.forEach(function(b){ b.classList.toggle('active', b === btn); });
      document.documentElement.setAttribute('lang', lang);
    });
  });

  // Mobile nav
  var navToggle = document.querySelector('.nav-toggle');
  var mainNav = document.querySelector('.main-nav');
  if(navToggle && mainNav){
    navToggle.addEventListener('click', function(){
      var open = mainNav.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Simple reveal-on-scroll
  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && revealEls.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold:0.12 });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('is-visible'); });
  }
})();
