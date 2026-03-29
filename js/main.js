// Theme: apply saved preference immediately to prevent flash
(function() {
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
    }
})();

// Register Service Worker (PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').catch(function() {});
    });
}

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

// Page Load Stagger Animation
(function() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var sequence = [
        'nav',
        '.section-indicators',
        '#hero-greeting',
        '.hero-title',
        '.hero-typing',
        '.btn-resume',
        '.scroll-indicator'
    ];

    // Hide immediately (loader covers page so no flicker)
    sequence.forEach(function(sel) {
        var el = document.querySelector(sel);
        if (el) el.classList.add('page-reveal');
    });

    var revealed = false;
    function revealAll() {
        if (revealed) return;
        revealed = true;
        sequence.forEach(function(sel, i) {
            setTimeout(function() {
                var el = document.querySelector(sel);
                if (el) el.classList.add('page-reveal-in');
            }, i * 110);
        });
    }

    // Trigger right when loader starts fading (2000ms matches loader JS)
    window.addEventListener('load', function() {
        setTimeout(revealAll, 2000);
    });
    // Fallback if load event is late
    setTimeout(revealAll, 4500);
})();

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {

    // Scroll-triggered Number Counters
    (function() {
        var counters = document.querySelectorAll('.count-up');
        if (!counters.length) return;

        var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        function animateCounter(el) {
            var target   = parseFloat(el.dataset.target);
            var decimals = parseInt(el.dataset.decimals) || 0;
            var suffix   = el.dataset.suffix || '';
            var format   = el.dataset.format || '';
            var duration = 1400;
            var start    = null;

            function format_num(val) {
                var fixed = val.toFixed(decimals);
                if (format === 'comma') {
                    fixed = parseFloat(fixed).toLocaleString('en-US', { maximumFractionDigits: decimals });
                }
                return fixed + suffix;
            }

            if (reduced) {
                el.textContent = format_num(target);
                return;
            }

            function step(timestamp) {
                if (!start) start = timestamp;
                var progress = Math.min((timestamp - start) / duration, 1);
                // Ease out cubic
                var ease = 1 - Math.pow(1 - progress, 3);
                el.textContent = format_num(ease * target);
                if (progress < 1) requestAnimationFrame(step);
                else el.textContent = format_num(target);
            }

            requestAnimationFrame(step);
        }

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function(el) { observer.observe(el); });
    })();

    // Theme Toggle
    (function() {
        var toggleBtn = document.getElementById('theme-toggle');
        if (!toggleBtn) return;

        toggleBtn.addEventListener('click', function() {
            document.body.classList.toggle('light-mode');
            var isLight = document.body.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
    })();

    // Dynamic Greeting
    (function() {
        var greetingEl = document.getElementById('hero-greeting');
        if (!greetingEl) return;

        var hour = new Date().getHours();
        var greeting;

        if (hour >= 5 && hour < 12) {
            greeting = '🌅 Good Morning';
        } else if (hour >= 12 && hour < 17) {
            greeting = '☀️ Good Afternoon';
        } else if (hour >= 17 && hour < 21) {
            greeting = '🌇 Good Evening';
        } else {
            greeting = '🌙 Good Night';
        }

        greetingEl.textContent = greeting;
    })();

    // Typing Animation
    (function() {
        const typingTextEl = document.querySelector('.typing-text');
        const cursorEl = document.querySelector('.typing-cursor');
        if (!typingTextEl || !cursorEl) return;

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
        let isTyping = false;

        function type() {
            const current = phrases[phraseIdx];
            isTyping = true;
            cursorEl.classList.add('typing-active');

            if (deleting) {
                charIdx--;
                typingTextEl.textContent = current.substring(0, charIdx);
            } else {
                charIdx++;
                typingTextEl.textContent = current.substring(0, charIdx);
            }

            let speed = deleting ? 50 : 80;

            if (!deleting && charIdx === current.length) {
                // Finished typing - pause and let cursor blink
                speed = 2000;
                deleting = true;
                isTyping = false;
                cursorEl.classList.remove('typing-active');
            } else if (deleting && charIdx === 0) {
                // Finished deleting - brief pause before next phrase
                deleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                speed = 500;
                isTyping = false;
                cursorEl.classList.remove('typing-active');
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
    const mobileBackdrop = document.querySelector('.mobile-menu-backdrop');

    if (hamburger && navMenu && mobileBackdrop) {
        // Toggle menu
        function toggleMenu() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            mobileBackdrop.classList.toggle('active');

            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }

        // Close menu
        function closeMenu() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            mobileBackdrop.classList.remove('active');
            document.body.style.overflow = '';
        }

        hamburger.addEventListener('click', toggleMenu);

        // Close menu when clicking backdrop
        mobileBackdrop.addEventListener('click', closeMenu);

        // Close menu when clicking on a nav link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);

            if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });

        // Close menu on ESC key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
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

    // Active nav link and section indicators on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const indicatorDots = document.querySelectorAll('.indicator-dot');

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

        // Update nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });

        // Update section indicators
        indicatorDots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('data-section') === current) {
                dot.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Call once on load

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

    // Haptic Feedback (Mobile)
    (function() {
        if (!navigator.vibrate) return;

        var hapticTargets = document.querySelectorAll(
            '.btn, .btn-resume, .contact-card, .nav-link, .hamburger, ' +
            '.back-to-top, .interest-card, .project-card, .accomplishment-card, ' +
            '.indicator-dot'
        );

        hapticTargets.forEach(function(el) {
            el.addEventListener('touchstart', function() {
                navigator.vibrate(10);
            }, { passive: true });
        });
    })();

    // Copy to Clipboard with Toast Notification
    (function() {
        const copyableCards = document.querySelectorAll('.contact-card.copyable');
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        if (!copyableCards.length || !toast) return;

        let toastTimeout;

        function showToast(message) {
            toastMessage.textContent = message;
            toast.classList.add('show');

            clearTimeout(toastTimeout);
            toastTimeout = setTimeout(function() {
                toast.classList.remove('show');
            }, 2500);
        }

        copyableCards.forEach(function(card) {
            card.addEventListener('click', function(e) {
                e.preventDefault();
                var textToCopy = this.getAttribute('data-copy');
                if (!textToCopy) return;

                navigator.clipboard.writeText(textToCopy).then(function() {
                    showToast('Copied "' + textToCopy + '" to clipboard!');

                    card.classList.add('copied');
                    var hint = card.querySelector('.copy-hint');
                    if (hint) hint.textContent = 'Copied!';

                    setTimeout(function() {
                        card.classList.remove('copied');
                        if (hint) hint.textContent = 'Click to copy';
                    }, 2500);
                });
            });
        });
    })();

    // Back to Top Button
    (function() {
        const backToTopBtn = document.getElementById('backToTop');
        if (!backToTopBtn) return;

        // Show/hide button based on scroll position
        function toggleBackToTop() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }

        // Scroll to top when button is clicked
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Listen to scroll events
        window.addEventListener('scroll', toggleBackToTop);

        // Initial check
        toggleBackToTop();
    })();

    // Interactive Terminal
    (function() {
        const terminalInput = document.getElementById('terminal-input');
        const terminalOutput = document.getElementById('terminal-output');
        if (!terminalInput || !terminalOutput) return;

        let commandHistory = [];
        let historyIndex = -1;

        // Available commands
        const commands = {
            help: {
                description: 'Show all available commands',
                execute: () => {
                    return `
                        <div class="terminal-section-header">Available Commands:</div>
                        <table class="terminal-table">
                            <tr><td>help</td><td>Show this help message</td></tr>
                            <tr><td>about</td><td>Learn more about me</td></tr>
                            <tr><td>skills</td><td>View my technical skills</td></tr>
                            <tr><td>experience</td><td>See my work experience</td></tr>
                            <tr><td>education</td><td>View my education background</td></tr>
                            <tr><td>projects</td><td>Browse my projects</td></tr>
                            <tr><td>achievements</td><td>See my accomplishments</td></tr>
                            <tr><td>interests</td><td>See my personal hobbies and interests</td></tr>
                            <tr><td>contact</td><td>Get my contact information</td></tr>
                            <tr><td>social</td><td>View my social media links</td></tr>
                            <tr><td>resume</td><td>Download my resume</td></tr>
                            <tr><td>clear</td><td>Clear the terminal</td></tr>
                            <tr><td>whoami</td><td>Display current user</td></tr>
                        </table>
                    `;
                }
            },
            about: {
                description: 'Learn more about me',
                execute: () => {
                    return `
                        <div class="terminal-section-header">About Dev Patel</div>
                        <div class="terminal-text">
                            I'm a Computer Science student at Georgia Tech with a passion for
                            building innovative software solutions. I specialize in machine learning,
                            full-stack development, and AI applications.
                        </div>
                        <div class="terminal-text" style="margin-top: 0.5rem;">
                            <span class="terminal-command">Location:</span> North Brunswick, NJ<br>
                            <span class="terminal-command">University:</span> Georgia Institute of Technology<br>
                            <span class="terminal-command">Major:</span> Computer Science (B.S.)<br>
                            <span class="terminal-command">GPA:</span> 3.41/4.0
                        </div>
                    `;
                }
            },
            skills: {
                description: 'View my technical skills',
                execute: () => {
                    return `
                        <div class="terminal-section-header">Technical Skills</div>
                        <div class="terminal-text">
                            <span class="terminal-command">Languages:</span><br>
                            Java, Python, C, C++, JavaScript, HTML, CSS, SQL
                        </div>
                        <div class="terminal-text" style="margin-top: 0.5rem;">
                            <span class="terminal-command">Frameworks & Libraries:</span><br>
                            React.js, React Native, Flask, FastAPI, NumPy, OpenCV,
                            MoviePy, Streamlit, ML-Agents, Power BI
                        </div>
                        <div class="terminal-text" style="margin-top: 0.5rem;">
                            <span class="terminal-command">Tools & Platforms:</span><br>
                            Git, Docker, Linux, MongoDB, Nix, PyCharm,
                            Google ADK, Video Intelligence API
                        </div>
                    `;
                }
            },
            experience: {
                description: 'See my work experience',
                execute: () => {
                    return `
                        <div class="terminal-section-header">Work Experience</div>

                        <div class="terminal-text">
                            <span class="terminal-command">HyTech Racing - Software Engineer</span><br>
                            Aug 2025 - Present<br>
                            • Working with C++, Simulink, and embedded systems<br>
                            • Developing software for electric racing vehicles
                        </div>

                        <div class="terminal-text" style="margin-top: 0.5rem;">
                            <span class="terminal-command">Photon Insights - AI/ML Intern</span><br>
                            Jul 2024 - Aug 2025<br>
                            • Specialized in AI, NLP, and LLM applications<br>
                            • Built intelligent systems for data analysis
                        </div>

                        <div class="terminal-text" style="margin-top: 0.5rem;">
                            <span class="terminal-command">NJIT Bader Research Group - Research Assistant</span><br>
                            Jun - Aug 2024<br>
                            • Developed Monte Carlo algorithms for research<br>
                            • Published findings in academic journals
                        </div>

                        <div class="terminal-text" style="margin-top: 0.5rem;">
                            <span class="terminal-command">Finplex - AI Engineer</span><br>
                            May - Dec 2024<br>
                            • Built NLP-based document classification systems<br>
                            • Automated financial document processing
                        </div>
                    `;
                }
            },
            education: {
                description: 'View my education background',
                execute: () => {
                    return `
                        <div class="terminal-section-header">Education</div>

                        <div class="terminal-text">
                            <span class="terminal-command">Georgia Institute of Technology</span><br>
                            Bachelor of Science in Computer Science<br>
                            Aug 2025 - May 2028 (Expected)<br>
                            GPA: 3.41/4.0
                        </div>

                        <div class="terminal-text" style="margin-top: 0.5rem;">
                            <span class="terminal-command">Raritan Valley Community College</span><br>
                            Associate of Science<br>
                            May 2023 - May 2025<br>
                            GPA: 3.78/4.0
                        </div>
                    `;
                }
            },
            projects: {
                description: 'Browse my projects',
                execute: () => {
                    return `
                        <div class="terminal-section-header">Featured Projects</div>

                        <div class="terminal-text">
                            <span class="terminal-command">1. Dental Scanner (Open Wide)</span><br>
                            • Flask, Python, Computer Vision, Roboflow<br>
                            • AI-powered dental diagnosis system<br>
                            • Real-time cavity and disease detection
                        </div>

                        <div class="terminal-text" style="margin-top: 0.5rem;">
                            <span class="terminal-command">2. Arena Vision</span><br>
                            • Google ADK, Gemini Vision, Streamlit<br>
                            • Advanced video processing and analysis<br>
                            • AI-driven sports analytics platform
                        </div>

                        <div class="terminal-text" style="margin-top: 0.5rem;">
                            <span class="terminal-command">3. GT-Yellow Jacked</span><br>
                            • Next.js, TypeScript, Firestore, Capacitor<br>
                            • Modular type-safe CRUD hooks for web and mobile<br>
                            • Strongly typed third-party exercise API pipeline
                        </div>

                        <div class="terminal-text" style="margin-top: 0.5rem;">
                            <span class="terminal-success">Tip:</span> Check out the Projects section for more details!
                        </div>
                    `;
                }
            },
            achievements: {
                description: 'See my accomplishments',
                execute: () => {
                    return `
                        <div class="terminal-section-header">Achievements</div>

                        <div class="terminal-text">
                            <span class="terminal-command">Congressional Award Gold Medal</span><br>
                            February 2024<br>
                            • Highest honor for youth in the United States<br>
                            • Recognized for community service and leadership
                        </div>

                        <div class="terminal-text" style="margin-top: 0.5rem;">
                            <span class="terminal-command">2024 US Open Ball Crew</span><br>
                            August - September 2024<br>
                            • Selected to work at the US Open Tennis Championships<br>
                            • Demonstrated professionalism and teamwork
                        </div>

                        <div class="terminal-text" style="margin-top: 0.5rem;">
                            <span class="terminal-command">Junior Volunteer - Fire Company</span><br>
                            April 2021 - June 2025<br>
                            • 4+ years of community service<br>
                            • Emergency response and public safety
                        </div>
                    `;
                }
            },
            contact: {
                description: 'Get my contact information',
                execute: () => {
                    return `
                        <div class="terminal-section-header">Contact Information</div>
                        <table class="terminal-table">
                            <tr><td>Email:</td><td>devjpatel.30@gmail.com</td></tr>
                            <tr><td>Phone:</td><td>848-667-9589</td></tr>
                            <tr><td>Location:</td><td>North Brunswick, NJ</td></tr>
                            <tr><td>LinkedIn:</td><td>linkedin.com/in/Dev-Patel</td></tr>
                            <tr><td>GitHub:</td><td>github.com/DevP1130</td></tr>
                        </table>
                    `;
                }
            },
            social: {
                description: 'View my social media links',
                execute: () => {
                    return `
                        <div class="terminal-section-header">Social Media</div>
                        <div class="terminal-text">
                            <span class="terminal-command">GitHub:</span>
                            <a href="https://github.com/DevP1130" target="_blank" style="color: #58a6ff;">
                                github.com/DevP1130
                            </a>
                        </div>
                        <div class="terminal-text" style="margin-top: 0.5rem;">
                            <span class="terminal-command">LinkedIn:</span>
                            <a href="https://linkedin.com/in/Dev-Patel" target="_blank" style="color: #58a6ff;">
                                linkedin.com/in/Dev-Patel
                            </a>
                        </div>
                    `;
                }
            },
            resume: {
                description: 'Download my resume',
                execute: () => {
                    window.open('assets/Dev Patel Resume.pdf', '_blank');
                    return `
                        <div class="terminal-text">
                            <span class="terminal-success">✓</span> Opening resume in a new tab...
                        </div>
                    `;
                }
            },
            clear: {
                description: 'Clear the terminal',
                execute: () => {
                    terminalOutput.innerHTML = '';
                    return null;
                }
            },
            whoami: {
                description: 'Display current user',
                execute: () => {
                    return `
                        <div class="terminal-text">
                            <span class="terminal-user">dev</span>@<span class="terminal-path">portfolio</span>
                        </div>
                    `;
                }
            }
        };

        commands.interests = {
            description: 'See my personal hobbies and interests',
            execute: () => {
                return `
                        <div class="terminal-section-header">Beyond Code</div>

                        <div class="terminal-text">
                            <span class="terminal-command">Basketball</span><br>
                            Love hitting the court for pickup games and following the NBA season.
                        </div>

                        <div class="terminal-text" style="margin-top: 0.5rem;">
                            <span class="terminal-command">Tennis</span><br>
                            7.2 UTR player. From the court to the US Open ball crew - tennis is a big part of my life.
                        </div>

                        <div class="terminal-text" style="margin-top: 0.5rem;">
                            <span class="terminal-command">Watching Sports</span><br>
                            Always tuned into game day - from basketball to football to tennis.
                        </div>

                        <div class="terminal-text" style="margin-top: 0.5rem;">
                            <span class="terminal-command">Music</span><br>
                            Always have my headphones on - music keeps me focused and motivated.
                        </div>

                        <div class="terminal-text" style="margin-top: 0.5rem;">
                            <span class="terminal-command">Working Out</span><br>
                            Staying disciplined in the gym - building strength for both body and mind.
                        </div>
                    `;
            }
        };

        // Add command aliases
        commands.ls = {
            description: 'List available commands (alias for help)',
            execute: () => commands.help.execute()
        };

        // Execute command
        function executeCommand(input) {
            const trimmedInput = input.trim().toLowerCase();

            if (!trimmedInput) return;

            // Add to history
            commandHistory.push(input);
            historyIndex = commandHistory.length;

            // Display command
            addOutput(`<span class="terminal-prompt-symbol">$</span> <span class="terminal-text">${input}</span>`);

            // Execute command
            if (commands[trimmedInput]) {
                const result = commands[trimmedInput].execute();
                if (result) {
                    addOutput(result);
                }
            } else {
                addOutput(`<span class="terminal-error">Command not found: ${trimmedInput}</span>`);
                addOutput(`<span class="terminal-text">Type <span class="terminal-command">'help'</span> to see available commands.</span>`);
            }
        }

        // Add output to terminal
        function addOutput(html) {
            const line = document.createElement('div');
            line.className = 'terminal-line';
            line.innerHTML = html;
            terminalOutput.appendChild(line);

            // Scroll to bottom
            terminalOutput.parentElement.scrollTop = terminalOutput.parentElement.scrollHeight;
        }

        // Handle input
        terminalInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const input = terminalInput.value;
                executeCommand(input);
                terminalInput.value = '';
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    terminalInput.value = commandHistory[historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    terminalInput.value = commandHistory[historyIndex];
                } else {
                    historyIndex = commandHistory.length;
                    terminalInput.value = '';
                }
            } else if (e.key === 'Tab') {
                e.preventDefault();
                const input = terminalInput.value.toLowerCase();
                const matches = Object.keys(commands).filter(cmd => cmd.startsWith(input));

                if (matches.length === 1) {
                    terminalInput.value = matches[0];
                } else if (matches.length > 1) {
                    addOutput(`<span class="terminal-text">${matches.join('  ')}</span>`);
                }
            }
        });

        // Focus input when clicking terminal body
        document.querySelector('.terminal-body').addEventListener('click', function() {
            terminalInput.focus();
        });

        // Auto-focus on terminal section visible
        const terminalSection = document.getElementById('terminal');
        if (terminalSection) {
            const terminalObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => terminalInput.focus(), 300);
                    }
                });
            }, { threshold: 0.5 });

            terminalObserver.observe(terminalSection);
        }
    })();

    // Parallax Scrolling
    (function() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (window.innerWidth <= 768) return;

        var shapes = document.querySelectorAll('.parallax-shape[data-speed]');
        if (!shapes.length) return;

        var ticking = false;

        function updateParallax() {
            var scrollY = window.scrollY;

            shapes.forEach(function(shape) {
                var speed = parseFloat(shape.getAttribute('data-speed'));
                var yOffset = scrollY * speed;
                var baseTransform = shape.style.transform || '';

                // Preserve rotation if it exists
                var rotation = '';
                var match = window.getComputedStyle(shape).transform;
                if (shape.classList.contains('parallax-square-1')) {
                    rotation = ' rotate(45deg)';
                } else if (shape.classList.contains('parallax-square-2')) {
                    rotation = ' rotate(20deg)';
                } else if (shape.classList.contains('parallax-diamond-1')) {
                    rotation = ' rotate(45deg)';
                }

                shape.style.transform = 'translateY(' + yOffset + 'px)' + rotation;
            });

            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });

        updateParallax();
    })();

    // Swipe Navigation (Mobile)
    (function() {
        // Only enable on touch devices
        if (!('ontouchstart' in window)) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        var sections = Array.from(document.querySelectorAll('section[id]'));
        if (!sections.length) return;

        var touchStartY = 0;
        var touchStartX = 0;
        var touchStartTime = 0;
        var isScrolling = false;
        var swipeCooldown = false;

        var swipeIndicator = document.getElementById('swipe-indicator');

        function getCurrentSectionIndex() {
            var scrollPos = window.scrollY + window.innerHeight / 3;
            var currentIndex = 0;

            for (var i = 0; i < sections.length; i++) {
                if (scrollPos >= sections[i].offsetTop) {
                    currentIndex = i;
                }
            }
            return currentIndex;
        }

        function scrollToSection(index) {
            if (index < 0 || index >= sections.length) return;
            if (swipeCooldown) return;

            swipeCooldown = true;

            sections[index].scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Show swipe indicator
            if (swipeIndicator) {
                var name = sections[index].getAttribute('id');
                name = name.charAt(0).toUpperCase() + name.slice(1);
                swipeIndicator.textContent = name;
                swipeIndicator.classList.add('show');

                setTimeout(function() {
                    swipeIndicator.classList.remove('show');
                }, 1200);
            }

            setTimeout(function() {
                swipeCooldown = false;
            }, 800);
        }

        document.addEventListener('touchstart', function(e) {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
            touchStartTime = Date.now();
            isScrolling = false;
        }, { passive: true });

        document.addEventListener('touchend', function(e) {
            if (isScrolling) return;

            var touchEndY = e.changedTouches[0].clientY;
            var touchEndX = e.changedTouches[0].clientX;
            var deltaY = touchStartY - touchEndY;
            var deltaX = touchStartX - touchEndX;
            var elapsed = Date.now() - touchStartTime;

            // Require: vertical swipe, fast enough, long enough distance, more vertical than horizontal
            var minSwipeDistance = 80;
            var maxSwipeTime = 400;

            if (Math.abs(deltaY) < minSwipeDistance) return;
            if (elapsed > maxSwipeTime) return;
            if (Math.abs(deltaX) > Math.abs(deltaY) * 0.7) return;

            // Skip if user is interacting with terminal input
            if (e.target.closest('.terminal-body')) return;

            var currentIndex = getCurrentSectionIndex();

            if (deltaY > 0) {
                // Swipe up -> next section
                scrollToSection(currentIndex + 1);
            } else {
                // Swipe down -> previous section
                scrollToSection(currentIndex - 1);
            }
        }, { passive: true });

        document.addEventListener('touchmove', function() {
            isScrolling = true;
        }, { passive: true });
    })();

    // Keyboard Navigation (← → arrow keys)
    (function() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        var sections = Array.from(document.querySelectorAll('section[id]'));
        if (!sections.length) return;

        var cooldown = false;
        var swipeIndicator = document.getElementById('swipe-indicator');

        function getCurrentIndex() {
            var scrollPos = window.scrollY + window.innerHeight / 3;
            var idx = 0;
            for (var i = 0; i < sections.length; i++) {
                if (scrollPos >= sections[i].offsetTop) idx = i;
            }
            return idx;
        }

        function goToSection(index) {
            if (index < 0 || index >= sections.length || cooldown) return;
            cooldown = true;

            sections[index].scrollIntoView({ behavior: 'smooth', block: 'start' });

            if (swipeIndicator) {
                var name = sections[index].getAttribute('id');
                name = name.charAt(0).toUpperCase() + name.slice(1);
                swipeIndicator.textContent = '→ ' + name;
                swipeIndicator.classList.add('show');
                setTimeout(function() { swipeIndicator.classList.remove('show'); }, 1200);
            }

            setTimeout(function() { cooldown = false; }, 800);
        }

        document.addEventListener('keydown', function(e) {
            // Don't hijack keys when typing in an input or the terminal
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.target.closest('.terminal-body')) return;
            // Don't fire on modifier combos (Cmd+K etc.)
            if (e.metaKey || e.ctrlKey || e.altKey) return;

            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                goToSection(getCurrentIndex() + 1);
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                goToSection(getCurrentIndex() - 1);
            }
        });
    })();

    // Pull to Refresh
    (function() {
        var ptr = document.getElementById('ptr-indicator');
        var ptrLabel = ptr ? ptr.querySelector('.ptr-label') : null;
        var ptrSpinner = ptr ? ptr.querySelector('.ptr-spinner') : null;
        var ptrStartY = 0;
        var ptrActive = false;
        var ptrTriggered = false;
        var THRESHOLD = 80;

        if (!ptr) return;

        document.addEventListener('touchstart', function(e) {
            if (window.scrollY === 0) {
                ptrStartY = e.touches[0].clientY;
                ptrActive = true;
                ptrTriggered = false;
            }
        }, { passive: true });

        document.addEventListener('touchmove', function(e) {
            if (!ptrActive || window.scrollY > 0) return;
            var pull = Math.min(e.touches[0].clientY - ptrStartY, THRESHOLD + 20);
            if (pull <= 0) return;

            // Rotate spinner proportionally to pull distance
            var rotate = (pull / THRESHOLD) * 270;
            if (ptrSpinner) ptrSpinner.style.transform = 'rotate(' + rotate + 'deg)';

            // Move indicator down
            ptr.style.transform = 'translateX(-50%) translateY(' + (pull - 80) + 'px)';

            if (pull >= THRESHOLD) {
                ptr.classList.add('ptr-ready');
                if (ptrLabel) ptrLabel.textContent = 'Release to refresh';
                ptrTriggered = true;
            } else {
                ptr.classList.remove('ptr-ready');
                if (ptrLabel) ptrLabel.textContent = 'Pull to refresh';
                ptrTriggered = false;
            }
        }, { passive: true });

        document.addEventListener('touchend', function() {
            if (!ptrActive) return;
            ptrActive = false;

            if (ptrTriggered) {
                ptr.classList.add('ptr-refreshing');
                ptr.classList.remove('ptr-ready');
                if (ptrLabel) ptrLabel.textContent = 'Refreshing…';
                if (ptrSpinner) ptrSpinner.style.transform = '';
                setTimeout(function() { location.reload(); }, 800);
            } else {
                ptr.style.transform = 'translateX(-50%) translateY(-80px)';
                if (ptrSpinner) ptrSpinner.style.transform = '';
                ptr.classList.remove('ptr-ready');
            }
        }, { passive: true });
    })();
});
