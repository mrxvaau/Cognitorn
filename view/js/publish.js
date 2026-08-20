// ========================
// PUBLISH FORM VALIDATION
// ========================

function validatePublish(form) {
  const name = form.name.value.trim();
  const description = form.description.value.trim();
  const content = form.content.value.trim();
  const errorEl = document.getElementById('pubError');

  if (name === '') {
    if (errorEl) errorEl.textContent = 'Name is required';
    return false;
  }
  if (description === '') {
    if (errorEl) errorEl.textContent = 'Description is required';
    return false;
  }
  if (content === '') {
    if (errorEl) errorEl.textContent = 'Skill content is required';
    return false;
  }

  return true;
}
