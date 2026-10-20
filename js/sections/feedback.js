// js/sections/feedback.js
import { showToast } from '../components/toast.js';
import { SITE_CONFIG } from '../constants/landing-data.js';

/**
 * Lead Collection Form & Google Form Integration
 */
export function initFeedback() {
    const form = document.getElementById('lead-form');
    if (!form) return;

    const submitBtn = document.getElementById('btn-lead-submit');
    const successScreen = document.getElementById('feedback-success');
    const resetBtn = document.getElementById('btn-lead-reset');

    const actionUrl = SITE_CONFIG?.googleFormActionUrl || 'https://docs.google.com/forms/d/e/1FAIpQLSeqkJsPaU2bTmzwuLELj2ygbJLBsfN45js1uvwOmDDF7XEEDQ/formResponse';
    const pageSource = SITE_CONFIG?.pageSource || 'Landing Page Ẩm Thực Biên Hòa';

    // Đảm bảo trường nguồn trang luôn được gán giá trị mặc định
    const sourceInput = form.querySelector('input[name="entry.925381880"]');
    if (sourceInput) {
        sourceInput.value = pageSource;
    }

    // Xử lý nút "Gửi yêu cầu mới" sau khi gửi thành công
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            form.reset();
            if (sourceInput) {
                sourceInput.value = pageSource;
            }
            form.style.display = '';
            if (successScreen) {
                successScreen.style.display = 'none';
            }
        });
    }

    let isSubmitting = false;
    let lastSubmitTime = 0;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        // 1. Anti-spam Honeypot Check (Filled only by spam bots)
        const hp = form.querySelector('input[name="website"]');
        if (hp && hp.value.trim() !== '') {
            showToast('Đang xử lý thông tin...', 'ri-loader-4-line');
            form.reset();
            return;
        }

        // 2. Client-side Rate Limiting (Cooldown 6 seconds)
        const now = Date.now();
        if (now - lastSubmitTime < 6000) {
            showToast('Vui lòng đợi vài giây trước khi gửi tiếp!', 'ri-time-line');
            return;
        }

        // 3. Extract and Clean Form Values
        const fullName = (form.querySelector('input[name="entry.118746383"]')?.value || '').trim();
        const rawPhone = (form.querySelector('input[name="entry.1332627325"]')?.value || '').trim().replace(/\s+/g, '');
        const email = (form.querySelector('input[name="entry.998852611"]')?.value || '').trim().toLowerCase();
        const region = (form.querySelector('input[name="entry.722812867"]')?.value || '').trim();

        // 4. Client-side Validations
        if (fullName.length < 2) {
            showToast('Vui lòng nhập họ và tên (tối thiểu 2 ký tự)!', 'ri-alert-line');
            form.querySelector('input[name="entry.118746383"]')?.focus();
            return;
        }

        const phoneRegex = /^(?:\+?84|0)[35789]\d{8}$/;
        if (!phoneRegex.test(rawPhone)) {
            showToast('Số điện thoại không hợp lệ (Ví dụ: 0912 345 678)!', 'ri-alert-line');
            form.querySelector('input[name="entry.1332627325"]')?.focus();
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(email)) {
            showToast('Vui lòng nhập địa chỉ email hợp lệ!', 'ri-alert-line');
            form.querySelector('input[name="entry.998852611"]')?.focus();
            return;
        }

        // 5. Tự động gán trường "Nguồn trang" (entry.925381880) ngầm trước khi gửi
        if (sourceInput) {
            sourceInput.value = pageSource;
        }

        // 6. Set UI Loading State
        isSubmitting = true;
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add('is-submitting');
            submitBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> <span class="btn-text">Đang gửi dữ liệu...</span>';
        }

        // 7. Chuẩn bị dữ liệu gửi Google Form
        const params = new URLSearchParams();
        params.append('entry.118746383', fullName);
        params.append('entry.1332627325', rawPhone);
        params.append('entry.998852611', email);
        params.append('entry.722812867', region);
        params.append('entry.925381880', pageSource);

        let fetchSuccess = false;

        try {
            // Gửi dữ liệu ngầm bằng fetch (mode: 'no-cors')
            await fetch(actionUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params
            });
            fetchSuccess = true;
        } catch (fetchErr) {
            console.warn('Fetch Google Form failed, activating hidden iframe fallback:', fetchErr);
        }

        // Fallback: nếu fetch gặp lỗi (vd do mạng, CSP, ad-blocker), gửi qua hidden iframe không reload trang
        if (!fetchSuccess) {
            try {
                let iframe = document.getElementById('gform-hidden-iframe');
                if (!iframe) {
                    iframe = document.createElement('iframe');
                    iframe.id = 'gform-hidden-iframe';
                    iframe.name = 'gform-hidden-iframe';
                    iframe.style.display = 'none';
                    document.body.appendChild(iframe);
                }
                form.target = 'gform-hidden-iframe';
                form.action = actionUrl;
                form.method = 'POST';
                HTMLFormElement.prototype.submit.call(form);
            } catch (iframeErr) {
                console.error('Fallback iframe submission failed:', iframeErr);
            }
        }

        lastSubmitTime = Date.now();

        // 8. Chuyển sang màn hình thông báo thành công
        form.style.display = 'none';
        if (successScreen) {
            successScreen.style.display = 'block';
        }

        showToast('Đã gửi thông tin thành công! Ban tư vấn sẽ liên hệ sớm nhất.', 'ri-checkbox-circle-fill');

        isSubmitting = false;
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('is-submitting');
            submitBtn.innerHTML = '<span class="btn-text">GỬI THÔNG TIN LIÊN HỆ</span> <i class="ri-send-plane-fill"></i>';
        }
    });
}
