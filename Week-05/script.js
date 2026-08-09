/* =====================================================
   1. BUTTON — createButton({ text, variant, size, onClick, disabled })
   ===================================================== */
function createButton({ text, variant = 'primary', size = 'md', onClick, disabled = false }) {
  const btn = document.createElement('button');
  btn.textContent = text;
  btn.className = `ui-btn variant-${variant} size-${size}`;
  btn.disabled = disabled;
  if (onClick) btn.addEventListener('click', onClick);
  return btn;
}

/* =====================================================
   2. CARD — createCard({ emoji, tag, title, description, footer })
   ===================================================== */
function createCard({ emoji, tag, title, description, footer }) {
  const card = document.createElement('div');
  card.className = 'ui-card';
  card.innerHTML = `
    <div class="emoji">${emoji || '◆'}</div>
    ${tag ? `<div class="tag">${tag}</div>` : ''}
    <h3>${title}</h3>
    <p>${description}</p>
    ${footer ? `<div class="card-footer">${footer}</div>` : ''}
  `;
  return card;
}

/* =====================================================
   3. MODAL — createModal({ title, content, confirmText, onConfirm })
   Returns a controller: { open, close }
   ===================================================== */
function createModal({ title, content, confirmText = 'Confirm', onConfirm }) {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';

  const modal = document.createElement('div');
  modal.className = 'ui-modal';
  modal.innerHTML = `<h3>${title}</h3><p>${content}</p>`;

  const actions = document.createElement('div');
  actions.className = 'modal-actions';

  const cancelBtn = createButton({
    text: 'Cancel',
    variant: 'ghost',
    size: 'sm',
    onClick: () => close(),
  });

  const confirmBtn = createButton({
    text: confirmText,
    variant: 'primary',
    size: 'sm',
    onClick: () => {
      if (onConfirm) onConfirm();
      close();
    },
  });

  actions.append(cancelBtn, confirmBtn);
  modal.appendChild(actions);
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });

  function onKeydown(e) {
    if (e.key === 'Escape') close();
  }

  function open() {
    backdrop.classList.add('open');
    document.addEventListener('keydown', onKeydown);
  }

  function close() {
    backdrop.classList.remove('open');
    document.removeEventListener('keydown', onKeydown);
  }

  return { open, close };
}

/* =====================================================
   4. TOAST — a manager whose .show() supports stacking + auto-dismiss
   ===================================================== */
function createToastManager(rootEl) {
  function show({ message, type = 'info', duration = 3200 }) {
    const toast = document.createElement('div');
    toast.className = `ui-toast type-${type}`;
    toast.innerHTML = `<span class="dot"></span><span>${message}</span>`;
    rootEl.appendChild(toast);

    // force reflow so the transition triggers
    requestAnimationFrame(() => toast.classList.add('show'));

    const remove = () => {
      toast.classList.remove('show');
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    };

    const timer = setTimeout(remove, duration);
    toast.addEventListener('click', () => {
      clearTimeout(timer);
      remove();
    });
  }
  return { show };
}
const toast = createToastManager(document.getElementById('toast-root'));

/* =====================================================
   DEMO ASSEMBLY — same functions, different props
   ===================================================== */

// Button variants
const variantRow = document.getElementById('btn-row-variant');
['primary', 'secondary', 'ghost', 'danger'].forEach(variant => {
  variantRow.appendChild(createButton({
    text: variant.charAt(0).toUpperCase() + variant.slice(1),
    variant,
    onClick: () => toast.show({ message: `${variant} button clicked`, type: 'info' }),
  }));
});

// Button sizes
const sizeRow = document.getElementById('btn-row-size');
['sm', 'md', 'lg'].forEach(size => {
  sizeRow.appendChild(createButton({
    text: size.toUpperCase(),
    variant: 'secondary',
    size,
    onClick: () => toast.show({ message: `size=${size} button clicked`, type: 'info' }),
  }));
});

// Button states
const stateRow = document.getElementById('btn-row-state');
stateRow.appendChild(createButton({ text: 'Enabled', variant: 'primary', onClick: () => toast.show({ message: 'Enabled button works', type: 'success' }) }));
stateRow.appendChild(createButton({ text: 'Disabled', variant: 'primary', disabled: true }));

// Cards
const cardGrid = document.getElementById('card-grid');
[
  { emoji: '🔘', tag: 'Component', title: 'Button', description: 'One factory, four variants, three sizes, an enabled/disabled state.', footer: 'createButton(props)' },
  { emoji: '🗂️', tag: 'Component', title: 'Card', description: 'This very card is one call to createCard with a different props object.', footer: 'createCard(props)' },
  { emoji: '🪟', tag: 'Component', title: 'Modal', description: 'Returns an { open, close } controller so multiple modals can coexist.', footer: 'createModal(props)' },
  { emoji: '🔔', tag: 'Component', title: 'Toast', description: 'A manager instance owns the stack; show() just queues a new one.', footer: 'toast.show(props)' },
].forEach(props => cardGrid.appendChild(createCard(props)));

// Modals — two independent instances of the same factory
const deleteModal = createModal({
  title: 'Delete this component?',
  content: 'This removes it from the kit. This action can\u2019t be undone.',
  confirmText: 'Delete',
  onConfirm: () => toast.show({ message: 'Component deleted', type: 'error' }),
});

const publishModal = createModal({
  title: 'Publish to the design system?',
  content: 'This makes the component available to every project on the team.',
  confirmText: 'Publish',
  onConfirm: () => toast.show({ message: 'Component published', type: 'success' }),
});

const modalTriggers = document.getElementById('modal-triggers');
modalTriggers.appendChild(createButton({ text: 'Open delete modal', variant: 'danger', onClick: deleteModal.open }));
modalTriggers.appendChild(createButton({ text: 'Open publish modal', variant: 'secondary', onClick: publishModal.open }));

// Toasts — stacking + variety, same show() call with different props
const toastTriggers = document.getElementById('toast-triggers');
toastTriggers.appendChild(createButton({
  text: 'Show success toast',
  variant: 'primary',
  size: 'sm',
  onClick: () => toast.show({ message: 'Saved successfully', type: 'success' }),
}));
toastTriggers.appendChild(createButton({
  text: 'Show error toast',
  variant: 'danger',
  size: 'sm',
  onClick: () => toast.show({ message: 'Something went wrong', type: 'error', duration: 4000 }),
}));
toastTriggers.appendChild(createButton({
  text: 'Show info toast',
  variant: 'secondary',
  size: 'sm',
  onClick: () => toast.show({ message: 'New version available', type: 'info' }),
}));
toastTriggers.appendChild(createButton({
  text: 'Stack 3 toasts',
  variant: 'ghost',
  size: 'sm',
  onClick: () => {
    toast.show({ message: 'First in the stack', type: 'info' });
    setTimeout(() => toast.show({ message: 'Second in the stack', type: 'success' }), 200);
    setTimeout(() => toast.show({ message: 'Third in the stack', type: 'error' }), 400);
  },
}));