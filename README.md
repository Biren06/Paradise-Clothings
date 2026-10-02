# Paradise Clothing

A modern, responsive e-commerce storefront for a coastal lifestyle apparel brand built entirely with vanilla web technologies.

"Wear the vibe, not the trend."

---

## Project Overview

**Paradise Clothing** is a warm, coastal-inspired e-commerce storefront designed to showcase modern front-end design, data-driven catalog rendering, live client-side multi-filtering, shopping bag management, and client-side authentication/checkout simulations.

The design emphasizes warm editorial aesthetics, natural linen and coastal sand tones (`#F7F1E7`, `#FFFDF8`, `#D8C6AA`, `#304A52`, `#65776C`, `#806B55`), Cormorant Garamond and DM Sans typography, generous whitespace, and full responsiveness across mobile, tablet, and desktop screens.

---

## Features

- **Responsive Navigation**: Adaptive desktop navbar and mobile slide-down drawer with cart counter synchronization and touch-accessible tap targets.
- **Data-Driven Catalog**: Reusable product card rendering across both Homepage featured drops and the Shop catalog.
- **Client-Side Search & Multi-Filtering**:
  - Filter by Gender (*All*, *Men*, *Women*, *Kids*)
  - Filter by Clothing Type (*All*, *Tops*, *Bottoms*)
  - Real-time text search by product name
  - Compound filtering (e.g., *Women + Tops + Search*)
  - URL query parameter deep linking (`shop.html?gender=women`)
  - Informative empty state with one-click filter reset
- **Persistent Shopping Bag**:
  - Add to bag from any product card with debounced feedback
  - Incremental quantities for repeated adds
  - Quantity steppers (`+` / `−`) and single-item removal
  - Subtotal, 6% estimated tax, and dynamic free shipping threshold ($75.00)
  - Persists across page refreshes and browser sessions via `localStorage`
- **Frontend Authentication Simulation**:
  - Tabbed Sign In and Registration forms
  - Form validation (full name, valid email, minimum 6-character passwords, matching passwords)
  - Enforced registration prior to login (*"No account found. Please sign up first."*)
  - Duplicate account prevention
  - Customer dashboard with active session status and placed orders counter
  - Persistent login state across browser reloads and logout functionality
- **Simulated Checkout Flow**:
  - Enforces login requirement prior to checkout (preserves checkout intent)
  - Pre-fills shipping details from registered profile
  - Live order summary breakdown
  - Unique order ID generation (`ORD-XXXXXX`)
  - Order persistence in `localStorage["orders"]` and automatic cart clearing
  - Order confirmation receipt with link back to homepage

---

## Tech Stack

- **HTML5**: Clean, accessible, semantic markup with zero inline JavaScript.
- **CSS3**: Custom design tokens (CSS variables), Flexbox, CSS Grid layouts, and responsive media queries.
- **JavaScript (ES6+)**: Vanilla modular architecture without external UI libraries or dependencies.
- **Web Storage API**: `localStorage` for state persistence (`cart`, `user`, `isLoggedIn`, `orders`).

---

## Project Structure

```text
paradise/
├── index.html              # Homepage: Hero, categories, featured drops, club CTA
├── shop.html               # Shop: Catalog, compound filter toolbar, search
├── cart.html               # Shopping Bag: Item rows, steppers, order summary
├── login.html              # Customer Portal: Login, register, member dashboard
├── checkout.html           # Checkout Flow: Shipping destination & receipt screen
├── css/
│   └── style.css           # Master stylesheet (variables, components, responsive)
├── js/
│   ├── data.js             # Shared clothing catalog array (PRODUCTS) & config
│   ├── render.js           # Reusable HTML template generators (Render object)
│   ├── cart.js             # Cart & Orders operations (localStorage management)
│   ├── auth.js             # Authentication simulation & session state helpers
│   └── main.js             # Application controller & interactive event listeners
└── assets/
    ├── logo/               # Brand logos and responsive favicons
    ├── hero/               # Hero background imagery
    ├── categories/         # Category banner photography (Men, Women, Kids)
    └── products/           # Product apparel photography
```

---

## How to Run the Project

This project is completely static and requires no build tools or package managers.

### Option 1: Live Server or Local HTTP Server
Run any local static file server from the project directory:

```bash
# Using Python 3:
python3 -m http.server 8000

# Using Node.js npx:
npx serve .
```

Then open `http://localhost:8000` in your browser.

### Option 2: Direct Browser Opening
You can also open `index.html` directly in any modern browser.

### Option 3: Static Hosting / GitHub Pages
Deploy directly to GitHub Pages, Netlify, Vercel, or Cloudflare Pages with zero configuration needed.

---

## Important Note on Authentication & Checkout

> **Disclaimer**: The authentication and checkout systems in this project are **frontend demonstrations** designed for portfolio display.
> - Credentials and sessions are saved locally in browser `localStorage`.
> - There is no backend server or database connected.
> - No real credit card or payment gateway processing occurs.
