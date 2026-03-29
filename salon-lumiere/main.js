document.addEventListener('DOMContentLoaded', () => {
  // 1. Intersection Observer for Fade and Clip Reveal Animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach((el) => {
    observer.observe(el);
  });

  // 2. Premium Parallax for Hero Image
  const parallaxImg = document.querySelector('[data-parallax]');
  if(parallaxImg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      parallaxImg.style.transform = `translateY(${scrolled * 0.12}px) scale(1.05)`;
    });
  }

  // 3. Lookbook Horizontal Scroll capability (if user uses mouse wheel)
  const lookbookTrack = document.querySelector('.lookbook-track');
  if(lookbookTrack) {
    lookbookTrack.addEventListener('wheel', (e) => {
      if (e.deltaY !== 0) {
        // e.preventDefault(); // Un-comment to strictly enforce horizontal scroll vs page scroll
        lookbookTrack.scrollLeft += e.deltaY;
      }
    }, {passive: true});
  }

  // 4. Mobile Menu logic
  window.toggleMenu = function() {
    const navLinks = document.querySelector('.nav-right');
    const ham = document.getElementById('ham');
    
    if(navLinks.style.display === 'flex') {
      navLinks.style.display = 'none';
    } else {
      navLinks.style.display = 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '100%';
      navLinks.style.right = '4vw';
      navLinks.style.background = 'var(--text-main)';
      navLinks.style.padding = '2rem';
      navLinks.style.gap = '2rem';
    }
  }

  window.closeMenu = function() {
    if(window.innerWidth <= 900) {
      document.querySelector('.nav-right').style.display = 'none';
    }
  }

  // 5. Interactive Pricing Menu logic
  window.switchTab = function(name, btn) {
    document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.ptab-content').forEach(t => t.classList.remove('active'));
    
    btn.classList.add('active');
    document.getElementById('tab-' + name).classList.add('active');
  }


  // Window resize reset for mobile menu
  window.addEventListener('resize', () => {
    if(window.innerWidth > 900) {
      const navLinks = document.querySelector('.nav-right');
      navLinks.style.display = 'flex';
      navLinks.style.flexDirection = 'row';
      navLinks.style.position = 'static';
      navLinks.style.background = 'none';
      navLinks.style.padding = '0';
    } else {
      document.querySelector('.nav-right').style.display = 'none';
    }
  });
});
