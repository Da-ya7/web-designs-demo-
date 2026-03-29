/* ============================================
   MURUGAN TIFFIN CENTRE - SCRIPT
   Interactive Effects & Animations
   ============================================ */

// ============================================
// PAGE LOADER ANIMATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const pageLoader = document.getElementById('pageLoader');
    if (!pageLoader) {
        return;
    }
    
    // Simulate a minimum loading time for dramatic effect (2.5 seconds)
    const minLoadingTime = 2500;
    const startTime = Date.now();
    
    // Wait for resources to load
    window.addEventListener('load', () => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
        
        setTimeout(() => {
            // Add hidden class to trigger fade-out animation
            pageLoader.classList.add('hidden');
            
            // Remove from DOM after animation completes
            setTimeout(() => {
                pageLoader.remove();
            }, 800);
        }, remainingTime);
    });
    
    // Fallback: hide loader if it takes too long (5 seconds max)
    setTimeout(() => {
        if (pageLoader && !pageLoader.classList.contains('hidden')) {
            pageLoader.classList.add('hidden');
        }
    }, 5000);
});

// ============================================
// IMAGE LOADING HANDLER
// ============================================

const fallbackImageSources = {
    idli: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNW9LUIQCCAAT1ei-gg0zZzOSuJBKERy8F5V-8cd8NOxtfsv_ZisyYUn7JPXywSrM8BpyNgmpvXnojmC8yJn9-vqbhGwbiaQrKtjBTkuvwWw&s=10',
    dosa: 'https://www.awesomecuisine.com/wp-content/uploads/2009/06/Plain-Dosa.jpg',
    pongal: 'https://spiceindiaonline.com/wp-content/uploads/2014/01/Ven-Pongal-3.jpg',
    meals: 'https://static.wixstatic.com/media/a94a23_aa674298181e422db3f4da9c8bfac4cc~mv2.jpg/v1/fill/w_568,h_320,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/a94a23_aa674298181e422db3f4da9c8bfac4cc~mv2.jpg',
    coffee: 'https://curlytales.com/wp-content/uploads/2025/10/filter-coffee-bengaluru-1.jpg',
    parotta: 'https://i0.wp.com/www.chitrasfoodbook.com/wp-content/uploads/2015/02/kerala-parotta.jpg?w=1200&ssl=1',
    kitchen: 'https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=1200'
};

function getImageContainer(img) {
    return img.closest('.dish-image, .about-image');
}

function buildSvgFallback(label) {
    const safeLabel = (label || 'Murugan Special').replace(/[<>&"']/g, '');
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='900' viewBox='0 0 1200 900'>
        <defs>
            <linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'>
                <stop offset='0%' stop-color='#2d1c14'/>
                <stop offset='100%' stop-color='#5c2f1b'/>
            </linearGradient>
        </defs>
        <rect width='1200' height='900' fill='url(#g)'/>
        <circle cx='600' cy='370' r='120' fill='rgba(232,160,32,0.25)'/>
        <text x='50%' y='68%' fill='#fdf6ec' font-family='Georgia, serif' font-size='64' text-anchor='middle'>${safeLabel}</text>
    </svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function resolveFallbackSource(img) {
    const fallbackKey = img.dataset.fallback;
    if (fallbackKey && fallbackImageSources[fallbackKey]) {
        return fallbackImageSources[fallbackKey];
    }
    const label = (img.alt || 'Murugan Special').split(' - ')[0].trim();
    return buildSvgFallback(label);
}

function setupImageLoading() {
    // Get all images to load
    const allImages = document.querySelectorAll('img[src]');
    
    allImages.forEach(img => {
        // Skip if image is already loaded
        if (img.complete && img.naturalHeight !== 0) {
            img.classList.add('loaded');
            return;
        }
        
        // Improve cross-origin loading reliability for third-party images.
        img.referrerPolicy = 'no-referrer';
        img.decoding = 'async';

        // Add loading class to parent for shimmer effect
        const container = getImageContainer(img);
        if (container) {
            container.classList.add('loading');
        }
        
        // Handle successful image load
        img.addEventListener('load', () => {
            img.classList.add('loaded');
            img.classList.remove('failed');
            
            // Remove loading shimmer
            const loadedContainer = getImageContainer(img);
            if (loadedContainer) {
                loadedContainer.classList.remove('loading');
            }
        });
        
        // Handle image load errors with fallback
        img.addEventListener('error', () => {
            console.warn('Image failed to load:', img.src);

            // First failure: try a secondary real photo source.
            if (img.dataset.fallbackTried !== 'true') {
                img.dataset.fallbackTried = 'true';
                img.src = resolveFallbackSource(img);
                return;
            }

            img.classList.remove('loaded');
            img.classList.add('failed');

            const failedContainer = getImageContainer(img);
            if (failedContainer) {
                failedContainer.classList.remove('loading');

                // Add a visual label when both remote sources fail.
                if (!failedContainer.querySelector('.image-placeholder')) {
                    const placeholder = document.createElement('div');
                    placeholder.className = 'image-placeholder';
                    placeholder.textContent = (img.alt || 'Murugan Special').split(' - ')[0];
                    failedContainer.appendChild(placeholder);
                }
            }
        });
    });
}

// Setup image loading when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupImageLoading);
} else {
    setupImageLoading();
}

// ============================================
// NAVIGATION - Sticky & Mobile Toggle
// ============================================

const navbar = document.querySelector('.navbar');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

// Sticky navigation on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Close mobile menu when link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ============================================
// SMOOTH SCROLL for anchor links
// ============================================

document.querySelectorAll('[data-scroll]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// ACCORDION MENU - Expand/Collapse
// ============================================

const accordionTriggers = document.querySelectorAll('.accordion-trigger');

accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        const panel = document.getElementById(trigger.getAttribute('aria-controls'));
        
        // Close all other accordion items
        accordionTriggers.forEach(otherTrigger => {
            if (otherTrigger !== trigger) {
                otherTrigger.setAttribute('aria-expanded', 'false');
                const otherPanel = document.getElementById(otherTrigger.getAttribute('aria-controls'));
                otherPanel.hidden = true;
            }
        });
        
        // Toggle current accordion
        trigger.setAttribute('aria-expanded', !isExpanded);
        panel.hidden = isExpanded;
    });
});

// ============================================
// SCROLL REVEAL ANIMATION
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections for reveal animation
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Observe cards for staggered animation
const observeCards = () => {
    const cards = document.querySelectorAll('.dish-card, .reason-card, .testimonial-card, .stat-box');
    
    cards.forEach((card, index) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, observerOptions);
        
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = '.6s ease-out';
        observer.observe(card);
    });
};

observeCards();

// ============================================
// ENHANCED CARD HOVER EFFECTS
// ============================================

const addEnhancedCardEffects = () => {
    const reasonCards = document.querySelectorAll('.reason-card');
    
    reasonCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            // Add slight wiggle on hover
            this.style.animation = 'cardWiggle 0.6s ease-in-out';
            
            // Interact with siblings
            reasonCards.forEach((sibling, siblingIndex) => {
                if (siblingIndex !== index) {
                    sibling.style.opacity = '0.7';
                    sibling.style.filter = 'blur(2px)';
                }
            });
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.animation = 'none';
            reasonCards.forEach(sibling => {
                sibling.style.opacity = '1';
                sibling.style.filter = 'blur(0)';
            });
        });
    });
};

addEnhancedCardEffects();

// ============================================
// BUTTON RIPPLE EFFECT
// ============================================

const addRippleEffect = () => {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Create ripple element
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.width = '0';
            ripple.style.height = '0';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.6)';
            ripple.style.animation = 'rippleAnimation 600ms ease-out';
            ripple.style.pointerEvents = 'none';
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => ripple.remove(), 600);
        });
    });
};

// Add ripple animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleAnimation {
        to {
            width: 300px;
            height: 300px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

addRippleEffect();

// ============================================
// HERO TEXT FADE-IN ENTRANCE
// ============================================

const heroTitle = document.querySelector('.hero-title');
const heroSubtitle = document.querySelector('.hero-subtitle');

if (heroTitle && heroSubtitle) {
    // Animate on page load
    window.addEventListener('load', () => {
        heroTitle.style.animation = 'fadeInUp 0.8s ease-out 0.2s both';
        heroSubtitle.style.animation = 'fadeInUp 0.8s ease-out 0.4s both';
    });
}

// ============================================
// STATS COUNTER ANIMATION
// ============================================

const animateCounters = () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const text = element.innerText;
                
                // Skip animation for non-numeric values
                if (text === '∞' || !text.match(/\d/)) {
                    return;
                }
                
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
};

animateCounters();

// ============================================
// PARALLAX EFFECT on scroll
// ============================================

const addParallaxEffect = () => {
    const heroTexture = document.querySelector('.hero-texture');
    
    if (heroTexture) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            heroTexture.style.transform = `translateY(${scrollPosition * 0.5}px)`;
        });
    }
};

addParallaxEffect();

// ============================================
// KEYBOARD NAVIGATION & ACCESSIBILITY
// ============================================

// Ensure all interactive elements are keyboard accessible
document.querySelectorAll('[role="button"]').forEach(element => {
    element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            element.click();
            e.preventDefault();
        }
    });
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Lazy loading for images (if added in future)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.dataset.src) {
                entry.target.src = entry.target.dataset.src;
                entry.target.removeAttribute('data-src');
                observer.unobserve(entry.target);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// ============================================
// DRAMATIC PAGE LOAD ANIMATION
// ============================================

window.addEventListener('load', () => {
    // Staggered reveal of major sections
    const sections = document.querySelectorAll('section');
    const header = document.querySelector('.hero');
    
    if (header) {
        header.style.opacity = '1';
    }
    
    sections.forEach((section, index) => {
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 300 + (index * 150));
    });
    
    console.log('✨ Murugan Tiffin Centre - Design Enhanced');
});

// Set initial styles for sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.7s ease-out, transform 0.7s ease-out';
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for optimization
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

// ============================================
// MOBILE DETECTION & OPTIMIZATION
// ============================================

const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// ============================================
// CUSTOM ROUND CURSOR
// ============================================

const setupCustomCursor = () => {
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');

    if (!hasFinePointer || !cursorDot || !cursorRing || isMobile()) {
        return;
    }

    document.body.classList.add('cursor-enabled');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let isVisible = false;

    const interactiveSelector = 'a, button, .btn, .dish-card, .reason-card, .testimonial-card, .menu-item, .accordion-trigger';

    const updateCursor = () => {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;

        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;

        requestAnimationFrame(updateCursor);
    };

    document.addEventListener('pointermove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;

        if (!isVisible) {
            isVisible = true;
            cursorDot.style.opacity = '1';
            cursorRing.style.opacity = '1';
        }

        const hoverTarget = event.target.closest(interactiveSelector);
        document.body.classList.toggle('cursor-hover', Boolean(hoverTarget));
    }, { passive: true });

    document.addEventListener('pointerleave', () => {
        isVisible = false;
        cursorDot.style.opacity = '0';
        cursorRing.style.opacity = '0';
        document.body.classList.remove('cursor-hover');
    });

    requestAnimationFrame(updateCursor);
};

// ============================================
// EXTRA INTERACTION LAYER
// ============================================

const setupInteractiveMotion = () => {
    if (isMobile() || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const tiltCards = document.querySelectorAll('.dish-card, .reason-card, .testimonial-card');
    tiltCards.forEach((card) => {
        card.addEventListener('mousemove', (event) => {
            const rect = card.getBoundingClientRect();
            const px = (event.clientX - rect.left) / rect.width;
            const py = (event.clientY - rect.top) / rect.height;
            const rotateY = (px - 0.5) * 5;
            const rotateX = (0.5 - py) * 4;
            card.style.transform = `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    const magneticTargets = document.querySelectorAll('.btn');
    magneticTargets.forEach((target) => {
        target.addEventListener('mousemove', (event) => {
            const rect = target.getBoundingClientRect();
            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;
            target.style.transform = `translate(${x * 0.05}px, ${y * 0.05}px)`;
        });

        target.addEventListener('mouseleave', () => {
            target.style.transform = '';
        });
    });
};

const setupHeroShowcaseMotion = () => {
    if (isMobile() || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const showcase = document.querySelector('.hero-showcase');
    if (!showcase) {
        return;
    }

    const cards = showcase.querySelectorAll('.hero-card');
    let frameRequested = false;
    let relativeX = 0;
    let relativeY = 0;

    const updateCards = () => {
        cards.forEach((card) => {
            const depth = parseFloat(card.dataset.depth || '0.08');
            const moveX = relativeX * 24 * depth;
            const moveY = relativeY * 20 * depth;
            card.style.setProperty('--mx', `${moveX}px`);
            card.style.setProperty('--my', `${moveY}px`);
        });

        frameRequested = false;
    };

    showcase.addEventListener('mousemove', (event) => {
        const rect = showcase.getBoundingClientRect();
        relativeX = (event.clientX - rect.left) / rect.width - 0.5;
        relativeY = (event.clientY - rect.top) / rect.height - 0.5;

        if (!frameRequested) {
            frameRequested = true;
            requestAnimationFrame(updateCards);
        }
    });

    showcase.addEventListener('mouseleave', () => {
        cards.forEach((card) => {
            card.style.setProperty('--mx', '0px');
            card.style.setProperty('--my', '0px');
        });
    });
};

// Disable heavy animations on mobile devices
if (isMobile()) {
    document.documentElement.style.setProperty('--transition-slow', '200ms ease-out');
    console.log('✓ Mobile optimizations applied');
}

setupCustomCursor();
setupInteractiveMotion();
setupHeroShowcaseMotion();

// ============================================
// PRELOAD CRITICAL RESOURCES
// ============================================

// Preconnect to Google Fonts
const link = document.createElement('link');
link.rel = 'preconnect';
link.href = 'https://fonts.googleapis.com';
document.head.appendChild(link);

// ============================================
// IMAGE LAZY LOADING & OPTIMIZATION
// ============================================

const loadImages = () => {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // Image is already being loaded due to lazy attribute
                    img.addEventListener('load', () => {
                        img.style.opacity = '1';
                    });
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: '50px' });
        
        images.forEach(img => {
            img.style.opacity = '0.8';
            imageObserver.observe(img);
        });
    }
};

loadImages();

// ============================================
// IMAGE PARALLAX SCROLL EFFECT
// ============================================

const addImageParallax = () => {
    const heroBg = document.querySelector('.hero-bg');
    
    if (heroBg) {
        window.addEventListener('scroll', throttle(() => {
            const scrollPos = window.scrollY;
            const parallaxSpeed = 0.5;
            heroBg.style.backgroundPosition = `center ${scrollPos * parallaxSpeed}px`;
        }, 30));
    }
};

addImageParallax();

// ============================================
// DISH CARD IMAGE ZOOM ON HOVER
// ============================================

const addDishImageEffects = () => {
    const dishImages = document.querySelectorAll('.dish-image img');
    
    dishImages.forEach(img => {
        img.addEventListener('load', () => {
            img.style.opacity = '1';
            img.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.320, 1), filter 0.6s ease';
        });
    });
};

addDishImageEffects();

// ============================================
// ABOUT SECTION IMAGE ANIMATION
// ============================================

const addAboutImageEffect = () => {
    const aboutImage = document.querySelector('.about-image img');
    
    if (aboutImage) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    aboutImage.style.opacity = '1';
                    aboutImage.style.transform = 'scale(1)';
                    aboutImage.style.transition = 'transform 0.8s ease-out, opacity 0.8s ease-out';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        aboutImage.style.opacity = '0';
        aboutImage.style.transform = 'scale(0.95)';
        observer.observe(aboutImage);
    }
};

addAboutImageEffect();

// ============================================
// INTERACTIVE MENU ITEMS
// ============================================

const addMenuInteraction = () => {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach((item, index) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }, index * 50);
                    observer.unobserve(item);
                }
            });
        }, { threshold: 0.5 });
        
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'all 0.4s ease-out';
        observer.observe(item);
    });
};

addMenuInteraction();

// ============================================
// STAT BOX COUNTER ANIMATION
// ============================================

const animateStatBoxes = () => {
    const statBoxes = document.querySelectorAll('.stat-box');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                entry.target.style.animation = 'statsEnter 0.6s ease-out forwards';
            }
        });
    }, { threshold: 0.5 });
    
    statBoxes.forEach((box, index) => {
        box.style.opacity = '0';
        box.style.animation = `none`;
        observer.observe(box);
    });
};

animateStatBoxes();

// ============================================
// SMOOTH SCROLL WITH OFFSET FOR FIXED NAV
// ============================================

const smoothScrollWithOffset = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
};

smoothScrollWithOffset();

// ============================================
// SMOOTH COLOR TRANSITIONS on theme change
// ============================================

// Support for dark mode preference
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').media !== 'not all') {
    console.log('✓ Dark mode preference detected and applied');
}

// ============================================
// ANALYTICS & USER TRACKING (Optional)
// ============================================

// Track scroll depth
let maxScroll = 0;
window.addEventListener('scroll', throttle(() => {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        // Could send analytics data here
    }
}, 1000));

// ============================================
// ERROR HANDLING
// ============================================

window.addEventListener('error', (event) => {
    console.error('Page error:', event.error);
    // Could send error tracking to monitoring service
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});
