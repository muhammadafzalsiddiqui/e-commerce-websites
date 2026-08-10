function toggleMenu() {
  const nav = document.getElementById('navLinks');
  nav.classList.toggle('active');
  const toggle = document.querySelector('.menu-toggle');
  const expanded = nav.classList.contains('active');
  if (toggle) toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
}

// Close mobile menu when a nav link is clicked
document.querySelectorAll('#navLinks a').forEach(a => a.addEventListener('click', () => {
  const nav = document.getElementById('navLinks');
  if (nav.classList.contains('active')) {
    nav.classList.remove('active');
    const toggle = document.querySelector('.menu-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }
}));

// Card image hover cycling
document.querySelectorAll('.card-img').forEach(card => {
  let images = Array.from(card.querySelectorAll('img'));
  let index = 0;
  let interval;

  if (images.length === 0) return;

  // Default image active
  images.forEach((img, i) => img.classList.toggle('active', i === 0));

  card.addEventListener('mouseenter', () => {
    if (images.length <= 1) return;
    interval = setInterval(() => {
      images[index].classList.remove('active');
      index = (index + 1) % images.length;
      images[index].classList.add('active');
    }, 1000); // 1 second delay
  });

  card.addEventListener('mouseleave', () => {
    clearInterval(interval);
    images.forEach(img => img.classList.remove('active'));
    images[0].classList.add('active'); // reset to default
    index = 0;
  });
});
