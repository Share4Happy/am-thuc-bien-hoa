# Ẩm Thực Biên Hòa - Landing Page

- **Tên miền chính thức:** [https://amthucbienhoa.share4happy.com/](https://amthucbienhoa.share4happy.com/)
- **API Nguồn:** [https://share4happy.com/](https://share4happy.com/)
- **Mô tả:** Trang đích (Landing Page) giới thiệu ẩm thực, đặc sản và cẩm nang quán ngon thành phố Biên Hòa, tỉnh Đồng Nai. Được tối ưu tốc độ tải trang, Responsive đa thiết bị, chuẩn SEO và bảo mật đa tầng.

---

## 📁 Cấu Trúc Thư Mục Chuẩn

```
am-thuc-bien-hoa/
├── index.html                 ← Trang duy nhất, ghép tất cả section vào (file đã build)
│
├── sections/                  ← HTML từng section (nguồn, để tái sử dụng / sửa nhanh)
│   ├── header.html            ← Thanh điều hướng (Navigation Bar)
│   ├── hero.html              ← Banner giới thiệu chính
│   ├── explore.html           ← "Đến Biên Hòa ăn gì?" (4 danh mục)
│   ├── streetfood.html        ← Ẩm thực đường phố & Carousel Showcase
│   ├── spaces.html            ← Không gian thành phố
│   ├── restaurants.html       ← Quán ăn địa phương nổi tiếng & Panorama
│   ├── specialties.html       ← Đặc sản Biên Hòa (Bưởi, Mít, Rượu bưởi, Canh chua)
│   ├── story.html             ← Hành trình kể chuyện ẩm thực
│   ├── news.html              ← Tin tức ẩm thực (tích hợp WordPress REST API)
│   ├── reviews.html           ← Đánh giá từ thực khách
│   ├── feedback.html          ← Form gửi đánh giá & bình chọn sao
│   └── footer.html            ← Chân trang & nút hotline nổi
│
├── components/                ← HTML component dùng lại được
│   ├── button.html            ← Các nút CTA, Pill button, Hotline button
│   ├── card.html              ← Card danh mục, món ăn, quán ăn, review
│   └── toast.html             ← Thông báo Toast nổi
│
├── css/
│   ├── main.css               ← @import dồn tất cả, index.html chỉ link 1 file này
│   ├── variables.css          ← Màu, font, spacing, breakpoint (ĐỔI MÀU Ở ĐÂY)
│   ├── reset.css              ← Reset trình duyệt
│   ├── layout.css             ← Container, grid, section spacing
│   ├── components.css         ← Style cho components/
│   ├── responsive.css         ← Các tầng Breakpoints (Laptop, Tablet, Mobile)
│   └── sections/              ← 1 file CSS cho mỗi section, cùng tên với sections/
│       ├── header.css         hero.css         explore.css
│       ├── streetfood.css     spaces.css       restaurants.css
│       ├── specialties.css    story.css        news.css
│       ├── reviews.css        feedback.css     footer.css
│
├── js/
│   ├── app.js                 ← BUNDLE chạy thật (index.html chỉ load file này - IIFE chạy cả file:// lẫn http://)
│   ├── main.js                ← Entry point dạng ES module (bản tham chiếu kiến trúc)
│   ├── constants/
│   │   └── landing-data.js    ← Dữ liệu dùng chung: metadata, link mạng xã hội, nav
│   ├── components/
│   │   └── toast.js           ← Logic hiển thị thông báo Toast
│   └── sections/              ← 1 file JS cho mỗi section, cùng tên với sections/
│       ├── header.js          hero.js          explore.js
│       ├── streetfood.js      spaces.js        restaurants.js
│       ├── specialties.js     story.js         news.js
│       ├── reviews.js         feedback.js      footer.js
│
├── asset/
│   ├── images/                ← Logo, hero, ảnh món ăn, đặc sản, không gian
│   └── icons/                 ← Favicon, icon định dạng SVG/PNG
│
├── data/
│   ├── content.json           ← Dữ liệu văn bản tĩnh
│   └── posts.json             ← Dữ liệu bài viết dự phòng khi API WordPress gặp sự cố / CORS
│
├── _headers                   ← Security headers cho Netlify / Cloudflare Pages
├── vercel.json                ← Security headers + cache cho Vercel
├── robots.txt                 ← Cấu hình bot tìm kiếm thu thập dữ liệu
├── sitemap.xml                ← Sơ đồ website chuẩn Sitemaps.org (kèm Google Image)
├── .gitignore
├── LICENSE                    ← Giấy phép MIT
└── README.md
```

---

## 📌 Quy Ước Khi Phát Triển & Tái Cấu Trúc

| Quy tắc | Hướng dẫn thực hiện |
| :--- | :--- |
| **Đặt tên file theo section** | `sections/<name>.html` $\longleftrightarrow$ `css/sections/<name>.css` $\longleftrightarrow$ `js/sections/<name>.js` |
| **Thêm section mới** | Tạo đủ 3 file cùng tên trong 3 thư mục trên + thêm 1 dòng `@import` trong `css/main.css` |
| **File chạy thực tế** | `index.html` tự chứa toàn bộ markup, `css/main.css` là CSS duy nhất, `js/app.js` là JS duy nhất |
| **js/app.js độc lập** | Đóng gói dạng IIFE không dùng `import`/`export` $\rightarrow$ Chạy mượt mà trên cả `file://` cục bộ lẫn máy chủ `http://` / `https://` |
| **Đồng bộ song song** | Khi thay đổi logic JS, cập nhật song song cả file mô-đun trong `js/sections/` và `js/app.js` |

---

## 🚀 Hướng Dẫn Nhân Bản Hoặc Tùy Biến Cho Landing Page Mới

1. **Đổi thông số & bảng màu thương hiệu:**
   - Mở `css/variables.css` và đổi mã màu tại `:root`:
     - `--color-gold`: Màu điểm nhấn chính (mặc định: `#FFB800`)
     - `--color-dark`: Màu nền tối chủ đạo (mặc định: `#261A15`)
     - `--bg-page`: Màu nền trang (mặc định: `#FAF7F2`)
   - Toàn bộ giao diện trang sẽ tự động đổi theo bảng màu mới.

2. **Cập nhật nội dung trong `index.html`:**
   - Sửa nội dung theo thứ tự: Header $\rightarrow$ Hero $\rightarrow$ Món ngon $\rightarrow$ Quán ăn $\rightarrow$ Đặc sản $\rightarrow$ Tin tức $\rightarrow$ Đánh giá $\rightarrow$ Form phản hồi $\rightarrow$ Footer.

3. **Cấu hình API & Liên hệ trong `js/app.js`:**
   - Cập nhật URL WordPress REST API hoặc nguồn tin tức: `wpNewsApiUrl`.
   - Cập nhật số điện thoại Hotline và email trong `js/constants/landing-data.js` và `index.html`.

4. **Hình ảnh & Biểu tượng:**
   - Thay ảnh trong `asset/images/` (khuyến khích định dạng `.webp` hoặc `.jpg` nhẹ, tên file dạng `kebab-case`).

---

## 🌐 Triển Khai (Deployment)

- **Vercel**: Đã có cấu hình sẵn trong `vercel.json` (bật cache tối ưu cho `asset/`, `css/`, `js/` và cấu hình HTTP Security Headers).
- **Netlify / Cloudflare Pages**: Đã có tệp `_headers` tích hợp sẵn Content-Security-Policy (CSP) cho phép Google Fonts, RemixIcon và REST API của Share4Happy.
