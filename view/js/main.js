// ========================
// MAIN UI HELPERS & OVERLAYS
// ========================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function openModal(id) {
  const el = $(`#${id}`);
  if (el) el.classList.add('open');
}

function closeModal(id) {
  const el = $(`#${id}`);
  if (el) el.classList.remove('open');
}

function showToast(msg, type = '') {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.className = `toast ${type} show`;
  setTimeout(() => t.className = 'toast', 2800);
}

// Modal open/close listeners
$('#modalClose')?.addEventListener('click', () => closeModal('authModal'));
$('#publishClose')?.addEventListener('click', () => closeModal('publishModal'));
$('#publishCancel')?.addEventListener('click', () => closeModal('publishModal'));
$('#skillModalClose')?.addEventListener('click', () => closeModal('skillModal'));

$('#navLoginBtn')?.addEventListener('click', () => {
  const loginTab = $('#authModal')?.querySelector('[data-tab="login"]');
  if (loginTab) loginTab.click();
  openModal('authModal');
});

$('#navRegisterBtn')?.addEventListener('click', () => {
  const regTab = $('#authModal')?.querySelector('[data-tab="register"]');
  if (regTab) regTab.click();
  openModal('authModal');
});

$('#navPublishBtn')?.addEventListener('click', () => openModal('publishModal'));
$('#heroPublishBtn')?.addEventListener('click', () => {
  const navUser = $('#navUser');
  if (navUser && navUser.style.display !== 'none') openModal('publishModal');
  else openModal('authModal');
});

$('#emptyPublishBtn')?.addEventListener('click', () => {
  const navUser = $('#navUser');
  if (navUser && navUser.style.display !== 'none') openModal('publishModal');
  else openModal('authModal');
});

$('#heroExploreBtn')?.addEventListener('click', () => {
  document.querySelector('.filters-bar')?.scrollIntoView({ behavior: 'smooth' });
});

// Close modals on overlay click
$$('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    $('#globalSearch')?.focus();
  }
  if (e.key === 'Escape') {
    $$('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  }
});

// Auto-hide toast after page load
window.addEventListener('DOMContentLoaded', () => {
  const toast = $('#toast');
  if (toast && toast.classList.contains('show')) {
    setTimeout(() => toast.classList.remove('show'), 2800);
  }
});
