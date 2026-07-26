// Scroll triggered reveal
const revealCards = document.querySelectorAll('.bento-item');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.2,
  rootMargin: '0px 0px -60px 0px'
});

revealCards.forEach(card => observer.observe(card));