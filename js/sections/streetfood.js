// js/sections/streetfood.js
/**
 * Street food section (Showcase 3-card carousel visual feedback)
 */
export function initStreetfood() {
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
}
