// js/sections/footer.js
import { showToast } from '../components/toast.js';

/**
 * Footer interactions & Smart hotline click handler
 */
export function initFooter() {
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const phone = link.getAttribute('href').replace('tel:', '').trim();
            // On desktop PCs without a phone dialer handler, copy phone number to clipboard & toast
            if (!isMobileDevice) {
                e.preventDefault();
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(phone).then(() => {
                        showToast(`Đã sao chép hotline: ${phone}`);
                    }).catch(() => {
                        showToast(`Hotline liên hệ: ${phone}`);
                    });
                } else {
                    showToast(`Hotline liên hệ: ${phone}`);
                }
            }
        });
    });
}
