const defaultProducts = [
  {
    id: 1,
    name: 'Aurora Headset',
    price: 699000,
    description: 'Suara jernih, desain premium, baterai tahan lama.',
    emoji: '🎧',
    category: 'Elektronik',
    rating: 4.9,
    badge: 'Best Seller',
    details: 'Headset wireless dengan noise canceling, baterai 40 jam, dan koneksi cepat.'
  },
  {
    id: 2,
    name: 'Nova Tote Bag',
    price: 349000,
    description: 'Tas stylish untuk kerja dan weekend yang praktis.',
    emoji: '👜',
    category: 'Fashion',
    rating: 4.8,
    badge: 'Baru',
    details: 'Tas premium dengan ruang luas, material tahan air, dan desain minimalis.'
  },
  {
    id: 3,
    name: 'Lumen Lamp',
    price: 249000,
    description: 'Pencahayaan hangat dengan tampilan modern.',
    emoji: '💡',
    category: 'Lifestyle',
    rating: 4.7,
    badge: 'Promo',
    details: 'Lampu meja pintar dengan tiga mode pencahayaan dan kontrol warna lembut.'
  },
  {
    id: 4,
    name: 'Orbit Smartwatch',
    price: 899000,
    description: 'Pantau aktivitas dan notifikasi dengan desain elegan.',
    emoji: '⌚',
    category: 'Elektronik',
    rating: 4.9,
    badge: 'Terlaris',
    details: 'Smartwatch dengan GPS, detak jantung, dan pemantauan kebugaran harian.'
  },
  {
    id: 5,
    name: 'Velora Sneakers',
    price: 459000,
    description: 'Nyaman dipakai sepanjang hari dengan sentuhan premium.',
    emoji: '👟',
    category: 'Fashion',
    rating: 4.8,
    badge: 'Populer',
    details: 'Sneakers ringan dan nyaman dengan sole empuk untuk aktivitas sehari-hari.'
  },
  {
    id: 6,
    name: 'Cove Bottle',
    price: 189000,
    description: 'Botol minum premium yang cocok untuk perjalanan.',
    emoji: '🧴',
    category: 'Lifestyle',
    rating: 4.6,
    badge: 'Fresh',
    details: 'Botol stainless steel tahan lama dan cocok untuk minum di mana saja.'
  }
];

const state = {
  cart: [],
  wishlist: new Set(),
  activeCategory: 'Semua',
  search: '',
  theme: localStorage.getItem('project7-theme') || 'light',
  promoCode: '',
  products: []
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
const registerForm = document.getElementById('registerForm');
const googleLoginBtn = document.getElementById('googleLoginBtn');
const sessionLabel = document.getElementById('sessionLabel');

function formatRupiah(value) {
  return `Rp${value.toLocaleString('id-ID')}`;
}

function getSession() {
  try {
    return JSON.parse(localStorage.getItem('project7-session') || 'null');
  } catch (error) {
    return null;
  }
}

function saveSession(session) {
  localStorage.setItem('project7-session', JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem('project7-session');
}

function getStoredProducts() {
  try {
    const saved = JSON.parse(localStorage.getItem('project7-products') || 'null');
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

function saveStoredProducts(items) {
  localStorage.setItem('project7-products', JSON.stringify(items));
}

function getStoredUsers() {
  try {
    const saved = JSON.parse(localStorage.getItem('project7-users') || 'null');
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

function saveStoredUsers(users) {
  localStorage.setItem('project7-users', JSON.stringify(users));
}

function getStoredOrders() {
  try {
    const saved = JSON.parse(localStorage.getItem('project7-orders') || 'null');
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

function saveStoredOrders(items) {
  localStorage.setItem('project7-orders', JSON.stringify(items));
}

function applyTheme() {
  document.body.classList.toggle('theme-dark', state.theme === 'dark');
  if (themeToggle) {
    themeToggle.textContent = state.theme === 'dark' ? '☀️' : '🌙';
  }
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove('show'), 1800);
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
  if (!checkoutSummary) return;
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

async function initializeProducts() {
  const stored = getStoredProducts();
  if (stored.length) {
    state.products = stored;
    renderProducts();
  }

  try {
    const response = await fetch('/api/products');
    if (!response.ok) throw new Error('Gagal memuat produk');
    const data = await response.json();
    state.products = data.products || defaultProducts;
    saveStoredProducts(state.products);
    renderProducts();
  } catch (error) {
    console.error('Gagal memuat produk:', error);
    if (!stored.length) {
      state.products = defaultProducts;
      saveStoredProducts(state.products);
      renderProducts();
    }
  }
}

function renderProducts() {
  if (!productGrid || !resultsCount) return;

  const filtered = state.products.filter((product) => {
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

  if (!state.products.length) {
    adminProductList.innerHTML = '<p class="empty">Belum ada produk.</p>';
    return;
  }

  state.products.forEach((product) => {
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
  if (!cartItems || !cartCount || !cartTotal) return;

  if (state.cart.length === 0) {
    cartItems.innerHTML = '<p class="empty">Keranjang masih kosong.</p>';
    cartCount.textContent = '0';
    cartTotal.textContent = 'Rp0';
    return;
  }

  const totalItems = state.cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = totalItems;
  cartTotal.textContent = formatRupiah(state.cart.reduce((sum, item) => sum + item.price * item.qty, 0));

  cartItems.innerHTML = state.cart.map((item) => `
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
  `).join('');
}

function addToCart(id) {
  const product = state.products.find((item) => item.id === Number(id));
  if (!product) return;
  const existing = state.cart.find((item) => item.id === product.id);
  if (existing) existing.qty += 1;
  else state.cart.push({ ...product, qty: 1 });
  renderCart();
  showToast(`${product.name} ditambahkan ke keranjang`);
  if (cartPanel) cartPanel.classList.add('open');
}

function toggleWishlist(id) {
  const productId = Number(id);
  if (state.wishlist.has(productId)) state.wishlist.delete(productId);
  else state.wishlist.add(productId);
  renderProducts();
}

function openDetail(id) {
  const product = state.products.find((item) => item.id === Number(id));
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
  if (detailModal) detailModal.classList.remove('hidden');
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
  if (cartPanel) cartPanel.classList.add('open');
}

function closeCartPanel() {
  if (cartPanel) cartPanel.classList.remove('open');
}

function handleAdminLogin(event) {
  event.preventDefault();
  const username = document.getElementById('adminUsername').value.trim();
  const password = document.getElementById('adminPassword').value.trim();

  if (username === 'itsar' && password === '123') {
    saveSession({ role: 'admin', name: 'Admin' });
    window.location.href = 'admin.html';
  } else {
    showToast('Login admin gagal');
  }
}

function handleUserLogin(event) {
  event.preventDefault();
  const username = document.getElementById('userUsername').value.trim();
  const password = document.getElementById('userPassword').value.trim();
  const users = getStoredUsers();
  const existingUser = users.find((user) => user.username === username && user.password === password);

  if (existingUser) {
    saveSession({ role: 'user', name: username });
    window.location.href = 'store.html';
  } else {
    showToast('Login user gagal. Silakan daftar terlebih dahulu.');
  }
}

function handleUserRegister(event) {
  event.preventDefault();
  const username = document.getElementById('registerUsername').value.trim();
  const password = document.getElementById('registerPassword').value.trim();
  const confirmPassword = document.getElementById('registerConfirmPassword').value.trim();

  if (!username || !password) {
    showToast('Isi username dan password terlebih dahulu');
    return;
  }

  if (password !== confirmPassword) {
    showToast('Password dan konfirmasi tidak cocok');
    return;
  }

  const users = getStoredUsers();
  if (users.some((user) => user.username === username)) {
    showToast('Username sudah terpakai');
    return;
  }

  users.push({ username, password });
  saveStoredUsers(users);
  showToast('Registrasi berhasil. Silakan login.');
  setTimeout(() => {
    window.location.href = 'login-user.html';
  }, 700);
}

function handleGoogleLogin() {
  const config = window.firebaseConfig || {};
  const isConfigured = config.apiKey && config.apiKey !== 'YOUR_API_KEY';

  if (!isConfigured) {
    saveSession({ role: 'user', name: 'Google User' });
    showToast('Login demo Google berhasil');
    setTimeout(() => {
      window.location.href = 'store.html';
    }, 400);
    return;
  }

  showToast('Siapkan Firebase Auth untuk login Google nyata');
}

function handleCreateProduct(event) {
  event.preventDefault();
  if (!productForm) return;

  const newProduct = {
    id: Date.now(),
    name: document.getElementById('productName').value.trim(),
    price: Number(document.getElementById('productPrice').value),
    category: document.getElementById('productCategory').value.trim(),
    image: document.getElementById('productImage').value.trim() || 'https://via.placeholder.com/300x220?text=Project+7',
    description: document.getElementById('productDescription').value.trim(),
    emoji: '🛍️',
    badge: 'Admin Add',
    details: 'Produk ditambahkan dari panel admin.',
    rating: 5,
  };

  state.products.push(newProduct);
  saveStoredProducts(state.products);
  renderProducts();
  renderAdminProducts();
  productForm.reset();
  showToast('Produk berhasil ditambahkan');
}

function handleRemoveProduct(id) {
  state.products = state.products.filter((product) => product.id !== Number(id));
  saveStoredProducts(state.products);
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

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error('Gagal menyimpan order');

    const storedOrders = getStoredOrders();
    storedOrders.push({ ...payload, savedAt: new Date().toISOString() });
    saveStoredOrders(storedOrders);

    state.cart = [];
    renderCart();
    updateCheckoutSummary();
    if (checkoutModal) checkoutModal.classList.remove('hidden');
    showToast('Pesanan berhasil dibuat dan tersimpan');
  } catch (error) {
    console.error(error);
    showToast('Gagal mengirim pesanan');
  }
}

function protectPage() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const session = getSession();

  if (path === 'admin.html' && (!session || session.role !== 'admin')) {
    window.location.href = 'index.html';
    return;
  }

  if (path === 'store.html' && !session) {
    window.location.href = 'index.html';
    return;
  }
}

function bindStorePageEvents() {
  if (productGrid) {
    productGrid.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-action]');
      if (!button) return;
      const action = button.getAttribute('data-action');
      const id = button.getAttribute('data-id');
      if (action === 'cart') addToCart(id);
      else if (action === 'wishlist') toggleWishlist(id);
      else if (action === 'detail') openDetail(id);
    });
  }

  if (detailContent) {
    detailContent.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-action]');
      if (!button) return;
      addToCart(button.getAttribute('data-id'));
      if (detailModal) detailModal.classList.add('hidden');
    });
  }

  if (cartItems) {
    cartItems.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-action]');
      if (!button) return;
      const action = button.getAttribute('data-action');
      const id = button.getAttribute('data-id');
      if (action === 'increase') updateQuantity(id, 1);
      else if (action === 'decrease') updateQuantity(id, -1);
      else if (action === 'remove') {
        state.cart = state.cart.filter((item) => item.id !== Number(id));
        renderCart();
      }
    });
  }

  if (cartButton) cartButton.addEventListener('click', openCart);
  if (closeCart) closeCart.addEventListener('click', closeCartPanel);
  if (checkoutButton) checkoutButton.addEventListener('click', handleCheckout);
  if (closeModal) closeModal.addEventListener('click', () => { if (checkoutModal) checkoutModal.classList.add('hidden'); state.promoCode = ''; if (promoCodeInput) promoCodeInput.value = ''; updateCheckoutSummary(); });
  if (checkoutModal) checkoutModal.addEventListener('click', (event) => { if (event.target === checkoutModal) { checkoutModal.classList.add('hidden'); state.promoCode = ''; if (promoCodeInput) promoCodeInput.value = ''; updateCheckoutSummary(); } });
  if (applyPromoButton) applyPromoButton.addEventListener('click', () => { const code = promoCodeInput.value.trim(); if (code === '1234') { state.promoCode = code; showToast('Kode 1234 berhasil dipakai, diskon 10%'); } else { state.promoCode = ''; showToast('Kode promo tidak valid'); } updateCheckoutSummary(); });
  if (closeDetailModal) closeDetailModal.addEventListener('click', () => { if (detailModal) detailModal.classList.add('hidden'); });
  if (detailModal) detailModal.addEventListener('click', (event) => { if (event.target === detailModal) detailModal.classList.add('hidden'); });
  if (searchInput) searchInput.addEventListener('input', (event) => { state.search = event.target.value; renderProducts(); });
  categoryButtons.forEach((button) => button.addEventListener('click', () => { categoryButtons.forEach((chip) => chip.classList.remove('active')); button.classList.add('active'); state.activeCategory = button.getAttribute('data-category'); renderProducts(); }));
  if (themeToggle) themeToggle.addEventListener('click', () => { state.theme = state.theme === 'dark' ? 'light' : 'dark'; localStorage.setItem('project7-theme', state.theme); applyTheme(); });
}

function bindAuthPageEvents() {
  if (userLoginForm) userLoginForm.addEventListener('submit', handleUserLogin);
  if (adminLoginForm) adminLoginForm.addEventListener('submit', handleAdminLogin);
  if (registerForm) registerForm.addEventListener('submit', handleUserRegister);
  if (googleLoginBtn) googleLoginBtn.addEventListener('click', handleGoogleLogin);
}

function bindAdminPageEvents() {
  if (productForm) productForm.addEventListener('submit', handleCreateProduct);
  if (adminProductList) adminProductList.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-remove-id]');
    if (button) handleRemoveProduct(button.getAttribute('data-remove-id'));
  });
}

function renderSessionLabel() {
  if (!sessionLabel) return;
  const session = getSession();
  if (session) {
    sessionLabel.textContent = `Masuk sebagai ${session.name} (${session.role})`;
  } else {
    sessionLabel.textContent = 'Belum masuk';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initializeProducts();
  applyTheme();
  renderSessionLabel();

  const path = window.location.pathname.split('/').pop() || 'index.html';
  if (path === 'store.html') {
    protectPage();
    bindStorePageEvents();
    updateCheckoutSummary();
    renderProducts();
    renderCart();
    renderAdminProducts();
  }

  if (path === 'admin.html') {
    protectPage();
    bindAdminPageEvents();
    renderProducts();
    renderAdminProducts();
  }

  if (path === 'index.html' || path === 'login-user.html' || path === 'login-admin.html') {
    bindAuthPageEvents();
  }
});
