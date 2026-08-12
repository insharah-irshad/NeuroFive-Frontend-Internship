/* =========================================================
   Pages — hero/listing, product detail, checkout summary.
   Each render*Page function mounts into #app.
   ========================================================= */
const Pages = (() => {
  const app = () => document.getElementById('app');
  const { el, fmt } = UI;

  let allProducts = [];
  let filterState = { q: '', category: 'all' };

  const CATEGORY_LABEL = { kurtis: 'Kurtis', outfits: 'Outfits', bags: 'Bags' };
  const CATEGORY_ICON = { kurtis: 'kurti', outfits: 'outfit', bags: 'tote' };

  function skeletonGrid(count = 8) {
    const grid = el('div', { class: 'product-grid' });
    for (let i = 0; i < count; i++) grid.appendChild(el('div', { class: 'skeleton skeleton-card' }));
    return grid;
  }

  function applyFilters(products) {
    return products.filter(p => {
      const matchesCategory = filterState.category === 'all' || p.category === filterState.category;
      const matchesQuery = p.title.toLowerCase().includes(filterState.q.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }

  function handleAddToCart(product, qty) {
    Store.addItem(product, qty);
    UI.showToast(`Added "${product.title.slice(0, 34)}${product.title.length > 34 ? '…' : ''}" to basket`, 'success');
    UI.bumpCartCount();
  }

  function handleQuickView(product) {
    const content = el('div', { class: 'detail-grid', style: 'grid-template-columns:1fr 1.2fr; gap:24px; padding-top:0;' }, [
      UI.ProductVisual(product, 'border:1px solid var(--line);aspect-ratio:1/1;padding:0;', ''),
      el('div', {}, [
        el('span', { class: 'card-cat' }, CATEGORY_LABEL[product.category] || product.category),
        el('p', { style: 'margin:10px 0 16px;color:var(--ink-soft);font-size:.92rem;' }, product.description.slice(0, 170) + '…'),
        UI.PriceTag(product.price)
      ])
    ]);
    UI.openModal({
      title: product.title,
      content,
      actions: [
        UI.Button({ label: 'Add to basket', variant: 'accent', onClick: () => handleAddToCart(product, 1) }),
        UI.Button({ label: 'View full details', variant: 'outline', onClick: () => { location.hash = `#/product/${product.id}`; } })
      ]
    });
  }

  function openProduct(product) {
    location.hash = `#/product/${product.id}`;
  }

  function renderHero() {
    const catCard = (key) => {
      const card = el('a', {
        href: '#/', class: 'hero-cat-card',
        onclick: (e) => {
          e.preventDefault();
          document.getElementById('category-select').value = key;
          setFilter({ category: key });
          document.querySelector('.page-head')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, [
        el('div', { html: UI.ICONS[CATEGORY_ICON[key]], style: 'width:34px;height:34px;color:var(--gold-deep);' }),
        el('span', {}, CATEGORY_LABEL[key])
      ]);
      return card;
    };

    return el('section', { class: 'hero' }, [
      el('span', { class: 'hero-eyebrow' }, 'IF Ateliers · Est. Modest Fashion'),
      el('h1', {}, ['Everyday elegance, ', el('em', {}, 'made intentional'), '.']),
      el('p', {}, 'Kurtis, outfits, and bags cut for movement and quiet detail — designed in small runs, made to be worn often.'),
      el('div', { class: 'hero-actions' }, [
        el('a', {
          href: '#/', class: 'btn btn-primary', onclick: (e) => {
            e.preventDefault();
            document.querySelector('.page-head')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 'Shop the Collection'),
        el('a', { href: '#/checkout', class: 'btn btn-outline' }, 'View Basket')
      ]),
      el('div', { class: 'hero-categories' }, [catCard('kurtis'), catCard('outfits'), catCard('bags')])
    ]);
  }

  async function renderListingPage() {
    app().innerHTML = '';
    app().classList.add('has-hero');

    const hero = renderHero();
    const head = el('div', { class: 'page-head' }, [
      el('div', {}, [
        el('span', { class: 'eyebrow' }, 'The Full Collection'),
        el('h1', {}, 'Shop All')
      ]),
      el('span', { class: 'result-count', id: 'result-count' }, '')
    ]);
    const gridWrap = el('div', {});
    const page = el('div', { class: 'page' }, [hero, head, gridWrap]);
    app().appendChild(page);
    gridWrap.appendChild(skeletonGrid());

    try {
      const [products, categories] = await Promise.all([Api.getProducts(), Api.getCategories()]);
      allProducts = products;
      populateCategorySelect(categories);
      renderGrid(gridWrap);
    } catch (err) {
      gridWrap.innerHTML = '';
      gridWrap.appendChild(el('div', { class: 'state-block' }, [
        el('h3', {}, 'The collection is unavailable'),
        el('p', {}, 'Something went wrong loading products. Please refresh to try again.')
      ]));
    }
  }

  function populateCategorySelect(categories) {
    const select = document.getElementById('category-select');
    if (select.dataset.filled) return;
    categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = CATEGORY_LABEL[cat] || cat.replace(/\b\w/g, c => c.toUpperCase());
      select.appendChild(opt);
    });
    select.dataset.filled = 'true';
  }

  function renderGrid(container) {
    container.innerHTML = '';
    const filtered = applyFilters(allProducts);
    const countEl = document.getElementById('result-count');
    if (countEl) countEl.textContent = `${filtered.length} piece${filtered.length === 1 ? '' : 's'}`;

    if (!filtered.length) {
      container.appendChild(el('div', { class: 'state-block' }, [
        el('h3', {}, 'Nothing matches that search'),
        el('p', {}, 'Try a different keyword or department.')
      ]));
      return;
    }
    const grid = el('div', { class: 'product-grid' });
    filtered.forEach((p, i) => {
      const card = UI.ProductCard(
        { ...p, category: CATEGORY_LABEL[p.category] || p.category },
        { onAddToCart: handleAddToCart, onQuickView: handleQuickView, onOpen: () => openProduct(p) }
      );
      card.style.animationDelay = `${Math.min(i, 10) * 40}ms`;
      grid.appendChild(card);
    });
    container.appendChild(grid);
  }

  function setFilter(partial) {
    filterState = { ...filterState, ...partial };
    const hash = location.hash.replace(/^#/, '') || '/';
    if (hash !== '/') return; // filters only apply on the listing page
    const gridWrap = app().querySelector('.page > div:last-child');
    if (gridWrap) renderGrid(gridWrap);
  }

  async function renderDetailPage(id) {
    app().classList.remove('has-hero');
    app().innerHTML = '';
    const page = el('div', { class: 'page' });
    page.appendChild(el('div', { class: 'detail-grid' }, [
      el('div', { class: 'skeleton', style: 'aspect-ratio:4/5;' }),
      el('div', {}, [el('div', { class: 'skeleton', style: 'height:28px;width:70%;margin-bottom:14px;' })])
    ]));
    app().appendChild(page);

    try {
      const product = await Api.getProduct(id);
      let qty = 1;
      page.innerHTML = '';

      const qtyWrap = el('div', {});
      const renderQty = () => {
        qtyWrap.innerHTML = '';
        qtyWrap.appendChild(UI.QtyStepper(qty, { onChange: (q) => { qty = Math.max(1, q); renderQty(); } }));
      };
      renderQty();

      const grid = el('div', { class: 'detail-grid' }, [
        UI.ProductVisual(product, 'border:1px solid var(--line);padding:0;', 'detail-media'),
        el('div', { class: 'detail-info' }, [
          el('span', { class: 'card-cat' }, CATEGORY_LABEL[product.category] || product.category),
          el('h1', {}, product.title),
          el('div', { class: 'rating-row' }, [
            el('span', { class: 'stars' }, '★'.repeat(Math.round(product.rating?.rate || 4))),
            el('span', {}, `${product.rating?.rate ?? '—'} (${product.rating?.count ?? 0} reviews)`)
          ]),
          el('p', { class: 'detail-desc' }, product.description),
          el('div', { class: 'detail-price-row' }, [UI.PriceTag(product.price)]),
          el('div', { class: 'detail-actions' }, [
            qtyWrap,
            UI.Button({
              label: 'Add to basket', variant: 'accent',
              onClick: () => handleAddToCart(product, qty)
            }),
            UI.Button({ label: 'Open basket', variant: 'outline', onClick: () => UI.openCartDrawer() })
          ])
        ])
      ]);
      page.appendChild(grid);
      page.appendChild(el('a', { href: '#/', class: 'back-link' }, '← Back to shop'));
    } catch (err) {
      page.innerHTML = '';
      page.appendChild(el('div', { class: 'state-block' }, [
        el('h3', {}, 'Piece not found'),
        el('p', {}, 'That item may have sold out.'),
        el('a', { href: '#/', class: 'back-link' }, '← Back to shop')
      ]));
    }
  }

  function renderCheckoutPage() {
    app().classList.remove('has-hero');
    app().innerHTML = '';
    const items = Store.getItems();
    const page = el('div', { class: 'page' });

    if (!items.length) {
      page.appendChild(el('div', { class: 'state-block' }, [
        el('h3', {}, 'Your basket is empty'),
        el('p', {}, 'Add a few pieces before checking out.'),
        el('a', { href: '#/', class: 'btn btn-primary', style: 'margin-top:16px;display:inline-flex;' }, 'Back to shop')
      ]));
      app().appendChild(page);
      return;
    }

    const subtotal = Store.getSubtotal();
    const shipping = subtotal > 100 ? 0 : 7.5;
    const tax = subtotal * 0.075;
    const total = subtotal + shipping + tax;

    const form = el('form', { class: 'checkout-form' }, [
      el('h2', {}, 'Delivery details'),
      el('div', { class: 'field-row' }, [
        el('div', { class: 'field' }, [el('label', {}, 'First name'), el('input', { required: 'true', placeholder: 'Amina' })]),
        el('div', { class: 'field' }, [el('label', {}, 'Last name'), el('input', { required: 'true', placeholder: 'Fatima' })])
      ]),
      el('div', { class: 'field' }, [el('label', {}, 'Email'), el('input', { type: 'email', required: 'true', placeholder: 'amina@example.com' })]),
      el('div', { class: 'field' }, [el('label', {}, 'Shipping address'), el('input', { required: 'true', placeholder: 'Street, apartment' })]),
      el('div', { class: 'field-row' }, [
        el('div', { class: 'field' }, [el('label', {}, 'City'), el('input', { required: 'true', placeholder: 'Karachi' })]),
        el('div', { class: 'field' }, [el('label', {}, 'Postal code'), el('input', { required: 'true', placeholder: '74000' })])
      ]),
      el('h2', { style: 'margin-top:24px' }, 'Payment'),
      el('div', { class: 'field-row' }, [
        el('div', { class: 'field' }, [el('label', {}, 'Card number'), el('input', { required: 'true', placeholder: '4242 4242 4242 4242', inputmode: 'numeric' })]),
        el('div', { class: 'field' }, [el('label', {}, 'Expiry'), el('input', { required: 'true', placeholder: 'MM/YY' })])
      ]),
      UI.Button({ label: `Place order — $${fmt(total)}`, variant: 'accent', size: '', attrs: { type: 'submit', class: 'btn btn-accent btn-block' } })
    ]);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      renderConfirmation(total);
      Store.clear();
    });

    const summary = el('aside', { class: 'order-summary' }, [
      el('h2', {}, 'Order summary'),
      ...items.map(i => el('div', { class: 'summary-line-item' }, [
        el('span', {}, `${i.title.slice(0, 30)}${i.title.length > 30 ? '…' : ''} × ${i.qty}`),
        el('span', {}, `$${fmt(i.price * i.qty)}`)
      ])),
      el('div', { class: 'summary-row' }, [el('span', {}, 'Subtotal'), el('span', {}, `$${fmt(subtotal)}`)]),
      el('div', { class: 'summary-row' }, [el('span', {}, 'Shipping'), el('span', {}, shipping === 0 ? 'Free' : `$${fmt(shipping)}`)]),
      el('div', { class: 'summary-row' }, [el('span', {}, 'Tax (7.5%)'), el('span', {}, `$${fmt(tax)}`)]),
      el('div', { class: 'summary-row total' }, [el('span', {}, 'Total'), el('span', {}, `$${fmt(total)}`)])
    ]);

    page.appendChild(el('div', { class: 'page-head' }, [el('h1', {}, 'Checkout')]));
    page.appendChild(el('div', { class: 'checkout-grid' }, [form, summary]));
    app().appendChild(page);
  }

  function renderConfirmation(total) {
    app().innerHTML = '';
    const page = el('div', { class: 'page confirmation' }, [
      el('div', { class: 'stamp' }, '✓'),
      el('h1', {}, 'Order placed'),
      el('p', { style: 'color:var(--ink-soft);max-width:44ch;margin:0 auto 22px;' },
        `Thank you for shopping IF Ateliers — your order total was $${fmt(total)}. This is a demo checkout, so nothing was actually charged.`),
      el('a', { href: '#/', class: 'btn btn-primary' }, 'Continue shopping')
    ]);
    app().appendChild(page);
  }

  return { renderListingPage, renderDetailPage, renderCheckoutPage, setFilter };
})();
