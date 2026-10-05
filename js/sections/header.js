// js/sections/header.js
/**
 * Header and Navigation logic (mobile toggle, sticky on scroll, scroll spy)
 */
export function initHeader() {
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

    // Sticky Header on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            nav?.classList.add('nav-scrolled');
        } else {
            nav?.classList.remove('nav-scrolled');
        }
    });

    // Active Link on Scroll (Spy)
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
}
