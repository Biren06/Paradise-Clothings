/**
 * Paradise Clothing - Main Application Controller
 * Handles UI interactions, mobile navigation, auth tabs, product rendering,
 * shop search & multi-filter system, shopping cart operations, authentication simulation,
 * and simulated checkout with order persistence.
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('[Paradise] Main application initialized');

  // ------------------------------------------------------------------------
  // 1. Mobile Menu Drawer Toggle
  // ------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (mobileToggle && mobileDrawer) {
    function closeMobileMenu() {
      mobileToggle.classList.remove('is-active');
      mobileDrawer.classList.remove('is-open');
      mobileToggle.setAttribute('aria-expanded', 'false');
    }

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.classList.toggle('is-active');
      mobileDrawer.classList.toggle('is-open');
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
    });

    const mobileLinks = mobileDrawer.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
        closeMobileMenu();
      }
    });

    document.addEventListener('click', (e) => {
      if (mobileDrawer.classList.contains('is-open') &&
          !mobileDrawer.contains(e.target) &&
          !mobileToggle.contains(e.target)) {
        closeMobileMenu();
      }
    });
  }

  // Header Scroll Elevation
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    const handleHeaderScroll = () => {
      if (window.scrollY > 15) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();
  }

  // ------------------------------------------------------------------------
  // 2. Authentication Management & Form Handlers
  // ------------------------------------------------------------------------
  initAuthPage();

  // ------------------------------------------------------------------------
  // 3. Homepage: Featured Products Rendering
  // ------------------------------------------------------------------------
  const featuredGrid = document.getElementById('featured-products-grid');
  if (featuredGrid && typeof PRODUCTS !== 'undefined' && typeof Render !== 'undefined') {
    const featuredProducts = PRODUCTS.filter(product => Boolean(product.featured));
    Render.renderProductGrid(featuredGrid, featuredProducts);
    console.log(`[Paradise] Rendered ${featuredProducts.length} featured products on homepage`);
  }

  // ------------------------------------------------------------------------
  // 4. Shop Page: Search & Filtering System
  // ------------------------------------------------------------------------
  const shopGrid = document.getElementById('shop-products-grid');
  if (shopGrid && typeof PRODUCTS !== 'undefined' && typeof Render !== 'undefined') {
    initShopFilters(shopGrid);
  }

  // ------------------------------------------------------------------------
  // 5. Cart Page Operations & Event Delegation
  // ------------------------------------------------------------------------
  const cartContentWrapper = document.getElementById('cart-content-wrapper');
  if (cartContentWrapper && typeof Render !== 'undefined') {
    initCartPage();
  }

  // ------------------------------------------------------------------------
  // 6. Checkout Flow & Order Processing
  // ------------------------------------------------------------------------
  const checkoutFlow = document.getElementById('checkout-flow-container');
  if (checkoutFlow) {
    initCheckoutPage();
  }

  // ------------------------------------------------------------------------
  // 7. Newsletter Forms Handling
  // ------------------------------------------------------------------------
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = 'Subscribed ✓';
        btn.disabled = true;
        if (input) input.value = '';
        setTimeout(() => {
          btn.textContent = orig;
          btn.disabled = false;
        }, 2200);
      }
    });
  });

  // ------------------------------------------------------------------------
  // 8. Global "Add to Cart" Event Delegation (Homepage & Shop Page)
  // ------------------------------------------------------------------------
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.add-to-cart-btn');
    if (addBtn) {
      const productId = addBtn.getAttribute('data-id');
      if (productId && typeof addToCart === 'function') {
        addToCart(productId, 1);

        // Visual feedback on button (safe against rapid multiple clicks)
        if (addBtn._feedbackTimer) {
          clearTimeout(addBtn._feedbackTimer);
        }
        if (!addBtn._originalHtml) {
          addBtn._originalHtml = addBtn.innerHTML;
        }
        addBtn.innerHTML = 'Added &#10003;';
        addBtn.style.backgroundColor = 'var(--color-primary)';
        addBtn.style.color = 'var(--color-white)';
        addBtn._feedbackTimer = setTimeout(() => {
          if (addBtn._originalHtml) {
            addBtn.innerHTML = addBtn._originalHtml;
            delete addBtn._originalHtml;
          }
          addBtn.style.backgroundColor = '';
          addBtn.style.color = '';
          delete addBtn._feedbackTimer;
        }, 800);
      }
    }
  });

  // ------------------------------------------------------------------------
  // 8. Navbar State Sync (Cart badge & Auth link)
  // ------------------------------------------------------------------------
  if (typeof updateCartBadge === 'function') {
    updateCartBadge();
  } else if (typeof Cart !== 'undefined' && typeof Cart.updateBadge === 'function') {
    Cart.updateBadge();
  }

  if (typeof updateAuthNavbar === 'function') {
    updateAuthNavbar();
  } else if (typeof Auth !== 'undefined' && typeof Auth.updateNavbar === 'function') {
    Auth.updateNavbar();
  }
});

/**
 * Initializes Authentication Portal (Login, Registration, and Logged-In Profile)
 */
function initAuthPage() {
  const authCard = document.querySelector('.auth-card');
  if (!authCard || typeof Auth === 'undefined') {
    if (typeof updateAuthNavbar === 'function') updateAuthNavbar();
    return;
  }

  const formsContainer = document.getElementById('auth-forms-container');
  const profileContainer = document.getElementById('auth-profile-container');
  const profileName = document.getElementById('profile-name');
  const profileEmail = document.getElementById('profile-email');
  const profileAvatar = document.getElementById('profile-avatar');
  const logoutBtn = document.getElementById('logout-btn');

  const authTabBtns = document.querySelectorAll('.auth-tab-btn');
  const authPanes = document.querySelectorAll('.auth-pane');

  const loginForm = document.getElementById('login-form');
  const loginEmail = document.getElementById('login-email');
  const loginPassword = document.getElementById('login-password');
  const loginAlert = document.getElementById('login-alert');
  const loginAlertText = document.getElementById('login-alert-text');

  const registerForm = document.getElementById('register-form');
  const regName = document.getElementById('reg-name');
  const regEmail = document.getElementById('reg-email');
  const regPassword = document.getElementById('reg-password');
  const regConfirm = document.getElementById('reg-confirm');
  const registerAlert = document.getElementById('register-alert');
  const registerAlertText = document.getElementById('register-alert-text');

  // Check for redirect intent from checkout
  const urlParams = new URLSearchParams(window.location.search);
  const redirectTarget = urlParams.get('redirect');

  if (redirectTarget === 'checkout') {
    if (Auth.isLoggedIn()) {
      window.location.href = 'checkout.html';
      return;
    } else if (loginAlert && loginAlertText) {
      loginAlert.className = 'form-alert alert-success';
      loginAlert.style.backgroundColor = 'var(--color-surface-tint)';
      loginAlert.style.borderColor = 'var(--color-accent)';
      loginAlert.style.color = 'var(--color-primary)';
      loginAlertText.textContent = 'Please sign in or register to complete your order.';
      loginAlert.style.display = 'flex';
    }
  }

  // Tab switching helper
  function switchTab(targetTab) {
    authTabBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-tab') === targetTab));
    authPanes.forEach(pane => pane.classList.toggle('active', pane.id === `tab-${targetTab}`));
    if (loginAlert) loginAlert.style.display = 'none';
    if (registerAlert) registerAlert.style.display = 'none';
  }

  authTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.getAttribute('data-tab'));
    });
  });

  // Render view based on login state
  function renderAuthUI() {
    if (Auth.isLoggedIn()) {
      const user = Auth.getUser();
      if (formsContainer) formsContainer.style.display = 'none';
      if (profileContainer) profileContainer.style.display = 'block';

      if (profileName && user) profileName.textContent = user.name;
      if (profileEmail && user) profileEmail.textContent = user.email;
      if (profileAvatar && user && user.name) {
        profileAvatar.textContent = user.name.charAt(0).toUpperCase();
      }

      const orderCountEl = document.getElementById('profile-orders-count');
      if (orderCountEl && typeof getOrders === 'function') {
        const orders = getOrders();
        orderCountEl.textContent = `${orders.length} coastal order${orders.length === 1 ? '' : 's'} placed`;
      }
    } else {
      if (formsContainer) formsContainer.style.display = 'block';
      if (profileContainer) profileContainer.style.display = 'none';
    }
  }

  // Remove invalid styling on input
  [loginEmail, loginPassword, regName, regEmail, regPassword, regConfirm].forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        input.classList.remove('input-invalid');
      });
    }
  });

  // Handle Login Form Submit
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = loginEmail.value.trim();
      const password = loginPassword.value;

      const res = Auth.loginUser(email, password);

      if (!res.success) {
        if (loginEmail) loginEmail.classList.add('input-invalid');
        if (loginPassword) loginPassword.classList.add('input-invalid');
        if (loginAlert) {
          loginAlert.className = 'form-alert alert-error';
          loginAlert.style.backgroundColor = '';
          loginAlert.style.borderColor = '';
          loginAlert.style.color = '';
          loginAlertText.textContent = res.message;
          loginAlert.style.display = 'flex';
        }
      } else {
        if (loginAlert) loginAlert.style.display = 'none';
        if (redirectTarget === 'checkout') {
          window.location.href = 'checkout.html';
          return;
        }
        renderAuthUI();
      }
    });
  }

  // Handle Registration Form Submit
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = regName.value.trim();
      const email = regEmail.value.trim();
      const password = regPassword.value;
      const confirmPassword = regConfirm ? regConfirm.value : password;

      const termsCheckbox = document.getElementById('reg-terms');
      if (termsCheckbox && !termsCheckbox.checked) {
        if (registerAlert) {
          registerAlert.className = 'form-alert alert-error';
          registerAlertText.textContent = 'Please agree to the Terms & Privacy to create an account.';
          registerAlert.style.display = 'flex';
        }
        return;
      }

      if (password !== confirmPassword) {
        if (regConfirm) regConfirm.classList.add('input-invalid');
        if (registerAlert) {
          registerAlert.className = 'form-alert alert-error';
          registerAlertText.textContent = 'Passwords do not match.';
          registerAlert.style.display = 'flex';
        }
        return;
      }

      const res = Auth.registerUser(name, email, password);

      if (!res.success) {
        if (registerAlert) {
          registerAlert.className = 'form-alert alert-error';
          registerAlertText.textContent = res.message;
          registerAlert.style.display = 'flex';
        }
      } else {
        if (registerAlert) {
          registerAlert.className = 'form-alert alert-success';
          registerAlertText.textContent = res.message;
          registerAlert.style.display = 'flex';
        }

        if (loginEmail) loginEmail.value = email;
        if (loginPassword) loginPassword.value = '';
        setTimeout(() => {
          switchTab('login');
          if (loginAlert && loginAlertText) {
            loginAlert.className = 'form-alert alert-success';
            loginAlertText.textContent = 'Account created successfully! Please sign in.';
            loginAlert.style.display = 'flex';
          }
          if (loginPassword) loginPassword.focus();
        }, 1100);
      }
    });
  }

  // Handle Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      Auth.logoutUser();
      renderAuthUI();
      switchTab('login');
      if (loginAlert) {
        loginAlert.className = 'form-alert alert-success';
        loginAlert.style.backgroundColor = '';
        loginAlert.style.borderColor = '';
        loginAlert.style.color = '';
        loginAlertText.textContent = 'You have been signed out.';
        loginAlert.style.display = 'flex';
      }
    });
  }

  window.addEventListener('auth:updated', renderAuthUI);
  renderAuthUI();
}

/**
 * Initializes client-side compound filtering for the Shop catalog
 * @param {HTMLElement} shopGrid - The container element for product cards
 */
function initShopFilters(shopGrid) {
  const state = {
    gender: 'all',
    type: 'all',
    search: ''
  };

  const searchInput = document.getElementById('shop-search-input');
  const searchClearBtn = document.getElementById('search-clear-btn');
  const genderBtns = document.querySelectorAll('#gender-filter-group [data-gender]');
  const typeBtns = document.querySelectorAll('#type-filter-group [data-type]');
  const resultsCountEl = document.getElementById('results-count');
  const resetFiltersBtn = document.getElementById('reset-filters-btn');

  const urlParams = new URLSearchParams(window.location.search);
  const initialGender = (urlParams.get('gender') || urlParams.get('category') || '').toLowerCase();
  const initialType = (urlParams.get('type') || '').toLowerCase();
  const initialSearch = (urlParams.get('search') || '').trim();

  if (['men', 'women', 'kids'].includes(initialGender)) {
    state.gender = initialGender;
  }
  if (['tops', 'bottoms'].includes(initialType)) {
    state.type = initialType;
  }
  if (initialSearch) {
    state.search = initialSearch;
    if (searchInput) {
      searchInput.value = initialSearch;
    }
  }

  function syncFilterUI() {
    genderBtns.forEach(btn => {
      const g = btn.getAttribute('data-gender');
      btn.classList.toggle('active', g === state.gender);
    });

    typeBtns.forEach(btn => {
      const t = btn.getAttribute('data-type');
      btn.classList.toggle('active', t === state.type);
    });

    if (searchClearBtn) {
      searchClearBtn.style.display = state.search ? 'block' : 'none';
    }

    const isFiltered = state.gender !== 'all' || state.type !== 'all' || state.search.trim() !== '';
    if (resetFiltersBtn) {
      resetFiltersBtn.style.display = isFiltered ? 'inline-block' : 'none';
    }
  }

  function updateURL() {
    const params = new URLSearchParams();
    if (state.gender !== 'all') params.set('gender', state.gender);
    if (state.type !== 'all') params.set('type', state.type);
    if (state.search.trim()) params.set('search', state.search.trim());

    const queryString = params.toString();
    const newUrl = window.location.pathname + (queryString ? `?${queryString}` : '');
    window.history.replaceState(null, '', newUrl);
  }

  function applyFilters() {
    const term = state.search.toLowerCase().trim();

    const filtered = PRODUCTS.filter(product => {
      const matchesGender = (state.gender === 'all' || product.gender.toLowerCase() === state.gender);
      const matchesType = (state.type === 'all' || product.type.toLowerCase() === state.type);
      const matchesSearch = (!term || product.name.toLowerCase().includes(term));
      return matchesGender && matchesType && matchesSearch;
    });

    if (filtered.length > 0) {
      Render.renderProductGrid(shopGrid, filtered);
    } else {
      Render.renderNoProductsFound(shopGrid);
      const emptyResetBtn = document.getElementById('empty-reset-btn');
      if (emptyResetBtn) {
        emptyResetBtn.addEventListener('click', resetAllFilters);
      }
    }

    if (resultsCountEl) {
      resultsCountEl.innerHTML = `Showing <strong>${filtered.length}</strong> of ${PRODUCTS.length} handcrafted styles`;
    }

    const paginationWrap = document.querySelector('.pagination-wrap');
    if (paginationWrap) {
      paginationWrap.style.display = filtered.length > 0 ? 'block' : 'none';
    }

    syncFilterUI();
    updateURL();
  }

  const loadMoreBtn = document.querySelector('.pagination-wrap button');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      loadMoreBtn.textContent = "You're viewing all 14 coastal styles";
      loadMoreBtn.disabled = true;
      setTimeout(() => {
        loadMoreBtn.textContent = 'Load More Coastal Items';
        loadMoreBtn.disabled = false;
      }, 2500);
    });
  }

  function resetAllFilters() {
    state.gender = 'all';
    state.type = 'all';
    state.search = '';
    if (searchInput) searchInput.value = '';
    applyFilters();
  }

  genderBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selected = btn.getAttribute('data-gender');
      if (state.gender !== selected) {
        state.gender = selected;
        applyFilters();
      }
    });
  });

  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selected = btn.getAttribute('data-type');
      if (state.type !== selected) {
        state.type = selected;
        applyFilters();
      }
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.search = e.target.value;
      applyFilters();
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      state.search = '';
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      applyFilters();
    });
  }

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', resetAllFilters);
  }

  applyFilters();
}

/**
 * Initializes Cart page rendering and interactive event delegation
 */
function initCartPage() {
  Render.renderCartPage();

  window.addEventListener('cart:updated', () => {
    Render.renderCartPage();
  });

  const cartSection = document.querySelector('.cart-section');
  if (cartSection) {
    cartSection.addEventListener('click', (e) => {
      // 1. Quantity Increase
      const increaseBtn = e.target.closest('.qty-increase');
      if (increaseBtn) {
        const productId = increaseBtn.getAttribute('data-id');
        const cart = getCart();
        const item = cart.find(i => Number(i.id) === Number(productId));
        if (item && typeof updateQuantity === 'function') {
          updateQuantity(productId, item.quantity + 1);
        }
        return;
      }

      // 2. Quantity Decrease
      const decreaseBtn = e.target.closest('.qty-decrease');
      if (decreaseBtn) {
        const productId = decreaseBtn.getAttribute('data-id');
        const cart = getCart();
        const item = cart.find(i => Number(i.id) === Number(productId));
        if (item && typeof updateQuantity === 'function') {
          updateQuantity(productId, item.quantity - 1);
        }
        return;
      }

      // 3. Remove Item
      const removeBtn = e.target.closest('.cart-item-remove');
      if (removeBtn) {
        const productId = removeBtn.getAttribute('data-id');
        if (productId && typeof removeFromCart === 'function') {
          removeFromCart(productId);
        }
        return;
      }

      // 4. Clear Entire Bag
      const clearBtn = e.target.closest('#clear-cart-btn');
      if (clearBtn) {
        if (typeof clearCart === 'function') {
          clearCart();
        }
        return;
      }

      // 5. Proceed to Checkout
      const checkoutBtn = e.target.closest('#checkout-btn');
      if (checkoutBtn) {
        e.preventDefault();
        const cart = typeof getCart === 'function' ? getCart() : [];
        if (!cart || cart.length === 0) return;

        if (typeof Auth !== 'undefined' && Auth.isLoggedIn()) {
          window.location.href = 'checkout.html';
        } else {
          window.location.href = 'login.html?redirect=checkout';
        }
        return;
      }
    });
  }
}

/**
 * Initializes Simulated Checkout Page
 */
function initCheckoutPage() {
  const checkoutFlow = document.getElementById('checkout-flow-container');
  const confirmView = document.getElementById('order-confirmation-view');
  if (!checkoutFlow) return;

  const shippingForm = document.getElementById('checkout-shipping-form');
  if (shippingForm) {
    shippingForm.addEventListener('submit', (e) => e.preventDefault());
  }

  // 1. Enforce login requirement for checkout
  if (typeof Auth === 'undefined' || !Auth.isLoggedIn()) {
    window.location.href = 'login.html?redirect=checkout';
    return;
  }

  // 2. Check if cart has items (unless confirmation is currently displayed)
  const cart = typeof getCart === 'function' ? getCart() : [];
  if ((!cart || cart.length === 0) && confirmView && confirmView.style.display === 'none') {
    window.location.href = 'cart.html';
    return;
  }

  // 3. Pre-fill customer details from Auth
  const user = Auth.getUser();
  const nameInput = document.getElementById('checkout-name');
  const emailInput = document.getElementById('checkout-email');
  if (nameInput && user && user.name) nameInput.value = user.name;
  if (emailInput && user && user.email) emailInput.value = user.email;

  // 4. Render checkout order summary
  if (typeof Render !== 'undefined' && typeof Render.renderCheckoutSummary === 'function') {
    Render.renderCheckoutSummary();
  }

  // 5. Handle "Confirm & Place Order"
  const placeOrderBtn = document.getElementById('place-order-btn');
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', () => {
      const currentCart = typeof getCart === 'function' ? getCart() : [];
      if (!currentCart || currentCart.length === 0) {
        window.location.href = 'cart.html';
        return;
      }

      const subtotal = typeof calculateCartTotal === 'function' ? calculateCartTotal() : 0;
      const isFreeShipping = subtotal >= 75.00;
      const shipping = isFreeShipping ? 0 : 6.50;
      const tax = Number((subtotal * 0.06).toFixed(2));
      const grandTotal = subtotal + shipping + tax;

      const orderItems = currentCart.map(item => {
        const product = (typeof PRODUCTS !== 'undefined' ? PRODUCTS.find(p => Number(p.id) === Number(item.id)) : null) || {};
        return {
          id: item.id,
          name: product.name || 'Coastal Apparel',
          price: product.price || 0,
          quantity: item.quantity,
          image: product.image || ''
        };
      });

      const newOrder = {
        id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        items: orderItems,
        total: grandTotal,
        date: new Date().toISOString()
      };

      // Save to localStorage under "orders" and clear cart
      if (typeof saveOrder === 'function') {
        saveOrder(newOrder);
      }

      // Display Confirmation Screen
      checkoutFlow.style.display = 'none';
      if (confirmView) {
        confirmView.style.display = 'block';

        const idEl = document.getElementById('confirmed-order-id');
        const totalEl = document.getElementById('confirmed-order-total');
        const dateEl = document.getElementById('confirmed-order-date');
        const itemsEl = document.getElementById('confirmed-items-breakdown');

        if (idEl) idEl.textContent = newOrder.id;
        if (totalEl && typeof Render !== 'undefined') totalEl.textContent = Render.formatPrice(newOrder.total);
        if (dateEl) {
          dateEl.textContent = new Date(newOrder.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });
        }

        if (itemsEl && typeof Render !== 'undefined') {
          itemsEl.innerHTML = `
            <div style="border-top: 1px solid var(--color-border); padding-top: var(--space-md); margin-top: var(--space-md);">
              <h4 style="font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-text-muted); margin-bottom: var(--space-sm);">
                Ordered Items (${newOrder.items.length})
              </h4>
              <div style="display: flex; flex-direction: column; gap: var(--space-xs);">
                ${newOrder.items.map(it => `
                  <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                    <span>${it.name} &times; ${it.quantity}</span>
                    <strong>${Render.formatPrice(it.price * it.quantity)}</strong>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
}
