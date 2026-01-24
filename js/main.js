// Animated Background Particles
(function() {
    const particlesContainer = document.querySelector('.bg-particles');
    if (!particlesContainer) return;

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const particleCount = 25;

    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }

    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Random type: glow or dot
        particle.classList.add(Math.random() > 0.5 ? 'particle-glow' : 'particle-dot');

        // Random size
        const size = Math.random() * 6 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        // Random horizontal position
        particle.style.left = Math.random() * 100 + '%';

        // Random animation duration
        const duration = Math.random() * 20 + 15;
        particle.style.animationDuration = duration + 's';

        // Random delay
        particle.style.animationDelay = Math.random() * 20 + 's';

        particlesContainer.appendChild(particle);
    }
})();

// Loading Screen
(function() {
    const loader = document.querySelector('.loader');
    if (!loader) return;

    // Hide loader after animation completes (matches CSS timing)
    window.addEventListener('load', function() {
        setTimeout(function() {
            loader.classList.add('hidden');
        }, 2000); // Wait for load animation to complete
    });

    // Fallback: hide loader after max 4 seconds even if load event doesn't fire
    setTimeout(function() {
        if (loader && !loader.classList.contains('hidden')) {
            loader.classList.add('hidden');
        }
    }, 4000);
})();

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {

    // Typing Animation
    (function() {
        const typingTextEl = document.querySelector('.typing-text');
        if (!typingTextEl) return;

        const phrases = [
            'build scalable software.',
            'love machine learning.',
            'create full-stack apps.',
            'solve real-world problems.',
            'study at Georgia Tech.'
        ];
        let phraseIdx = 0;
        let charIdx = 0;
        let deleting = false;

        function type() {
            const current = phrases[phraseIdx];

            if (deleting) {
                charIdx--;
                typingTextEl.textContent = current.substring(0, charIdx);
            } else {
                charIdx++;
                typingTextEl.textContent = current.substring(0, charIdx);
            }

            let speed = deleting ? 50 : 80;

            if (!deleting && charIdx === current.length) {
                speed = 2000;
                deleting = true;
            } else if (deleting && charIdx === 0) {
                deleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                speed = 500;
            }

            setTimeout(type, speed);
        }

        // Check for reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            typingTextEl.textContent = phrases[0];
        } else {
            setTimeout(type, 1500);
        }
    })();

    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a nav link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);

            if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        let current = '';

        // Check if at bottom of page
        const scrolledToBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 50);

        if (scrolledToBottom) {
            // If at bottom, highlight the last section (contact)
            current = sections[sections.length - 1].getAttribute('id');
        } else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= (sectionTop - 100)) {
                    current = section.getAttribute('id');
                }
            });
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // Add navbar scroll effect
    const navbar = document.querySelector('.navbar');
    function updateNavbarOnScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', updateNavbarOnScroll);

    // Scroll progress bar
    const scrollProgressBar = document.querySelector('.scroll-progress-bar');
    let ticking = false;

    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgressBar.style.width = scrollPercent + '%';
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScrollProgress);
            ticking = true;
        }
    });

    // Scroll snap section focus effect
    const snapSections = document.querySelectorAll('.hero, .content-section');
    const prefersReducedMotionSnap = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotionSnap) {
        snapSections.forEach(section => section.classList.add('snap-section'));

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                    snapSections.forEach(s => s.classList.remove('active-section'));
                    entry.target.classList.add('active-section');
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px'
        });

        snapSections.forEach(section => sectionObserver.observe(section));

        // Set initial active section
        if (snapSections.length > 0) {
            snapSections[0].classList.add('active-section');
        }
    }

    // Unified scroll animation system
    const animateElements = document.querySelectorAll(`
        .section-title,
        .about-text h2,
        .about-text h3,
        .about-text > p,
        .interests-list,
        .skills-category-modern,
        .timeline-header,
        .timeline-item,
        .project-card,
        .accomplishment-card,
        .contact-intro,
        .contact-card,
        .btn-resume
    `);

    // Add animation class to all target elements
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
    });

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    scrollObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        animateElements.forEach(el => scrollObserver.observe(el));
    } else {
        // Immediately show all elements if reduced motion preferred
        animateElements.forEach(el => el.classList.add('animated'));
    }

    // Section transition animations
    (function() {
        if (prefersReducedMotion) return;

        // Add transition classes to sections
        document.querySelectorAll('.section-title').forEach(el => {
            el.classList.add('section-fade-in');
        });

        // Timeline columns slide in from sides
        const timelineColumns = document.querySelectorAll('.timeline-column');
        timelineColumns.forEach((col, index) => {
            col.classList.add(index === 0 ? 'slide-in-left' : 'slide-in-right');
        });

        // Project cards scale in
        document.querySelectorAll('.project-card').forEach(el => {
            el.classList.add('scale-in');
        });

        // Accomplishment cards scale in
        document.querySelectorAll('.accomplishment-card').forEach(el => {
            el.classList.add('scale-in');
        });

        // Contact cards slide in alternating
        document.querySelectorAll('.contact-card').forEach((el, index) => {
            el.classList.add(index % 2 === 0 ? 'slide-in-left' : 'slide-in-right');
        });

        // Observe all transition elements
        const transitionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    transitionObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.section-fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
            transitionObserver.observe(el);
        });
    })();
});
