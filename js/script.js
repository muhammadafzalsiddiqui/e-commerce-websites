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

const cartToggle = document.getElementById('cartToggle');
const cartClose = document.getElementById('cartClose');
const cartOverlay = document.getElementById('cartOverlay');
const cartPanel = document.getElementById('cartPanel');
const cartItemsWrap = document.getElementById('cartItemsWrap');
const cartCountBadge = document.getElementById('cartCountBadge');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartSubtotalValue = document.getElementById('cartSubtotalValue');
const cartEmpty = document.getElementById('cartEmpty');

if (cartToggle && cartPanel && cartOverlay) {
  function openCart() {
    cartPanel.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartPanel.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function formatRp(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
  }

  function updateCart() {
    if (!cartItemsWrap) return;

    const items = cartItemsWrap.querySelectorAll('.cart-item');
    let total = 0;
    items.forEach(item => { total += Number(item.dataset.price || 0); });

    if (cartCountBadge) {
      cartCountBadge.textContent = items.length;
      cartCountBadge.style.display = items.length === 0 ? 'none' : 'flex';
    }

    if (cartSubtotalValue) {
      cartSubtotalValue.textContent = formatRp(total);
    }

    if (cartEmpty && cartSubtotal) {
      if (items.length === 0) {
        cartEmpty.style.display = 'block';
        cartSubtotal.style.display = 'none';
      } else {
        cartEmpty.style.display = 'none';
        cartSubtotal.style.display = 'flex';
      }
    }
  }

  function bindRemoveButtons() {
    if (!cartItemsWrap) return;

    cartItemsWrap.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', function () {
        this.closest('.cart-item').remove();
        updateCart();
      });
    });
  }

  cartToggle.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  bindRemoveButtons();
  updateCart();
}