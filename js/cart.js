/**
 * Paradise Clothing - Shopping Cart & Orders System
 * Manages bag persistence, totals, and simulated order recording.
 *
 * Cart Data Structure:
 * [
 *   {
 *     "id": 1,
 *     "quantity": 2
 *   }
 * ]
 */

const CART_STORAGE_KEY = 'cart';

/**
 * Retrieves the current cart array from localStorage
 * @returns {Array<{id: number, quantity: number}>}
 */
function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('[Paradise Cart] Error reading cart from localStorage', err);
    return [];
  }
}

/**
 * Persists cart array to localStorage and notifies listeners
 * @param {Array} cart
 */
function saveCart(cart) {
  try {
    const validCart = Array.isArray(cart) ? cart : [];
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(validCart));

    // Update navbar badge immediately
    updateCartBadge();

    // Broadcast cart change event
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart: validCart } }));
  } catch (err) {
    console.error('[Paradise Cart] Error saving cart to localStorage', err);
  }
}

/**
 * Adds a product to the cart. If product exists, increments quantity.
 * @param {number|string} productId
 * @param {number} [quantity=1]
 * @returns {Array} Updated cart
 */
function addToCart(productId, quantity = 1) {
  const id = Number(productId);
  const qty = Math.max(1, Number(quantity) || 1);
  const cart = getCart();

  const existingIndex = cart.findIndex(item => Number(item.id) === id);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += qty;
  } else {
    cart.push({ id, quantity: qty });
  }

  saveCart(cart);
  return cart;
}

/**
 * Removes a product completely from the cart
 * @param {number|string} productId
 * @returns {Array} Updated cart
 */
function removeFromCart(productId) {
  const id = Number(productId);
  const cart = getCart();
  const updated = cart.filter(item => Number(item.id) !== id);
  saveCart(updated);
  return updated;
}

/**
 * Updates the quantity of a product in the cart
 * If quantity <= 0, the item is removed.
 * @param {number|string} productId
 * @param {number} newQuantity
 * @returns {Array} Updated cart
 */
function updateQuantity(productId, newQuantity) {
  const id = Number(productId);
  const qty = Number(newQuantity);

  if (isNaN(qty) || qty <= 0) {
    return removeFromCart(id);
  }

  const cart = getCart();
  const item = cart.find(i => Number(i.id) === id);
  if (item) {
    item.quantity = Math.floor(qty);
    saveCart(cart);
  }
  return cart;
}

/**
 * Completely clears all items from the cart
 * @returns {Array} Empty array
 */
function clearCart() {
  saveCart([]);
  return [];
}

/**
 * Calculates overall cart subtotal based on product prices from PRODUCTS catalog
 * @returns {number} Subtotal in USD
 */
function calculateCartTotal() {
  const cart = getCart();
  if (!Array.isArray(cart) || cart.length === 0 || typeof PRODUCTS === 'undefined') {
    return 0;
  }

  return cart.reduce((total, item) => {
    const product = PRODUCTS.find(p => Number(p.id) === Number(item.id));
    if (product && typeof product.price === 'number') {
      return total + (product.price * (Number(item.quantity) || 1));
    }
    return total;
  }, 0);
}

/**
 * Computes total quantity of all items in cart
 * @returns {number}
 */
function getCartItemCount() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
}

/**
 * Updates all cart badge elements across the page
 */
function updateCartBadge() {
  const count = getCartItemCount();
  const badges = document.querySelectorAll('#cart-count');
  badges.forEach(badge => {
    badge.textContent = count;
  });

  // Sync mobile drawer cart buttons dynamically
  const mobileCartButtons = document.querySelectorAll('.mobile-cart-btn, .mobile-auth-actions .btn-primary');
  mobileCartButtons.forEach(btn => {
    btn.textContent = count > 0 ? `View Bag (${count})` : 'View Bag';
  });
}

/**
 * Orders Persistence System
 */
const ORDERS_STORAGE_KEY = 'orders';

/**
 * Retrieves list of orders from localStorage
 * @returns {Array<Object>}
 */
function getOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('[Paradise Orders] Error loading orders from localStorage', err);
    return [];
  }
}

/**
 * Saves a new order into localStorage under 'orders' and clears the cart
 * @param {Object} orderData
 * @returns {Object} saved order
 */
function saveOrder(orderData) {
  const orders = getOrders();
  const newOrder = {
    id: orderData.id || `ORD-${Date.now().toString().slice(-6)}`,
    items: orderData.items || [],
    total: Number(orderData.total) || 0,
    date: orderData.date || new Date().toISOString()
  };

  orders.unshift(newOrder);

  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error('[Paradise Orders] Error saving order to localStorage', err);
  }

  // Clear cart upon order completion
  clearCart();

  // Notify listeners
  window.dispatchEvent(new CustomEvent('order:placed', { detail: { order: newOrder } }));

  return newOrder;
}

// Global Cart object namespace for backward compatibility and clean API
const Cart = {
  getCart,
  saveCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  calculateCartTotal,
  getItemCount: getCartItemCount,
  updateBadge: updateCartBadge,
  getOrders,
  saveOrder
};

// Sync badge on storage events across tabs
window.addEventListener('storage', (e) => {
  if (e.key === CART_STORAGE_KEY) {
    updateCartBadge();
  }
});

console.log('[Paradise] cart.js loaded successfully');
