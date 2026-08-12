/* =========================================================
   Router — tiny hash-based router. No build step needed,
   works when the app is opened as static files.
   ========================================================= */
const Router = (() => {
  const routes = [];

  function add(pattern, handler) {
    // pattern like '/product/:id' -> regex with named group
    const regex = new RegExp('^' + pattern.replace(/:[^/]+/g, '([^/]+)') + '$');
    routes.push({ regex, handler });
  }

  function resolve() {
    const hash = location.hash.replace(/^#/, '') || '/';
    for (const route of routes) {
      const match = hash.match(route.regex);
      if (match) {
        route.handler(...match.slice(1));
        window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
        return;
      }
    }
    // fallback
    routes[0]?.handler();
  }

  function start() {
    window.addEventListener('hashchange', resolve);
    window.addEventListener('DOMContentLoaded', resolve);
    if (document.readyState !== 'loading') resolve();
  }

  return { add, start };
})();
