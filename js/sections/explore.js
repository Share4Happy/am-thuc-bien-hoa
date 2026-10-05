// js/sections/explore.js
/**
 * Explore section interactions
 */
export function initExplore() {
    // Hooks for explore category cards
    const exploreCards = document.querySelectorAll('.explore-card');
    exploreCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}
