// js/app.js
/**
 * ============================================================================
 * ẨM THỰC BIÊN HÒA - PRODUCTION CLIENT BUNDLE
 * Standalone IIFE executable bundle (works seamlessly on file://, http://, https://)
 * ============================================================================
 */
(function () {
    'use strict';

    // ------------------------------------------------------------------------
    // Configuration & Shared Constants
    // ------------------------------------------------------------------------
    const CONFIG = {
        wpHomeUrl: 'https://share4happy.com/',
        wpNewsApiUrl: 'https://share4happy.com/wp-json/wp/v2/posts?categories=207&_embed&per_page=5',
        localFallbackApiUrl: 'data/posts.json',
        googleFormActionUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeqkJsPaU2bTmzwuLELj2ygbJLBsfN45js1uvwOmDDF7XEEDQ/formResponse',
        pageSource: 'Landing Page Ẩm Thực Biên Hòa'
    };

    // ------------------------------------------------------------------------
    // UI Component: Toast Notification
    // ------------------------------------------------------------------------
    function showToast(message, icon = 'ri-checkbox-circle-fill', duration = 3200) {
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

    // ------------------------------------------------------------------------
    // Section 1: Header Navigation (Mobile Menu, Sticky Header, Scroll Spy)
    // ------------------------------------------------------------------------
    function initHeader() {
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

        window.addEventListener('scroll', highlightNav, { passive: true });
    }

    // ------------------------------------------------------------------------
    // Section 2: Smooth Scrolling for Anchor Links
    // ------------------------------------------------------------------------
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId && targetId !== '#') {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    }

    // ------------------------------------------------------------------------
    // Section 3: Street Food Showcase Slider
    // ------------------------------------------------------------------------
    function initStreetFoodSlider() {
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

    // ------------------------------------------------------------------------
    // Section 4: News WordPress API & Draggable Track
    // ------------------------------------------------------------------------
    function initNewsSection() {
        const newsSection = document.getElementById('news');
        const container = document.getElementById('news-content-container');
        const footerAction = document.getElementById('news-footer-action');
        if (!newsSection || !container) return;

        const categoryId = newsSection.getAttribute('data-category-id') || '207';
        const apiUrl = `https://share4happy.com/wp-json/wp/v2/posts?categories=${categoryId}&_embed&per_page=5`;
        let isFetched = false;

        function escapeHtml(str) {
            return String(str || '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        function sanitizeUrl(url, fallback = CONFIG.wpHomeUrl) {
            if (!url || typeof url !== 'string') return fallback;
            const trimmed = url.trim();
            if (/^(https?:\/\/|\/|#)/i.test(trimmed) && !/^(javascript|data|vbscript):/i.test(trimmed)) {
                return trimmed;
            }
            return fallback;
        }

        function decodeHtml(html) {
            const txt = document.createElement('textarea');
            txt.innerHTML = html || '';
            return txt.value;
        }

        function stripHtml(html) {
            const tmp = document.createElement('div');
            tmp.innerHTML = html || '';
            return tmp.textContent || tmp.innerText || '';
        }

        function formatDate(dateStr) {
            if (!dateStr) return '';
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
        }

        function renderPosts(posts) {
            let html = `
                <div class="news-scroll-wrapper">
                    <button class="news-scroll-arrow prev" id="news-prev-btn" aria-label="Bài trước">
                        <i class="ri-arrow-left-s-line"></i>
                    </button>
                    <div class="news-scroll-track" id="news-scroll-track">
            `;
            posts.forEach(post => {
                const plainTitle = stripHtml(post.title?.rendered || 'Bài viết không có tiêu đề');
                const safeTitle = escapeHtml(plainTitle);
                const safeLink = escapeHtml(sanitizeUrl(post.link));
                const safeDate = escapeHtml(formatDate(post.date));
                const rawExcerpt = stripHtml(post.excerpt?.rendered || '');
                const excerpt = escapeHtml(rawExcerpt.length > 110 ? rawExcerpt.substring(0, 107) + '...' : (rawExcerpt || 'Xem chi tiết bài viết hấp dẫn trên chuyên trang Share4Happy...'));

                let imageUrl = '';
                const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
                if (featuredMedia) {
                    imageUrl = featuredMedia.media_details?.sizes?.medium_large?.source_url ||
                               featuredMedia.media_details?.sizes?.medium?.source_url ||
                               featuredMedia.source_url || '';
                }
                const safeImageUrl = escapeHtml(sanitizeUrl(imageUrl || 'asset/images/categories/local_soup.jpg'));

                html += `
                    <article class="news-card">
                        <div class="news-card-img-box">
                            <span class="news-card-badge">Bài Viết Mới</span>
                            <img src="${safeImageUrl}" alt="${safeTitle}" loading="lazy" decoding="async">
                        </div>
                        <div class="news-card-body">
                            <div class="news-card-date"><i class="ri-calendar-line"></i> ${safeDate}</div>
                            <h3 class="news-card-title">
                                <a href="${safeLink}" target="_blank" rel="noopener noreferrer">${safeTitle}</a>
                            </h3>
                            <p class="news-card-excerpt">${excerpt}</p>
                            <a href="${safeLink}" target="_blank" rel="noopener noreferrer" class="news-card-link">
                                Đọc tiếp <i class="ri-arrow-right-line"></i>
                            </a>
                        </div>
                    </article>
                `;
            });
            html += `
                    </div>
                    <button class="news-scroll-arrow next" id="news-next-btn" aria-label="Bài sau">
                        <i class="ri-arrow-right-s-line"></i>
                    </button>
                </div>
            `;
            container.innerHTML = html;

            setupNewsScroll();

            if (footerAction) {
                footerAction.style.display = 'flex';
                footerAction.innerHTML = `
                    <a href="${CONFIG.wpHomeUrl}" target="_blank" rel="noopener noreferrer" class="btn-pill-dark">
                        XEM THÊM TRÊN SHARE4HAPPY <i class="ri-external-link-line"></i>
                    </a>
                `;
            }
        }

        function setupNewsScroll() {
            const track = document.getElementById('news-scroll-track');
            const prevBtn = document.getElementById('news-prev-btn');
            const nextBtn = document.getElementById('news-next-btn');
            if (!track) return;

            const scrollStep = 342;

            function updateArrowStates() {
                if (!prevBtn || !nextBtn) return;
                const maxScrollLeft = track.scrollWidth - track.clientWidth - 5;
                if (track.scrollLeft <= 5) {
                    prevBtn.classList.add('is-disabled');
                } else {
                    prevBtn.classList.remove('is-disabled');
                }

                if (track.scrollLeft >= maxScrollLeft) {
                    nextBtn.classList.add('is-disabled');
                } else {
                    nextBtn.classList.remove('is-disabled');
                }
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    track.scrollBy({ left: -scrollStep, behavior: 'smooth' });
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    track.scrollBy({ left: scrollStep, behavior: 'smooth' });
                });
            }

            track.addEventListener('scroll', updateArrowStates, { passive: true });
            setTimeout(updateArrowStates, 120);

            // Drag to scroll functionality
            let isDown = false;
            let startX = 0;
            let scrollLeftStart = 0;
            let dragged = false;

            track.addEventListener('mousedown', (e) => {
                isDown = true;
                dragged = false;
                track.classList.add('is-dragging');
                startX = e.pageX - track.offsetLeft;
                scrollLeftStart = track.scrollLeft;
            });

            window.addEventListener('mouseup', () => {
                if (!isDown) return;
                isDown = false;
                track.classList.remove('is-dragging');
            });

            track.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                const x = e.pageX - track.offsetLeft;
                const walk = (x - startX) * 1.4;
                if (Math.abs(x - startX) > 6) {
                    dragged = true;
                }
                track.scrollLeft = scrollLeftStart - walk;
            });

            track.addEventListener('click', (e) => {
                if (dragged) {
                    e.preventDefault();
                    dragged = false;
                }
            }, true);
        }

        function renderEmptyState() {
            container.innerHTML = `
                <div class="news-empty-container">
                    <div class="news-empty-icon-circle">
                        <i class="ri-article-line"></i>
                    </div>
                    <h3 class="news-empty-title">Chuyên mục đang chuẩn bị các bài viết mới nhất</h3>
                    <p class="news-empty-desc">
                        Những bài viết trải nghiệm ẩm thực, quán ngon gia truyền và cẩm nang khám phá đang được đội ngũ biên tập hoàn thiện và sẽ xuất hiện sớm nhất tại đây!
                    </p>
                    <div class="news-empty-actions">
                        <a href="${CONFIG.wpHomeUrl}" target="_blank" rel="noopener noreferrer" class="btn-pill-dark">
                            <i class="ri-external-link-line"></i> XEM BÀI VIẾT TRÊN SHARE4HAPPY
                        </a>
                    </div>
                </div>
            `;
            if (footerAction) {
                footerAction.style.display = 'none';
            }
        }

        async function fetchPosts() {
            if (isFetched) return;
            isFetched = true;

            try {
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const posts = await response.json();
                if (Array.isArray(posts) && posts.length > 0) {
                    renderPosts(posts);
                    return;
                }
            } catch (err) {
                console.warn('WP REST API unavailable or CORS blocked. Loading fallback posts:', err.message || err);
            }

            // Fallback: load local posts data
            try {
                const localRes = await fetch(CONFIG.localFallbackApiUrl);
                if (localRes.ok) {
                    const localPosts = await localRes.json();
                    if (Array.isArray(localPosts) && localPosts.length > 0) {
                        renderPosts(localPosts);
                        return;
                    }
                }
            } catch (fallbackErr) {
                console.warn('Fallback posts loading error:', fallbackErr);
            }

            renderEmptyState();
        }

        fetchPosts();
    }

    // ------------------------------------------------------------------------
    // Section 5: Lead Collection Form & Google Form Integration
    // ------------------------------------------------------------------------
    function initFeedbackSection() {
        const form = document.getElementById('lead-form');
        if (!form) return;

        const submitBtn = document.getElementById('btn-lead-submit');
        const successScreen = document.getElementById('feedback-success');
        const resetBtn = document.getElementById('btn-lead-reset');

        const actionUrl = CONFIG.googleFormActionUrl || 'https://docs.google.com/forms/d/e/1FAIpQLSeqkJsPaU2bTmzwuLELj2ygbJLBsfN45js1uvwOmDDF7XEEDQ/formResponse';
        const pageSource = CONFIG.pageSource || 'Landing Page Ẩm Thực Biên Hòa';

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

    // ------------------------------------------------------------------------
    // Section 6: Smart Hotline Link Handler (Prevent Desktop PC Scheme Error)
    // ------------------------------------------------------------------------
    function initPhoneLinkHandler() {
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        document.querySelectorAll('a[href^="tel:"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const phone = link.getAttribute('href').replace('tel:', '').trim();
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

    // ------------------------------------------------------------------------
    // Master Initialization
    // ------------------------------------------------------------------------
    document.addEventListener('DOMContentLoaded', () => {
        initHeader();
        initSmoothScroll();
        initStreetFoodSlider();
        initNewsSection();
        initFeedbackSection();
        initPhoneLinkHandler();
    });

})();
