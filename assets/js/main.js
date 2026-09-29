// assets/js/main.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
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

    // 2. Sticky Header on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            nav?.classList.add('nav-scrolled');
        } else {
            nav?.classList.remove('nav-scrolled');
        }
    });

    // 3. Active Link on Scroll (Spy)
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

    window.addEventListener('scroll', highlightNav);

    // 4. Carousel Buttons (Visual Feedback)
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

    // 5. Interactive Feedback Stars
    const starContainer = document.getElementById('star-rating');
    if (starContainer) {
        const stars = starContainer.querySelectorAll('i');
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const val = parseInt(star.getAttribute('data-val') || '5', 10);
                stars.forEach((s, idx) => {
                    if (idx < val) {
                        s.classList.remove('ri-star-line');
                        s.classList.add('ri-star-fill', 'active');
                    } else {
                        s.classList.remove('ri-star-fill', 'active');
                        s.classList.add('ri-star-line');
                    }
                });
            });
        });
    }

    // 6. Smooth Anchor Link Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 7. WordPress News API Integration (Category 207 - Share4Happy)
    function initNewsSection() {
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

        function renderPosts(posts) {
            let html = `
                <div class="news-scroll-wrapper">
                    <button class="news-scroll-arrow prev" id="news-prev-btn" aria-label="Bài trước">
                        <i class="ri-arrow-left-s-line"></i>
                    </button>
                    <div class="news-scroll-track" id="news-scroll-track">
            `;
            posts.forEach(post => {
                const rawTitle = decodeHtml(post.title?.rendered || 'Bài viết không có tiêu đề');
                const link = post.link || wpHomeUrl;
                const date = formatDate(post.date);
                const rawExcerpt = stripHtml(post.excerpt?.rendered || '');
                const excerpt = rawExcerpt.length > 110 ? rawExcerpt.substring(0, 107) + '...' : (rawExcerpt || 'Xem chi tiết bài viết hấp dẫn trên chuyên trang Share4Happy...');

                let imageUrl = '';
                const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
                if (featuredMedia) {
                    imageUrl = featuredMedia.media_details?.sizes?.medium_large?.source_url ||
                               featuredMedia.media_details?.sizes?.medium?.source_url ||
                               featuredMedia.source_url || '';
                }
                if (!imageUrl) {
                    imageUrl = 'assets/images/categories/local_soup.jpg';
                }

                html += `
                    <article class="news-card">
                        <div class="news-card-img-box">
                            <span class="news-card-badge">Bài Viết Mới</span>
                            <img src="${imageUrl}" alt="${rawTitle.replace(/"/g, '&quot;')}" loading="lazy" decoding="async">
                        </div>
                        <div class="news-card-body">
                            <div class="news-card-date"><i class="ri-calendar-line"></i> ${date}</div>
                            <h3 class="news-card-title">
                                <a href="${link}" target="_blank" rel="noopener noreferrer">${rawTitle}</a>
                            </h3>
                            <p class="news-card-excerpt">${excerpt}</p>
                            <a href="${link}" target="_blank" rel="noopener noreferrer" class="news-card-link">
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

            const scrollStep = 342; // card width + gap

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
                } else {
                    renderEmptyState();
                }
            } catch (err) {
                console.warn('WordPress API info:', err);
                renderEmptyState();
            }
        }

        // Call fetchPosts directly to load content seamlessly
        fetchPosts();
    }

    initNewsSection();
});
