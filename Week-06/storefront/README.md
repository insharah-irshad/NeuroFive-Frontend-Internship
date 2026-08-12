# Week 6 Capstone E-Commerce Storefront

A fully responsive client-side e-commerce storefront for **IF Ateliers**, a modest-fashion brand featuring kurtis, outfits, and bags. This project was developed as the **Capstone Frontend Mini App** during the NeuroFive Solutions Frontend Development Internship.

The project brings together the frontend concepts covered throughout the internship, including responsive layouts, DOM manipulation, reusable components, animations, search and filtering, routing, forms, local data handling, and `localStorage` persistence.

## Overview

IF Ateliers provides a complete shopping experience where users can:

* Explore products through a branded landing page
* Browse kurtis, outfits, and bags
* Search and filter products
* View individual product details
* Add products to a shopping cart
* Update product quantities
* Remove products from the cart
* View a live cart subtotal
* Continue to a checkout summary
* Submit a delivery/payment form
* Refresh or reopen the page without losing their cart

No real payment processing is included.

## Capstone Requirements Covered

This project fulfills the required Capstone features:

* Product listing using a **local JSON product catalog**
* Search and category filtering
* Shopping cart with add, remove, and quantity controls
* Live running cart subtotal
* Cart persistence using `localStorage`
* Product detail view
* Checkout summary page
* Responsive design for desktop, tablet, and mobile
* Multiple meaningful animations and transitions
* Reuse of the **Week 5 UI Kit**
* Hash-based routing
* Client-side form validation
* Case-study documentation
* Full shopping-flow demonstration video
## Project Structure

```text
storefront/
├── index.html
├── style.css
├── data/
│   └── products.json
└── js/
    ├── api.js
    ├── store.js
    ├── ui.js
    ├── pages.js
    ├── router.js
    └── main.js
```

### File Responsibilities

**`index.html`**
Contains the main application shell, header, hero section, cart drawer, and page mount points.

**`style.css`**
Contains the complete responsive styling, design tokens, layouts, typography, animations, and IF Ateliers visual system.

**`data/products.json`**
Contains the local product catalog, including product names, categories, prices, descriptions, ratings, and product information.

**`js/api.js`**
Loads the local product catalog and maintains an in-memory cache to avoid unnecessary repeated requests.

**`js/store.js`**
Manages cart state, quantity updates, item removal, subtotal calculations, and `localStorage` persistence.

**`js/ui.js`**
Contains the reusable UI component factories developed from the Week 5 UI Kit, including:

* Button
* Product Card
* Modal
* Toast
* Price Tag
* Quantity Stepper

**`js/pages.js`**
Handles rendering for the landing/product listing view, product detail page, and checkout page.

**`js/router.js`**
Implements a lightweight hash-based router for navigation between application views.

**`js/main.js`**
Initializes the application and connects the router, store, UI components, and page rendering logic.

## Pages & Views

### Home / Product Listing

The home route contains a branded hero section followed by the product collection.

It includes:

* IF Ateliers brand introduction
* Hero call-to-action buttons
* Category shortcuts
* Product listing grid
* Search functionality
* Category filtering
* Loading skeleton
* Empty search/filter state

Users can quickly navigate to:

* Kurtis
* Outfits
* Bags

### Product Detail

Each product has its own detail view accessible through the hash router.

The product detail view includes:

* Product image/visual
* Product name
* Category
* Price
* Rating
* Full description
* Quantity selector
* Add-to-cart functionality

Example route:

```text
#/product/:id
```

### Shopping Cart

The cart is available through a slide-out drawer from any page.

Users can:

* Add products
* Remove products
* Increase quantities
* Decrease quantities
* View live item counts
* View the running subtotal

The cart state is automatically saved to `localStorage`.

### Checkout

The checkout page provides a complete frontend checkout flow without real payment processing.

It includes:

* Customer/delivery information form
* Payment information fields
* Client-side validation
* Order summary
* Subtotal calculation
* Shipping calculation
* Tax calculation
* Final total
* Order confirmation screen

Example route:

```text
#/checkout
```

After successful submission, the cart is cleared and a confirmation state is displayed.

## Search & Filtering

Product discovery is handled entirely on the client side.

Users can combine:

* Text search
* Category filtering

Search input is debounced to prevent unnecessary rendering while the user is typing.

If no products match the selected search/filter combination, the interface displays a dedicated empty state instead of leaving the user staring at a sad blank page.

## Cart Persistence

The shopping cart uses `localStorage` to persist its state.

Every cart mutation updates the stored cart data, allowing the cart to survive:

* Page refreshes
* Browser tab closure
* Returning to the application later

This also demonstrates practical frontend state management without relying on an external backend.

## Reusable UI Components

The Capstone reuses the UI component system created during **Week 5** rather than rebuilding common interface elements from scratch.

Reusable components include:

* `Button`
* `ProductCard`
* `Modal`
* `Toast`
* `QtyStepper`
* `PriceTag`

These components are shared across multiple views, including the product listing, product detail, cart drawer, quick-view interface, and checkout experience.

This makes the application easier to maintain and keeps the interface visually consistent.

## Responsive Design

The storefront is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile
* Small phone screens

Responsive behavior includes:

* Flexible product grids
* Single-column mobile layouts
* Full-width mobile cart drawer
* Stacked checkout sections
* Responsive hero content
* Mobile-friendly navigation
* Adaptive spacing and typography

The layout uses **CSS Flexbox and Grid** to create responsive structures without requiring a CSS framework.

## Animations & Transitions

Several meaningful animations were implemented to make the interface feel more polished:

* Staggered product-card entrance
* Hero section entrance animation
* Cart-count bump animation when an item is added
* Slide-in cart drawer
* Page fade transitions during routing
* Product-card hover lift/rotation
* Modal and toast transitions

These animations provide visual feedback without interfering with the shopping experience.

## Brand & Visual Design

**IF Ateliers** uses a minimal modest-fashion aesthetic built around an ivory-and-ink palette with a muted gold accent.

Typography combines:

* **Cormorant Garamond** for headings and display text
* **Inter / Jost** for body text and interface elements

The product catalog represents:

* Kurtis
* Outfits
* Totes
* Clutches
* Crossbody bags

Product visuals use a consistent fashion-focused presentation, with fallback styling to ensure that a missing image does not break the product layout.

## Technologies Used

* HTML5
* CSS3
* Vanilla JavaScript
* JSON
* DOM Manipulation
* CSS Flexbox
* CSS Grid
* LocalStorage API
* Fetch API
* Hash-based Routing
* Client-side Form Validation
* Google Fonts
* Git
* GitHub

No frontend framework or build tool is required.

## Case Study

I built IF Ateliers, a responsive modest-fashion e-commerce storefront featuring kurtis, outfits, and bags, with a complete shopping flow from browsing and filtering to cart management and checkout. The product catalog is loaded from a local JSON file, while search and category filtering run entirely on the client side. A lightweight hash-based router was used to create separate product detail and checkout views without introducing a frontend framework. One of the main technical decisions was reusing the Week 5 UI Kit, allowing the same Button, ProductCard, Modal, Toast, and QtyStepper components to be used across multiple parts of the application. Cart state is managed through a small client-side store and persisted with localStorage so that products and quantities remain available after a page refresh. I also implemented responsive layouts, loading and empty states, client-side checkout validation, and multiple animations to create a polished user experience. Given more time, I would connect the storefront to a real backend or CMS, add real product photography, improve checkout validation and error handling, and introduce automated tests for cart calculations and product filtering.

## Capstone Demo Video

A 2–3 minute walkthrough video demonstrates the complete application flow, including:

1. Opening the storefront
2. Browsing the product collection
3. Searching for products
4. Filtering by category
5. Opening a product detail page
6. Adding a product to the cart
7. Updating the quantity
8. Viewing the cart subtotal
9. Proceeding to checkout
10. Completing the checkout form
11. Refreshing the page to demonstrate `localStorage` cart persistence

The demo video is uploaded to LinkedIn and includes **NeuroFive Solutions** as requested by the internship task.

## Internship

**Organization:** NeuroFive Solutions
**Track:** Frontend Web Development Internship
**Project:** Capstone — Full Frontend Mini App (E-Commerce Storefront)

## Author

**Insharah Irshad**
BS Artificial Intelligence Student
Frontend Development Intern


The project walkthrough video is shared on LinkedIn as part of the Capstone submission, tagging **NeuroFive Solutions**.
