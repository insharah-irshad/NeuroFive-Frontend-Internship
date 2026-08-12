/* =========================================================
   API layer — reads the local product catalog (data/products.json)
   with a small in-memory cache so switching pages is instant.
   ========================================================= */
const Api = (() => {
  let productsCache = null;
  const productById = new Map();

  async function getProducts() {
    if (productsCache) return productsCache;
    const res = await fetch('data/products.json');
    if (!res.ok) throw new Error('Could not load the collection');
    productsCache = await res.json();
    productsCache.forEach(p => productById.set(String(p.id), p));
    return productsCache;
  }

  async function getCategories() {
    const products = await getProducts();
    return [...new Set(products.map(p => p.category))];
  }

  async function getProduct(id) {
    await getProducts(); // ensure cache is warm
    const product = productById.get(String(id));
    if (!product) throw new Error('Product not found');
    return product;
  }

  return { getProducts, getCategories, getProduct };
})();
