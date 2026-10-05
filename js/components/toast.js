// js/components/toast.js
/**
 * Toast notification component
 */
export function showToast(message, icon = 'ri-checkbox-circle-fill', duration = 3200) {
    let toast = document.getElementById('site-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'site-toast';
        toast.className = 'site-toast';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="${icon}"></i> <span>${message}</span>`;
    toast.classList.add('show');
    clearTimeout(toast.timeoutId);
    toast.timeoutId = setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}
