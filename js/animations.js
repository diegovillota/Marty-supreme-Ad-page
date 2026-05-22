const revealElements = document.querySelectorAll('.panel, .feature-card, .poster-frame');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15
});

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.95s ease, transform 0.95s ease';
    revealObserver.observe(el);
});

window.addEventListener('load', () => {
    const hero = document.querySelector('.hero-section');
    if (hero) {
        hero.style.opacity = '1';
        hero.style.transform = 'none';
    }
});
