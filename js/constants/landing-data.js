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
    googleFormActionUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeqkJsPaU2bTmzwuLELj2ygbJLBsfN45js1uvwOmDDF7XEEDQ/formResponse',
    pageSource: 'Landing Page Ẩm Thực Biên Hòa',
    googleFormEntries: {
        fullName: 'entry.118746383',
        phone: 'entry.1332627325',
        email: 'entry.998852611',
        region: 'entry.722812867',
        source: 'entry.925381880'
    }
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
