// js/main.js
/**
 * Entry point dạng ES Module (bản tham chiếu kiến trúc module).
 * Phải cập nhật song song với js/app.js khi thay đổi logic.
 */
import { initHeader } from './sections/header.js';
import { initHero } from './sections/hero.js';
import { initExplore } from './sections/explore.js';
import { initStreetfood } from './sections/streetfood.js';
import { initSpaces } from './sections/spaces.js';
import { initRestaurants } from './sections/restaurants.js';
import { initSpecialties } from './sections/specialties.js';
import { initStory } from './sections/story.js';
import { initNews } from './sections/news.js';
import { initReviews } from './sections/reviews.js';
import { initFeedback } from './sections/feedback.js';
import { initFooter } from './sections/footer.js';

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initHero();
    initExplore();
    initStreetfood();
    initSpaces();
    initRestaurants();
    initSpecialties();
    initStory();
    initNews();
    initReviews();
    initFeedback();
    initFooter();
});
