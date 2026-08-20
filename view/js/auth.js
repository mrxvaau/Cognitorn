// ========================
// AUTHENTICATION CLIENT VALIDATION (mvc-v3 Pattern)
// ========================

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const targetTab = document.getElementById(`${tab}Tab`);
    if (targetTab) targetTab.classList.add('active');
  });
});

function validateAuth(form) {
  const username = form.username.value.trim();
  const password = form.password.value;
  const errorEl = document.getElementById('loginError');

  if (username === '' || password === '') {
    if (errorEl) errorEl.textContent = 'Please fill in all fields';
    return false;
  }
  return true;
}

function validateRegister(form) {
  const username = form.username.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;
  const errorEl = document.getElementById('regError');

  if (username === '' || email === '' || password === '') {
    if (errorEl) errorEl.textContent = 'Please fill in all fields';
    return false;
  }

  if (password.length < 6) {
    if (errorEl) errorEl.textContent = 'Password must be at least 6 characters';
    return false;
  }

  return true;
}
