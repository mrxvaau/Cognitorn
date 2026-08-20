// ========================
// EXPLORE & SEARCH INTERACTIONS
// ========================

let searchTimer;
const globalSearch = document.getElementById('globalSearch');
const searchForm = document.getElementById('searchForm');

if (globalSearch && searchForm) {
  globalSearch.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      searchForm.submit();
    }, 450);
  });
}
