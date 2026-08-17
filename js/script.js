function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('active');
}

document.querySelectorAll('.card-img').forEach(card => {
  let images = card.querySelectorAll('img');
  let index = 0;
  let interval;

  images[0].classList.add('active');

  card.addEventListener('mouseenter', () => {
    interval = setInterval(() => {
      images[index].classList.remove('active');
      index = (index + 1) % images.length;
      images[index].classList.add('active');
    }, 1000);
  });

  card.addEventListener('mouseleave', () => {
    clearInterval(interval);
    images.forEach(img => img.classList.remove('active'));
    images[0].classList.add('active');
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

  function saveCartToStorage() {
    const items = [...cartItemsWrap.querySelectorAll('.cart-item')].map(item => ({
      id: item.dataset.id,
      name: item.dataset.name,
      price: Number(item.dataset.price),
      img: item.dataset.img,
      qty: Number(item.querySelector('.cart-item-qty')?.textContent || 1)
    }));
    localStorage.setItem('cart', JSON.stringify(items));
  }

  function buildItemHTML(id, name, price, img, qty) {
    return `
      <div class="cart-item" data-id="${id}" data-name="${name}" data-price="${price}" data-img="${img}">
        <img src="${img}" alt="${name}">
        <div class="cart-item-info">
          <p class="cart-item-name">${name}</p>
          <span class="cart-item-qty">${qty}</span>
          <span class="cart-item-price">${formatRp(price * qty)}</span>
        </div>
        <button class="cart-item-remove">&times;</button>
      </div>
    `;
  }

  function loadCartFromStorage() {
    const saved = JSON.parse(localStorage.getItem('cart')) || [];
    cartItemsWrap.innerHTML = '';
    saved.forEach(item => {
      cartItemsWrap.insertAdjacentHTML('beforeend', buildItemHTML(item.id, item.name, item.price, item.img, item.qty));
    });
    bindRemoveButtons();
    updateCart();
  }

  function addToCart(id, name, price, img) {
    let existing = cartItemsWrap.querySelector(`.cart-item[data-id="${id}"]`);

    if (existing) {
      let qtyEl = existing.querySelector('.cart-item-qty');
      let priceEl = existing.querySelector('.cart-item-price');
      let qty = Number(qtyEl.textContent) + 1;
      qtyEl.textContent = qty;
      priceEl.textContent = formatRp(price * qty);
    } else {
      cartItemsWrap.insertAdjacentHTML('beforeend', buildItemHTML(id, name, price, img, 1));
    }

    bindRemoveButtons();
    updateCart();
    saveCartToStorage();
  }

  function updateCart() {
    if (!cartItemsWrap) return;

    const items = cartItemsWrap.querySelectorAll('.cart-item');
    let total = 0;
    let totalQty = 0;

    items.forEach(item => {
      const qty = Number(item.querySelector('.cart-item-qty')?.textContent || 1);
      const price = Number(item.dataset.price || 0);
      total += price * qty;
      totalQty += qty;
    });

    if (cartCountBadge) {
      cartCountBadge.textContent = totalQty;
      cartCountBadge.style.display = totalQty === 0 ? 'none' : 'flex';
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
      btn.removeEventListener('click', btn._removeHandler);
      btn._removeHandler = function () {
        this.closest('.cart-item').remove();
        updateCart();
        saveCartToStorage();
      };
      btn.addEventListener('click', btn._removeHandler);
    });
  }

  // Sirf ye teen events panel kholte hain
  cartToggle.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  // ---------- ADD TO CART BUTTONS (panel NAHI khulega) ----------
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const id    = this.dataset.id;
      const name  = this.dataset.name;
      const price = Number(this.dataset.price);
      const img   = this.dataset.img;

      addToCart(id, name, price, img);

      // Panel open NAHI hoga — sirf badge par pulse animation
      if (cartCountBadge) {
        cartCountBadge.classList.add('pulse');
        setTimeout(() => cartCountBadge.classList.remove('pulse'), 400);
      }
    });
  });

  loadCartFromStorage();
}