const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');
const navAnchors = document.querySelectorAll('.nav-links a');
const heroMark = document.querySelector('.hero-mark');
const cursorRing = document.getElementById('cursorRing');
const cursorDot = document.getElementById('cursorDot');
const scrollProgressBar = document.getElementById('scrollProgressBar');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function runHeroStagger() {
    if (prefersReducedMotion) {
        document.body.classList.add('hero-ready');
        return;
    }

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            document.body.classList.add('hero-ready');
        });
    });
}

function setupCustomCursor() {
    const canUseCustomCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!canUseCustomCursor || !cursorRing || !cursorDot) {
        return;
    }

    document.body.classList.add('custom-cursor-enabled');

    let ringX = 0;
    let ringY = 0;
    let targetX = 0;
    let targetY = 0;

    const interactiveSelectors = 'a, button, .cta-button, .whatsapp-button, .program-card, .trainer-card, .testimonial-card, .pricing-card, .gallery-image, .menu-toggle';

    window.addEventListener('mousemove', (event) => {
        targetX = event.clientX;
        targetY = event.clientY;

        cursorDot.style.left = `${targetX}px`;
        cursorDot.style.top = `${targetY}px`;

        const isInteractive = event.target.closest(interactiveSelectors);
        document.body.classList.toggle('cursor-hover', Boolean(isInteractive));
    });

    window.addEventListener('mousedown', () => {
        document.body.classList.add('cursor-click');
    });

    window.addEventListener('mouseup', () => {
        document.body.classList.remove('cursor-click');
    });

    function animateRing() {
        ringX += (targetX - ringX) * 0.2;
        ringY += (targetY - ringY) * 0.2;
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
        requestAnimationFrame(animateRing);
    }

    requestAnimationFrame(animateRing);
}

function toggleNavbarStyle() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

function updateScrollProgress() {
    if (!scrollProgressBar) {
        return;
    }

    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    scrollProgressBar.style.width = `${Math.min(progress, 100)}%`;
}

function closeMobileMenu() {
    if (!menuToggle || !navLinks) {
        return;
    }

    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
}

window.addEventListener('scroll', toggleNavbarStyle);
window.addEventListener('scroll', updateScrollProgress);

window.addEventListener('scroll', () => {
    if (!heroMark || prefersReducedMotion) {
        return;
    }

    const offset = Math.min(window.scrollY * 0.12, 40);
    heroMark.style.transform = `translateY(${offset}px)`;
});

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        menuToggle.classList.toggle('open', isOpen);
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
}

const revealElements = document.querySelectorAll('.reveal-item, .program-card, .trainer-card, .testimonial-card, .pricing-card');
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    }
);

revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index * 65, 360)}ms`;
    revealObserver.observe(element);
});

function animateCounter(element, targetText) {
    const digits = parseInt(targetText.replace(/[^0-9]/g, ''), 10);
    if (Number.isNaN(digits)) {
        return;
    }

    const suffix = targetText.replace(/[0-9]/g, '');
    const duration = 1100;
    const start = performance.now();

    function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(eased * digits);
        element.textContent = `${value}${suffix}`;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = targetText;
        }
    }

    requestAnimationFrame(update);
}

const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            const el = entry.target;
            if (el.dataset.animated === 'true') {
                return;
            }

            el.dataset.animated = 'true';
            animateCounter(el, el.textContent.trim());
            statsObserver.unobserve(el);
        });
    },
    { threshold: 0.45 }
);

statNumbers.forEach((numberEl) => statsObserver.observe(numberEl));

navAnchors.forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
        const targetSelector = anchor.getAttribute('href');
        if (!targetSelector || !targetSelector.startsWith('#')) {
            return;
        }

        const target = document.querySelector(targetSelector);
        if (!target) {
            return;
        }

        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        closeMobileMenu();
    });
});

const sectionIds = ['hero', 'programs', 'gallery', 'trainers', 'testimonials', 'pricing', 'contact'];
const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter((section) => section !== null);

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            const activeId = entry.target.getAttribute('id');
            navAnchors.forEach((anchor) => {
                const isActive = anchor.getAttribute('href') === `#${activeId}`;
                anchor.classList.toggle('active', isActive);
            });
        });
    },
    {
        threshold: 0.35,
        rootMargin: '-20% 0px -45% 0px'
    }
);

sections.forEach((section) => sectionObserver.observe(section));

const buttons = document.querySelectorAll('.cta-button, .whatsapp-button');
buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');

        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);

        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

        button.appendChild(ripple);

        window.setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

if (!prefersReducedMotion) {
    const premiumCards = document.querySelectorAll('.program-card, .trainer-card, .testimonial-card, .pricing-card');
    const premiumButtons = document.querySelectorAll('.cta-button, .whatsapp-button');

    premiumCards.forEach((card) => {
        card.addEventListener('pointermove', (event) => {
            const rect = card.getBoundingClientRect();
            const px = (event.clientX - rect.left) / rect.width;
            const py = (event.clientY - rect.top) / rect.height;

            const rotateY = (px - 0.5) * 4;
            const rotateX = (0.5 - py) * 4;

            card.style.transform = `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('pointerleave', () => {
            card.style.transform = '';
        });
    });

    premiumButtons.forEach((button) => {
        button.addEventListener('pointermove', (event) => {
            const rect = button.getBoundingClientRect();
            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;
            button.style.transform = `translate(${x * 0.04}px, ${y * 0.04}px)`;
        });

        button.addEventListener('pointerleave', () => {
            button.style.transform = '';
        });
    });
}

document.addEventListener('click', (event) => {
    if (!navLinks || !menuToggle) {
        return;
    }

    const clickedInsideMenu = navLinks.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle) {
        closeMobileMenu();
    }
});

toggleNavbarStyle();
updateScrollProgress();
runHeroStagger();
setupCustomCursor();
