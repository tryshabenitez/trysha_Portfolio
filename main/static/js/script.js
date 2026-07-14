function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

function toggleMobileMenu() {
    document.getElementById('mobileMenuPopup').classList.toggle('active');
    document.getElementById('mobileMenuOverlay').classList.toggle('active');
}

function closeMobileMenu() {
    document.getElementById('mobileMenuPopup').classList.remove('active');
    document.getElementById('mobileMenuOverlay').classList.remove('active');
}

function setActiveNav(button) {
    // Clear active from ALL nav buttons (desktop + mobile)
    document.querySelectorAll('.hero-nav button, .mobile-menu-popup button').forEach(btn => {
        btn.classList.remove('active');
    });

    // Find the index of the clicked button
    const allDesktop = document.querySelectorAll('.hero-nav button');
    const allMobile  = document.querySelectorAll('.mobile-menu-popup button');

    let index = -1;
    allDesktop.forEach((btn, i) => { if (btn === button) index = i; });
    allMobile.forEach((btn, i)  => { if (btn === button) index = i; });

    if (index !== -1) {
        if (allDesktop[index]) allDesktop[index].classList.add('active');
        if (allMobile[index])  allMobile[index].classList.add('active');
    }
}

/* ---------------------------------------------------
   NEW: Auto-highlight nav on scroll (no click needed)
--------------------------------------------------- */

// Grab section IDs directly from the nav buttons' onclick="scrollToSection('id')"
function getSectionIdsFromNav() {
    const desktopButtons = document.querySelectorAll('.hero-nav button');
    const ids = [];

    desktopButtons.forEach(btn => {
        const onclickAttr = btn.getAttribute('onclick') || '';
        const match = onclickAttr.match(/scrollToSection\(['"]([^'"]+)['"]\)/);
        if (match) ids.push(match[1]);
    });

    return ids;
}

function setActiveNavById(id) {
    const allDesktop = document.querySelectorAll('.hero-nav button');
    const allMobile  = document.querySelectorAll('.mobile-menu-popup button');

    document.querySelectorAll('.hero-nav button, .mobile-menu-popup button').forEach(btn => {
        btn.classList.remove('active');
    });

    allDesktop.forEach((btn, i) => {
        const onclickAttr = btn.getAttribute('onclick') || '';
        if (onclickAttr.includes(`'${id}'`)) {
            btn.classList.add('active');
            if (allMobile[i]) allMobile[i].classList.add('active');
        }
    });
}

function initScrollSpy() {
    const sectionIds = getSectionIdsFromNav();
    const sections = sectionIds
        .map(id => document.getElementById(id))
        .filter(Boolean);

    if (sections.length === 0) {
        console.warn('ScrollSpy: no matching sections found. Check that data-section values match section IDs.');
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        // Ignore observer updates while we're pinned to the very top —
        // the top-of-page listener below owns HOME in that case.
        if (window.scrollY < 50) return;

        let mostVisible = null;
        let maxRatio = 0;

        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
                maxRatio = entry.intersectionRatio;
                mostVisible = entry.target;
            }
        });

        if (mostVisible) {
            setActiveNavById(mostVisible.id);
        }
    }, {
        root: null,
        rootMargin: '-40% 0px -40% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1]
    });

    sections.forEach(section => observer.observe(section));

    // Safety net: force HOME active whenever we're at/near the top of the page
    window.addEventListener('scroll', () => {
        if (window.scrollY < 50) {
            setActiveNavById('home');
        }
    });
}

// Run once the DOM is ready (handles scripts loaded late too)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollSpy);
} else {
    initScrollSpy();
}

// Run once the DOM is ready
document.addEventListener('DOMContentLoaded', initScrollSpy);