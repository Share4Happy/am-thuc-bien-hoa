// js/sections/news.js
/**
 * News section (WordPress REST API fetcher with fallback and draggable scroll track)
 */
export function initNews() {
    const newsSection = document.getElementById('news');
    const container = document.getElementById('news-content-container');
    const footerAction = document.getElementById('news-footer-action');
    if (!newsSection || !container) return;

    const categoryId = newsSection.getAttribute('data-category-id') || '207';
    const apiUrl = `https://share4happy.com/wp-json/wp/v2/posts?categories=${categoryId}&_embed&per_page=5`;
    const wpHomeUrl = 'https://share4happy.com/';

    let isFetched = false;

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

    function escapeHtml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function sanitizeUrl(url, fallback = wpHomeUrl) {
        if (!url || typeof url !== 'string') return fallback;
        const trimmed = url.trim();
        if (/^(https?:\/\/|\/|#)/i.test(trimmed) && !/^(javascript|data|vbscript):/i.test(trimmed)) {
            return trimmed;
        }
        return fallback;
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
                <a href="${wpHomeUrl}" target="_blank" rel="noopener noreferrer" class="btn-pill-dark">
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
                    <a href="${wpHomeUrl}" target="_blank" rel="noopener noreferrer" class="btn-pill-dark">
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
            const localRes = await fetch('data/posts.json');
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
