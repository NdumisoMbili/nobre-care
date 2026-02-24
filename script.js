// Safety: ensure everything is visible even if scripts fail
setTimeout(() => {
    document.body.style.opacity = '1';
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => el.classList.add('visible'));
}, 2000);

(function () {
    // Header Scroll & Hide
    const header = document.getElementById('siteHeader');
    const progressBar = document.getElementById('progressBar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        const h = document.documentElement.scrollHeight - window.innerHeight;

        // Progress Bar
        const progress = (y / h) * 100;
        if (progressBar) progressBar.style.width = progress + '%';

        // Header Control
        header.classList.toggle('scrolled', y > 80);
        if (y > lastScroll && y > 300) header.classList.add('hidden');
        else header.classList.remove('hidden');

        lastScroll = y;
    }, { passive: true });

    // Mobile Menu
    const mobileMenu = document.getElementById('mobileMenu'), mainNav = document.getElementById('mainNav');
    mobileMenu.addEventListener('click', () => {
        const isActive = mainNav.classList.toggle('active');
        const i = mobileMenu.querySelector('i');

        // Haptic-like visual feedback
        mobileMenu.style.transform = 'scale(0.9)';
        setTimeout(() => mobileMenu.style.transform = '', 100);

        i.classList.toggle('fa-bars');
        i.classList.toggle('fa-times');

        document.body.style.overflow = isActive ? 'hidden' : '';

        // Stagger indicator reset (optional)
        if (isActive) {
            mainNav.querySelectorAll('li').forEach((li, index) => {
                li.style.transitionDelay = `${0.1 + index * 0.05}s`;
            });
        }
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href === '#') return;
            const t = document.querySelector(href);
            if (t) {
                const offset = 80;
                const top = t.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
                mainNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Advanced Scroll Reveal (with staggering)
    const revealObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                // If the element has children that should stagger, handle them
                if (e.target.hasAttribute('data-stagger')) {
                    const children = e.target.querySelectorAll(e.target.getAttribute('data-stagger'));
                    children.forEach((child, i) => {
                        setTimeout(() => {
                            child.classList.add('visible');
                        }, i * 150);
                    });
                }

                e.target.classList.add('visible');
                revealObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, [data-stagger]').forEach(el => {
        revealObs.observe(el);
    });

    // Numbers Counter
    const counters = document.querySelectorAll('.counter');
    let done = false;
    const cObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting && !done) {
                done = true;
                counters.forEach(c => {
                    const tgt = +c.dataset.target, dur = 2000, st = performance.now();
                    function tick(now) {
                        const p = Math.min((now - st) / dur, 1), ease = 1 - Math.pow(1 - p, 3);
                        c.textContent = Math.floor(ease * tgt).toLocaleString();
                        if (p < 1) requestAnimationFrame(tick);
                        else c.textContent = tgt.toLocaleString();
                    }
                    requestAnimationFrame(tick);
                });
            }
        });
    }, { threshold: 0.5 });
    const sb = document.querySelector('.stats-bar'); if (sb) cObs.observe(sb);

    // Magnetic Buttons
    if (window.matchMedia('(pointer:fine)').matches) {
        document.querySelectorAll('.btn-primary, .btn-secondary, .submit-btn, .nav-cta').forEach(btn => {
            btn.addEventListener('mousemove', function (e) {
                const r = this.getBoundingClientRect(),
                    x = e.clientX - r.left - r.width / 2,
                    y = e.clientY - r.top - r.height / 2;
                this.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            btn.addEventListener('mouseleave', function () {
                this.style.transform = '';
            });
        });
    }

    // Contact Form
    const form = document.getElementById('contactForm'), submitBtn = document.getElementById('submitBtn');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            submitBtn.classList.add('success');
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            setTimeout(() => {
                submitBtn.classList.remove('success');
                submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
                form.reset();
            }, 2500);
        });
    }

    // Parallax Scrolling for floating shapes & Backgrounds
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;

        // Shapes
        document.querySelectorAll('.floating-shape').forEach((shape, i) => {
            const speed = 0.05 * (i + 1);
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });

        // Hero Parallax effect (slight zoom)
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.backgroundPositionY = (scrolled * 0.5) + 'px';
        }
    }, { passive: true });

    // Active Nav section highlighting (Throttle for performance)
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav ul li a');

    let isScrolling;
    window.addEventListener('scroll', () => {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
            let current = "";
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= (sectionTop - 150)) {
                    current = section.getAttribute('id');
                }
            });
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }, 100);
    }, { passive: true });
})();
