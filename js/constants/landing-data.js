// js/constants/landing-data.js
/**
 * Shared metadata, navigation links, and configuration for Ẩm Thực Biên Hòa.
 */
export const SITE_CONFIG = {
    brandName: 'Ẩm Thực Biên Hòa',
    slogan: 'Nếm hương vị - Cảm nhận cả thành phố',
    description: 'Khám phá những món ngon, đặc sản và địa điểm ăn uống, mang đậm hương vị Biên Hòa.',
    hotline: '+(84) 368-006-482',
    rawPhone: '0368006482',
    email: 'welcome@amthucbienhoa.com',
    address: 'Huỳnh Văn Nghệ, Thành phố Đồng Nai - Biên Hòa',
    canonicalUrl: 'https://amthucbienhoa.share4happy.com/',
    wpHomeUrl: 'https://share4happy.com/',
    wpNewsApiUrl: 'https://share4happy.com/wp-json/wp/v2/posts?categories=207&_embed&per_page=5',
    localFallbackApiUrl: 'data/posts.json',
    leadEndpoint: 'https://script.google.com/macros/s/AKfycbwSjUh2fPMloUnloNes4bxF7pEhEFy9nHGjktMOEHFAtRnnzVcpFBkClM4PO0426t1z/exec'
};

export const NAV_LINKS = [
    { title: 'Trang chủ', href: '#hero', active: true },
    { title: 'Món ngon', href: '#streetfood' },
    { title: 'Địa điểm', href: '#restaurants' },
    { title: 'Hành trình', href: '#story' },
    { title: 'Tin tức', href: '#news' }
];

export const SOCIAL_LINKS = {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    tiktok: 'https://tiktok.com'
};
