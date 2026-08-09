# Component Kit — Contact Sheet

A small vanilla-JS UI kit built to practice "thinking in components" before jumping into a framework: four reusable elements — **Button**, **Card**, **Modal**, and **Toast** — each authored as a self-contained factory function that takes props and returns behavior, the same way a React component would.

No framework, no build step, no dependencies beyond Google Fonts. Open `index.html` in a browser and it runs.

## Structure

```
.
├── index.html   # markup + demo page, no inline JS
├── script.js    # all four component factories + demo assembly
└── README.md
```

## Running it

Just open `index.html` in any browser, or serve the folder locally:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Components

Each component is a plain function. Props in, DOM element (or controller) out — nothing hardcoded, nothing reaching into global state.

### `createButton({ text, variant, size, onClick, disabled })`
Returns a `<button>` element.
- `variant`: `'primary' | 'secondary' | 'ghost' | 'danger'` (default `'primary'`)
- `size`: `'sm' | 'md' | 'lg'` (default `'md'`)
- `onClick`: optional click handler
- `disabled`: boolean (default `false`)

```js
createButton({ text: 'Publish', variant: 'primary', onClick: () => console.log('clicked') });
```

### `createCard({ emoji, tag, title, description, footer })`
Returns a `<div>` card element. All fields are optional except `title` and `description`.

```js
createCard({
  emoji: '🔔',
  tag: 'Component',
  title: 'Toast',
  description: 'A manager instance owns the stack; show() just queues a new one.',
  footer: 'toast.show(props)',
});
```

### `createModal({ title, content, confirmText, onConfirm })`
Builds the modal, appends it to `document.body`, and returns a controller: `{ open, close }`. Multiple modal instances can coexist independently. Closes on backdrop click, `Escape`, or the Cancel button.

```js
const deleteModal = createModal({
  title: 'Delete this component?',
  content: "This removes it from the kit. This action can't be undone.",
  confirmText: 'Delete',
  onConfirm: () => console.log('deleted'),
});

deleteModal.open();
```

### `createToastManager(rootEl)` → `{ show }`
A manager bound to a container element. `show()` supports stacking (multiple toasts queue visually) and auto-dismiss.

```js
const toast = createToastManager(document.getElementById('toast-root'));

toast.show({ message: 'Saved successfully', type: 'success' });
toast.show({ message: 'Something went wrong', type: 'error', duration: 4000 });
```
- `type`: `'success' | 'error' | 'info'` (default `'info'`)
- `duration`: ms before auto-dismiss (default `3200`)
- Clicking a toast dismisses it immediately.

## On thinking in components

Earlier tasks got written top-to-bottom: markup first, then a script that reached into specific IDs and wired up whatever the page happened to contain, so a second button or card meant copy-pasting a block and re-editing every reference by hand. Building this kit forced the opposite order — I had to decide each component's contract (its props and its return value) before writing a single line of layout, since the demo page itself is just repeated calls to that contract with different arguments. That separation made state and behavior local: the toast stack, the modal's open/close transition, and each button's variant all live inside the function that owns them instead of being scattered across global handlers. It also made "add one more instance" free — a new card or a differently-worded toast is a one-line call, not a copy-pasted DOM block — which is the same leverage React components are built to give you.
