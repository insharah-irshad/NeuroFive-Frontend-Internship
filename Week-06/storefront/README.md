# IF Ateliers — Capstone Storefront

A small, fully client-side e-commerce storefront for a modest-fashion brand —
kurtis, outfits, and bags. Built with plain HTML, CSS, and JavaScript (no
framework, no build step), reading from a local product catalog.

## Run it locally

Browsers block `fetch()` on pages opened directly from disk (`file://`), so
serve the folder instead of double-clicking `index.html`:

```bash
cd storefront
python3 -m http.server 8080
# then open http://localhost:8080
```

Any static server works (`npx serve`, VS Code's Live Server, etc.) — there's
nothing to install or compile.

## What's inside

```
storefront/
├── index.html          app shell: header, hero, cart drawer, mount points
├── style.css             design tokens + full stylesheet (IF Ateliers brand)
├── data/
│   └── products.json    local catalog: kurtis, outfits, bags
└── js/
    ├── api.js            reads the local catalog + in-memory cache
    ├── store.js           cart state + localStorage persistence
    ├── ui.js               reusable UI kit: Button, Card, Modal, Toast, PriceTag, QtyStepper
    ├── pages.js           hero/listing, product detail, checkout page renderers
    ├── router.js          tiny hash-based router (#/, #/product/:id, #/checkout)
    └── main.js             wires everything together on load
```

## Brand

**IF Ateliers** — an ivory-and-ink palette with a muted gold accent, paired
with Cormorant Garamond (display) and Inter/Jost (body/UI). Product photos
are sourced from Unsplash (free license, no attribution required) — one
representative photo per garment/bag type (kurti, outfit, tote, clutch,
crossbody). If a photo ever fails to load, the card automatically falls back
to a hand-drawn line-art glyph on a fabric-swatch color tile instead of a
broken image icon, so the layout never breaks.

## Features

- **Hero landing section** on the home route: brand statement, two CTAs
  (Shop the Collection / View Basket), and three category quick-links
  (Kurtis, Outfits, Bags) that jump straight into a filtered grid.
- **Product listing** read from a local JSON catalog, with a skeleton
  loading state and an empty state if a search/filter combo returns nothing.
- **Search + category filtering**, combined and debounced, running entirely
  client-side.
- **Cart**: add, remove, adjust quantity, live running subtotal — through a
  slide-out drawer available from any page.
- **Persistence**: the cart is written to `localStorage` on every change and
  reloaded on startup, so it survives a refresh or closed tab.
- **Product detail page** (`#/product/:id`) with quantity stepper, rating,
  and full description.
- **Checkout summary page** (`#/checkout`) with a delivery/payment form (no
  real payment processing), an order summary with tax/shipping math, and a
  confirmation screen that clears the cart on submit.
- **Reusable UI kit** (`js/ui.js`): a Button, ProductCard, Modal, Toast, and
  QtyStepper factory used identically across the listing, detail, quick-view
  modal, cart drawer, and checkout page.
- **Responsive** down to small phones (single-column grid, full-width
  drawer, stacked checkout layout, stacked hero categories).
- **Animations**: staggered card entrance, a hero entrance sequence, a
  cart-count "bump" on add, a slide-in cart drawer, page fade transitions on
  route change, and a hover lift/rotate on product tiles.

## Case study (write-up)

I built IF Ateliers, a modest-fashion storefront covering kurtis, outfits,
and bags, with a full shopping flow layered on a local product catalog:
browse from a hero landing section, search/filter, quick-view, add to cart,
adjust quantities, and check out. The biggest technical decision was going
framework-free with a tiny hash router and a hand-rolled `el()` DOM helper,
which kept the bundle at zero dependencies and made the "reuse your UI kit"
requirement concrete — the same `Button`, `ProductCard`, `Modal`, and `Toast`
factories are called from four different views rather than re-implemented.
I also chose to represent every product as a line-art glyph on a
fabric-swatch tile instead of hotlinked photography, which became the
brand's signature visual device and meant the demo can't break from a dead
image link mid-recording. Cart state lives in a small pub/sub store that
writes to `localStorage` on every mutation, which I verified with an
automated smoke test that pre-seeds `localStorage`, reloads the app, and
confirms the drawer badge and subtotal come back unchanged. Given more time,
I'd add real product photography behind a CMS, inline form validation with
error states on checkout, unit tests around the cart math (tax/shipping edge
cases), and a service-worker cache so the catalog works offline too.
