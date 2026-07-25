// Scroll-triggered reveal for the bento tiles using Intersection Observer
const revealCards = document.querySelectorAll('.bento-item');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target); // reveal once, don't re-trigger on scroll-back
    }
  });
}, {
  threshold: 0.2,
  rootMargin: '0px 0px -60px 0px'
});

revealCards.forEach(card => observer.observe(card));