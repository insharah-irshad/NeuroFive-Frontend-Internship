/* =========================================================
   UI kit — small reusable pieces used across every page:
   Button, Card, Modal, Toast, PriceTag, QtyStepper, CartDrawer.
   Also houses the line-art garment/bag icon set used in place
   of product photography (keeps the demo fast + dependency-free).
   ========================================================= */
const UI = (() => {

  const fmt = (n) => n.toFixed(2);

  const SWATCH = {
    black: 'var(--swatch-black)',
    sand:  'var(--swatch-sand)',
    blush: 'var(--swatch-blush)',
    sage:  'var(--swatch-sage)',
    gold:  'var(--swatch-gold)'
  };

  // Line-art icon set — single-stroke, minimal, all share a 0 0 100 100 viewBox.
  const ICONS = {
    kurti: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M38 14 L50 22 L62 14 L72 26 L64 34 L64 30 L60 84 L40 84 L36 30 L36 34 L28 26 Z" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M50 22 L46 30 L50 36 L54 30 Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
    </svg>`,
    outfit: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 12 L50 20 L60 12 L68 24 L61 30 L58 26 L64 50 L74 82 L26 82 L36 50 L42 26 L39 30 L32 24 Z" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M42 26 L58 26" stroke="currentColor" stroke-width="1.6"/>
    </svg>`,
    tote: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M28 38 Q28 20 50 20 Q72 20 72 38" stroke="currentColor" stroke-width="2.2" fill="none"/>
      <rect x="20" y="38" width="60" height="46" rx="2" stroke="currentColor" stroke-width="2.2"/>
      <line x1="20" y1="52" x2="80" y2="52" stroke="currentColor" stroke-width="1.4" opacity=".5"/>
    </svg>`,
    clutch: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="18" y="46" width="64" height="38" rx="3" stroke="currentColor" stroke-width="2.2"/>
      <path d="M18 46 L50 26 L82 46" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/>
      <circle cx="50" cy="46" r="2.4" fill="currentColor"/>
    </svg>`,
    crossbody: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 20 L76 82" stroke="currentColor" stroke-width="2" opacity=".55"/>
      <rect x="30" y="42" width="40" height="34" rx="3" stroke="currentColor" stroke-width="2.2"/>
      <path d="M38 42 Q38 30 50 30 Q62 30 62 42" stroke="currentColor" stroke-width="2"/>
    </svg>`
  };

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'class') node.className = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
      else if (v !== undefined && v !== null) node.setAttribute(k, v);
    });
    (Array.isArray(children) ? children : [children]).forEach(c => {
      if (c === null || c === undefined) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  function swatchStyle(swatchKey) {
    const bg = SWATCH[swatchKey] || SWATCH.sand;
    const isDark = swatchKey === 'black';
    return `background:${bg}; color:${isDark ? 'var(--ivory)' : 'var(--ink)'};`;
  }

  function IconGlyph(iconKey, swatchKey, extraStyle = '', extraClass = '') {
    return el('div', {
      class: `card-media ${extraClass}`.trim(),
      style: `${swatchStyle(swatchKey)} ${extraStyle}`,
      html: ICONS[iconKey] || ICONS.kurti
    });
  }

  // Product visual: shows the real photo; falls back to the line-art glyph
  // on a swatch tile automatically if the image can't load (offline demo,
  // dead link, etc.) so the layout never breaks.
  function ProductVisual(product, extraStyle = '', extraClass = '') {
    const wrap = el('div', { class: `card-media ${extraClass}`.trim(), style: `${swatchStyle(product.swatch)} ${extraStyle}` });
    if (product.image) {
      const img = el('img', {
        src: product.image,
        alt: product.title,
        loading: 'lazy',
        class: 'product-photo',
        onerror: function () {
          wrap.classList.add('media-fallback');
          wrap.innerHTML = ICONS[product.icon] || ICONS.kurti;
        }
      });
      wrap.appendChild(img);
    } else {
      wrap.innerHTML = ICONS[product.icon] || ICONS.kurti;
    }
    return wrap;
  }

  // ---- Button ----
  function Button({ label, variant = 'primary', size = '', onClick, disabled = false, attrs = {} }) {
    return el('button', {
      class: `btn btn-${variant} ${size ? 'btn-' + size : ''}`.trim(),
      onclick: onClick,
      ...(disabled ? { disabled: 'disabled' } : {}),
      ...attrs
    }, label);
  }

  // ---- Price tag (signature element) ----
  function PriceTag(amount) {
    return el('span', { class: 'price-tag' }, fmt(amount));
  }

  // ---- Product card ----
  function ProductCard(product, { onAddToCart, onQuickView, onOpen }) {
    const media = ProductVisual(product, 'cursor:pointer;');
    media.addEventListener('click', () => onOpen(product));
    media.appendChild(Button({
      label: 'Quick view', variant: 'primary', size: 'sm',
      attrs: { class: 'quick-view-btn' },
      onClick: (e) => { e.stopPropagation(); onQuickView(product); }
    }));

    const card = el('article', { class: 'product-card' }, [
      media,
      el('div', { class: 'card-body' }, [
        el('span', { class: 'card-cat' }, product.category),
        el('h3', { class: 'card-title' }, product.title),
        el('div', { class: 'card-foot' }, [
          PriceTag(product.price),
          Button({
            label: 'Add', variant: 'accent', size: 'sm',
            onClick: () => onAddToCart(product, 1)
          })
        ])
      ])
    ]);
    return card;
  }

  // ---- Qty stepper ----
  function QtyStepper(qty, { onChange }) {
    const label = el('span', {}, String(qty));
    const dec = el('button', { onclick: () => onChange(qty - 1), 'aria-label': 'Decrease quantity' }, '−');
    const inc = el('button', { onclick: () => onChange(qty + 1), 'aria-label': 'Increase quantity' }, '+');
    return el('div', { class: 'qty-stepper' }, [dec, label, inc]);
  }

  // ---- Toast ----
  function showToast(message, type = 'success') {
    const root = document.getElementById('toast-root');
    const toast = el('div', { class: `toast ${type}` }, message);
    root.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('leave');
      setTimeout(() => toast.remove(), 260);
    }, 2200);
  }

  // ---- Modal ----
  function openModal({ title, content, actions = [] }) {
    const root = document.getElementById('modal-root');
    root.innerHTML = '';
    const close = () => { root.innerHTML = ''; document.removeEventListener('keydown', onKey); };
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);

    const box = el('div', { class: 'modal-box', role: 'dialog', 'aria-modal': 'true' }, [
      el('div', { class: 'modal-head' }, [
        el('h2', {}, title),
        el('button', { class: 'icon-btn', 'aria-label': 'Close', onclick: close }, '✕')
      ]),
      content
    ]);
    if (actions.length) {
      box.appendChild(el('div', { class: 'detail-actions', style: 'margin-top:20px' }, actions));
    }
    const backdrop = el('div', { class: 'modal-backdrop', onclick: (e) => { if (e.target === backdrop) close(); } }, [box]);
    root.appendChild(backdrop);
    return close;
  }

  // ---- Cart drawer ----
  function renderCartDrawer() {
    const itemsRoot = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('cart-subtotal');
    const items = Store.getItems();

    itemsRoot.innerHTML = '';
    if (!items.length) {
      itemsRoot.appendChild(el('div', { class: 'state-block' }, [
        el('h3', {}, 'Your basket is empty'),
        el('p', {}, 'Add something from the collection.')
      ]));
    } else {
      items.forEach(item => {
        const thumb = el('div', { class: 'thumb', style: swatchStyle(item.swatch) });
        if (item.image) {
          thumb.appendChild(el('img', {
            src: item.image, alt: item.title, class: 'product-photo',
            onerror: function () { thumb.innerHTML = ICONS[item.icon] || ICONS.kurti; }
          }));
        } else {
          thumb.innerHTML = ICONS[item.icon] || ICONS.kurti;
        }
        const row = el('div', { class: 'cart-row' }, [
          thumb,
          el('div', { class: 'cart-row-info' }, [
            el('div', { class: 'title' }, item.title),
            el('div', { class: 'unit-price' }, `$${fmt(item.price)} · each`),
            el('button', { class: 'row-remove', onclick: () => Store.removeItem(item.id) }, 'Remove')
          ]),
          QtyStepper(item.qty, { onChange: (q) => q <= 0 ? Store.removeItem(item.id) : Store.setQty(item.id, q) })
        ]);
        itemsRoot.appendChild(row);
      });
    }
    subtotalEl.textContent = `$${fmt(Store.getSubtotal())}`;
    document.getElementById('cart-count').textContent = Store.getCount();
  }

  function bumpCartCount() {
    const badge = document.getElementById('cart-count');
    badge.classList.remove('bump');
    void badge.offsetWidth; // restart animation
    badge.classList.add('bump');
  }

  function openCartDrawer() {
    document.getElementById('cart-drawer').classList.add('open');
    document.getElementById('cart-drawer').setAttribute('aria-hidden', 'false');
    document.getElementById('cart-drawer-backdrop').hidden = false;
    requestAnimationFrame(() => document.getElementById('cart-drawer-backdrop').classList.add('open'));
  }
  function closeCartDrawer() {
    document.getElementById('cart-drawer').classList.remove('open');
    document.getElementById('cart-drawer').setAttribute('aria-hidden', 'true');
    document.getElementById('cart-drawer-backdrop').classList.remove('open');
    setTimeout(() => { document.getElementById('cart-drawer-backdrop').hidden = true; }, 250);
  }

  return {
    el, fmt, ICONS, swatchStyle, IconGlyph, ProductVisual, Button, PriceTag, ProductCard, QtyStepper,
    showToast, openModal, renderCartDrawer, bumpCartCount,
    openCartDrawer, closeCartDrawer
  };
})();
