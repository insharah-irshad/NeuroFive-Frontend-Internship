/* =========================================================
   Main — registers routes and wires header/cart interactions.
   ========================================================= */
(function init() {
  Router.add('/', () => Pages.renderListingPage());
  Router.add('/product/:id', (id) => Pages.renderDetailPage(id));
  Router.add('/checkout', () => Pages.renderCheckoutPage());
  Router.start();

  // Search + filter (debounced search)
  let debounceTimer;
  document.getElementById('search-input').addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    const value = e.target.value;
    debounceTimer = setTimeout(() => Pages.setFilter({ q: value }), 180);
  });
  document.getElementById('category-select').addEventListener('change', (e) => {
    Pages.setFilter({ category: e.target.value });
  });

  // Cart drawer open/close
  document.getElementById('cart-toggle').addEventListener('click', UI.openCartDrawer);
  document.getElementById('cart-close').addEventListener('click', UI.closeCartDrawer);
  document.getElementById('cart-drawer-backdrop').addEventListener('click', UI.closeCartDrawer);
  document.getElementById('checkout-link').addEventListener('click', UI.closeCartDrawer);

  // Keep drawer + badge in sync with store changes, and persist across refresh
  UI.renderCartDrawer();
  Store.onChange(() => UI.renderCartDrawer());
})();
