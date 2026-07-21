let products = [];

const state = {
  cart: [],
  wishlist: new Set(),
  activeCategory: 'Semua',
  search: '',
  theme: localStorage.getItem('project7-theme') || 'light',
  promoCode: ''
};

const productGrid = document.getElementById('productGrid');
const adminProductList = document.getElementById('adminProductList');
const cartButton = document.getElementById('cartButton');
const cartPanel = document.getElementById('cartPanel');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutButton = document.getElementById('checkoutButton');
const checkoutModal = document.getElementById('checkoutModal');
const closeModal = document.getElementById('closeModal');
const searchInput = document.getElementById('searchInput');
const resultsCount = document.getElementById('resultsCount');
const toast = document.getElementById('toast');
const categoryButtons = Array.from(document.querySelectorAll('.chip'));
const themeToggle = document.getElementById('themeToggle');
const detailModal = document.getElementById('detailModal');
const detailContent = document.getElementById('detailContent');
const closeDetailModal = document.getElementById('closeDetailModal');
const promoCodeInput = document.getElementById('promoCode');
const applyPromoButton = document.getElementById('applyPromo');
const checkoutSummary = document.getElementById('checkoutSummary');
const userLoginForm = document.getElementById('userLoginForm');
const adminLoginForm = document.getElementById('adminLoginForm');
const productForm = document.getElementById('productForm');

function formatRupiah(value) {
  return `Rp${value.toLocaleString('id-ID')}`;
}

function getApiUrl(path) {
  if (window.location.protocol === 'file:') {
    return `http://127.0.0.1:8001${path}`;
  }
  return path;
}

function getStoredProducts() {
  try {
    return JSON.parse(localStorage.getItem('project7-products') || 'null') || [];
  } catch (error) {
    return [];
  }
}

function saveStoredProducts(items) {
  localStorage.setItem('project7-products', JSON.stringify(items));
}

function getCartSubtotal() {
  return state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getDiscountAmount() {
  return state.promoCode === '1234' ? getCartSubtotal() * 0.1 : 0;
}

function getFinalTotal() {
  return Math.max(0, getCartSubtotal() - getDiscountAmount());
}

function updateCheckoutSummary() {
  const subtotal = getCartSubtotal();
  const discount = getDiscountAmount();
  const total = getFinalTotal();

  if (state.cart.length === 0) {
    checkoutSummary.textContent = 'Keranjang masih kosong.';
    return;
  }

  if (state.promoCode === '1234') {
    checkoutSummary.textContent = `${formatRupiah(subtotal)} - Diskon 10% = ${formatRupiah(total)}`;
  } else {
    checkoutSummary.textContent = `Subtotal: ${formatRupiah(subtotal)}.`;
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove('show'), 1800);
}

function applyTheme() {
  document.body.classList.toggle('theme-dark', state.theme === 'dark');
  themeToggle.textContent = state.theme === 'dark' ? '☀️' : '🌙';
}

async function loadProducts() {
  const storedProducts = getStoredProducts();
  if (storedProducts.length) {
    products = storedProducts;
    renderProducts();
  }

  try {
    const response = await fetch(getApiUrl('/api/products'));
    if (!response.ok) throw new Error('Gagal mengambil produk');
    const data = await response.json();
    products = data.products || [];
    saveStoredProducts(products);
    renderProducts();
  } catch (error) {
    console.error('Gagal memuat produk:', error);
    if (!storedProducts.length) {
      showToast('Gagal memuat produk dari backend');
    }
  }
}

function renderProducts() {
  const filtered = products.filter((product) => {
    const matchesCategory = state.activeCategory === 'Semua' || product.category === state.activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(state.search.toLowerCase()) || product.description.toLowerCase().includes(state.search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  resultsCount.textContent = `${filtered.length} produk`;
  productGrid.innerHTML = '';

  if (filtered.length === 0) {
    productGrid.innerHTML = '<p class="empty">Tidak ada produk yang cocok.</p>';
    return;
  }

  filtered.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="card-top">
        <span class="badge">${product.badge}</span>
        <button class="wish-btn" data-action="wishlist" data-id="${product.id}">${state.wishlist.has(product.id) ? '💖' : '🤍'}</button>
      </div>
      ${product.image ? `<img class="product-img" src="${product.image}" alt="${product.name}" />` : `<div class="product-image">${product.emoji}</div>`}
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <div class="rating">★ ${product.rating.toFixed(1)}</div>
      <div class="price-row">
        <span class="price">${formatRupiah(product.price)}</span>
        <button class="ghost-btn" data-action="detail" data-id="${product.id}">Lihat detail</button>
      </div>
      <button class="btn primary full" data-action="cart" data-id="${product.id}">Tambah ke keranjang</button>
    `;

    productGrid.appendChild(card);
  });
}

function renderAdminProducts() {
  if (!adminProductList) return;

  adminProductList.innerHTML = '';
  if (!products.length) {
    adminProductList.innerHTML = '<p class="empty">Belum ada produk.</p>';
    return;
  }

  products.forEach((product) => {
    const item = document.createElement('div');
    item.className = 'admin-item';
    item.innerHTML = `
      <div>
        <strong>${product.name}</strong>
        <div>${formatRupiah(product.price)} • ${product.category}</div>
      </div>
      <button class="btn secondary" data-remove-id="${product.id}">Hapus</button>
    `;
    adminProductList.appendChild(item);
  });
}

function renderCart() {
  if (state.cart.length === 0) {
    cartItems.innerHTML = '<p class="empty">Keranjang masih kosong.</p>';
    cartCount.textContent = '0';
    cartTotal.textContent = 'Rp0';
    return;
  }

  const totalItems = state.cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  cartCount.textContent = totalItems;
  cartTotal.textContent = formatRupiah(totalPrice);

  cartItems.innerHTML = state.cart
    .map((item) => `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong>
          <span>${formatRupiah(item.price)} / item</span>
          <div class="qty-controls">
            <button data-action="decrease" data-id="${item.id}">−</button>
            <span>${item.qty}</span>
            <button data-action="increase" data-id="${item.id}">+</button>
          </div>
        </div>
        <div>
          <strong>${formatRupiah(item.price * item.qty)}</strong>
          <button class="icon-button" data-action="remove" data-id="${item.id}">🗑️</button>
        </div>
      </div>
    `)
    .join('');
}

function addToCart(id) {
  const product = products.find((item) => item.id === Number(id));
  if (!product) return;

  const existing = state.cart.find((item) => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ ...product, qty: 1 });
  }

  renderCart();
  showToast(`${product.name} ditambahkan ke keranjang`);
  cartPanel.classList.add('open');
}

function toggleWishlist(id) {
  const productId = Number(id);
  if (state.wishlist.has(productId)) {
    state.wishlist.delete(productId);
  } else {
    state.wishlist.add(productId);
  }
  renderProducts();
}

function openDetail(id) {
  const product = products.find((item) => item.id === Number(id));
  if (!product) return;

  detailContent.innerHTML = `
    <div class="detail-content">
      <div class="detail-image">${product.emoji}</div>
      <div>
        <span class="badge">${product.badge}</span>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p>${product.details}</p>
        <div class="price-row">
          <span class="price">${formatRupiah(product.price)}</span>
          <button class="btn primary" data-action="cart" data-id="${product.id}">Beli sekarang</button>
        </div>
      </div>
    </div>
  `;
  detailModal.classList.remove('hidden');
}

function updateQuantity(id, delta) {
  const item = state.cart.find((entry) => entry.id === Number(id));
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    state.cart = state.cart.filter((entry) => entry.id !== Number(id));
  }
  renderCart();
}

function openCart() {
  cartPanel.classList.add('open');
}

function closeCartPanel() {
  cartPanel.classList.remove('open');
}

function handleAdminLogin(event) {
  event.preventDefault();
  const username = document.getElementById('adminUsername').value;
  const password = document.getElementById('adminPassword').value;

  if (username === 'admin' && password === 'admin123') {
    window.location.href = 'admin.html';
  } else {
    alert('Login admin gagal');
  }
}

function handleUserLogin(event) {
  event.preventDefault();
  const username = document.getElementById('userUsername').value;
  const password = document.getElementById('userPassword').value;

  if (username === 'user' && password === 'user123') {
    window.location.href = 'index.html';
  } else {
    alert('Login user gagal');
  }
}

function handleCreateProduct(event) {
  event.preventDefault();
  if (!productForm) return;

  const newProduct = {
    id: Date.now(),
    name: document.getElementById('productName').value,
    price: Number(document.getElementById('productPrice').value),
    category: document.getElementById('productCategory').value,
    image: document.getElementById('productImage').value || 'https://via.placeholder.com/300x220?text=Project+7',
    description: document.getElementById('productDescription').value,
    emoji: '🛍️',
    badge: 'Admin Add',
    details: 'Produk ditambahkan dari panel admin.',
    rating: 5,
  };

  products.push(newProduct);
  saveStoredProducts(products);
  renderProducts();
  renderAdminProducts();
  productForm.reset();
  showToast('Produk berhasil ditambahkan');
}

function handleRemoveProduct(id) {
  products = products.filter((product) => product.id !== Number(id));
  saveStoredProducts(products);
  renderProducts();
  renderAdminProducts();
  showToast('Produk dihapus');
}

async function handleCheckout() {
  if (state.cart.length === 0) {
    showToast('Keranjang masih kosong');
    return;
  }

  try {
    const payload = {
      items: state.cart,
      total: getFinalTotal(),
      promo: state.promoCode,
      createdAt: new Date().toISOString()
    };

    const response = await fetch(getApiUrl('/api/orders'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Gagal menyimpan order');
    }

    state.cart = [];
    renderCart();
    updateCheckoutSummary();
    checkoutModal.classList.remove('hidden');
    showToast('Pesanan berhasil dikirim ke backend');
  } catch (error) {
    console.error(error);
    showToast('Gagal mengirim pesanan');
  }
}

productGrid.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const action = button.getAttribute('data-action');
  const id = button.getAttribute('data-id');

  if (action === 'cart') {
    addToCart(id);
  } else if (action === 'wishlist') {
    toggleWishlist(id);
  } else if (action === 'detail') {
    openDetail(id);
  }
});

detailContent.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  addToCart(button.getAttribute('data-id'));
  detailModal.classList.add('hidden');
});

cartItems.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const action = button.getAttribute('data-action');
  const id = button.getAttribute('data-id');

  if (action === 'increase') {
    updateQuantity(id, 1);
  } else if (action === 'decrease') {
    updateQuantity(id, -1);
  } else if (action === 'remove') {
    state.cart = state.cart.filter((item) => item.id !== Number(id));
    renderCart();
  }
});

cartButton.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartPanel);
checkoutButton.addEventListener('click', handleCheckout);

if (userLoginForm) {
  userLoginForm.addEventListener('submit', handleUserLogin);
}

if (adminLoginForm) {
  adminLoginForm.addEventListener('submit', handleAdminLogin);
}

if (productForm) {
  productForm.addEventListener('submit', handleCreateProduct);
}

if (adminProductList) {
  adminProductList.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-remove-id]');
    if (button) {
      handleRemoveProduct(button.getAttribute('data-remove-id'));
    }
  });
}
closeModal.addEventListener('click', () => {
  checkoutModal.classList.add('hidden');
  state.promoCode = '';
  promoCodeInput.value = '';
  updateCheckoutSummary();
});
checkoutModal.addEventListener('click', (event) => {
  if (event.target === checkoutModal) {
    checkoutModal.classList.add('hidden');
    state.promoCode = '';
    promoCodeInput.value = '';
    updateCheckoutSummary();
  }
});

applyPromoButton.addEventListener('click', () => {
  const code = promoCodeInput.value.trim();
  if (code === '1234') {
    state.promoCode = code;
    showToast('Kode 1234 berhasil dipakai, diskon 10%');
  } else {
    state.promoCode = '';
    showToast('Kode promo tidak valid');
  }
  updateCheckoutSummary();
});

closeDetailModal.addEventListener('click', () => detailModal.classList.add('hidden'));
detailModal.addEventListener('click', (event) => {
  if (event.target === detailModal) {
    detailModal.classList.add('hidden');
  }
});

searchInput.addEventListener('input', (event) => {
  state.search = event.target.value;
  renderProducts();
});

categoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    categoryButtons.forEach((chip) => chip.classList.remove('active'));
    button.classList.add('active');
    state.activeCategory = button.getAttribute('data-category');
    renderProducts();
  });
});

themeToggle.addEventListener('click', () => {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('project7-theme', state.theme);
  applyTheme();
});

applyTheme();
updateCheckoutSummary();
renderProducts();
renderCart();
renderAdminProducts();
loadProducts();
