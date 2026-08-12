/* =========================================================
   Store — cart state + localStorage persistence.
   Simple pub/sub so UI pieces (badge, drawer) stay in sync.
   ========================================================= */
const Store = (() => {
  const CART_KEY = 'ifateliers_cart_v1';
  let listeners = [];

  function load() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn('Cart failed to load, starting fresh.', e);
      return [];
    }
  }

  let cart = load(); // [{ id, title, price, swatch, icon, qty }]

  function persist() {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Cart failed to save.', e);
    }
    listeners.forEach(fn => fn(cart));
  }

  function onChange(fn) {
    listeners.push(fn);
    return () => { listeners = listeners.filter(l => l !== fn); };
  }

  function addItem(product, qty = 1) {
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        swatch: product.swatch,
        icon: product.icon,
        image: product.image,
        qty
      });
    }
    persist();
  }

  function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    persist();
  }

  function setQty(id, qty) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty = Math.max(1, qty);
    persist();
  }

  function clear() {
    cart = [];
    persist();
  }

  function getItems() { return cart; }

  function getCount() {
    return cart.reduce((sum, i) => sum + i.qty, 0);
  }

  function getSubtotal() {
    return cart.reduce((sum, i) => sum + i.qty * i.price, 0);
  }

  return { addItem, removeItem, setQty, clear, getItems, getCount, getSubtotal, onChange };
})();
