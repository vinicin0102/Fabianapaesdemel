// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const comparisonSlider = document.getElementById('comparisonSlider');
const floatingWhatsapp = document.getElementById('floatingWhatsapp');

// ===== Navbar Scroll Effect =====
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Show floating WhatsApp after scrolling
    if (currentScroll > 400) {
        floatingWhatsapp.classList.add('visible');
    } else {
        floatingWhatsapp.classList.remove('visible');
    }

    lastScroll = currentScroll;
});

// ===== Mobile Navigation =====
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close nav on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ===== Hero Particles =====
function createParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 6 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 6}s`;
        particle.style.animationDuration = `${Math.random() * 4 + 4}s`;
        container.appendChild(particle);
    }
}
createParticles();

// ===== Before & After / Comparison Slider =====
function initComparisonSlider() {
    if (!comparisonSlider) return;

    const afterImage = comparisonSlider.querySelector('.comparison-after');
    const handle = document.getElementById('comparisonHandle');
    let isDragging = false;

    function updateSlider(x) {
        const rect = comparisonSlider.getBoundingClientRect();
        let position = (x - rect.left) / rect.width;
        position = Math.max(0.02, Math.min(0.98, position));

        afterImage.style.clipPath = `inset(0 0 0 ${position * 100}%)`;
        handle.style.left = `${position * 100}%`;
    }

    // Mouse events
    comparisonSlider.addEventListener('mousedown', (e) => {
        isDragging = true;
        updateSlider(e.clientX);
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        updateSlider(e.clientX);
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Touch events
    comparisonSlider.addEventListener('touchstart', (e) => {
        isDragging = true;
        updateSlider(e.touches[0].clientX);
        e.preventDefault();
    });

    comparisonSlider.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        updateSlider(e.touches[0].clientX);
        e.preventDefault();
    });

    comparisonSlider.addEventListener('touchend', () => {
        isDragging = false;
    });
}
initComparisonSlider();

// ===== Scroll Animations =====
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px',
        }
    );

    animatedElements.forEach((el) => observer.observe(el));
}
initScrollAnimations();

// ===== Counter Animation =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-count'));
                    const duration = 2000;
                    const startTime = performance.now();

                    function updateCounter(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        // Easing function (ease-out)
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const current = Math.round(eased * target);

                        counter.textContent = current;

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        }
                    }

                    requestAnimationFrame(updateCounter);
                    observer.unobserve(counter);
                }
            });
        },
        { threshold: 0.5 }
    );

    counters.forEach((counter) => observer.observe(counter));
}
animateCounters();

// ===== Smooth Scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    });
});

// ===== Active Nav Link Highlighting =====
function highlightActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-links a:not(.nav-cta)');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinksAll.forEach((link) => {
                        link.style.color = '';
                        if (link.getAttribute('href') === `#${id}`) {
                            link.style.color = 'var(--color-accent-light)';
                        }
                    });
                }
            });
        },
        {
            threshold: 0.3,
            rootMargin: '-80px 0px -50% 0px',
        }
    );

    sections.forEach((section) => observer.observe(section));
}
highlightActiveNav();

// ===== Testimonials Carousel =====
function initTestimonialsCarousel() {
    const track = document.getElementById('testimonialsTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');
    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

    const cards = Array.from(track.querySelectorAll('.testimonial-card'));
    const totalCards = cards.length;
    let currentIndex = 0;
    let autoPlayTimer;

    function getCardsPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    function updateCarousel() {
        if (!track.parentElement) return;
        
        const cardsPerView = getCardsPerView();
        const computedStyle = window.getComputedStyle(track);
        const gap = parseInt(computedStyle.gap) || 32;
        
        const trackWidth = track.parentElement.getBoundingClientRect().width;
        const cardWidth = (trackWidth - gap * (cardsPerView - 1)) / cardsPerView;

        cards.forEach((card, index) => {
            card.style.minWidth = `${cardWidth}px`;
            
            // Logic for active card
            const centerOffset = Math.floor(cardsPerView / 2);
            if (index === currentIndex + centerOffset || (cardsPerView === 1 && index === currentIndex)) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        const offset = currentIndex * (cardWidth + gap);
        track.style.transform = `translateX(-${offset}px)`;

        // Update dots and buttons
        updateDots();
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= totalCards - cardsPerView;
    }

    function createDots() {
        dotsContainer.innerHTML = '';
        const cardsPerView = getCardsPerView();
        const totalDots = Math.max(0, totalCards - cardsPerView + 1);
        
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateCarousel();
                resetAutoPlay();
            });
            dotsContainer.appendChild(dot);
        }
        updateDots();
    }

    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function next() {
        const cardsPerView = getCardsPerView();
        if (currentIndex < totalCards - cardsPerView) {
            currentIndex++;
        } else {
            currentIndex = 0; // Loop back
        }
        updateCarousel();
    }

    function prev() {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = totalCards - getCardsPerView(); // Loop to end
        }
        updateCarousel();
    }

    nextBtn.addEventListener('click', () => {
        next();
        resetAutoPlay();
    });

    prevBtn.addEventListener('click', () => {
        prev();
        resetAutoPlay();
    });

    function startAutoPlay() {
        autoPlayTimer = setInterval(next, 5000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayTimer);
        startAutoPlay();
    }

    // Touch Support
    let startX = 0;
    track.addEventListener('touchstart', e => startX = e.touches[0].clientX);
    track.addEventListener('touchend', e => {
        const endX = e.changedTouches[0].clientX;
        if (startX - endX > 50) next();
        else if (endX - startX > 50) prev();
        resetAutoPlay();
    });

    window.addEventListener('resize', () => {
        createDots();
        updateCarousel();
    });

    createDots();
    updateCarousel();
    startAutoPlay();
}
initTestimonialsCarousel();

// ===== Parallax effect on hero =====
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
        hero.style.backgroundPositionY = `${scrolled * 0.4}px`;
    }
});
