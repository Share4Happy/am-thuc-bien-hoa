// js/sections/feedback.js
import { showToast } from '../components/toast.js';

/**
 * Feedback form & star rating logic
 */
export function initFeedback() {
    const starContainer = document.getElementById('star-rating');
    let currentRating = 5;

    if (starContainer) {
        const stars = starContainer.querySelectorAll('i');
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const val = parseInt(star.getAttribute('data-val') || '5', 10);
                currentRating = val;
                stars.forEach((s, idx) => {
                    if (idx < val) {
                        s.classList.remove('ri-star-line');
                        s.classList.add('ri-star-fill', 'active');
                    } else {
                        s.classList.remove('ri-star-fill', 'active');
                    }
                });
            });
        });
    }

    const form = document.getElementById('feedback-form') || document.querySelector('.feedback-input-box');
    let lastSubmitTime = 0;

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // 1. Anti-bot Honeypot check
            const hp = form.querySelector('#feedback-hp');
            if (hp && hp.value.trim() !== '') {
                // Bot detected: drop silently
                return;
            }

            // 2. Client-side Rate Limiting (Cooldown 8s)
            const now = Date.now();
            if (now - lastSubmitTime < 8000) {
                showToast('Vui lòng đợi một lát trước khi gửi tiếp!', 'ri-time-line');
                return;
            }

            // 3. Input Validation & HTML Sanitization
            const input = form.querySelector('.feedback-input-line');
            const rawContent = input?.value || '';
            const cleanContent = rawContent.replace(/<[^>]*>/g, '').trim();

            if (cleanContent.length < 4) {
                showToast('Ý kiến đóng góp quá ngắn (tối thiểu 4 ký tự)!', 'ri-alert-line');
                input?.focus();
                return;
            }

            if (cleanContent.length > 500) {
                showToast('Ý kiến đóng góp vượt quá 500 ký tự!', 'ri-alert-line');
                return;
            }

            lastSubmitTime = now;
            showToast(`Cảm ơn bạn đã gửi đánh giá (${currentRating} sao)!`, 'ri-heart-fill');
            if (input) input.value = '';
        });
    }
}

