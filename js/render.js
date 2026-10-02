/**
 * Paradise Clothing - Render Engine
 * Responsible for generating dynamic HTML templates and DOM injection.
 */

const Render = {
  /**
   * Helper to format currency values
   * @param {number} amount
   * @returns {string}
   */
  formatPrice(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) return '$0.00';
    const currency = (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.currency) ? APP_CONFIG.currency : '$';
    return `${currency}${amount.toFixed(2)}`;
  },

  /**
   * Helper to map badge text to appropriate CSS styling class
   * @param {string|null} badge
   * @returns {string}
   */
  getBadgeClass(badge) {
    if (!badge) return '';
    const lower = String(badge).toLowerCase();
    if (lower.includes('sale')) return 'badge-sale';
    if (lower.includes('new')) return 'badge-new';
    return 'badge-popular';
  },

  /**
   * Generates HTML markup for a single product card
   * @param {Object} product
   * @returns {string}
   */
  createProductCardHTML(product) {
    if (!product) return '';

    const badgeHTML = product.badge
      ? `<span class="badge ${this.getBadgeClass(product.badge)} product-badge-pos">${product.badge}</span>`
      : '';

    const originalPriceHTML = (product.originalPrice && product.originalPrice > product.price)
      ? `<span class="original-price">${this.formatPrice(product.originalPrice)}</span>`
      : '';

    const genderLabel = product.gender ? product.gender.toUpperCase() : '';
    const typeLabel = product.type ? product.type.toUpperCase() : '';
    const categoryLabel = [genderLabel, typeLabel].filter(Boolean).join(' &bull; ');

    return `
      <article class="product-card" data-product-id="${product.id}">
        <div class="product-thumb-wrap">
          ${badgeHTML}
          <img src="${product.image}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-body">
          <span class="product-cat">${categoryLabel}</span>
          <h3 class="product-name">${product.name}</h3>
          <div class="product-pricing">
            <span class="current-price">${this.formatPrice(product.price)}</span>
            ${originalPriceHTML}
          </div>
          <button class="btn btn-outline btn-sm btn-block add-to-cart-btn" type="button" data-id="${product.id}">
            Add to Bag
          </button>
        </div>
      </article>
    `;
  },

  /**
   * Renders an array of products into a container element
   * @param {HTMLElement|string} target - Container element or CSS selector
   * @param {Array} products - List of products to render
   */
  renderProductGrid(target, products = []) {
    const container = typeof target === 'string' ? document.querySelector(target) : target;
    if (!container) {
      console.warn('[Paradise Render] Container not found:', target);
      return;
    }

    if (!Array.isArray(products) || products.length === 0) {
      this.renderNoProductsFound(container);
      return;
    }

    container.innerHTML = products.map(product => this.createProductCardHTML(product)).join('');
  },

  /**
   * Renders a clean "No products found" empty state
   * @param {HTMLElement|string} target - Container element or CSS selector
   */
  renderNoProductsFound(target) {
    const container = typeof target === 'string' ? document.querySelector(target) : target;
    if (!container) return;

    container.innerHTML = `
      <div class="no-products-state">
        <div class="empty-icon-wrap">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <h3>No Coastal Clothing Found</h3>
        <p>We couldn't find any products matching your current filters and search terms. Try clearing your search or switching categories.</p>
        <div style="display: flex; gap: var(--space-sm); justify-content: center; flex-wrap: wrap;">
          <button class="btn btn-primary btn-sm" id="empty-reset-btn" type="button">Reset All Filters</button>
          <a href="shop.html" class="btn btn-outline btn-sm">View Full Catalog</a>
        </div>
      </div>
    `;
  },

  /**
   * Generates HTML markup for a single cart item row
   * @param {Object} item - { id, quantity }
   * @param {Object} product - Product catalog item
   * @returns {string}
   */
  createCartItemRowHTML(item, product) {
    if (!item || !product) return '';
    const itemTotal = product.price * (item.quantity || 1);
    const genderLabel = product.gender ? product.gender.toUpperCase() : '';
    const typeLabel = product.type ? product.type.toUpperCase() : '';
    const categoryLabel = [genderLabel, typeLabel].filter(Boolean).join(' &bull; ');

    return `
      <div class="cart-item-row" data-id="${product.id}">
        <div class="cart-item-info">
          <img src="${product.image}" alt="${product.name}" class="cart-item-img" loading="lazy">
          <div>
            <h4 class="cart-item-title">${product.name}</h4>
            <p class="cart-item-meta">${categoryLabel}</p>
            <span class="cart-item-mobile-price">${this.formatPrice(product.price)} each</span>
          </div>
        </div>
        <div class="cart-item-price">${this.formatPrice(product.price)}</div>
        <div class="cart-item-stepper-cell">
          <div class="quantity-stepper">
            <button class="qty-btn qty-decrease" type="button" data-id="${product.id}" aria-label="Decrease quantity">&minus;</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn qty-increase" type="button" data-id="${product.id}" aria-label="Increase quantity">&plus;</button>
          </div>
        </div>
        <div class="cart-item-total">${this.formatPrice(itemTotal)}</div>
        <div class="cart-item-remove-cell">
          <button class="cart-item-remove" type="button" data-id="${product.id}" aria-label="Remove ${product.name} from bag">&times;</button>
        </div>
      </div>
    `;
  },

  /**
   * Renders the dynamic cart page view and order summary calculations
   */
  renderCartPage() {
    const contentWrapper = document.getElementById('cart-content-wrapper');
    const emptyView = document.getElementById('cart-empty-view');
    const itemsContainer = document.getElementById('cart-items-container');

    if (!contentWrapper || !emptyView) return;

    const cart = typeof getCart === 'function' ? getCart() : [];

    if (!Array.isArray(cart) || cart.length === 0) {
      contentWrapper.style.display = 'none';
      emptyView.style.display = 'block';
      return;
    }

    contentWrapper.style.display = 'grid';
    emptyView.style.display = 'none';

    // Populate item rows
    if (itemsContainer && typeof PRODUCTS !== 'undefined') {
      const rowsHTML = cart.map(item => {
        const product = PRODUCTS.find(p => Number(p.id) === Number(item.id));
        return product ? this.createCartItemRowHTML(item, product) : '';
      }).join('');
      itemsContainer.innerHTML = rowsHTML;
    }

    // Calculations
    const subtotal = typeof calculateCartTotal === 'function' ? calculateCartTotal() : 0;
    const totalItems = typeof getCartItemCount === 'function' ? getCartItemCount() : 0;
    const freeShippingThreshold = 75.00;
    const isFreeShipping = subtotal >= freeShippingThreshold;
    const shipping = isFreeShipping ? 0 : 6.50;
    const tax = Number((subtotal * 0.06).toFixed(2));
    const grandTotal = subtotal + shipping + tax;

    // Update summary elements
    const subtotalLabelEl = document.getElementById('cart-subtotal-label');
    const subtotalEl = document.getElementById('cart-subtotal');
    const shippingEl = document.getElementById('cart-shipping');
    const taxEl = document.getElementById('cart-tax');
    const totalEl = document.getElementById('cart-total');
    const shippingTextEl = document.getElementById('shipping-progress-text');
    const shippingFillEl = document.getElementById('shipping-progress-fill');

    if (subtotalLabelEl) {
      subtotalLabelEl.textContent = `Bag Subtotal (${totalItems} ${totalItems === 1 ? 'item' : 'items'})`;
    }
    if (subtotalEl) {
      subtotalEl.textContent = this.formatPrice(subtotal);
    }
    if (shippingEl) {
      shippingEl.textContent = isFreeShipping ? 'FREE' : this.formatPrice(shipping);
      if (isFreeShipping) {
        shippingEl.style.color = 'var(--color-success)';
        shippingEl.style.fontWeight = '700';
      } else {
        shippingEl.style.color = '';
        shippingEl.style.fontWeight = '';
      }
    }
    if (taxEl) {
      taxEl.textContent = this.formatPrice(tax);
    }
    if (totalEl) {
      totalEl.textContent = this.formatPrice(grandTotal);
    }

    // Shipping progress bar
    if (shippingTextEl && shippingFillEl) {
      if (isFreeShipping) {
        shippingTextEl.innerHTML = `You've unlocked <strong>Free Coastal Shipping!</strong>`;
        shippingFillEl.style.width = '100%';
        shippingFillEl.style.backgroundColor = 'var(--color-success)';
      } else {
        const remaining = (freeShippingThreshold - subtotal).toFixed(2);
        const percent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
        shippingTextEl.innerHTML = `You're only <strong>$${remaining}</strong> away from Free Coastal Shipping!`;
        shippingFillEl.style.width = `${percent}%`;
        shippingFillEl.style.backgroundColor = 'var(--color-accent)';
      }
    }
  },

  /**
   * Generates HTML markup for an item in checkout sidebar
   * @param {Object} item - { id, quantity }
   * @param {Object} product
   * @returns {string}
   */
  createCheckoutItemHTML(item, product) {
    if (!item || !product) return '';
    const itemTotal = product.price * (item.quantity || 1);
    return `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.6rem 0; border-bottom: 1px solid var(--color-border-light); font-size: 0.85rem;">
        <div style="display: flex; align-items: center; gap: var(--space-xs);">
          <img src="${product.image}" alt="${product.name}" style="width: 40px; height: 44px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--color-border-light);">
          <div>
            <div style="font-weight: 600; color: var(--color-primary);">${product.name}</div>
            <div style="font-size: 0.775rem; color: var(--color-text-muted);">Qty: ${item.quantity} &bull; ${this.formatPrice(product.price)}</div>
          </div>
        </div>
        <div style="font-weight: 600; color: var(--color-primary);">${this.formatPrice(itemTotal)}</div>
      </div>
    `;
  },

  /**
   * Renders the order summary in checkout sidebar
   */
  renderCheckoutSummary() {
    const itemsListEl = document.getElementById('checkout-items-list');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const shippingEl = document.getElementById('checkout-shipping');
    const taxEl = document.getElementById('checkout-tax');
    const totalEl = document.getElementById('checkout-total');

    if (!itemsListEl) return;

    const cart = typeof getCart === 'function' ? getCart() : [];
    if (!Array.isArray(cart) || cart.length === 0) return;

    if (typeof PRODUCTS !== 'undefined') {
      itemsListEl.innerHTML = cart.map(item => {
        const product = PRODUCTS.find(p => Number(p.id) === Number(item.id));
        return product ? this.createCheckoutItemHTML(item, product) : '';
      }).join('');
    }

    const subtotal = typeof calculateCartTotal === 'function' ? calculateCartTotal() : 0;
    const isFreeShipping = subtotal >= 75.00;
    const shipping = isFreeShipping ? 0 : 6.50;
    const tax = Number((subtotal * 0.06).toFixed(2));
    const grandTotal = subtotal + shipping + tax;

    if (subtotalEl) subtotalEl.textContent = this.formatPrice(subtotal);
    if (shippingEl) shippingEl.textContent = isFreeShipping ? 'FREE' : this.formatPrice(shipping);
    if (taxEl) taxEl.textContent = this.formatPrice(tax);
    if (totalEl) totalEl.textContent = this.formatPrice(grandTotal);
  }
};

console.log('[Paradise] render.js loaded successfully');
