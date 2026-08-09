function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('active');
}
document.querySelectorAll('.card-img').forEach(card => {
  let images = card.querySelectorAll('img');
  let index = 0;
  let interval;

  // Default image active
  images[0].classList.add('active');

  card.addEventListener('mouseenter', () => {
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
  });
});
