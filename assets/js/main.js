// assets/js/main.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navList = document.getElementById('nav-list');
    const nav = document.querySelector('.site-nav');

    if (mobileToggle && navList) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navList.classList.toggle('open');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                if (navList.classList.contains('open')) {
                    icon.classList.remove('ri-menu-line');
                    icon.classList.add('ri-close-line');
                } else {
                    icon.classList.remove('ri-close-line');
                    icon.classList.add('ri-menu-line');
                }
            }
        });

        // Close on nav link click
        navList.querySelectorAll('.nav-link-item').forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('open');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('ri-close-line');
                    icon.classList.add('ri-menu-line');
                }
            });
        });

        // Click outside to close mobile menu
        document.addEventListener('click', (e) => {
            if (navList.classList.contains('open') && !navList.contains(e.target) && !mobileToggle.contains(e.target)) {
                navList.classList.remove('open');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('ri-close-line');
                    icon.classList.add('ri-menu-line');
                }
            }
        });
    }

    // 2. Sticky Header on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            nav?.classList.add('nav-scrolled');
        } else {
            nav?.classList.remove('nav-scrolled');
        }
    });

    // 3. Active Link on Scroll (Spy)
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link-item');

    function highlightNav() {
        const scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 140;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNav);

    // 4. Carousel Buttons (Visual Feedback)
    const sliderArrows = document.querySelectorAll('.slider-arrow-btn');
    sliderArrows.forEach(btn => {
        btn.addEventListener('click', () => {
            const wrapper = btn.closest('.showcase-slider-wrapper');
            if (!wrapper) return;
            const items = wrapper.querySelectorAll('.showcase-item');
            if (items.length >= 3) {
                items.forEach(item => {
                    item.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                    item.style.transform = btn.classList.contains('next') ? 'translateX(-8px)' : 'translateX(8px)';
                    setTimeout(() => {
                        item.style.transform = 'translateX(0)';
                    }, 300);
                });
            }
        });
    });

    // 5. Interactive Feedback Stars
    const starContainer = document.getElementById('star-rating');
    if (starContainer) {
        const stars = starContainer.querySelectorAll('i');
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const val = parseInt(star.getAttribute('data-val') || '5', 10);
                stars.forEach((s, idx) => {
                    if (idx < val) {
                        s.classList.remove('ri-star-line');
                        s.classList.add('ri-star-fill', 'active');
                    } else {
                        s.classList.remove('ri-star-fill', 'active');
                        s.classList.add('ri-star-line');
                    }
                });
            });
        });
    }

    // 6. Smooth Anchor Link Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});
