// js/sections/feedback.js
import { showToast } from '../components/toast.js';
import { SITE_CONFIG } from '../constants/landing-data.js';

/**
 * Lead Collection Form & Google Sheets Integration
 */
export function initFeedback() {
    const form = document.getElementById('lead-form');
    if (!form) return;

    const submitBtn = document.getElementById('btn-lead-submit');
    const endpoint = SITE_CONFIG.leadEndpoint || 'https://script.google.com/macros/s/AKfycbwSjUh2fPMloUnloNes4bxF7pEhEFy9nHGjktMOEHFAtRnnzVcpFBkClM4PO0426t1z/exec';
    let isSubmitting = false;
    let lastSubmitTime = 0;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        // 1. Anti-spam Honeypot Check (Filled only by spam bots)
        const hp = form.querySelector('input[name="website"]');
        if (hp && hp.value.trim() !== '') {
            // Silently drop bot submission
            showToast('Đang xử lý thông tin...', 'ri-loader-4-line');
            form.reset();
            return;
        }

        // 2. Client-side Rate Limiting (Cooldown 8 seconds)
        const now = Date.now();
        if (now - lastSubmitTime < 8000) {
            showToast('Vui lòng đợi vài giây trước khi gửi tiếp!', 'ri-time-line');
            return;
        }

        // 3. Extract and Clean Form Values
        const fullName = (form.querySelector('input[name="fullName"]')?.value || '').trim();
        const rawPhone = (form.querySelector('input[name="phone"]')?.value || '').trim().replace(/\s+/g, '');
        const email = (form.querySelector('input[name="email"]')?.value || '').trim().toLowerCase();
        const region = (form.querySelector('input[name="region"]')?.value || '').trim();
        const address = (form.querySelector('textarea[name="address"]')?.value || '').trim();
        const consent = form.querySelector('input[name="consent"]')?.checked === true;

        // 4. Client-side Validations
        if (fullName.length < 2) {
            showToast('Vui lòng nhập họ và tên (tối thiểu 2 ký tự)!', 'ri-alert-line');
            form.querySelector('input[name="fullName"]')?.focus();
            return;
        }

        const phoneRegex = /^(?:\+?84|0)[35789]\d{8}$/;
        if (!phoneRegex.test(rawPhone)) {
            showToast('Số điện thoại không hợp lệ (Ví dụ: 0912345678)!', 'ri-alert-line');
            form.querySelector('input[name="phone"]')?.focus();
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(email)) {
            showToast('Vui lòng nhập địa chỉ email hợp lệ!', 'ri-alert-line');
            form.querySelector('input[name="email"]')?.focus();
            return;
        }

        if (region.length < 2) {
            showToast('Vui lòng nhập hoặc chọn khu vực/phường tại Biên Hòa!', 'ri-alert-line');
            form.querySelector('input[name="region"]')?.focus();
            return;
        }

        if (!consent) {
            showToast('Vui lòng tích đồng ý cung cấp thông tin để tiếp tục!', 'ri-checkbox-blank-line');
            return;
        }

        // 5. Build Payload
        const payload = {
            fullName: fullName.slice(0, 60),
            phone: rawPhone.slice(0, 20),
            email: email.slice(0, 100),
            region: region.slice(0, 60),
            address: address.slice(0, 200),
            consent: true,
            source: 'Website Ẩm Thực Biên Hòa',
            targetSheet: 'Ẩm thực Biên Hoà'
        };

        // 6. Set UI Loading State
        isSubmitting = true;
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add('is-submitting');
            submitBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> <span class="btn-text">Đang gửi dữ liệu...</span>';
        }

        try {
            // Send as text/plain to avoid CORS preflight OPTIONS request
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8'
                },
                body: JSON.stringify(payload)
            });

            lastSubmitTime = Date.now();

            let data = {};
            try {
                data = await response.json();
            } catch (jsonErr) {
                data = { ok: response.ok };
            }

            if (data.duplicate) {
                showToast('Số điện thoại này đã gửi yêu cầu gần đây. Chúng tôi sẽ liên hệ bạn sớm!', 'ri-information-line');
                form.reset();
            } else if (data.ok) {
                showToast('Đăng ký thành công! Đội ngũ Ẩm Thực Biên Hòa sẽ liên hệ bạn sớm nhất.', 'ri-checkbox-circle-fill');
                form.reset();
            } else {
                showToast(data.message || 'Không thể gửi dữ liệu lúc này. Vui lòng gọi Hotline để được hỗ trợ ngay!', 'ri-error-warning-line');
            }
        } catch (netErr) {
            console.warn('Google Sheets submission notice:', netErr);
            // Fallback confirmation: Google Apps Script sometimes completes but triggers opaque response
            showToast('Thông tin đã được ghi nhận! Chúng tôi sẽ sớm liên hệ qua SĐT của bạn.', 'ri-checkbox-circle-fill');
            form.reset();
        } finally {
            isSubmitting = false;
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.classList.remove('is-submitting');
                submitBtn.innerHTML = '<span class="btn-text">GỬI THÔNG TIN LIÊN HỆ</span> <i class="ri-send-plane-fill"></i>';
            }
        }
    });
}
